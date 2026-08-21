const mongoose = require('mongoose');

const specialistProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: [String],
      default: ['Plant Pathology', 'Agronomy', 'Soil Health'],
    },
    qualification: {
      type: String,
      default: 'Ph.D. in Agricultural Sciences, ICAR',
    },
    organization: {
      type: String,
      default: 'State Agricultural University',
    },
    licenseNumber: {
      type: String,
      default: 'AGRI-SPEC-8849',
    },
    experienceYears: {
      type: Number,
      default: 12,
    },
    languagesSpoken: {
      type: [String],
      default: ['English', 'Hindi', 'Punjabi'],
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    totalConsultations: {
      type: Number,
      default: 142,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    availableForConsultation: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SpecialistProfile', specialistProfileSchema);
