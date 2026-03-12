const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Mou = require('../models/Mou');

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/signup
// @desc    Register a new user and auto-generate an MOU
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, company } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    // Create user
    const user = await User.create({ firstName, lastName, email, password, company });

    // Auto-generate an MOU with a unique secure token
    const secureToken = uuidv4();
    const mou = await Mou.create({
      userId: user._id,
      secureToken,
      status: 'sent',
      sentAt: new Date()
    });

    // In production: send email with the MOU signing link
    const signingLink = `${req.protocol}://${req.get('host')}/sign-document/${secureToken}`;
    console.log(`📧 MOU signing link for ${email}: ${signingLink}`);

    res.status(201).json({
      message: 'Account created! An MOU signing link has been generated.',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        company: user.company,
        role: user.role
      },
      token: generateToken(user._id),
      mouLink: `/sign-document/${secureToken}`
    });
  } catch (err) {
    console.error('Signup error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }
    res.status(500).json({ message: 'Server error during registration.', error: err.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user and return JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        company: user.company,
        role: user.role
      },
      token: generateToken(user._id)
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.', error: err.message });
  }
});

module.exports = router;
