import React from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, AlertTriangle, MapPin } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const WeatherWidget = ({ weather, farmName = 'Green Acres Farm' }) => {
  const { t } = useLanguage();

  if (!weather) return null;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-sage-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-forest-800" />
          <h3 className="font-black text-sm text-forest-950 truncate">{farmName} Microclimate</h3>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
          Live Open-Meteo
        </span>
      </div>

      {/* Primary Weather Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-sage-50 border border-sage-200">
          <div className="flex items-center gap-1.5 text-slate-600 text-xs font-bold mb-1">
            <Sun className="w-3.5 h-3.5 text-amber-700" />
            <span>{t('temperature')}</span>
          </div>
          <p className="text-xl font-black text-forest-950">{weather.temperatureCelsius}°C</p>
          <p className="text-[10px] text-slate-500 font-medium">Min: {weather.tempMin}° / Max: {weather.tempMax}°</p>
        </div>

        <div className="p-3 rounded-xl bg-sage-50 border border-sage-200">
          <div className="flex items-center gap-1.5 text-slate-600 text-xs font-bold mb-1">
            <Droplets className="w-3.5 h-3.5 text-teal-700" />
            <span>{t('humidity')}</span>
          </div>
          <p className="text-xl font-black text-forest-950">{weather.humidityPercentage}%</p>
          <p className="text-[10px] text-amber-800 font-bold">Spore multiplication zone</p>
        </div>

        <div className="p-3 rounded-xl bg-sage-50 border border-sage-200">
          <div className="flex items-center gap-1.5 text-slate-600 text-xs font-bold mb-1">
            <CloudRain className="w-3.5 h-3.5 text-blue-700" />
            <span>{t('rainfall')}</span>
          </div>
          <p className="text-xl font-black text-forest-950">{weather.rainfallProbability}%</p>
          <p className="text-[10px] text-slate-500 font-medium">{weather.rainfallMm} mm measured</p>
        </div>

        <div className="p-3 rounded-xl bg-sage-50 border border-sage-200">
          <div className="flex items-center gap-1.5 text-slate-600 text-xs font-bold mb-1">
            <Wind className="w-3.5 h-3.5 text-slate-600" />
            <span>{t('windSpeed')}</span>
          </div>
          <p className="text-xl font-black text-forest-950">{weather.windSpeedKmh} km/h</p>
          <p className="text-[10px] text-slate-500 font-medium">{weather.windDirection} Direction</p>
        </div>
      </div>

      {/* Extreme Weather Advisory Banner */}
      {weather.extremeWeatherWarning && (
        <div className="p-3.5 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs flex items-center gap-2 mb-4 font-semibold">
          <AlertTriangle className="w-4 h-4 text-amber-800 shrink-0" />
          <span>{weather.extremeWeatherWarning}</span>
        </div>
      )}

      {/* 7-Day Mini Agricultural Forecast */}
      {weather.forecast7Days && weather.forecast7Days.length > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-700 mb-2">7-Day Agricultural Micro-Forecast</p>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {weather.forecast7Days.slice(0, 7).map((day, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-white border border-sage-200 text-center shadow-sm">
                <p className="text-[10px] font-bold text-slate-600">{day.dayName}</p>
                <div className="my-1.5 flex justify-center">
                  {day.rainProbability > 50 ? (
                    <CloudRain className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-600" />
                  )}
                </div>
                <p className="text-xs font-black text-forest-950">{day.tempMax}°</p>
                <p className="text-[9px] text-blue-700 font-bold">{day.rainProbability}% rain</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
