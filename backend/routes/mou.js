const express = require('express');
const Mou = require('../models/Mou');

const router = express.Router();

// @route   GET /api/mou/:token
// @desc    Get MOU details by secure token (public — for signing page)
router.get('/:token', async (req, res) => {
  try {
    const mou = await Mou.findOne({ secureToken: req.params.token })
      .populate('userId', 'firstName lastName email company')
      .populate('templateId', 'title content');

    if (!mou) {
      return res.status(404).json({ message: 'MOU not found or link has expired.' });
    }

    res.json({
      id: mou._id,
      status: mou.status,
      documentTitle: mou.documentTitle,
      createdAt: mou.createdAt,
      user: mou.userId
        ? {
            name: `${mou.userId.firstName} ${mou.userId.lastName}`,
            email: mou.userId.email,
            company: mou.userId.company
          }
        : null,
      template: mou.templateId 
        ? { title: mou.templateId.title, content: mou.templateId.content }
        : null,
      isSigned: mou.status === 'signed',
      signedAt: mou.signedAt
    });
  } catch (err) {
    console.error('Get MOU error:', err);
    res.status(500).json({ message: 'Server error fetching MOU.', error: err.message });
  }
});

// @route   POST /api/mou/:token/sign
// @desc    Sign an MOU (submit signature)
router.post('/:token/sign', async (req, res) => {
  try {
    const { signatureData, signerName } = req.body;

    const mou = await Mou.findOne({ secureToken: req.params.token });

    if (!mou) {
      return res.status(404).json({ message: 'MOU not found or link has expired.' });
    }

    if (mou.status === 'signed') {
      return res.status(400).json({ message: 'This MOU has already been signed.' });
    }

    mou.status = 'signed';
    mou.signatureData = signatureData || 'digital-signature';
    mou.signerName = signerName || 'Unknown';
    mou.signedAt = new Date();
    await mou.save();

    res.json({
      message: 'MOU successfully signed!',
      mou: {
        id: mou._id,
        status: mou.status,
        signerName: mou.signerName,
        signedAt: mou.signedAt
      }
    });
  } catch (err) {
    console.error('Sign MOU error:', err);
    res.status(500).json({ message: 'Server error signing MOU.', error: err.message });
  }
});

module.exports = router;
