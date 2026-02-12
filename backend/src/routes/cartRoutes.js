const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart
} = require('../controllers/cartController');

// All cart routes require authentication
router.use(authenticate);

// Get user's cart
router.get('/', getCart);

// Add item to cart
router.post('/items', addToCart);

// Update cart item quantity
router.put('/items/:cartItemId', updateCartItem);

// Remove item from cart
router.delete('/items/:cartItemId', removeFromCart);

// Clear entire cart
router.delete('/', clearCart);

module.exports = router;
