const ProfitOptimizationService = require('../services/profitOptimizationService');

// @desc Run "What-If" multi-crop comparative simulator
// @route POST /api/simulator/compare
const runWhatIfSimulation = async (req, res, next) => {
  try {
    const { cropA = 'Wheat', cropB = 'Mustard', farmAreaAcres = 5, soilType, weatherCondition } = req.body;

    const simulation = ProfitOptimizationService.simulateWhatIf({
      cropA,
      cropB,
      farmAreaAcres: Number(farmAreaAcres) || 5,
      soilType: soilType || 'Alluvial Soil',
      weatherCondition: weatherCondition || 'Normal Winter',
    });

    res.json({
      success: true,
      simulation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  runWhatIfSimulation,
};
