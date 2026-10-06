/**
 * server.js — Express Application Entry Point
 *
 * WHAT IT IS:
 *   The main file that bootstraps and configures the entire Express server.
 *
 * WHAT IT DOES (in order):
 *   1. Loads environment variables from .env (must be first!)
 *   2. Connects to MongoDB Atlas
 *   3. Creates the Express app
 *   4. Registers global middleware (JSON parser, CORS)
 *   5. Mounts all route groups at their base paths
 *   6. Registers error handling middleware (always LAST)
 *   7. Starts listening on the configured port
 *
 * WHY THIS STRUCTURE:
 *   By keeping server.js minimal and delegating to route files, the codebase
 *   stays readable as it grows. Each route file knows its own routes;
 *   server.js just wires everything together.
 */

require('dotenv').config(); // ← Must be first: loads .env variables into process.env

const express = require('express');
const cors = require('cors');
const connectDB = require('./backend/config/db');
const { notFound, errorHandler } = require('./backend/middleware/errorMiddleware');

const path = require('path');

const authRoutes = require('./backend/routes/authRoutes');
const productRoutes = require('./backend/routes/productRoutes');
const orderRoutes = require('./backend/routes/orderRoutes');
const userRoutes = require('./backend/routes/userRoutes');
const uploadRoutes = require('./backend/routes/uploadRoutes');
const contactRoutes = require('./backend/routes/contactRoutes');

// ── Connect to MongoDB Atlas ───────────────────────────────────────────────────
connectDB();

const app = express();

// ── Global Middleware ──────────────────────────────────────────────────────────

// CORS — allows our React frontend (on any port or local network IP) to make requests.
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman) or any local dev origin
      if (!origin) return callback(null, true);
      
      const isLocalOrLAN =
        origin.startsWith('http://localhost') ||
        origin.startsWith('http://127.0.0.1') ||
        origin.startsWith('http://192.168.') ||
        origin.startsWith('http://10.') ||
        origin.startsWith('http://172.') ||
        origin === process.env.FRONTEND_URL;

      if (isLocalOrLAN) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev to guarantee connectivity
      }
    },
    credentials: true,
  })
);

// JSON body parser — lets us access req.body in controllers
app.use(express.json());

// URL-encoded body parser — handles form submissions
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded product images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Health check route ────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'E-Commerce API is running' });
});

// ── Mount API Routes ──────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);       // POST /api/auth/register, /api/auth/login
app.use('/api/products', productRoutes); // GET/POST/PUT/DELETE /api/products
app.use('/api/orders', orderRoutes);    // POST/GET /api/orders
app.use('/api/users', userRoutes);      // GET/PUT /api/users/profile
app.use('/api/upload', uploadRoutes);    // POST /api/upload (Admin file upload)
app.use('/api/contact', contactRoutes);  // POST/GET/DELETE /api/contact

// ── Error Handling Middleware ─────────────────────────────────────────────────
// These must be LAST — after all routes are mounted.
// notFound: catches any request that didn't match a route (404)
// errorHandler: formats all errors as JSON (including errors thrown in controllers)
app.use(notFound);
app.use(errorHandler);

// ── Start the Server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
