import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export const SafetyBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white text-xs py-2 px-4 border-b border-blue-800 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide uppercase flex items-center gap-1 shadow-sm">
            <ShieldAlert className="w-3 h-3 text-slate-900" />
            Educational Prototype
          </span>
          <span className="text-slate-200">
            <strong>Triage Support Only</strong> — Not for Diagnosis or Treatment. All decisions require licensed clinical review.
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-300 text-[11px]">
          <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded text-white font-medium">
            <Info className="w-3 h-3 text-cyan-300" />
            100% Synthetic Patient Data
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300">National Health Facilities Demo</span>
        </div>
      </div>
    </div>
  );
};
