const HistoricalAnalyticsService = require('../services/historicalAnalyticsService');
const CropCycle = require('../models/CropCycle');
const FinancialRecord = require('../models/FinancialRecord');
const RiskPrediction = require('../models/RiskPrediction');
const ProfitOptimizationService = require('../services/profitOptimizationService');

// @desc Get historical multi-season comparison & profit variance
// @route GET /api/historical/comparison/:cropCycleId
const getHistoricalComparison = async (req, res, next) => {
  try {
    const { cropCycleId } = req.params;
    const cropCycle = await CropCycle.findById(cropCycleId).populate('farm');
    if (!cropCycle) {
      return res.status(404).json({ success: false, message: 'Crop cycle not found.' });
    }

    const lastSeason = await FinancialRecord.findOne({
      farmer: cropCycle.farmer,
      isCurrentEstimate: false,
    }).sort({ createdAt: -1 });

    const currentEstimate = await FinancialRecord.findOne({
      cropCycle: cropCycleId,
      isCurrentEstimate: true,
    });

    const riskPrediction = await RiskPrediction.findOne({ cropCycle: cropCycleId }).sort({ createdAt: -1 });

    const comparisonData = await HistoricalAnalyticsService.getSeasonComparison({
      currentCropCycle: cropCycle,
      currentEstimate,
      lastSeasonRecord: lastSeason,
    });

    const diagnostics = ProfitOptimizationService.generateProfitDiagnostic({
      lastSeason: comparisonData.lastSeason,
      currentEstimate: comparisonData.currentEstimate,
      riskPrediction,
    });

    res.json({
      success: true,
      comparison: comparisonData,
      diagnostics,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get multi-season timeline records for the farm
// @route GET /api/historical/seasons
const getMultiSeasonTimeline = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { farmer: req.user._id };
    const records = await FinancialRecord.find(query).populate('cropCycle').sort({ createdAt: -1 });
    res.json({ success: true, count: records.length, records });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHistoricalComparison,
  getMultiSeasonTimeline,
};
