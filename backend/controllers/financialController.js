const FinancialRecord = require('../models/FinancialRecord');
const CropCycle = require('../models/CropCycle');
const ProfitOptimizationService = require('../services/profitOptimizationService');

// @desc Record crop financial metrics (Actual or AI Estimate)
// @route POST /api/financials
const recordFinancials = async (req, res, next) => {
  try {
    const {
      cropCycleId,
      seasonName,
      isCurrentEstimate = false,
      areaAcres,
      costs,
      totalYieldQuintals,
      sellingPricePerQuintal,
      primaryDiseaseOrIssue,
      yieldLossPercentage,
    } = req.body;

    const cropCycle = await CropCycle.findById(cropCycleId);
    if (!cropCycle) return res.status(404).json({ success: false, message: 'Crop cycle not found.' });

    const financialRecord = new FinancialRecord({
      cropCycle: cropCycle._id,
      farmer: req.user._id,
      seasonName: seasonName || 'Rabi 2024-25',
      isCurrentEstimate,
      areaAcres: Number(areaAcres) || cropCycle.fieldAreaAcres || 5,
      costs: costs || {},
      totalYieldQuintals: Number(totalYieldQuintals) || 0,
      sellingPricePerQuintal: Number(sellingPricePerQuintal) || 0,
      primaryDiseaseOrIssue: primaryDiseaseOrIssue || '',
      yieldLossPercentage: Number(yieldLossPercentage) || 0,
    });

    await financialRecord.save();

    res.status(201).json({
      success: true,
      message: 'Financial record saved successfully',
      financialRecord,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get financials for a specific crop cycle or all cycles
// @route GET /api/financials
const getFinancials = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { farmer: req.user._id };
    if (req.query.cropCycleId) {
      query.cropCycle = req.query.cropCycleId;
    }

    const records = await FinancialRecord.find(query).populate('cropCycle').sort({ createdAt: -1 });

    res.json({ success: true, count: records.length, records });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recordFinancials,
  getFinancials,
};
