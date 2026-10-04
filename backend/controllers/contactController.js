const asyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');

// @desc    Submit a new contact message
// @route   POST /api/contact
// @access  Public
const submitContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('Please fill out all required fields');
  }

  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
  });

  res.status(201).json({
    success: true,
    message: 'Your inquiry has been received. We will get back to you shortly.',
    contact,
  });
});

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Admin only
const getAllContactMessages = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({}).sort({ createdAt: -1 });
  res.json(contacts);
});

// @desc    Update contact message status
// @route   PUT /api/contact/:id/status
// @access  Admin only
const updateContactStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error('Contact inquiry not found');
  }

  contact.status = status || contact.status;
  const updatedContact = await contact.save();
  res.json(updatedContact);
});

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Admin only
const deleteContactMessage = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error('Contact inquiry not found');
  }

  await contact.deleteOne();
  res.json({ message: 'Contact message removed successfully' });
});

module.exports = {
  submitContactMessage,
  getAllContactMessages,
  updateContactStatus,
  deleteContactMessage,
};
