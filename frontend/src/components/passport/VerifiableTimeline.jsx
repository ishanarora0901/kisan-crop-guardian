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
    <div className="glass-panel p-6 rounded-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-base text-white">Cryptographic Agricultural Timeline</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Passport ID: <span className="font-mono text-emerald-400 font-bold">{passport.passportId}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            <span>SHA-256 Verified</span>
          </span>
        </div>
      </div>

      {/* Merkle Root Card */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 mb-6 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400">Merkle Root Hash:</p>
          <p className="font-mono text-xs text-emerald-400 break-all">{passport.merkleRootHash || passport.blocks[0]?.blockHash}</p>
        </div>
        <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 font-semibold shrink-0">
          {passport.blocks.length} Verified Blocks
        </span>
      </div>

      {/* Vertical Stepper Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-emerald-700 before:to-slate-800">
        {passport.blocks.map((block, idx) => (
          <div key={idx} className="relative group">
            {/* Step Marker Dot */}
            <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-slate-950 border-2 border-emerald-400 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            </div>

            {/* Block Card */}
            <div
              onClick={() => setSelectedBlock(block)}
              className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/80 hover:border-emerald-500/40 transition-all cursor-pointer shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    BLOCK #{block.index}
                  </span>
                  <span className="font-bold text-sm text-slate-100">{block.eventTitle}</span>
                </div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {new Date(block.timestamp).toLocaleString()}
                </span>
              </div>

              {/* Event Type & Verifier */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {block.eventType}
                </span>
                <span className="text-[10px] text-slate-400">
                  Signed by: <span className="text-slate-200 font-medium">{block.verifiedBy}</span>
                </span>
              </div>

              {/* Hash Preview snippet */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono truncate max-w-[280px]">Hash: {block.blockHash?.substring(0, 24)}...</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[10px] group-hover:translate-x-0.5 transition-transform">
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
