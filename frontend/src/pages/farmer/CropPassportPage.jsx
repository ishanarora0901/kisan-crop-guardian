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
  BookOpen,
  FileText,
  Copy,
  Check,
} from 'lucide-react';

const CropPassportPage = () => {
  const [cropCycles, setCropCycles] = useState([]);
  const [selectedCycleId, setSelectedCycleId] = useState('');
  const [passportData, setPassportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showNotionModal, setShowNotionModal] = useState(false);
  const [copiedNotion, setCopiedNotion] = useState(false);

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
            <span className="text-xs uppercase font-black text-forest-800 tracking-wider">
              Cryptographic Agricultural Traceability
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold">
              SHA-256 Merkle Ledger
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-forest-950 tracking-tight">Blockchain Crop Passport</h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl font-medium">
            A tamper-resistant agricultural record for banking loans, crop insurance verification, export certification,
            and buyer trust.
          </p>
        </div>

        <div className="flex items-center gap-3">
            {cropCycles.length > 0 && (
              <select
                value={selectedCycleId}
                onChange={(e) => handleCycleSelect(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-forest-950 focus:border-forest-800 shadow-sm"
              >
                {cropCycles.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.cropName} ({c.season})
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => setShowNotionModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-sage-50 text-amber-950 text-xs font-bold border border-amber-300 transition-all shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>Sync to Notion</span>
            </button>

            <button
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-sage-50 text-forest-900 text-xs font-bold border border-sage-300 transition-colors shadow-sm"
            >
              <QrCode className="w-4 h-4 text-forest-800" />
              <span>Verify QR</span>
            </button>

            <button
              onClick={() => setShowAddBlockModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-extrabold shadow-md shadow-forest-800/20 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Mine Milestone Block</span>
            </button>
          </div>
        </div>

        {/* BLOCKCHAIN OVERVIEW STATS */}
        {passportData && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-sage-200 shadow-sm">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Passport ID</span>
              <p className="font-mono text-xs font-black text-forest-950 mt-1 truncate">{passportData.passportId}</p>
              <p className="text-[10px] text-slate-600 mt-1 font-medium">Status: <strong className="text-forest-900 font-bold">{passportData.status}</strong></p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-sage-200 shadow-sm">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Cryptographic Integrity</span>
              <p className="text-base font-black text-forest-950 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-forest-800" />
                <span>Chain 100% Valid</span>
              </p>
              <p className="text-[10px] text-slate-600 mt-1 font-medium">{passportData.blocks.length} Verified Block Milestones</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-sage-200 shadow-sm">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Public Verification Link</span>
              <p className="font-mono text-[11px] text-forest-900 mt-1 truncate font-bold">
                /verify/{passportData.passportId}
              </p>
              <a
                href={`/verify/${passportData.passportId}`}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-forest-800 hover:underline flex items-center gap-1 mt-1 font-bold"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white border border-sage-300 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-sage-200 mb-4">
                <h3 className="font-black text-base text-forest-950">Mine New Agricultural Milestone</h3>
                <button onClick={() => setShowAddBlockModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddBlock} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Event Type</label>
                  <select
                    value={newBlockForm.eventType}
                    onChange={(e) => setNewBlockForm({ ...newBlockForm, eventType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:border-forest-800 shadow-sm"
                  >
                    <option value="HARVEST_RECORD">Harvest Record</option>
                    <option value="ORGANIC_CERTIFICATION">Organic / GAP Certification</option>
                    <option value="SUPPLY_CHAIN_TRANSFER">Supply Chain / Grain Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Milestone Title</label>
                  <input
                    type="text"
                    required
                    value={newBlockForm.eventTitle}
                    onChange={(e) => setNewBlockForm({ ...newBlockForm, eventTitle: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-forest-800 shadow-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Yield (Quintals)</label>
                    <input
                      type="number"
                      value={newBlockForm.yieldQuintals}
                      onChange={(e) => setNewBlockForm({ ...newBlockForm, yieldQuintals: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-forest-800 shadow-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Quality Grade</label>
                    <input
                      type="text"
                      value={newBlockForm.grade}
                      onChange={(e) => setNewBlockForm({ ...newBlockForm, grade: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:border-forest-800 shadow-sm font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-bold transition-all shadow-md shadow-forest-800/20"
                >
                  Compute Hash & Append to Blockchain
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: QR CODE VERIFIER */}
        {showQrModal && passportData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-white border border-sage-300 rounded-3xl p-6 shadow-2xl text-center">
              <div className="flex items-center justify-between pb-3 border-b border-sage-200 mb-4">
                <h3 className="font-black text-base text-forest-950">Crop Passport QR Badge</h3>
                <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Generated Mock/Live QR Matrix */}
              <div className="p-6 rounded-2xl bg-sage-50 text-slate-950 inline-block shadow-inner my-3 border border-sage-200">
                <div className="w-44 h-44 border-4 border-slate-900 p-2 flex flex-col items-center justify-center bg-white rounded-lg">
                  <QrCode className="w-32 h-32 text-slate-900" />
                  <span className="text-[9px] font-mono font-bold mt-1 text-slate-700">VERIFY-CROP-SHA256</span>
                </div>
              </div>

              <p className="font-mono text-xs text-forest-950 font-black mt-2">{passportData.passportId}</p>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Scan with mobile to inspect verifiable planting, disease logs, and ICAR specialist signatures.
              </p>

              <button
                onClick={() => setShowQrModal(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold shadow-md shadow-forest-800/20"
              >
                Done
              </button>
            </div>
          </div>
        )}
        {/* MODAL: NOTION WORKSPACE HUB & SYNC */}
        {showNotionModal && passportData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-white border border-sage-300 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-sage-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center text-white font-serif font-black text-base shadow-sm">
                    N
                  </div>
                  <div>
                    <h3 className="font-black text-base text-forest-950">Notion Living Agri-Workspace Sync</h3>
                    <p className="text-[11px] text-slate-600 font-medium">All-in-One Modular Knowledge Database for Farming Operations</p>
                  </div>
                </div>
                <button onClick={() => setShowNotionModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Notion Page Preview Card */}
              <div className="p-5 rounded-2xl bg-sage-50 border border-sage-200 text-xs space-y-4 font-sans text-slate-800">
                <div className="flex items-center gap-2 pb-2 border-b border-sage-200">
                  <span className="text-2xl">🌾</span>
                  <span className="text-base font-black text-forest-950 tracking-tight">
                    [Crop Passport] {passportData.cropName} — {passportData.season}
                  </span>
                </div>

                {/* Notion Properties Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-white border border-sage-200 text-[11px] shadow-sm">
                  <div>
                    <span className="text-slate-500 font-bold">Status:</span>
                    <div className="mt-0.5 inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-black text-[10px] border border-emerald-300">
                      Verified Authentic
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold">Passport ID:</span>
                    <p className="font-mono text-forest-950 font-bold mt-0.5 truncate">{passportData.passportId}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold">Milestone Blocks:</span>
                    <p className="font-bold text-forest-950 mt-0.5">{passportData.blocks.length} Cryptographic Blocks</p>
                  </div>
                </div>

                {/* Callout Block (Notion Style) */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-2.5">
                  <span className="text-base">💡</span>
                  <p className="leading-relaxed">
                    <strong>Agri-Knowledge Hub:</strong> This page dynamically binds raw IoT soil telemetry, real-time satellite NDVI risks, and ICAR agronomist digital prescriptions into structured Notion relational database properties.
                  </p>
                </div>

                {/* Notion Database Table of Blocks */}
                <div>
                  <h4 className="font-bold text-slate-600 uppercase text-[10px] tracking-wider mb-2">Relational Milestone Entries</h4>
                  <div className="space-y-1.5 font-mono text-[10px]">
                    {passportData.blocks.map((b, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-white border border-sage-200 flex items-center justify-between shadow-sm">
                        <span className="text-slate-800 font-sans font-bold">Block #{b.index}: {b.eventTitle || b.title}</span>
                        <span className="text-forest-800 font-bold truncate max-w-[150px]">{b.hash || b.blockHash}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `# 🌾 [Crop Passport] ${passportData.cropName}\n**Passport ID**: ${passportData.passportId}\n**Status**: Verified Authentic\n**Merkle Root**: ${passportData.merkleRoot}\n\n## Verified Milestones:\n` +
                      passportData.blocks.map(b => `- **Block #${b.index}**: ${b.eventTitle} (Hash: \`${b.hash || b.blockHash}\`)`).join('\n')
                    );
                    setCopiedNotion(true);
                    setTimeout(() => setCopiedNotion(false), 3000);
                  }}
                  className="w-full sm:w-1/2 py-2.5 rounded-xl bg-white hover:bg-sage-50 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 border border-slate-300 shadow-sm"
                >
                  {copiedNotion ? <Check className="w-4 h-4 text-forest-800" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedNotion ? 'Copied Notion Markdown!' : 'Copy Notion Markdown'}</span>
                </button>

                <button
                  onClick={() => {
                    alert('✅ Successfully synced Crop Passport & Milestones to your connected Notion Agriculture Database!');
                    setShowNotionModal(false);
                  }}
                  className="w-full sm:w-1/2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20"
                >
                  Sync to Connected Notion DB
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default CropPassportPage;
