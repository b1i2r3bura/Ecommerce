/**
 * productController.js — Product CRUD, Search, Filtering & Reviews
 *
 * WHAT IT IS:
 *   All the business logic for managing products.
 *
 * ROUTE → CONTROLLER MAPPING (see productRoutes.js):
 *   GET    /api/products           → getProducts  (public, search + filter)
 *   GET    /api/products/:id       → getProductById  (public)
 *   POST   /api/products           → createProduct  (admin)
 *   PUT    /api/products/:id       → updateProduct  (admin)
 *   DELETE /api/products/:id       → deleteProduct  (admin)
 *   POST   /api/products/:id/reviews → addReview (customer, must have purchased)
 *   DELETE /api/products/:id/reviews/:reviewId → deleteReview (admin)
 */

const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Order = require('../models/Order');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all products with search, filter, and sort
// @route   GET /api/products?search=phone&category=electronics&sort=price
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, sort, minPrice, maxPrice } = req.query; // where search, category , sort, min price, max price came from? they came from the query parameters in the URL. For example, if the request URL is /api/products?search=phone&category=electronics&sort=price, then req.query will be an object like { search: 'phone', category: 'electronics', sort: 'price' }. The code is destructuring these values from req.query to use them for filtering and sorting the products in the database.

  // Build a query object dynamically based on provided filters
  const queryObj = {};

  // ── Search by name (case-insensitive partial match) ──────────────────────
  if (search) {
    queryObj.name = { $regex: search, $options: 'i' }; //regex is used for pattern matching in MongoDB queries. In this case, it allows for partial matches of the product name based on the search term provided in the query parameters. The $options: 'i' makes the search case-insensitive, so it will match names regardless of whether they are uppercase or lowercase. 
  }

  // ── Filter by category (exact match, case-insensitive) ────────────────────
  if (category && category !== 'all') {
    queryObj.category = { $regex: `^${category}$`, $options: 'i' };
  }

  // ── Price range filter ─────────────────────────────────────────────────────
  if (minPrice || maxPrice) {
    queryObj.price = {};
    if (minPrice) queryObj.price.$gte = Number(minPrice);
    if (maxPrice) queryObj.price.$lte = Number(maxPrice);
  }

  // ── Build the sort object ──────────────────────────────────────────────────
  let sortObj = { createdAt: -1 }; // Default: newest first
  if (sort === 'price-asc') sortObj = { price: 1 };
  if (sort === 'price-desc') sortObj = { price: -1 };
  if (sort === 'rating') sortObj = { averageRating: -1 };

  const products = await Product.find(queryObj).sort(sortObj);

  // Also return distinct categories for the filter UI
  const categories = await Product.distinct('category');

  res.json({ products, categories });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate( 
    'reviews.user',
    'name' // Only populate the reviewer's name from the User collection
  );

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create a new product
// @route   POST /api/products
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, image, category, stock } = req.body;

  if (!name || !description || price === undefined || !image || !category || stock === undefined) {
    res.status(400);
    throw new Error('Please provide all required product fields');
  }

  const product = await Product.create({
    name,
    description,
    price,
    image,
    category,
    stock,
  });

  res.status(201).json(product);
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Update only the fields that were provided in the request
  const { name, description, price, image, category, stock } = req.body;

  product.name = name ?? product.name;
  product.description = description ?? product.description;
  product.price = price ?? product.price;
  product.image = image ?? product.image;
  product.category = category ?? product.category;
  product.stock = stock ?? product.stock;
  // `inStock` will be recalculated by the pre-save hook

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  res.json({ message: 'Product removed successfully' });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Add a review to a product
// @route   POST /api/products/:id/reviews
// @access  Private (Customer — must have purchased the item)
// ─────────────────────────────────────────────────────────────────────────────
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    res.status(400);
    throw new Error('Please provide a rating and comment');
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // ── Verify the user has actually purchased this product ──────────────────
  const hasPurchased = await Order.findOne({
    user: req.user._id,
    'items.product': product._id,
    status: { $in: ['delivered', 'shipped', 'processing'] }, // Must have a real order
  });

  if (!hasPurchased) {
    res.status(403);
    throw new Error('You can only review products you have purchased');
  }

  // ── Prevent duplicate reviews ────────────────────────────────────────────
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  // ── Add the new review ───────────────────────────────────────────────────
  const review = {
    user: req.user._id,
    name: req.user.name, // Snapshot reviewer's name
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  // pre-save hook will recalculate averageRating and numOfReviews
  await product.save();

  res.status(201).json({ message: 'Review added successfully' });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a review (admin moderation)
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const deleteReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Filter out the review with the matching ID
  const reviewIndex = product.reviews.findIndex(
    (r) => r._id.toString() === req.params.reviewId
  );

  if (reviewIndex === -1) {
    res.status(404);
    throw new Error('Review not found');
  }

  product.reviews.splice(reviewIndex, 1);
  // pre-save hook will recalculate averageRating and numOfReviews
  await product.save();

  res.json({ message: 'Review deleted successfully' });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  deleteReview,
};
