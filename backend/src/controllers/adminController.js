const { supabaseAdmin } = require('../config/supabase');

/**
 * Get all users
 * GET /api/admin/users
 */
const getAllUsers = async (req, res, next) => {
  try {
    console.log('🔍 getAllUsers called by:', req.user?.email);
    
    const { data: users, error } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, phone, role, approved, suspended, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase query error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch users',
        error: error.message
      });
    }

    console.log('✅ Successfully fetched', users?.length || 0, 'users');
    
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: {
        users,
        count: users?.length || 0,
        farmers: users?.filter(u => u.role === 'farmer')?.length || 0,
        customers: users?.filter(u => u.role === 'customer')?.length || 0
      }
    });
  } catch (error) {
    console.error('❌ getAllUsers error:', error);
    next(error);
  }
};

/**
 * Get all pending farmers
 * GET /api/admin/farmers/pending
 */
const getPendingFarmers = async (req, res, next) => {
  try {    const { data: farmers, error } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, phone, role, approved, created_at, updated_at')
      .eq('role', 'farmer')
      .eq('approved', false)
      .order('created_at', { ascending: true });

    if (error) {      return res.status(500).json({
        success: false,
        message: 'Failed to fetch pending farmers',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pending farmers fetched successfully',
      data: {
        farmers,
        count: farmers.length
      }
    });
  } catch (error) {    next(error);
  }
};

/**
 * Approve farmer
 * PATCH /api/admin/farmers/:id/approve
 */
const approveFarmer = async (req, res, next) => {
  try {
    const farmerId = req.params.id;    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ approved: true })
      .eq('id', farmerId)
      .select()
      .single();

    if (profileError || !profile) {      return res.status(404).json({
        success: false,
        message: 'Farmer profile not found'
      });
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(farmerId);

    if (userError) {      return res.status(500).json({
        success: false,
        message: 'Failed to update auth user',
        error: userError.message
      });
    }

    const existingMetadata = userData?.user?.user_metadata || {};

    const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(farmerId, {
      user_metadata: {
        ...existingMetadata,
        role: 'farmer',
        approved: true
      }
    });

    if (updateAuthError) {      return res.status(500).json({
        success: false,
        message: 'Failed to update auth user metadata',
        error: updateAuthError.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Farmer approved successfully',
      data: {
        farmer: profile
      }
    });
  } catch (error) {    next(error);
  }
};

/**
 * Reject farmer
 * PATCH /api/admin/farmers/:id/reject
 */
const rejectFarmer = async (req, res, next) => {
  try {
    const farmerId = req.params.id;    const { error: deleteProfileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', farmerId);

    if (deleteProfileError) {      return res.status(500).json({
        success: false,
        message: 'Failed to delete farmer profile',
        error: deleteProfileError.message
      });
    }

    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(farmerId);

    if (deleteAuthError) {      return res.status(500).json({
        success: false,
        message: 'Failed to delete auth user',
        error: deleteAuthError.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Farmer rejected and removed successfully'
    });
  } catch (error) {    next(error);
  }
};

/**
 * Get dashboard analytics overview
 * GET /api/admin/analytics/dashboard
 */
const getDashboardAnalytics = async (req, res, next) => {
  try {    // Get total counts
    const { count: totalUsers } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: totalFarmers } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'farmer');

    const { count: totalCustomers } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'customer');

    const { count: totalProducts } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true });

    const { count: totalOrders } = await supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact', head: true });

    const { count: totalReviews } = await supabaseAdmin
      .from('reviews')
      .select('*', { count: 'exact', head: true });

    // Calculate total revenue (paid, processing, shipped, completed orders)
    const { data: orders } = await supabaseAdmin
      .from('orders')
      .select('total_amount')
      .in('status', ['paid', 'processing', 'shipped', 'completed']);

    const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0;

    // Get pending farmers count
    const { count: pendingFarmers } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'farmer')
      .eq('approved', false);

    // Get low stock products count
    const { data: lowStockProducts } = await supabaseAdmin
      .from('products')
      .select('id, quantity, stock_alert_threshold, low_stock_alert_enabled')
      .eq('low_stock_alert_enabled', true);

    const lowStockCount = lowStockProducts?.filter(
      p => p.quantity <= p.stock_alert_threshold
    ).length || 0;

    // Recent activity counts (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoISO = thirtyDaysAgo.toISOString();

    const { count: newUsersLast30Days } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgoISO);

    const { count: newOrdersLast30Days } = await supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgoISO);

    const { count: newProductsLast30Days } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgoISO);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalFarmers,
          totalCustomers,
          totalProducts,
          totalOrders,
          totalReviews,
          totalRevenue: parseFloat(totalRevenue.toFixed(2)),
          pendingFarmers,
          lowStockProducts: lowStockCount
        },
        recentActivity: {
          newUsersLast30Days,
          newOrdersLast30Days,
          newProductsLast30Days
        }
      }
    });
  } catch (error) {    next(error);
  }
};

/**
 * Get revenue analytics
 * GET /api/admin/analytics/revenue
 */
const getRevenueAnalytics = async (req, res, next) => {
  try {
    const { period = 'monthly', limit = 12 } = req.query;    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('created_at, total_amount, payment_status')
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: true });

    if (error) {      return res.status(500).json({
        success: false,
        message: 'Failed to fetch revenue data',
        error: error.message
      });
    }

    // Group by period
    const revenueByPeriod = {};
    
    orders.forEach(order => {
      const date = new Date(order.created_at);
      let periodKey;

      if (period === 'daily') {
        periodKey = date.toISOString().split('T')[0];
      } else if (period === 'weekly') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        periodKey = weekStart.toISOString().split('T')[0];
      } else { // monthly
        periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      if (!revenueByPeriod[periodKey]) {
        revenueByPeriod[periodKey] = {
          period: periodKey,
          revenue: 0,
          orderCount: 0
        };
      }

      revenueByPeriod[periodKey].revenue += parseFloat(order.total_amount);
      revenueByPeriod[periodKey].orderCount += 1;
    });

    // Convert to array and sort
    const revenueData = Object.values(revenueByPeriod)
      .sort((a, b) => a.period.localeCompare(b.period))
      .slice(-parseInt(limit))
      .map(item => ({
        ...item,
        revenue: parseFloat(item.revenue.toFixed(2))
      }));

    res.status(200).json({
      success: true,
      data: {
        period,
        revenueData,
        totalRevenue: parseFloat(revenueData.reduce((sum, d) => sum + d.revenue, 0).toFixed(2)),
        totalOrders: revenueData.reduce((sum, d) => sum + d.orderCount, 0)
      }
    });
  } catch (error) {    next(error);
  }
};

/**
 * Get user statistics
 * GET /api/admin/analytics/users
 */
const getUserStatistics = async (req, res, next) => {
  try {
    // Get all user profiles
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email, phone, role, approved, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user profiles',
        error: error.message
      });
    }

    // Calculate user statistics
    const userStats = {
      byRole: {
        customer: 0,
        farmer: 0,
        admin: 0
      },
      farmerStatus: {
        approved: 0,
        pending: 0
      },
      registrationTrend: {}
    };

    profiles?.forEach(profile => {
      // Count by role
      if (profile.role) {
        userStats.byRole[profile.role] = (userStats.byRole[profile.role] || 0) + 1;
      }

      // Count farmer approval status
      if (profile.role === 'farmer') {
        if (profile.approved) {
          userStats.farmerStatus.approved += 1;
        } else {
          userStats.farmerStatus.pending += 1;
        }
      }

      // Registration trend (by month)
      const date = new Date(profile.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      userStats.registrationTrend[monthKey] = (userStats.registrationTrend[monthKey] || 0) + 1;
    });

    // Convert trend to array
    const registrationTrend = Object.entries(userStats.registrationTrend)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12);

    res.status(200).json({
      success: true,
      data: {
        ...userStats,
        registrationTrend,
        totalUsers: profiles?.length || 0,
        users: profiles || []
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product statistics
 * GET /api/admin/analytics/products
 */
const getProductStatistics = async (req, res, next) => {
  try {    const { data: products } = await supabaseAdmin
      .from('products')
      .select('category, quantity, price, created_at');

    const productStats = {
      byCategory: {},
      stockStatus: {
        inStock: 0,
        lowStock: 0,
        outOfStock: 0
      },
      priceRange: {
        min: 0,
        max: 0,
        average: 0
      },
      totalProducts: products?.length || 0,
      totalStockValue: 0
    };

    let totalPrice = 0;
    let minPrice = Infinity;
    let maxPrice = 0;

    products?.forEach(product => {
      // Category distribution
      if (product.category) {
        productStats.byCategory[product.category] = 
          (productStats.byCategory[product.category] || 0) + 1;
      }

      // Stock status
      if (product.quantity === 0) {
        productStats.stockStatus.outOfStock += 1;
      } else if (product.quantity <= 5) {
        productStats.stockStatus.lowStock += 1;
      } else {
        productStats.stockStatus.inStock += 1;
      }

      // Price range
      const price = parseFloat(product.price);
      totalPrice += price;
      minPrice = Math.min(minPrice, price);
      maxPrice = Math.max(maxPrice, price);

      // Total stock value
      productStats.totalStockValue += product.quantity;
    });

    productStats.priceRange = {
      min: parseFloat(minPrice.toFixed(2)),
      max: parseFloat(maxPrice.toFixed(2)),
      average: parseFloat((totalPrice / (products?.length || 1)).toFixed(2))
    };

    res.status(200).json({
      success: true,
      data: productStats
    });
  } catch (error) {    next(error);
  }
};

/**
 * Get order statistics
 * GET /api/admin/analytics/orders
 */
const getOrderStatistics = async (req, res, next) => {
  try {    const { data: orders } = await supabaseAdmin
      .from('orders')
      .select('status, payment_status, total_amount, created_at');

    const orderStats = {
      byStatus: {},
      byPaymentStatus: {},
      totalOrders: orders?.length || 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      orderTrend: {}
    };

    let totalAmount = 0;

    orders?.forEach(order => {
      // Status distribution
      if (order.status) {
        orderStats.byStatus[order.status] = 
          (orderStats.byStatus[order.status] || 0) + 1;
      }

      // Payment status
      if (order.payment_status) {
        orderStats.byPaymentStatus[order.payment_status] = 
          (orderStats.byPaymentStatus[order.payment_status] || 0) + 1;
      }

      // Revenue calculation
      const amount = parseFloat(order.total_amount);
      totalAmount += amount;

      // Order trend by month
      const date = new Date(order.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!orderStats.orderTrend[monthKey]) {
        orderStats.orderTrend[monthKey] = { month: monthKey, orders: 0, revenue: 0 };
      }
      
      orderStats.orderTrend[monthKey].orders += 1;
      orderStats.orderTrend[monthKey].revenue += amount;
    });

    orderStats.totalRevenue = parseFloat(totalAmount.toFixed(2));
    orderStats.averageOrderValue = parseFloat((totalAmount / (orders?.length || 1)).toFixed(2));

    // Convert trend to array
    const orderTrend = Object.values(orderStats.orderTrend)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12)
      .map(item => ({
        ...item,
        revenue: parseFloat(item.revenue.toFixed(2))
      }));

    res.status(200).json({
      success: true,
      data: {
        ...orderStats,
        orderTrend
      }
    });
  } catch (error) {    next(error);
  }
};

/**
 * Get recent activity logs
 * GET /api/admin/analytics/activity
 */
const getRecentActivity = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;    // Get recent orders
    const { data: recentOrders } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        created_at,
        total_amount,
        status,
        profiles!orders_customer_id_fkey (full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit) / 3);

    // Get recent products
    const { data: recentProducts } = await supabaseAdmin
      .from('products')
      .select(`
        id,
        name,
        created_at,
        profiles!products_farmer_id_fkey (full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit) / 3);

    // Get recent reviews
    const { data: recentReviews } = await supabaseAdmin
      .from('reviews')
      .select(`
        id,
        rating,
        created_at,
        profiles!reviews_customer_id_fkey (full_name),
        products (name)
      `)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit) / 3);

    // Combine and sort all activities
    const activities = [
      ...(recentOrders?.map(order => ({
        type: 'order',
        id: order.id,
        timestamp: order.created_at,
        description: `${order.profiles?.full_name || 'User'} placed an order ($${order.total_amount})`,
        status: order.status
      })) || []),
      ...(recentProducts?.map(product => ({
        type: 'product',
        id: product.id,
        timestamp: product.created_at,
        description: `${product.profiles?.full_name || 'Farmer'} added product: ${product.name}`
      })) || []),
      ...(recentReviews?.map(review => ({
        type: 'review',
        id: review.id,
        timestamp: review.created_at,
        description: `${review.profiles?.full_name || 'User'} reviewed ${review.products?.name || 'a product'} (${review.rating}⭐)`
      })) || [])
    ];

    // Sort by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.status(200).json({
      success: true,
      data: {
        activities: activities.slice(0, parseInt(limit)),
        count: activities.length
      }
    });
  } catch (error) {    next(error);
  }
};

/**
 * Promote a user to admin role (TEMPORARY - for initial setup)
 * POST /api/auth/promote-admin
 * Body: { email, secret }
 */
const promoteToAdmin = async (req, res, next) => {
  try {
    const { email, secret } = req.body;

    // Simple secret check - you can change this
    if (secret !== 'ADMIN_SETUP_2026') {
      return res.status(403).json({
        success: false,
        message: 'Invalid secret'
      });
    }

    // Get user by email
    const { data: users, error: fetchError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (fetchError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch users',
        error: fetchError.message
      });
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ role: 'admin', approved: true })
      .eq('id', user.id);

    if (profileError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: profileError.message
      });
    }

    // Update auth metadata
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        role: 'admin',
        approved: true
      }
    });

    if (authError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update auth metadata',
        error: authError.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'User promoted to admin successfully',
      data: {
        id: user.id,
        email: user.email,
        role: 'admin'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Promote a user to admin role by user id
 * PATCH /api/admin/users/:id/promote
 */
const promoteUserToAdmin = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, role')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (profile.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'User is already an admin'
      });
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (userError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch auth user',
        error: userError.message
      });
    }

    const existingMetadata = userData?.user?.user_metadata || {};

    const { error: updateProfileError } = await supabaseAdmin
      .from('profiles')
      .update({ role: 'admin', approved: true })
      .eq('id', userId);

    if (updateProfileError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: updateProfileError.message
      });
    }

    const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...existingMetadata,
        role: 'admin',
        approved: true
      }
    });

    if (updateAuthError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update auth metadata',
        error: updateAuthError.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'User promoted to admin successfully',
      data: {
        id: userId,
        full_name: profile.full_name,
        role: 'admin'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get detailed view of a specific user
 * GET /api/admin/users/:id
 */
const viewUserDetails = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Get user profile details
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's products (if farmer)
    let products = [];
    if (profile.role === 'farmer') {
      const { data: farmerProducts } = await supabaseAdmin
        .from('products')
        .select('id, name, price, quantity, category, created_at')
        .eq('farmer_id', userId);
      products = farmerProducts || [];
    }

    // Get user's orders (if customer)
    let orders = [];
    if (profile.role === 'customer') {
      const { data: customerOrders } = await supabaseAdmin
        .from('orders')
        .select('id, total_amount, status, payment_status, created_at')
        .eq('customer_id', userId);
      orders = customerOrders || [];
    }

    // Get user's reviews
    const { data: reviews } = await supabaseAdmin
      .from('reviews')
      .select('id, rating, comment, created_at, products (name)')
      .eq('customer_id', userId);

    // Get user's favorites
    const { data: favorites } = await supabaseAdmin
      .from('favorites')
      .select('id, product_id, created_at, products (name, price)')
      .eq('customer_id', userId);

    res.status(200).json({
      success: true,
      data: {
        profile,
        products,
        orders,
        reviews: reviews || [],
        favorites: favorites || [],
        summary: {
          totalProducts: products.length,
          totalOrders: orders.length,
          totalReviews: reviews?.length || 0,
          totalFavorites: favorites?.length || 0
        }
      }
    });
  } catch (error) {
    console.error('❌ viewUserDetails error:', error);
    next(error);
  }
};

/**
 * Suspend a user (set suspended flag)
 * PATCH /api/admin/users/:id/suspend
 */
const suspendUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { reason = '' } = req.body || {};

    console.log('🔍 Attempting to suspend user:', userId);

    // Check if user exists
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, role, suspended')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('❌ Fetch error:', fetchError);
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: fetchError.message,
        userId: userId
      });
    }

    if (!profile) {
      console.error('❌ No profile found for userId:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found',
        userId: userId
      });
    }

    // Update profile with suspended flag
    const { data: updatedProfile, error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        suspended: true
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to suspend user',
        error: updateError.message
      });
    }

    // Ban the user in Supabase Auth so their sessions are invalidated
    try {
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        ban_duration: '876000h' // ~100 years = effectively permanent
      });
      console.log('✅ User banned in Supabase Auth:', userId);
    } catch (banError) {
      console.error('⚠️ Failed to ban user in Supabase Auth:', banError);
    }

    res.status(200).json({
      success: true,
      message: `${profile.full_name} has been suspended`,
      data: {
        user: updatedProfile
      }
    });
  } catch (error) {
    console.error('❌ suspendUser error:', error);
    next(error);
  }
};

/**
 * Unsuspend a user
 * PATCH /api/admin/users/:id/unsuspend
 */
const unsuspendUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name')
      .eq('id', userId)
      .single();

    if (fetchError || !profile) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update profile to unsuspend
    const { data: updatedProfile, error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        suspended: false
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to unsuspend user',
        error: updateError.message
      });
    }

    // Unban the user in Supabase Auth so they can log in again
    try {
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        ban_duration: 'none'
      });
      console.log('✅ User unbanned in Supabase Auth:', userId);
    } catch (unbanError) {
      console.error('⚠️ Failed to unban user in Supabase Auth:', unbanError);
    }

    res.status(200).json({
      success: true,
      message: `${profile.full_name} has been unsuspended`,
      data: {
        user: updatedProfile
      }
    });
  } catch (error) {
    console.error('❌ unsuspendUser error:', error);
    next(error);
  }
};

/**
 * Get all platform transactions (orders with payment info)
 * GET /api/admin/transactions
 */
const getTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get orders with customer info and items
    const { data: orders, error, count } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        customer_id,
        total_amount,
        status,
        created_at,
        updated_at,
        profiles!orders_customer_id_fkey (full_name, phone)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) {
      console.error('❌ Transactions fetch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch transactions',
        error: error.message
      });
    }

    // Map to transaction format
    const transactions = (orders || []).map(order => ({
      id: order.id,
      orderId: `ORD-${order.id.slice(0, 8).toUpperCase()}`,
      customer: order.profiles?.full_name || 'Unknown',
      customerPhone: order.profiles?.phone || 'N/A',
      type: 'Mobile Money',
      amount: parseFloat(order.total_amount || 0),
      status: order.status,
      orderStatus: order.status,
      date: order.created_at,
      updatedAt: order.updated_at
    }));

    res.status(200).json({
      success: true,
      data: {
        transactions,
        total: count || 0,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil((count || 0) / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('❌ getTransactions error:', error);
    next(error);
  }
};

/**
 * Get top farmers by revenue
 * GET /api/admin/analytics/top-farmers
 */
const getTopFarmers = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    // Get all order items with farmer and product info
    const { data: orderItems, error } = await supabaseAdmin
      .from('order_items')
      .select(`
        quantity,
        unit_price,
        line_total,
        farmer_id,
        orders!inner (status),
        products (name)
      `);

    if (error) {
      console.error('❌ Top farmers fetch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch top farmers data',
        error: error.message
      });
    }

    // Aggregate revenue per farmer
    const farmerRevenue = {};
    (orderItems || []).forEach(item => {
      if (!item.farmer_id) return;
      
      if (!farmerRevenue[item.farmer_id]) {
        farmerRevenue[item.farmer_id] = {
          id: item.farmer_id,
          revenue: 0,
          orderCount: 0,
          productsSold: 0
        };
      }

      const itemTotal = parseFloat(item.line_total || 0) || (parseFloat(item.unit_price || 0) * item.quantity);
      farmerRevenue[item.farmer_id].revenue += itemTotal;
      farmerRevenue[item.farmer_id].orderCount += 1;
      farmerRevenue[item.farmer_id].productsSold += item.quantity;
    });

    // Get farmer profile data for top farmers
    const farmerIds = Object.keys(farmerRevenue);
    let farmerProfiles = {};

    if (farmerIds.length > 0) {
      const { data: profiles } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name, phone')
        .in('id', farmerIds);

      (profiles || []).forEach(p => {
        farmerProfiles[p.id] = p;
      });
    }

    // Build and sort top farmers list
    const topFarmersList = Object.values(farmerRevenue)
      .map(f => ({
        id: f.id,
        name: farmerProfiles[f.id]?.full_name || 'Unknown Farmer',
        phone: farmerProfiles[f.id]?.phone || 'N/A',
        revenue: parseFloat(f.revenue.toFixed(2)),
        orderCount: f.orderCount,
        productsSold: f.productsSold
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        farmers: topFarmersList,
        count: topFarmersList.length
      }
    });
  } catch (error) {
    console.error('❌ getTopFarmers error:', error);
    next(error);
  }
};

module.exports = {
  getPendingFarmers,
  approveFarmer,
  rejectFarmer,
  getDashboardAnalytics,
  getRevenueAnalytics,
  getUserStatistics,
  getProductStatistics,
  getOrderStatistics,
  getRecentActivity,
  getAllUsers,
  promoteToAdmin,
  promoteUserToAdmin,
  viewUserDetails,
  suspendUser,
  unsuspendUser,
  getTransactions,
  getTopFarmers
};

