const express = require('express');
const MouTemplate = require('../models/MouTemplate');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/templates
// @desc    Get all active MOU templates (any authenticated user)
router.get('/', protect, async (req, res) => {
  try {
    const templates = await MouTemplate.find({ isActive: true })
      .select('title description createdAt')
      .sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching templates.', error: err.message });
  }
});

// @route   GET /api/templates/:id
// @desc    Get a single template's full content
router.get('/:id', protect, async (req, res) => {
  try {
    const template = await MouTemplate.findById(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found.' });
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching template.', error: err.message });
  }
});

// @route   POST /api/templates
// @desc    Create a new MOU template (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, content } = req.body;
    const template = await MouTemplate.create({
      title,
      description,
      content,
      createdBy: req.user._id
    });
    res.status(201).json(template);
  } catch (err) {
    res.status(500).json({ message: 'Error creating template.', error: err.message });
  }
});

// @route   PUT /api/templates/:id
// @desc    Update a template (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, content, isActive } = req.body;
    const template = await MouTemplate.findByIdAndUpdate(
      req.params.id,
      { title, description, content, isActive },
      { new: true, runValidators: true }
    );
    if (!template) return res.status(404).json({ message: 'Template not found.' });
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: 'Error updating template.', error: err.message });
  }
});

// @route   DELETE /api/templates/:id
// @desc    Delete a template (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const template = await MouTemplate.findByIdAndDelete(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found.' });
    res.json({ message: 'Template deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting template.', error: err.message });
  }
});

module.exports = router;
