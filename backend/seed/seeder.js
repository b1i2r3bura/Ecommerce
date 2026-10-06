require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Contact = require('../models/Contact');
const users = require('./users');
const products = require('./products');

// Connect to MongoDB Atlas
connectDB();

/**
 * Import Seed Data
 */
const importData = async () => {
  try {
    console.log('🧹 Clearing existing database records...');
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Contact.deleteMany();

    console.log('👤 Inserting default user accounts (Admin + Customers)...');
    // Using create() triggers pre-save bcrypt password hashing hook
    const createdUsers = [];
    for (const user of users) {
      const created = await User.create(user);
      createdUsers.push(created);
    }
    const adminUser = createdUsers[0];

    console.log('📦 Inserting product catalog...');
    const sampleProducts = products.map((product) => ({
      ...product,
      user: adminUser._id,
    }));
    await Product.insertMany(sampleProducts);

    console.log('📨 Inserting welcome contact inquiry...');
    await Contact.create({
      name: 'Welcome Inquiry',
      email: 'hello@ateliergoods.com',
      subject: 'Studio Setup & Wholesale Questions',
      message: 'Hello! I love the collection and would love to know more about shipping timelines for custom orders.',
      status: 'unread',
    });

    console.log('✨ Data successfully seeded into MongoDB Atlas!');
    console.log(`- ${createdUsers.length} Users created (Admin: admin@example.com / password123)`);
    console.log(`- ${sampleProducts.length} Products inserted`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Destroy All Data
 */
const destroyData = async () => {
  try {
    console.log('⚠️ Destroying all database records...');
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Contact.deleteMany();

    console.log('💥 All database records wiped cleanly.');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Destroy failed: ${error.message}`);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === '--destroy') {
  destroyData();
} else {
  importData();
}
