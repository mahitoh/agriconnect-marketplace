const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const moderationController = require('../controllers/moderationController');

// User routes (authenticated users can report products)

// Report a product
router.post(
  '/reports/products/:productId',
  authenticate,
  moderationController.reportProduct
);

// Get user's own reports
router.get(
  '/reports/my',
  authenticate,
  moderationController.getMyReports
);

// Admin routes (all require admin role)

// Get all reports with filters
router.get(
  '/reports',
  authenticate,
  authorizeRole('admin'),
  moderationController.getAllReports
);

// Review a report (update status)
router.put(
  '/reports/:reportId',
  authenticate,
  authorizeRole('admin'),
  moderationController.reviewReport
);

// Update product moderation status
router.put(
  '/products/:productId',
  authenticate,
  authorizeRole('admin'),
  moderationController.moderateProduct
);

// Get products by moderation status
router.get(
  '/products',
  authenticate,
  authorizeRole('admin'),
  moderationController.getProductsByModerationStatus
);

// Get moderation statistics
router.get(
  '/stats',
  authenticate,
  authorizeRole('admin'),
  moderationController.getModerationStats
);

// Get all reports for a specific product
router.get(
  '/reports/products/:productId',
  authenticate,
  authorizeRole('admin'),
  moderationController.getProductReports
);

module.exports = router;

