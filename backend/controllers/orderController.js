/**
 * orderController.js — Order Placement & Management
 *
 * KEY SECURITY PRINCIPLE:
 * 
 *   The frontend sends a list of product IDs and quantities.
 *   The BACKEND re-fetches prices from the database and recalculates
 *   everything (subtotal, tax, total). We NEVER trust the prices
 *   sent by the client — they could be tampered with.
 *
 * ROUTE → CONTROLLER MAPPING:
 *   POST /api/orders            → placeOrder (customer)
 *   GET  /api/orders/myorders   → getMyOrders (customer)
 *   GET  /api/orders/:id        → getOrderById (customer own / admin)
 *   GET  /api/orders            → getAllOrders (admin)
 *   PUT  /api/orders/:id/status → updateOrderStatus (admin)
 */

const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

const TAX_RATE = 0.15; // 15% tax — defined once, used consistently

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Place a new order (checkout)
// @route   POST /api/orders
// @access  Private (Customer)
// ─────────────────────────────────────────────────────────────────────────────
const placeOrder = asyncHandler(async (req, res) => {
  const { items } = req.body; // items: [{ productId, quantity }, ...]

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No items in order');
  }

  // ── Fetch live product data and validate stock ──────────────────────────
  // We fetch every product from the DB to get authoritative prices and stock.
  const orderItems = [];
  let subTotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.productId}`);
    }

    // ── Stock check: prevent ordering more than available ─────────────────
    if (item.quantity > product.stock) {
      res.status(400);
      throw new Error(
        `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`
      );
    }

    if (product.stock === 0) {
      res.status(400);
      throw new Error(`"${product.name}" is out of stock`);
    }

    // ── Build a snapshot of this item ─────────────────────────────────────
    // We copy the name and price from the DB — NOT from the frontend.
    // This "freezes" the historical data even if the product changes later.
    orderItems.push({
      product: product._id,
      name: product.name,       // Snapshot
      price: product.price,     // Snapshot (authoritative)
      image: product.image,     // Snapshot
      quantity: item.quantity,
    });

    // ── Accumulate subtotal using server-side price ───────────────────────
    subTotal += product.price * item.quantity;
  }

  // ── Calculate tax and total server-side ──────────────────────────────────
  const taxAmount = parseFloat((subTotal * TAX_RATE).toFixed(2));
  const totalAmount = parseFloat((subTotal + taxAmount).toFixed(2));

  // ── Create the order in the database ─────────────────────────────────────
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    subTotal: parseFloat(subTotal.toFixed(2)),
    taxAmount,
    totalAmount,
  });

  // ── Decrement stock for each ordered product ──────────────────────────────
  // This happens AFTER the order is created successfully.
  // In production this would be a database transaction, but for v1 this works.
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { stock: -item.quantity } } // Atomically decrement stock
    );

    // Note: the Product's pre-save hook (inStock recalculation) does NOT run
    // with findByIdAndUpdate. We handle inStock with a separate update:
    const updatedProduct = await Product.findById(item.product);
    if (updatedProduct) {
      updatedProduct.inStock = updatedProduct.stock > 0;
      await updatedProduct.save();
    }
  }

  // ── Return the created order ──────────────────────────────────────────────
  const populatedOrder = await Order.findById(order._id);
  res.status(201).json(populatedOrder);
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get the currently logged-in customer's orders
// @route   GET /api/orders/myorders
// @access  Private (Customer)
// ─────────────────────────────────────────────────────────────────────────────
const getMyOrders = asyncHandler(async (req, res) => {
  // req.user._id comes from the JWT via authMiddleware
  // Security: customers can ONLY see their own orders — no way to see others'
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get a single order by ID
// @route   GET /api/orders/:id
// @access  Private (Customer own order OR Admin)
// ─────────────────────────────────────────────────────────────────────────────
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // ── Authorization check ───────────────────────────────────────────────────
  // A customer can only view their OWN orders.
  // An admin can view ANY order.
  const isOwner = order.user._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json(order);
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all orders (admin dashboard)
// @route   GET /api/orders
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
