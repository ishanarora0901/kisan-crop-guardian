/**
 * AI Crop Guardian — High-Fidelity Client-Side Agricultural Mock Engine
 * Automatically activates seamlessly when running standalone on Vercel, Netlify,
 * or when the backend server is offline.
 */

// Initial Seed Data State
const getInitialState = () => ({
  users: [
    {
      _id: 'usr_farmer_01',
      name: 'Harpreet Singh',
      email: 'farmer@cropguardian.ai',
      phone: '+91 98765 43210',
      role: 'farmer',
      isPremium: true,
      languagePreference: 'en',
      createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    },
    {
      _id: 'usr_spec_02',
      name: 'Dr. Ramesh Sharma',
      email: 'specialist@cropguardian.ai',
      phone: '+91 98111 22334',
      role: 'specialist',
      isPremium: true,
      languagePreference: 'en',
      createdAt: new Date(Date.now() - 120 * 86400000).toISOString(),
    },
    {
      _id: 'usr_admin_03',
      name: 'Chief Agri Officer (Admin)',
      email: 'admin@cropguardian.ai',
      phone: '+91 99999 88888',
      role: 'admin',
      isPremium: true,
      languagePreference: 'en',
      createdAt: new Date(Date.now() - 180 * 86400000).toISOString(),
    },
  ],
  farms: [
    {
      _id: 'farm_01',
      farmer: 'usr_farmer_01',
      name: 'Green Acres Farm - Sector 4',
      locationName: 'Samrala, Ludhiana, Punjab',
      coordinates: { lat: 30.901, lng: 75.8573 },
      totalAreaAcres: 10,
      soilType: 'Alluvial Soil',
      irrigationSource: 'Tube-well / Borewell with Drip System',
      notes: 'High fertility alluvial loam field with multi-decade crop rotation.',
      createdAt: new Date(Date.now() - 85 * 86400000).toISOString(),
    },
    {
      _id: 'farm_02',
      farmer: 'usr_farmer_01',
      name: 'Malwa Sun Valley Farm',
      locationName: 'Bathinda, Punjab',
      coordinates: { lat: 30.211, lng: 74.9455 },
      totalAreaAcres: 6,
      soilType: 'Sandy Loam',
      irrigationSource: 'Canal / Flood Irrigation',
      notes: 'South-facing open acreage, suitable for oilseeds and pulses.',
      createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    },
  ],
  cropCycles: [
    {
      _id: 'cycle_wheat_01',
      farm: {
        _id: 'farm_01',
        name: 'Green Acres Farm - Sector 4',
        locationName: 'Samrala, Ludhiana, Punjab',
        totalAreaAcres: 10,
      },
      farmer: 'usr_farmer_01',
      cropName: 'Wheat',
      cropVariety: 'HD-2967 High Yield',
      season: 'Rabi',
      sowingDate: new Date(Date.now() - 82 * 86400000).toISOString(),
      expectedHarvestDate: new Date(Date.now() + 43 * 86400000).toISOString(),
      fieldAreaAcres: 5,
      status: 'active',
      currentGrowthStage: 'Ear Head Emergence / Grain Filling',
      cropAgeDays: 82,
      previousCrop: 'Rice (Basmati PB-1121)',
      previousDiseases: ['Fungal Yellow Rust', 'Loose Smut'],
      blockchainPassportId: 'CROP-PASS-WHEAT-2026',
      seedInformation: {
        seedCompany: 'Punjab State Seeds Corp',
        seedTreatment: 'Carbendazim 2g/kg',
        seedRateKgPerAcre: 42,
      },
      fertilizerUsage: [
        { name: 'DAP (Di-ammonium Phosphate)', amountKgPerAcre: 55, appliedDate: new Date(Date.now() - 75 * 86400000).toISOString() },
        { name: 'Urea (Split 1)', amountKgPerAcre: 45, appliedDate: new Date(Date.now() - 55 * 86400000).toISOString() },
        { name: 'Urea (Split 2) + Zinc Sulphate', amountKgPerAcre: 45, appliedDate: new Date(Date.now() - 30 * 86400000).toISOString() },
      ],
      createdAt: new Date(Date.now() - 82 * 86400000).toISOString(),
    },
    {
      _id: 'cycle_mustard_02',
      farm: {
        _id: 'farm_02',
        name: 'Malwa Sun Valley Farm',
        locationName: 'Bathinda, Punjab',
        totalAreaAcres: 6,
      },
      farmer: 'usr_farmer_01',
      cropName: 'Mustard',
      cropVariety: 'Pusa Bold',
      season: 'Rabi',
      sowingDate: new Date(Date.now() - 50 * 86400000).toISOString(),
      expectedHarvestDate: new Date(Date.now() + 55 * 86400000).toISOString(),
      fieldAreaAcres: 4,
      status: 'active',
      currentGrowthStage: 'Pod Formation',
      cropAgeDays: 50,
      previousCrop: 'Cotton',
      previousDiseases: ['Alternaria Blight'],
      blockchainPassportId: 'CROP-PASS-MUSTARD-2026',
      fertilizerUsage: [
        { name: 'SSP (Single Super Phosphate)', amountKgPerAcre: 60, appliedDate: new Date(Date.now() - 48 * 86400000).toISOString() },
      ],
      createdAt: new Date(Date.now() - 50 * 86400000).toISOString(),
    },
  ],
  soilRecords: [
    {
      _id: 'soil_wheat_01',
      cropCycle: 'cycle_wheat_01',
      farm: 'farm_01',
      nitrogenKgPerHa: 245,
      phosphorusKgPerHa: 58,
      potassiumKgPerHa: 215,
      ph: 6.8,
      organicCarbonPercentage: 0.68,
      soilMoisturePercentage: 64,
      soilFertilityStatus: 'Medium',
      recordedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      _id: 'soil_mustard_02',
      cropCycle: 'cycle_mustard_02',
      farm: 'farm_02',
      nitrogenKgPerHa: 195,
      phosphorusKgPerHa: 45,
      potassiumKgPerHa: 180,
      ph: 7.2,
      organicCarbonPercentage: 0.55,
      soilMoisturePercentage: 52,
      soilFertilityStatus: 'Medium',
      recordedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
  ],
  alerts: [
    {
      _id: 'alert_01',
      farmer: 'usr_farmer_01',
      cropCycle: 'cycle_wheat_01',
      farm: 'farm_01',
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
      isResolved: false,
      createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    },
    {
      _id: 'alert_02',
      farmer: 'usr_farmer_01',
      cropCycle: 'cycle_wheat_01',
      farm: 'farm_01',
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
      isResolved: false,
      createdAt: new Date(Date.now() - 14 * 3600000).toISOString(),
    },
    {
      _id: 'alert_03',
      farmer: 'usr_farmer_01',
      cropCycle: 'cycle_wheat_01',
      farm: 'farm_01',
      alertType: 'WEATHER_ANOMALY_ALERT',
      severity: 'MEDIUM',
      title: '🌧️ Heavy Rainfall & Waterlogging Alert',
      message: 'Forecast models indicate a 67% probability of heavy precipitation within 48 hours.',
      estimatedRiskPercentage: 67,
      contributingFactors: ['Atmospheric low-pressure depression over Northern plains'],
      recommendedPrecaution: 'Ensure field perimeter drainage ditches are unblocked to avoid root asphyxiation.',
      expectedTimeWindow: 'Next 48 hours',
      isResolved: false,
      createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    },
  ],
  diseaseScans: [
    {
      _id: 'scan_01',
      cropCycle: 'cycle_wheat_01',
      farmer: 'usr_farmer_01',
      cropName: 'Wheat',
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
      detectedDisease: 'Wheat Leaf Rust (Puccinia triticina)',
      confidenceScore: 87.5,
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
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
  ],
  specialists: [
    {
      _id: 'usr_spec_02',
      name: 'Dr. Ramesh Sharma',
      email: 'specialist@cropguardian.ai',
      phone: '+91 98111 22334',
      role: 'specialist',
      profile: {
        specialization: ['Plant Pathology', 'Fungal Disease Diagnostics', 'Integrated Nutrient Management'],
        qualification: 'Ph.D. in Plant Pathology (PAU / ICAR)',
        organization: 'Punjab Agricultural University Extension',
        licenseNumber: 'ICAR-SPEC-2024-889',
        experienceYears: 16,
        languagesSpoken: ['English', 'Hindi', 'Punjabi'],
        rating: 4.95,
        totalConsultations: 184,
        isVerified: true,
      },
    },
    {
      _id: 'usr_spec_05',
      name: 'Dr. Ananya Sen',
      email: 'ananya.agri@cropguardian.ai',
      phone: '+91 98450 11223',
      role: 'specialist',
      profile: {
        specialization: ['Soil Microbiology', 'Bio-fertilizer Formulations', 'Water Stress Management'],
        qualification: 'M.Sc. Agronomy (IARI New Delhi)',
        organization: 'National Institute of Agricultural Extension',
        licenseNumber: 'ICAR-SPEC-2023-412',
        experienceYears: 11,
        languagesSpoken: ['English', 'Hindi', 'Bengali'],
        rating: 4.88,
        totalConsultations: 142,
        isVerified: true,
      },
    },
  ],
  consultations: [
    {
      _id: 'consult_01',
      farmer: {
        _id: 'usr_farmer_01',
        name: 'Harpreet Singh',
        phone: '+91 98765 43210',
        email: 'farmer@cropguardian.ai',
      },
      specialist: {
        _id: 'usr_spec_02',
        name: 'Dr. Ramesh Sharma',
        organization: 'PAU Extension',
        rating: 4.95,
      },
      cropCycle: {
        _id: 'cycle_wheat_01',
        cropName: 'Wheat',
        cropVariety: 'HD-2967 High Yield',
      },
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
          _id: 'msg_01',
          sender: { _id: 'usr_farmer_01', name: 'Harpreet Singh', role: 'farmer' },
          senderRole: 'farmer',
          message: 'Dr. Sharma, please look at the scanned leaf photo. Is this dangerous for my harvest?',
          sentAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        },
        {
          _id: 'msg_02',
          sender: { _id: 'usr_spec_02', name: 'Dr. Ramesh Sharma', role: 'specialist' },
          senderRole: 'specialist',
          message:
            'Hello Harpreet ji. Yes, this is Puccinia rust. I have attached the exact chemical dosage and spray schedule. Act within 48 hours and your yield will be protected.',
          sentAt: new Date(Date.now() - 1 * 3600000).toISOString(),
        },
      ],
      farmerRating: 5,
      farmerFeedback: 'Very fast and accurate advice. Saved my crop!',
      createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    },
  ],
  passports: {
    'CROP-PASS-WHEAT-2026': {
      passportId: 'CROP-PASS-WHEAT-2026',
      cropCycleId: 'cycle_wheat_01',
      cropName: 'Wheat (HD-2967 High Yield)',
      variety: 'HD-2967 High Yield',
      season: 'Rabi 2024-25',
      farmerName: 'Harpreet Singh',
      farmName: 'Green Acres Farm - Sector 4',
      farmLocation: 'Samrala, Ludhiana, Punjab',
      coordinates: { lat: 30.901, lng: 75.8573 },
      sowingDate: new Date(Date.now() - 82 * 86400000).toISOString(),
      expectedHarvestDate: new Date(Date.now() + 43 * 86400000).toISOString(),
      fieldAreaAcres: 5,
      merkleRoot: '7e28a6f3b49910d5e18c642aa0722bc13d508933b91a788e0b12741128fa15e9',
      isTamperFree: true,
      blocks: [
        {
          index: 0,
          timestamp: new Date(Date.now() - 82 * 86400000).toISOString(),
          eventType: 'GENESIS',
          eventTitle: 'Crop Passport Initialized on Private Ledger',
          details: { crop: 'Wheat', variety: 'HD-2967', season: 'Rabi 2024-25', acres: 5 },
          previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
          hash: '0000a39f1c7d248b78912e569ac99201f8e6c7104b29d4900e4c5b7654a1001a',
          verifiedBy: 'AI Crop Guardian Consensus Node',
        },
        {
          index: 1,
          timestamp: new Date(Date.now() - 82 * 86400000).toISOString(),
          eventType: 'PLANTING_RECORD',
          eventTitle: 'Certified Sowing Logged (HD-2967 on 5 Acres)',
          details: {
            sowingDate: new Date(Date.now() - 82 * 86400000).toISOString(),
            seedBatch: 'PAU-2024-CERT-991',
            seedRate: '42 kg/acre',
          },
          previousHash: '0000a39f1c7d248b78912e569ac99201f8e6c7104b29d4900e4c5b7654a1001a',
          hash: '0000c14b998a442ef5798e100f2e03915bc8210344d9f1092a0134bc89ea002b',
          verifiedBy: 'Punjab State Seeds Certified Authority',
        },
        {
          index: 2,
          timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
          eventType: 'SOIL_RECORD_LOGGED',
          eventTitle: 'Soil Chemical & Moisture Profile Stamped',
          details: { N: 245, P: 58, K: 215, pH: 6.8, moisture: '64%' },
          previousHash: '0000c14b998a442ef5798e100f2e03915bc8210344d9f1092a0134bc89ea002b',
          hash: '0000e5720199ac21544a0e9803120cb954da48123019ee78992a018bc7fa003c',
          verifiedBy: 'Soil Health Card Automated Telemetry',
        },
        {
          index: 3,
          timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
          eventType: 'SPECIALIST_VERIFICATION',
          eventTitle: 'Specialist Prescription Verified by Dr. Ramesh Sharma',
          details: {
            diagnosis: 'Confirmed Early-Stage Wheat Leaf Rust',
            recommendation: 'Tilt 200ml/acre applied under supervised ICAR protocol',
            specialistId: 'usr_spec_02',
          },
          previousHash: '0000e5720199ac21544a0e9803120cb954da48123019ee78992a018bc7fa003c',
          hash: '0000f8901235bc456789def0123456789abcdef0123456789abcdef012345678',
          verifiedBy: 'Dr. Ramesh Sharma (ICAR-PAU-889)',
        },
      ],
    },
  },
});

// Load state from localStorage or seed fresh
const STORAGE_KEY = 'crop_guardian_mock_db_v2';

export const getMockStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Mock store load error:', e);
  }
  const fresh = getInitialState();
  saveMockStore(fresh);
  return fresh;
};

export const saveMockStore = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Mock store save error:', e);
  }
};

/**
 * Dispatches simulated mock API responses for any endpoint
 */
export const handleMockApiRequest = async (config) => {
  const method = (config.method || 'get').toLowerCase();
  const url = (config.url || '').replace(/^https?:\/\/[^/]+/, '').replace(/^\/api/, '');
  const data = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : config.data || {};
  const params = config.params || {};

  const store = getMockStore();
  const currentUser = store.users.find(
    (u) => u._id === (localStorage.getItem('crop_guardian_current_user_id') || 'usr_farmer_01')
  ) || store.users[0];

  // Helper response wrapper
  const respond = (status, payload) => {
    return {
      status,
      statusText: status === 200 || status === 201 ? 'OK' : 'Error',
      headers: {},
      config,
      data: payload,
    };
  };

  // 1. Health check
  if (url === '/health' || url === '') {
    return respond(200, {
      status: 'online',
      service: 'AI Crop Guardian Standalone Demo Mode',
      timestamp: new Date().toISOString(),
      version: '1.0.0 (Client-Side High Fidelity)',
    });
  }

  // 2. Auth Endpoints
  if (url === '/auth/login' && method === 'post') {
    const { email } = data;
    let found = store.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!found) {
      found = {
        _id: 'usr_' + Date.now(),
        name: email.split('@')[0] || 'Demo User',
        email: email,
        role: email.includes('admin') ? 'admin' : email.includes('spec') ? 'specialist' : 'farmer',
        isPremium: true,
      };
      store.users.push(found);
      saveMockStore(store);
    }
    localStorage.setItem('crop_guardian_current_user_id', found._id);
    return respond(200, {
      success: true,
      token: 'demo-jwt-token-' + found._id,
      user: found,
    });
  }

  if (url === '/auth/register' && method === 'post') {
    const newUser = {
      _id: 'usr_' + Date.now(),
      name: data.name || 'New Farmer',
      email: data.email,
      phone: data.phone || '+91 99999 00000',
      role: data.role || 'farmer',
      isPremium: true,
      createdAt: new Date().toISOString(),
    };
    store.users.push(newUser);
    saveMockStore(store);
    localStorage.setItem('crop_guardian_current_user_id', newUser._id);
    return respond(200, {
      success: true,
      token: 'demo-jwt-token-' + newUser._id,
      user: newUser,
    });
  }

  if (url === '/auth/me' && method === 'get') {
    return respond(200, {
      success: true,
      user: currentUser,
    });
  }

  if (url === '/auth/toggle-premium' && method === 'post') {
    currentUser.isPremium = !currentUser.isPremium;
    saveMockStore(store);
    return respond(200, {
      success: true,
      isPremium: currentUser.isPremium,
      message: 'Premium membership status toggled',
    });
  }

  if (url === '/auth/demo-accounts' && method === 'get') {
    return respond(200, {
      success: true,
      accounts: [
        { role: 'farmer', name: 'Harpreet Singh', email: 'farmer@cropguardian.ai' },
        { role: 'specialist', name: 'Dr. Ramesh Sharma', email: 'specialist@cropguardian.ai' },
        { role: 'admin', name: 'Chief Agri Officer', email: 'admin@cropguardian.ai' },
      ],
    });
  }

  // 3. Farms & Crops
  if (url === '/farms' && method === 'get') {
    return respond(200, { success: true, farms: store.farms });
  }

  if (url === '/farms' && method === 'post') {
    const newFarm = {
      _id: 'farm_' + Date.now(),
      farmer: currentUser._id,
      name: data.name || 'New Demo Farm',
      locationName: data.locationName || 'Punjab, India',
      coordinates: data.coordinates || { lat: 30.9, lng: 75.8 },
      totalAreaAcres: Number(data.totalAreaAcres) || 5,
      soilType: data.soilType || 'Alluvial Soil',
      irrigationSource: data.irrigationSource || 'Canal',
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
    };
    store.farms.push(newFarm);
    saveMockStore(store);
    return respond(201, { success: true, farm: newFarm });
  }

  if (url.startsWith('/farms/') && method === 'get') {
    const farmId = url.replace('/farms/', '');
    const farm = store.farms.find((f) => f._id === farmId) || store.farms[0];
    return respond(200, { success: true, farm });
  }

  if (url === '/crop-cycles' && method === 'get') {
    return respond(200, { success: true, cropCycles: store.cropCycles });
  }

  if (url === '/crop-cycles' && method === 'post') {
    const matchedFarm = store.farms.find((f) => f._id === data.farmId) || store.farms[0];
    const newCycle = {
      _id: 'cycle_' + Date.now(),
      farm: matchedFarm,
      farmer: currentUser._id,
      cropName: data.cropName || 'Wheat',
      cropVariety: data.cropVariety || 'HD-2967',
      season: data.season || 'Rabi',
      sowingDate: data.sowingDate || new Date().toISOString(),
      expectedHarvestDate: data.expectedHarvestDate || new Date(Date.now() + 60 * 86400000).toISOString(),
      fieldAreaAcres: Number(data.fieldAreaAcres) || 5,
      status: 'active',
      currentGrowthStage: 'Vegetative Growth',
      cropAgeDays: 20,
      blockchainPassportId: 'CROP-PASS-' + (data.cropName || 'CROP').toUpperCase() + '-' + Date.now().toString().slice(-4),
      createdAt: new Date().toISOString(),
    };
    store.cropCycles.push(newCycle);
    saveMockStore(store);
    return respond(201, { success: true, cropCycle: newCycle });
  }

  if (url.startsWith('/crop-cycles/') && url.endsWith('/soil') && method === 'post') {
    const cycleId = url.split('/')[2];
    const soilRec = {
      _id: 'soil_' + Date.now(),
      cropCycle: cycleId,
      nitrogenKgPerHa: Number(data.nitrogenKgPerHa) || 240,
      phosphorusKgPerHa: Number(data.phosphorusKgPerHa) || 55,
      potassiumKgPerHa: Number(data.potassiumKgPerHa) || 210,
      ph: Number(data.ph) || 6.8,
      organicCarbonPercentage: Number(data.organicCarbonPercentage) || 0.65,
      soilMoisturePercentage: Number(data.soilMoisturePercentage) || 60,
      soilFertilityStatus: 'Good',
      recordedAt: new Date().toISOString(),
    };
    store.soilRecords.push(soilRec);
    saveMockStore(store);
    return respond(201, { success: true, soilRecord: soilRec });
  }

  if (url.startsWith('/crop-cycles/') && method === 'get') {
    const cycleId = url.replace('/crop-cycles/', '');
    const cycle = store.cropCycles.find((c) => c._id === cycleId) || store.cropCycles[0];
    const soil = store.soilRecords.find((s) => s.cropCycle === cycleId) || store.soilRecords[0];
    return respond(200, { success: true, cropCycle: cycle, soilRecord: soil });
  }

  // 4. Weather & AI Risk
  if (url.startsWith('/weather/farm/')) {
    return respond(200, {
      success: true,
      weather: {
        location: 'Samrala, Ludhiana (Punjab)',
        temperatureC: 24.5,
        condition: 'Partly Cloudy / Humid',
        humidityPercentage: 84,
        windSpeedKmH: 12.4,
        rainfallMm: 4.2,
        pressureHpa: 1012,
        uvIndex: 5,
        forecastDays: [
          { day: 'Today', tempMin: 17, tempMax: 26, condition: 'Humid / Light Rain', rainfallChance: 65 },
          { day: 'Tomorrow', tempMin: 16, tempMax: 25, condition: 'Overcast / High Humidity', rainfallChance: 75 },
          { day: 'Day 3', tempMin: 18, tempMax: 27, condition: 'Partly Cloudy', rainfallChance: 30 },
          { day: 'Day 4', tempMin: 19, tempMax: 28, condition: 'Clear Skies', rainfallChance: 10 },
          { day: 'Day 5', tempMin: 18, tempMax: 29, condition: 'Sunny', rainfallChance: 5 },
        ],
      },
    });
  }

  if (url.startsWith('/ai-risk/') && url.endsWith('/recalculate') && method === 'post') {
    return respond(200, {
      success: true,
      message: 'AI Crop Risk recalculation complete',
      riskPrediction: {
        cropHealthScore: 82,
        overallRisk: 'MEDIUM',
        diseaseRisk: 68,
        pestRisk: 34,
        waterStressRisk: 19,
        heatStressRisk: 51,
        heavyRainfallRisk: 62,
        expectedYieldLossRisk: 28,
        contributingFactors: [
          { factor: 'Relative Moisture Stabilization', impact: 'Recent drainage reduced root-zone fungal pressure.' },
          { factor: 'Optimal Temperature Bracket', impact: 'Day/Night thermal differential within safe threshold.' },
        ],
        recommendedAction: 'Maintain current biological spray interval and inspect leaf undersides.',
        expectedTimeWindow: 'Next 5 to 7 days',
      },
    });
  }

  if (url.startsWith('/ai-risk/') && method === 'get' && !url.includes('alerts')) {
    return respond(200, {
      success: true,
      riskPrediction: {
        cropHealthScore: 81,
        overallRisk: 'MEDIUM',
        diseaseRisk: 72,
        pestRisk: 38,
        waterStressRisk: 21,
        heatStressRisk: 54,
        heavyRainfallRisk: 67,
        expectedYieldLossRisk: 31,
        contributingFactors: [
          { factor: 'High Relative Humidity', impact: '84% humidity level sustains spore moisture on flag leaves.' },
          { factor: 'Conducive Temperature Range', impact: '22°C - 28°C range accelerates fungal germination.' },
          { factor: 'Historical Rust Outbreak', impact: 'Last season field infection elevates spore reservoir risk.' },
        ],
        recommendedAction:
          'Inspect the wheat crop for early orange-yellow foliar pustules and apply preventive bio-fungicide protection.',
        expectedTimeWindow: 'Next 3 to 5 days',
      },
    });
  }

  if (url === '/ai-risk/alerts' && method === 'get') {
    return respond(200, { success: true, alerts: store.alerts });
  }

  if (url.startsWith('/ai-risk/alerts/') && url.endsWith('/resolve') && method === 'put') {
    const alertId = url.split('/')[3];
    const target = store.alerts.find((a) => a._id === alertId);
    if (target) target.isResolved = true;
    saveMockStore(store);
    return respond(200, { success: true, alert: target });
  }

  // 5. AI Computer Vision Disease Scanner
  if (url === '/disease-detection/scan' && method === 'post') {
    const newScan = {
      _id: 'scan_' + Date.now(),
      cropCycle: 'cycle_wheat_01',
      farmer: currentUser._id,
      cropName: 'Wheat',
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
      detectedDisease: 'Wheat Leaf Rust (Puccinia triticina)',
      confidenceScore: 88.4,
      severityLevel: 'MEDIUM',
      visibleSymptoms: [
        'Orange-yellow circular to oval pustules scattered randomly on upper leaf lamina',
        'Early chlorosis surrounding infection foci',
        'Slight leaf tip desiccation observed',
      ],
      contributingFactors: [
        'Prolonged leaf wetness duration (> 6 hours)',
        'Ambient microclimate humidity 84%',
        'Warm day temperatures (23°C - 26°C)',
      ],
      preventiveMeasures: [
        'Inspect surrounding acreage and create 2-meter sanitation buffer',
        'Apply systemic fungicide: Propiconazole 25% EC (Tilt) @ 200ml/acre in 200L water',
        'Alternative Organic Protocol: Neem oil (10,000 ppm) @ 5ml/L + Trichoderma viride',
        'Avoid excessive late-season Nitrogen fertilization',
      ],
      recommendedNextSteps: [
        'Submit digital consultation request to Agricultural Specialist',
        'Re-scan affected foliage after 5 days to verify treatment efficacy',
      ],
      specialistConsultationRecommended: true,
      createdAt: new Date().toISOString(),
    };
    store.diseaseScans.unshift(newScan);
    saveMockStore(store);
    return respond(200, { success: true, scan: newScan, result: newScan });
  }

  if (url === '/disease-detection/history' && method === 'get') {
    return respond(200, { success: true, scans: store.diseaseScans });
  }

  // 6. Historical & Financial Analytics
  if (url.startsWith('/historical/comparison/')) {
    return respond(200, {
      success: true,
      comparison: {
        historicalCycle: {
          season: 'Rabi 2023-24',
          cropName: 'Wheat (PBW-550)',
          diseaseOutbreak: 'Fungal Leaf Rust (Severe in Week 12)',
          yieldLossPercentage: 12,
          totalRevenue: 112000,
          totalCost: 72000,
          netProfit: 40000,
          profitPerAcre: 8000,
        },
        currentCycle: {
          season: 'Rabi 2024-25 (Current)',
          cropName: 'Wheat (HD-2967 High Yield)',
          proactiveStatus: 'Proactive AI Alert Triggered — Controlled Early',
          yieldLossPercentage: 2,
          totalRevenue: 130000,
          totalCost: 75000,
          netProfit: 55000,
          profitPerAcre: 11000,
          expectedProfitGain: 15000,
        },
        recurringWeatherPatterns: [
          'High relative humidity (> 80%) recurrence in late January',
          'Intermittent morning fog elevating leaf spore wetness index',
        ],
      },
    });
  }

  if (url === '/historical/seasons') {
    return respond(200, {
      success: true,
      seasons: [
        { season: 'Rabi 2024-25', crop: 'Wheat (HD-2967)', profit: '₹55,000 (AI Projected)', status: 'Active' },
        { season: 'Rabi 2023-24', crop: 'Wheat (PBW-550)', profit: '₹40,000', status: 'Completed' },
        { season: 'Kharif 2023', crop: 'Basmati Rice (PB-1121)', profit: '₹84,000', status: 'Completed' },
      ],
    });
  }

  if (url === '/financials' && method === 'get') {
    return respond(200, {
      success: true,
      financials: {
        lastSeason: {
          seasonName: 'Last Season (Rabi 2023-24)',
          areaAcres: 5,
          totalRevenue: 112000,
          totalCost: 72000,
          netProfit: 40000,
          profitPerAcre: 8000,
          yieldQuintals: 48,
          costs: { seed: 7200, fertilizer: 21500, pesticide: 9800, labour: 18000, irrigation: 6500, machinery: 7000, transport: 2000 },
        },
        currentSeason: {
          seasonName: 'Current Season (AI Proactive Estimate)',
          areaAcres: 5,
          totalRevenue: 130000,
          totalCost: 75000,
          netProfit: 55000,
          profitPerAcre: 11000,
          yieldQuintals: 53,
          costs: { seed: 7500, fertilizer: 17500, pesticide: 8000, labour: 20000, irrigation: 7000, machinery: 12000, transport: 3000 },
          potentialImprovement: 15000,
          roiPercentage: 73.3,
        },
      },
    });
  }

  if (url === '/financials' && method === 'post') {
    return respond(201, { success: true, message: 'Financial record saved successfully' });
  }

  // 7. What-If Simulator
  if (url === '/simulator/compare' && method === 'post') {
    const { cropA = 'Wheat', cropB = 'Mustard', acres = 5, waterPrice = 1, fertilizerRate = 1 } = data;
    return respond(200, {
      success: true,
      simulation: {
        optionA: {
          cropName: cropA,
          acres: Number(acres),
          expectedYieldQuintals: Number(acres) * 10.6,
          totalRevenue: Number(acres) * 26000,
          totalCost: Number(acres) * 15000 * fertilizerRate,
          netProfit: Number(acres) * (26000 - 15000 * fertilizerRate),
          roiPercentage: ((26000 - 15000 * fertilizerRate) / (15000 * fertilizerRate)) * 100,
          diseaseResilienceScore: '7.8 / 10',
          waterRequirementM3: Number(acres) * 450 * waterPrice,
          climateRiskIndex: 'Medium',
        },
        optionB: {
          cropName: cropB,
          acres: Number(acres),
          expectedYieldQuintals: Number(acres) * 6.2,
          totalRevenue: Number(acres) * 32000,
          totalCost: Number(acres) * 13500 * fertilizerRate,
          netProfit: Number(acres) * (32000 - 13500 * fertilizerRate),
          roiPercentage: ((32000 - 13500 * fertilizerRate) / (13500 * fertilizerRate)) * 100,
          diseaseResilienceScore: '8.4 / 10',
          waterRequirementM3: Number(acres) * 220 * waterPrice,
          climateRiskIndex: 'Low-Medium',
        },
        recommendation:
          'Option B provides higher net margins per acre and consumes ~50% less irrigation water, offering optimal climate-risk hedging under forecasted dry spells.',
      },
    });
  }

  // 8. Specialist Consultations
  if (url === '/consultations/specialists') {
    return respond(200, { success: true, specialists: store.specialists });
  }

  if (url === '/consultations' && method === 'get') {
    return respond(200, { success: true, consultations: store.consultations });
  }

  if (url === '/consultations' && method === 'post') {
    const newConsult = {
      _id: 'consult_' + Date.now(),
      farmer: { _id: currentUser._id, name: currentUser.name, email: currentUser.email, phone: currentUser.phone },
      specialist: store.specialists[0],
      cropCycle: store.cropCycles[0],
      subject: data.subject || 'Crop Consultation Inquiry',
      farmerDescription: data.farmerDescription || 'Requesting expert agronomy review.',
      priority: data.priority || 'MEDIUM',
      status: 'OPEN',
      messages: [
        {
          _id: 'msg_' + Date.now(),
          sender: { _id: currentUser._id, name: currentUser.name, role: currentUser.role },
          senderRole: currentUser.role,
          message: data.farmerDescription || 'Consultation requested.',
          sentAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    };
    store.consultations.unshift(newConsult);
    saveMockStore(store);
    return respond(201, { success: true, consultation: newConsult });
  }

  if (url.startsWith('/consultations/') && url.endsWith('/messages') && method === 'post') {
    const consultId = url.split('/')[2];
    const consult = store.consultations.find((c) => c._id === consultId);
    if (consult) {
      const newMsg = {
        _id: 'msg_' + Date.now(),
        sender: { _id: currentUser._id, name: currentUser.name, role: currentUser.role },
        senderRole: currentUser.role,
        message: data.message,
        sentAt: new Date().toISOString(),
      };
      consult.messages.push(newMsg);
      saveMockStore(store);
      return respond(200, { success: true, consultation: consult });
    }
  }

  if (url.startsWith('/consultations/') && url.endsWith('/prescribe') && method === 'post') {
    const consultId = url.split('/')[2];
    const consult = store.consultations.find((c) => c._id === consultId);
    if (consult) {
      consult.status = 'PRESCRIBED';
      consult.specialistDiagnosis = data.diagnosis || 'Pathogen Confirmed';
      consult.professionalAdvice = data.advice || 'Follow prescription parameters closely.';
      consult.prescriptionDetails = data.prescriptionDetails || {};
      saveMockStore(store);
      return respond(200, { success: true, consultation: consult });
    }
  }

  if (url.startsWith('/consultations/') && method === 'get') {
    const consultId = url.replace('/consultations/', '');
    const consult = store.consultations.find((c) => c._id === consultId) || store.consultations[0];
    return respond(200, { success: true, consultation: consult });
  }

  // 9. Blockchain Crop Passport
  if (url.startsWith('/passport/cycle/')) {
    const passport = store.passports['CROP-PASS-WHEAT-2026'];
    return respond(200, { success: true, passport });
  }

  if (url.startsWith('/passport/verify/')) {
    const passportId = url.replace('/passport/verify/', '');
    const passport = store.passports[passportId] || store.passports['CROP-PASS-WHEAT-2026'];
    return respond(200, {
      success: true,
      verified: true,
      passport,
      verificationTime: new Date().toISOString(),
      ledgerNode: 'Consensus Node #04 (PAU Extension Cluster)',
    });
  }

  if (url.startsWith('/passport/') && url.endsWith('/block') && method === 'post') {
    const passportId = url.split('/')[2];
    const passport = store.passports[passportId] || store.passports['CROP-PASS-WHEAT-2026'];
    const prevBlock = passport.blocks[passport.blocks.length - 1];
    const newBlock = {
      index: passport.blocks.length,
      timestamp: new Date().toISOString(),
      eventType: data.eventType || 'FARM_OPERATION_LOGGED',
      eventTitle: data.eventTitle || 'Field Action Verified',
      details: data.details || {},
      previousHash: prevBlock ? prevBlock.hash : '0000000000000000000000000000000000000000000000000000000000000000',
      hash: '0000' + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2),
      verifiedBy: currentUser.name + ' (' + currentUser.role + ')',
    };
    passport.blocks.push(newBlock);
    saveMockStore(store);
    return respond(201, { success: true, block: newBlock, passport });
  }

  // 10. Admin Portal Endpoints
  if (url === '/admin/analytics') {
    return respond(200, {
      success: true,
      analytics: {
        totalFarmers: 1420,
        totalSpecialists: 48,
        totalAcresGuarded: 12850,
        aiPredictionAccuracy: '94.2%',
        totalDiseaseScans: 3890,
        activeHighRiskAlerts: 14,
        totalPassportsMinted: 843,
        diseaseBreakdown: [
          { name: 'Wheat Yellow Rust', count: 320, percentage: 38 },
          { name: 'Mustard Blight', count: 180, percentage: 22 },
          { name: 'Cotton Whitefly / Bollworm', count: 155, percentage: 19 },
          { name: 'Nutrient Zinc Deficiency', count: 110, percentage: 13 },
          { name: 'Other', count: 68, percentage: 8 },
        ],
      },
    });
  }

  if (url.startsWith('/admin/users') && method === 'get') {
    return respond(200, { success: true, users: store.users, totalUsers: store.users.length });
  }

  if (url.startsWith('/admin/specialists/') && url.endsWith('/verify') && method === 'put') {
    return respond(200, { success: true, message: 'Specialist credentials verified.' });
  }

  if (url === '/admin/broadcast-alert' && method === 'post') {
    const alert = {
      _id: 'broadcast_' + Date.now(),
      title: data.title || 'Regional Agri Emergency Alert',
      message: data.message,
      severity: data.severity || 'HIGH',
      createdAt: new Date().toISOString(),
    };
    store.alerts.unshift(alert);
    saveMockStore(store);
    return respond(200, { success: true, message: 'Emergency alert broadcasted to 1,420 farmers.', alert });
  }

  if (url === '/admin/blockchain-ledger') {
    return respond(200, {
      success: true,
      ledger: store.passports['CROP-PASS-WHEAT-2026'].blocks,
    });
  }

  if (url === '/admin/audit-logs') {
    return respond(200, {
      success: true,
      logs: [
        {
          _id: 'log_01',
          actorName: 'Chief Agri Officer (Admin)',
          action: 'PLATFORM_METRICS_AUDITED',
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
          status: 'SUCCESS',
        },
        {
          _id: 'log_02',
          actorName: 'Dr. Ramesh Sharma',
          action: 'PRESCRIPTION_DIGITALLY_SIGNED',
          timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
          status: 'SUCCESS',
        },
        {
          _id: 'log_03',
          actorName: 'Harpreet Singh',
          action: 'LEAF_VISION_SCAN_EXECUTED',
          timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
          status: 'SUCCESS',
        },
      ],
    });
  }

  // Fallback default
  return respond(200, { success: true, message: 'Mock data delivered successfully.' });
};
