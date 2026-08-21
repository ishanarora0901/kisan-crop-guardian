const DiseaseDetection = require('../models/DiseaseDetection');
const CropCycle = require('../models/CropCycle');
const DiseaseVisionService = require('../services/diseaseVisionService');
const BlockchainService = require('../services/blockchainService');

// @desc Upload crop photo and perform AI Computer Vision Disease Detection
// @route POST /api/disease-detection/scan
const uploadAndScanImage = async (req, res, next) => {
  try {
    const { cropCycleId, cropName, userNotes, imageBase64 } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (imageBase64) {
      imageUrl = imageBase64;
    } else {
      imageUrl = '/assets/sample-wheat-leaf.jpg';
    }

    const cropCycle = await CropCycle.findById(cropCycleId);
    if (!cropCycle) {
      return res.status(404).json({ success: false, message: 'Crop cycle not found.' });
    }

    const detection = await DiseaseVisionService.analyzeImage({
      cropCycle,
      farmer: req.user,
      imageUrl,
      cropName: cropName || cropCycle.cropName,
      userNotes,
    });

    // Record Disease Event in Blockchain Crop Passport if passport exists
    if (cropCycle.blockchainPassportId) {
      await BlockchainService.addBlock({
        passportId: cropCycle.blockchainPassportId,
        eventType: 'DISEASE_REPORTED',
        eventTitle: `AI Disease Scan: ${detection.detectedDisease} (${detection.confidenceScore}% confidence)`,
        details: {
          diseaseName: detection.detectedDisease,
          confidence: `${detection.confidenceScore}%`,
          severity: detection.severityLevel,
          scannedAt: detection.createdAt,
          imageProof: detection.imageUrl,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: 'AI Disease Vision Analysis Completed',
      detection,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get disease scan history for a crop cycle or farmer
// @route GET /api/disease-detection/history
const getDiseaseHistory = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { farmer: req.user._id };
    if (req.query.cropCycleId) {
      query.cropCycle = req.query.cropCycleId;
    }

    const scans = await DiseaseDetection.find(query)
      .populate('cropCycle', 'cropName cropVariety season')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: scans.length, scans });
  } catch (error) {
    next(error);
  }
};

// @desc Get single disease scan record
// @route GET /api/disease-detection/:id
const getDiseaseById = async (req, res, next) => {
  try {
    const scan = await DiseaseDetection.findById(req.params.id).populate('cropCycle');
    if (!scan) return res.status(404).json({ success: false, message: 'Disease scan record not found.' });
    res.json({ success: true, scan });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadAndScanImage,
  getDiseaseHistory,
  getDiseaseById,
};
