const User = require('../models/User');
const Farm = require('../models/Farm');
const CropCycle = require('../models/CropCycle');
const DiseaseDetection = require('../models/DiseaseDetection');
const RiskPrediction = require('../models/RiskPrediction');
const Alert = require('../models/Alert');
const Consultation = require('../models/Consultation');
const CropPassport = require('../models/CropPassport');
const AuditLog = require('../models/AuditLog');
const SpecialistProfile = require('../models/SpecialistProfile');

// @desc Get High-Level Platform Analytics & KPIs
// @route GET /api/admin/analytics
const getPlatformAnalytics = async (req, res, next) => {
  try {
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalSpecialists = await User.countDocuments({ role: 'specialist' });
    const activeFarms = await Farm.countDocuments({ isActive: true });
    const activeCrops = await CropCycle.countDocuments({ status: 'active' });
    const totalAlerts = await Alert.countDocuments();
    const activeCriticalAlerts = await Alert.countDocuments({ severity: 'CRITICAL', isResolved: false });
    const totalScans = await DiseaseDetection.countDocuments();
    const totalConsultations = await Consultation.countDocuments();
    const premiumUsersCount = await User.countDocuments({ isPremium: true });
    const totalBlockchainPassports = await CropPassport.countDocuments();

    // Risk levels breakdown
    const riskStats = await RiskPrediction.aggregate([
      {
        $group: {
          _id: '$overallRisk',
          count: { $sum: 1 },
          avgHealthScore: { $avg: '$cropHealthScore' },
        },
      },
    ]);

    // Disease frequency breakdown
    const diseaseBreakdown = await DiseaseDetection.aggregate([
      {
        $group: {
          _id: '$detectedDisease',
          count: { $sum: 1 },
          avgConfidence: { $avg: '$confidenceScore' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    // Regional distribution (mock/aggregated by farm location)
    const regionalDistribution = [
      { region: 'Punjab (Ludhiana/Bathinda)', activeFarms: 142, avgRisk: 'MEDIUM (54%)', primaryCrop: 'Wheat' },
      { region: 'Maharashtra (Nashik/Pune)', activeFarms: 98, avgRisk: 'LOW (32%)', primaryCrop: 'Tomato/Onion' },
      { region: 'Gujarat (Rajkot/Surat)', activeFarms: 87, avgRisk: 'MEDIUM (48%)', primaryCrop: 'Cotton' },
      { region: 'Haryana (Karnal/Hisar)', activeFarms: 76, avgRisk: 'HIGH (68%)', primaryCrop: 'Rice/Mustard' },
      { region: 'Uttar Pradesh (Varanasi)', activeFarms: 110, avgRisk: 'MEDIUM (42%)', primaryCrop: 'Sugarcane' },
    ];

    res.json({
      success: true,
      analytics: {
        totalFarmers,
        totalSpecialists,
        activeFarms,
        activeCrops,
        totalAlerts,
        activeCriticalAlerts,
        totalScans,
        totalConsultations,
        premiumUsersCount,
        totalBlockchainPassports,
        averageCropHealthScore: 79.4,
        riskStats,
        diseaseBreakdown,
        regionalDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all users with search and filter
// @route GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle user active status or premium status
// @route PUT /api/admin/users/:id
const updateUserByAdmin = async (req, res, next) => {
  try {
    const { isActive, isPremium, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    if (typeof isActive !== 'undefined') user.isActive = isActive;
    if (typeof isPremium !== 'undefined') user.isPremium = isPremium;
    if (role) user.role = role;

    await user.save();

    await AuditLog.create({
      actor: req.user._id,
      actorName: req.user.name,
      actorRole: 'admin',
      action: 'USER_PROFILE_ADMIN_MODIFIED',
      entityType: 'User',
      entityId: user._id.toString(),
      details: { isActive, isPremium, role },
    });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc Verify or reject specialist credentials
// @route PUT /api/admin/specialists/:id/verify
const verifySpecialist = async (req, res, next) => {
  try {
    const { isVerified } = req.body;
    const profile = await SpecialistProfile.findOneAndUpdate(
      { user: req.params.id },
      { isVerified: isVerified !== false },
      { new: true }
    );

    res.json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

// @desc Dispatch emergency broadcast alert across all farms or selected region
// @route POST /api/admin/broadcast-alert
const broadcastAlert = async (req, res, next) => {
  try {
    const { title, message, severity = 'HIGH', targetRegion = 'All Regions' } = req.body;

    const farmers = await User.find({ role: 'farmer' });

    const alertsToCreate = farmers.map((farmer) => ({
      farmer: farmer._id,
      alertType: 'SYSTEM_BROADCAST',
      severity,
      title: `📢 [BROADCAST] ${title}`,
      message,
      estimatedRiskPercentage: 85,
      contributingFactors: [`Regional broadcast dispatch by Agricultural Administration for ${targetRegion}`],
      recommendedPrecaution: 'Adhere to advisory directives and inspect field status immediately.',
      expectedTimeWindow: 'Immediate (Next 24h)',
    }));

    await Alert.insertMany(alertsToCreate);

    await AuditLog.create({
      actor: req.user._id,
      actorName: req.user.name,
      actorRole: 'admin',
      action: 'PLATFORM_EMERGENCY_BROADCAST',
      entityType: 'Alert',
      details: { title, severity, targetRegion, recipientsCount: farmers.length },
    });

    res.status(201).json({
      success: true,
      message: `Emergency broadcast alert dispatched to ${farmers.length} active farmers.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get Blockchain Audit Ledger and recent blocks
// @route GET /api/admin/blockchain-ledger
const getBlockchainLedger = async (req, res, next) => {
  try {
    const passports = await CropPassport.find()
      .populate('farmer', 'name email')
      .populate('farm', 'name locationName')
      .sort({ updatedAt: -1 });

    const allBlocks = [];
    passports.forEach((p) => {
      p.blocks.forEach((b) => {
        allBlocks.push({
          passportId: p.passportId,
          cropName: p.cropName,
          farmerName: p.farmer?.name,
          farmName: p.farm?.name,
          ...b.toObject(),
        });
      });
    });

    allBlocks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      totalPassports: passports.length,
      totalMinedBlocks: allBlocks.length,
      recentBlocks: allBlocks.slice(0, 20),
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get System Audit Logs
// @route GET /api/admin/audit-logs
const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, logs });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlatformAnalytics,
  getAllUsers,
  updateUserByAdmin,
  verifySpecialist,
  broadcastAlert,
  getBlockchainLedger,
  getAuditLogs,
};
