const express = require('express');
const {
  createReview,
  getProductReviews,
  getFarmerReviews,
  getProductRatingSummary,
  getFarmerRatingSummary,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Create review (customer only)
router.post('/', authenticate, authorizeRole('customer'), createReview);

// Get product reviews
router.get('/product/:productId', getProductReviews);

// Get product rating summary
router.get('/product/:productId/summary', getProductRatingSummary);

// Get farmer reviews
router.get('/farmer/:farmerId', getFarmerReviews);

// Get farmer rating summary
router.get('/farmer/:farmerId/summary', getFarmerRatingSummary);

// Update review (customer only)
router.put('/:id', authenticate, authorizeRole('customer'), updateReview);

// Delete review (customer only)
router.delete('/:id', authenticate, authorizeRole('customer'), deleteReview);

module.exports = router;

