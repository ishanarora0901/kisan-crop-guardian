const mongoose = require('mongoose');

const soilRecordSchema = new mongoose.Schema(
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
    testDate: {
      type: Date,
      default: Date.now,
    },
    nitrogenKgPerHa: {
      type: Number,
      required: true,
      default: 240, // Standard N
    },
    phosphorusKgPerHa: {
      type: Number,
      required: true,
      default: 55, // Standard P
    },
    potassiumKgPerHa: {
      type: Number,
      required: true,
      default: 210, // Standard K
    },
    ph: {
      type: Number,
      required: true,
      default: 6.8,
    },
    organicCarbonPercentage: {
      type: Number,
      default: 0.65,
    },
    soilMoisturePercentage: {
      type: Number,
      default: 62,
    },
    soilFertilityStatus: {
      type: String,
      enum: ['High', 'Medium', 'Low', 'Deficient'],
      default: 'Medium',
    },
    electricalConductivity: {
      type: Number,
      default: 0.45, // dS/m
    },
    labReportUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SoilRecord', soilRecordSchema);
