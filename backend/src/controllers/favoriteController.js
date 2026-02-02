const { supabase, supabaseAdmin } = require('../config/supabase');

/**
 * Add product to favorites
 * POST /api/favorites
 */
const addFavorite = async (req, res, next) => {
  try {
    const customerId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('customer_id', customerId)
      .eq('product_id', productId)
      .single();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Product already in favorites'
      });
    }

    const { data: favorite, error } = await supabaseAdmin
      .from('favorites')
      .insert({
        customer_id: customerId,
        product_id: productId
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to add to favorites',
        error: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      data: { favorite }
    });
  } catch (error) {    next(error);
  }
};

/**
 * Get user's favorites
 * GET /api/favorites
 */
const getFavorites = async (req, res, next) => {
  try {
    const customerId = req.user.id;

    const { data: favorites, error } = await supabaseAdmin
      .from('favorites')
      .select('*, products(*)')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch favorites',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Favorites fetched successfully',
      data: {
        favorites,
        count: favorites.length
      }
    });
  } catch (error) {    next(error);
  }
};

/**
 * Remove product from favorites
 * DELETE /api/favorites/:productId
 */
const removeFavorite = async (req, res, next) => {
  try {    const customerId = req.user.id;
    const { productId } = req.params;

    const { error } = await supabaseAdmin
      .from('favorites')
      .delete()
      .eq('customer_id', customerId)
      .eq('product_id', productId);

    if (error) {      return res.status(500).json({
        success: false,
        message: 'Failed to remove from favorites',
        error: error.message
      });
    }    res.status(200).json({
      success: true,
      message: 'Removed from favorites'
    });
  } catch (error) {    next(error);
  }
};

/**
 * Check if product is favorited
 * GET /api/favorites/check/:productId
 */
const checkFavorite = async (req, res, next) => {
  try {    const customerId = req.user.id;
    const { productId } = req.params;

    const { data: favorite } = await supabase
      .from('favorites')
      .select('id')
      .eq('customer_id', customerId)
      .eq('product_id', productId)
      .single();

    res.status(200).json({
      success: true,
      data: {
        isFavorited: !!favorite
      }
    });
  } catch (error) {    next(error);
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite,
  checkFavorite
};

