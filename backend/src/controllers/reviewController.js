const { supabase, supabaseAdmin } = require('../config/supabase');
const { validationResult } = require('express-validator');

/**
 * Check if user has purchased a product
 */
const checkVerifiedPurchase = async (customerId, productId) => {
  // Check if user has a completed order containing this product
  const { data: orderItems, error } = await supabaseAdmin
    .from('order_items')
    .select(`
      id,
      orders!inner (
        id,
        customer_id,
        status
      )
    `)
    .eq('product_id', productId)
    .eq('orders.customer_id', customerId)
    .in('orders.status', ['completed', 'delivered']);

  if (error) {
    console.error('Error checking purchase:', error);
    return false;
  }

  return orderItems && orderItems.length > 0;
};

/**
 * Create a review
 * POST /api/reviews
 */
const createReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const customerId = req.user.id;
    const userRole = req.user.role;
    const { productId, farmerId, orderItemId, rating, comment } = req.body;

    // Farmer ID and rating are required, product ID is optional (for general farmer reviews)
    if (!farmerId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Farmer ID and rating are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check verified purchase if productId is provided
    let verifiedPurchase = false;
    if (productId) {
      verifiedPurchase = await checkVerifiedPurchase(customerId, productId);
      
      // TODO: Re-enable this check after implementing payment/delivery
      // For testing purposes, allow reviews without verified purchase
      // if (!verifiedPurchase) {
      //   return res.status(403).json({
      //     success: false,
      //     message: 'You can only review products you have purchased'
      //   });
      // }

      // Check if customer already reviewed this product
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('product_id', productId)
        .eq('customer_id', customerId)
        .single();

      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: 'You have already reviewed this product'
        });
      }
    }

    // Prevent farmers from reviewing their own products
    if (productId) {
      const { data: product } = await supabase
        .from('products')
        .select('farmer_id')
        .eq('id', productId)
        .single();

      if (product && product.farmer_id === customerId) {
        return res.status(403).json({
          success: false,
          message: 'You cannot review your own product'
        });
      }
    }

    console.log('Creating review with data:', {
      product_id: productId,
      farmer_id: farmerId,
      customer_id: customerId,
      rating: Number(rating),
      comment: comment
    });

    const { data: review, error } = await supabaseAdmin
      .from('reviews')
      .insert({
        product_id: productId || null,
        farmer_id: farmerId,
        customer_id: customerId,
        rating: Number(rating),
        comment: comment || null
      })
      .select()
      .single();

    if (error) {
      console.error('Review creation error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return res.status(500).json({
        success: false,
        message: 'Failed to create review: ' + error.message,
        error: error.message,
        details: error.details || error.hint
      });
    }

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Review error:', error);
    next(error);
  }
};

/**
 * Get reviews for a product
 * GET /api/reviews/product/:productId
 */
const getProductReviews = async (req, res, next) => {
  try {    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', req.params.productId)
      .order('created_at', { ascending: false });

    if (!error && reviews) {
      const customerIds = [...new Set(reviews.map(r => r.customer_id))];
      const { data: customers } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', customerIds);

      const customerMap = new Map(customers?.map(c => [c.id, c.full_name]) || []);
      reviews.forEach(review => {
        review.customer_name = customerMap.get(review.customer_id) || 'Anonymous';
      });
    }

    if (error) {      return res.status(500).json({
        success: false,
        message: 'Failed to fetch reviews',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reviews fetched successfully',
      data: {
        reviews,
        count: reviews.length
      }
    });
  } catch (error) {    next(error);
  }
};

/**
 * Get reviews for a farmer
 * GET /api/reviews/farmer/:farmerId
 */
const getFarmerReviews = async (req, res, next) => {
  try {    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*, products(name)')
      .eq('farmer_id', req.params.farmerId)
      .order('created_at', { ascending: false });

    if (!error && reviews) {
      const customerIds = [...new Set(reviews.map(r => r.customer_id))];
      const { data: customers } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', customerIds);

      const customerMap = new Map(customers?.map(c => [c.id, c.full_name]) || []);
      reviews.forEach(review => {
        review.customer_name = customerMap.get(review.customer_id) || 'Anonymous';
      });
    }

    if (error) {      return res.status(500).json({
        success: false,
        message: 'Failed to fetch farmer reviews',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Farmer reviews fetched successfully',
      data: {
        reviews,
        count: reviews.length
      }
    });
  } catch (error) {    next(error);
  }
};

/**
 * Get product rating summary
 * GET /api/reviews/product/:productId/summary
 */
const getProductRatingSummary = async (req, res, next) => {
  try {    const { data: summary, error } = await supabase
      .from('product_ratings_summary')
      .select('*')
      .eq('product_id', req.params.productId)
      .single();

    if (error) {      return res.status(500).json({
        success: false,
        message: 'Failed to fetch rating summary',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Rating summary fetched successfully',
      data: {
        summary: summary || {
          product_id: req.params.productId,
          total_reviews: 0,
          average_rating: 0,
          min_rating: null,
          max_rating: null
        }
      }
    });
  } catch (error) {    next(error);
  }
};

/**
 * Get farmer rating summary
 * GET /api/reviews/farmer/:farmerId/summary
 */
const getFarmerRatingSummary = async (req, res, next) => {
  try {    const { data: summary, error } = await supabase
      .from('farmer_ratings_summary')
      .select('*')
      .eq('farmer_id', req.params.farmerId)
      .single();

    if (error) {      return res.status(500).json({
        success: false,
        message: 'Failed to fetch farmer rating summary',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Farmer rating summary fetched successfully',
      data: {
        summary: summary || {
          farmer_id: req.params.farmerId,
          total_reviews: 0,
          average_rating: 0,
          min_rating: null,
          max_rating: null
        }
      }
    });
  } catch (error) {    next(error);
  }
};

/**
 * Update review
 * PUT /api/reviews/:id
 */
const updateReview = async (req, res, next) => {
  try {    const customerId = req.user.id;
    const { rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: 'Rating is required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check ownership
    const { data: review } = await supabase
      .from('reviews')
      .select('customer_id')
      .eq('id', req.params.id)
      .single();

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.customer_id !== customerId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this review'
      });
    }

    const { data: updatedReview, error } = await supabaseAdmin
      .from('reviews')
      .update({
        rating: Number(rating),
        comment: comment || null
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {      return res.status(500).json({
        success: false,
        message: 'Failed to update review'
      });
    }    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: {
        review: updatedReview
      }
    });
  } catch (error) {    next(error);
  }
};

/**
 * Delete review
 * DELETE /api/reviews/:id
 */
const deleteReview = async (req, res, next) => {
  try {    const customerId = req.user.id;

    // Check ownership
    const { data: review } = await supabase
      .from('reviews')
      .select('customer_id')
      .eq('id', req.params.id)
      .single();

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.customer_id !== customerId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this review'
      });
    }

    const { error } = await supabaseAdmin
      .from('reviews')
      .delete()
      .eq('id', req.params.id);

    if (error) {      return res.status(500).json({
        success: false,
        message: 'Failed to delete review'
      });
    }    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {    next(error);
  }
};

/**
 * Check if user can review a product
 * GET /api/reviews/can-review/:productId
 */
const canReviewProduct = async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const { productId } = req.params;

    // Check if user has purchased this product
    const verifiedPurchase = await checkVerifiedPurchase(customerId, productId);

    if (!verifiedPurchase) {
      return res.status(200).json({
        success: true,
        data: {
          canReview: false,
          reason: 'You must purchase this product before you can review it'
        }
      });
    }

    // Check if user already reviewed this product
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id, rating, comment, created_at')
      .eq('product_id', productId)
      .eq('customer_id', customerId)
      .single();

    if (existingReview) {
      return res.status(200).json({
        success: true,
        data: {
          canReview: false,
          reason: 'You have already reviewed this product',
          existingReview
        }
      });
    }

    // Check if user is the product owner
    const { data: product } = await supabase
      .from('products')
      .select('farmer_id')
      .eq('id', productId)
      .single();

    if (product && product.farmer_id === customerId) {
      return res.status(200).json({
        success: true,
        data: {
          canReview: false,
          reason: 'You cannot review your own product'
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        canReview: true,
        verifiedPurchase: true
      }
    });
  } catch (error) {
    console.error('Can review check error:', error);
    next(error);
  }
};

/**
 * Get user's purchased products that can be reviewed
 * GET /api/reviews/my-reviewable-products
 */
const getReviewableProducts = async (req, res, next) => {
  try {
    const customerId = req.user.id;

    // Get all completed order items for this customer
    const { data: orderItems, error } = await supabaseAdmin
      .from('order_items')
      .select(`
        id,
        product_id,
        products (
          id,
          name,
          image_url,
          farmer_id,
          profiles!products_farmer_id_fkey (
            full_name
          )
        ),
        orders!inner (
          id,
          status,
          created_at
        )
      `)
      .eq('orders.customer_id', customerId)
      .in('orders.status', ['completed', 'delivered']);

    if (error) {
      console.error('Error fetching reviewable products:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch reviewable products'
      });
    }

    // Get existing reviews by this customer
    const { data: existingReviews } = await supabase
      .from('reviews')
      .select('product_id')
      .eq('customer_id', customerId);

    const reviewedProductIds = new Set((existingReviews || []).map(r => r.product_id));

    // Filter and format products
    const reviewableProducts = (orderItems || [])
      .filter(item => item.products && !reviewedProductIds.has(item.product_id))
      .map(item => ({
        orderItemId: item.id,
        productId: item.product_id,
        productName: item.products.name,
        productImage: item.products.image_url,
        farmerId: item.products.farmer_id,
        farmerName: item.products.profiles?.full_name || 'Farmer',
        orderDate: item.orders.created_at
      }));

    // Remove duplicates (same product from multiple orders)
    const uniqueProducts = Array.from(
      new Map(reviewableProducts.map(p => [p.productId, p])).values()
    );

    res.status(200).json({
      success: true,
      data: {
        products: uniqueProducts,
        count: uniqueProducts.length
      }
    });
  } catch (error) {
    console.error('Reviewable products error:', error);
    next(error);
  }
};

module.exports = {
  createReview,
  getProductReviews,
  getFarmerReviews,
  getProductRatingSummary,
  getFarmerRatingSummary,
  updateReview,
  deleteReview,
  canReviewProduct,
  getReviewableProducts
};

