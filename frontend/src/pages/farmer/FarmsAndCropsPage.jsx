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
  History,
  AlertTriangle,
  HelpCircle,
  Sparkles,
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

    // Current practices & questions
    seedSource: 'Certified Govt Seeds',
    seedCompany: 'National Seeds Corporation',
    seedTreatment: 'Carbendazim 2g/kg',
    irrigationMethod: 'Tube-well with Drip / Sprinkler',
    currentConcerns: '',

    // Farmer-typed past season details (REAL history)
    previousCrop: 'Rice (Basmati)',
    previousCropVariety: 'Pusa 1121',
    previousYieldQuintals: 48,
    previousRevenue: 120000,
    previousCost: 68000,
    previousProfit: 52000,
    previousDiseases: 'Fungal Leaf Rust',
    previousProblems: 'Water logging and late humidity spike',

    // Soil parameters
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
        <div className="w-10 h-10 border-4 border-forest-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-forest-950 tracking-tight">Farms & Crop Cycles</h1>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Manage multi-farm locations, planting records, and baseline soil profiles
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setShowAddFarmModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-sage-50 text-forest-900 text-xs font-bold border border-sage-300 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 text-forest-800" />
            <span>Add New Farm</span>
          </button>
          <button
            onClick={() => setShowAddCycleModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-extrabold shadow-md shadow-forest-800/20 transition-all hover:scale-105"
          >
            <Sprout className="w-4 h-4 text-emerald-300" />
            <span>Register Crop Cycle</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: REGISTERED FARMS */}
      <div>
        <h2 className="text-lg font-extrabold text-forest-950 mb-3.5 flex items-center gap-2">
          <Tractor className="w-5 h-5 text-forest-800" />
          <span>Active Farm Locations ({farms.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {farms.map((farm) => (
            <div key={farm._id} className="glass-panel p-5 rounded-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-extrabold text-base text-forest-950">{farm.name}</h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sage-100 text-forest-800 border border-sage-200">
                  {farm.totalAreaAcres} Acres
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                  <span>{farm.locationName}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                  <span>Soil Type: <strong className="text-forest-950 font-bold">{farm.soilType}</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <Droplets className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                  <span>Irrigation: <strong className="text-forest-950 font-bold">{farm.irrigationSource}</strong></span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: ACTIVE CROP CYCLES & SOIL PROFILES */}
      <div>
        <h2 className="text-lg font-extrabold text-forest-950 mb-3.5 flex items-center gap-2">
          <Sprout className="w-5 h-5 text-forest-800" />
          <span>Active Crop Cycles & Soil Profiles ({cropCycles.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cropCycles.map((cycle) => (
            <div key={cycle._id} className="glass-panel p-6 rounded-2xl relative">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-black text-lg text-forest-950">
                    {cycle.cropName} <span className="text-xs font-semibold text-slate-500">({cycle.cropVariety})</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Farm: <span className="text-forest-800 font-bold">{cycle.farm?.name}</span> · Season: {cycle.season}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase border border-emerald-300">
                  {cycle.status}
                </span>
              </div>

              {/* Progress and Age */}
              <div className="grid grid-cols-3 gap-2.5 my-4 p-3 rounded-xl bg-sage-50 border border-sage-200 text-xs text-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Crop Age</span>
                  <p className="font-extrabold text-forest-950 mt-0.5">{cycle.cropAgeDays || 82} Days</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Field Area</span>
                  <p className="font-extrabold text-forest-950 mt-0.5">{cycle.fieldAreaAcres} Acres</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Growth Stage</span>
                  <p className="font-extrabold text-forest-800 mt-0.5 truncate">{cycle.currentGrowthStage || 'Tillering'}</p>
                </div>
              </div>

              {/* Blockchain Tag & Soil Button */}
              <div className="flex items-center justify-between pt-3 border-t border-sage-200 text-xs">
                <div className="flex items-center gap-1.5 text-forest-800 font-mono text-[11px] font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="truncate max-w-[150px]">{cycle.blockchainPassportId || 'Verified Passport'}</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedCycleId(cycle._id);
                    setShowSoilModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Log Soil Test</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: ADD NEW FARM */}
      {showAddFarmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-sage-300 rounded-3xl p-6 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-sage-200 mb-4">
              <h3 className="font-extrabold text-base text-forest-950">Add New Farm Location</h3>
              <button onClick={() => setShowAddFarmModal(false)} className="text-slate-400 hover:text-forest-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFarm} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Farm Name</label>
                <input
                  type="text"
                  required
                  value={farmForm.name}
                  onChange={(e) => setFarmForm({ ...farmForm, name: e.target.value })}
                  placeholder="e.g. Malwa Sun Valley Farm"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-forest-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Location & District</label>
                <input
                  type="text"
                  required
                  value={farmForm.locationName}
                  onChange={(e) => setFarmForm({ ...farmForm, locationName: e.target.value })}
                  placeholder="e.g. Ludhiana, Punjab"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-forest-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Acres</label>
                  <input
                    type="number"
                    required
                    value={farmForm.totalAreaAcres}
                    onChange={(e) => setFarmForm({ ...farmForm, totalAreaAcres: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-forest-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Soil Type</label>
                  <select
                    value={farmForm.soilType}
                    onChange={(e) => setFarmForm({ ...farmForm, soilType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-forest-800 focus:outline-none"
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
                className="w-full mt-4 py-3 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-bold transition-all shadow-md shadow-forest-800/20"
              >
                Save Farm
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTER CROP CYCLE */}
      {showAddCycleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white border border-sage-300 rounded-3xl p-6 shadow-2xl max-h-[92vh] overflow-y-auto text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-sage-200 mb-4">
              <div>
                <h3 className="font-extrabold text-base text-forest-950">Register New Crop Cycle & Farm History</h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Enter your current crop plan and type your own past season yields, profit & disease history.
                </p>
              </div>
              <button onClick={() => setShowAddCycleModal(false)} className="text-slate-400 hover:text-forest-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCycle} className="space-y-4 text-xs">
              {/* SECTION 1: CURRENT CROP PLAN */}
              <div className="p-4 rounded-2xl bg-sage-50/70 border border-sage-200 space-y-3">
                <span className="font-extrabold text-xs text-forest-950 flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-forest-800" />
                  <span>1. Current Crop Plan</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Select Farm Location</label>
                    <select
                      value={cycleForm.farmId}
                      onChange={(e) => setCycleForm({ ...cycleForm, farmId: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-forest-800 focus:outline-none font-bold"
                    >
                      {farms.map((f) => (
                        <option key={f._id} value={f._id}>
                          {f.name} ({f.totalAreaAcres} Acres)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Crop Type</label>
                    <select
                      value={cycleForm.cropName}
                      onChange={(e) => setCycleForm({ ...cycleForm, cropName: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-forest-800 focus:outline-none font-bold"
                    >
                      <option value="Wheat">Wheat (ਕਣਕ / गेहूं)</option>
                      <option value="Mustard">Mustard (ਸਰ੍ਹੋਂ / सरसों)</option>
                      <option value="Rice">Rice (ਝੋਨਾ / धान)</option>
                      <option value="Cotton">Cotton (ਨਰਮਾ / कपास)</option>
                      <option value="Maize">Maize (ਮੱਕੀ / मक्का)</option>
                      <option value="Tomato">Tomato (ਟਮਾਟਰ / टमाटर)</option>
                      <option value="Potato">Potato (ਆਲੂ / आलू)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Crop Variety</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. HD-2967 High Yield"
                      value={cycleForm.cropVariety}
                      onChange={(e) => setCycleForm({ ...cycleForm, cropVariety: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-forest-800 focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Season</label>
                    <select
                      value={cycleForm.season}
                      onChange={(e) => setCycleForm({ ...cycleForm, season: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-forest-800 focus:outline-none font-bold"
                    >
                      <option value="Rabi">Rabi (ਹਾੜ੍ਹੀ / रबी)</option>
                      <option value="Kharif">Kharif (ਸਾਉਣੀ / खरीफ)</option>
                      <option value="Zaid">Zaid (ਜਾਇਦ / जायद)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Allocated Area (Acres)</label>
                    <input
                      type="number"
                      required
                      min="0.5"
                      step="0.5"
                      value={cycleForm.fieldAreaAcres}
                      onChange={(e) => setCycleForm({ ...cycleForm, fieldAreaAcres: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-forest-800 focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Sowing Date</label>
                    <input
                      type="date"
                      required
                      value={cycleForm.sowingDate}
                      onChange={(e) => setCycleForm({ ...cycleForm, sowingDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Expected Harvest Date</label>
                    <input
                      type="date"
                      required
                      value={cycleForm.expectedHarvestDate}
                      onChange={(e) => setCycleForm({ ...cycleForm, expectedHarvestDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: CURRENT PRACTICES & QUESTIONS */}
              <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200 space-y-3">
                <span className="font-extrabold text-xs text-teal-950 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-teal-800" />
                  <span>2. Current Field Practices & Input Details</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Seed Procurement Source</label>
                    <select
                      value={cycleForm.seedSource}
                      onChange={(e) => setCycleForm({ ...cycleForm, seedSource: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium"
                    >
                      <option value="Certified Govt Seeds">Certified Govt Seeds (PAU / NSC / ICAR)</option>
                      <option value="Private Dealer / Company">Private Authorized Dealer</option>
                      <option value="Farm-Saved Seeds">Farm-Saved Seeds (Own previous harvest)</option>
                      <option value="Local Cooperative Society">Local Cooperative Society (PACS)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Seed Brand / Company Name</label>
                    <input
                      type="text"
                      placeholder="e.g. National Seeds Corp, Bayer, Pioneer, Mahyco"
                      value={cycleForm.seedCompany}
                      onChange={(e) => setCycleForm({ ...cycleForm, seedCompany: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Seed Treatment Practice</label>
                    <select
                      value={cycleForm.seedTreatment}
                      onChange={(e) => setCycleForm({ ...cycleForm, seedTreatment: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium"
                    >
                      <option value="Carbendazim 2g/kg">Chemical Fungicide (Carbendazim / Thiram)</option>
                      <option value="Trichoderma viride 5g/kg">Biological Treatment (Trichoderma viride)</option>
                      <option value="Untreated">Untreated / Direct Sowing</option>
                      <option value="Hot Water / Solar Treatment">Traditional / Hot Water Treatment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Primary Irrigation System</label>
                    <select
                      value={cycleForm.irrigationMethod}
                      onChange={(e) => setCycleForm({ ...cycleForm, irrigationMethod: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium"
                    >
                      <option value="Tube-well with Drip / Sprinkler">Tube-well with Micro-Drip / Sprinkler</option>
                      <option value="Canal / Flood Irrigation">Canal / Surface Flood Irrigation</option>
                      <option value="Tube-well Flood Basin">Tube-well Flood Basin</option>
                      <option value="Rainfed (Barani)">Rainfed (Barani / No Borewell)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Current Field Questions / Pre-Sowing Observations (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Excessive weeds observed, soil dry due to delayed pre-watering, pest sightings nearby"
                    value={cycleForm.currentConcerns}
                    onChange={(e) => setCycleForm({ ...cycleForm, currentConcerns: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* SECTION 3: PAST SEASON EXPERIENCE (TYPED BY FARMER - NOT AUTO-GENERATED) */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-300 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-amber-950 flex items-center gap-2">
                    <History className="w-4 h-4 text-amber-800" />
                    <span>3. Past Season Experience & History (Self-Recorded by You)</span>
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-950 border border-amber-300">
                    No Mock Data
                  </span>
                </div>

                <p className="text-[11px] text-amber-950 font-medium leading-relaxed">
                  Type your actual previous crop numbers and diseases. This self-recorded baseline will be stamped on your
                  blockchain passport and used for genuine AI historical pattern matching.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Previous Crop Grown in Field</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rice (Basmati), Cotton, Maize, Fallow"
                      value={cycleForm.previousCrop}
                      onChange={(e) => setCycleForm({ ...cycleForm, previousCrop: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Previous Crop Variety</label>
                    <input
                      type="text"
                      placeholder="e.g. Pusa 1121, Bt-2, Pioneer 3396"
                      value={cycleForm.previousCropVariety}
                      onChange={(e) => setCycleForm({ ...cycleForm, previousCropVariety: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Past Season Harvest Yield (Quintals)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="e.g. 48"
                      value={cycleForm.previousYieldQuintals}
                      onChange={(e) => setCycleForm({ ...cycleForm, previousYieldQuintals: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Past Season Total Revenue / Income (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="e.g. 120000"
                      value={cycleForm.previousRevenue}
                      onChange={(e) => {
                        const rev = Number(e.target.value) || 0;
                        const cost = Number(cycleForm.previousCost) || 0;
                        setCycleForm({ ...cycleForm, previousRevenue: e.target.value, previousProfit: rev - cost });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Past Season Total Costs / Expense (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="e.g. 68000"
                      value={cycleForm.previousCost}
                      onChange={(e) => {
                        const cost = Number(e.target.value) || 0;
                        const rev = Number(cycleForm.previousRevenue) || 0;
                        setCycleForm({ ...cycleForm, previousCost: e.target.value, previousProfit: rev - cost });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between">
                  <span className="font-extrabold text-emerald-900">Calculated Past Net Profit:</span>
                  <span className="font-black text-emerald-950 text-sm">₹{Number(cycleForm.previousProfit || 0).toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Past Diseases & Pests Encountered (Type here)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Fungal Leaf Rust, Karnal Bunt, Stem Borer, None"
                      value={cycleForm.previousDiseases}
                      onChange={(e) => setCycleForm({ ...cycleForm, previousDiseases: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Past Weather / Soil Problems Encountered (Type here)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Water logging in late stage, unseasonal hail, heat stress, none"
                      value={cycleForm.previousProblems}
                      onChange={(e) => setCycleForm({ ...cycleForm, previousProblems: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: BASELINE SOIL NUTRIENTS */}
              <div className="p-3.5 rounded-2xl bg-sage-50 border border-sage-200">
                <span className="font-extrabold text-xs text-forest-800 block mb-2">4. Baseline Soil Parameters (Optional / Test Values):</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600">Nitrogen (N kg/ha)</label>
                    <input
                      type="number"
                      value={cycleForm.nitrogenKgPerHa}
                      onChange={(e) => setCycleForm({ ...cycleForm, nitrogenKgPerHa: e.target.value })}
                      className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-900 mt-1 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600">Phosphorus (P kg/ha)</label>
                    <input
                      type="number"
                      value={cycleForm.phosphorusKgPerHa}
                      onChange={(e) => setCycleForm({ ...cycleForm, phosphorusKgPerHa: e.target.value })}
                      className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-900 mt-1 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600">Potassium (K kg/ha)</label>
                    <input
                      type="number"
                      value={cycleForm.potassiumKgPerHa}
                      onChange={(e) => setCycleForm({ ...cycleForm, potassiumKgPerHa: e.target.value })}
                      className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-900 mt-1 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600">Soil pH</label>
                    <input
                      type="number"
                      step="0.1"
                      value={cycleForm.soilPh}
                      onChange={(e) => setCycleForm({ ...cycleForm, soilPh: e.target.value })}
                      className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-900 mt-1 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600">Moisture %</label>
                    <input
                      type="number"
                      value={cycleForm.soilMoisturePercentage}
                      onChange={(e) => setCycleForm({ ...cycleForm, soilMoisturePercentage: e.target.value })}
                      className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-900 mt-1 font-bold"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-black text-sm transition-all shadow-md shadow-forest-800/20 hover:scale-[1.01]"
              >
                Register Crop Cycle & Save Historical Baseline
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: LOG SOIL RECORD */}
      {showSoilModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-sage-300 rounded-3xl p-6 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-sage-200 mb-4">
              <h3 className="font-extrabold text-base text-forest-950">Log Periodic Soil Test</h3>
              <button onClick={() => setShowSoilModal(false)} className="text-slate-400 hover:text-forest-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogSoil} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-700 font-bold">N (kg/ha)</label>
                  <input
                    type="number"
                    value={soilForm.nitrogenKgPerHa}
                    onChange={(e) => setSoilForm({ ...soilForm, nitrogenKgPerHa: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold">P (kg/ha)</label>
                  <input
                    type="number"
                    value={soilForm.phosphorusKgPerHa}
                    onChange={(e) => setSoilForm({ ...soilForm, phosphorusKgPerHa: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold">K (kg/ha)</label>
                  <input
                    type="number"
                    value={soilForm.potassiumKgPerHa}
                    onChange={(e) => setSoilForm({ ...soilForm, potassiumKgPerHa: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="text-slate-700 font-bold">pH Level</label>
                  <input
                    type="number"
                    step="0.1"
                    value={soilForm.ph}
                    onChange={(e) => setSoilForm({ ...soilForm, ph: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold">Soil Moisture %</label>
                  <input
                    type="number"
                    value={soilForm.soilMoisturePercentage}
                    onChange={(e) => setSoilForm({ ...soilForm, soilMoisturePercentage: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 mt-1"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-bold transition-all shadow-md shadow-forest-800/20"
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
