const { supabase, supabaseAdmin } = require('../config/supabase');

const normalizeItems = (items) => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => ({
      productId: item.productId || item.product_id,
      quantity: Number(item.quantity)
    }))
    .filter((item) => item.productId && Number.isFinite(item.quantity) && item.quantity > 0);
};

const createOrder = async (req, res, next) => {
  try {    const customerId = req.user.id;
    const items = normalizeItems(req.body.items);

    if (items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required'
      });
    }

    const productIds = [...new Set(items.map((item) => item.productId))];

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, farmer_id, price, quantity, status')
      .in('id', productIds);

    if (productsError) {      return res.status(500).json({
        success: false,
        message: 'Failed to validate products',
        error: productsError.message
      });
    }

    if (!products || products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more products were not found'
      });
    }

    const productMap = new Map(products.map((product) => [product.id, product]));
    const stockUpdates = [];

    let totalAmount = 0;

    for (const item of items) {
      const product = productMap.get(item.productId);

      if (!product || product.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: 'One or more products are not available'
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${item.productId}`
        });
      }

      totalAmount += Number(product.price) * item.quantity;
      stockUpdates.push({
        id: product.id,
        originalQuantity: product.quantity,
        newQuantity: product.quantity - item.quantity,
        status: product.quantity - item.quantity === 0 ? 'out_of_stock' : 'active'
      });
    }

    for (const update of stockUpdates) {
      const { data: updatedRows, error: updateError } = await supabaseAdmin
        .from('products')
        .update({
          quantity: update.newQuantity,
          status: update.status
        })
        .eq('id', update.id)
        .eq('quantity', update.originalQuantity)
        .select('id');

      if (updateError || !updatedRows || updatedRows.length === 0) {        return res.status(409).json({
          success: false,
          message: 'Stock update failed. Please retry your order.'
        });
      }
    }

    const {
      deliveryName,
      deliveryPhone,
      deliveryAddress,
      deliveryCity,
      deliveryRegion,
      deliveryNotes
    } = req.body;

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_id: customerId,
        status: 'pending',
        payment_status: 'unpaid',
        total_amount: Number(totalAmount.toFixed(2)),
        delivery_name: deliveryName,
        delivery_phone: deliveryPhone,
        delivery_address: deliveryAddress,
        delivery_city: deliveryCity,
        delivery_region: deliveryRegion,
        delivery_notes: deliveryNotes
      })
      .select()
      .single();

    if (orderError || !order) {      await Promise.all(
        stockUpdates.map((update) =>
          supabaseAdmin
            .from('products')
            .update({
              quantity: update.originalQuantity,
              status: update.originalQuantity === 0 ? 'out_of_stock' : 'active'
            })
            .eq('id', update.id)
        )
      );

      return res.status(500).json({
        success: false,
        message: 'Failed to create order'
      });
    }

    const orderItems = items.map((item) => {
      const product = productMap.get(item.productId);
      const unitPrice = Number(product.price);

      return {
        order_id: order.id,
        product_id: product.id,
        farmer_id: product.farmer_id,
        quantity: item.quantity,
        unit_price: unitPrice,
        line_total: Number((unitPrice * item.quantity).toFixed(2))
      };
    });

    const { error: orderItemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (orderItemsError) {      await supabaseAdmin
        .from('orders')
        .delete()
        .eq('id', order.id);

      await Promise.all(
        stockUpdates.map((update) =>
          supabaseAdmin
            .from('products')
            .update({
              quantity: update.originalQuantity,
              status: update.originalQuantity === 0 ? 'out_of_stock' : 'active'
            })
            .eq('id', update.id)
        )
      );

      return res.status(500).json({
        success: false,
        message: 'Failed to create order items'
      });
    }    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order,
        items: orderItems
      }
    });
  } catch (error) {    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {    const customerId = req.user.id;

    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*, products(name, image_url))')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) {      return res.status(500).json({
        success: false,
        message: 'Failed to fetch orders',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: {
        orders,
        count: orders.length
      }
    });
  } catch (error) {    next(error);
  }
};

const getFarmerOrders = async (req, res, next) => {
  try {    const farmerId = req.user.id;

    const { data: orderItems, error } = await supabaseAdmin
      .from('order_items')
      .select('*, orders(*), products(name, image_url)')
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false });

    if (error) {      return res.status(500).json({
        success: false,
        message: 'Failed to fetch farmer orders',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Farmer orders fetched successfully',
      data: {
        orderItems,
        count: orderItems.length
      }
    });
  } catch (error) {    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {    const orderId = req.params.id;
    const { role, id: userId } = req.user;

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*, products(name, image_url))')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (role === 'customer' && order.customer_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this order'
      });
    }

    if (role === 'farmer') {
      const hasFarmerItems = order.order_items?.some((item) => item.farmer_id === userId);
      if (!hasFarmerItems) {
        return res.status(403).json({
          success: false,
          message: 'You do not have access to this order'
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order fetched successfully',
      data: {
        order
      }
    });
  } catch (error) {    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {    const orderId = req.params.id;
    const { status, paymentStatus } = req.body;

    if (!status && !paymentStatus) {
      return res.status(400).json({
        success: false,
        message: 'Status or payment status is required'
      });
    }

    const { data: updatedOrder, error } = await supabaseAdmin
      .from('orders')
      .update({
        status: status || undefined,
        payment_status: paymentStatus || undefined
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error || !updatedOrder) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update order status',
        error: error?.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        order: updatedOrder
      }
    });
  } catch (error) {    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  getOrderById,
  updateOrderStatus
};

