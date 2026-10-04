/**
 * Product.js — Mongoose Product Model
 *
 * WHAT IT IS:
 *   Blueprint for product documents in MongoDB. Each product can also embed
 *   customer reviews as an array of sub-documents.
 *
 * KEY DESIGN DECISIONS:
 *   - Reviews are EMBEDDED (not a separate collection) because they are always
 *     loaded with the product — you never need a review without its product.
 *   - `averageRating` and `numOfReviews` are denormalized fields kept in sync
 *     by the pre-save hook so product cards can display ratings without
 *     expensive aggregation queries.
 *   - `inStock` is auto-calculated from `stock` via a pre-save hook.
 *   - `user` inside each review references the User model, giving us a link
 *     back to the reviewer's account while preserving their display name.
 */

const mongoose = require('mongoose');
  const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',        // Links to User model for cross-referencing
      required: true,
    },
    name: {
      type: String,
      required: true,     // Display name snapshot at time of review
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
    },
  },
  { timestamps: true }
);

// ─── Product Schema ────────────────────────────────────────────────────────────
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      required: [true, 'Product image URL is required'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    inStock: {
      type: Boolean,
      default: true, // Will be auto-updated by pre-save hook
    },

    // ─── Embedded Reviews Array ──────────────────────────────────────────────
    reviews: [reviewSchema],

    // Denormalized fields — kept in sync by pre-save hook for fast reads
    averageRating: {
      type: Number,
      default: 3.5,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save Hook — Auto-manage inStock flag and recalculate review stats
 *
 * Runs before every product.save().
 * This keeps derived fields (`inStock`, `averageRating`, `numOfReviews`)
 * always in sync with the actual data without requiring separate update calls.
 */
productSchema.pre('save', function () {
  // ── Stock → inStock sync ───────────────────────────────────────────────────
  this.inStock = this.stock > 0;

  // ── Recalculate review statistics ─────────────────────────────────────────
  if (this.reviews && this.reviews.length > 0) {
    this.numOfReviews = this.reviews.length;
    const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = totalRating / this.reviews.length;
  } else {
    this.numOfReviews = 0;
    this.averageRating = 0;
  }

 return;
});

module.exports = mongoose.model('Product', productSchema);
