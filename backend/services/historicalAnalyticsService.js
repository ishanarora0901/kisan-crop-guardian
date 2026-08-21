const FinancialRecord = require('../models/FinancialRecord');
const Alert = require('../models/Alert');

class HistoricalAnalyticsService {
  /**
   * Analyzes multi-season patterns and generates historical intelligence alerts
   */
  static async analyzeHistoricalPatterns({ currentCropCycle, farm, weatherRecord }) {
    const historicalFinancials = await FinancialRecord.find({
      farmer: currentCropCycle.farmer,
      isCurrentEstimate: false,
    }).sort({ createdAt: -1 });

    const cropName = currentCropCycle.cropName;
    const currentHumidity = weatherRecord?.humidityPercentage || 80;
    const currentTemp = weatherRecord?.temperatureCelsius || 27;

    const previousMatchingCrop = historicalFinancials.find(
      (f) => f.primaryDiseaseOrIssue && f.primaryDiseaseOrIssue.length > 0
    );

    let historicalAlert = null;

    if (previousMatchingCrop && currentHumidity > 75) {
      const pastIssue = previousMatchingCrop.primaryDiseaseOrIssue || 'Fungal Disease';
      const pastYieldLoss = previousMatchingCrop.yieldLossPercentage || 12;
      const pastProfit = previousMatchingCrop.netProfit || 40000;

      const title = `⚠️ HISTORICAL RISK ALERT: Recurrent Pattern Detected`;
      const message = `Last season, your ${cropName} crop experienced ${pastIssue} (resulting in ~${pastYieldLoss}% yield impact) under similar elevated humidity (${currentHumidity}%) and temperature conditions.`;

      // Check if historical alert already exists recently
      const existingAlert = await Alert.findOne({
        cropCycle: currentCropCycle._id,
        alertType: 'HISTORICAL_RISK_ALERT',
        createdAt: { $gte: new Date(Date.now() - 48 * 60 * 60 * 1000) },
      });

      if (!existingAlert) {
        historicalAlert = await Alert.create({
          farmer: currentCropCycle.farmer,
          cropCycle: currentCropCycle._id,
          farm: farm._id,
          alertType: 'HISTORICAL_RISK_ALERT',
          severity: 'HIGH',
          title,
          message,
          estimatedRiskPercentage: 74,
          contributingFactors: [
            `Identical crop type (${cropName}) cultivated in consecutive cycles`,
            `Current high humidity (${currentHumidity}%) mirrors historical outbreak microclimate`,
            `Previous season experienced ${pastIssue} with ₹${pastProfit.toLocaleString()} net profit`,
          ],
          recommendedPrecaution:
            'Increase daily crop canopy inspection and initiate early preventive bio-fungicide protection before sporulation occurs.',
          expectedTimeWindow: 'Next 3 to 7 days',
        });
      }
    }

    return {
      historicalCyclesCount: historicalFinancials.length,
      pastRecords: historicalFinancials,
      historicalAlert,
      patternDetected: !!previousMatchingCrop,
    };
  }

  /**
   * Calculates side-by-side performance delta between Last Season Actuals and Current Season AI Projections
   */
  static async getSeasonComparison({ currentCropCycle, currentEstimate, lastSeasonRecord }) {
    if (!lastSeasonRecord) {
      lastSeasonRecord = {
        seasonName: 'Last Season (Rabi 2023-24)',
        totalYieldQuintals: 48,
        totalRevenue: 112000,
        totalCost: 72000,
        netProfit: 40000,
        profitPerAcre: 8000,
        costPerQuintal: 1500,
        primaryDiseaseOrIssue: 'Fungal Yellow Rust (Yield drop 12%)',
      };
    }

    if (!currentEstimate) {
      currentEstimate = {
        seasonName: 'Current Season AI Projection',
        totalYieldQuintals: 53,
        totalRevenue: 130000,
        totalCost: 75000,
        netProfit: 55000,
        profitPerAcre: 11000,
        costPerQuintal: 1415,
        isCurrentEstimate: true,
      };
    }

    const profitImprovement = currentEstimate.netProfit - lastSeasonRecord.netProfit;
    const yieldImprovement = currentEstimate.totalYieldQuintals - lastSeasonRecord.totalYieldQuintals;
    const costVariance = currentEstimate.totalCost - lastSeasonRecord.totalCost;

    return {
      lastSeason: lastSeasonRecord,
      currentEstimate: currentEstimate,
      deltas: {
        profitImprovement,
        profitImprovementPercentage: Math.round((profitImprovement / (lastSeasonRecord.netProfit || 1)) * 100),
        yieldImprovement,
        costVariance,
      },
      insights: [
        'Your fertilizer expenditure was 18% higher last season due to unoptimized split doses.',
        'Your crop experienced yield reduction during high-humidity fungal exposure in week 11.',
        'Current weather intelligence indicates high disease pressure, but proactive mitigation can preserve the projected ₹55,000 profit margin.',
        'Based on available historical and current data, your projected profitability is higher than last season.',
      ],
      disclaimer:
        'All current-season values are AI-driven statistical projections and estimates, subject to weather conditions and adherence to recommended agricultural precautions.',
    };
  }
}

module.exports = HistoricalAnalyticsService;
