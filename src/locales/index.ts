import { enTranslations } from './en';
import { hiTranslations } from './hi';
import { orTranslations } from './or';

export type SupportedLocale = 'en-IN' | 'hi-IN' | 'or-IN';

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
  }
];

export const TRANSLATIONS: Record<SupportedLocale, typeof enTranslations> = {
  'en-IN': enTranslations,
  'hi-IN': hiTranslations as unknown as typeof enTranslations,
  'or-IN': orTranslations as unknown as typeof enTranslations
};

/**
 * Diagnostic utility (Section 25): Verifies 100% key parity across all locales
 */
export function validateTranslationCompleteness(): {
  isValid: boolean;
  missingInHindi: string[];
  missingInOdia: string[];
} {
  const missingInHindi: string[] = [];
  const missingInOdia: string[] = [];

  function compareKeys(sourceObj: Record<string, any>, targetObj: Record<string, any>, prefix: string, targetName: 'hi' | 'or') {
    for (const key of Object.keys(sourceObj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (!(key in targetObj)) {
        if (targetName === 'hi') missingInHindi.push(fullKey);
        else missingInOdia.push(fullKey);
      } else if (typeof sourceObj[key] === 'object' && sourceObj[key] !== null) {
        compareKeys(sourceObj[key], targetObj[key], fullKey, targetName);
      }
    }
  }

  compareKeys(enTranslations, hiTranslations, '', 'hi');
  compareKeys(enTranslations, orTranslations, '', 'or');

  return {
    isValid: missingInHindi.length === 0 && missingInOdia.length === 0,
    missingInHindi,
    missingInOdia
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
