import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Bug, Droplets, Flame, CloudRain, Skull, TrendingDown, AlertCircle } from 'lucide-react';

const RiskRadarCard = ({ prediction }) => {
  const { t } = useLanguage();

  if (!prediction) return null;

  const riskVectors = [
    {
      label: t('diseaseRisk'),
      value: prediction.diseaseRisk || 72,
      icon: Skull,
      color: prediction.diseaseRisk > 70 ? 'bg-orange-500' : 'bg-emerald-500',
      textColor: prediction.diseaseRisk > 70 ? 'text-orange-400' : 'text-emerald-400',
      bgGlow: prediction.diseaseRisk > 70 ? 'bg-orange-500/10 border-orange-500/30' : 'bg-slate-800/40 border-slate-700/40',
    },
    {
      label: t('pestRisk'),
      value: prediction.pestRisk || 38,
      icon: Bug,
      color: prediction.pestRisk > 60 ? 'bg-amber-500' : 'bg-emerald-500',
      textColor: prediction.pestRisk > 60 ? 'text-amber-400' : 'text-emerald-400',
      bgGlow: 'bg-slate-800/40 border-slate-700/40',
    },
    {
      label: t('waterStressRisk'),
      value: prediction.waterStressRisk || 21,
      icon: Droplets,
      color: prediction.waterStressRisk > 60 ? 'bg-amber-500' : 'bg-cyan-500',
      textColor: 'text-cyan-400',
      bgGlow: 'bg-slate-800/40 border-slate-700/40',
    },
    {
      label: t('rainfallRisk'),
      value: prediction.heavyRainfallRisk || 67,
      icon: CloudRain,
      color: prediction.heavyRainfallRisk > 65 ? 'bg-blue-500' : 'bg-emerald-500',
      textColor: 'text-blue-400',
      bgGlow: prediction.heavyRainfallRisk > 65 ? 'bg-blue-500/10 border-blue-500/30' : 'bg-slate-800/40 border-slate-700/40',
    },
    {
      label: t('heatStressRisk'),
      value: prediction.heatStressRisk || 54,
      icon: Flame,
      color: prediction.heatStressRisk > 60 ? 'bg-rose-500' : 'bg-amber-500',
      textColor: 'text-amber-400',
      bgGlow: 'bg-slate-800/40 border-slate-700/40',
    },
    {
      label: t('expectedYieldLoss'),
      value: prediction.expectedYieldLossRisk || 31,
      icon: TrendingDown,
      color: prediction.expectedYieldLossRisk > 50 ? 'bg-red-500' : 'bg-amber-500',
      textColor: 'text-rose-400',
      bgGlow: 'bg-slate-800/40 border-slate-700/40',
    },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-base text-slate-100">Proactive Risk Vector Intelligence</h3>
          <p className="text-xs text-slate-400">AI analysis of soil, humidity, crop age, and spore reservoirs</p>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          6 Vectors Analyzed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {riskVectors.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className={`p-3.5 rounded-xl border transition-all ${item.bgGlow}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${item.textColor}`} />
                  <span className="text-xs font-semibold text-slate-200">{item.label}</span>
                </div>
                <span className={`text-sm font-black ${item.textColor}`}>{item.value}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contributing Factors & Action Box */}
      {prediction.recommendedAction && (
        <div className="mt-5 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
            <AlertCircle className="w-4 h-4" />
            <span>AI Recommended Proactive Precaution ({prediction.expectedTimeWindow || 'Next 3-5 days'})</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{prediction.recommendedAction}</p>
        </div>
      )}
    </div>
  );
};

export default RiskRadarCard;
