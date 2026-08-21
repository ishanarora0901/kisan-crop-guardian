import React, { useState, useEffect } from 'react';
import { getConsultationsApi, prescribeAdviceApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  Stethoscope,
  CheckCircle2,
  FileCheck2,
  AlertCircle,
  FlaskConical,
  ShieldCheck,
  Send,
  MessageSquare,
  Clock,
  Sparkles,
} from 'lucide-react';

const SpecialistDashboard = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [loading, setLoading] = useState(true);

  const [prescriptionForm, setPrescriptionForm] = useState({
    specialistDiagnosis: '',
    professionalAdvice: '',
    chemicalName: 'Tilt (Propiconazole 25% EC)',
    dosagePerAcre: '200 ml in 200 Liters of water',
    sprayIntervalDays: 14,
    safeHarvestWaitingPeriodDays: 30,
    organicAlternative: 'Neem Oil (10,000 ppm) + Trichoderma viride',
  });

  const loadConsultations = async () => {
    try {
      setLoading(true);
      const res = await getConsultationsApi();
      const list = res.data.consultations || [];
      setConsultations(list);
      if (list.length > 0) {
        setSelectedConsultation(list[0]);
        if (list[0].specialistDiagnosis) {
          setPrescriptionForm((prev) => ({
            ...prev,
            specialistDiagnosis: list[0].specialistDiagnosis,
            professionalAdvice: list[0].professionalAdvice,
          }));
        }
      }
    } catch (err) {
      console.error('Error loading specialist queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsultations();
  }, []);

  const handlePrescribeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedConsultation) return;

    try {
      await prescribeAdviceApi(selectedConsultation._id, {
        specialistDiagnosis: prescriptionForm.specialistDiagnosis,
        professionalAdvice: prescriptionForm.professionalAdvice,
        prescriptionDetails: {
          chemicalTreatments: [
            {
              chemicalName: prescriptionForm.chemicalName,
              dosagePerAcre: prescriptionForm.dosagePerAcre,
              sprayIntervalDays: Number(prescriptionForm.sprayIntervalDays),
              safeHarvestWaitingPeriodDays: Number(prescriptionForm.safeHarvestWaitingPeriodDays),
            },
          ],
          organicAlternatives: [
            {
              remedyName: prescriptionForm.organicAlternative,
              preparationMethod: 'Dilute in water and spray in early morning hours.',
            },
          ],
        },
      });

      alert('Prescription issued & stamped onto the Farmer Blockchain Crop Passport!');
      loadConsultations();
    } catch (err) {
      alert(err.response?.data?.message || 'Error issuing prescription');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
            Plant Pathology & Agronomic Clinical Desk
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold">
            Doctor Verified
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Specialist Consultation & Prescription Center
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review incoming farmer cases, inspect AI computer vision leaf scans, and issue verified ICAR prescriptions.
        </p>
      </div>

      {/* 2-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INCOMING QUEUE */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Farmer Consultation Queue ({consultations.length})
          </h3>

          {consultations.map((item) => (
            <div
              key={item._id}
              onClick={() => {
                setSelectedConsultation(item);
                if (item.specialistDiagnosis) {
                  setPrescriptionForm((prev) => ({
                    ...prev,
                    specialistDiagnosis: item.specialistDiagnosis,
                    professionalAdvice: item.professionalAdvice,
                  }));
                }
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedConsultation?._id === item._id
                  ? 'bg-slate-800/90 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                  : 'glass-panel hover:bg-slate-900/90'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-white truncate max-w-[200px]">{item.subject}</span>
                <span
                  className={`text-[9px] font-black px-2 py-0.5 rounded ${
                    item.status === 'PRESCRIBED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Farmer: <strong className="text-white">{item.farmer?.name || 'Harpreet Singh'}</strong> ({item.cropCycle?.cropName})
              </p>
              <p className="text-[10px] text-slate-500 mt-1">{new Date(item.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* CASE INSPECTION & PRESCRIPTION ISSUANCE */}
        <div className="lg:col-span-8 space-y-6">
          {selectedConsultation ? (
            <div className="glass-panel p-6 rounded-3xl space-y-6">
              {/* Header */}
              <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-white">{selectedConsultation.subject}</h3>
                  <p className="text-xs text-slate-400">
                    Farmer: <strong className="text-emerald-400">{selectedConsultation.farmer?.name}</strong> · Crop:{' '}
                    {selectedConsultation.cropCycle?.cropName} ({selectedConsultation.cropCycle?.cropVariety})
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold">
                  {selectedConsultation.priority} PRIORITY
                </span>
              </div>

              {/* Farmer's Complaint & Uploaded Scan */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
                <span className="font-bold text-slate-300 block">Farmer Query / Observed Symptoms:</span>
                <p className="text-slate-200 leading-relaxed">{selectedConsultation.farmerDescription}</p>

                {selectedConsultation.diseaseDetection && (
                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">AI Vision Pre-Scan:</span>
                      <p className="font-bold text-cyan-400 mt-0.5">
                        {selectedConsultation.diseaseDetection.detectedDisease} (
                        {selectedConsultation.diseaseDetection.confidenceScore}% confidence)
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                      Pre-analyzed by AI
                    </span>
                  </div>
                )}
              </div>

              {/* OFFICIAL PRESCRIPTION BUILDER */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-sm">
                  <Stethoscope className="w-5 h-5" />
                  <span>Issue Official Diagnosis & Prescription</span>
                </div>

                <form onSubmit={handlePrescribeSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Confirmed Pathological Diagnosis</label>
                    <input
                      type="text"
                      required
                      value={prescriptionForm.specialistDiagnosis}
                      onChange={(e) => setPrescriptionForm({ ...prescriptionForm, specialistDiagnosis: e.target.value })}
                      placeholder="e.g. Confirmed Early-Stage Wheat Leaf Rust (Puccinia triticina)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Clinical Advisory & Field Directives</label>
                    <textarea
                      rows="3"
                      required
                      value={prescriptionForm.professionalAdvice}
                      onChange={(e) => setPrescriptionForm({ ...prescriptionForm, professionalAdvice: e.target.value })}
                      placeholder="e.g. Pathogen is in initial sporulation stage. Apply targeted systemic fungicide immediately before morning dew settles."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-500"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Recommended Chemical Treatment</label>
                      <input
                        type="text"
                        value={prescriptionForm.chemicalName}
                        onChange={(e) => setPrescriptionForm({ ...prescriptionForm, chemicalName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Dosage Per Acre</label>
                      <input
                        type="text"
                        value={prescriptionForm.dosagePerAcre}
                        onChange={(e) => setPrescriptionForm({ ...prescriptionForm, dosagePerAcre: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Organic / Bio-Remedy Alternative</label>
                    <input
                      type="text"
                      value={prescriptionForm.organicAlternative}
                      onChange={(e) => setPrescriptionForm({ ...prescriptionForm, organicAlternative: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 transition-all hover:scale-[1.02]"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Authorize Prescription & Stamp to Blockchain Passport</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl text-center text-slate-400">
              <Stethoscope className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold">Select a case from the queue to start agronomic review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialistDashboard;
