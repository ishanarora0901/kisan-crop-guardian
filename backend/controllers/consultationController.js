const Consultation = require('../models/Consultation');
const User = require('../models/User');
const SpecialistProfile = require('../models/SpecialistProfile');
const CropCycle = require('../models/CropCycle');
const BlockchainService = require('../services/blockchainService');

// @desc Request an agricultural specialist consultation
// @route POST /api/consultations
const requestConsultation = async (req, res, next) => {
  try {
    const { specialistId, cropCycleId, diseaseDetectionId, subject, farmerDescription, priority = 'NORMAL' } = req.body;

    const cropCycle = await CropCycle.findById(cropCycleId);
    if (!cropCycle) return res.status(404).json({ success: false, message: 'Crop cycle not found.' });

    let targetSpecialistId = specialistId;
    if (!targetSpecialistId) {
      // Auto-assign first available verified specialist
      const defaultSpec = await User.findOne({ role: 'specialist' });
      targetSpecialistId = defaultSpec ? defaultSpec._id : null;
    }

    if (!targetSpecialistId) {
      return res.status(400).json({ success: false, message: 'No agricultural specialist available at the moment.' });
    }

    const consultation = await Consultation.create({
      farmer: req.user._id,
      specialist: targetSpecialistId,
      cropCycle: cropCycleId,
      diseaseDetection: diseaseDetectionId || null,
      subject: subject || 'Crop Protection & Diagnostic Consultation',
      farmerDescription: farmerDescription || 'Requesting expert agronomic review on foliar discoloration.',
      priority,
      status: 'REQUESTED',
      messages: [
        {
          sender: req.user._id,
          senderRole: 'farmer',
          message: farmerDescription || 'Hello doctor, please review my crop symptoms.',
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Consultation request submitted to agricultural specialist.',
      consultation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get consultations for logged in user (Farmer or Specialist)
// @route GET /api/consultations
const getConsultations = async (req, res, next) => {
  try {
    const query =
      req.user.role === 'specialist'
        ? { specialist: req.user._id }
        : req.user.role === 'admin'
        ? {}
        : { farmer: req.user._id };

    const consultations = await Consultation.find(query)
      .populate('farmer', 'name email phone avatar isPremium')
      .populate('specialist', 'name email phone avatar')
      .populate('cropCycle', 'cropName cropVariety season fieldAreaAcres')
      .populate('diseaseDetection')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: consultations.length, consultations });
  } catch (error) {
    next(error);
  }
};

// @desc Get single consultation detail
// @route GET /api/consultations/:id
const getConsultationById = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('farmer', 'name email phone avatar isPremium')
      .populate('specialist', 'name email phone avatar')
      .populate({
        path: 'cropCycle',
        populate: { path: 'farm' },
      })
      .populate('diseaseDetection');

    if (!consultation) return res.status(404).json({ success: false, message: 'Consultation not found.' });

    res.json({ success: true, consultation });
  } catch (error) {
    next(error);
  }
};

// @desc Send a message in a consultation thread
// @route POST /api/consultations/:id/messages
const sendMessage = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) return res.status(404).json({ success: false, message: 'Consultation not found.' });

    const { message } = req.body;
    consultation.messages.push({
      sender: req.user._id,
      senderRole: req.user.role,
      message,
      sentAt: new Date(),
    });

    if (consultation.status === 'REQUESTED' && req.user.role === 'specialist') {
      consultation.status = 'IN_REVIEW';
    }

    await consultation.save();
    res.json({ success: true, consultation });
  } catch (error) {
    next(error);
  }
};

// @desc Specialist provides official diagnosis and prescription
// @route POST /api/consultations/:id/prescribe
const prescribeAdvice = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id).populate('cropCycle');
    if (!consultation) return res.status(404).json({ success: false, message: 'Consultation not found.' });

    const { specialistDiagnosis, professionalAdvice, prescriptionDetails } = req.body;

    consultation.specialistDiagnosis = specialistDiagnosis;
    consultation.professionalAdvice = professionalAdvice;
    consultation.prescriptionDetails = prescriptionDetails || {};
    consultation.status = 'PRESCRIBED';

    await consultation.save();

    // Register Specialist Verification in the Blockchain Crop Passport
    if (consultation.cropCycle && consultation.cropCycle.blockchainPassportId) {
      await BlockchainService.addBlock({
        passportId: consultation.cropCycle.blockchainPassportId,
        eventType: 'SPECIALIST_VERIFICATION',
        eventTitle: `Specialist Diagnosis Issued: ${specialistDiagnosis}`,
        details: {
          specialistName: req.user.name,
          diagnosis: specialistDiagnosis,
          advice: professionalAdvice,
          prescriptionSummary: prescriptionDetails,
        },
        verifiedBy: `Specialist-${req.user.name}-ICAR`,
      });
    }

    res.json({
      success: true,
      message: 'Prescription and advisory issued successfully & stamped onto Blockchain Passport.',
      consultation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get list of all available verified specialists
// @route GET /api/consultations/specialists
const getAvailableSpecialists = async (req, res, next) => {
  try {
    const specialists = await User.find({ role: 'specialist', isActive: true }).select('name email phone avatar');
    const profiles = await SpecialistProfile.find({ user: { $in: specialists.map((s) => s._id) } });

    const combined = specialists.map((spec) => {
      const p = profiles.find((prof) => prof.user.toString() === spec._id.toString());
      return {
        _id: spec._id,
        name: spec.name,
        email: spec.email,
        phone: spec.phone,
        avatar: spec.avatar,
        profile: p || {},
      };
    });

    res.json({ success: true, specialists: combined });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requestConsultation,
  getConsultations,
  getConsultationById,
  sendMessage,
  prescribeAdvice,
  getAvailableSpecialists,
};
