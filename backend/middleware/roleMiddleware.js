/**
 * roleMiddleware.js — Role-Based Authorization Middleware
 *
 * WHAT IT IS:
 *   A factory function that returns Express middleware for role checking.
 *   It ALWAYS runs AFTER `protect` (authMiddleware) because it needs `req.user`.
 *
 * WHY WE NEED IT:
 *   Authentication (authMiddleware) answers "Who are you?"
 *   Authorization (roleMiddleware) answers "Are you ALLOWED to do this?"
 *   Some routes should only be accessible by admins (e.g., delete a product).
 *
 * HOW IT WORKS:
 *   - `adminOnly` is a middleware that checks if `req.user.role === 'admin'`.
 *   - If the role matches, it calls next() and the request continues.
 *   - If not, it returns 403 Forbidden.
 *
 * USAGE IN ROUTES:
 *   import { protect } from './authMiddleware'
 *   import { adminOnly } from './roleMiddleware'
 *
 *   router.delete('/products/:id', protect, adminOnly, deleteProduct)
 *   //                              ↑              ↑
 *   //                      Verify JWT     Verify admin role
 *
 * SECURITY NOTE:
 *   Frontend route guards (like hiding the admin link in the nav) are ONLY
 *   for user experience. The backend middleware is the REAL security layer.
 *   An attacker can bypass React entirely and call the API directly.
 */

/**
 * adminOnly — Restricts route access to users with the 'admin' role.
 * Must be used AFTER the `protect` middleware.
 */
const adminOnly = (req, res, next) => {
  // `req.user` was attached by the `protect` middleware
  if (req.user && req.user.role === 'admin') {
    next(); // ✅ User is an admin — proceed
  } else {
    res.status(403); // 403 Forbidden (different from 401 Unauthorized)
    throw new Error('Access denied — admin privileges required');
  }
};

module.exports = { adminOnly };
