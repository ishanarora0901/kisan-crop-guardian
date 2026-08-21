const express = require('express');
const router = express.Router();
const {
  getLatestRiskPrediction,
  recalculateRisk,
  getFarmerAlerts,
  resolveAlert,
} = require('../controllers/aiRiskController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/alerts', getFarmerAlerts);
router.put('/alerts/:id/resolve', resolveAlert);
router.get('/:cropCycleId', getLatestRiskPrediction);
router.post('/:cropCycleId/recalculate', recalculateRisk);

module.exports = router;
