const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');

// Public marketplace endpoints (no authentication required)

// Browse all products with filters, search, and pagination
router.get('/products', marketplaceController.browseProducts);

// Get a single product by ID
router.get('/products/:id', marketplaceController.getProductById);

// Get products from a specific farmer
router.get('/farmers/:farmerId/products', marketplaceController.getFarmerProducts);

// Get featured/popular products
router.get('/featured', marketplaceController.getFeaturedProducts);

// Get all available categories
router.get('/categories', marketplaceController.getCategories);

// Search farmers
router.get('/farmers', marketplaceController.searchFarmers);

// Get farmer profile with products and ratings
router.get('/farmers/:farmerId', marketplaceController.getFarmerProfile);

module.exports = router;

