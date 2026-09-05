import React from 'react';
import { Activity, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const HealthScoreGauge = ({ score = 81, overallRisk = 'MEDIUM' }) => {
  const { t } = useLanguage();

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'LOW':
        return { text: 'text-forest-900', bg: 'bg-emerald-100', border: 'border-emerald-300', stroke: '#0b4635' };
      case 'MEDIUM':
        return { text: 'text-amber-900', bg: 'bg-amber-100', border: 'border-amber-300', stroke: '#d97706' };
      case 'HIGH':
        return { text: 'text-orange-900', bg: 'bg-orange-100', border: 'border-orange-300', stroke: '#ea580c' };
      case 'CRITICAL':
        return { text: 'text-red-900', bg: 'bg-red-100', border: 'border-red-300', stroke: '#dc2626' };
      default:
        return { text: 'text-forest-900', bg: 'bg-emerald-100', border: 'border-emerald-300', stroke: '#0b4635' };
    }
  };

  const colors = getRiskColor(overallRisk);
  const strokeDashoffset = 283 - (283 * score) / 100;

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden border border-sage-200 shadow-sm">
      {/* Background soft ambient glow */}
      <div className={`absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-20 ${colors.bg}`}></div>

      <div className="flex items-center gap-2 mb-4">
        <Activity className={`w-5 h-5 ${colors.text}`} />
        <h3 className="font-black text-sm text-forest-950 tracking-wide">{t('cropHealthScore')}</h3>
      </div>

      {/* SVG Radial Gauge */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="transparent"
            stroke="#e2ece5"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="transparent"
            stroke={colors.stroke}
            strokeWidth="8"
            strokeDasharray="264"
            strokeDashoffset={264 - (264 * score) / 100}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black text-forest-950 tracking-tight">{score}</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">/ 100</span>
        </div>
      </div>

      {/* Overall Risk Level Badge */}
      <div className="mt-5 w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-sage-50 border border-sage-200">
        <span className="text-xs text-slate-600 font-bold">{t('overallRisk')}:</span>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider border ${colors.bg} ${colors.text} ${colors.border}`}>
          {overallRisk}
        </span>
      </div>
    </div>
  );
};

export default HealthScoreGauge;
