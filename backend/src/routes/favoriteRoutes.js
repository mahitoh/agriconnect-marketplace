const express = require('express');
const {
  addFavorite,
  getFavorites,
  removeFavorite,
  checkFavorite
} = require('../controllers/favoriteController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication (any role can have favorites)
router.use(authenticate);

// Add to favorites
router.post('/', addFavorite);

// Get all favorites
router.get('/', getFavorites);

// Check if favorited
router.get('/check/:productId', checkFavorite);

// Remove from favorites
router.delete('/:productId', removeFavorite);

module.exports = router;

