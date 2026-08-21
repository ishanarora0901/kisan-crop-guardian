const express = require('express');
const router = express.Router();
const { runWhatIfSimulation } = require('../controllers/simulatorController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/compare', runWhatIfSimulation);

module.exports = router;
