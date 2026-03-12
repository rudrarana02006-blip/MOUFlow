const mongoose = require('mongoose');

const mouSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MouTemplate',
    default: null
  },
  secureToken: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  status: {
    type: String,
    enum: ['generated', 'sent', 'signed'],
    default: 'generated'
  },
  documentTitle: {
    type: String,
    default: 'Memorandum of Understanding'
  },
  signatureData: {
    type: String,
    default: null
  },
  signerName: {
    type: String,
    default: null
  },
  sentAt: {
    type: Date,
    default: null
  },
  signedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Mou', mouSchema);
