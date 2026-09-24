import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const SafetyBanner: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-[#0A1E3F] text-slate-100 text-xs py-2 px-4 border-b border-[#163B66]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide uppercase flex items-center gap-1 shadow-2xs">
            <ShieldAlert className="w-3 h-3 text-slate-950" />
            <span>Prototype</span>
          </span>
          <span className="text-slate-200 text-[11px] sm:text-xs">
            {t('common.educationalDisclaimer')}
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-300 text-[11px] flex-shrink-0">
          <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded text-white font-medium">
            <Info className="w-3 h-3 text-teal-300" />
            <span>{t('common.syntheticDataNotice')}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
