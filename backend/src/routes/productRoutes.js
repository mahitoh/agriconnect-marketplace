const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorizeRole } = require('../middleware/auth');
const upload = require('../middleware/multer');
const {
  createProduct,
  getFarmerProducts,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getDashboardStats
} = require('../controllers/productController');
const { uploadProductImage } = require('../controllers/uploadController');

const router = express.Router();

/**
 * POST /api/products/upload-image
 * Upload product image (farmer only)
 */
router.post(
  '/upload-image',
  authenticate,
  authorizeRole('farmer'),
  upload.single('image'),
  uploadProductImage
);

// Validation middleware
const validateProduct = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('description').optional().trim(),
  body('harvestLocation').optional().trim(),
  body('imageUrl').optional().trim().isURL().withMessage('Image URL must be valid')
];

// Public routes
/**
 * GET /api/products
 * Get all products (public, filtered by status=active)
 */
router.get('/', getAllProducts);

// Protected routes (require authentication)
/**
 * POST /api/products
 * Create a new product (farmer only)
 */
router.post(
  '/',
  authenticate,
  authorizeRole('farmer'),
  validateProduct,
  createProduct
);

/**
 * GET /api/products/dashboard/stats
 * Get farmer dashboard statistics
 */
router.get(
  '/dashboard/stats',
  authenticate,
  authorizeRole('farmer'),
  getDashboardStats
);

/**
 * GET /api/products/farmer/my-products
 * Get all products for authenticated farmer
 */
router.get('/farmer/my-products', authenticate, authorizeRole('farmer'), getFarmerProducts);

/**
 * GET /api/products/farmer/:farmerId
 * Get all products for a specific farmer
 */
router.get('/farmer/:farmerId', getFarmerProducts);

/**
 * PUT /api/products/:id
 * Update a product (farmer only)
 */
router.put(
  '/:id',
  authenticate,
  authorizeRole('farmer'),
  validateProduct,
  updateProduct
);

/**
 * DELETE /api/products/:id
 * Delete a product (farmer only)
 */
router.delete(
  '/:id',
  authenticate,
  authorizeRole('farmer'),
  deleteProduct
);

/**
 * GET /api/products/:id
 * Get single product by ID (public)
 */
router.get('/:id', getProduct);

module.exports = router;

