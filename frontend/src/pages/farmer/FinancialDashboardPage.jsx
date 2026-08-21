import React, { useState, useEffect } from 'react';
import {
  getCropCyclesApi,
  getFinancialsApi,
  recordFinancialsApi,
  getHistoricalComparisonApi,
} from '../../services/api';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart2,
  Plus,
  ArrowUpRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';

const FinancialDashboardPage = () => {
  const [cropCycles, setCropCycles] = useState([]);
  const [selectedCycleId, setSelectedCycleId] = useState('');
  const [comparison, setComparison] = useState(null);
  const [diagnostics, setDiagnostics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [recordForm, setRecordForm] = useState({
    seasonName: 'Current Season Actual',
    isCurrentEstimate: false,
    areaAcres: 5,
    seedCost: 7500,
    fertilizerCost: 18000,
    pesticideCost: 8500,
    labourCost: 19000,
    irrigationCost: 6500,
    machineryCost: 11000,
    transportationCost: 2500,
    otherExpenses: 0,
    totalYieldQuintals: 52,
    sellingPricePerQuintal: 2450,
  });

  const loadFinancialData = async () => {
    try {
      setLoading(true);
      const cyclesRes = await getCropCyclesApi();
      const cycles = cyclesRes.data.cropCycles || [];
      setCropCycles(cycles);

      const active = cycles[0];
      if (active) {
        setSelectedCycleId(active._id);
        const compRes = await getHistoricalComparisonApi(active._id);
        setComparison(compRes.data.comparison);
        setDiagnostics(compRes.data.diagnostics || []);
      }
    } catch (err) {
      console.error('Error loading financial analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinancialData();
  }, []);

  const handleCycleChange = async (cycleId) => {
    setSelectedCycleId(cycleId);
    try {
      const compRes = await getHistoricalComparisonApi(cycleId);
      setComparison(compRes.data.comparison);
      setDiagnostics(compRes.data.diagnostics || []);
    } catch (err) {
      console.error('Error changing cycle:', err);
    }
  };

  const handleSaveFinancials = async (e) => {
    e.preventDefault();
    try {
      await recordFinancialsApi({
        cropCycleId: selectedCycleId,
        seasonName: recordForm.seasonName,
        isCurrentEstimate: recordForm.isCurrentEstimate,
        areaAcres: Number(recordForm.areaAcres),
        costs: {
          seedCost: Number(recordForm.seedCost),
          fertilizerCost: Number(recordForm.fertilizerCost),
          pesticideCost: Number(recordForm.pesticideCost),
          labourCost: Number(recordForm.labourCost),
          irrigationCost: Number(recordForm.irrigationCost),
          machineryCost: Number(recordForm.machineryCost),
          transportationCost: Number(recordForm.transportationCost),
          otherExpenses: Number(recordForm.otherExpenses),
        },
        totalYieldQuintals: Number(recordForm.totalYieldQuintals),
        sellingPricePerQuintal: Number(recordForm.sellingPricePerQuintal),
      });

      setShowModal(false);
      alert('Financial record successfully recorded!');
      handleCycleChange(selectedCycleId);
    } catch (err) {
      alert(err.response?.data?.message || 'Error recording financial data');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const lastSeason = comparison?.lastSeason || {
    totalYieldQuintals: 48,
    totalRevenue: 112000,
    totalCost: 72000,
    netProfit: 40000,
    profitPerAcre: 8000,
    costPerQuintal: 1500,
    primaryDiseaseOrIssue: 'Fungal Yellow Rust (12% yield loss)',
  };

  const currentEst = comparison?.currentEstimate || {
    totalYieldQuintals: 53,
    totalRevenue: 130000,
    totalCost: 75000,
    netProfit: 55000,
    profitPerAcre: 11000,
    costPerQuintal: 1415,
  };

  const chartData = [
    {
      metric: 'Yield (Quintals)',
      'Last Season (Actual)': lastSeason.totalYieldQuintals,
      'Current Season (AI Estimate)': currentEst.totalYieldQuintals,
    },
    {
      metric: 'Revenue (₹ in K)',
      'Last Season (Actual)': Math.round(lastSeason.totalRevenue / 1000),
      'Current Season (AI Estimate)': Math.round(currentEst.totalRevenue / 1000),
    },
    {
      metric: 'Total Cost (₹ in K)',
      'Last Season (Actual)': Math.round(lastSeason.totalCost / 1000),
      'Current Season (AI Estimate)': Math.round(currentEst.totalCost / 1000),
    },
    {
      metric: 'Net Profit (₹ in K)',
      'Last Season (Actual)': Math.round(lastSeason.netProfit / 1000),
      'Current Season (AI Estimate)': Math.round(currentEst.netProfit / 1000),
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Title Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
              Agronomic Economics & Margin Optimization
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Farm Profitability Tracker</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track itemized input expenditures, calculate cost/quintal, and project harvest margins
          </p>
        </div>

        <div className="flex items-center gap-3">
          {cropCycles.length > 0 && (
            <select
              value={selectedCycleId}
              onChange={(e) => handleCycleChange(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:border-emerald-500"
            >
              {cropCycles.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.cropName} ({c.season})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Record Expenses</span>
          </button>
        </div>
      </div>

      {/* CORE KPI CARDS (PROFIT FORMULAS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Estimated Revenue</span>
          <p className="text-2xl font-black text-white mt-1">₹{currentEst.totalRevenue?.toLocaleString()}</p>
          <p className="text-[10px] text-slate-500 mt-1">Total Yield × Selling Price</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Input Cost</span>
          <p className="text-2xl font-black text-slate-300 mt-1">₹{currentEst.totalCost?.toLocaleString()}</p>
          <p className="text-[10px] text-slate-500 mt-1">Seeds + NPK + Labour + Misc</p>
        </div>

        <div className="glass-panel-glow p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-emerald-400 uppercase">Expected Net Profit</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">₹{currentEst.netProfit?.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-400/80 font-semibold mt-1">Revenue - Total Cost</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-cyan-400 uppercase">Profit Per Acre</span>
          <p className="text-2xl font-black text-cyan-400 mt-1">₹{currentEst.profitPerAcre?.toLocaleString()}</p>
          <p className="text-[10px] text-slate-500 mt-1">Cost/Q: ₹{currentEst.costPerQuintal || 1415}</p>
        </div>
      </div>

      {/* COMPARATIVE VISUAL CHART & TABLE */}
      <div className="glass-panel p-6 rounded-3xl">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-extrabold text-base text-white">Season-on-Season Margin Comparison</h3>
            <p className="text-xs text-slate-400">Comparing realized historical figures with AI projections</p>
          </div>
          <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            +₹{(comparison?.deltas?.profitImprovement || 15000).toLocaleString()} Advantage
          </span>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="metric" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Last Season (Actual)" fill="#64748b" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Current Season (AI Estimate)" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI PROFIT OPTIMIZATION DIAGNOSTICS */}
      <div className="glass-panel p-6 rounded-3xl">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="font-extrabold text-base text-white">AI Profit Optimization Diagnostic Engine</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {diagnostics.map((diag, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-300 mb-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{diag.title}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{diag.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: RECORD EXPENSES */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-extrabold text-base text-white">Record Farm Expenses & Yield</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFinancials} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold">Season Label</label>
                  <input
                    type="text"
                    value={recordForm.seasonName}
                    onChange={(e) => setRecordForm({ ...recordForm, seasonName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold">Field Area (Acres)</label>
                  <input
                    type="number"
                    value={recordForm.areaAcres}
                    onChange={(e) => setRecordForm({ ...recordForm, areaAcres: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white mt-1"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-2">Itemized Input Costs (₹):</span>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-slate-400">Seed Cost</label>
                    <input
                      type="number"
                      value={recordForm.seedCost}
                      onChange={(e) => setRecordForm({ ...recordForm, seedCost: e.target.value })}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Fertilizer Cost</label>
                    <input
                      type="number"
                      value={recordForm.fertilizerCost}
                      onChange={(e) => setRecordForm({ ...recordForm, fertilizerCost: e.target.value })}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Pesticide / Bio Cost</label>
                    <input
                      type="number"
                      value={recordForm.pesticideCost}
                      onChange={(e) => setRecordForm({ ...recordForm, pesticideCost: e.target.value })}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Labour Cost</label>
                    <input
                      type="number"
                      value={recordForm.labourCost}
                      onChange={(e) => setRecordForm({ ...recordForm, labourCost: e.target.value })}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Machinery & Diesel</label>
                    <input
                      type="number"
                      value={recordForm.machineryCost}
                      onChange={(e) => setRecordForm({ ...recordForm, machineryCost: e.target.value })}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Irrigation Electricity</label>
                    <input
                      type="number"
                      value={recordForm.irrigationCost}
                      onChange={(e) => setRecordForm({ ...recordForm, irrigationCost: e.target.value })}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold">Total Harvest Yield (Quintals)</label>
                  <input
                    type="number"
                    value={recordForm.totalYieldQuintals}
                    onChange={(e) => setRecordForm({ ...recordForm, totalYieldQuintals: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold">Selling Price (₹ per Quintal)</label>
                  <input
                    type="number"
                    value={recordForm.sellingPricePerQuintal}
                    onChange={(e) => setRecordForm({ ...recordForm, sellingPricePerQuintal: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white mt-1"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-600/20"
              >
                Calculate Margins & Save Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialDashboardPage;
