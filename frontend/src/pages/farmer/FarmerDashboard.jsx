import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  getCropCyclesApi,
  getLatestRiskApi,
  getAlertsApi,
  resolveAlertApi,
  getHistoricalComparisonApi,
} from '../../services/api';
import HealthScoreGauge from '../../components/farmer/HealthScoreGauge';
import RiskRadarCard from '../../components/farmer/RiskRadarCard';
import WeatherWidget from '../../components/farmer/WeatherWidget';
import AlertBanner from '../../components/farmer/AlertBanner';
import VoiceSpeaker from '../../components/common/VoiceSpeaker';
import {
  Sprout,
  Tractor,
  ScanEye,
  TrendingUp,
  Sliders,
  ShieldCheck,
  Stethoscope,
  RefreshCw,
  Sparkles,
  Calendar,
  Layers,
  ArrowUpRight,
  AlertTriangle,
} from 'lucide-react';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [cropCycles, setCropCycles] = useState([]);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const cyclesRes = await getCropCyclesApi();
      const cycles = cyclesRes.data.cropCycles || [];
      setCropCycles(cycles);

      const active = cycles.find((c) => c.status === 'active') || cycles[0];
      setSelectedCycle(active);

      if (active) {
        const [riskRes, alertsRes, histRes] = await Promise.all([
          getLatestRiskApi(active._id),
          getAlertsApi(),
          getHistoricalComparisonApi(active._id),
        ]);

        setRiskData(riskRes.data.prediction);
        setWeatherData(riskRes.data.weather);
        setAlerts(alertsRes.data.alerts || []);
        setHistoricalData(histRes.data.comparison);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCycleChange = async (cycleId) => {
    const cycle = cropCycles.find((c) => c._id === cycleId);
    if (!cycle) return;
    setSelectedCycle(cycle);
    try {
      const riskRes = await getLatestRiskApi(cycle._id);
      setRiskData(riskRes.data.prediction);
      setWeatherData(riskRes.data.weather);
      const histRes = await getHistoricalComparisonApi(cycle._id);
      setHistoricalData(histRes.data.comparison);
    } catch (err) {
      console.error('Error changing cycle:', err);
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await resolveAlertApi(alertId);
      setAlerts((prev) => prev.filter((a) => a._id !== alertId));
    } catch (err) {
      console.error('Error resolving alert:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-slate-300">
          Aggregating microclimate telemetry, soil records & AI crop risk...
        </p>
      </div>
    );
  }

  const activeAlerts = alerts.filter((a) => !a.isResolved);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Farm & Crop Selector */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                Farmer Intelligence Command
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {user?.name || 'Harpreet Singh'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Proactive AI Decision Support · Farm:{' '}
              <strong className="text-slate-200">{selectedCycle?.farm?.name || 'Green Acres Sector 4'}</strong> (
              {selectedCycle?.farm?.locationName || 'Ludhiana, Punjab'})
            </p>
          </div>

          {/* Active Crop Cycle Selector */}
          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            {cropCycles.length > 0 && (
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl w-full sm:w-auto">
                <Sprout className="w-4 h-4 text-emerald-400 ml-2 shrink-0" />
                <select
                  value={selectedCycle?._id || ''}
                  onChange={(e) => handleCycleChange(e.target.value)}
                  className="bg-transparent text-xs font-bold text-white pr-4 py-1.5 focus:outline-none cursor-pointer"
                >
                  {cropCycles.map((cycle) => (
                    <option key={cycle._id} value={cycle._id} className="bg-slate-900 text-white">
                      {cycle.cropName} ({cycle.cropVariety}) - {cycle.season}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={fetchDashboardData}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
              title="Refresh Telemetry & AI Prediction"
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Selected Crop Meta Strip */}
        {selectedCycle && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Crop Age & Stage</span>
              <p className="font-extrabold text-white mt-0.5">
                {selectedCycle.cropAgeDays || 82} Days · {selectedCycle.currentGrowthStage || 'Ear Emergence'}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Field Allocation</span>
              <p className="font-extrabold text-white mt-0.5">{selectedCycle.fieldAreaAcres || 5} Acres</p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Expected Harvest</span>
              <p className="font-extrabold text-white mt-0.5">
                {new Date(selectedCycle.expectedHarvestDate).toLocaleDateString()}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
              <span className="text-[10px] text-emerald-400 font-bold uppercase">Passport ID</span>
              <p className="font-mono text-[11px] font-extrabold text-emerald-300 mt-0.5 truncate">
                {selectedCycle.blockchainPassportId || 'CROP-PASS-WHEAT-2026'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ACTIVE EARLY-WARNING PROACTIVE ALERTS */}
      {activeAlerts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              <h2 className="font-extrabold text-base text-white">{t('activeAlerts')}</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {activeAlerts.length} urgent notices requiring preventive action
            </span>
          </div>

          <div className="space-y-3">
            {activeAlerts.map((alert) => (
              <AlertBanner key={alert._id} alert={alert} onResolve={handleResolveAlert} />
            ))}
          </div>
        </div>
      )}

      {/* CORE INTELLIGENCE GRID: Health Score + 6 Risk Vectors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <HealthScoreGauge
            score={riskData?.cropHealthScore || 81}
            overallRisk={riskData?.overallRisk || 'MEDIUM'}
          />

          {/* Quick AI Proactive USP Statement */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Proactive Philosophy</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{t('proactiveMessage')}</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <RiskRadarCard
            prediction={
              riskData || {
                diseaseRisk: 72,
                pestRisk: 38,
                waterStressRisk: 21,
                heatStressRisk: 54,
                heavyRainfallRisk: 67,
                expectedYieldLossRisk: 31,
                recommendedAction:
                  'Inspect wheat foliage for early yellow rust pustules and apply prophylactic bio-fungicide.',
                expectedTimeWindow: 'Next 3 to 5 days',
              }
            }
          />
        </div>
      </div>

      {/* WEATHER & LIVE MICROCLIMATE */}
      <WeatherWidget weather={weatherData} farmName={selectedCycle?.farm?.name} />

      {/* FINANCIAL & MULTI-SEASON COMPARISON PREVIEW */}
      {historicalData && (
        <div className="glass-panel p-6 rounded-3xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                Financial Optimization Intelligence
              </span>
              <h3 className="text-xl font-extrabold text-white mt-0.5">
                Previous Season vs Current Season AI Estimate
              </h3>
            </div>
            <Link
              to="/profitability"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all"
            >
              <span>Detailed Breakdown</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Last Season Actual */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">LAST SEASON (ACTUAL)</span>
              <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Recorded Yield:</span>
                  <p className="text-lg font-bold text-white mt-0.5">
                    {historicalData.lastSeason?.totalYieldQuintals || 48} Quintals
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Total Revenue:</span>
                  <p className="text-lg font-bold text-white mt-0.5">
                    ₹{(historicalData.lastSeason?.totalRevenue || 112000).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Total Cost:</span>
                  <p className="text-lg font-bold text-slate-300 mt-0.5">
                    ₹{(historicalData.lastSeason?.totalCost || 72000).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Realized Net Profit:</span>
                  <p className="text-lg font-extrabold text-amber-400 mt-0.5">
                    ₹{(historicalData.lastSeason?.netProfit || 40000).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-rose-400/90 font-medium">
                Impact: {historicalData.lastSeason?.primaryDiseaseOrIssue || 'Fungal Yellow Rust (Yield drop 12%)'}
              </p>
            </div>

            {/* Current Season AI Estimate */}
            <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 shadow-lg shadow-emerald-500/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  CURRENT SEASON — AI ESTIMATE
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Statistical Model
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                <div>
                  <span className="text-emerald-400/80 font-medium">Expected Yield:</span>
                  <p className="text-lg font-bold text-white mt-0.5">
                    {historicalData.currentEstimate?.totalYieldQuintals || 53} Quintals
                  </p>
                </div>
                <div>
                  <span className="text-emerald-400/80 font-medium">Estimated Revenue:</span>
                  <p className="text-lg font-bold text-white mt-0.5">
                    ₹{(historicalData.currentEstimate?.totalRevenue || 130000).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-emerald-400/80 font-medium">Estimated Cost:</span>
                  <p className="text-lg font-bold text-slate-300 mt-0.5">
                    ₹{(historicalData.currentEstimate?.totalCost || 75000).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-emerald-400/80 font-medium">Expected Profit:</span>
                  <p className="text-lg font-extrabold text-emerald-400 mt-0.5">
                    ₹{(historicalData.currentEstimate?.netProfit || 55000).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">{t('potentialImprovement')}:</span>
                <span className="text-sm font-black text-emerald-400">
                  +₹{(historicalData.deltas?.profitImprovement || 15000).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ACTIONS DOCK */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/disease-scanner"
          className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col items-center text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <ScanEye className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-white">Scan Leaf Photo</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Instant AI Disease Vision</p>
        </Link>

        <Link
          to="/what-if-simulator"
          className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col items-center text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Sliders className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-white">What-If Simulator</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Compare Alternate Crops</p>
        </Link>

        <Link
          to="/crop-passport"
          className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col items-center text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-white">Blockchain Passport</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Verifiable Farm Ledger</p>
        </Link>

        <Link
          to="/consultations"
          className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-rose-500/40 transition-all flex flex-col items-center text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Stethoscope className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-white">Consult Specialist</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Verified ICAR Agronomists</p>
        </Link>
      </div>
    </div>
  );
};

export default FarmerDashboard;
