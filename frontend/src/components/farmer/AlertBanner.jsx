import React from 'react';
import { AlertCircle, AlertTriangle, CloudRain, History, CheckCircle2 } from 'lucide-react';
import VoiceSpeaker from '../common/VoiceSpeaker';

const AlertBanner = ({ alert, onResolve }) => {
  if (!alert) return null;

  const isHistorical = alert.alertType === 'HISTORICAL_RISK_ALERT';
  const isHighRisk = alert.severity === 'HIGH' || alert.severity === 'CRITICAL';

  return (
    <div
      className={`p-5 rounded-2xl border transition-all mb-4 ${
        isHistorical
          ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/40 shadow-lg shadow-amber-500/5'
          : isHighRisk
          ? 'bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border-red-500/40 shadow-lg shadow-red-500/5'
          : 'bg-slate-900/90 border-slate-800'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          {isHistorical ? (
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <History className="w-5 h-5" />
            </div>
          ) : isHighRisk ? (
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 animate-pulse">
              <AlertCircle className="w-5 h-5" />
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <CloudRain className="w-5 h-5" />
            </div>
          )}

          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-white">{alert.title}</h4>
            <p className="text-xs text-slate-400">
              Estimated Probability: <span className="font-bold text-amber-400">{alert.estimatedRiskPercentage}%</span> · Time Window: <span className="text-slate-300 font-medium">{alert.expectedTimeWindow}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <VoiceSpeaker text={`${alert.title}. ${alert.message}. Recommended Precaution: ${alert.recommendedPrecaution}`} />
          {onResolve && !alert.isResolved && (
            <button
              onClick={() => onResolve(alert._id)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              Acknowledge
            </button>
          )}
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">{alert.message}</p>

      {/* Contributing Factors Bullet List */}
      {alert.contributingFactors && alert.contributingFactors.length > 0 && (
        <div className="mb-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Possible Contributing Factors:
          </p>
          <ul className="space-y-1">
            {alert.contributingFactors.map((factor, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Precaution Banner */}
      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs">
        <p className="font-bold text-emerald-300 mb-0.5">Recommended Precaution:</p>
        <p className="text-emerald-100/90 leading-relaxed">{alert.recommendedPrecaution}</p>
      </div>
    </div>
  );
};

export default AlertBanner;
