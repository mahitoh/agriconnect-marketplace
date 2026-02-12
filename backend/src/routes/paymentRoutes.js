const express = require('express');
const {
  initiatePayment,
  checkPaymentStatus,
  paymentCallback
} = require('../controllers/paymentController');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Payment endpoints require authentication (except callback)
router.post('/initiate', authenticate, authorizeRole('customer'), initiatePayment);
router.get('/status/:referenceId', authenticate, checkPaymentStatus);

// MTN callback webhook (no auth — called by MTN servers)
router.post('/callback', paymentCallback);

module.exports = router;
