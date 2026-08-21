const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, togglePremium, getDemoAccounts } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/toggle-premium', protect, togglePremium);
router.get('/demo-accounts', getDemoAccounts);

module.exports = router;
