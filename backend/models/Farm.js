const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    locationName: {
      type: String,
      required: true,
      default: 'Ludhiana, Punjab',
    },
    coordinates: {
      lat: { type: Number, default: 30.901 },
      lng: { type: Number, default: 75.8573 },
    },
    totalAreaAcres: {
      type: Number,
      required: true,
      default: 10,
    },
    soilType: {
      type: String,
      default: 'Alluvial Soil',
    },
    irrigationSource: {
      type: String,
      default: 'Tube-well / Borewell',
    },
    elevationMeters: {
      type: Number,
      default: 245,
    },
    notes: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Farm', farmSchema);
