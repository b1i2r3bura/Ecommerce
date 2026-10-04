/**
 * authController.js — Authentication Logic (Register & Login)
 *
 * WHAT IT IS:
 *   Controller functions handle the actual business logic for a route.
 *   The route file maps URLs to these functions; the controller does the work.
 *
 * FLOW:
 *   POST /api/auth/register  →  authRoutes.js  →  registerUser (here)
 *   POST /api/auth/login     →  authRoutes.js  →  loginUser (here)
 *
 * WHY express-async-handler?
 *   When we use async/await in Express route handlers, errors thrown inside
 *   async functions don't automatically reach Express's error handler.
 *   `asyncHandler` wraps the function and calls next(err) for us automatically.
 *   This lets us write clean code without try/catch blocks everywhere.
 */

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Register a new customer
// @route   POST /api/auth/register
// @access  Public (no token required)
// ─────────────────────────────────────────────────────────────────────────────
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // ── Input validation ────────────────────────────────────────────────────────
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  // ── Check for duplicate email ───────────────────────────────────────────────
  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  // ── Create the user ─────────────────────────────────────────────────────────
  // Note: We pass the PLAIN TEXT password here.
  // The User model's pre-save hook will hash it automatically before saving.
  const user = await User.create({
    name,
    email,
    password, // ← Will be hashed by the pre-save hook in User.js
  });

  // ── Send response ───────────────────────────────────────────────────────────
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role), // JWT for immediate login after register
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Login user and return JWT token
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // ── Input validation ────────────────────────────────────────────────────────
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // ── Find user by email ──────────────────────────────────────────────────────
  // We must use .select('+password') because the password field has select:false
  // by default (it's never returned in normal queries to protect it).
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password'); // Intentionally vague for security
  }

  // ── Compare password ────────────────────────────────────────────────────────
  // user.matchPassword() is the instance method we defined in User.js.
  // bcrypt.compare safely checks the plain-text input against the stored hash.
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password'); // Same message — don't leak which field is wrong
  }

  // ── Success: return user info + token ───────────────────────────────────────
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role), //
  });
});

module.exports = { registerUser, loginUser };
