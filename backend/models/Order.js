/**
 * Order.js — Mongoose Order Model
 *
 * WHAT IT IS:
 *   Blueprint for order documents. Each order captures a snapshot of what
 *   was purchased, who purchased it, and calculated financial totals.
 *
 * KEY DESIGN DECISIONS:
 *   - `items` stores a SNAPSHOT of name and price at the moment of purchase.
 *     This is critical: if an admin changes a product's price later, old orders
 *     must still reflect what the customer actually paid. We never store just
 *     a product ID in items — we also copy the name and price at checkout.
 *   - `product` ObjectId in items allows navigating back to the original product,
 *     but the displayed name/price always comes from the snapshot fields.
 *   - Tax (15%) and totals are always calculated server-side (orderController.js).
 *     We NEVER trust the total sent from the frontend.
 *   - `status` enum tracks the order lifecycle.
 */

const mongoose = require('mongoose');

// ─── Order Item Sub-document ──────────────────────────────────────────────────
// Each item in the order freezes a snapshot of the product at purchase time.
const orderItemSchema = new mongoose.Schema({
  // name , description, price, image, category, stock, inStock, reviews, averageRating, numOfReviews are in the product.js
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true, // Snapshot of product name at time of purchase
  },
  price: {
    type: Number,
    required: true, // Snapshot of price at time of purchase
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,  // Snapshot of image URL
  },
});

// ─── Order Schema ─────────────────────────────────────────────────────────────
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a user'],
    },
    items: [orderItemSchema], // Array of item snapshots

    // ── Financial breakdown (all calculated server-side) ────────────────────
    subTotal: {
      type: Number,
      required: true,
      min: 0, // Sum of (price × quantity) for all items
    },
    taxAmount: {
      type: Number,
      required: true,
      min: 0, // 15% of subTotal
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0, // subTotal + taxAmount
    },

    // ── Order lifecycle ──────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true, // createdAt = order date
  }
);

module.exports = mongoose.model('Order', orderSchema);
