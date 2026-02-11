const { supabase, supabaseAdmin } = require('../config/supabase');
const { validationResult } = require('express-validator');

const extractStoragePathFromUrl = (imageUrl) => {
  if (!imageUrl) return null;

  try {
    const parsedUrl = new URL(imageUrl);
    const path = decodeURIComponent(parsedUrl.pathname);
    const marker = '/product-images/';
    const index = path.indexOf(marker);

    if (index === -1) return null;

    return path.slice(index + marker.length);
  } catch (error) {
    return null;
  }
};

/**
 * Create a new product
 * POST /api/products
 */
const createProduct = async (req, res, next) => {
  try {
    console.log('📝 [PRODUCT] Step 1: Create product request received');
    
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ [PRODUCT] Validation failed:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const farmerId = req.user.id;
    const { name, category, description, price, quantity, harvestLocation, imageUrl } = req.body;

    console.log('🌾 [PRODUCT] Step 2: Creating product for farmer:', farmerId);

    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .insert({
        farmer_id: farmerId,
        name,
        category,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        harvest_location: harvestLocation,
        image_url: imageUrl,
        status: 'active'
      })
      .select()
      .single();

    if (productError) {
      console.error('❌ [PRODUCT] Step 2: Product creation error:', productError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to create product',
        error: productError.message
      });
    }

    console.log('✅ [PRODUCT] Product created successfully:', product.id);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('❌ [PRODUCT] Unexpected error:', error.message);
    next(error);
  }
};

/**
 * Get all products for a farmer
 * GET /api/products/farmer/:farmerId
 */
const getFarmerProducts = async (req, res, next) => {
  try {
    console.log('📝 [PRODUCT] Get farmer products request');
    
    const farmerId = req.params.farmerId || req.user.id;

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false });

    if (productsError) {
      console.error('❌ [PRODUCT] Error fetching products:', productsError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: productsError.message
      });
    }

    console.log('✅ [PRODUCT] Fetched', products.length, 'products for farmer:', farmerId);

    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: {
        products,
        count: products.length
      }
    });
  } catch (error) {
    console.error('❌ [PRODUCT] Unexpected error:', error.message);
    next(error);
  }
};

/**
 * Get all products (with optional filters)
 * GET /api/products?category=vegetables&status=active
 */
const getAllProducts = async (req, res, next) => {
  try {
    console.log('📝 [PRODUCT] Get all products request');
    
    const { category, status, search } = req.query;

    // Build query with join to get farmer information
    // Using supabaseAdmin to bypass RLS and ensure we get farmer data
    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        profiles!products_farmer_id_fkey (
          id,
          full_name,
          location
        )
      `)
      .eq('status', 'active');

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    query = query.order('created_at', { ascending: false });

    const { data: products, error: productsError } = await query;

    if (productsError) {
      console.error('❌ [PRODUCT] Error fetching products:', productsError.message);
      // Try without join if join fails
      console.log('🔄 Retrying without join...');
      const { data: productsSimple, error: simpleError } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (simpleError) {
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch products',
          error: simpleError.message
        });
      }
      
      // Manually fetch farmer data for each product
      const productsWithFarmers = await Promise.all(
        (productsSimple || []).map(async (product) => {
          const { data: farmer } = await supabaseAdmin
            .from('profiles')
            .select('full_name, location')
            .eq('id', product.farmer_id)
            .single();
          
          return {
            ...product,
            profiles: farmer || null
          };
        })
      );
      
      console.log('✅ [PRODUCT] Fetched', productsWithFarmers.length, 'products (with manual farmer fetch)');
      
      return res.status(200).json({
        success: true,
        message: 'Products fetched successfully',
        data: {
          products: productsWithFarmers || [],
          count: productsWithFarmers?.length || 0
        }
      });
    }

    console.log('✅ [PRODUCT] Fetched', products.length, 'products');
    
    // Log first product to debug farmer data
    if (products && products.length > 0) {
      console.log('🔍 Sample product farmer data:', {
        productName: products[0].name,
        farmerId: products[0].farmer_id,
        profiles: products[0].profiles
      });
    }

    // Fetch ratings for all products
    const productIds = products.map(p => p.id);
    const { data: ratingsData } = await supabaseAdmin
      .from('product_ratings_summary')
      .select('product_id, average_rating, total_reviews')
      .in('product_id', productIds);
    
    // Create a map of product_id -> rating data
    const ratingsMap = new Map(
      (ratingsData || []).map(r => [r.product_id, { 
        rating: r.average_rating ? r.average_rating.toFixed(1) : '0.0', 
        reviews: r.total_reviews || 0 
      }])
    );
    
    // Add ratings to products
    const productsWithRatings = products.map(product => ({
      ...product,
      rating: ratingsMap.get(product.id)?.rating || '0.0',
      reviews: ratingsMap.get(product.id)?.reviews || 0
    }));

    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: {
        products: productsWithRatings || [],
        count: productsWithRatings?.length || 0
      }
    });
  } catch (error) {
    console.error('❌ [PRODUCT] Unexpected error:', error.message);
    next(error);
  }
};

/**
 * Get single product by ID
 * GET /api/products/:id
 */
const getProduct = async (req, res, next) => {
  try {
    console.log('📝 [PRODUCT] Get product by ID:', req.params.id);
    
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (productError) {
      console.error('❌ [PRODUCT] Product not found');
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    console.log('✅ [PRODUCT] Product fetched:', product.id);

    res.status(200).json({
      success: true,
      message: 'Product fetched successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('❌ [PRODUCT] Unexpected error:', error.message);
    next(error);
  }
};

/**
 * Update product
 * PUT /api/products/:id
 */
const updateProduct = async (req, res, next) => {
  try {
    console.log('📝 [PRODUCT] Update product request:', req.params.id);
    
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const farmerId = req.user.id;
    const productId = req.params.id;

    // Check if product belongs to the farmer
    console.log('🔍 [PRODUCT] Step 1: Verifying ownership');
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('farmer_id, image_url')
      .eq('id', productId)
      .single();

    if (fetchError || !existingProduct) {
      console.error('❌ [PRODUCT] Product not found');
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (existingProduct.farmer_id !== farmerId) {
      console.error('❌ [PRODUCT] Unauthorized: Farmer ID mismatch');
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this product'
      });
    }

    const { name, category, description, price, quantity, harvestLocation, imageUrl, status } = req.body;

    console.log('📝 [PRODUCT] Step 2: Updating product');

    const { data: updatedProduct, error: updateError } = await supabaseAdmin
      .from('products')
      .update({
        name,
        category,
        description,
        price: price ? parseFloat(price) : undefined,
        quantity: quantity ? parseInt(quantity) : undefined,
        harvest_location: harvestLocation,
        image_url: imageUrl,
        status: status || 'active'
      })
      .eq('id', productId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ [PRODUCT] Update error:', updateError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to update product',
        error: updateError.message
      });
    }

    console.log('✅ [PRODUCT] Product updated successfully');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product: updatedProduct
      }
    });
  } catch (error) {
    console.error('❌ [PRODUCT] Unexpected error:', error.message);
    next(error);
  }
};

/**
 * Delete product
 * DELETE /api/products/:id
 */
const deleteProduct = async (req, res, next) => {
  try {
    console.log('📝 [PRODUCT] Delete product request:', req.params.id);
    
    const farmerId = req.user.id;
    const productId = req.params.id;

    // Check if product belongs to the farmer
    console.log('🔍 [PRODUCT] Verifying ownership');
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('farmer_id')
      .eq('id', productId)
      .single();

    if (fetchError || !existingProduct) {
      console.error('❌ [PRODUCT] Product not found');
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (existingProduct.farmer_id !== farmerId) {
      console.error('❌ [PRODUCT] Unauthorized: Farmer ID mismatch');
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this product'
      });
    }

    const { error: deleteError } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', productId);

    if (deleteError) {
      console.error('❌ [PRODUCT] Delete error:', deleteError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete product',
        error: deleteError.message
      });
    }

    let imageDeleteWarning = null;
    const imagePath = extractStoragePathFromUrl(existingProduct.image_url);

    if (imagePath) {
      const { error: imageDeleteError } = await supabaseAdmin
        .storage
        .from('product-images')
        .remove([imagePath]);

      if (imageDeleteError) {
        imageDeleteWarning = imageDeleteError.message;
        console.error('⚠️ [PRODUCT] Image delete warning:', imageDeleteError.message);
      } else {
        console.log('✅ [PRODUCT] Product image deleted:', imagePath);
      }
    }

    console.log('✅ [PRODUCT] Product deleted successfully');

    res.status(200).json({
      success: true,
      message: imageDeleteWarning
        ? 'Product deleted successfully (image cleanup failed)'
        : 'Product deleted successfully',
      warning: imageDeleteWarning || undefined
    });
  } catch (error) {
    console.error('❌ [PRODUCT] Unexpected error:', error.message);
    next(error);
  }
};

/**
 * Get farmer dashboard stats
 * GET /api/products/dashboard/stats
 */
const getDashboardStats = async (req, res, next) => {
  try {
    console.log('📊 [DASHBOARD] Get farmer dashboard stats');
    
    const farmerId = req.user.id;

    // Get total products count
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, quantity, price')
      .eq('farmer_id', farmerId);

    if (productsError) {
      console.error('❌ [DASHBOARD] Error fetching products');
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard stats'
      });
    }

    // Calculate stats
    const totalProducts = products.length;
    const totalInventory = products.reduce((sum, p) => sum + p.quantity, 0);
    const activeProducts = products.filter(p => p.quantity > 0).length;
    const outOfStock = products.filter(p => p.quantity === 0).length;

    console.log('✅ [DASHBOARD] Stats calculated successfully');

    res.status(200).json({
      success: true,
      message: 'Dashboard stats fetched successfully',
      data: {
        stats: {
          totalProducts,
          activeProducts,
          outOfStock,
          totalInventory,
          farmerId
        }
      }
    });
  } catch (error) {
    console.error('❌ [DASHBOARD] Unexpected error:', error.message);
    next(error);
  }
};

module.exports = {
  createProduct,
  getFarmerProducts,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getDashboardStats
};
