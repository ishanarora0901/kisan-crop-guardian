const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cropCycle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CropCycle',
    },
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
    },
    alertType: {
      type: String,
      enum: [
        'HIGH_RISK_ALERT',
        'HISTORICAL_RISK_ALERT',
        'WEATHER_ANOMALY_ALERT',
        'DISEASE_OUTBREAK_ALERT',
        'SYSTEM_BROADCAST',
      ],
      default: 'HIGH_RISK_ALERT',
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'HIGH',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    estimatedRiskPercentage: {
      type: Number,
      default: 75,
    },
    contributingFactors: {
      type: [String],
      default: [],
    },
    recommendedPrecaution: {
      type: String,
      required: true,
    },
    expectedTimeWindow: {
      type: String,
      default: 'Next 48-72 hours',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);
