const express = require('express');
const { authenticate, authorizeRole } = require('../middleware/auth');
const {
  getPendingFarmers,
  approveFarmer,
  rejectFarmer,
  getDashboardAnalytics,
  getRevenueAnalytics,
  getUserStatistics,
  getProductStatistics,
  getOrderStatistics,
  getRecentActivity
} = require('../controllers/adminController');

const router = express.Router();

// All admin routes require authentication + admin role
router.use(authenticate, authorizeRole('admin'));

/**
 * GET /api/admin/farmers/pending
 * Get all pending farmer registrations
 */
router.get('/farmers/pending', getPendingFarmers);

/**
 * PATCH /api/admin/farmers/:id/approve
 * Approve a farmer
 */
router.patch('/farmers/:id/approve', approveFarmer);

/**
 * PATCH /api/admin/farmers/:id/reject
 * Reject a farmer (deletes account)
 */
router.patch('/farmers/:id/reject', rejectFarmer);

/**
 * GET /api/admin/analytics/dashboard
 * Get dashboard overview with key metrics
 */
router.get('/analytics/dashboard', getDashboardAnalytics);

/**
 * GET /api/admin/analytics/revenue
 * Get revenue analytics (daily, weekly, monthly)
 */
router.get('/analytics/revenue', getRevenueAnalytics);

/**
 * GET /api/admin/analytics/users
 * Get user statistics and trends
 */
router.get('/analytics/users', getUserStatistics);

/**
 * GET /api/admin/analytics/products
 * Get product statistics
 */
router.get('/analytics/products', getProductStatistics);

/**
 * GET /api/admin/analytics/orders
 * Get order statistics and trends
 */
router.get('/analytics/orders', getOrderStatistics);

/**
 * GET /api/admin/analytics/activity
 * Get recent platform activity
 */
router.get('/analytics/activity', getRecentActivity);

module.exports = router;

