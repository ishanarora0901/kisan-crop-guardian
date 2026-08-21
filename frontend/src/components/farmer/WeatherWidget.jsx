import React from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, AlertTriangle, MapPin } from 'lucide-react';

const WeatherWidget = ({ weather, farmName = 'Green Acres Farm' }) => {
  if (!weather) return null;

  return (
    <div className="glass-panel p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-sm text-slate-200 truncate">{farmName} Microclimate</h3>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
          Live Open-Meteo
        </span>
      </div>

      {/* Primary Weather Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Temperature</span>
          </div>
          <p className="text-xl font-bold text-white">{weather.temperatureCelsius}°C</p>
          <p className="text-[10px] text-slate-500">Min: {weather.tempMin}° / Max: {weather.tempMax}°</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>Humidity</span>
          </div>
          <p className="text-xl font-bold text-white">{weather.humidityPercentage}%</p>
          <p className="text-[10px] text-amber-400/80 font-medium">Spore multiplication zone</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <CloudRain className="w-3.5 h-3.5 text-blue-400" />
            <span>Rainfall Prob.</span>
          </div>
          <p className="text-xl font-bold text-white">{weather.rainfallProbability}%</p>
          <p className="text-[10px] text-slate-400">{weather.rainfallMm} mm measured</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Wind className="w-3.5 h-3.5 text-slate-400" />
            <span>Wind Speed</span>
          </div>
          <p className="text-xl font-bold text-white">{weather.windSpeedKmh} km/h</p>
          <p className="text-[10px] text-slate-400">{weather.windDirection} Direction</p>
        </div>
      </div>

      {/* Extreme Weather Advisory Banner */}
      {weather.extremeWeatherWarning && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-medium">{weather.extremeWeatherWarning}</span>
        </div>
      )}

      {/* 7-Day Mini Agricultural Forecast */}
      {weather.forecast7Days && weather.forecast7Days.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-400 mb-2">7-Day Agricultural Micro-Forecast</p>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {weather.forecast7Days.slice(0, 7).map((day, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-slate-900/40 border border-slate-800 text-center">
                <p className="text-[10px] font-bold text-slate-300">{day.dayName}</p>
                <div className="my-1 flex justify-center">
                  {day.rainProbability > 50 ? (
                    <CloudRain className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <p className="text-xs font-extrabold text-white">{day.tempMax}°</p>
                <p className="text-[9px] text-blue-400 font-medium">{day.rainProbability}% rain</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
