const express = require('express');
const { authenticate, authorizeRole } = require('../middleware/auth');
const {
  getAllUsers,
  getPendingFarmers,
  approveFarmer,
  rejectFarmer,
  getDashboardAnalytics,
  getRevenueAnalytics,
  getUserStatistics,
  getProductStatistics,
  getOrderStatistics,
  getRecentActivity,
  viewUserDetails,
  suspendUser,
  unsuspendUser,
  promoteUserToAdmin,
  deleteUser,
  getTransactions,
  getTopFarmers
} = require('../controllers/adminController');

const router = express.Router();

// All admin routes require authentication + admin role
router.use(authenticate, authorizeRole('admin'));

/**
 * GET /api/admin/users
 * Get all users (farmers and customers)
 */
router.get('/users', getAllUsers);

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

/**
 * GET /api/admin/users/:id
 * Get detailed view of a specific user
 */
router.get('/users/:id', viewUserDetails);

/**
 * PATCH /api/admin/users/:id/suspend
 * Suspend a user
 */
router.patch('/users/:id/suspend', suspendUser);

/**
 * PATCH /api/admin/users/:id/unsuspend
 * Unsuspend a user
 */
router.patch('/users/:id/unsuspend', unsuspendUser);

/**
 * PATCH /api/admin/users/:id/promote
 * Promote a user to admin
 */
router.patch('/users/:id/promote', promoteUserToAdmin);

/**
 * DELETE /api/admin/users/:id
 * Permanently delete a user account
 */
router.delete('/users/:id', deleteUser);

/**
 * GET /api/admin/transactions
 * Get all platform transactions
 */
router.get('/transactions', getTransactions);

/**
 * GET /api/admin/analytics/top-farmers
 * Get top farmers by revenue
 */
router.get('/analytics/top-farmers', getTopFarmers);

module.exports = router;

