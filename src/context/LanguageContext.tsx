import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SupportedLocale, SUPPORTED_LOCALES, TRANSLATIONS, LocaleMetadata } from '../locales';

interface LanguageContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  patientCommLocale: SupportedLocale;
  setPatientCommLocale: (locale: SupportedLocale) => void;
  t: (path: string, paramsOrFallback?: Record<string, any> | string, fallback?: string) => string;
  locales: LocaleMetadata[];
  currentLocaleMetadata: LocaleMetadata;
  isFirstVisitPromptOpen: boolean;
  setFirstVisitPromptOpen: (open: boolean) => void;
  dismissFirstVisitPrompt: () => void;
  formatNumber: (n: number) => string;
  formatDate: (d: Date | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    const saved = localStorage.getItem('careq_locale');
    if (saved && ['en-IN', 'hi-IN', 'or-IN', 'bn-IN', 'te-IN'].includes(saved)) {
      return saved as SupportedLocale;
    }
    return 'en-IN';
  });

  const [patientCommLocale, setPatientCommLocaleState] = useState<SupportedLocale>(() => {
    const saved = localStorage.getItem('careq_patient_comm_locale');
    if (saved && ['en-IN', 'hi-IN', 'or-IN', 'bn-IN', 'te-IN'].includes(saved)) {
      return saved as SupportedLocale;
    }
    return 'or-IN';
  });

  const [isFirstVisitPromptOpen, setFirstVisitPromptOpen] = useState<boolean>(() => {
    const hasVisited = localStorage.getItem('careq_has_chosen_language');
    return !hasVisited;
  });

  const setLocale = useCallback((newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem('careq_locale', newLocale);
    localStorage.setItem('careq_has_chosen_language', 'true');
    
    // Update HTML attributes for accessibility and screen readers
    const htmlLang = newLocale === 'hi-IN' ? 'hi' : newLocale === 'or-IN' ? 'or' : newLocale === 'bn-IN' ? 'bn' : newLocale === 'te-IN' ? 'te' : 'en';
    document.documentElement.lang = htmlLang;
    document.documentElement.dir = 'ltr';
  }, []);

  const setPatientCommLocale = useCallback((newLocale: SupportedLocale) => {
    setPatientCommLocaleState(newLocale);
    localStorage.setItem('careq_patient_comm_locale', newLocale);
  }, []);

  const dismissFirstVisitPrompt = useCallback(() => {
    localStorage.setItem('careq_has_chosen_language', 'true');
    setFirstVisitPromptOpen(false);
  }, []);

  useEffect(() => {
    const htmlLang = locale === 'hi-IN' ? 'hi' : locale === 'or-IN' ? 'or' : 'en';
    document.documentElement.lang = htmlLang;
    document.documentElement.dir = 'ltr';
  }, [locale]);

  /**
   * Safe path-based translation lookup with variable interpolation and English fallback
   */
  const t = useCallback((path: string, paramsOrFallback?: Record<string, any> | string, fallback?: string): string => {
    const keys = path.split('.');
    const params = typeof paramsOrFallback === 'object' && paramsOrFallback !== null ? paramsOrFallback : undefined;
    const defaultFallback = typeof paramsOrFallback === 'string' ? paramsOrFallback : fallback;

    let resultString: string | undefined;

    // 1. Attempt lookup in active locale
    let current: any = TRANSLATIONS[locale];
    let foundInLocale = true;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        foundInLocale = false;
        break;
      }
    }

    if (foundInLocale && typeof current === 'string') {
      resultString = current;
    } else {
      // 2. Fallback hierarchy: en-IN -> defaultFallback -> path
      let fallbackCurrent: any = TRANSLATIONS['en-IN'];
      let foundInFallback = true;
      for (const key of keys) {
        if (fallbackCurrent && typeof fallbackCurrent === 'object' && key in fallbackCurrent) {
          fallbackCurrent = fallbackCurrent[key];
        } else {
          foundInFallback = false;
          break;
        }
      }

      if (foundInFallback && typeof fallbackCurrent === 'string') {
        resultString = fallbackCurrent;
      } else {
        resultString = defaultFallback || path;
      }
    }

    // 3. Interpolate dynamic parameters like {{name}} or {name}
    if (params && typeof resultString === 'string') {
      for (const [pKey, pVal] of Object.entries(params)) {
        resultString = resultString
          .replace(new RegExp(`\\{\\{${pKey}\\}\\}`, 'g'), String(pVal))
          .replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
      }
    }

    return resultString;
  }, [locale]);

  const currentLocaleMetadata = SUPPORTED_LOCALES.find(l => l.id === locale) || SUPPORTED_LOCALES[0];

  const formatNumber = useCallback((n: number): string => {
    return n.toLocaleString(locale);
  }, [locale]);

  const formatDate = useCallback((d: Date | string): string => {
    const dateObj = typeof d === 'string' ? new Date(d) : d;
    if (isNaN(dateObj.getTime())) return String(d);
    
    return dateObj.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }, [locale]);

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        patientCommLocale,
        setPatientCommLocale,
        t,
        locales: SUPPORTED_LOCALES,
        currentLocaleMetadata,
        isFirstVisitPromptOpen,
        setFirstVisitPromptOpen,
        dismissFirstVisitPrompt,
        formatNumber,
        formatDate
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
