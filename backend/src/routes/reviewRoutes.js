const express = require('express');
const {
  createReview,
  getProductReviews,
  getFarmerReviews,
  getProductRatingSummary,
  getFarmerRatingSummary,
  updateReview,
  deleteReview,
  canReviewProduct,
  getReviewableProducts
} = require('../controllers/reviewController');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Create review (authenticated users who purchased the product)
router.post('/', authenticate, createReview);

// Check if user can review a product
router.get('/can-review/:productId', authenticate, canReviewProduct);

// Get products user can review (from their completed orders)
router.get('/my-reviewable-products', authenticate, getReviewableProducts);

// Get product reviews
router.get('/product/:productId', getProductReviews);

// Get product rating summary
router.get('/product/:productId/summary', getProductRatingSummary);

// Get farmer reviews
router.get('/farmer/:farmerId', getFarmerReviews);

// Get farmer rating summary
router.get('/farmer/:farmerId/summary', getFarmerRatingSummary);

// Update review (owner only)
router.put('/:id', authenticate, updateReview);

// Delete review (owner only)
router.delete('/:id', authenticate, deleteReview);

module.exports = router;

