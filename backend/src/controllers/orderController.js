const { supabase, supabaseAdmin } = require('../config/supabase');

// ─── Helpers ─────────────────────────────────────────────────

const normalizeItems = (items) => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => ({
      productId: item.productId || item.product_id,
      quantity: Number(item.quantity)
    }))
    .filter((item) => item.productId && Number.isFinite(item.quantity) && item.quantity > 0);
};

const ORDER_STATUSES = {
  PENDING_PAYMENT: 'pending_payment',
  PAID: 'paid',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

const PAYMENT_STATUSES = {
  INITIATED: 'initiated',
  PROCESSING: 'processing',
  SUCCESSFUL: 'successful',
  FAILED: 'failed',
  EXPIRED: 'expired'
};

// ─── POST /api/orders/validate-cart ──────────────────────────
// Backend validates cart: checks stock, prices, active status
// Returns server-calculated totals. Frontend NEVER calculates final totals.

const validateCart = async (req, res, next) => {
  try {
    const items = normalizeItems(req.body.items);

    if (items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const productIds = [...new Set(items.map((i) => i.productId))];

    const { data: products, error } = await supabase
      .from('products')
      .select('id, farmer_id, price, quantity, status, name, image_url')
      .in('id', productIds);

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to validate products' });
    }

    const productMap = new Map(products.map((p) => [p.id, p]));
    const validatedItems = [];
    const warnings = [];

    for (const item of items) {
      const product = productMap.get(item.productId);

      if (!product) {
        warnings.push({ productId: item.productId, issue: 'Product not found' });
        continue;
      }
      if (product.status !== 'active') {
        warnings.push({ productId: item.productId, name: product.name, issue: 'Product unavailable' });
        continue;
      }
      if (product.quantity <= 0) {
        warnings.push({ productId: item.productId, name: product.name, issue: 'Out of stock' });
        continue;
      }

      const adjustedQty = Math.min(item.quantity, product.quantity);
      if (adjustedQty < item.quantity) {
        warnings.push({
          productId: item.productId,
          name: product.name,
          issue: `Only ${product.quantity} in stock`,
          adjustedQuantity: adjustedQty
        });
      }

      validatedItems.push({
        productId: product.id,
        farmerId: product.farmer_id,
        name: product.name,
        image: product.image_url,
        price: Number(product.price),
        quantity: adjustedQty,
        lineTotal: Number((Number(product.price) * adjustedQty).toFixed(2)),
        stock: product.quantity
      });
    }

    // Group by farmer
    const farmerGroups = {};
    for (const item of validatedItems) {
      if (!farmerGroups[item.farmerId]) {
        farmerGroups[item.farmerId] = { farmerId: item.farmerId, items: [], subtotal: 0 };
      }
      farmerGroups[item.farmerId].items.push(item);
      farmerGroups[item.farmerId].subtotal += item.lineTotal;
    }

    const subtotal = validatedItems.reduce((sum, i) => sum + i.lineTotal, 0);
    const deliveryFee = subtotal > 50000 ? 0 : 2000;
    const total = subtotal + deliveryFee;

    return res.status(200).json({
      success: true,
      data: {
        items: validatedItems,
        farmerGroups: Object.values(farmerGroups),
        subtotal,
        deliveryFee,
        total,
        warnings
      }
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/orders/checkout ───────────────────────────────
// Create orders split per farmer, all with PENDING_PAYMENT status.
// NO stock reduction here. Stock is reduced only after payment success.

const checkout = async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const items = normalizeItems(req.body.items);
    const { deliveryName, deliveryPhone, deliveryAddress, deliveryCity, deliveryRegion, deliveryNotes, paymentMethod } = req.body;

    if (items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    if (!deliveryName || !deliveryPhone || !deliveryAddress || !deliveryCity) {
      return res.status(400).json({ success: false, message: 'Delivery information is incomplete' });
    }

    // ── Cancel any existing PENDING_PAYMENT orders for this customer ──
    // This prevents duplicate orders if user refreshes and retries checkout
    const { data: staleOrders } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('customer_id', customerId)
      .eq('status', ORDER_STATUSES.PENDING_PAYMENT);

    if (staleOrders && staleOrders.length > 0) {
      const staleIds = staleOrders.map((o) => o.id);
      await supabaseAdmin.from('order_items').delete().in('order_id', staleIds);
      await supabaseAdmin.from('orders').delete().in('id', staleIds);
      console.log(`🗑️ Cleaned up ${staleIds.length} stale PENDING_PAYMENT orders for customer ${customerId}`);
    }

    // ── Re-validate stock & prices on backend ──
    const productIds = [...new Set(items.map((i) => i.productId))];
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, farmer_id, price, quantity, status, name')
      .in('id', productIds);

    if (productsError || !products) {
      return res.status(500).json({ success: false, message: 'Failed to validate products' });
    }

    if (products.length !== productIds.length) {
      return res.status(400).json({ success: false, message: 'One or more products no longer available' });
    }

    const productMap = new Map(products.map((p) => [p.id, p]));
    let totalAmount = 0;

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product || product.status !== 'active') {
        return res.status(400).json({ success: false, message: `${product?.name || 'Product'} is no longer available` });
      }
      // ── Self-purchase check ──
      if (product.farmer_id === customerId) {
        return res.status(400).json({ success: false, message: `You cannot purchase your own product: ${product.name}` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ success: false, message: `Only ${product.quantity} ${product.name} in stock` });
      }
      totalAmount += Number(product.price) * item.quantity;
    }

    const deliveryFee = totalAmount > 50000 ? 0 : 2000;
    totalAmount += deliveryFee;

    // ── Group items by farmer ──
    const farmerItems = {};
    for (const item of items) {
      const product = productMap.get(item.productId);
      const fid = product.farmer_id;
      if (!farmerItems[fid]) farmerItems[fid] = [];
      farmerItems[fid].push({ ...item, product });
    }

    // ── Create one order per farmer ──
    const createdOrders = [];

    for (const [farmerId, fItems] of Object.entries(farmerItems)) {
      const orderTotal = fItems.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);

      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          customer_id: customerId,
          status: ORDER_STATUSES.PENDING_PAYMENT,
          total_amount: Number(orderTotal.toFixed(2)),
          delivery_name: deliveryName,
          delivery_phone: deliveryPhone,
          delivery_address: deliveryAddress,
          delivery_city: deliveryCity,
          delivery_region: deliveryRegion || null,
          delivery_notes: deliveryNotes || null
        })
        .select()
        .single();

      if (orderError || !order) {
        console.error('Order creation failed:', orderError);
        // Rollback any already-created orders
        for (const created of createdOrders) {
          await supabaseAdmin.from('order_items').delete().eq('order_id', created.id);
          await supabaseAdmin.from('orders').delete().eq('id', created.id);
        }
        return res.status(500).json({ success: false, message: 'Failed to create order' });
      }

      // Create order items with price snapshot
      const orderItemsData = fItems.map((i) => ({
        order_id: order.id,
        product_id: i.product.id,
        farmer_id: i.product.farmer_id,
        quantity: i.quantity,
        unit_price: Number(i.product.price),
        line_total: Number((Number(i.product.price) * i.quantity).toFixed(2))
      }));

      const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItemsData);

      if (itemsError) {
        await supabaseAdmin.from('orders').delete().eq('id', order.id);
        for (const created of createdOrders) {
          await supabaseAdmin.from('order_items').delete().eq('order_id', created.id);
          await supabaseAdmin.from('orders').delete().eq('id', created.id);
        }
        return res.status(500).json({ success: false, message: 'Failed to create order items' });
      }

      createdOrders.push({ ...order, items: orderItemsData });
    }

    res.status(201).json({
      success: true,
      message: 'Orders created — awaiting payment',
      data: {
        orders: createdOrders,
        orderIds: createdOrders.map((o) => o.id),
        totalAmount: Number(totalAmount.toFixed(2)),
        deliveryFee,
        paymentMethod
      }
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/orders/confirm-payment ────────────────────────
// Called AFTER MTN returns SUCCESS. Verifies, updates orders to PAID,
// reduces stock. This is the ONLY place stock is reduced.

const confirmPayment = async (req, res, next) => {
  try {
    const { orderIds, paymentReference, paymentMethod } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ success: false, message: 'orderIds required' });
    }
    if (!paymentReference) {
      return res.status(400).json({ success: false, message: 'paymentReference required' });
    }

    // ── Check orders exist and belong to user ──
    const { data: orders, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*)')
      .in('id', orderIds)
      .eq('customer_id', req.user.id);

    if (fetchError || !orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Orders not found' });
    }

    // ── Prevent double payment ──
    const alreadyPaid = orders.some((o) => o.status === ORDER_STATUSES.PAID);
    if (alreadyPaid) {
      // Idempotent: return success so frontend doesn't break on refresh
      return res.status(200).json({
        success: true,
        message: 'Payment already confirmed',
        data: {
          orderIds,
          paymentReference,
          status: ORDER_STATUSES.PAID,
          alreadyPaid: true
        }
      });
    }

    // ── Only allow payment on PENDING_PAYMENT orders ──
    const invalidOrders = orders.filter((o) => o.status !== ORDER_STATUSES.PENDING_PAYMENT);
    if (invalidOrders.length > 0) {
      return res.status(400).json({ success: false, message: 'Orders are not in a payable state' });
    }

    // ── Reduce stock (optimistic locking) ──
    for (const order of orders) {
      for (const item of order.order_items) {
        // Read current stock
        const { data: product } = await supabaseAdmin
          .from('products')
          .select('quantity, name')
          .eq('id', item.product_id)
          .single();

        if (!product || product.quantity < item.quantity) {
          return res.status(409).json({
            success: false,
            message: `Not enough stock for ${product?.name || 'a product'}. Please start over.`
          });
        }

        const newQty = product.quantity - item.quantity;
        const { data: updated, error: updateError } = await supabaseAdmin
          .from('products')
          .update({
            quantity: newQty,
            status: newQty === 0 ? 'out_of_stock' : 'active'
          })
          .eq('id', item.product_id)
          .eq('quantity', product.quantity) // optimistic lock: only if stock unchanged
          .select('id');

        if (updateError || !updated || updated.length === 0) {
          return res.status(409).json({ success: false, message: 'Stock changed while processing. Please retry.' });
        }
      }
    }

    // ── Update orders to PAID ──
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        status: ORDER_STATUSES.PAID
      })
      .in('id', orderIds);

    if (updateError) {
      return res.status(500).json({ success: false, message: 'Failed to update order status' });
    }

    res.status(200).json({
      success: true,
      message: 'Payment confirmed — orders are now PAID',
      data: {
        orderIds,
        paymentReference,
        status: ORDER_STATUSES.PAID
      }
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/orders/confirm-cod ────────────────────────────
// Cash on delivery: create order as PENDING_PAYMENT but with COD flag.
// Stock is reduced because merchant will prepare for delivery.

const confirmCOD = async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const items = normalizeItems(req.body.items);
    const { deliveryName, deliveryPhone, deliveryAddress, deliveryCity, deliveryRegion, deliveryNotes } = req.body;

    if (items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // ── Validate all products ──
    const productIds = [...new Set(items.map((i) => i.productId))];
    const { data: products, error } = await supabase
      .from('products')
      .select('id, farmer_id, price, quantity, status, name')
      .in('id', productIds);

    if (error || !products || products.length !== productIds.length) {
      return res.status(400).json({ success: false, message: 'Some products are unavailable' });
    }

    const productMap = new Map(products.map((p) => [p.id, p]));
    let totalAmount = 0;

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product || product.status !== 'active' || product.quantity < item.quantity) {
        return res.status(400).json({ success: false, message: `${product?.name || 'Product'} stock issue` });
      }
      // ── Self-purchase check ──
      if (product.farmer_id === customerId) {
        return res.status(400).json({ success: false, message: `You cannot purchase your own product: ${product.name}` });
      }
      totalAmount += Number(product.price) * item.quantity;
    }

    const deliveryFee = totalAmount > 50000 ? 0 : 2000;
    totalAmount += deliveryFee;

    // ── Group by farmer ──
    const farmerItems = {};
    for (const item of items) {
      const product = productMap.get(item.productId);
      const fid = product.farmer_id;
      if (!farmerItems[fid]) farmerItems[fid] = [];
      farmerItems[fid].push({ ...item, product });
    }

    // ── Create orders + reduce stock ──
    const createdOrders = [];

    for (const [farmerId, fItems] of Object.entries(farmerItems)) {
      const orderTotal = fItems.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);

      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          customer_id: customerId,
          status: ORDER_STATUSES.PROCESSING, // COD goes straight to processing
          total_amount: Number(orderTotal.toFixed(2)),
          delivery_name: deliveryName,
          delivery_phone: deliveryPhone,
          delivery_address: deliveryAddress,
          delivery_city: deliveryCity,
          delivery_region: deliveryRegion || null,
          delivery_notes: deliveryNotes || null
        })
        .select()
        .single();

      if (orderError || !order) {
        for (const c of createdOrders) {
          await supabaseAdmin.from('order_items').delete().eq('order_id', c.id);
          await supabaseAdmin.from('orders').delete().eq('id', c.id);
        }
        return res.status(500).json({ success: false, message: 'Failed to create order' });
      }

      const orderItemsData = fItems.map((i) => ({
        order_id: order.id,
        product_id: i.product.id,
        farmer_id: i.product.farmer_id,
        quantity: i.quantity,
        unit_price: Number(i.product.price),
        line_total: Number((Number(i.product.price) * i.quantity).toFixed(2))
      }));

      await supabaseAdmin.from('order_items').insert(orderItemsData);

      // Reduce stock for COD
      for (const i of fItems) {
        const newQty = i.product.quantity - i.quantity;
        await supabaseAdmin
          .from('products')
          .update({ quantity: newQty, status: newQty === 0 ? 'out_of_stock' : 'active' })
          .eq('id', i.product.id);
      }

      createdOrders.push({ ...order, items: orderItemsData });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed — pay on delivery',
      data: {
        orders: createdOrders,
        orderIds: createdOrders.map((o) => o.id),
        totalAmount: Number(totalAmount.toFixed(2))
      }
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/orders ─────────────────────────────────────────

const getMyOrders = async (req, res, next) => {
  try {
    const customerId = req.user.id;

    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(id, farmer_id, quantity, product_id, products(id, name, image_url, farmer_id, profiles!products_farmer_id_fkey(full_name)))')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch orders' });
    }

    res.status(200).json({
      success: true,
      data: { orders, count: orders.length }
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/orders/farmer ──────────────────────────────────

const getFarmerOrders = async (req, res, next) => {
  try {
    const farmerId = req.user.id;

    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items!inner(id, *, products(id, name, image_url, farmer_id, profiles!products_farmer_id_fkey(full_name)))')
      .eq('order_items.farmer_id', farmerId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch farmer orders' });
    }

    res.status(200).json({
      success: true,
      data: { orders, count: orders.length }
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/orders/:id ─────────────────────────────────────

const getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { role, id: userId } = req.user;

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(id, *, products(id, name, image_url, farmer_id, profiles!products_farmer_id_fkey(full_name)))')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Access control
    if (role === 'customer' && order.customer_id !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    if (role === 'farmer') {
      const isFarmerOrder = order.order_items?.some((item) => item.farmer_id === userId);
      if (!isFarmerOrder) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    res.status(200).json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/orders/:id/status ──────────────────────────────

const updateOrderStatus = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const { role, id: userId } = req.user;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    // Fetch order for access control
    const { data: order, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(farmer_id)')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Farmer can update their own orders: processing → shipped → completed
    if (role === 'farmer') {
      const isFarmerOrder = order.order_items?.some((item) => item.farmer_id === userId);
      if (!isFarmerOrder) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      const farmerAllowed = ['processing', 'shipped', 'completed'];
      if (!farmerAllowed.includes(status)) {
        return res.status(400).json({ success: false, message: `Farmers can only set: ${farmerAllowed.join(', ')}` });
      }
    }

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError || !updatedOrder) {
      return res.status(500).json({ success: false, message: 'Failed to update order status' });
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: { order: updatedOrder }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateCart,
  checkout,
  confirmPayment,
  confirmCOD,
  getMyOrders,
  getFarmerOrders,
  getOrderById,
  updateOrderStatus
};

