const mongoose = require('mongoose');

const diseaseDetectionSchema = new mongoose.Schema(
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
    cropName: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imageAnalysisMethod: {
      type: String,
      default: 'DeepVision-ResNet-AgriEngine',
    },
    detectedDisease: {
      type: String,
      required: true,
    },
    confidenceScore: {
      type: Number,
      required: true, // e.g. 87%
    },
    severityLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    visibleSymptoms: {
      type: [String],
      default: [],
    },
    contributingFactors: {
      type: [String],
      default: [],
    },
    preventiveMeasures: {
      type: [String],
      default: [],
    },
    recommendedNextSteps: {
      type: [String],
      default: [],
    },
    specialistConsultationRecommended: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Analyzed', 'Specialist_Requested', 'Specialist_Reviewed', 'Resolved'],
      default: 'Analyzed',
    },
    userNotes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('DiseaseDetection', diseaseDetectionSchema);
