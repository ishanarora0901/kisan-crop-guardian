const Farm = require('../models/Farm');
const CropCycle = require('../models/CropCycle');
const BlockchainService = require('../services/blockchainService');

// @desc Create a new farm
// @route POST /api/farms
const createFarm = async (req, res, next) => {
  try {
    const { name, locationName, coordinates, totalAreaAcres, soilType, irrigationSource, notes } = req.body;

    const farm = await Farm.create({
      farmer: req.user._id,
      name,
      locationName: locationName || 'Ludhiana, Punjab',
      coordinates: coordinates || { lat: 30.901, lng: 75.8573 },
      totalAreaAcres: Number(totalAreaAcres) || 10,
      soilType: soilType || 'Alluvial Soil',
      irrigationSource: irrigationSource || 'Tube-well / Borewell',
      notes,
    });

    res.status(201).json({ success: true, farm });
  } catch (error) {
    next(error);
  }
};

// @desc Get all farms for the logged in farmer
// @route GET /api/farms
const getFarms = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { farmer: req.user._id, isActive: true };
    const farms = await Farm.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: farms.length, farms });
  } catch (error) {
    next(error);
  }
};

// @desc Get single farm details with active crop cycles
// @route GET /api/farms/:id
const getFarmById = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found.' });
    }

    const cropCycles = await CropCycle.find({ farm: farm._id }).sort({ createdAt: -1 });

    res.json({ success: true, farm, cropCycles });
  } catch (error) {
    next(error);
  }
};

// @desc Update farm details
// @route PUT /api/farms/:id
const updateFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found.' });
    }

    if (req.user.role !== 'admin' && farm.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to modify this farm.' });
    }

    const updated = await Farm.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, farm: updated });
  } catch (error) {
    next(error);
  }
};

// @desc Delete / Deactivate farm
// @route DELETE /api/farms/:id
const deleteFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found.' });
    }

    farm.isActive = false;
    await farm.save();

    res.json({ success: true, message: 'Farm deactivated successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFarm,
  getFarms,
  getFarmById,
  updateFarm,
  deleteFarm,
};
