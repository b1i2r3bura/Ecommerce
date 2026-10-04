/**
 * authRoutes.js — Authentication Route Definitions
 *
 * WHAT IT IS:
 *   An Express Router that maps HTTP methods + URL paths to controller functions.
 *
 * WHY WE NEED IT:
 *   Keeping routes separate from controllers keeps each file focused on one job.
 *   The router only cares about WHAT URL maps to WHAT function.
 *   The controller only cares about WHAT the function does.
 *
 * HOW IT CONNECTS:
 *   server.js mounts this router at '/api/auth':
 *     app.use('/api/auth', authRoutes)
 *   So:
 *     POST /api/auth/register  →  registerUser controller
 *     POST /api/auth/login     →  loginUser controller
 */

const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Public routes — no authentication required
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
