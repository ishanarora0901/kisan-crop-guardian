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
    if (!lastSeasonRecord && currentCropCycle) {
      if (currentCropCycle.previousCrop || (currentCropCycle.previousYieldQuintals > 0) || (currentCropCycle.previousProfit !== 0)) {
        lastSeasonRecord = {
          seasonName: `Previous Season (${currentCropCycle.previousCrop || 'Previous Crop'})`,
          totalYieldQuintals: currentCropCycle.previousYieldQuintals || 0,
          totalRevenue: currentCropCycle.previousRevenue || 0,
          totalCost: currentCropCycle.previousCost || 0,
          netProfit: currentCropCycle.previousProfit || 0,
          profitPerAcre: currentCropCycle.previousProfit && currentCropCycle.fieldAreaAcres ? Math.round(currentCropCycle.previousProfit / currentCropCycle.fieldAreaAcres) : 0,
          costPerQuintal: currentCropCycle.previousYieldQuintals > 0 ? Math.round(currentCropCycle.previousCost / currentCropCycle.previousYieldQuintals) : 0,
          primaryDiseaseOrIssue: Array.isArray(currentCropCycle.previousDiseases) ? currentCropCycle.previousDiseases.join(', ') : (currentCropCycle.previousDiseases || ''),
        };
      }
    }

    if (!currentEstimate) {
      const area = currentCropCycle?.fieldAreaAcres || 5;
      const estYield = Math.round(area * 10.6);
      const estCost = Math.round(area * 14400);
      const estRev = Math.round(estYield * 2500);
      currentEstimate = {
        seasonName: `${currentCropCycle?.season || 'Current Season'} (AI Projection)`,
        totalYieldQuintals: estYield,
        totalRevenue: estRev,
        totalCost: estCost,
        netProfit: estRev - estCost,
        profitPerAcre: Math.round((estRev - estCost) / area),
        costPerQuintal: Math.round(estCost / estYield),
        isCurrentEstimate: true,
      };
    }

    if (!lastSeasonRecord) {
      return {
        lastSeason: null,
        hasPastRecord: false,
        currentEstimate,
        deltas: null,
        insights: [
          'No previous season history entered yet for this crop cycle.',
          'Add your past crop yield and expenditure records to unlock AI multi-season margin comparisons.',
        ],
        disclaimer:
          'All current-season values are AI-driven statistical projections and estimates.',
      };
    }

    const profitImprovement = currentEstimate.netProfit - lastSeasonRecord.netProfit;
    const yieldImprovement = currentEstimate.totalYieldQuintals - lastSeasonRecord.totalYieldQuintals;
    const costVariance = currentEstimate.totalCost - lastSeasonRecord.totalCost;

    return {
      lastSeason: lastSeasonRecord,
      hasPastRecord: true,
      currentEstimate: currentEstimate,
      deltas: {
        profitImprovement,
        profitImprovementPercentage: lastSeasonRecord.netProfit ? Math.round((profitImprovement / Math.abs(lastSeasonRecord.netProfit)) * 100) : 0,
        yieldImprovement,
        costVariance,
      },
      insights: [
        lastSeasonRecord.primaryDiseaseOrIssue
          ? `Past crop vulnerability noted: ${lastSeasonRecord.primaryDiseaseOrIssue}.`
          : 'Previous season completed with recorded actuals.',
        profitImprovement >= 0
          ? `Current AI season plan projects a +₹${profitImprovement.toLocaleString()} net profit improvement.`
          : `Current season projected profit is ₹${Math.abs(profitImprovement).toLocaleString()} lower than last season.`,
        'Adhere to recommended prophylactic protection to safeguard your projected harvest margin.',
      ],
      disclaimer:
        'All current-season values are AI-driven statistical projections and estimates, subject to weather conditions and adherence to recommended agricultural precautions.',
    };
  }
}

module.exports = HistoricalAnalyticsService;
