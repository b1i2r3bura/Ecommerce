/**
 * User.js — Mongoose User Model
 *
 * WHAT IT IS:
 *   This is the "blueprint" for every user document stored in MongoDB.
 *   Mongoose uses this schema to validate data before it reaches the database.
 *
 * WHY WE NEED IT:
 *   We need a consistent shape for user data. By defining it here, we get
 *   automatic validation, defaults, and hooks in one place.
 *
 * KEY DESIGN DECISIONS:
 *   - `password` has `select: false` → it is NEVER returned by default in
 *     any query. You must explicitly call .select('+password') when you need
 *     to compare passwords during login.
 *   - `role` enum restricts values to 'customer' or 'admin' only.
 *   - The pre-save hook automatically hashes the password with bcryptjs
 *     before any save operation, so plain-text passwords NEVER reach the DB.
 *   - `timestamps: true` automatically adds `createdAt` and `updatedAt`.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,       // Enforced by MongoDB index
      lowercase: true,    // Always stored in lowercase
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,      // ← IMPORTANT: Never returned in queries by default
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],  // Only these two values are allowed
      default: 'customer',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

/**
 * Pre-save Hook — Password Hashing
 *
 * This runs automatically BEFORE every user.save() call.
 * `this` refers to the document being saved.
 *
 * The `isModified('password')` check prevents re-hashing an already-hashed
 * password when other user fields (like name or email) are updated.
 */
userSchema.pre('save', async function () { 
  // Only hash if the password field was actually changed
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
});

/**
 * Instance Method — matchPassword
 *
 * We attach this method to every user document so we can call it like:
 *   const isMatch = await user.matchPassword(enteredPassword);
 *
 * bcrypt.compare does a secure comparison of the plain-text password
 * against the hashed password stored in the database.
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
