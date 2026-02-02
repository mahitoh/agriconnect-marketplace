const { supabase, supabaseAdmin } = require('../config/supabase');
const { validationResult } = require('express-validator');

/**
 * Create a review
 * POST /api/reviews
 */
const createReview = async (req, res, next) => {
  try {    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const customerId = req.user.id;
    const { productId, farmerId, orderItemId, rating, comment } = req.body;

    if (!productId || !farmerId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, farmer ID, and rating are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

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

    const { data: review, error } = await supabaseAdmin
      .from('reviews')
      .insert({
        product_id: productId,
        farmer_id: farmerId,
        customer_id: customerId,
        order_item_id: orderItemId,
        rating: Number(rating),
        comment: comment || null
      })
      .select()
      .single();

    if (error) {      return res.status(500).json({
        success: false,
        message: 'Failed to create review',
        error: error.message
      });
    }    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: {
        review
      }
    });
  } catch (error) {    next(error);
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

module.exports = {
  createReview,
  getProductReviews,
  getFarmerReviews,
  getProductRatingSummary,
  getFarmerRatingSummary,
  updateReview,
  deleteReview
};

