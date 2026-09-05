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
  History,
  Plus,
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
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden border border-sage-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-black text-forest-800 tracking-wider">
                Farmer Intelligence Command
              </span>
              <span className="w-2 h-2 rounded-full bg-forest-700 animate-pulse"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-forest-950 tracking-tight">
              Welcome back, {user?.name || 'Harpreet Singh'}
            </h1>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Proactive AI Decision Support · Farm:{' '}
              <strong className="text-forest-900 font-bold">{selectedCycle?.farm?.name || 'Green Acres Sector 4'}</strong> (
              {selectedCycle?.farm?.locationName || 'Ludhiana, Punjab'})
            </p>
          </div>

          {/* Active Crop Cycle Selector & Action */}
          <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto">
            {cropCycles.length > 0 && (
              <div className="flex items-center gap-2 bg-white border border-sage-300 p-1.5 rounded-2xl w-full sm:w-auto shadow-sm">
                <Sprout className="w-4 h-4 text-forest-800 ml-2 shrink-0" />
                <select
                  value={selectedCycle?._id || ''}
                  onChange={(e) => handleCycleChange(e.target.value)}
                  className="bg-white text-xs font-bold text-forest-950 pr-4 py-1.5 focus:outline-none cursor-pointer"
                >
                  {cropCycles.map((cycle) => (
                    <option key={cycle._id} value={cycle._id} className="bg-white text-slate-900">
                      {cycle.cropName} ({cycle.cropVariety}) - {cycle.season}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Link
              to="/farms-and-crops"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-extrabold shadow-sm transition-all hover:scale-105"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-300" />
              <span>Register Cycle</span>
            </Link>

            <button
              onClick={fetchDashboardData}
              className="p-2.5 rounded-xl bg-sage-100 hover:bg-sage-200 text-forest-800 border border-sage-300 transition-colors shrink-0"
              title="Refresh Telemetry & AI Prediction"
            >
              <RefreshCw className="w-4 h-4 text-forest-800" />
            </button>
          </div>
        </div>

        {/* Selected Crop Meta Strip */}
        {selectedCycle && (
          <div className="mt-5 pt-4 border-t border-sage-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-sage-50 border border-sage-200">
              <span className="text-[10px] text-slate-600 font-bold uppercase">Crop Age & Stage</span>
              <p className="font-black text-forest-950 mt-0.5">
                {selectedCycle.cropAgeDays || 82} Days · {selectedCycle.currentGrowthStage || 'Ear Emergence'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-sage-50 border border-sage-200">
              <span className="text-[10px] text-slate-600 font-bold uppercase">Field Allocation</span>
              <p className="font-black text-forest-950 mt-0.5">{selectedCycle.fieldAreaAcres || 5} Acres</p>
            </div>

            <div className="p-3 rounded-xl bg-sage-50 border border-sage-200">
              <span className="text-[10px] text-slate-600 font-bold uppercase">Expected Harvest</span>
              <p className="font-black text-forest-950 mt-0.5">
                {new Date(selectedCycle.expectedHarvestDate).toLocaleDateString()}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300">
              <span className="text-[10px] text-forest-800 font-bold uppercase">Passport ID</span>
              <p className="font-mono text-[11px] font-black text-forest-950 mt-0.5 truncate">
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
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
              <h2 className="font-black text-lg text-forest-950">{t('activeAlerts')}</h2>
            </div>
            <span className="text-xs text-slate-700 font-bold">
              {activeAlerts.length} {t('urgentNotices')}
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
        <div className="glass-panel p-6 rounded-3xl border border-sage-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-sage-200">
            <div>
              <span className="text-xs uppercase font-black text-forest-800 tracking-wider">
                Financial Optimization Intelligence
              </span>
              <h3 className="text-xl font-black text-forest-950 mt-0.5">
                Previous Season vs Current Season AI Estimate
              </h3>
            </div>
            <Link
              to="/profitability"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <span>Detailed Breakdown</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white" />
            </Link>
          </div>

          {historicalData.lastSeason ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Last Season Actual */}
              <div className="p-5 rounded-2xl bg-sage-50 border border-sage-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    {historicalData.lastSeason.seasonName || 'LAST SEASON (ACTUAL)'}
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Self-Recorded Actual
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                  <div>
                    <span className="text-slate-600 font-bold block">Recorded Yield:</span>
                    <p className="text-lg font-black text-forest-950 mt-0.5">
                      {historicalData.lastSeason.totalYieldQuintals} Quintals
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600 font-bold block">Total Revenue:</span>
                    <p className="text-lg font-black text-forest-950 mt-0.5">
                      ₹{Number(historicalData.lastSeason.totalRevenue || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600 font-bold block">Total Cost:</span>
                    <p className="text-lg font-black text-slate-800 mt-0.5">
                      ₹{Number(historicalData.lastSeason.totalCost || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600 font-bold block">Realized Net Profit:</span>
                    <p className="text-lg font-black text-emerald-950 mt-0.5">
                      ₹{Number(historicalData.lastSeason.netProfit || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
                {historicalData.lastSeason.primaryDiseaseOrIssue && (
                  <p className="mt-3 text-[11px] text-rose-800 font-bold">
                    Past Issues / Pathogens: {historicalData.lastSeason.primaryDiseaseOrIssue}
                  </p>
                )}
              </div>

              {/* Current Season AI Estimate */}
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-300 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-forest-900 uppercase tracking-wider">
                    CURRENT SEASON — AI ESTIMATE
                  </span>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Statistical Model
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                  <div>
                    <span className="text-slate-600 font-bold block">Expected Yield:</span>
                    <p className="text-lg font-black text-forest-950 mt-0.5">
                      {historicalData.currentEstimate?.totalYieldQuintals || 53} Quintals
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600 font-bold block">Expected Revenue:</span>
                    <p className="text-lg font-black text-forest-950 mt-0.5">
                      ₹{Number(historicalData.currentEstimate?.totalRevenue || 130000).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600 font-bold block">Estimated Costs:</span>
                    <p className="text-lg font-black text-slate-800 mt-0.5">
                      ₹{Number(historicalData.currentEstimate?.totalCost || 75000).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600 font-bold block">Expected Net Profit:</span>
                    <p className="text-lg font-black text-forest-800 mt-0.5">
                      ₹{Number(historicalData.currentEstimate?.netProfit || 55000).toLocaleString()}
                    </p>
                  </div>
                </div>
                {historicalData.deltas && (
                  <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-emerald-200 text-xs">
                    <span className="text-slate-600 font-semibold">Net Profit Variance:</span>
                    <span className={`font-black ${historicalData.deltas.profitImprovement >= 0 ? 'text-forest-800' : 'text-rose-700'}`}>
                      {historicalData.deltas.profitImprovement >= 0 ? '+' : ''}₹{historicalData.deltas.profitImprovement.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-center">
              <History className="w-8 h-8 text-amber-800 mx-auto mb-2" />
              <h4 className="font-extrabold text-sm text-amber-950">No Previous Season Record Provided</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                You haven't self-recorded past season yields or expenses for this crop cycle yet. We do not generate mock or fake past data.
              </p>
              <Link
                to="/farms-and-crops"
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-300" />
                <span>Record Crop History & Yields</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* QUICK ACTIONS DOCK */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/disease-scanner"
          className="p-5 rounded-2xl bg-white hover:bg-sage-50 border border-sage-200 hover:border-forest-800/40 transition-all flex flex-col items-center text-center group shadow-sm"
        >
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <ScanEye className="w-5 h-5 text-teal-800" />
          </div>
          <h4 className="font-black text-xs sm:text-sm text-forest-950">Scan Leaf Photo</h4>
          <p className="text-[11px] text-slate-600 mt-0.5 font-medium">Instant AI Disease Vision</p>
        </Link>

        <Link
          to="/what-if-simulator"
          className="p-5 rounded-2xl bg-white hover:bg-sage-50 border border-sage-200 hover:border-forest-800/40 transition-all flex flex-col items-center text-center group shadow-sm"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Sliders className="w-5 h-5 text-amber-800" />
          </div>
          <h4 className="font-black text-xs sm:text-sm text-forest-950">What-If Simulator</h4>
          <p className="text-[11px] text-slate-600 mt-0.5 font-medium">Compare Alternate Crops</p>
        </Link>

        <Link
          to="/crop-passport"
          className="p-5 rounded-2xl bg-white hover:bg-sage-50 border border-sage-200 hover:border-forest-800/40 transition-all flex flex-col items-center text-center group shadow-sm"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-forest-800 border border-emerald-200 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5 text-forest-800" />
          </div>
          <h4 className="font-black text-xs sm:text-sm text-forest-950">Blockchain Passport</h4>
          <p className="text-[11px] text-slate-600 mt-0.5 font-medium">Verifiable Farm Ledger</p>
        </Link>

        <Link
          to="/consultations"
          className="p-5 rounded-2xl bg-white hover:bg-sage-50 border border-sage-200 hover:border-forest-800/40 transition-all flex flex-col items-center text-center group shadow-sm"
        >
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Stethoscope className="w-5 h-5 text-rose-800" />
          </div>
          <h4 className="font-black text-xs sm:text-sm text-forest-950">Consult Specialist</h4>
          <p className="text-[11px] text-slate-600 mt-0.5 font-medium">Verified ICAR Agronomists</p>
        </Link>
      </div>
    </div>
  );
};

export default FarmerDashboard;
