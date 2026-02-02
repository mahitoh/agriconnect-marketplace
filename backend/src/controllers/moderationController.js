const { supabaseAdmin } = require('../config/supabase');

// Report a product (any authenticated user)
exports.reportProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { reason, description } = req.body;
    const reporterId = req.user.id;

    // Validate reason
    const validReasons = ['inappropriate', 'misleading', 'spam', 'fake', 'other'];
    if (!validReasons.includes(reason)) {
      return res.status(400).json({ 
        error: 'Invalid reason. Must be one of: ' + validReasons.join(', ') 
      });
    }

    // Check if product exists
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('id, name, farmer_id')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Prevent reporting own products
    if (product.farmer_id === reporterId) {
      return res.status(400).json({ 
        error: 'You cannot report your own products' 
      });
    }

    // Check for duplicate report (same user, same product, pending/reviewed status)
    const { data: existingReport } = await supabaseAdmin
      .from('product_reports')
      .select('id')
      .eq('product_id', productId)
      .eq('reporter_id', reporterId)
      .in('status', ['pending', 'reviewed'])
      .single();

    if (existingReport) {
      return res.status(400).json({ 
        error: 'You have already reported this product' 
      });
    }

    // Create report
    const { data: report, error: reportError } = await supabaseAdmin
      .from('product_reports')
      .insert({
        product_id: productId,
        reporter_id: reporterId,
        reason,
        description,
        status: 'pending'
      })
      .select()
      .single();

    if (reportError) {      return res.status(500).json({ error: 'Failed to create report' });
    }

    res.status(201).json({
      message: 'Product reported successfully',
      report
    });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Get user's own reports
exports.getMyReports = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    let query = supabaseAdmin
      .from('product_reports')
      .select(`
        *,
        products (name, category)
      `)
      .eq('reporter_id', userId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: reports, error } = await query;

    if (error) {      return res.status(500).json({ error: 'Failed to fetch reports' });
    }

    res.json({ reports });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Admin: Get all reports with filters
exports.getAllReports = async (req, res) => {
  try {
    const { status, reason, page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let query = supabaseAdmin
      .from('product_reports')
      .select(`
        *,
        products (id, name, category, farmer_id),
        profiles!product_reports_reporter_id_fkey (id, full_name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (reason) {
      query = query.eq('reason', reason);
    }

    query = query.range(offset, offset + limitNum - 1);

    const { data: reports, error, count } = await query;

    if (error) {      return res.status(500).json({ error: 'Failed to fetch reports' });
    }

    const totalPages = Math.ceil(count / limitNum);

    res.json({
      reports,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: count,
        itemsPerPage: limitNum
      }
    });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Admin: Review a report
exports.reviewReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, adminNotes } = req.body;
    const adminId = req.user.id;

    // Validate status
    const validStatuses = ['reviewed', 'resolved', 'dismissed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') 
      });
    }

    // Update report
    const { data: report, error } = await supabaseAdmin
      .from('product_reports')
      .update({
        status,
        admin_notes: adminNotes,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', reportId)
      .select()
      .single();

    if (error || !report) {      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({
      message: 'Report reviewed successfully',
      report
    });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Admin: Update product moderation status
exports.moderateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { moderationStatus, moderationNotes } = req.body;
    const adminId = req.user.id;

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'flagged'];
    if (!validStatuses.includes(moderationStatus)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') 
      });
    }

    // Update product moderation status
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .update({
        moderation_status: moderationStatus,
        moderation_notes: moderationNotes,
        moderated_by: adminId,
        moderated_at: new Date().toISOString()
      })
      .eq('id', productId)
      .select()
      .single();

    if (error || !product) {      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      message: 'Product moderation status updated',
      product
    });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Admin: Get products by moderation status
exports.getProductsByModerationStatus = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        profiles!products_farmer_id_fkey (id, full_name)
      `, { count: 'exact' })
      .order('moderated_at', { ascending: false, nullsFirst: true });

    if (status) {
      query = query.eq('moderation_status', status);
    }

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
        itemsPerPage: limitNum
      }
    });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Admin: Get moderation statistics
exports.getModerationStats = async (req, res) => {
  try {
    // Get report counts by status
    const { data: reports } = await supabaseAdmin
      .from('product_reports')
      .select('status, reason');

    const reportStats = {
      byStatus: {
        pending: 0,
        reviewed: 0,
        resolved: 0,
        dismissed: 0
      },
      byReason: {
        inappropriate: 0,
        misleading: 0,
        spam: 0,
        fake: 0,
        other: 0
      },
      total: reports?.length || 0
    };

    reports?.forEach(report => {
      if (report.status) {
        reportStats.byStatus[report.status] = 
          (reportStats.byStatus[report.status] || 0) + 1;
      }
      if (report.reason) {
        reportStats.byReason[report.reason] = 
          (reportStats.byReason[report.reason] || 0) + 1;
      }
    });

    // Get product counts by moderation status
    const { data: products } = await supabaseAdmin
      .from('products')
      .select('moderation_status');

    const productStats = {
      byStatus: {
        pending: 0,
        approved: 0,
        rejected: 0,
        flagged: 0
      },
      total: products?.length || 0
    };

    products?.forEach(product => {
      if (product.moderation_status) {
        productStats.byStatus[product.moderation_status] = 
          (productStats.byStatus[product.moderation_status] || 0) + 1;
      }
    });

    res.json({
      reports: reportStats,
      products: productStats
    });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Admin: Get reports for a specific product
exports.getProductReports = async (req, res) => {
  try {
    const { productId } = req.params;

    const { data: reports, error } = await supabaseAdmin
      .from('product_reports')
      .select(`
        *,
        profiles!product_reports_reporter_id_fkey (id, full_name)
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {      return res.status(500).json({ error: 'Failed to fetch reports' });
    }

    res.json({ reports });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

