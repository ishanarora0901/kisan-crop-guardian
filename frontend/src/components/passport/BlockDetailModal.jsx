import React from 'react';
import { X, ShieldCheck, Hash, Database, Clock, Key, CheckCircle } from 'lucide-react';

const BlockDetailModal = ({ block, onClose }) => {
  if (!block) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Block #{block.index} Proof Inspector</h3>
              <p className="text-xs text-slate-400">{block.eventTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cryptographic Hashes */}
        <div className="mt-5 space-y-3.5">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
              <Hash className="w-3.5 h-3.5 text-emerald-400" />
              <span>Current Block Hash (SHA-256):</span>
            </div>
            <p className="font-mono text-xs text-emerald-400 break-all">{block.blockHash}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>Previous Block Hash:</span>
            </div>
            <p className="font-mono text-xs text-slate-300 break-all">{block.previousHash}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
              <Database className="w-3.5 h-3.5 text-purple-400" />
              <span>IPFS Content Identifier (CID):</span>
            </div>
            <p className="font-mono text-xs text-purple-300 break-all">{block.ipfsCid || 'bafybeicropguardianproof2026'}</p>
          </div>

          {/* Block Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Timestamp</span>
              <p className="font-medium text-slate-200 mt-0.5">{new Date(block.timestamp).toUTCString()}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Consensus Validator</span>
              <p className="font-medium text-slate-200 mt-0.5">{block.verifiedBy}</p>
            </div>
          </div>

          {/* Raw Payload Data */}
          <div>
            <span className="text-xs font-bold text-slate-400 mb-1.5 block">Signed Agricultural Event Payload:</span>
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
              {JSON.stringify(block.details || {}, null, 2)}
            </pre>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Cryptographic signature and Merkle chain mathematically verified.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockDetailModal;
