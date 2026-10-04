const express = require('express');
const router = express.Router();
const {
  submitContactMessage,
  getAllContactMessages,
  updateContactStatus,
  deleteContactMessage,
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

// Public route: submit an inquiry
router.post('/', submitContactMessage);

// Admin-only routes
router.get('/', protect, adminOnly, getAllContactMessages);
router.put('/:id/status', protect, adminOnly, updateContactStatus);
router.delete('/:id', protect, adminOnly, deleteContactMessage);

module.exports = router;
