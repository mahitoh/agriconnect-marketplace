const express = require('express');
const {
  addFavorite,
  getFavorites,
  removeFavorite,
  checkFavorite
} = require('../controllers/favoriteController');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// All routes require customer authentication
router.use(authenticate);
router.use(authorizeRole('customer'));

// Add to favorites
router.post('/', addFavorite);

// Get all favorites
router.get('/', getFavorites);

// Check if favorited
router.get('/check/:productId', checkFavorite);

// Remove from favorites
router.delete('/:productId', removeFavorite);

module.exports = router;

