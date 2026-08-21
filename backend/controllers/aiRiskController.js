const RiskPrediction = require('../models/RiskPrediction');
const Alert = require('../models/Alert');
const CropCycle = require('../models/CropCycle');
const Farm = require('../models/Farm');
const SoilRecord = require('../models/SoilRecord');
const WeatherService = require('../services/weatherService');
const AIRiskService = require('../services/aiRiskService');
const HistoricalAnalyticsService = require('../services/historicalAnalyticsService');

// @desc Get latest AI Risk Prediction & Health Score for a crop cycle
// @route GET /api/ai-risk/:cropCycleId
const getLatestRiskPrediction = async (req, res, next) => {
  try {
    const { cropCycleId } = req.params;
    const cropCycle = await CropCycle.findById(cropCycleId).populate('farm');
    if (!cropCycle) {
      return res.status(404).json({ success: false, message: 'Crop cycle not found.' });
    }

    let prediction = await RiskPrediction.findOne({ cropCycle: cropCycleId }).sort({ createdAt: -1 });
    const weather = await WeatherService.getFarmWeather(cropCycle.farm);

    if (!prediction) {
      const soil = (await SoilRecord.findOne({ cropCycle: cropCycleId }).sort({ createdAt: -1 })) || {};
      prediction = await AIRiskService.calculateCropRisk({
        cropCycle,
        farm: cropCycle.farm,
        soilRecord: soil,
        weatherRecord: weather,
      });
    }

    // Check for historical pattern alerts
    const historicalAnalysis = await HistoricalAnalyticsService.analyzeHistoricalPatterns({
      currentCropCycle: cropCycle,
      farm: cropCycle.farm,
      weatherRecord: weather,
    });

    res.json({
      success: true,
      prediction,
      weather,
      historicalAlert: historicalAnalysis.historicalAlert,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Trigger an on-demand AI risk recalculation (e.g. after weather changes)
// @route POST /api/ai-risk/:cropCycleId/recalculate
const recalculateRisk = async (req, res, next) => {
  try {
    const { cropCycleId } = req.params;
    const cropCycle = await CropCycle.findById(cropCycleId).populate('farm');
    if (!cropCycle) {
      return res.status(404).json({ success: false, message: 'Crop cycle not found.' });
    }

    const weather = await WeatherService.getFarmWeather(cropCycle.farm);
    const soil = (await SoilRecord.findOne({ cropCycle: cropCycleId }).sort({ createdAt: -1 })) || {};

    const prediction = await AIRiskService.calculateCropRisk({
      cropCycle,
      farm: cropCycle.farm,
      soilRecord: soil,
      weatherRecord: weather,
    });

    res.json({
      success: true,
      message: 'AI Crop Risk & Health Score updated successfully.',
      prediction,
      weather,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get active proactive alerts for the logged in farmer
// @route GET /api/ai-risk/alerts
const getFarmerAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.find({ farmer: req.user._id })
      .populate('cropCycle', 'cropName cropVariety season')
      .populate('farm', 'name locationName')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: alerts.length, alerts });
  } catch (error) {
    next(error);
  }
};

// @desc Mark alert as read or resolved
// @route PUT /api/ai-risk/alerts/:id/resolve
const resolveAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found.' });

    alert.isResolved = true;
    alert.isRead = true;
    await alert.save();

    res.json({ success: true, message: 'Alert resolved.', alert });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLatestRiskPrediction,
  recalculateRisk,
  getFarmerAlerts,
  resolveAlert,
};
