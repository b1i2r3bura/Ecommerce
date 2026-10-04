/**
 * userRoutes.js — User Profile & Admin User Management Routes
 *
 * IMPORTANT: '/profile' must be defined BEFORE '/:id'
 * Otherwise Express would match "profile" as a user ID.
 */

const express = require('express');
const router = express.Router();

const {
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  getUserById,
  deleteUser,
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

// ── Customer routes (own profile) ─────────────────────────────────────────────
router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, updateMyProfile);

// ── Admin routes ──────────────────────────────────────────────────────────────
router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, adminOnly, getUserById);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
