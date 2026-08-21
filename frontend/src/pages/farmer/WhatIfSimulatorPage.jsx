import React, { useState, useEffect } from 'react';
import { runSimulationApi } from '../../services/api';
import VoiceSpeaker from '../../components/common/VoiceSpeaker';
import {
  Sliders,
  Sparkles,
  Droplets,
  TrendingUp,
  Skull,
  CloudRain,
  Calendar,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

const WhatIfSimulatorPage = () => {
  const [cropA, setCropA] = useState('Wheat');
  const [cropB, setCropB] = useState('Mustard');
  const [farmAreaAcres, setFarmAreaAcres] = useState(5);
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async (cA = cropA, cB = cropB, acres = farmAreaAcres) => {
    setLoading(true);
    try {
      const res = await runSimulationApi({
        cropA: cA,
        cropB: cB,
        farmAreaAcres: Number(acres),
      });
      setSimulation(res.data.simulation);
    } catch (err) {
      console.error('Error running simulation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, []);

  const handleSimulateSubmit = (e) => {
    e.preventDefault();
    runSimulation(cropA, cropB, farmAreaAcres);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
            Pre-Cultivation Decision Support
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
            Sensitivity Engine
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">What-If Crop Decision Simulator</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Simulate input costs, expected yield, disease vulnerability, and projected profitability before planting.
          Compare Crop A vs Crop B under current soil and seasonal conditions.
        </p>
      </div>

      {/* PARAMETER CONFIGURATION CARD */}
      <div className="glass-panel p-6 rounded-3xl">
        <form onSubmit={handleSimulateSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Crop Option A (Current Plan)</label>
            <select
              value={cropA}
              onChange={(e) => setCropA(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-500 font-bold"
            >
              <option value="Wheat">Wheat</option>
              <option value="Rice">Rice (Paddy)</option>
              <option value="Cotton">Cotton</option>
              <option value="Maize">Maize</option>
              <option value="Mustard">Mustard</option>
              <option value="Tomato">Tomato</option>
              <option value="Potato">Potato</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Crop Option B (Alternative)</label>
            <select
              value={cropB}
              onChange={(e) => setCropB(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-500 font-bold"
            >
              <option value="Mustard">Mustard (Recommended)</option>
              <option value="Wheat">Wheat</option>
              <option value="Rice">Rice (Paddy)</option>
              <option value="Cotton">Cotton</option>
              <option value="Maize">Maize</option>
              <option value="Tomato">Tomato</option>
              <option value="Potato">Potato</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Allocated Field Area (Acres): {farmAreaAcres}</label>
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={farmAreaAcres}
              onChange={(e) => setFarmAreaAcres(e.target.value)}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-all hover:scale-105"
          >
            <Sliders className="w-4 h-4" />
            <span>{loading ? 'Simulating...' : 'Run Simulation'}</span>
          </button>
        </form>
      </div>

      {/* COMPARISON RESULTS */}
      {simulation && (
        <div className="space-y-6">
          {/* AI Comparative Recommendation Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5 text-amber-400 font-black text-sm sm:text-base">
                <Sparkles className="w-5 h-5" />
                <span>AI Recommendation & Decision Guidance</span>
              </div>
              <VoiceSpeaker text={simulation.comparison.aiRecommendationSummary} />
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {simulation.comparison.aiRecommendationSummary}
            </p>
          </div>

          {/* SIDE-BY-SIDE CROP CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CROP A */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Option A</span>
                  <h3 className="text-xl font-black text-white">{simulation.cropA.name}</h3>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold">
                  {farmAreaAcres} Acres
                </span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60">
                  <span className="text-slate-400">Expected Yield:</span>
                  <span className="font-bold text-white text-sm">{simulation.cropA.expectedYield}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60">
                  <span className="text-slate-400">Estimated Cost:</span>
                  <span className="font-bold text-slate-300">₹{simulation.cropA.estimatedCost.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60">
                  <span className="text-slate-400">Expected Revenue:</span>
                  <span className="font-bold text-white">₹{simulation.cropA.expectedRevenue.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-950/30 border border-amber-500/30">
                  <span className="text-amber-400 font-bold">Expected Net Profit:</span>
                  <span className="font-black text-amber-400 text-base">
                    ₹{simulation.cropA.expectedProfit.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold block">Disease Risk</span>
                    <span className="text-sm font-black text-orange-400">{simulation.cropA.diseaseRisk}%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold block">Weather Risk</span>
                    <span className="text-sm font-black text-blue-400">{simulation.cropA.weatherRisk}%</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Water Requirement: {simulation.cropA.waterRequirement}</span>
                </p>
              </div>
            </div>

            {/* CROP B */}
            <div className="glass-panel-glow p-6 rounded-3xl border border-emerald-500/40">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400">Option B (Alternative)</span>
                  <h3 className="text-xl font-black text-white">{simulation.cropB.name}</h3>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  Higher Projected Margin
                </span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60">
                  <span className="text-slate-400">Expected Yield:</span>
                  <span className="font-bold text-white text-sm">{simulation.cropB.expectedYield}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60">
                  <span className="text-slate-400">Estimated Cost:</span>
                  <span className="font-bold text-slate-300">₹{simulation.cropB.estimatedCost.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60">
                  <span className="text-slate-400">Expected Revenue:</span>
                  <span className="font-bold text-white">₹{simulation.cropB.expectedRevenue.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
                  <span className="text-emerald-400 font-bold">Expected Net Profit:</span>
                  <span className="font-black text-emerald-400 text-base">
                    ₹{simulation.cropB.expectedProfit.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold block">Disease Risk</span>
                    <span className="text-sm font-black text-emerald-400">{simulation.cropB.diseaseRisk}%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold block">Weather Risk</span>
                    <span className="text-sm font-black text-emerald-400">{simulation.cropB.weatherRisk}%</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Water Requirement: {simulation.cropB.waterRequirement}</span>
                </p>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 italic text-center">
            {simulation.comparison.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
};

export default WhatIfSimulatorPage;
