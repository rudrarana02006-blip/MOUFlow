const express = require('express');
const User = require('../models/User');
const Mou = require('../models/Mou');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalMous = await Mou.countDocuments();
    const pendingMous = await Mou.countDocuments({ status: { $ne: 'signed' } });
    const signedMous = await Mou.countDocuments({ status: 'signed' });

    res.json({
      totalUsers,
      totalMous,
      pendingMous,
      signedMous
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Server error fetching stats.', error: err.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with their MOU status
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    // Attach MOU data to each user
    const userIds = users.map(u => u._id);
    const mous = await Mou.find({ userId: { $in: userIds } }).lean();

    const mouMap = {};
    mous.forEach(m => {
      mouMap[m.userId.toString()] = m;
    });

    const enrichedUsers = users.map(user => ({
      ...user,
      mou: mouMap[user._id.toString()] || null
    }));

    res.json(enrichedUsers);
  } catch (err) {
    console.error('Users list error:', err);
    res.status(500).json({ message: 'Server error fetching users.', error: err.message });
  }
});

module.exports = router;
