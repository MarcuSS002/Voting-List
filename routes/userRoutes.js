const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { jwtAuthMiddleware, generateToken } = require('../jwt');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const data = req.body;

    // Allow only one admin
    const adminUser = await User.findOne({ role: 'admin' });
    if (data.role === 'admin' && adminUser) {
      return res.status(400).json({ error: 'Admin user already exists' });
    }

    // Duplicate Aadhaar check
    const existingUser = await User.findOne({ aadharCardNumber: data.aadharCardNumber });
    if (existingUser) {
      return res.status(400).json({ error: 'User with the same Aadhaar already exists' });
    }

    const newUser = new User(data);
    const response = await newUser.save();

    // Include role in token
    const payload = { id: response._id, role: response.role };
    const token = generateToken(payload);

    res.status(200).json({ response, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { aadharCardNumber, password } = req.body;
    if (!aadharCardNumber || !password) {
      return res.status(400).json({ error: 'Aadhaar number and password are required' });
    }

    const user = await User.findOne({ aadharCardNumber });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid Aadhaar number or password' });
    }

    const payload = { id: user._id, role: user.role };
    const token = generateToken(payload);

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Profile
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;  // will work now
        const user = await User.findById(userId);
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Update Password
router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: 'Invalid current password' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
