const mongoose = require('mongoose');

const financialRecordSchema = new mongoose.Schema(
  {
    cropCycle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CropCycle',
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seasonName: {
      type: String,
      required: true, // e.g. "Rabi 2024-2025" or "Last Season (Rabi 2023)"
    },
    isCurrentEstimate: {
      type: Boolean,
      default: false, // false = actual recorded past season, true = AI current season projection
    },
    areaAcres: {
      type: Number,
      default: 5,
    },
    // Detailed Itemized Costs in INR (₹)
    costs: {
      seedCost: { type: Number, default: 0 },
      fertilizerCost: { type: Number, default: 0 },
      pesticideCost: { type: Number, default: 0 },
      labourCost: { type: Number, default: 0 },
      irrigationCost: { type: Number, default: 0 },
      machineryCost: { type: Number, default: 0 },
      transportationCost: { type: Number, default: 0 },
      otherExpenses: { type: Number, default: 0 },
    },
    totalCost: {
      type: Number,
      required: true,
      default: 0,
    },
    totalYieldQuintals: {
      type: Number,
      required: true,
      default: 0,
    },
    sellingPricePerQuintal: {
      type: Number,
      required: true,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      required: true,
      default: 0,
    },
    netProfit: {
      type: Number,
      required: true,
      default: 0,
    },
    profitPerAcre: {
      type: Number,
      default: 0,
    },
    costPerQuintal: {
      type: Number,
      default: 0,
    },
    revenuePerAcre: {
      type: Number,
      default: 0,
    },
    yieldLossPercentage: {
      type: Number,
      default: 0,
    },
    primaryDiseaseOrIssue: {
      type: String,
      default: '',
    },
    notes: String,
  },
  { timestamps: true }
);

// Automatic computation helper before saving
financialRecordSchema.pre('save', function (next) {
  const c = this.costs || {};
  this.totalCost =
    (c.seedCost || 0) +
    (c.fertilizerCost || 0) +
    (c.pesticideCost || 0) +
    (c.labourCost || 0) +
    (c.irrigationCost || 0) +
    (c.machineryCost || 0) +
    (c.transportationCost || 0) +
    (c.otherExpenses || 0);

  this.totalRevenue = (this.totalYieldQuintals || 0) * (this.sellingPricePerQuintal || 0);
  this.netProfit = this.totalRevenue - this.totalCost;

  const acres = this.areaAcres > 0 ? this.areaAcres : 1;
  this.profitPerAcre = Math.round(this.netProfit / acres);
  this.revenuePerAcre = Math.round(this.totalRevenue / acres);

  const yieldQ = this.totalYieldQuintals > 0 ? this.totalYieldQuintals : 1;
  this.costPerQuintal = Math.round(this.totalCost / yieldQ);

  next();
});

module.exports = mongoose.model('FinancialRecord', financialRecordSchema);
