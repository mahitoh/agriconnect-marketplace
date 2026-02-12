const mtnPayment = require('../services/mtnPayment');
const { v4: uuidv4 } = require('uuid');

// ─── Sandbox auto-approval ──────────────────────────────────
const pendingCounts = new Map();
const SANDBOX_AUTO_APPROVE_AFTER = 3;

// ─── POST /api/payment/initiate ─────────────────────────────
// Requires auth. Accepts orderIds[] so we can link payment to orders.

const initiatePayment = async (req, res, next) => {
  try {
    const { phoneNumber, amount, orderIds } = req.body;

    if (!phoneNumber || !amount) {
      return res.status(400).json({ success: false, message: 'phoneNumber and amount are required' });
    }
    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be greater than 0' });
    }
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ success: false, message: 'orderIds are required' });
    }

    const externalId = uuidv4();
    const result = await mtnPayment.requestToPay(phoneNumber, amount, externalId);

    return res.status(200).json({
      success: true,
      message: 'Payment request sent. Approve on your phone.',
      referenceId: result.referenceId,
      externalId,
      orderIds
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Payment initiation failed'
    });
  }
};

// ─── GET /api/payment/status/:referenceId ───────────────────
// Poll payment status. Sandbox auto-approves after N polls.

const checkPaymentStatus = async (req, res, next) => {
  try {
    const { referenceId } = req.params;

    if (!referenceId) {
      return res.status(400).json({ success: false, message: 'referenceId is required' });
    }

    const status = await mtnPayment.checkPaymentStatus(referenceId);

    // Sandbox auto-approval
    let finalStatus = status.status;
    if (finalStatus === 'PENDING' && process.env.MTN_ENVIRONMENT === 'sandbox') {
      const count = (pendingCounts.get(referenceId) || 0) + 1;
      pendingCounts.set(referenceId, count);
      console.log(`⏳ Sandbox PENDING poll #${count} for ${referenceId}`);
      if (count >= SANDBOX_AUTO_APPROVE_AFTER) {
        console.log(`✅ Sandbox auto-approving payment ${referenceId} after ${count} polls`);
        finalStatus = 'SUCCESSFUL';
        pendingCounts.delete(referenceId);
      }
    } else {
      pendingCounts.delete(referenceId);
    }

    return res.status(200).json({
      success: true,
      referenceId,
      paymentStatus: finalStatus,
      amount: status.amount,
      currency: status.currency,
      reason: status.reason
    });
  } catch (error) {
    console.error('Status check error:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to check payment status'
    });
  }
};

// ─── POST /api/payment/callback ─────────────────────────────
const paymentCallback = async (req, res) => {
  console.log('📥 MTN Callback received:', req.body);
  return res.status(200).json({ success: true });
};

module.exports = {
  initiatePayment,
  checkPaymentStatus,
  paymentCallback
};
