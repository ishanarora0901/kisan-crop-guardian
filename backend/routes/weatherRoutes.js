const express = require('express');
const router = express.Router();
const { getWeatherForFarm } = require('../controllers/weatherController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/farm/:farmId', getWeatherForFarm);

module.exports = router;
