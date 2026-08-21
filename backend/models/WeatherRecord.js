const mongoose = require('mongoose');

const weatherRecordSchema = new mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    temperatureCelsius: {
      type: Number,
      required: true,
    },
    tempMin: Number,
    tempMax: Number,
    humidityPercentage: {
      type: Number,
      required: true,
    },
    rainfallMm: {
      type: Number,
      default: 0,
    },
    rainfallProbability: {
      type: Number,
      default: 10,
    },
    windSpeedKmh: {
      type: Number,
      default: 12,
    },
    windDirection: {
      type: String,
      default: 'NW',
    },
    uvIndex: {
      type: Number,
      default: 5,
    },
    condition: {
      type: String,
      default: 'Partly Cloudy',
    },
    extremeWeatherWarning: {
      type: String,
      default: null,
    },
    forecast7Days: [
      {
        date: String,
        dayName: String,
        tempMax: Number,
        tempMin: Number,
        humidity: Number,
        rainProbability: Number,
        condition: String,
        icon: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('WeatherRecord', weatherRecordSchema);
