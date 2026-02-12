const { supabase, supabaseAdmin } = require('../config/supabase');

// ─── GET /api/cart ──────────────────────────────────────────
// Fetch user's cart from database

const getCart = async (req, res, next) => {
  try {
    const customerId = req.user.id;

    // Get or create cart for user
    let { data: cart, error: cartError } = await supabaseAdmin
      .from('carts')
      .select('id')
      .eq('user_id', customerId)
      .single();

    // If no cart exists, return empty
    if (cartError && cartError.code === 'PGRST116') {
      return res.status(200).json({
        success: true,
        data: { cartItems: [], cartId: null }
      });
    }

    if (cartError) {
      return res.status(500).json({ success: false, message: 'Failed to fetch cart' });
    }

    // Fetch cart items with product details
    const { data: cartItems, error: itemsError } = await supabaseAdmin
      .from('cart_items')
      .select('id, product_id, quantity, price_snapshot, products(id, name, price, image_url, farmer_id, quantity, status)')
      .eq('cart_id', cart.id);

    if (itemsError) {
      return res.status(500).json({ success: false, message: 'Failed to fetch cart items' });
    }

    // Validate products are still available and format response
    const validItems = (cartItems || [])
      .filter(item => {
        if (!item.products) return false;
        const product = item.products;
        // Exclude if product is deleted or out of stock
        return product.status === 'active' && product.quantity > 0;
      })
      .map(item => ({
        cartItemId: item.id,
        productId: item.product_id,
        quantity: item.quantity,
        priceSnapshot: item.price_snapshot || item.products.price,
        product: {
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          image_url: item.products.image_url,
          farmer_id: item.products.farmer_id
        }
      }));

    res.status(200).json({
      success: true,
      data: {
        cartId: cart.id,
        cartItems: validItems
      }
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/cart/items ───────────────────────────────────
// Add or update item in cart

const addToCart = async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Invalid product or quantity' });
    }

    // Validate product exists and is available
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, farmer_id, price, quantity, status, name')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Product is not available' });
    }

    if (product.quantity < 1) {
      return res.status(400).json({ success: false, message: 'Product is out of stock' });
    }

    // Self-purchase check
    if (product.farmer_id === customerId) {
      return res.status(400).json({ success: false, message: `You cannot purchase your own product: ${product.name}` });
    }

    // Get or create cart
    let { data: cart, error: cartError } = await supabaseAdmin
      .from('carts')
      .select('id')
      .eq('user_id', customerId)
      .single();

    if (!cart) {
      const { data: newCart, error: createError } = await supabaseAdmin
        .from('carts')
        .insert({ user_id: customerId })
        .select()
        .single();

      if (createError || !newCart) {
        return res.status(500).json({ success: false, message: 'Failed to create cart' });
      }
      cart = newCart;
    }

    // Check if item already in cart
    const { data: existingItem } = await supabaseAdmin
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      // Update quantity
      const { data: updated, error: updateError } = await supabaseAdmin
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({ success: false, message: 'Failed to update cart item' });
      }

      return res.status(200).json({
        success: true,
        message: 'Cart item updated',
        data: { cartItem: updated }
      });
    }

    // Add new item to cart
    const { data: newItem, error: insertError } = await supabaseAdmin
      .from('cart_items')
      .insert({
        cart_id: cart.id,
        product_id: productId,
        quantity,
        price_snapshot: product.price
      })
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ success: false, message: 'Failed to add to cart' });
    }

    res.status(201).json({
      success: true,
      message: 'Added to cart',
      data: { cartItem: newItem }
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/cart/items/:cartItemId ─────────────────────
// Remove item from cart

const removeFromCart = async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const { cartItemId } = req.params;

    // Verify ownership
    const { data: item } = await supabaseAdmin
      .from('cart_items')
      .select('cart_id, carts(user_id)')
      .eq('id', cartItemId)
      .single();

    if (!item || item.carts.user_id !== customerId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { error } = await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to remove item' });
    }

    res.status(200).json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/cart/items/:cartItemId ────────────────────────
// Update item quantity

const updateCartItem = async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    // Verify ownership
    const { data: item } = await supabaseAdmin
      .from('cart_items')
      .select('cart_id, carts(user_id)')
      .eq('id', cartItemId)
      .single();

    if (!item || item.carts.user_id !== customerId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { data: updated, error } = await supabaseAdmin
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to update cart item' });
    }

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: { cartItem: updated }
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/cart ───────────────────────────────────────
// Clear entire cart

const clearCart = async (req, res, next) => {
  try {
    const customerId = req.user.id;

    // Get cart
    const { data: cart } = await supabaseAdmin
      .from('carts')
      .select('id')
      .eq('user_id', customerId)
      .single();

    if (!cart) {
      return res.status(200).json({ success: true, message: 'Cart already empty' });
    }

    // Delete all items
    await supabaseAdmin.from('cart_items').delete().eq('cart_id', cart.id);

    res.status(200).json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart
};
