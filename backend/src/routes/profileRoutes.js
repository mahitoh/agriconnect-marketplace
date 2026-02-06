const express = require('express');
const {
  getProfile,
  updateProfile,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress
} = require('../controllers/profileController');
const { uploadProfileImage } = require('../controllers/uploadController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/multer');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Profile routes
router.get('/', getProfile);
router.put('/', updateProfile);

// Profile image upload route
router.post('/upload-image', upload.single('image'), uploadProfileImage);

// Address routes
router.get('/addresses', getAddresses);
router.post('/addresses', createAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

module.exports = router;

