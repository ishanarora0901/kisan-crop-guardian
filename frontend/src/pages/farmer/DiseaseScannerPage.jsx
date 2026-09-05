import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCropCyclesApi,
  scanDiseaseImageApi,
  getDiseaseHistoryApi,
} from '../../services/api';
import VoiceSpeaker from '../../components/common/VoiceSpeaker';
import {
  ScanEye,
  Camera,
  UploadCloud,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Sparkles,
  ArrowRight,
  History,
  Image as ImageIcon,
} from 'lucide-react';

const DiseaseScannerPage = () => {
  const navigate = useNavigate();
  const [cropCycles, setCropCycles] = useState([]);
  const [selectedCycleId, setSelectedCycleId] = useState('');
  const [selectedCropName, setSelectedCropName] = useState('Wheat');
  const [userNotes, setUserNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadCyclesAndHistory = async () => {
      try {
        const cyclesRes = await getCropCyclesApi();
        const cycles = cyclesRes.data.cropCycles || [];
        setCropCycles(cycles);
        if (cycles.length > 0) {
          setSelectedCycleId(cycles[0]._id);
          setSelectedCropName(cycles[0].cropName);
        }

        const histRes = await getDiseaseHistoryApi();
        setHistory(histRes.data.scans || []);
      } catch (err) {
        console.error('Error loading scanner data:', err);
      }
    };
    loadCyclesAndHistory();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setScanResult(null);
    }
  };

  const handleSampleImage = (type) => {
    let url = '/assets/sample-wheat-leaf.jpg';
    if (type === 'rust') {
      setUserNotes('Orange and yellow pustules noticed on wheat leaf');
      setSelectedCropName('Wheat');
    } else if (type === 'blast') {
      setUserNotes('Spindle shaped grey lesions on rice foliage');
      setSelectedCropName('Rice');
    } else if (type === 'blight') {
      setUserNotes('Concentric brown target rings on tomato leaf');
      setSelectedCropName('Tomato');
    } else {
      setUserNotes('Vibrant green healthy leaf');
      setSelectedCropName('Wheat');
    }
    setPreviewUrl(url);
    setSelectedFile(null);
    setScanResult(null);
  };

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCycleId) {
      alert('Please select or register a crop cycle first.');
      return;
    }

    setScanning(true);
    try {
      const formData = new FormData();
      formData.append('cropCycleId', selectedCycleId);
      formData.append('cropName', selectedCropName);
      formData.append('userNotes', userNotes);

      if (selectedFile) {
        formData.append('image', selectedFile);
      } else {
        formData.append('imageBase64', previewUrl || '/assets/sample-wheat-leaf.jpg');
      }

      // Simulate a realistic neural inference time (1.2s)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const res = await scanDiseaseImageApi(formData);
      setScanResult(res.data.detection);

      // Refresh history
      const histRes = await getDiseaseHistoryApi();
      setHistory(histRes.data.scans || []);
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing image scan');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Title Banner */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase font-black text-teal-800 tracking-wider">
            Computer Vision Pathological Scanner
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-300 text-[10px] font-bold">
            ResNet-AgriVision
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-forest-950 tracking-tight">AI Crop Disease Vision Scanner</h1>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl font-medium">
          Upload a photograph of crop foliage, stem, or fruit for immediate AI-powered disease classification,
          confidence scoring, and preventive guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: UPLOAD & CONTROLS */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-sage-200 shadow-sm">
            <h3 className="font-black text-base text-forest-950 mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-forest-800" />
              <span>Capture / Upload Crop Photograph</span>
            </h3>

            <form onSubmit={handleScanSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Crop Cycle</label>
                  <select
                    value={selectedCycleId}
                    onChange={(e) => {
                      setSelectedCycleId(e.target.value);
                      const c = cropCycles.find((cy) => cy._id === e.target.value);
                      if (c) setSelectedCropName(c.cropName);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-forest-800 font-bold shadow-sm"
                  >
                    {cropCycles.map((cycle) => (
                      <option key={cycle._id} value={cycle._id}>
                        {cycle.cropName} ({cycle.season})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Crop Type</label>
                  <input
                    type="text"
                    value={selectedCropName}
                    onChange={(e) => setSelectedCropName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-forest-800 font-bold shadow-sm"
                  />
                </div>
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Crop Leaf / Affected Area Photo</label>
                <label className="border-2 border-dashed border-sage-300 hover:border-forest-800 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-sage-50 group">
                  <UploadCloud className="w-8 h-8 text-forest-800 group-hover:scale-110 transition-transform mb-2" />
                  <p className="font-bold text-slate-800">Click to upload photo or take picture</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-medium">Supports JPG, PNG, WEBP (Max 10MB)</p>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              {/* Quick Sample Image Presets */}
              <div>
                <span className="text-[11px] font-bold text-slate-600 block mb-2">Or test with demo disease samples:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSampleImage('rust')}
                    className="p-2 rounded-xl bg-white hover:bg-sage-50 border border-sage-300 text-[11px] font-bold text-forest-900 text-center shadow-sm"
                  >
                    🌾 Wheat Rust
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSampleImage('blast')}
                    className="p-2 rounded-xl bg-white hover:bg-sage-50 border border-sage-300 text-[11px] font-bold text-forest-900 text-center shadow-sm"
                  >
                    🌱 Rice Blast
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSampleImage('blight')}
                    className="p-2 rounded-xl bg-white hover:bg-sage-50 border border-sage-300 text-[11px] font-bold text-forest-900 text-center shadow-sm"
                  >
                    🍅 Tomato Blight
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSampleImage('healthy')}
                    className="p-2 rounded-xl bg-white hover:bg-sage-50 border border-sage-300 text-[11px] font-bold text-forest-900 text-center shadow-sm"
                  >
                    🍃 Healthy Leaf
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observed Symptoms / Farmer Notes</label>
                <textarea
                  rows="2"
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="e.g. Yellow spots on flag leaves after morning humidity"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-forest-800 font-medium shadow-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={scanning}
                className="w-full py-3.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-forest-800/20 transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                {scanning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>AI Model Processing Image...</span>
                  </>
                ) : (
                  <>
                    <ScanEye className="w-4 h-4 text-emerald-300" />
                    <span>Run AI Computer Vision Diagnosis</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE SCANNER OVERLAY & DIAGNOSTIC REPORT */}
        <div className="lg:col-span-6 space-y-6">
          {/* Image & Scanner Animation Box */}
          <div className="glass-panel p-5 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center min-h-[300px] border border-sage-200 shadow-sm">
            {previewUrl ? (
              <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-sage-300 shadow-md">
                <img
                  src={previewUrl}
                  alt="Crop preview"
                  className="w-full h-56 object-cover"
                />

                {/* Animated AI Scanning Line */}
                {scanning && (
                  <div className="absolute inset-0 bg-forest-800/20 pointer-events-none flex flex-col justify-between">
                    <div className="w-full h-1 bg-emerald-400 shadow-lg shadow-emerald-400 animate-scan"></div>
                    <div className="p-2 text-center text-xs font-mono font-bold text-white bg-black/70">
                      ANALYZING LESIONS & TEXTURE...
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-8 text-slate-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50 text-slate-400" />
                <p className="text-xs font-bold text-slate-600">Select or upload a crop photo to begin AI analysis</p>
              </div>
            )}
          </div>

          {/* AI DIAGNOSTIC REPORT CARD */}
          {scanResult && (
            <div className="glass-panel p-6 rounded-3xl space-y-4 animate-in fade-in border border-sage-200 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-sage-200">
                <div>
                  <span className="text-[10px] uppercase font-black text-forest-800">Diagnosis Summary</span>
                  <h3 className="text-xl font-black text-forest-950">{scanResult.detectedDisease}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-600 font-bold">Estimated Confidence:</span>
                  <p className="text-2xl font-black text-forest-800">{scanResult.confidenceScore}%</p>
                </div>
              </div>

              {/* Audio Reader Guidance */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-700 font-semibold">Severity: <strong className="text-amber-900 font-black">{scanResult.severityLevel}</strong></span>
                <VoiceSpeaker text={`Possible Diagnosis: ${scanResult.detectedDisease} with ${scanResult.confidenceScore} percent estimated confidence. Preventive measures: ${scanResult.preventiveMeasures.join('. ')}`} />
              </div>

              {/* Symptoms */}
              {scanResult.visibleSymptoms && scanResult.visibleSymptoms.length > 0 && (
                <div className="p-3.5 rounded-xl bg-sage-50 border border-sage-200 text-xs">
                  <span className="font-black text-forest-950 block mb-1.5">Visible Symptoms:</span>
                  <ul className="space-y-1">
                    {scanResult.visibleSymptoms.map((s, idx) => (
                      <li key={idx} className="text-slate-700 font-medium flex items-start gap-2">
                        <span className="text-forest-800 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contributing Factors */}
              {scanResult.contributingFactors && scanResult.contributingFactors.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs">
                  <span className="font-black text-amber-950 block mb-1.5">Possible Contributing Factors:</span>
                  <ul className="space-y-1">
                    {scanResult.contributingFactors.map((f, idx) => (
                      <li key={idx} className="text-slate-700 font-medium flex items-start gap-2">
                        <span className="text-amber-800 font-bold">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Preventive Measures */}
              {scanResult.preventiveMeasures && scanResult.preventiveMeasures.length > 0 && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs">
                  <span className="font-black text-forest-950 block mb-1.5">General Preventive Measures:</span>
                  <ul className="space-y-1">
                    {scanResult.preventiveMeasures.map((p, idx) => (
                      <li key={idx} className="text-emerald-950 font-medium flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-forest-800 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specialist Referral CTA */}
              <div className="pt-2">
                <button
                  onClick={() =>
                    navigate('/consultations', {
                      state: {
                        cropCycleId: selectedCycleId,
                        diseaseDetectionId: scanResult._id,
                        detectedDisease: scanResult.detectedDisease,
                      },
                    })
                  }
                  className="w-full py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 text-xs font-black flex items-center justify-center gap-2 transition-all hover:scale-[1.01] shadow-sm"
                >
                  <Stethoscope className="w-4 h-4 text-rose-800" />
                  <span>Request Agricultural Specialist Consultation for Verified Guidance</span>
                  <ArrowRight className="w-3.5 h-3.5 text-rose-800" />
                </button>
              </div>

              <p className="text-[10px] text-slate-500 font-medium italic text-center">
                * Note: AI detections are statistical estimates based on computer vision patterns. Consult an agricultural specialist for serious outbreaks.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RECENT SCAN HISTORY */}
      {history.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-sage-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-forest-800" />
            <h3 className="font-black text-base text-forest-950">Recent Disease Scan Log</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {history.map((scan) => (
              <div key={scan._id} className="p-3.5 rounded-xl bg-sage-50 border border-sage-200 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-black text-forest-950 truncate">{scan.detectedDisease}</span>
                  <span className="font-black text-forest-800">{scan.confidenceScore}%</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">
                  Crop: {scan.cropName} · {new Date(scan.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseScannerPage;
