const RiskPrediction = require('../models/RiskPrediction');
const Alert = require('../models/Alert');

class AIRiskService {
  /**
   * Evaluates agronomic parameters and returns comprehensive proactive risk intelligence
   */
  static async calculateCropRisk({ cropCycle, farm, soilRecord, weatherRecord, historicalRecords = [] }) {
    const cropName = cropCycle.cropName || 'Wheat';
    const ageDays = cropCycle.cropAgeDays || 45;
    const temp = weatherRecord?.temperatureCelsius || 27;
    const humidity = weatherRecord?.humidityPercentage || 75;
    const rainProb = weatherRecord?.rainfallProbability || 30;
    const soilMoisture = soilRecord?.soilMoisturePercentage || 60;
    const soilPh = soilRecord?.ph || 6.8;
    const nitrogen = soilRecord?.nitrogenKgPerHa || 220;
    const potassium = soilRecord?.potassiumKgPerHa || 200;

    const previousDiseases = cropCycle.previousDiseases || [];
    const hasFungalHistory = previousDiseases.some((d) =>
      d.toLowerCase().includes('fungal') || d.toLowerCase().includes('rust') || d.toLowerCase().includes('blight')
    );

    const contributingFactors = [];

    // --- 1. Disease Risk Calculation ---
    let diseaseRisk = 30; // base risk
    if (humidity > 75) {
      diseaseRisk += 25;
      contributingFactors.push({
        factor: 'High Humidity',
        impact: `Relative humidity at ${humidity}% creates optimal moisture on leaves for fungal spore germination.`,
      });
    }
    if (temp >= 18 && temp <= 30) {
      diseaseRisk += 15;
      contributingFactors.push({
        factor: 'Conducive Temperature Range',
        impact: `Temperature of ${temp}°C is within the rapid growth bracket for ${cropName} pathogens.`,
      });
    }
    if (hasFungalHistory) {
      diseaseRisk += 18;
      contributingFactors.push({
        factor: 'Previous Field Disease History',
        impact: `Field history records previous occurrences of ${previousDiseases.join(', ')}.`,
      });
    }
    if (nitrogen > 280) {
      diseaseRisk += 8;
      contributingFactors.push({
        factor: 'Excess Nitrogen Fertilization',
        impact: 'High vegetative lushness increases vulnerability to foliar biotrophic pathogens.',
      });
    }
    diseaseRisk = Math.min(Math.max(diseaseRisk, 12), 94);

    // --- 2. Pest Risk Calculation ---
    let pestRisk = 25;
    if (temp > 28 && humidity < 65) {
      pestRisk += 25; // sucking pests thrive in warm dry weather
      contributingFactors.push({
        factor: 'Warm & Dry Microclimate',
        impact: 'Favors rapid reproduction of sucking pests (aphids/thrips/whiteflies).',
      });
    } else if (cropName === 'Cotton' || cropName === 'Tomato') {
      pestRisk += 15;
    }
    if (ageDays >= 30 && ageDays <= 75) {
      pestRisk += 10; // active vegetative & flowering stage
    }
    pestRisk = Math.min(Math.max(pestRisk, 10), 88);

    // --- 3. Water Stress Risk & Drought ---
    let waterStressRisk = 15;
    let droughtRisk = 10;
    if (soilMoisture < 40) {
      waterStressRisk = 65;
      droughtRisk = 55;
      contributingFactors.push({
        factor: 'Low Soil Moisture',
        impact: `Soil moisture measured at ${soilMoisture}%, which is below the optimal threshold for ${cropName}.`,
      });
    } else if (soilMoisture > 85) {
      waterStressRisk = 50; // Root waterlogging
      contributingFactors.push({
        factor: 'Soil Saturation / Waterlogging',
        impact: `Soil moisture at ${soilMoisture}% restricts root zone aeration.`,
      });
    }

    // --- 4. Heat Stress Risk ---
    let heatStressRisk = 15;
    if (temp > 35) {
      heatStressRisk = 75;
      contributingFactors.push({
        factor: 'Extreme Ambient Temperature',
        impact: `Current temperatures around ${temp}°C risk floral sterility and photosynthetic shutdown.`,
      });
    } else if (temp > 30) {
      heatStressRisk = 45;
    }

    // --- 5. Heavy Rainfall Risk ---
    let heavyRainfallRisk = rainProb;
    if (weatherRecord?.rainfallMm > 20 || rainProb > 60) {
      heavyRainfallRisk = Math.max(heavyRainfallRisk, 70);
      contributingFactors.push({
        factor: 'Precipitation Warning',
        impact: `Elevated ${rainProb}% rain probability threatens field nutrient leaching.`,
      });
    }

    // --- 6. Expected Yield Loss Risk ---
    const primaryMaxRisk = Math.max(diseaseRisk, pestRisk, waterStressRisk, heatStressRisk);
    let expectedYieldLossRisk = Math.round(primaryMaxRisk * 0.45 + (100 - (soilMoisture > 50 ? 80 : 40)) * 0.15);
    expectedYieldLossRisk = Math.min(Math.max(expectedYieldLossRisk, 8), 75);

    // --- Overall Health Score (0 - 100) & Overall Risk ---
    const aggregatePenalty =
      diseaseRisk * 0.35 +
      pestRisk * 0.2 +
      waterStressRisk * 0.2 +
      heatStressRisk * 0.15 +
      heavyRainfallRisk * 0.1;

    const cropHealthScore = Math.max(10, Math.min(98, Math.round(100 - aggregatePenalty * 0.55)));

    let overallRisk = 'LOW';
    if (cropHealthScore < 50 || primaryMaxRisk >= 75) {
      overallRisk = 'HIGH';
      if (cropHealthScore < 35 || primaryMaxRisk >= 85) {
        overallRisk = 'CRITICAL';
      }
    } else if (cropHealthScore < 75 || primaryMaxRisk >= 50) {
      overallRisk = 'MEDIUM';
    }

    let recommendedAction = 'Maintain standard field scouting and ensure balanced micronutrient fertilization.';
    if (diseaseRisk >= 65) {
      recommendedAction = `Inspect your ${cropName} crop foliage for early pustules or lesions. Consider prophylactic bio-fungicide (Trichoderma viride or Azoxystrobin) and avoid evening overhead irrigation.`;
    } else if (waterStressRisk >= 60) {
      recommendedAction = `Schedule immediate precision drip or furrow irrigation to restore root zone moisture above 65%.`;
    } else if (heavyRainfallRisk >= 65) {
      recommendedAction = `Clear field drainage channels to prevent water stagnation in the root zone.`;
    }

    const prediction = new RiskPrediction({
      cropCycle: cropCycle._id,
      farm: farm._id,
      cropHealthScore,
      overallRisk,
      diseaseRisk,
      pestRisk,
      waterStressRisk,
      heatStressRisk,
      heavyRainfallRisk,
      droughtRisk,
      expectedYieldLossRisk,
      contributingFactors,
      recommendedAction,
      expectedTimeWindow: 'Next 3 to 5 days',
      activeAlertGenerated: overallRisk === 'HIGH' || overallRisk === 'CRITICAL',
    });

    await prediction.save();

    // Generate Proactive Early Warning Alert if High or Critical
    if (overallRisk === 'HIGH' || overallRisk === 'CRITICAL' || diseaseRisk >= 70) {
      const existingAlert = await Alert.findOne({
        cropCycle: cropCycle._id,
        isResolved: false,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      });

      if (!existingAlert) {
        await Alert.create({
          farmer: cropCycle.farmer,
          cropCycle: cropCycle._id,
          farm: farm._id,
          alertType: 'HIGH_RISK_ALERT',
          severity: overallRisk === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
          title: `🚨 ${overallRisk} RISK ALERT: Increased Disease Pressure on ${cropName}`,
          message: `Your ${cropName} crop may face an increased risk of fungal infection in the coming days.`,
          estimatedRiskPercentage: diseaseRisk,
          contributingFactors: contributingFactors.map((f) => `${f.factor}: ${f.impact}`),
          recommendedPrecaution: recommendedAction,
          expectedTimeWindow: 'Next 3 to 5 days',
        });
      }
    }

    return prediction;
  }
}

module.exports = AIRiskService;
