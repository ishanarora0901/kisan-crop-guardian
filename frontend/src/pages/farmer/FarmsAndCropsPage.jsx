import React, { useState, useEffect } from 'react';
import {
  getFarmsApi,
  createFarmApi,
  getCropCyclesApi,
  createCropCycleApi,
  logSoilRecordApi,
} from '../../services/api';
import {
  Tractor,
  Sprout,
  Plus,
  MapPin,
  Calendar,
  Layers,
  Droplets,
  FlaskConical,
  ShieldCheck,
  CheckCircle2,
  X,
} from 'lucide-react';

const FarmsAndCropsPage = () => {
  const [farms, setFarms] = useState([]);
  const [cropCycles, setCropCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [showAddCycleModal, setShowAddCycleModal] = useState(false);
  const [showSoilModal, setShowSoilModal] = useState(false);
  const [selectedCycleId, setSelectedCycleId] = useState(null);

  // Form states
  const [farmForm, setFarmForm] = useState({
    name: '',
    locationName: 'Ludhiana, Punjab',
    totalAreaAcres: 10,
    soilType: 'Alluvial Soil',
    irrigationSource: 'Tube-well / Borewell',
  });

  const [cycleForm, setCycleForm] = useState({
    farmId: '',
    cropName: 'Wheat',
    cropVariety: 'HD-2967 High Yield',
    season: 'Rabi',
    fieldAreaAcres: 5,
    sowingDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: new Date(Date.now() + 120 * 86400000).toISOString().split('T')[0],
    nitrogenKgPerHa: 240,
    phosphorusKgPerHa: 55,
    potassiumKgPerHa: 210,
    soilPh: 6.8,
    soilMoisturePercentage: 62,
  });

  const [soilForm, setSoilForm] = useState({
    nitrogenKgPerHa: 240,
    phosphorusKgPerHa: 55,
    potassiumKgPerHa: 210,
    ph: 6.8,
    soilMoisturePercentage: 62,
    organicCarbonPercentage: 0.65,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [farmsRes, cyclesRes] = await Promise.all([getFarmsApi(), getCropCyclesApi()]);
      setFarms(farmsRes.data.farms || []);
      setCropCycles(cyclesRes.data.cropCycles || []);
      if (farmsRes.data.farms?.length > 0) {
        setCycleForm((prev) => ({ ...prev, farmId: farmsRes.data.farms[0]._id }));
      }
    } catch (err) {
      console.error('Error loading farms/crops:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateFarm = async (e) => {
    e.preventDefault();
    try {
      await createFarmApi(farmForm);
      setShowAddFarmModal(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating farm');
    }
  };

  const handleCreateCycle = async (e) => {
    e.preventDefault();
    try {
      await createCropCycleApi(cycleForm);
      setShowAddCycleModal(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating crop cycle');
    }
  };

  const handleLogSoil = async (e) => {
    e.preventDefault();
    try {
      await logSoilRecordApi(selectedCycleId, soilForm);
      setShowSoilModal(false);
      alert('Soil nutrients & moisture profile logged to Blockchain Passport!');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error logging soil record');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Farms & Crop Cycles</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage multi-farm locations, planting records, and baseline soil profiles
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setShowAddFarmModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add New Farm</span>
          </button>
          <button
            onClick={() => setShowAddCycleModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <Sprout className="w-4 h-4" />
            <span>Register Crop Cycle</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: REGISTERED FARMS */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3.5 flex items-center gap-2">
          <Tractor className="w-5 h-5 text-emerald-400" />
          <span>Active Farm Locations ({farms.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {farms.map((farm) => (
            <div key={farm._id} className="glass-panel p-5 rounded-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-extrabold text-base text-white">{farm.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {farm.totalAreaAcres} Acres
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{farm.locationName}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  <span>Soil Type: <strong className="text-slate-200">{farm.soilType}</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <Droplets className="w-3.5 h-3.5 text-slate-500" />
                  <span>Irrigation: <strong className="text-slate-200">{farm.irrigationSource}</strong></span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: ACTIVE CROP CYCLES & SOIL PROFILES */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3.5 flex items-center gap-2">
          <Sprout className="w-5 h-5 text-emerald-400" />
          <span>Active Crop Cycles & Soil Profiles ({cropCycles.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cropCycles.map((cycle) => (
            <div key={cycle._id} className="glass-panel p-6 rounded-2xl relative">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-black text-lg text-white">
                    {cycle.cropName} <span className="text-xs font-normal text-slate-400">({cycle.cropVariety})</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Farm: <span className="text-emerald-400 font-semibold">{cycle.farm?.name}</span> · Season: {cycle.season}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase border border-emerald-500/20">
                  {cycle.status}
                </span>
              </div>

              {/* Progress and Age */}
              <div className="grid grid-cols-3 gap-2.5 my-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Crop Age</span>
                  <p className="font-extrabold text-white mt-0.5">{cycle.cropAgeDays || 82} Days</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Field Area</span>
                  <p className="font-extrabold text-white mt-0.5">{cycle.fieldAreaAcres} Acres</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Growth Stage</span>
                  <p className="font-extrabold text-emerald-400 mt-0.5 truncate">{cycle.currentGrowthStage || 'Tillering'}</p>
                </div>
              </div>

              {/* Blockchain Tag & Soil Button */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="truncate max-w-[150px]">{cycle.blockchainPassportId || 'Verified Passport'}</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedCycleId(cycle._id);
                    setShowSoilModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Log Soil Test</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: ADD NEW FARM */}
      {showAddFarmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-extrabold text-base text-white">Add New Farm Location</h3>
              <button onClick={() => setShowAddFarmModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFarm} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Farm Name</label>
                <input
                  type="text"
                  required
                  value={farmForm.name}
                  onChange={(e) => setFarmForm({ ...farmForm, name: e.target.value })}
                  placeholder="e.g. Malwa Sun Valley Farm"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Location & District</label>
                <input
                  type="text"
                  required
                  value={farmForm.locationName}
                  onChange={(e) => setFarmForm({ ...farmForm, locationName: e.target.value })}
                  placeholder="e.g. Ludhiana, Punjab"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Total Acres</label>
                  <input
                    type="number"
                    required
                    value={farmForm.totalAreaAcres}
                    onChange={(e) => setFarmForm({ ...farmForm, totalAreaAcres: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Soil Type</label>
                  <select
                    value={farmForm.soilType}
                    onChange={(e) => setFarmForm({ ...farmForm, soilType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Alluvial Soil">Alluvial Soil</option>
                    <option value="Black (Regur) Soil">Black Soil</option>
                    <option value="Red & Yellow Soil">Red & Yellow Soil</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Clay Loam">Clay Loam</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-600/20"
              >
                Save Farm
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTER CROP CYCLE */}
      {showAddCycleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-extrabold text-base text-white">Register New Crop Cycle</h3>
              <button onClick={() => setShowAddCycleModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCycle} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Select Farm</label>
                  <select
                    value={cycleForm.farmId}
                    onChange={(e) => setCycleForm({ ...cycleForm, farmId: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    {farms.map((f) => (
                      <option key={f._id} value={f._id}>
                        {f.name} ({f.totalAreaAcres} ac)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Crop Type</label>
                  <select
                    value={cycleForm.cropName}
                    onChange={(e) => setCycleForm({ ...cycleForm, cropName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Wheat">Wheat</option>
                    <option value="Mustard">Mustard</option>
                    <option value="Rice">Rice (Paddy)</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Maize">Maize</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Potato">Potato</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Crop Variety</label>
                  <input
                    type="text"
                    value={cycleForm.cropVariety}
                    onChange={(e) => setCycleForm({ ...cycleForm, cropVariety: e.target.value })}
                    placeholder="e.g. HD-2967 / PBW-550"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Field Area (Acres)</label>
                  <input
                    type="number"
                    value={cycleForm.fieldAreaAcres}
                    onChange={(e) => setCycleForm({ ...cycleForm, fieldAreaAcres: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              {/* Baseline Soil Nutrients */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 mt-2">
                <span className="font-bold text-emerald-400 block mb-2">Baseline Soil & NPK Parameters:</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400">Nitrogen (N kg/ha)</label>
                    <input
                      type="number"
                      value={cycleForm.nitrogenKgPerHa}
                      onChange={(e) => setCycleForm({ ...cycleForm, nitrogenKgPerHa: e.target.value })}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Phosphorus (P kg/ha)</label>
                    <input
                      type="number"
                      value={cycleForm.phosphorusKgPerHa}
                      onChange={(e) => setCycleForm({ ...cycleForm, phosphorusKgPerHa: e.target.value })}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Potassium (K kg/ha)</label>
                    <input
                      type="number"
                      value={cycleForm.potassiumKgPerHa}
                      onChange={(e) => setCycleForm({ ...cycleForm, potassiumKgPerHa: e.target.value })}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <label className="text-[10px] text-slate-400">Soil pH</label>
                    <input
                      type="number"
                      step="0.1"
                      value={cycleForm.soilPh}
                      onChange={(e) => setCycleForm({ ...cycleForm, soilPh: e.target.value })}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Moisture %</label>
                    <input
                      type="number"
                      value={cycleForm.soilMoisturePercentage}
                      onChange={(e) => setCycleForm({ ...cycleForm, soilMoisturePercentage: e.target.value })}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white mt-1"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-600/20"
              >
                Register & Mine Genesis Blockchain Block
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: LOG SOIL RECORD */}
      {showSoilModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-extrabold text-base text-white">Log Periodic Soil Test</h3>
              <button onClick={() => setShowSoilModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogSoil} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400">N (kg/ha)</label>
                  <input
                    type="number"
                    value={soilForm.nitrogenKgPerHa}
                    onChange={(e) => setSoilForm({ ...soilForm, nitrogenKgPerHa: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400">P (kg/ha)</label>
                  <input
                    type="number"
                    value={soilForm.phosphorusKgPerHa}
                    onChange={(e) => setSoilForm({ ...soilForm, phosphorusKgPerHa: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400">K (kg/ha)</label>
                  <input
                    type="number"
                    value={soilForm.potassiumKgPerHa}
                    onChange={(e) => setSoilForm({ ...soilForm, potassiumKgPerHa: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="text-slate-400">pH Level</label>
                  <input
                    type="number"
                    step="0.1"
                    value={soilForm.ph}
                    onChange={(e) => setSoilForm({ ...soilForm, ph: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Soil Moisture %</label>
                  <input
                    type="number"
                    value={soilForm.soilMoisturePercentage}
                    onChange={(e) => setSoilForm({ ...soilForm, soilMoisturePercentage: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white mt-1"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-lg shadow-cyan-600/20"
              >
                Stamp Soil Record on Passport
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmsAndCropsPage;
