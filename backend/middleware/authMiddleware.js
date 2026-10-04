/**
 * authMiddleware.js — JWT Authentication Middleware
 *
 * WHAT IT IS:
 *   Express middleware that intercepts incoming requests and verifies
 *   that the caller is who they claim to be.
 *
 * WHY WE NEED IT:
 *   Without this, any anonymous request could access private endpoints.
 *   This acts as the "gatekeeper" — every protected route passes through here
 *   BEFORE reaching the controller.
 *
 * HOW IT WORKS:
 *   1. Reads the Authorization header (format: "Bearer <token>")
 *   2. Extracts the token string
 *   3. Verifies it using the same JWT_SECRET used to sign it
 *   4. Decodes the payload (which contains `id` and `role`)
 *   5. Fetches the user from the DB to ensure they still exist
 *   6. Attaches the user to `req.user` so downstream controllers can use it
 *   7. Calls `next()` to pass control to the next middleware/controller
 *
 * WHERE IT BELONGS:
 *   This middleware is applied to any route that requires a logged-in user.
 *   Example in routes: router.get('/profile', protect, getProfile)
 */

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

/**
 * protect — Verifies JWT and attaches req.user
 * Applied to any route that requires authentication.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

 // Check if the Authorization header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token part after "Bearer "
      token = req.headers.authorization.split(' ')[1];

      // Verify the token. jwt.verify() throws an error if:
      //   - The token is malformed
      //   - The signature doesn't match (tampered token)
      //   - The token has expired
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from the database using the ID from the token.
      // We use .select('-password') to ensure the password hash is excluded.
      // This is important: we verify the user still EXISTS in the database.
      // (They might have been deleted after the token was issued.)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found — token may be stale');
      }

      next(); // ✅ Authentication passed — proceed to the route handler
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401);
      throw new Error('Not authorized — invalid or expired token');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized — no token provided');
  }
});

module.exports = { protect };
