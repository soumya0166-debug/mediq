import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { SupportedLocale } from '../../locales';

interface LanguageSelectorProps {
  variant?: 'header' | 'compact' | 'drawer' | 'settings';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'header', 
  className = '' 
}) => {
  const { locale, setLocale, locales, currentLocaleMetadata } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (newLocale: SupportedLocale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  if (variant === 'settings') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {locales.map((loc) => {
            const isSelected = locale === loc.id;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleSelect(loc.id)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-teal-50 border-teal-600 text-teal-950 font-bold shadow-2xs ring-1 ring-teal-600/30'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold">{loc.nativeName}</div>
                  <div className="text-[11px] text-slate-500 font-normal">{loc.name}</div>
                </div>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Selector Trigger Button (Section 3 & 40) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={currentLocaleMetadata.ariaLabel}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-teal-600/40 ${
          isOpen
            ? 'bg-slate-100 border-slate-400 text-slate-900 ring-1 ring-slate-400/40'
            : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
        } ${variant === 'compact' ? 'px-2 py-1 text-[11px]' : ''}`}
      >
        <Globe className="w-3.5 h-3.5 text-teal-700 flex-shrink-0" />
        <span className="font-bold tracking-tight">{currentLocaleMetadata.nativeName}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-slate-700' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Language selection"
          className="absolute right-0 z-50 mt-1.5 w-48 origin-top-right rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1 flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-teal-700" />
            <span>Language • ଭାଷା</span>
          </div>

          {locales.map((loc) => {
            const isSelected = locale === loc.id;
            return (
              <button
                key={loc.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(loc.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                  isSelected
                    ? 'bg-teal-50 text-teal-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-100/80 font-medium'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{loc.nativeName}</span>
                  {loc.name !== loc.nativeName && (
                    <span className="text-[10px] text-slate-400 font-normal">({loc.name})</span>
                  )}
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-teal-700 stroke-[2.5]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
