const CropCycle = require('../models/CropCycle');
const Farm = require('../models/Farm');
const SoilRecord = require('../models/SoilRecord');
const CropPassport = require('../models/CropPassport');
const BlockchainService = require('../services/blockchainService');
const WeatherService = require('../services/weatherService');
const AIRiskService = require('../services/aiRiskService');

// @desc Create a new Crop Cycle & initialize its Blockchain Crop Passport
// @route POST /api/crop-cycles
const createCropCycle = async (req, res, next) => {
  try {
    const {
      farmId,
      cropName,
      cropVariety,
      season = 'Rabi',
      sowingDate,
      expectedHarvestDate,
      fieldAreaAcres,
      previousCrop,
      previousDiseases,
      seedInformation,
      nitrogenKgPerHa,
      phosphorusKgPerHa,
      potassiumKgPerHa,
      soilPh,
      soilMoisturePercentage,
    } = req.body;

    const farm = await Farm.findById(farmId);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Parent Farm not found.' });
    }

    const sDate = sowingDate ? new Date(sowingDate) : new Date();
    const hDate = expectedHarvestDate ? new Date(expectedHarvestDate) : new Date(Date.now() + 120 * 24 * 60 * 60 * 1000);

    const cropCycle = await CropCycle.create({
      farm: farm._id,
      farmer: req.user._id,
      cropName: cropName || 'Wheat',
      cropVariety: cropVariety || 'HD-2967 High Yield',
      season,
      sowingDate: sDate,
      expectedHarvestDate: hDate,
      fieldAreaAcres: Number(fieldAreaAcres) || 5,
      previousCrop: previousCrop || 'Rice (Basmati)',
      previousDiseases: previousDiseases || ['Fungal Leaf Rust'],
      seedInformation: seedInformation || {
        seedCompany: 'National Seeds Corporation',
        seedTreatment: 'Carbendazim 2g/kg',
        seedRateKgPerAcre: 40,
      },
    });

    // Create Initial Soil Record
    const soil = await SoilRecord.create({
      cropCycle: cropCycle._id,
      farm: farm._id,
      nitrogenKgPerHa: Number(nitrogenKgPerHa) || 240,
      phosphorusKgPerHa: Number(phosphorusKgPerHa) || 55,
      potassiumKgPerHa: Number(potassiumKgPerHa) || 210,
      ph: Number(soilPh) || 6.8,
      soilMoisturePercentage: Number(soilMoisturePercentage) || 62,
    });

    // Initialize Blockchain Crop Passport
    const passport = await BlockchainService.initializePassport({
      cropCycle,
      farmer: req.user,
      farm,
      cropName: cropCycle.cropName,
      variety: cropCycle.cropVariety,
      season: cropCycle.season,
    });

    cropCycle.blockchainPassportId = passport.passportId;
    await cropCycle.save();

    // Add Initial Planting & Soil Milestones to Blockchain
    await BlockchainService.addBlock({
      passportId: passport.passportId,
      eventType: 'PLANTING_RECORD',
      eventTitle: `Sowing Registered: ${cropCycle.cropName} (${cropCycle.cropVariety}) across ${cropCycle.fieldAreaAcres} acres`,
      details: {
        sowingDate: cropCycle.sowingDate,
        seedDetails: cropCycle.seedInformation,
        farmLocation: farm.locationName,
      },
    });

    await BlockchainService.addBlock({
      passportId: passport.passportId,
      eventType: 'SOIL_RECORD_LOGGED',
      eventTitle: `Baseline Soil Nutrients & pH Verified`,
      details: {
        npk: `N:${soil.nitrogenKgPerHa}, P:${soil.phosphorusKgPerHa}, K:${soil.potassiumKgPerHa}`,
        ph: soil.ph,
        moisture: `${soil.soilMoisturePercentage}%`,
      },
    });

    // Calculate initial weather and risk prediction
    const weather = await WeatherService.getFarmWeather(farm);
    await AIRiskService.calculateCropRisk({
      cropCycle,
      farm,
      soilRecord: soil,
      weatherRecord: weather,
    });

    res.status(201).json({
      success: true,
      cropCycle,
      soilRecord: soil,
      passport,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all crop cycles for the user
// @route GET /api/crop-cycles
const getCropCycles = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { farmer: req.user._id };
    const cycles = await CropCycle.find(query)
      .populate('farm', 'name locationName totalAreaAcres coordinates soilType')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: cycles.length, cropCycles: cycles });
  } catch (error) {
    next(error);
  }
};

// @desc Get single crop cycle with soil, weather, risk, and passport summary
// @route GET /api/crop-cycles/:id
const getCropCycleById = async (req, res, next) => {
  try {
    const cycle = await CropCycle.findById(req.params.id).populate('farm');
    if (!cycle) {
      return res.status(404).json({ success: false, message: 'Crop cycle not found.' });
    }

    const soilRecords = await SoilRecord.find({ cropCycle: cycle._id }).sort({ createdAt: -1 });
    const passport = await CropPassport.findOne({ cropCycle: cycle._id });

    res.json({
      success: true,
      cropCycle: cycle,
      latestSoil: soilRecords[0] || null,
      soilRecords,
      passport,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Log a new Soil test record for an active cycle
// @route POST /api/crop-cycles/:id/soil
const logSoilRecord = async (req, res, next) => {
  try {
    const cycle = await CropCycle.findById(req.params.id);
    if (!cycle) return res.status(404).json({ success: false, message: 'Crop cycle not found.' });

    const { nitrogenKgPerHa, phosphorusKgPerHa, potassiumKgPerHa, ph, organicCarbonPercentage, soilMoisturePercentage } =
      req.body;

    const soil = await SoilRecord.create({
      cropCycle: cycle._id,
      farm: cycle.farm,
      nitrogenKgPerHa: Number(nitrogenKgPerHa) || 240,
      phosphorusKgPerHa: Number(phosphorusKgPerHa) || 50,
      potassiumKgPerHa: Number(potassiumKgPerHa) || 200,
      ph: Number(ph) || 6.8,
      organicCarbonPercentage: Number(organicCarbonPercentage) || 0.6,
      soilMoisturePercentage: Number(soilMoisturePercentage) || 60,
    });

    if (cycle.blockchainPassportId) {
      await BlockchainService.addBlock({
        passportId: cycle.blockchainPassportId,
        eventType: 'SOIL_RECORD_LOGGED',
        eventTitle: `Periodic Soil Test Logged (Moisture: ${soil.soilMoisturePercentage}%, pH: ${soil.ph})`,
        details: {
          n: soil.nitrogenKgPerHa,
          p: soil.phosphorusKgPerHa,
          k: soil.potassiumKgPerHa,
          ph: soil.ph,
          moisture: soil.soilMoisturePercentage,
        },
      });
    }

    res.status(201).json({ success: true, soilRecord: soil });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCropCycle,
  getCropCycles,
  getCropCycleById,
  logSoilRecord,
};
