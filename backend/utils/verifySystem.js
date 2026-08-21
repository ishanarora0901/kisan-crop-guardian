const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 ========================================================');
  console.log('🌾 AI CROP GUARDIAN — AUTOMATED INTEGRATION TEST SUITE');
  console.log('🧪 ========================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(name, condition, details = '') {
    if (condition) {
      console.log(`✅ [PASS] ${name} ${details}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} ${details}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const health = await axios.get(`${BASE_URL}/health`);
    assert('Backend Health Endpoint', health.data.status === 'online', `(Service: ${health.data.service})`);

    // 2. Demo Accounts
    const demo = await axios.get(`${BASE_URL}/auth/demo-accounts`);
    assert('Demo Accounts API', demo.data.accounts?.length === 3, `(${demo.data.accounts.map(a => a.role).join(', ')})`);

    // 3. Farmer Authentication
    const farmerLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'farmer@cropguardian.ai',
      password: 'password123',
    });
    assert('Farmer JWT Authentication', !!farmerLogin.data.token, `(User: ${farmerLogin.data.user.name}, Role: ${farmerLogin.data.user.role})`);
    const farmerToken = farmerLogin.data.token;
    const farmerAuth = { headers: { Authorization: `Bearer ${farmerToken}` } };

    // 4. Specialist Authentication
    const specLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'specialist@cropguardian.ai',
      password: 'password123',
    });
    assert('Specialist Authentication', !!specLogin.data.token, `(User: ${specLogin.data.user.name})`);
    const specAuth = { headers: { Authorization: `Bearer ${specLogin.data.token}` } };

    // 5. Admin Authentication
    const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@cropguardian.ai',
      password: 'adminpassword123',
    });
    assert('Admin Authentication', !!adminLogin.data.token, `(User: ${adminLogin.data.user.name})`);
    const adminAuth = { headers: { Authorization: `Bearer ${adminLogin.data.token}` } };

    // 6. Farms & Crop Cycles
    const farms = await axios.get(`${BASE_URL}/farms`, farmerAuth);
    assert('Farmer Farm Retrieval', farms.data.farms?.length > 0, `(${farms.data.farms.length} farms loaded: ${farms.data.farms[0].name})`);

    const cycles = await axios.get(`${BASE_URL}/crop-cycles`, farmerAuth);
    assert('Farmer Crop Cycles', cycles.data.cropCycles?.length > 0, `(${cycles.data.cropCycles.length} active cycles)`);
    const activeCycle = cycles.data.cropCycles[0];

    // 7. Proactive AI Risk Engine
    const risk = await axios.get(`${BASE_URL}/ai-risk/${activeCycle._id}`, farmerAuth);
    const pred = risk.data.prediction;
    assert(
      'AI Crop Risk & Health Score Engine',
      pred.cropHealthScore >= 0 && pred.cropHealthScore <= 100,
      `(Health: ${pred.cropHealthScore}/100, Overall Risk: ${pred.overallRisk}, Disease: ${pred.diseaseRisk}%, Pest: ${pred.pestRisk}%)`
    );

    // 8. Early Warning Alerts
    const alerts = await axios.get(`${BASE_URL}/ai-risk/alerts`, farmerAuth);
    assert('Proactive Early Warning Alerts', alerts.data.alerts?.length > 0, `(${alerts.data.alerts.length} active alerts generated)`);

    // 9. Historical Intelligence & Season Comparison
    const hist = await axios.get(`${BASE_URL}/historical/comparison/${activeCycle._id}`, farmerAuth);
    const comp = hist.data.comparison;
    const profitImprovement = comp.deltas?.profitImprovement;
    assert(
      'Season-on-Season Comparison Formulas',
      Math.abs(comp.lastSeason.netProfit - 40000) < 50 && Math.abs(comp.currentEstimate.netProfit - 55000) < 50,
      `(Last Profit: ₹${comp.lastSeason.netProfit.toLocaleString()} vs Expected: ₹${comp.currentEstimate.netProfit.toLocaleString()}, Delta: +₹${profitImprovement.toLocaleString()})`
    );

    // 10. What-If Crop Simulator
    const sim = await axios.post(
      `${BASE_URL}/simulator/compare`,
      { cropA: 'Wheat', cropB: 'Mustard', farmAreaAcres: 5 },
      farmerAuth
    );
    assert(
      'What-If Crop Simulation Engine',
      sim.data.simulation?.cropA && sim.data.simulation?.cropB,
      `(Wheat Profit: ₹${sim.data.simulation.cropA.expectedProfit.toLocaleString()} vs Mustard Profit: ₹${sim.data.simulation.cropB.expectedProfit.toLocaleString()})`
    );

    // 11. AI Disease Vision Scanner
    const scan = await axios.post(
      `${BASE_URL}/disease-detection/scan`,
      {
        cropCycleId: activeCycle._id,
        cropName: 'Wheat',
        userNotes: 'Orange rust pustules on upper leaves',
        imageBase64: '/assets/sample-wheat-leaf.jpg',
      },
      farmerAuth
    );
    assert(
      'AI Computer Vision Disease Diagnosis',
      scan.data.detection?.detectedDisease.includes('Rust') && scan.data.detection?.confidenceScore > 75,
      `(Diagnosis: ${scan.data.detection?.detectedDisease}, Confidence: ${scan.data.detection?.confidenceScore}%)`
    );

    // 12. Blockchain Crop Passport & Cryptographic Validation
    const passport = await axios.get(`${BASE_URL}/passport/cycle/${activeCycle._id}`, farmerAuth);
    assert(
      'Blockchain Crop Passport Ledger',
      passport.data.isAuthentic && passport.data.passport?.blocks?.length >= 2,
      `(Passport ID: ${passport.data.passport.passportId}, Blocks: ${passport.data.passport.blocks.length}, Merkle Root: ${passport.data.passport.merkleRootHash.substring(0, 16)}...)`
    );

    // Public Verification
    const publicVerify = await axios.get(`${BASE_URL}/passport/verify/${passport.data.passport.passportId}`);
    assert(
      'Public Verifier Verification Endpoint',
      publicVerify.data.summary?.isAuthentic,
      `(Status: ${publicVerify.data.summary.status}, Verified Milestones: ${publicVerify.data.summary.totalVerifiedMilestones})`
    );

    // 13. Specialist Consultation Workflow
    const consultRes = await axios.post(
      `${BASE_URL}/consultations`,
      {
        cropCycleId: activeCycle._id,
        subject: 'Foliar Rust Urgent Advisory',
        farmerDescription: 'Leaf photo scanned with 87% rust confidence. Need official spray recommendation.',
      },
      farmerAuth
    );
    assert('Specialist Consultation Request Submission', !!consultRes.data.consultation?._id, `(ID: ${consultRes.data.consultation?._id})`);

    const prescribeRes = await axios.post(
      `${BASE_URL}/consultations/${consultRes.data.consultation._id}/prescribe`,
      {
        specialistDiagnosis: 'Confirmed Early-Stage Wheat Leaf Rust',
        professionalAdvice: 'Apply Propiconazole 25% EC @ 1ml/L immediately.',
        prescriptionDetails: {
          chemicalTreatments: [{ chemicalName: 'Tilt (Propiconazole)', dosagePerAcre: '200 ml', sprayIntervalDays: 14 }],
        },
      },
      specAuth
    );
    assert('Specialist Prescription & Blockchain Stamping', prescribeRes.data.consultation?.status === 'PRESCRIBED');

    // 14. Admin Operations Portal
    const adminAnalytics = await axios.get(`${BASE_URL}/admin/analytics`, adminAuth);
    assert(
      'Admin Platform Analytics & KPIs',
      adminAnalytics.data.analytics?.totalFarmers > 0 && adminAnalytics.data.analytics?.activeFarms > 0,
      `(Farmers: ${adminAnalytics.data.analytics.totalFarmers}, Farms: ${adminAnalytics.data.analytics.activeFarms}, Alerts: ${adminAnalytics.data.analytics.totalAlerts})`
    );

    const ledger = await axios.get(`${BASE_URL}/admin/blockchain-ledger`, adminAuth);
    assert('Admin Blockchain Ledger Audit', ledger.data.totalMinedBlocks > 0, `(${ledger.data.totalMinedBlocks} blocks audited on ledger)`);

    console.log('\n========================================================');
    console.log(`🎉 ALL TESTS COMPLETED: ${passed} PASSED, ${failed} FAILED`);
    console.log('========================================================\n');
  } catch (err) {
    console.error('❌ Test execution error:', err.response?.data || err.message);
  }
}

runTests();
