import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getConsultationsApi,
  getSpecialistsApi,
  requestConsultationApi,
  sendConsultationMessageApi,
} from '../../services/api';
import VoiceSpeaker from '../../components/common/VoiceSpeaker';
import {
  Stethoscope,
  Send,
  MessageSquare,
  FileText,
  Star,
  CheckCircle2,
  Clock,
  Plus,
  X,
  User,
  ShieldCheck,
} from 'lucide-react';

const ConsultationsPage = () => {
  const location = useLocation();
  const [consultations, setConsultations] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);

  const [reqForm, setReqForm] = useState({
    specialistId: '',
    cropCycleId: location.state?.cropCycleId || '',
    diseaseDetectionId: location.state?.diseaseDetectionId || '',
    subject: location.state?.detectedDisease
      ? `Advisory for ${location.state.detectedDisease}`
      : 'Crop Protection & Diagnostic Consultation',
    farmerDescription: 'Requesting expert agronomic review on foliar discoloration and pesticide dosage.',
    priority: 'NORMAL',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [cRes, sRes] = await Promise.all([getConsultationsApi(), getSpecialistsApi()]);
      setConsultations(cRes.data.consultations || []);
      setSpecialists(sRes.data.specialists || []);

      if (cRes.data.consultations?.length > 0) {
        setSelectedConsultation(cRes.data.consultations[0]);
      }

      if (sRes.data.specialists?.length > 0) {
        setReqForm((prev) => ({ ...prev, specialistId: sRes.data.specialists[0]._id }));
      }
    } catch (err) {
      console.error('Error loading consultations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (location.state?.diseaseDetectionId) {
      setShowNewModal(true);
    }
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConsultation) return;

    try {
      const res = await sendConsultationMessageApi(selectedConsultation._id, newMessage);
      setSelectedConsultation(res.data.consultation);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await requestConsultationApi(reqForm);
      setShowNewModal(false);
      alert('Consultation request submitted to agricultural specialist!');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error requesting consultation');
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
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold text-rose-400 tracking-wider">
              Agricultural Expert Advisory Network
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">
              ICAR Verified
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Specialist Consultations</h1>
          <p className="text-xs text-slate-400 mt-1">
            Connect directly with plant pathologists, soil scientists, and certified agronomists for verified guidance.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow-lg shadow-rose-600/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>New Consultation Request</span>
        </button>
      </div>

      {/* 2-COLUMN LAYOUT: THREADS LIST & ACTIVE CHAT/PRESCRIPTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: CONSULTATION LIST */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">Active Consultations</h3>

          {consultations.length === 0 ? (
            <div className="glass-panel p-6 rounded-2xl text-center text-xs text-slate-400">
              No active consultation requests found. Click 'New Consultation Request' to get started.
            </div>
          ) : (
            consultations.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedConsultation(item)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedConsultation?._id === item._id
                    ? 'bg-slate-800/90 border-rose-500/50 shadow-md shadow-rose-500/5'
                    : 'glass-panel hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-sm text-white truncate max-w-[200px]">{item.subject}</span>
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded ${
                      item.status === 'PRESCRIBED'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Specialist: <strong className="text-slate-200">{item.specialist?.name || 'Dr. Ramesh Sharma'}</strong>
                </p>
                <p className="text-[10px] text-slate-500 mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>

        {/* RIGHT COLUMN: ACTIVE THREAD & PRESCRIPTION */}
        <div className="lg:col-span-8 space-y-6">
          {selectedConsultation ? (
            <div className="glass-panel p-6 rounded-3xl space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-lg text-white">{selectedConsultation.subject}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {selectedConsultation.priority} PRIORITY
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Assigned to: <strong className="text-rose-400">{selectedConsultation.specialist?.name}</strong> ·{' '}
                    Crop: {selectedConsultation.cropCycle?.cropName}
                  </p>
                </div>
              </div>

              {/* SPECIALIST OFFICIAL PRESCRIPTION CARD (IF ISSUED) */}
              {selectedConsultation.specialistDiagnosis && (
                <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 shadow-xl space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
                      <ShieldCheck className="w-5 h-5" />
                      <span>Official Agricultural Prescription & Advisory</span>
                    </div>
                    <VoiceSpeaker
                      text={`Specialist Diagnosis: ${selectedConsultation.specialistDiagnosis}. Advice: ${selectedConsultation.professionalAdvice}`}
                    />
                  </div>

                  <div className="text-xs space-y-2">
                    <div>
                      <span className="text-slate-400 font-bold">Confirmed Specialist Diagnosis:</span>
                      <p className="text-sm font-extrabold text-white mt-0.5">
                        {selectedConsultation.specialistDiagnosis}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-bold">Clinical Advisory & Action Plan:</span>
                      <p className="text-slate-200 mt-0.5 leading-relaxed">
                        {selectedConsultation.professionalAdvice}
                      </p>
                    </div>

                    {selectedConsultation.prescriptionDetails?.chemicalTreatments?.length > 0 && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                          Chemical Spray Protocol:
                        </span>
                        {selectedConsultation.prescriptionDetails.chemicalTreatments.map((chem, idx) => (
                          <div key={idx} className="text-slate-300">
                            <strong>{chem.chemicalName}</strong> — Dosage: {chem.dosagePerAcre} (Spray interval:{' '}
                            {chem.sprayIntervalDays} days)
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MESSAGES THREAD */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                  Consultation Messages Thread
                </h4>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                  {selectedConsultation.messages?.map((msg, idx) => {
                    const isFarmer = msg.senderRole === 'farmer';
                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-2xl text-xs max-w-lg ${
                          isFarmer
                            ? 'bg-slate-800/90 ml-auto border border-slate-700 text-slate-100'
                            : 'bg-rose-950/40 mr-auto border border-rose-500/30 text-rose-100'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 mb-1 text-[10px] text-slate-400 font-semibold">
                          <span>{isFarmer ? 'You (Farmer)' : 'Dr. Ramesh Sharma (Specialist)'}</span>
                          <span>{new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="leading-relaxed">{msg.message}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message or symptom update to the specialist..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-rose-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl text-center text-slate-400">
              <Stethoscope className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold">Select a consultation to review specialist prescription and chat</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: NEW CONSULTATION REQUEST */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-extrabold text-base text-white">Request Specialist Consultation</h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Select Verified Specialist</label>
                <select
                  value={reqForm.specialistId}
                  onChange={(e) => setReqForm({ ...reqForm, specialistId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                >
                  {specialists.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.profile?.qualification || 'ICAR Plant Pathologist'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Consultation Subject</label>
                <input
                  type="text"
                  required
                  value={reqForm.subject}
                  onChange={(e) => setReqForm({ ...reqForm, subject: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Describe Crop Condition & Query</label>
                <textarea
                  rows="3"
                  required
                  value={reqForm.farmerDescription}
                  onChange={(e) => setReqForm({ ...reqForm, farmerDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-lg shadow-rose-600/20"
              >
                Submit Request to Agronomist
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationsPage;
