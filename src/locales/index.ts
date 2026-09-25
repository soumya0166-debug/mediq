import { enTranslations } from './en';
import { hiTranslations } from './hi';
import { orTranslations } from './or';
import { bnTranslations } from './bn';
import { teTranslations } from './te';

export type SupportedLocale = 'en-IN' | 'hi-IN' | 'or-IN' | 'bn-IN' | 'te-IN';

export interface LocaleMetadata {
  id: SupportedLocale;
  code: string;
  name: string;
  nativeName: string;
  flagCode: string;
  dir: 'ltr';
  ariaLabel: string;
}

export const SUPPORTED_LOCALES: LocaleMetadata[] = [
  {
    id: 'en-IN',
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flagCode: 'EN',
    dir: 'ltr',
    ariaLabel: 'Switch language to English'
  },
  {
    id: 'hi-IN',
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flagCode: 'HI',
    dir: 'ltr',
    ariaLabel: 'भाषा बदलकर हिन्दी करें'
  },
  {
    id: 'or-IN',
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    flagCode: 'OR',
    dir: 'ltr',
    ariaLabel: 'ଭାଷା ବଦଳାଇ ଓଡ଼ିଆ କରନ୍ତୁ'
  },
  {
    id: 'bn-IN',
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flagCode: 'BN',
    dir: 'ltr',
    ariaLabel: 'ভাষা পরিবর্তন করে বাংলা করুন'
  },
  {
    id: 'te-IN',
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flagCode: 'TE',
    dir: 'ltr',
    ariaLabel: 'భాషను తెలుగులోకి మార్చండి'
  }
];

export const TRANSLATIONS: Record<SupportedLocale, typeof enTranslations> = {
  'en-IN': enTranslations,
  'hi-IN': hiTranslations as unknown as typeof enTranslations,
  'or-IN': orTranslations as unknown as typeof enTranslations,
  'bn-IN': bnTranslations as unknown as typeof enTranslations,
  'te-IN': teTranslations as unknown as typeof enTranslations
};

/**
 * Diagnostic utility (Section 25): Verifies 100% key parity across all locales
 */
export function validateTranslationCompleteness(): {
  isValid: boolean;
  missingInHindi: string[];
  missingInOdia: string[];
  missingInBengali: string[];
  missingInTelugu: string[];
} {
  const missingInHindi: string[] = [];
  const missingInOdia: string[] = [];
  const missingInBengali: string[] = [];
  const missingInTelugu: string[] = [];

  function compareKeys(sourceObj: Record<string, any>, targetObj: Record<string, any>, prefix: string, targetName: 'hi' | 'or' | 'bn' | 'te') {
    for (const key of Object.keys(sourceObj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (!(key in targetObj)) {
        if (targetName === 'hi') missingInHindi.push(fullKey);
        else if (targetName === 'or') missingInOdia.push(fullKey);
        else if (targetName === 'bn') missingInBengali.push(fullKey);
        else if (targetName === 'te') missingInTelugu.push(fullKey);
      } else if (typeof sourceObj[key] === 'object' && sourceObj[key] !== null) {
        compareKeys(sourceObj[key], targetObj[key], fullKey, targetName);
      }
    }
  }

  compareKeys(enTranslations, hiTranslations, '', 'hi');
  compareKeys(enTranslations, orTranslations, '', 'or');
  compareKeys(enTranslations, bnTranslations, '', 'bn');
  compareKeys(enTranslations, teTranslations, '', 'te');

  return {
    isValid: missingInHindi.length === 0 && missingInOdia.length === 0 && missingInBengali.length === 0 && missingInTelugu.length === 0,
    missingInHindi,
    missingInOdia,
    missingInBengali,
    missingInTelugu
  };
}

// Development assertion log
if (typeof window !== 'undefined' && (import.meta as any).env?.DEV) {
  const validation = validateTranslationCompleteness();
  if (validation.isValid) {
    console.log('[CAREQ i18n] ✓ Translation completeness verified: 0 missing keys across English, Hindi, and Odia.');
  } else {
    console.warn('[CAREQ i18n] Missing keys detected:', validation);
  }
}
