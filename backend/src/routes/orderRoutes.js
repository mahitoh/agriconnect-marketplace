const express = require('express');
const {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');
const { authenticate, authorize, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Customer checkout
router.post('/', authenticate, authorizeRole('customer'), createOrder);

// Customer order history
router.get('/', authenticate, authorizeRole('customer'), getMyOrders);

// Farmer order items
router.get('/farmer', authenticate, authorizeRole('farmer'), getFarmerOrders);

// Order details (customer, farmer, admin)
router.get('/:id', authenticate, getOrderById);

// Admin updates order status
router.put('/:id/status', authenticate, authorize('admin'), updateOrderStatus);

module.exports = router;

