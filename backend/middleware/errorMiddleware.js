/**
 * errorMiddleware.js — Centralized Error Handling
 *
 * WHAT IT IS:
 *   Two special Express middleware functions that catch and format all errors
 *   thrown anywhere in the application.
 *
 * WHY WE NEED IT:
 *   Without centralized error handling, every controller would need its own
 *   try/catch and its own error response format. Centralizing it means:
 *   - Consistent JSON error responses every time
 *   - One place to add logging in the future
 *   - Cleaner controllers (especially when using express-async-handler)
 *
 * HOW IT WORKS:
 *   Express identifies error-handling middleware by the FOUR-PARAMETER signature:
 *   (err, req, res, next) — always four arguments, even if you don't use next.
 *
 *   When a controller does: throw new Error('Something went wrong')
 *   express-async-handler catches the async error and passes it to next(err),
 *   which routes it here automatically.
 *
 * WHERE IT BELONGS:
 *   These must be registered in server.js AFTER all routes, as the last
 *   middleware in the chain.
 */

/**
 * notFound — Handles requests to undefined routes.
 * Returns a 404 error.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass to errorHandler
};

/**
 * errorHandler — Formats all errors as consistent JSON responses.
 *
 * In development: includes the full stack trace for debugging.
 * In production:  hides the stack trace for security.
 */
const errorHandler = (err, req, res, next) => {
  // If the response status was already set (e.g., res.status(400) before throw),
  // use that. Otherwise default to 500 Internal Server Error.
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    // Stack trace only in development — never expose this in production!
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
