import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export const SafetyBanner: React.FC = () => {
  return (
    <div className="bg-[#0A1E3F] text-slate-100 text-xs py-2 px-4 border-b border-[#163B66]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide uppercase flex items-center gap-1 shadow-2xs">
            <ShieldAlert className="w-3 h-3 text-slate-950" />
            Educational Prototype
          </span>
          <span className="text-slate-200 text-[11px] sm:text-xs">
            <strong>Triage Support Only</strong> — Not for diagnosis or treatment. All information must be reviewed by an authorized healthcare professional.
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-300 text-[11px]">
          <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded text-white font-medium">
            <Info className="w-3 h-3 text-teal-300" />
            100% Synthetic Patient Data
          </span>
        </div>
      </div>
    </div>
  );
};
