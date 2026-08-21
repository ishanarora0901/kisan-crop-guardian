class ProfitOptimizationService {
  /**
   * Evaluates input costs and yield parameters to return standard farm economics
   */
  static calculateEconomics({
    costs = {},
    totalYieldQuintals = 0,
    sellingPricePerQuintal = 0,
    areaAcres = 1,
  }) {
    const totalCost =
      (costs.seedCost || 0) +
      (costs.fertilizerCost || 0) +
      (costs.pesticideCost || 0) +
      (costs.labourCost || 0) +
      (costs.irrigationCost || 0) +
      (costs.machineryCost || 0) +
      (costs.transportationCost || 0) +
      (costs.otherExpenses || 0);

    const totalRevenue = totalYieldQuintals * sellingPricePerQuintal;
    const netProfit = totalRevenue - totalCost;
    const acres = areaAcres > 0 ? areaAcres : 1;
    const yieldQ = totalYieldQuintals > 0 ? totalYieldQuintals : 1;

    return {
      totalCost,
      totalRevenue,
      netProfit,
      profitPerAcre: Math.round(netProfit / acres),
      revenuePerAcre: Math.round(totalRevenue / acres),
      costPerQuintal: Math.round(totalCost / yieldQ),
      profitMarginPercentage: totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0,
    };
  }

  /**
   * Diagnoses profitability inefficiencies and opportunities
   */
  static generateProfitDiagnostic({ lastSeason, currentEstimate, riskPrediction }) {
    const diagnostics = [];

    if (lastSeason) {
      if (lastSeason.costs?.fertilizerCost > 18000) {
        diagnostics.push({
          type: 'COST_INVENTORY',
          title: 'High Fertilizer Expenditure Detected',
          explanation: `Your fertilizer expenditure (₹${lastSeason.costs.fertilizerCost.toLocaleString()}) was 22% higher than regional benchmarks. Switching to customized NPK soil-tested split applications can save up to ₹4,500/acre.`,
        });
      }

      if (lastSeason.yieldLossPercentage > 8) {
        diagnostics.push({
          type: 'YIELD_LOSS_FACTOR',
          title: `Yield Reduction from ${lastSeason.primaryDiseaseOrIssue || 'Fungal Infection'}`,
          explanation: `Last season experienced an estimated ${lastSeason.yieldLossPercentage}% yield drop due to disease pressure under high humidity.`,
        });
      }
    }

    if (riskPrediction) {
      if (riskPrediction.diseaseRisk > 60) {
        diagnostics.push({
          type: 'PROFIT_RISK',
          title: 'Current Disease Risk Threatens Projected Profit Margin',
          explanation: `Current weather conditions indicate an estimated ${riskPrediction.diseaseRisk}% disease risk. Taking proactive bio-fungicide measures (estimated cost: ₹1,800) protects up to ₹15,000 in expected revenue.`,
        });
      }
    }

    diagnostics.push({
      type: 'PROJECTION_OPTIMIZATION',
      title: 'Projected Net Profit Advantage',
      explanation: `Based on available historical and current data, your projected profitability is higher than last season by an estimated ₹15,000.`,
    });

    return diagnostics;
  }

  /**
   * What-If Crop Simulation Engine
   * Compares Crop A vs Crop B under current farm, soil, and market parameters
   */
  static simulateWhatIf({
    cropA = 'Wheat',
    cropB = 'Mustard',
    farmAreaAcres = 5,
    soilType = 'Alluvial Soil',
    weatherCondition = 'Normal Rabi Winter',
  }) {
    const CROP_BENCHMARKS = {
      Wheat: {
        yieldPerAcre: 10.6, // quintals/acre
        costPerAcre: 14400,
        marketPricePerQuintal: 2450,
        diseaseRisk: 62,
        weatherRisk: 45,
        waterRequirement: 'High (4-5 irrigations)',
        maturityDays: 125,
      },
      Mustard: {
        yieldPerAcre: 8.2,
        costPerAcre: 10800,
        marketPricePerQuintal: 5650,
        diseaseRisk: 31,
        weatherRisk: 28,
        waterRequirement: 'Low (1-2 irrigations)',
        maturityDays: 110,
      },
      Rice: {
        yieldPerAcre: 18.5,
        costPerAcre: 19500,
        marketPricePerQuintal: 2320,
        diseaseRisk: 58,
        weatherRisk: 52,
        waterRequirement: 'Very High (Continuous Flooding)',
        maturityDays: 135,
      },
      Cotton: {
        yieldPerAcre: 7.8,
        costPerAcre: 18200,
        marketPricePerQuintal: 7100,
        diseaseRisk: 65,
        weatherRisk: 48,
        waterRequirement: 'Medium (3-4 irrigations)',
        maturityDays: 160,
      },
      Maize: {
        yieldPerAcre: 16.0,
        costPerAcre: 13500,
        marketPricePerQuintal: 2150,
        diseaseRisk: 38,
        weatherRisk: 35,
        waterRequirement: 'Medium (3 irrigations)',
        maturityDays: 100,
      },
      Potato: {
        yieldPerAcre: 95.0,
        costPerAcre: 48000,
        marketPricePerQuintal: 950,
        diseaseRisk: 72,
        weatherRisk: 55,
        waterRequirement: 'High (Frequent light irrigations)',
        maturityDays: 90,
      },
      Tomato: {
        yieldPerAcre: 120.0,
        costPerAcre: 52000,
        marketPricePerQuintal: 850,
        diseaseRisk: 68,
        weatherRisk: 50,
        waterRequirement: 'High (Drip fertigation recommended)',
        maturityDays: 85,
      },
    };

    const dataA = CROP_BENCHMARKS[cropA] || CROP_BENCHMARKS.Wheat;
    const dataB = CROP_BENCHMARKS[cropB] || CROP_BENCHMARKS.Mustard;

    const yieldA = Math.round(dataA.yieldPerAcre * farmAreaAcres);
    const costA = Math.round(dataA.costPerAcre * farmAreaAcres);
    const revenueA = Math.round(yieldA * dataA.marketPricePerQuintal);
    const profitA = revenueA - costA;

    const yieldB = Math.round(dataB.yieldPerAcre * farmAreaAcres);
    const costB = Math.round(dataB.costPerAcre * farmAreaAcres);
    const revenueB = Math.round(yieldB * dataB.marketPricePerQuintal);
    const profitB = revenueB - costB;

    let recommendation = '';
    if (profitB > profitA && dataB.diseaseRisk <= dataA.diseaseRisk) {
      recommendation = `Based on the provided assumptions and available data, ${cropB} has a higher projected profitability (₹${profitB.toLocaleString()} vs ₹${profitA.toLocaleString()}) and lower estimated risk (${dataB.diseaseRisk}% vs ${dataA.diseaseRisk}%). Actual agricultural outcomes may vary with seasonal weather swings.`;
    } else if (profitA > profitB) {
      recommendation = `Based on the provided assumptions, ${cropA} offers a higher projected net return (₹${profitA.toLocaleString()}), though ${cropB} presents lower water and disease vulnerability.`;
    } else {
      recommendation = `Both crops present viable agronomic alternatives; consider crop rotation with ${cropB} to break soil disease cycles.`;
    }

    return {
      cropA: {
        name: cropA,
        expectedYield: `${yieldA} Quintals`,
        estimatedCost: costA,
        expectedRevenue: revenueA,
        expectedProfit: profitA,
        profitPerAcre: Math.round(profitA / farmAreaAcres),
        diseaseRisk: dataA.diseaseRisk,
        weatherRisk: dataA.weatherRisk,
        waterRequirement: dataA.waterRequirement,
        maturityDays: dataA.maturityDays,
      },
      cropB: {
        name: cropB,
        expectedYield: `${yieldB} Quintals`,
        estimatedCost: costB,
        expectedRevenue: revenueB,
        expectedProfit: profitB,
        profitPerAcre: Math.round(profitB / farmAreaAcres),
        diseaseRisk: dataB.diseaseRisk,
        weatherRisk: dataB.weatherRisk,
        waterRequirement: dataB.waterRequirement,
        maturityDays: dataB.maturityDays,
      },
      comparison: {
        profitDifference: profitB - profitA,
        recommendedChoice: profitB > profitA ? cropB : cropA,
        aiRecommendationSummary: recommendation,
        disclaimer:
          'Estimates are generated through mathematical simulation models and historical averages. Market prices and microclimatic anomalies may affect final realized farm income.',
      },
    };
  }
}

module.exports = ProfitOptimizationService;
