const jwt = require('jsonwebtoken');
const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');
const SpecialistProfile = require('../models/SpecialistProfile');
const { JWT_SECRET } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc Register a new user (Farmer, Specialist, Verifier)
// @route POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, role = 'farmer', state, district, specialization, qualification } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
    });

    if (role === 'farmer') {
      await FarmerProfile.create({
        user: user._id,
        state: state || 'Punjab',
        district: district || 'Ludhiana',
      });
    } else if (role === 'specialist') {
      await SpecialistProfile.create({
        user: user._id,
        specialization: specialization ? [specialization] : ['Plant Pathology'],
        qualification: qualification || 'M.Sc. / Ph.D. Agronomy',
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isPremium: user.isPremium,
        languagePreference: user.languagePreference,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Login user & get token
// @route POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      let profileData = null;
      if (user.role === 'farmer') {
        profileData = await FarmerProfile.findOne({ user: user._id });
      } else if (user.role === 'specialist') {
        profileData = await SpecialistProfile.findOne({ user: user._id });
      }

      return res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isPremium: user.isPremium,
          languagePreference: user.languagePreference,
          profile: profileData,
        },
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
  } catch (error) {
    next(error);
  }
};

// @desc Get current logged-in user profile
// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let profile = null;

    if (user.role === 'farmer') {
      profile = await FarmerProfile.findOne({ user: user._id });
    } else if (user.role === 'specialist') {
      profile = await SpecialistProfile.findOne({ user: user._id });
    }

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle premium membership
// @route POST /api/auth/toggle-premium
const togglePremium = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.isPremium = !user.isPremium;
    if (user.isPremium) {
      user.subscriptionExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    }
    await user.save();

    res.json({
      success: true,
      isPremium: user.isPremium,
      message: user.isPremium ? 'Upgraded to AI Crop Guardian Pro Tier!' : 'Switched to Standard Tier.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get pre-seeded demo accounts for 1-click login testing
// @route GET /api/auth/demo-accounts
const getDemoAccounts = async (req, res) => {
  res.json({
    success: true,
    accounts: [
      {
        role: 'farmer',
        label: 'Harpreet Singh (Farmer - Punjab)',
        email: 'farmer@cropguardian.ai',
        password: 'password123',
        description: 'Active wheat & rice farmer with multi-season data and active high-risk alerts',
      },
      {
        role: 'specialist',
        label: 'Dr. Ramesh Sharma (Plant Pathologist)',
        email: 'specialist@cropguardian.ai',
        password: 'password123',
        description: 'Verified ICAR agronomist ready to review disease cases and issue prescriptions',
      },
      {
        role: 'admin',
        label: 'Chief Agri Officer (Platform Admin)',
        email: 'admin@cropguardian.ai',
        password: 'adminpassword123',
        description: 'Full administrative access to platform telemetry, blockchain audits, and alert broadcasts',
      },
    ],
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  togglePremium,
  getDemoAccounts,
};
