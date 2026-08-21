const mongoose = require('mongoose');

const farmerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    nationalId: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: 'Punjab',
    },
    district: {
      type: String,
      default: 'Ludhiana',
    },
    village: {
      type: String,
      default: '',
    },
    experienceYears: {
      type: Number,
      default: 10,
    },
    preferredLanguage: {
      type: String,
      default: 'en',
    },
    bankAccountLinked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FarmerProfile', farmerProfileSchema);
