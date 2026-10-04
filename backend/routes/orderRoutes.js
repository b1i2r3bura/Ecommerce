/**
 * orderRoutes.js — Order Route Definitions
 *
 * IMPORTANT: '/myorders' must be defined BEFORE '/:id'
 * Otherwise Express would try to match "myorders" as an order ID.
 */

const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

// ── Customer routes ───────────────────────────────────────────────────────────
router.post('/', protect, placeOrder);                        // Place order
router.get('/myorders', protect, getMyOrders);                // Own orders
router.get('/:id', protect, getOrderById);                    // Single order (own or admin)

// ── Admin routes ──────────────────────────────────────────────────────────────
router.get('/', protect, adminOnly, getAllOrders);             // All orders
router.put('/:id/status', protect, adminOnly, updateOrderStatus); // Update status

module.exports = router;
