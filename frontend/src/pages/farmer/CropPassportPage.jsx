import React, { useState, useEffect } from 'react';
import { getCropCyclesApi, getPassportByCycleApi, addPassportBlockApi } from '../../services/api';
import VerifiableTimeline from '../../components/passport/VerifiableTimeline';
import {
  ShieldCheck,
  Lock,
  QrCode,
  CheckCircle2,
  Share2,
  FileBadge,
  Sparkles,
  Plus,
  X,
  ExternalLink,
} from 'lucide-react';

const CropPassportPage = () => {
  const [cropCycles, setCropCycles] = useState([]);
  const [selectedCycleId, setSelectedCycleId] = useState('');
  const [passportData, setPassportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const [newBlockForm, setNewBlockForm] = useState({
    eventType: 'HARVEST_RECORD',
    eventTitle: 'Harvest Yield Logged and Quality Stamped',
    yieldQuintals: 53,
    grade: 'Grade A Export Quality',
  });

  const loadPassport = async () => {
    try {
      setLoading(true);
      const cyclesRes = await getCropCyclesApi();
      const cycles = cyclesRes.data.cropCycles || [];
      setCropCycles(cycles);

      if (cycles.length > 0) {
        const firstId = cycles[0]._id;
        setSelectedCycleId(firstId);
        const passRes = await getPassportByCycleApi(firstId);
        setPassportData(passRes.data.passport);
      }
    } catch (err) {
      console.error('Error loading passport:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPassport();
  }, []);

  const handleCycleSelect = async (cycleId) => {
    setSelectedCycleId(cycleId);
    try {
      const passRes = await getPassportByCycleApi(cycleId);
      setPassportData(passRes.data.passport);
    } catch (err) {
      console.error('Error fetching cycle passport:', err);
    }
  };

  const handleAddBlock = async (e) => {
    e.preventDefault();
    if (!passportData) return;

    try {
      await addPassportBlockApi(passportData.passportId, {
        eventType: newBlockForm.eventType,
        eventTitle: newBlockForm.eventTitle,
        details: {
          yieldQuintals: newBlockForm.yieldQuintals,
          grade: newBlockForm.grade,
          timestamp: new Date().toISOString(),
        },
      });

      setShowAddBlockModal(false);
      alert('New milestone block mined and chained with SHA-256!');
      handleCycleSelect(selectedCycleId);
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding block');
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
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
              Cryptographic Agricultural Traceability
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
              SHA-256 Merkle Ledger
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Blockchain Crop Passport</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            A tamper-resistant agricultural record for banking loans, crop insurance verification, export certification,
            and buyer trust.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {cropCycles.length > 0 && (
            <select
              value={selectedCycleId}
              onChange={(e) => handleCycleSelect(e.target.value)}
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
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Verify QR</span>
          </button>

          <button
            onClick={() => setShowAddBlockModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Mine Milestone Block</span>
          </button>
        </div>
      </div>

      {/* BLOCKCHAIN OVERVIEW STATS */}
      {passportData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-panel p-5 rounded-2xl">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Passport ID</span>
            <p className="font-mono text-xs font-black text-emerald-400 mt-1 truncate">{passportData.passportId}</p>
            <p className="text-[10px] text-slate-400 mt-1">Status: <strong className="text-white">{passportData.status}</strong></p>
          </div>

          <div className="glass-panel p-5 rounded-2xl">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Cryptographic Integrity</span>
            <p className="text-base font-black text-white mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Chain 100% Valid</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-1">{passportData.blocks.length} Verified Block Milestones</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Public Verification Link</span>
            <p className="font-mono text-[11px] text-cyan-400 mt-1 truncate">
              /verify/{passportData.passportId}
            </p>
            <a
              href={`/verify/${passportData.passportId}`}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 mt-1 font-semibold"
            >
              <span>Open Public Verifier View</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* VERIFIABLE TIMELINE COMPONENT */}
      <VerifiableTimeline passport={passportData} />

      {/* MODAL: MINE MILESTONE BLOCK */}
      {showAddBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-extrabold text-base text-white">Mine New Agricultural Milestone</h3>
              <button onClick={() => setShowAddBlockModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBlock} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Event Type</label>
                <select
                  value={newBlockForm.eventType}
                  onChange={(e) => setNewBlockForm({ ...newBlockForm, eventType: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                >
                  <option value="HARVEST_RECORD">Harvest Record</option>
                  <option value="ORGANIC_CERTIFICATION">Organic / GAP Certification</option>
                  <option value="SUPPLY_CHAIN_TRANSFER">Supply Chain / Grain Transfer</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Milestone Title</label>
                <input
                  type="text"
                  required
                  value={newBlockForm.eventTitle}
                  onChange={(e) => setNewBlockForm({ ...newBlockForm, eventTitle: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Yield (Quintals)</label>
                  <input
                    type="number"
                    value={newBlockForm.yieldQuintals}
                    onChange={(e) => setNewBlockForm({ ...newBlockForm, yieldQuintals: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Quality Grade</label>
                  <input
                    type="text"
                    value={newBlockForm.grade}
                    onChange={(e) => setNewBlockForm({ ...newBlockForm, grade: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-600/20"
              >
                Compute Hash & Append to Blockchain
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: QR CODE VERIFIER */}
      {showQrModal && passportData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-center">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-extrabold text-base text-white">Crop Passport QR Badge</h3>
              <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Generated Mock/Live QR Matrix */}
            <div className="p-6 rounded-2xl bg-white text-slate-950 inline-block shadow-xl my-3">
              <div className="w-44 h-44 border-4 border-slate-950 p-2 flex flex-col items-center justify-center">
                <QrCode className="w-32 h-32 text-slate-950" />
                <span className="text-[9px] font-mono font-bold mt-1 text-slate-700">VERIFY-CROP-SHA256</span>
              </div>
            </div>

            <p className="font-mono text-xs text-emerald-400 font-bold mt-2">{passportData.passportId}</p>
            <p className="text-xs text-slate-400 mt-1">
              Scan with mobile to inspect verifiable planting, disease logs, and ICAR specialist signatures.
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropPassportPage;
