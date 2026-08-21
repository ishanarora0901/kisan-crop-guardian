const express = require('express');
const router = express.Router();
const { recordFinancials, getFinancials } = require('../controllers/financialController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').post(recordFinancials).get(getFinancials);

module.exports = router;
