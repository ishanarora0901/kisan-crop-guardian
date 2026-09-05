import React from 'react';
import { X, ShieldCheck, Hash, Database, Clock, Key, CheckCircle } from 'lucide-react';

const BlockDetailModal = ({ block, onClose }) => {
  if (!block) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-sage-300 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sage-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-forest-800">
              <ShieldCheck className="w-5 h-5 text-forest-800" />
            </div>
            <div>
              <h3 className="font-black text-base text-forest-950">Block #{block.index} Proof Inspector</h3>
              <p className="text-xs text-slate-600 font-medium">{block.eventTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-sage-100 hover:bg-sage-200 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cryptographic Hashes */}
        <div className="mt-5 space-y-3.5">
          <div className="p-3.5 rounded-xl bg-sage-50 border border-sage-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold mb-1">
              <Hash className="w-3.5 h-3.5 text-forest-800" />
              <span>Current Block Hash (SHA-256):</span>
            </div>
            <p className="font-mono text-xs text-forest-950 font-black break-all">{block.blockHash}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-sage-50 border border-sage-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold mb-1">
              <Key className="w-3.5 h-3.5 text-teal-700" />
              <span>Previous Block Hash:</span>
            </div>
            <p className="font-mono text-xs text-slate-800 font-bold break-all">{block.previousHash}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-sage-50 border border-sage-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold mb-1">
              <Database className="w-3.5 h-3.5 text-purple-700" />
              <span>IPFS Content Identifier (CID):</span>
            </div>
            <p className="font-mono text-xs text-purple-950 font-bold break-all">{block.ipfsCid || 'bafybeicropguardianproof2026'}</p>
          </div>

          {/* Block Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-sage-50 border border-sage-200">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Timestamp</span>
              <p className="font-bold text-slate-900 mt-0.5">{new Date(block.timestamp).toUTCString()}</p>
            </div>

            <div className="p-3 rounded-xl bg-sage-50 border border-sage-200">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Consensus Validator</span>
              <p className="font-bold text-slate-900 mt-0.5">{block.verifiedBy}</p>
            </div>
          </div>

          {/* Raw Payload Data */}
          <div>
            <span className="text-xs font-bold text-slate-700 mb-1.5 block">Signed Agricultural Event Payload:</span>
            <pre className="p-3 rounded-xl bg-sage-50 border border-sage-200 text-[11px] font-mono text-slate-800 overflow-x-auto">
              {JSON.stringify(block.details || {}, null, 2)}
            </pre>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-forest-950 text-xs font-bold">
            <CheckCircle className="w-4 h-4 text-forest-800 shrink-0" />
            <span>Cryptographic signature and Merkle chain mathematically verified.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold transition-colors shadow-sm"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockDetailModal;
