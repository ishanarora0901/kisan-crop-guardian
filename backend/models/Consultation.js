const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    specialist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cropCycle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CropCycle',
      required: true,
    },
    diseaseDetection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DiseaseDetection',
    },
    subject: {
      type: String,
      required: true,
      default: 'Crop Disease Assessment & Remedy Request',
    },
    farmerDescription: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['NORMAL', 'URGENT', 'CRITICAL'],
      default: 'NORMAL',
    },
    status: {
      type: String,
      enum: ['REQUESTED', 'IN_REVIEW', 'PRESCRIBED', 'RESOLVED', 'CLOSED'],
      default: 'REQUESTED',
    },
    specialistDiagnosis: {
      type: String,
      default: '',
    },
    professionalAdvice: {
      type: String,
      default: '',
    },
    prescriptionDetails: {
      chemicalTreatments: [
        {
          chemicalName: String,
          dosagePerAcre: String,
          sprayIntervalDays: Number,
          safeHarvestWaitingPeriodDays: Number,
        },
      ],
      organicAlternatives: [
        {
          remedyName: String,
          preparationMethod: String,
        },
      ],
      irrigationAndFertilizerAdvice: String,
      preventiveGuidelines: String,
    },
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        senderRole: String,
        message: String,
        sentAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    farmerRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    farmerFeedback: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Consultation', consultationSchema);
