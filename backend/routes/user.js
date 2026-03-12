const express = require('express');
const Mou = require('../models/Mou');
const MouTemplate = require('../models/MouTemplate');
const { v4: uuidv4 } = require('uuid');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/user/dashboard
// @desc    Get user's dashboard stats and MOUs
router.get('/dashboard', protect, async (req, res) => {
  try {
    const mous = await Mou.find({ userId: req.user._id })
      .populate('templateId', 'title description')
      .sort({ createdAt: -1 })
      .lean();

    const totalMous = mous.length;
    const signedMous = mous.filter(m => m.status === 'signed').length;
    const pendingMous = mous.filter(m => m.status !== 'signed').length;

    res.json({
      stats: { totalMous, signedMous, pendingMous },
      mous
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dashboard.', error: err.message });
  }
});

// @route   POST /api/user/mou/create
// @desc    User selects a template and creates an MOU to sign
router.post('/mou/create', protect, async (req, res) => {
  try {
    const { templateId } = req.body;

    const template = await MouTemplate.findById(templateId);
    if (!template) return res.status(404).json({ message: 'Template not found.' });

    const secureToken = uuidv4();
    const mou = await Mou.create({
      userId: req.user._id,
      templateId: template._id,
      secureToken,
      documentTitle: template.title,
      status: 'sent',
      sentAt: new Date()
    });

    res.status(201).json({
      message: 'MOU created! Proceed to sign.',
      mouLink: `/sign-document/${secureToken}`,
      mou
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating MOU.', error: err.message });
  }
});

module.exports = router;
