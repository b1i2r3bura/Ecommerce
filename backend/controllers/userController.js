/**
 * userController.js — User Profile & Admin User Management
 *
 * ROUTE → CONTROLLER MAPPING:
 *   GET    /api/users/profile  → getMyProfile (customer)
 *   PUT    /api/users/profile  → updateMyProfile (customer)
 *   GET    /api/users          → getAllUsers (admin)
 *   GET    /api/users/:id      → getUserById (admin)
 *   DELETE /api/users/:id      → deleteUser (admin)
 */

      const asyncHandler = require('express-async-handler'); // uses to handle async errors in express routes
const User = require('../models/User');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get current user's profile
// @route   GET /api/users/profile
// @access  Private (Customer)
// ─────────────────────────────────────────────────────────────────────────────
const getMyProfile = asyncHandler(async (req, res) => {
  // req.user is already populated by authMiddleware (without password)
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200)
  . json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update current user's profile (name, email, password)
// @route   PUT /api/users/profile
// @access  Private (Customer)
// ─────────────────────────────────────────────────────────────────────────────
const updateMyProfile = asyncHandler(async (req, res) => {
  // We fetch the user with the password field so we can update/hash it if needed
  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update only what was provided
  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email.toLowerCase();

  // If the user wants to change their password, they provide the new one here.
  // The pre-save hook in User.js will re-hash it automatically.
  if (req.body.password) {
    user.password = req.body.password; // Pre-save hook will hash this
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    token: require('../utils/generateToken')(updatedUser._id, updatedUser.role),
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const getAllUsers = asyncHandler(async (req, res) => {
  // Never return passwords — they are excluded by default due to select:false
  const users = await User.find({}).sort({ createdAt: -1 }); // createdAt descending order (newest first)
  res.json(users);
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get user by ID (admin)
// @route   GET /api/users/:id
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user);
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a user (admin)
// @route   DELETE /api/users/:id
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent an admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot delete your own account');
  }

  await user.deleteOne();
  res.json({ message: 'User removed successfully' });
});

module.exports = { getMyProfile, updateMyProfile, getAllUsers, getUserById, deleteUser };
