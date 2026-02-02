const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const inventoryController = require('../controllers/inventoryController');

// All inventory routes require authentication and farmer role

// Adjust stock for a product
router.post(
  '/products/:productId/adjust',
  authenticate,
  authorizeRole('farmer'),
  inventoryController.adjustStock
);

// Get stock history for a specific product
router.get(
  '/products/:productId/history',
  authenticate,
  authorizeRole('farmer'),
  inventoryController.getStockHistory
);

// Get all stock history for farmer
router.get(
  '/history',
  authenticate,
  authorizeRole('farmer'),
  inventoryController.getFarmerStockHistory
);

// Get low stock products
router.get(
  '/low-stock',
  authenticate,
  authorizeRole('farmer'),
  inventoryController.getLowStockProducts
);

// Update stock alert settings
router.put(
  '/products/:productId/alert-settings',
  authenticate,
  authorizeRole('farmer'),
  inventoryController.updateStockAlertSettings
);

// Get inventory summary
router.get(
  '/summary',
  authenticate,
  authorizeRole('farmer'),
  inventoryController.getInventorySummary
);

module.exports = router;

