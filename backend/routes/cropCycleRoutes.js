const express = require('express');
const router = express.Router();
const {
  createCropCycle,
  getCropCycles,
  getCropCycleById,
  logSoilRecord,
} = require('../controllers/cropCycleController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').post(createCropCycle).get(getCropCycles);
router.route('/:id').get(getCropCycleById);
router.route('/:id/soil').post(logSoilRecord);

module.exports = router;
