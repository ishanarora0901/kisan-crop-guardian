const mongoose = require('mongoose');

const riskPredictionSchema = new mongoose.Schema(
  {
    cropCycle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CropCycle',
      required: true,
    },
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
    },
    calculatedAt: {
      type: Date,
      default: Date.now,
    },
    cropHealthScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 81,
    },
    overallRisk: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    // 6 Specific Risk Vectors (0 - 100%)
    diseaseRisk: {
      type: Number,
      default: 72,
    },
    pestRisk: {
      type: Number,
      default: 38,
    },
    waterStressRisk: {
      type: Number,
      default: 21,
    },
    heatStressRisk: {
      type: Number,
      default: 54,
    },
    heavyRainfallRisk: {
      type: Number,
      default: 67,
    },
    droughtRisk: {
      type: Number,
      default: 15,
    },
    expectedYieldLossRisk: {
      type: Number,
      default: 31,
    },
    contributingFactors: [
      {
        factor: String,
        impact: String, // e.g. "High Humidity (84%) creates fungal incubation"
      },
    ],
    recommendedAction: {
      type: String,
      default: 'Inspect the crop for early symptoms and follow locally appropriate preventive agricultural practices.',
    },
    expectedTimeWindow: {
      type: String,
      default: 'Next 3 to 5 days',
    },
    activeAlertGenerated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RiskPrediction', riskPredictionSchema);
