const mongoose = require('mongoose');
const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');
const SpecialistProfile = require('../models/SpecialistProfile');
const Farm = require('../models/Farm');
const CropCycle = require('../models/CropCycle');
const SoilRecord = require('../models/SoilRecord');
const RiskPrediction = require('../models/RiskPrediction');
const Alert = require('../models/Alert');
const FinancialRecord = require('../models/FinancialRecord');
const DiseaseDetection = require('../models/DiseaseDetection');
const Consultation = require('../models/Consultation');
const CropPassport = require('../models/CropPassport');
const AuditLog = require('../models/AuditLog');
const BlockchainService = require('../services/blockchainService');

const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('ℹ️ MongoDB not connected; skipping database seed.');
      return;
    }

    console.log('🌱 Checking / Seeding AI Crop Guardian Agricultural Database...');

    // Clear existing data for fresh seed if needed
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('✨ Database already populated with users and farms. Ready to roll!');
      return;
    }

    console.log('🚀 Populating realistic agricultural dataset...');

    // 1. Create Users
    const farmerUser = await User.create({
      name: 'Harpreet Singh',
      email: 'farmer@cropguardian.ai',
      phone: '+91 98765 43210',
      password: 'password123',
      role: 'farmer',
      isPremium: true,
      languagePreference: 'en',
    });

    const specialistUser = await User.create({
      name: 'Dr. Ramesh Sharma',
      email: 'specialist@cropguardian.ai',
      phone: '+91 98111 22334',
      password: 'password123',
      role: 'specialist',
      isPremium: true,
    });

    const adminUser = await User.create({
      name: 'Chief Agri Officer (Admin)',
      email: 'admin@cropguardian.ai',
      phone: '+91 99999 88888',
      password: 'adminpassword123',
      role: 'admin',
      isPremium: true,
    });

    const verifierUser = await User.create({
      name: 'Kisan Quality & Organic Verifier',
      email: 'verifier@cropguardian.ai',
      phone: '+91 98222 33445',
      password: 'password123',
      role: 'verifier',
    });

    // 2. Profiles
    await FarmerProfile.create({
      user: farmerUser._id,
      state: 'Punjab',
      district: 'Ludhiana',
      village: 'Samrala Kalan',
      experienceYears: 18,
      preferredLanguage: 'en',
    });

    await SpecialistProfile.create({
      user: specialistUser._id,
      specialization: ['Plant Pathology', 'Fungal Disease Diagnostics', 'Integrated Nutrient Management'],
      qualification: 'Ph.D. in Plant Pathology (PAU / ICAR)',
      organization: 'Punjab Agricultural University Extension',
      licenseNumber: 'ICAR-SPEC-2024-889',
      experienceYears: 16,
      languagesSpoken: ['English', 'Hindi', 'Punjabi'],
      rating: 4.95,
      totalConsultations: 184,
      isVerified: true,
    });

    // 3. Farms
    const farm1 = await Farm.create({
      farmer: farmerUser._id,
      name: 'Green Acres Farm - Sector 4',
      locationName: 'Samrala, Ludhiana, Punjab',
      coordinates: { lat: 30.901, lng: 75.8573 },
      totalAreaAcres: 10,
      soilType: 'Alluvial Soil',
      irrigationSource: 'Tube-well / Borewell with Drip System',
      notes: 'High fertility alluvial loam field with multi-decade crop rotation.',
    });

    const farm2 = await Farm.create({
      farmer: farmerUser._id,
      name: 'Malwa Sun Valley Farm',
      locationName: 'Bathinda, Punjab',
      coordinates: { lat: 30.211, lng: 74.9455 },
      totalAreaAcres: 6,
      soilType: 'Sandy Loam',
      irrigationSource: 'Canal / Flood Irrigation',
      notes: 'South-facing open acreage, suitable for oilseeds and pulses.',
    });

    // 4. Crop Cycles
    const cropCycleWheat = await CropCycle.create({
      farm: farm1._id,
      farmer: farmerUser._id,
      cropName: 'Wheat',
      cropVariety: 'HD-2967 High Yield',
      season: 'Rabi',
      sowingDate: new Date(Date.now() - 82 * 24 * 60 * 60 * 1000), // 82 days ago
      expectedHarvestDate: new Date(Date.now() + 43 * 24 * 60 * 60 * 1000),
      fieldAreaAcres: 5,
      status: 'active',
      currentGrowthStage: 'Ear Head Emergence / Grain Filling',
      cropAgeDays: 82,
      previousCrop: 'Rice (Basmati PB-1121)',
      previousDiseases: ['Fungal Yellow Rust', 'Loose Smut'],
      seedInformation: {
        seedCompany: 'Punjab State Seeds Corp',
        seedTreatment: 'Carbendazim 2g/kg',
        seedRateKgPerAcre: 42,
      },
      fertilizerUsage: [
        { name: 'DAP (Di-ammonium Phosphate)', amountKgPerAcre: 55, appliedDate: new Date(Date.now() - 75 * 86400000) },
        { name: 'Urea (Split 1)', amountKgPerAcre: 45, appliedDate: new Date(Date.now() - 55 * 86400000) },
        { name: 'Urea (Split 2) + Zinc Sulphate', amountKgPerAcre: 45, appliedDate: new Date(Date.now() - 30 * 86400000) },
      ],
    });

    const cropCycleMustard = await CropCycle.create({
      farm: farm2._id,
      farmer: farmerUser._id,
      cropName: 'Mustard',
      cropVariety: 'Pusa Bold',
      season: 'Rabi',
      sowingDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
      expectedHarvestDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
      fieldAreaAcres: 4,
      status: 'active',
      currentGrowthStage: 'Pod Formation',
      cropAgeDays: 50,
      previousCrop: 'Cotton',
      previousDiseases: ['Alternaria Blight'],
    });

    // 5. Soil Records
    await SoilRecord.create({
      cropCycle: cropCycleWheat._id,
      farm: farm1._id,
      nitrogenKgPerHa: 245,
      phosphorusKgPerHa: 58,
      potassiumKgPerHa: 215,
      ph: 6.8,
      organicCarbonPercentage: 0.68,
      soilMoisturePercentage: 64,
      soilFertilityStatus: 'Medium',
    });

    await SoilRecord.create({
      cropCycle: cropCycleMustard._id,
      farm: farm2._id,
      nitrogenKgPerHa: 195,
      phosphorusKgPerHa: 45,
      potassiumKgPerHa: 180,
      ph: 7.2,
      organicCarbonPercentage: 0.55,
      soilMoisturePercentage: 52,
      soilFertilityStatus: 'Medium',
    });

    // 6. Blockchain Crop Passports (Both cycles)
    const wheatPassport = await BlockchainService.initializePassport({
      cropCycle: cropCycleWheat,
      farmer: farmerUser,
      farm: farm1,
      cropName: 'Wheat',
      variety: 'HD-2967 High Yield',
      season: 'Rabi 2024-25',
    });

    cropCycleWheat.blockchainPassportId = wheatPassport.passportId;
    await cropCycleWheat.save();

    await BlockchainService.addBlock({
      passportId: wheatPassport.passportId,
      eventType: 'PLANTING_RECORD',
      eventTitle: 'Certified Sowing Logged (HD-2967 on 5 Acres)',
      details: {
        sowingDate: cropCycleWheat.sowingDate,
        seedBatch: 'PAU-2024-CERT-991',
        seedRate: '42 kg/acre',
      },
    });

    await BlockchainService.addBlock({
      passportId: wheatPassport.passportId,
      eventType: 'SOIL_RECORD_LOGGED',
      eventTitle: 'Soil Chemical & Moisture Profile Stamped',
      details: { N: 245, P: 58, K: 215, pH: 6.8, moisture: '64%' },
    });

    const mustardPassport = await BlockchainService.initializePassport({
      cropCycle: cropCycleMustard,
      farmer: farmerUser,
      farm: farm2,
      cropName: 'Mustard',
      variety: 'Pusa Bold',
      season: 'Rabi 2024-25',
    });

    cropCycleMustard.blockchainPassportId = mustardPassport.passportId;
    await cropCycleMustard.save();

    // 7. Proactive AI Risk Prediction & Alerts
    await RiskPrediction.create({
      cropCycle: cropCycleWheat._id,
      farm: farm1._id,
      cropHealthScore: 81,
      overallRisk: 'MEDIUM',
      diseaseRisk: 72,
      pestRisk: 38,
      waterStressRisk: 21,
      heatStressRisk: 54,
      heavyRainfallRisk: 67,
      droughtRisk: 12,
      expectedYieldLossRisk: 31,
      contributingFactors: [
        { factor: 'High Relative Humidity', impact: '84% humidity level sustains spore moisture on flag leaves.' },
        { factor: 'Conducive Temperature Range', impact: '22°C - 28°C range accelerates fungal germination.' },
        { factor: 'Historical Rust Outbreak', impact: 'Last season field infection elevates spore reservoir risk.' },
      ],
      recommendedAction:
        'Inspect the wheat crop for early orange-yellow foliar pustules and apply preventive bio-fungicide protection.',
      expectedTimeWindow: 'Next 3 to 5 days',
      activeAlertGenerated: true,
    });

    // Active Early Warning Alerts
    await Alert.create({
      farmer: farmerUser._id,
      cropCycle: cropCycleWheat._id,
      farm: farm1._id,
      alertType: 'HIGH_RISK_ALERT',
      severity: 'HIGH',
      title: '🚨 HIGH RISK ALERT: Increased Fungal Rust Threat',
      message: 'Your wheat crop may face an increased risk of fungal disease in the coming days.',
      estimatedRiskPercentage: 78,
      contributingFactors: [
        'High humidity (> 82%) recorded in microclimate telemetry',
        'Recent intermittent rainfall creating moisture films',
        'Current 22-27°C temperature bracket optimal for rust sporulation',
        'Previous fungal disease recorded in this field during prior Rabi cycle',
      ],
      recommendedPrecaution:
        'Inspect the crop for early yellow pustule symptoms and follow locally appropriate preventive agricultural practices.',
      expectedTimeWindow: 'Next 48 to 72 hours',
    });

    await Alert.create({
      farmer: farmerUser._id,
      cropCycle: cropCycleWheat._id,
      farm: farm1._id,
      alertType: 'HISTORICAL_RISK_ALERT',
      severity: 'HIGH',
      title: '⚠️ HISTORICAL RISK ALERT: Weather-Disease Recurrence Detected',
      message:
        'Last season, your wheat crop experienced a fungal disease under similar weather conditions. Current environmental conditions show a similar pattern.',
      estimatedRiskPercentage: 74,
      contributingFactors: [
        'Last Season Impact: Fungal Leaf Rust caused 12% yield loss and ₹40,000 profit margin',
        'Current weather moisture index is 92% identical to week 12 of previous season',
      ],
      recommendedPrecaution:
        'Increase crop monitoring frequency to daily morning scouting and initiate preventive bio-fungicide.',
      expectedTimeWindow: 'Next 3 to 7 days',
    });

    await Alert.create({
      farmer: farmerUser._id,
      cropCycle: cropCycleWheat._id,
      farm: farm1._id,
      alertType: 'WEATHER_ANOMALY_ALERT',
      severity: 'MEDIUM',
      title: '🌧️ Heavy Rainfall & Waterlogging Alert',
      message: 'Forecast models indicate a 67% probability of heavy precipitation within 48 hours.',
      estimatedRiskPercentage: 67,
      contributingFactors: ['Atmospheric low-pressure depression over Northern plains'],
      recommendedPrecaution: 'Ensure field perimeter drainage ditches are unblocked to avoid root asphyxiation.',
      expectedTimeWindow: 'Next 48 hours',
    });

    // 8. Financial Records
    await FinancialRecord.create({
      cropCycle: cropCycleWheat._id,
      farmer: farmerUser._id,
      seasonName: 'Last Season (Rabi 2023-24)',
      isCurrentEstimate: false,
      areaAcres: 5,
      costs: {
        seedCost: 7200,
        fertilizerCost: 21500,
        pesticideCost: 9800,
        labourCost: 18000,
        irrigationCost: 6500,
        machineryCost: 7000,
        transportationCost: 2000,
        otherExpenses: 0,
      },
      totalYieldQuintals: 48,
      sellingPricePerQuintal: 2333.333,
      totalRevenue: 112000,
      totalCost: 72000,
      netProfit: 40000,
      profitPerAcre: 8000,
      costPerQuintal: 1500,
      primaryDiseaseOrIssue: 'Fungal Yellow Rust',
      yieldLossPercentage: 12,
    });

    await FinancialRecord.create({
      cropCycle: cropCycleWheat._id,
      farmer: farmerUser._id,
      seasonName: 'Current Season AI Projection',
      isCurrentEstimate: true,
      areaAcres: 5,
      costs: {
        seedCost: 7500,
        fertilizerCost: 17500,
        pesticideCost: 8000,
        labourCost: 20000,
        irrigationCost: 7000,
        machineryCost: 12000,
        transportationCost: 3000,
        otherExpenses: 0,
      },
      totalYieldQuintals: 53,
      sellingPricePerQuintal: 2452.83,
      totalRevenue: 130000,
      totalCost: 75000,
      netProfit: 55000,
      profitPerAcre: 11000,
      costPerQuintal: 1415,
      primaryDiseaseOrIssue: 'Proactively Controlled',
      yieldLossPercentage: 2,
    });

    // 9. Disease Detection Record
    const diseaseScan = await DiseaseDetection.create({
      cropCycle: cropCycleWheat._id,
      farmer: farmerUser._id,
      cropName: 'Wheat',
      imageUrl: '/assets/sample-wheat-leaf.jpg',
      detectedDisease: 'Wheat Leaf Rust (Puccinia triticina)',
      confidenceScore: 87,
      severityLevel: 'MEDIUM',
      visibleSymptoms: [
        'Small orange-yellow pustules erupting through leaf epidermis',
        'Slight chlorotic halo around infection sites on upper leaves',
      ],
      contributingFactors: ['High ambient humidity (84%)', 'Recent rainfall', 'Crop growth stage (Ear emergence)'],
      preventiveMeasures: [
        'Inspect nearby plants for similar pustules',
        'Apply bio-fungicide or Propiconazole 25% EC @ 1ml/L',
        'Avoid evening sprinkler or flood irrigation',
      ],
      recommendedNextSteps: [
        'Isolate focal patches',
        'Submit digital consultation request to Agricultural Specialist',
      ],
      specialistConsultationRecommended: true,
      status: 'Specialist_Reviewed',
    });

    // 10. Specialist Consultation
    await Consultation.create({
      farmer: farmerUser._id,
      specialist: specialistUser._id,
      cropCycle: cropCycleWheat._id,
      diseaseDetection: diseaseScan._id,
      subject: 'Urgent Advisory: Yellow Rust Suspected on Flag Leaves',
      farmerDescription:
        'Noticed yellow-orange powder on upper wheat canopy after last rain. Need official chemical dosage.',
      priority: 'URGENT',
      status: 'PRESCRIBED',
      specialistDiagnosis: 'Confirmed Early-Stage Wheat Leaf Rust (Puccinia triticina)',
      professionalAdvice:
        'Pathogen is in initial sporulation stage. Apply targeted systemic fungicide immediately before morning dew settles to stop spore propagation.',
      prescriptionDetails: {
        chemicalTreatments: [
          {
            chemicalName: 'Tilt (Propiconazole 25% EC)',
            dosagePerAcre: '200 ml in 200 Liters of water',
            sprayIntervalDays: 14,
            safeHarvestWaitingPeriodDays: 30,
          },
        ],
        organicAlternatives: [
          {
            remedyName: 'Neem Oil (10,000 ppm) + Trichoderma viride',
            preparationMethod: 'Mix 5ml neem oil with bio-agent per liter of warm water',
          },
        ],
        irrigationAndFertilizerAdvice: 'Withhold nitrogen top-dressing; maintain light soil moisture via drip line.',
        preventiveGuidelines: 'Scout field edges bordering weeds and destroy alternate grass hosts.',
      },
      messages: [
        {
          sender: farmerUser._id,
          senderRole: 'farmer',
          message: 'Dr. Sharma, please look at the scanned leaf photo. Is this dangerous for my harvest?',
          sentAt: new Date(Date.now() - 2 * 3600000),
        },
        {
          sender: specialistUser._id,
          senderRole: 'specialist',
          message:
            'Hello Harpreet ji. Yes, this is Puccinia rust. I have attached the exact chemical dosage and spray schedule. Act within 48 hours and your yield will be protected.',
          sentAt: new Date(Date.now() - 1 * 3600000),
        },
      ],
      farmerRating: 5,
      farmerFeedback: 'Very fast and accurate advice. Saved my crop!',
    });

    await BlockchainService.addBlock({
      passportId: wheatPassport.passportId,
      eventType: 'SPECIALIST_VERIFICATION',
      eventTitle: 'Specialist Prescription Verified by Dr. Ramesh Sharma',
      details: {
        diagnosis: 'Confirmed Early-Stage Wheat Leaf Rust',
        recommendation: 'Tilt 200ml/acre applied under supervised ICAR protocol',
        specialistId: specialistUser._id.toString(),
      },
      verifiedBy: 'Dr. Ramesh Sharma (ICAR-PAU-889)',
    });

    // 11. Initial Audit Log
    await AuditLog.create({
      actor: adminUser._id,
      actorName: adminUser.name,
      actorRole: 'admin',
      action: 'PLATFORM_INITIALIZATION_SEEDED',
      entityType: 'System',
      details: { message: 'AI Crop Guardian demo environment initialized with high-fidelity agronomy dataset.' },
    });

    console.log('✅ Agricultural database successfully seeded with realistic farms, cycles, AI risk, and blockchain!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

module.exports = { seedDatabase };
