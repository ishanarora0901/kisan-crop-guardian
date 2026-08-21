const Farm = require('../models/Farm');
const WeatherService = require('../services/weatherService');

// @desc Get current live weather & 7-day agricultural forecast for a farm
// @route GET /api/weather/farm/:farmId
const getWeatherForFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.farmId);
    if (!farm) return res.status(404).json({ success: false, message: 'Farm not found.' });

    const weather = await WeatherService.getFarmWeather(farm);
    res.json({ success: true, weather });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWeatherForFarm,
};
