const mongoose = require('mongoose');

const cropCycleSchema = new mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cropName: {
      type: String,
      required: true,
      default: 'Wheat',
    },
    cropVariety: {
      type: String,
      default: 'HD-2967 / PBW-550',
    },
    season: {
      type: String,
      enum: ['Rabi', 'Kharif', 'Zaid'],
      default: 'Rabi',
    },
    sowingDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expectedHarvestDate: {
      type: Date,
      required: true,
    },
    actualHarvestDate: {
      type: Date,
    },
    fieldAreaAcres: {
      type: Number,
      required: true,
      default: 5,
    },
    status: {
      type: String,
      enum: ['active', 'harvested', 'completed', 'abandoned'],
      default: 'active',
    },
    currentGrowthStage: {
      type: String,
      default: 'Tillering / Vegetative',
    },
    cropAgeDays: {
      type: Number,
      default: 45,
    },
    previousCrop: {
      type: String,
      default: '',
    },
    previousCropVariety: {
      type: String,
      default: '',
    },
    previousYieldQuintals: {
      type: Number,
      default: 0,
    },
    previousRevenue: {
      type: Number,
      default: 0,
    },
    previousCost: {
      type: Number,
      default: 0,
    },
    previousProfit: {
      type: Number,
      default: 0,
    },
    previousDiseases: {
      type: [String],
      default: [],
    },
    previousProblems: {
      type: String,
      default: '',
    },
    irrigationMethod: {
      type: String,
      default: 'Tube-well with Drip / Sprinkler',
    },
    currentConcerns: {
      type: String,
      default: '',
    },
    seedInformation: {
      seedCompany: { type: String, default: '' },
      seedTreatment: { type: String, default: 'None' },
      seedSource: { type: String, default: 'Certified Govt Seeds' },
      seedRateKgPerAcre: { type: Number, default: 40 },
    },
    fertilizerUsage: [
      {
        name: String,
        amountKgPerAcre: Number,
        appliedDate: Date,
      },
    ],
    pesticideUsage: [
      {
        name: String,
        targetPestOrDisease: String,
        appliedDate: Date,
      },
    ],
    blockchainPassportId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CropCycle', cropCycleSchema);
