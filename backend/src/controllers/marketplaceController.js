const { supabase, supabaseAdmin } = require('../config/supabase');

// Browse all products with pagination, search, filter, and sort
exports.browseProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      category = '',
      minPrice = 0,
      maxPrice = 1000000,
      location = '',
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Build query
    let query = supabase
      .from('products')
      .select(`
        *,
        profiles!products_farmer_id_fkey (
          id,
          full_name,
          location
        )
      `, { count: 'exact' })
      .gte('quantity', 1); // Only show in-stock products

    // Apply search filter (name or description)
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply category filter
    if (category) {
      query = query.eq('category', category);
    }

    // Apply price range filter
    query = query.gte('price', parseFloat(minPrice));
    query = query.lte('price', parseFloat(maxPrice));

    // Apply location filter (farmer location)
    if (location) {
      query = query.filter('profiles.location', 'ilike', `%${location}%`);
    }

    // Apply sorting
    const validSortFields = ['created_at', 'price', 'name', 'quantity'];
    const validSortOrders = ['asc', 'desc'];
    
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortDirection = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toLowerCase() === 'asc' : false;

    query = query.order(sortField, { ascending: sortDirection });

    // Apply pagination
    query = query.range(offset, offset + limitNum - 1);

    const { data: products, error, count } = await query;

    if (error) {      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    const totalPages = Math.ceil(count / limitNum);

    res.json({
      products,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: count,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Get a single product by ID with full details
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        profiles!products_farmer_id_fkey (
          id,
          full_name,
          bio,
          location,
          farm_details
        )
      `)
      .eq('id', id)
      .single();

    if (error || !product) {      return res.status(404).json({ error: 'Product not found' });
    }

    // Get average rating for this product
    const { data: ratingData } = await supabase
      .from('product_ratings_summary')
      .select('*')
      .eq('product_id', id)
      .single();

    // Get review count
    const { count: reviewCount } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('product_id', id);

    res.json({
      ...product,
      rating: ratingData || { average_rating: 0, total_reviews: 0 },
      reviewCount: reviewCount || 0
    });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Get all products from a specific farmer
exports.getFarmerProducts = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { includeOutOfStock = false } = req.query;

    let query = supabase
      .from('products')
      .select('*')
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false });

    // Optionally filter out out-of-stock products
    if (includeOutOfStock === 'false' || includeOutOfStock === false) {
      query = query.gte('quantity', 1);
    }

    const { data: products, error } = await query;

    if (error) {      return res.status(500).json({ error: 'Failed to fetch farmer products' });
    }

    res.json({ products });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Get featured/popular products (based on reviews and recent orders)
exports.getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Get products with highest ratings and in stock
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        profiles!products_farmer_id_fkey (
          id,
          full_name,
          location
        )
      `)
      .gte('quantity', 1)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    if (error) {      return res.status(500).json({ error: 'Failed to fetch featured products' });
    }

    // Enhance with rating data
    const productsWithRatings = await Promise.all(
      products.map(async (product) => {
        const { data: ratingData } = await supabase
          .from('product_ratings_summary')
          .select('*')
          .eq('product_id', product.id)
          .single();

        return {
          ...product,
          rating: ratingData || { average_rating: 0, total_reviews: 0 }
        };
      })
    );

    // Sort by rating
    productsWithRatings.sort((a, b) => {
      const ratingDiff = (b.rating.average_rating || 0) - (a.rating.average_rating || 0);
      if (ratingDiff !== 0) return ratingDiff;
      return new Date(b.created_at) - new Date(a.created_at);
    });

    res.json({ products: productsWithRatings });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Get all unique categories
exports.getCategories = async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('category')
      .gte('quantity', 1);

    if (error) {      return res.status(500).json({ error: 'Failed to fetch categories' });
    }

    // Get unique categories and count products in each
    const categoryCounts = {};
    products.forEach(product => {
      if (product.category) {
        categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
      }
    });

    const categories = Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count
    }));

    res.json({ categories });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Search farmers by name or location
exports.searchFarmers = async (req, res) => {
  try {
    const { search = '', location = '', page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Build query for farmers
    // Using supabaseAdmin to bypass RLS policies
    // Note: Temporarily showing all farmers regardless of approval status for debugging
    let query = supabaseAdmin
      .from('profiles')
      .select('id, full_name, bio, location, farm_details, farm_name, years_experience, certifications, avatar_url, banner_url, created_at, approved, role', { count: 'exact' })
      .ilike('role', 'farmer'); // Case-insensitive match
    // Uncomment below to show only approved farmers
    // .eq('approved', true);

    // Apply search filter
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,bio.ilike.%${search}%,farm_details.ilike.%${search}%`);
    }

    // Apply location filter
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    // Pagination
    query = query.range(offset, offset + limitNum - 1);

    console.log('🔍 Fetching farmers from database...');
    const { data: farmers, error, count } = await query;

    if (error) {
      console.error('❌ Error fetching farmers:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to search farmers',
        errorDetails: error.message,
        farmers: []
      });
    }

    console.log(`✅ Found ${farmers?.length || 0} farmers (total: ${count || 0})`);
    
    if (farmers && farmers.length > 0) {
      console.log('📋 Farmers:', farmers.map(f => ({
        id: f.id,
        name: f.full_name,
        approved: f.approved,
        location: f.location
      })));
    } else {
      console.log('⚠️ No farmers found. Checking all profiles...');
      // Debug: Check all profiles using admin client
      const { data: allProfiles, error: allProfilesError } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name, role, approved')
        .limit(20);
      
      if (allProfilesError) {
        console.error('❌ Error fetching all profiles:', allProfilesError);
      } else {
        console.log('📊 All profiles:', allProfiles);
        if (allProfiles && allProfiles.length > 0) {
          const farmerRoles = allProfiles.map(p => p.role).filter(Boolean);
          console.log('📊 Unique roles found:', [...new Set(farmerRoles)]);
          const farmersInList = allProfiles.filter(p => p.role && p.role.toLowerCase() === 'farmer');
          console.log(`📊 Profiles with role containing 'farmer': ${farmersInList.length}`, farmersInList);
        }
      }
    }

    // Handle empty farmers array
    if (!farmers || farmers.length === 0) {
      return res.json({
        success: true,
        farmers: [],
        pagination: {
          currentPage: pageNum,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: limitNum
        }
      });
    }

    // Get product count for each farmer
    console.log(`📦 Processing ${farmers.length} farmers...`);
    const farmersWithProductCount = await Promise.all(
      farmers.map(async (farmer) => {
        const { count: productCount } = await supabaseAdmin
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('farmer_id', farmer.id)
          .gte('quantity', 1);

        // Get farmer rating
        const { data: ratingData } = await supabaseAdmin
          .from('farmer_ratings_summary')
          .select('*')
          .eq('farmer_id', farmer.id)
          .single();

        return {
          ...farmer,
          productCount: productCount || 0,
          rating: ratingData || { average_rating: 0, total_reviews: 0 }
        };
      })
    );

    const totalPages = Math.ceil(count / limitNum);

    res.json({
      success: true,
      farmers: farmersWithProductCount || [],
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: count || 0,
        itemsPerPage: limitNum
      }
    });

  } catch (error) {
    console.error('Search farmers error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      farmers: []
    });
  }
};

// Get farmer profile with products and ratings
exports.getFarmerProfile = async (req, res) => {
  try {
    const { farmerId } = req.params;

    // Get farmer profile
    // Using supabaseAdmin to bypass RLS policies
    // Note: Temporarily removed approved filter for debugging
    const { data: farmer, error: farmerError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, bio, location, farm_details, farm_name, years_experience, certifications, avatar_url, banner_url, created_at, approved, role')
      .eq('id', farmerId)
      .ilike('role', 'farmer') // Case-insensitive match
      // .eq('approved', true) // Uncomment to show only approved farmers
      .single();

    if (farmerError || !farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    // Get farmer's products
    const { data: products } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('farmer_id', farmerId)
      .gte('quantity', 1)
      .order('created_at', { ascending: false });

    // Get farmer rating
    const { data: ratingData } = await supabaseAdmin
      .from('farmer_ratings_summary')
      .select('*')
      .eq('farmer_id', farmerId)
      .single();

    // Get recent reviews
    const { data: reviews } = await supabaseAdmin
      .from('reviews')
      .select(`
        *,
        products (name),
        profiles!reviews_customer_id_fkey (full_name)
      `)
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false })
      .limit(5);

    res.json({
      farmer,
      products: products || [],
      rating: ratingData || { average_rating: 0, total_reviews: 0 },
      recentReviews: reviews || []
    });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

