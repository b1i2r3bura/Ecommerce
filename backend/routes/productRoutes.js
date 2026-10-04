/**
 * productRoutes.js — Product & Review Route Definitions
 *
 * Middleware chain example for admin route:
 *   router.post('/', protect, adminOnly, createProduct)
 *   //             ↑ Verify JWT   ↑ Verify admin role  ↑ Run controller
 */

const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  deleteReview,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

// ── Public routes ─────────────────────────────────────────────────────────────
router.get('/', getProducts);
router.get('/:id', getProductById);

// ── Admin-only routes ─────────────────────────────────────────────────────────
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

// ── Review routes ─────────────────────────────────────────────────────────────
router.post('/:id/reviews', protect, addReview);                         // Customer
router.delete('/:id/reviews/:reviewId', protect, adminOnly, deleteReview); // Admin

module.exports = router;
