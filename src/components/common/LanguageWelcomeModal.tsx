import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe, ArrowRight, Check, Sparkles } from 'lucide-react';
import { SupportedLocale } from '../../locales';

export const LanguageWelcomeModal: React.FC = () => {
  const { 
    isFirstVisitPromptOpen, 
    dismissFirstVisitPrompt, 
    locale, 
    setLocale, 
    locales 
  } = useLanguage();

  if (!isFirstVisitPromptOpen) return null;

  const handleSelectLanguage = (newLocale: SupportedLocale) => {
    setLocale(newLocale);
    dismissFirstVisitPrompt();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-2xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
        
        {/* Header Icon & Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 mx-auto shadow-xs">
            <Globe className="w-6 h-6 text-teal-700" />
          </div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
            CAREQ • National Digital Health Triage
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A1E3F] tracking-tight">
            Choose your language
          </h2>
          <div className="text-xs text-slate-500 space-y-0.5 pt-1">
            <p className="font-medium text-slate-700">You can change your language anytime.</p>
            <p className="font-medium text-slate-600">आप अपनी भाषा कभी भी बदल सकते हैं।</p>
            <p className="font-medium text-slate-600">ଆପଣ ଯେକୌଣସି ସମୟରେ ନିଜ ଭାଷା ପରିବର୍ତ୍ତନ କରିପାରିବେ।</p>
          </div>
        </div>

        {/* 3 Language Option Cards (Section 5) */}
        <div className="space-y-2.5">
          {locales.map((loc) => {
            const isCurrent = locale === loc.id;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleSelectLanguage(loc.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group ${
                  isCurrent
                    ? 'bg-teal-50/80 border-teal-600 ring-2 ring-teal-600/30'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="text-base font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                    {loc.nativeName}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {loc.name} {loc.id === 'or-IN' ? '• ଓଡ଼ିଶା ରାଜ୍ୟ ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ' : loc.id === 'hi-IN' ? '• राष्ट्रीय डिजिटल स्वास्थ्य' : '• Standard Clinical English'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isCurrent ? (
                    <span className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs shadow-xs">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Supporting note & Dismiss */}
        <div className="pt-2 text-center border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            Instant live adaptation
          </span>

          <button
            type="button"
            onClick={dismissFirstVisitPrompt}
            className="font-bold text-teal-800 hover:text-teal-950 hover:underline px-2 py-1"
          >
            Continue with {locales.find(l => l.id === locale)?.nativeName} →
          </button>
        </div>

      </div>
    </div>
  );
};
