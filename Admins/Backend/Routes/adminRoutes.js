const express = require('express');
const bcrypt = require('bcryptjs'); // To hash passwords
const Admin = require('../models/Admin');

const router = express.Router();

// POST route to handle form submission
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Admin instance with the name field included
    const newAdmin = new Admin({
      name, // Include the name field
      email,
      password: hashedPassword,
    });

    // Save the new admin to the database
    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
