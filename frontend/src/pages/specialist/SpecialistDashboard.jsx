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
        <h1 className="text-2xl sm:text-3xl font-black text-forest-950 tracking-tight">
          Specialist Consultation & Prescription Center
        </h1>
        <p className="text-xs text-slate-600 mt-1 font-medium">
          Review incoming farmer cases, inspect AI computer vision leaf scans, and issue verified ICAR prescriptions.
        </p>
      </div>

      {/* 2-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INCOMING QUEUE */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 px-1">
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
                  ? 'bg-teal-50/80 border-2 border-teal-300 shadow-md shadow-teal-500/10'
                  : 'bg-white hover:bg-sage-50 border border-sage-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-sm text-forest-950 truncate max-w-[200px]">{item.subject}</span>
                <span
                  className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                    item.status === 'PRESCRIBED' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Farmer: <strong className="text-forest-950 font-bold">{item.farmer?.name || 'Harpreet Singh'}</strong> ({item.cropCycle?.cropName})
              </p>
              <p className="text-[10px] text-slate-500 font-medium mt-1">{new Date(item.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* CASE INSPECTION & PRESCRIPTION ISSUANCE */}
        <div className="lg:col-span-8 space-y-6">
          {selectedConsultation ? (
            <div className="glass-panel p-6 rounded-3xl space-y-6 border border-sage-200 shadow-sm">
              {/* Header */}
              <div className="pb-4 border-b border-sage-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-forest-950">{selectedConsultation.subject}</h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Farmer: <strong className="text-forest-900 font-bold">{selectedConsultation.farmer?.name}</strong> · Crop:{' '}
                    {selectedConsultation.cropCycle?.cropName} ({selectedConsultation.cropCycle?.cropVariety})
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-bold border border-teal-200">
                  {selectedConsultation.priority} PRIORITY
                </span>
              </div>

              {/* Farmer's Complaint & Uploaded Scan */}
              <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 text-xs space-y-2 text-slate-800">
                <span className="font-bold text-forest-950 block">Farmer Query / Observed Symptoms:</span>
                <p className="text-slate-700 leading-relaxed font-medium">{selectedConsultation.farmerDescription}</p>

                {selectedConsultation.diseaseDetection && (
                  <div className="mt-3 pt-3 border-t border-sage-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">AI Vision Pre-Scan:</span>
                      <p className="font-bold text-forest-800 mt-0.5">
                        {selectedConsultation.diseaseDetection.detectedDisease} (
                        {selectedConsultation.diseaseDetection.confidenceScore}% confidence)
                      </p>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white border border-sage-300 text-slate-700 font-bold shadow-sm">
                      Pre-analyzed by AI
                    </span>
                  </div>
                )}
              </div>

              {/* OFFICIAL PRESCRIPTION BUILDER */}
              <div className="p-6 rounded-2xl bg-white border-2 border-teal-300 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-teal-900 font-black text-sm">
                  <Stethoscope className="w-5 h-5 text-teal-800" />
                  <span>Issue Official Diagnosis & Prescription</span>
                </div>

                <form onSubmit={handlePrescribeSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Confirmed Pathological Diagnosis</label>
                    <input
                      type="text"
                      required
                      value={prescriptionForm.specialistDiagnosis}
                      onChange={(e) => setPrescriptionForm({ ...prescriptionForm, specialistDiagnosis: e.target.value })}
                      placeholder="e.g. Confirmed Early-Stage Wheat Leaf Rust (Puccinia triticina)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-teal-700 font-bold shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Clinical Advisory & Field Directives</label>
                    <textarea
                      rows="3"
                      required
                      value={prescriptionForm.professionalAdvice}
                      onChange={(e) => setPrescriptionForm({ ...prescriptionForm, professionalAdvice: e.target.value })}
                      placeholder="e.g. Pathogen is in initial sporulation stage. Apply targeted systemic fungicide immediately before morning dew settles."
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-teal-700 font-medium shadow-sm"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Recommended Chemical Treatment</label>
                      <input
                        type="text"
                        value={prescriptionForm.chemicalName}
                        onChange={(e) => setPrescriptionForm({ ...prescriptionForm, chemicalName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-teal-700 font-medium shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Dosage Per Acre</label>
                      <input
                        type="text"
                        value={prescriptionForm.dosagePerAcre}
                        onChange={(e) => setPrescriptionForm({ ...prescriptionForm, dosagePerAcre: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-teal-700 font-medium shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Organic / Bio-Remedy Alternative</label>
                    <input
                      type="text"
                      value={prescriptionForm.organicAlternative}
                      onChange={(e) => setPrescriptionForm({ ...prescriptionForm, organicAlternative: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-teal-700 font-medium shadow-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-black flex items-center justify-center gap-2 shadow-md shadow-forest-800/20 transition-all hover:scale-[1.01]"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Authorize Prescription & Stamp to Blockchain Passport</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl text-center text-slate-500 border border-sage-200">
              <Stethoscope className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">Select a case from the queue to start agronomic review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialistDashboard;
