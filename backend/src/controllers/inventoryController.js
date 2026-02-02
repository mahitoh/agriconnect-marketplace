const { supabaseAdmin } = require('../config/supabase');

// Adjust product stock manually (farmer only)
exports.adjustStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantityChange, notes } = req.body;
    const farmerId = req.user.id;

    // Validate input
    if (typeof quantityChange !== 'number' || quantityChange === 0) {
      return res.status(400).json({ 
        error: 'quantityChange must be a non-zero number' 
      });
    }

    // Get current product to verify ownership and current quantity
    const { data: product, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('id, farmer_id, quantity, name')
      .eq('id', productId)
      .single();

    if (fetchError || !product) {      return res.status(404).json({ error: 'Product not found' });
    }

    // Verify ownership
    if (product.farmer_id !== farmerId) {
      return res.status(403).json({ 
        error: 'You can only adjust stock for your own products' 
      });
    }

    const newQuantity = product.quantity + quantityChange;

    // Prevent negative stock
    if (newQuantity < 0) {
      return res.status(400).json({ 
        error: `Cannot reduce stock below 0. Current: ${product.quantity}, Requested change: ${quantityChange}` 
      });
    }

    // Update product quantity
    const { error: updateError } = await supabaseAdmin
      .from('products')
      .update({ quantity: newQuantity })
      .eq('id', productId);

    if (updateError) {      return res.status(500).json({ error: 'Failed to update stock' });
    }

    // Log the change manually (trigger will also log, but this gives us explicit control)
    const { error: logError } = await supabaseAdmin
      .from('stock_history')
      .insert({
        product_id: productId,
        farmer_id: farmerId,
        previous_quantity: product.quantity,
        new_quantity: newQuantity,
        change_amount: quantityChange,
        change_type: 'manual_adjustment',
        notes: notes || 'Manual stock adjustment'
      });

    if (logError) {      // Don't fail the request, just log the error
    }

    res.json({
      message: 'Stock adjusted successfully',
      product: {
        id: productId,
        name: product.name,
        previousQuantity: product.quantity,
        newQuantity: newQuantity,
        change: quantityChange
      }
    });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Get stock history for a product (farmer only)
exports.getStockHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    const farmerId = req.user.id;
    const { limit = 50 } = req.query;

    // Verify product ownership
    const { data: product, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('id, farmer_id')
      .eq('id', productId)
      .single();

    if (fetchError || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.farmer_id !== farmerId) {
      return res.status(403).json({ 
        error: 'You can only view stock history for your own products' 
      });
    }

    // Get stock history
    const { data: history, error } = await supabaseAdmin
      .from('stock_history')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    if (error) {      return res.status(500).json({ error: 'Failed to fetch stock history' });
    }

    res.json({ history });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Get all stock history for farmer's products
exports.getFarmerStockHistory = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const { limit = 100 } = req.query;

    // Get stock history for all farmer's products
    const { data: history, error } = await supabaseAdmin
      .from('stock_history')
      .select('*, products(name)')
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    if (error) {      return res.status(500).json({ error: 'Failed to fetch stock history' });
    }

    res.json({ history });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Get low stock products for farmer
exports.getLowStockProducts = async (req, res) => {
  try {
    const farmerId = req.user.id;

    // Get products where quantity <= threshold
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, name, quantity, stock_alert_threshold, low_stock_alert_enabled')
      .eq('farmer_id', farmerId)
      .eq('low_stock_alert_enabled', true)
      .lte('quantity', supabaseAdmin.raw('stock_alert_threshold'))
      .gte('quantity', 0)
      .order('quantity', { ascending: true });

    if (error) {      return res.status(500).json({ error: 'Failed to fetch low stock products' });
    }

    res.json({ 
      lowStockProducts: products,
      count: products.length 
    });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Update stock alert settings for a product
exports.updateStockAlertSettings = async (req, res) => {
  try {
    const { productId } = req.params;
    const { stockAlertThreshold, lowStockAlertEnabled } = req.body;
    const farmerId = req.user.id;

    // Verify product ownership
    const { data: product, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('id, farmer_id')
      .eq('id', productId)
      .single();

    if (fetchError || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.farmer_id !== farmerId) {
      return res.status(403).json({ 
        error: 'You can only update settings for your own products' 
      });
    }

    // Build update object
    const updates = {};
    if (typeof stockAlertThreshold === 'number' && stockAlertThreshold >= 0) {
      updates.stock_alert_threshold = stockAlertThreshold;
    }
    if (typeof lowStockAlertEnabled === 'boolean') {
      updates.low_stock_alert_enabled = lowStockAlertEnabled;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ 
        error: 'No valid settings provided' 
      });
    }

    // Update settings
    const { error: updateError } = await supabaseAdmin
      .from('products')
      .update(updates)
      .eq('id', productId);

    if (updateError) {      return res.status(500).json({ error: 'Failed to update settings' });
    }

    res.json({ 
      message: 'Stock alert settings updated successfully',
      updates 
    });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

// Get inventory summary for farmer
exports.getInventorySummary = async (req, res) => {
  try {
    const farmerId = req.user.id;

    // Get all products with stock info
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, name, quantity, stock_alert_threshold, low_stock_alert_enabled')
      .eq('farmer_id', farmerId)
      .order('quantity', { ascending: true });

    if (error) {      return res.status(500).json({ error: 'Failed to fetch inventory summary' });
    }

    // Calculate summary stats
    const totalProducts = products.length;
    const totalStockValue = products.reduce((sum, p) => sum + p.quantity, 0);
    const outOfStock = products.filter(p => p.quantity === 0).length;
    const lowStock = products.filter(p => 
      p.low_stock_alert_enabled && 
      p.quantity > 0 && 
      p.quantity <= p.stock_alert_threshold
    ).length;
    const inStock = totalProducts - outOfStock - lowStock;

    res.json({
      summary: {
        totalProducts,
        totalStockValue,
        inStock,
        lowStock,
        outOfStock
      },
      products
    });

  } catch (error) {    res.status(500).json({ error: 'Server error' });
  }
};

