const express = require('express');
const {
  getProfile,
  updateProfile,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress
} = require('../controllers/profileController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Profile routes
router.get('/', getProfile);
router.put('/', updateProfile);

// Address routes
router.get('/addresses', getAddresses);
router.post('/addresses', createAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

module.exports = router;

