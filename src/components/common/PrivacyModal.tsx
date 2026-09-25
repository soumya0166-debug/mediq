import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, ShieldCheck, Lock, Users, Clock, AlertCircle, Check } from 'lucide-react';

export const PrivacyModal: React.FC = () => {
  const { isPrivacyModalOpen, setPrivacyModalOpen, currentPatient, updatePatientConsent } = useApp();
  const { t } = useLanguage();

  const [categories, setCategories] = useState(
    currentPatient?.consentCategories || {
      symptoms: true,
      reports: true,
      voiceTranscript: true,
      translation: true,
      previousAssessments: false,
    }
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isPrivacyModalOpen) return null;

  const handleToggle = (key: keyof typeof categories) => {
    setCategories(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    updatePatientConsent(categories);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setPrivacyModalOpen(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-careq-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-careq-md border border-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-careq-sm bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">{t('consent.pageTitle')}</h3>
              <p className="text-xs text-slate-500">{t('consent.pageSubtitle')}</p>
            </div>
          </div>
          <button 
            onClick={() => setPrivacyModalOpen(false)}
            className="p-1.5 rounded-careq-sm text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content (Section 38 & 51) */}
        <div className="p-6 space-y-6 text-slate-700 text-sm">
          
          {/* Privacy statement banner */}
          <div className="p-3.5 rounded-careq-md bg-teal-50/70 border border-teal-200 text-teal-900 text-xs flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-teal-700 flex-shrink-0" />
            <span>{t('consent.privacyNotice')}</span>
          </div>

          {/* Section 38: Who, What, Why, When */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-careq-md border border-slate-200 bg-slate-50">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {t('consent.whoHasAccess')}
              </div>
              <p className="font-semibold text-slate-800">
                {t('consent.whoHasAccessDesc')}
              </p>
            </div>

            <div className="p-3 rounded-careq-md border border-slate-200 bg-slate-50">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {t('consent.whyAccess')}
              </div>
              <p className="font-semibold text-slate-800">
                {t('consent.whyAccessDesc')}
              </p>
            </div>

            <div className="p-3 rounded-careq-md border border-slate-200 bg-slate-50">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {t('consent.whenExpires')}
              </div>
              <p className="font-semibold text-slate-800">
                {t('consent.whenExpiresDesc')}
              </p>
            </div>

            <div className="p-3 rounded-careq-md border border-slate-200 bg-slate-50">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {t('consent.accessGovernance')}
              </div>
              <p className="font-semibold text-slate-800">
                {t('consent.accessGovernanceDesc')}
              </p>
            </div>
          </div>

          {/* What they can access - Granular Category Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                {t('consent.authorizeCategories')}
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-3 rounded-careq-md border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">{t('consent.symptomsTitle')}</span>
                  <span className="text-[11px] text-slate-500">{t('consent.symptomsDesc')}</span>
                </div>
                <input
                  type="checkbox"
                  checked={categories.symptoms}
                  onChange={() => handleToggle('symptoms')}
                  className="w-4 h-4 text-teal-700 rounded border-slate-300 focus:ring-teal-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-careq-md border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">{t('consent.reportsTitle')}</span>
                  <span className="text-[11px] text-slate-500">{t('consent.reportsDesc')}</span>
                </div>
                <input
                  type="checkbox"
                  checked={categories.reports}
                  onChange={() => handleToggle('reports')}
                  className="w-4 h-4 text-teal-700 rounded border-slate-300 focus:ring-teal-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-careq-md border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">{t('consent.voiceTitle')}</span>
                  <span className="text-[11px] text-slate-500">{t('consent.voiceDesc')}</span>
                </div>
                <input
                  type="checkbox"
                  checked={categories.voiceTranscript}
                  onChange={() => handleToggle('voiceTranscript')}
                  className="w-4 h-4 text-teal-700 rounded border-slate-300 focus:ring-teal-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-careq-md border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">{t('consent.translationTitle')}</span>
                  <span className="text-[11px] text-slate-500">{t('consent.translationDesc')}</span>
                </div>
                <input
                  type="checkbox"
                  checked={categories.translation}
                  onChange={() => handleToggle('translation')}
                  className="w-4 h-4 text-teal-700 rounded border-slate-300 focus:ring-teal-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-careq-md border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">{t('consent.previousAssessmentsTitle')}</span>
                  <span className="text-[11px] text-slate-500">{t('consent.previousAssessmentsDesc')}</span>
                </div>
                <input
                  type="checkbox"
                  checked={categories.previousAssessments}
                  onChange={() => handleToggle('previousAssessments')}
                  className="w-4 h-4 text-teal-700 rounded border-slate-300 focus:ring-teal-600"
                />
              </label>
            </div>
          </div>

          {/* Demonstration Notice */}
          <div className="bg-slate-100 rounded-careq-sm p-3 text-xs text-slate-500 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong>{t('common.syntheticDataNotice')}:</strong> {t('auth.step2Desc')}
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              setCategories({
                symptoms: false,
                reports: false,
                voiceTranscript: false,
                translation: false,
                previousAssessments: false,
              });
            }}
            className="text-xs text-red-600 font-bold hover:underline"
          >
            {t('consent.revokeAllAccessBtn')}
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setPrivacyModalOpen(false)}
              className="px-4 py-2 rounded-careq-sm border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-careq-sm bg-[#0A1E3F] hover:bg-[#163B66] text-white text-xs font-bold transition-colors shadow-careq-xs flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{t('consent.savedToLedger')}</span>
                </>
              ) : (
                <span>{t('consent.savePreferencesBtn')}</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
