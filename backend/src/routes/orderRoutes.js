const express = require('express');
const {
  validateCart,
  checkout,
  confirmPayment,
  confirmCOD,
  getMyOrders,
  getFarmerOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');
const { authenticate, authorize, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// ── Checkout flow ──
router.post('/validate-cart', authenticate, authorizeRole('customer'), validateCart);
router.post('/checkout', authenticate, authorizeRole('customer'), checkout);
router.post('/confirm-payment', authenticate, authorizeRole('customer'), confirmPayment);
router.post('/confirm-cod', authenticate, authorizeRole('customer'), confirmCOD);

// ── Customer order history ──
router.get('/', authenticate, authorizeRole('customer'), getMyOrders);

// ── Farmer orders ──
router.get('/farmer', authenticate, authorizeRole('farmer'), getFarmerOrders);

// ── Order details (customer, farmer, admin) ──
router.get('/:id', authenticate, getOrderById);

// ── Update order status (farmer + admin) ──
router.put('/:id/status', authenticate, updateOrderStatus);

module.exports = router;

