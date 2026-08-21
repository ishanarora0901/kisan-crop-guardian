const express = require('express');
const router = express.Router();
const { getHistoricalComparison, getMultiSeasonTimeline } = require('../controllers/historicalController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/comparison/:cropCycleId', getHistoricalComparison);
router.get('/seasons', getMultiSeasonTimeline);

module.exports = router;
