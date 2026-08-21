import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyPublicPassportApi } from '../../services/api';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ExternalLink,
  Calendar,
  Layers,
  Sprout,
  Tractor,
  AlertCircle,
  Hash,
} from 'lucide-react';

const PassportVerifyPage = () => {
  const { passportId } = useParams();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await verifyPublicPassportApi(passportId);
        setSummary(res.data.summary);
      } catch (err) {
        setError(err.response?.data?.message || 'Passport verification record not found.');
      } finally {
        setLoading(false);
      }
    };

    if (passportId) {
      fetchSummary();
    }
  }, [passportId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-semibold font-mono">Verifying cryptographic SHA-256 Merkle proofs...</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-400 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Record Verification Failed</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-md">{error || 'No matching block hashes found on the ledger.'}</p>
        <Link to="/" className="mt-6 px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-200">
          Return to Platform Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Verification Status Header Card */}
        <div className="glass-panel-glow p-8 rounded-3xl text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>AUTHENTICATED BLOCKCHAIN CROP PASSPORT</span>
          </div>

          <h1 className="text-3xl font-black text-white">{summary.cropName} ({summary.variety})</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">Passport ID: {summary.passportId}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 text-xs text-left">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Farmer / Producer</span>
              <p className="font-bold text-white mt-0.5">{summary.farmerDetails?.name || 'Harpreet Singh'}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Farm Location</span>
              <p className="font-bold text-white mt-0.5">{summary.farmDetails?.locationName || 'Punjab, India'}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Verified Milestones</span>
              <p className="font-bold text-emerald-400 mt-0.5">{summary.totalVerifiedMilestones} Blocks</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Status</span>
              <p className="font-bold text-cyan-400 mt-0.5">{summary.status}</p>
            </div>
          </div>
        </div>

        {/* Cryptographic Proof Data */}
        <div className="glass-panel p-6 rounded-3xl space-y-3 text-xs">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Hash className="w-4 h-4 text-emerald-400" />
            <span>Cryptographic Merkle Root & Genesis Signatures</span>
          </h3>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500">Merkle Root Hash:</span>
            <p className="font-mono text-emerald-400 text-xs break-all mt-0.5">{summary.merkleRootHash}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500">Genesis Block Hash:</span>
            <p className="font-mono text-slate-300 text-xs break-all mt-0.5">{summary.genesisBlockHash}</p>
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="font-extrabold text-sm text-white mb-4">Complete Agricultural Event Timeline</h3>
          <div className="space-y-3">
            {summary.timeline?.map((block, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white">Block #{block.index}: {block.title}</span>
                  <span className="text-[10px] text-slate-500">{new Date(block.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-slate-400">Validator: <strong className="text-slate-300">{block.verifiedBy}</strong></p>
                <p className="text-[10px] font-mono text-emerald-400/80 truncate mt-1">Hash: {block.blockHash}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassportVerifyPage;
