import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
  Calendar,
  ExternalLink,
  QrCode,
  FileCheck,
  ChevronRight,
} from 'lucide-react';
import BlockDetailModal from './BlockDetailModal';

const VerifiableTimeline = ({ passport }) => {
  const [selectedBlock, setSelectedBlock] = useState(null);

  if (!passport || !passport.blocks) return null;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-sage-200 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-sage-200">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-forest-800" />
            <h3 className="font-black text-base text-forest-950">Cryptographic Agricultural Timeline</h3>
          </div>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            Passport ID: <span className="font-mono text-forest-950 font-black">{passport.passportId}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-forest-800" />
            <span>SHA-256 Verified</span>
          </span>
        </div>
      </div>

      {/* Merkle Root Card */}
      <div className="p-3.5 rounded-xl bg-sage-50 border border-sage-200 mb-6 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-500">Merkle Root Hash:</p>
          <p className="font-mono text-xs text-forest-950 font-black break-all">{passport.merkleRootHash || passport.blocks[0]?.blockHash}</p>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-white border border-sage-300 text-[11px] text-slate-700 font-bold shrink-0 shadow-sm">
          {passport.blocks.length} Verified Blocks
        </span>
      </div>

      {/* Vertical Stepper Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-forest-800 before:via-forest-700 before:to-sage-300">
        {passport.blocks.map((block, idx) => (
          <div key={idx} className="relative group">
            {/* Step Marker Dot */}
            <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white border-2 border-forest-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <div className="w-2 h-2 rounded-full bg-forest-800"></div>
            </div>

            {/* Block Card */}
            <div
              onClick={() => setSelectedBlock(block)}
              className="p-4 rounded-xl bg-white hover:bg-sage-50 border border-sage-200 hover:border-forest-800/40 transition-all cursor-pointer shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-sage-100 text-forest-900 border border-sage-200">
                    BLOCK #{block.index}
                  </span>
                  <span className="font-black text-sm text-forest-950">{block.eventTitle}</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {new Date(block.timestamp).toLocaleString()}
                </span>
              </div>

              {/* Event Type & Verifier */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {block.eventType}
                </span>
                <span className="text-[10px] text-slate-600 font-medium">
                  Signed by: <span className="text-slate-900 font-bold">{block.verifiedBy}</span>
                </span>
              </div>

              {/* Hash Preview snippet */}
              <div className="mt-2.5 pt-2 border-t border-sage-200 flex items-center justify-between text-[11px] text-slate-600">
                <span className="font-mono truncate max-w-[280px]">Hash: {block.blockHash?.substring(0, 24)}...</span>
                <span className="text-forest-800 font-bold flex items-center gap-1 text-[10px] group-hover:translate-x-0.5 transition-transform">
                  View Cryptographic Proof <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Block Detail Modal */}
      {selectedBlock && (
        <BlockDetailModal block={selectedBlock} onClose={() => setSelectedBlock(null)} />
      )}
    </div>
  );
};

export default VerifiableTimeline;
