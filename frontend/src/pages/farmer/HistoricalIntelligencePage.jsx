import React, { useState, useEffect } from 'react';
import { getHistoricalSeasonsApi, getAlertsApi } from '../../services/api';
import VoiceSpeaker from '../../components/common/VoiceSpeaker';
import {
  History,
  AlertTriangle,
  Calendar,
  Layers,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const HistoricalIntelligencePage = () => {
  const [seasons, setSeasons] = useState([]);
  const [historicalAlerts, setHistoricalAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [seasonsRes, alertsRes] = await Promise.all([
          getHistoricalSeasonsApi(),
          getAlertsApi(),
        ]);

        setSeasons(seasonsRes.data.records || []);
        const histOnly = (alertsRes.data.alerts || []).filter(
          (a) => a.alertType === 'HISTORICAL_RISK_ALERT'
        );
        setHistoricalAlerts(histOnly);
      } catch (err) {
        console.error('Error loading historical intelligence:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
            Multi-Season Farm Memory
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
            Agronomic Pattern Matcher
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Historical Crop Intelligence</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          The AI engine cross-references real-time field microclimate metrics against multi-season logs to detect
          disease recurrence patterns before outbreaks become uncontrollable.
        </p>
      </div>

      {/* ACTIVE HISTORICAL PATTERN ALERT */}
      {historicalAlerts.length > 0 && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-900 border border-amber-500/40 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 animate-pulse">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">
                  ⚠️ HISTORICAL RISK ALERT: Weather-Disease Recurrence Detected
                </h3>
                <p className="text-xs text-amber-400/90 font-semibold">
                  Estimated Current Recurrence Risk: 74%
                </p>
              </div>
            </div>
            <VoiceSpeaker
              text="Last season, your wheat crop experienced a fungal disease under similar weather conditions. Current environmental conditions show a similar pattern. Increase crop monitoring and take appropriate preventive measures."
            />
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
            "Last season, your wheat crop experienced a fungal disease under similar weather conditions. Current
            environmental conditions show a similar pattern."
          </p>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <span className="font-bold text-amber-300 uppercase tracking-wider block mb-1">
              Historical Corroboration Details:
            </span>
            <p>• Previous Season: Wheat crop sustained 12% yield loss from Fungal Leaf Rust under 84% humidity.</p>
            <p>• Current Microclimate: Relative humidity is at 82% with 26°C temperature, creating an identical spore germination window.</p>
            <p>• Recommended Action: Increase daily crop canopy scouting and initiate prophylactic bio-fungicide protection immediately.</p>
          </div>
        </div>
      )}

      {/* MULTI-SEASON TIMELINE */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-emerald-400" />
          <h2 className="font-bold text-lg text-white">Historical Season Records ({seasons.length})</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {seasons.map((season, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl relative">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Season Record</span>
                  <h3 className="font-extrabold text-base text-white">{season.seasonName}</h3>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    season.isCurrentEstimate
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {season.isCurrentEstimate ? 'AI Projection' : 'Recorded Actual'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-4">
                <div className="p-2.5 rounded-xl bg-slate-900/60">
                  <span className="text-slate-500 font-bold block">Harvest Yield</span>
                  <span className="font-extrabold text-white text-sm">{season.totalYieldQuintals} Quintals</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60">
                  <span className="text-slate-500 font-bold block">Total Revenue</span>
                  <span className="font-extrabold text-white text-sm">₹{season.totalRevenue?.toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60">
                  <span className="text-slate-500 font-bold block">Net Profit</span>
                  <span className="font-extrabold text-emerald-400 text-sm">₹{season.netProfit?.toLocaleString()}</span>
                </div>
              </div>

              {season.primaryDiseaseOrIssue && (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                  <span className="text-slate-400 font-medium">Pathological History: </span>
                  <strong className="text-rose-400">{season.primaryDiseaseOrIssue}</strong>
                  {season.yieldLossPercentage > 0 && (
                    <span className="text-slate-400"> (Yield loss: {season.yieldLossPercentage}%)</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoricalIntelligencePage;
