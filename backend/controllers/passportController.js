const CropPassport = require('../models/CropPassport');
const CropCycle = require('../models/CropCycle');
const Farm = require('../models/Farm');
const User = require('../models/User');
const BlockchainService = require('../services/blockchainService');

// @desc Get Blockchain Crop Passport by Crop Cycle ID (or auto-initialize if new)
// @route GET /api/passport/cycle/:cropCycleId
const getPassportByCycle = async (req, res, next) => {
  try {
    let passport = await CropPassport.findOne({ cropCycle: req.params.cropCycleId })
      .populate('farmer', 'name email phone')
      .populate('farm', 'name locationName coordinates totalAreaAcres soilType irrigationSource');

    if (!passport) {
      const cycle = await CropCycle.findById(req.params.cropCycleId).populate('farm').populate('farmer');
      if (!cycle) {
        return res.status(404).json({ success: false, message: 'Crop cycle not found.' });
      }

      passport = await BlockchainService.initializePassport({
        cropCycle: cycle,
        farmer: cycle.farmer,
        farm: cycle.farm,
        cropName: cycle.cropName,
        variety: cycle.cropVariety,
        season: cycle.season,
      });

      cycle.blockchainPassportId = passport.passportId;
      await cycle.save();

      passport = await CropPassport.findById(passport._id)
        .populate('farmer', 'name email phone')
        .populate('farm', 'name locationName coordinates totalAreaAcres soilType irrigationSource');
    }

    const isAuthentic = BlockchainService.verifyChainIntegrity(passport.blocks);

    res.json({
      success: true,
      passport,
      isAuthentic,
      merkleRoot: passport.merkleRootHash,
      blocksCount: passport.blocks.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get Blockchain Crop Passport by Passport ID (Public Verification)
// @route GET /api/passport/verify/:passportId
const getPassportById = async (req, res, next) => {
  try {
    const summary = await BlockchainService.getVerificationSummary(req.params.passportId);
    if (!summary) {
      return res.status(404).json({ success: false, message: 'Blockchain Record Not Found' });
    }

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Add a harvest or certification milestone block to the passport
// @route POST /api/passport/:passportId/block
const addPassportBlock = async (req, res, next) => {
  try {
    const { passportId } = req.params;
    const { eventType, eventTitle, details, verifiedBy } = req.body;

    const block = await BlockchainService.addBlock({
      passportId,
      eventType: eventType || 'HARVEST_RECORD',
      eventTitle: eventTitle || 'Harvest Yield Logged and Certified',
      details: details || {},
      verifiedBy: verifiedBy || `${req.user.name} (${req.user.role})`,
    });

    res.status(201).json({
      success: true,
      message: 'Milestone block added to Blockchain Crop Passport',
      block,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPassportByCycle,
  getPassportById,
  addPassportBlock,
};
