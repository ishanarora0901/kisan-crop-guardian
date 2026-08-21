const mongoose = require('mongoose');

const blockchainBlockSchema = new mongoose.Schema({
  index: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  eventType: {
    type: String,
    enum: [
      'GENESIS',
      'FARM_REGISTRATION',
      'CROP_CYCLE_CREATION',
      'PLANTING_RECORD',
      'SOIL_RECORD_LOGGED',
      'AI_RISK_ALERT',
      'DISEASE_REPORTED',
      'SPECIALIST_VERIFICATION',
      'HARVEST_RECORD',
      'ORGANIC_CERTIFICATION',
      'SUPPLY_CHAIN_TRANSFER',
    ],
    required: true,
  },
  eventTitle: {
    type: String,
    required: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  dataHash: {
    type: String,
    required: true,
  },
  previousHash: {
    type: String,
    required: true,
  },
  blockHash: {
    type: String,
    required: true,
  },
  nonce: {
    type: Number,
    default: 0,
  },
  verifiedBy: {
    type: String,
    default: 'AI-Crop-Guardian-Consensus-Node-01',
  },
  ipfsCid: {
    type: String,
    default: '',
  },
  signature: {
    type: String,
    default: '',
  },
});

const cropPassportSchema = new mongoose.Schema(
  {
    passportId: {
      type: String,
      required: true,
      unique: true,
    },
    cropCycle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CropCycle',
      required: true,
      unique: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
    },
    cropName: {
      type: String,
      required: true,
    },
    variety: String,
    season: String,
    merkleRootHash: {
      type: String,
      default: '',
    },
    isTamperVerified: {
      type: Boolean,
      default: true,
    },
    blocks: [blockchainBlockSchema],
    qrVerificationUrl: String,
    status: {
      type: String,
      enum: ['ACTIVE', 'CERTIFIED_HARVEST', 'EXPORT_READY', 'VERIFIED_ORGANIC'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CropPassport', cropPassportSchema);
