import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Lock, 
  ShieldCheck, 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  Building2, 
  Clock 
} from 'lucide-react';

export const PatientConsentPage: React.FC = () => {
  const { currentPatient, updatePatientConsent, navigate } = useApp();
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

  const handleToggle = (key: keyof typeof categories) => {
    setCategories(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    updatePatientConsent(categories);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/patient/dashboard')}
          className="p-1.5 rounded-careq-sm border border-slate-200 text-slate-500 hover:text-slate-900 bg-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
            Patient Data Rights
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0A1E3F] tracking-tight mt-0.5">
            {t('consent.pageTitle')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('consent.pageSubtitle')}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-careq-lg p-6 sm:p-8 border border-slate-200 shadow-careq-xs space-y-6 text-xs">
        
        {/* Persistent Privacy Message (Section 22 & 51) */}
        <div className="p-3.5 rounded-careq-md bg-teal-50/70 border border-teal-200 text-teal-950 flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-teal-700 flex-shrink-0" />
          <span>
            <strong>{t('consent.privacyNotice')}</strong>
          </span>
        </div>

        {/* Section 38: Who, What, Why, When */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-careq-md border border-slate-200 bg-slate-50 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {t('consent.whoHasAccess')}
            </span>
            <p className="font-bold text-slate-900">
              {t('consent.whoHasAccessDesc')}
            </p>
            <p className="text-slate-500 text-[11px]">Facility ID: FAC-DEMO-OD-001</p>
          </div>

          <div className="p-3.5 rounded-careq-md border border-slate-200 bg-slate-50 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {t('consent.whyAccess')}
            </span>
            <p className="font-bold text-slate-900">
              {t('consent.whyAccessDesc')}
            </p>
            <p className="text-slate-500 text-[11px]">Legitimate Public Health Purpose</p>
          </div>

          <div className="p-3.5 rounded-careq-md border border-slate-200 bg-slate-50 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {t('consent.whenExpires')}
            </span>
            <p className="font-bold text-slate-900">
              {t('consent.whenExpiresDesc')}
            </p>
            <p className="text-slate-500 text-[11px]">Session auto-closes upon review completion</p>
          </div>

          <div className="p-3.5 rounded-careq-md border border-slate-200 bg-slate-50 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {t('consent.accessGovernance')}
            </span>
            <p className="font-bold text-slate-900">
              {t('consent.accessGovernanceDesc')}
            </p>
            <p className="text-slate-500 text-[11px]">Every clinician view logged with SHA-256 hash</p>
          </div>
        </div>

        {/* What they can access: Category Toggles */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            {t('consent.authorizeCategories')}
          </h3>

          <div className="space-y-2">
            <label className="flex items-center justify-between p-3.5 rounded-careq-md border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">{t('consent.symptomsTitle')}</span>
                <span className="text-[11px] text-slate-500">{t('consent.symptomsDesc')}</span>
              </div>
              <input
                type="checkbox"
                checked={categories.symptoms}
                onChange={() => handleToggle('symptoms')}
                className="w-4 h-4 text-teal-700 rounded border-slate-300"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-careq-md border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">{t('consent.reportsTitle')}</span>
                <span className="text-[11px] text-slate-500">{t('consent.reportsDesc')}</span>
              </div>
              <input
                type="checkbox"
                checked={categories.reports}
                onChange={() => handleToggle('reports')}
                className="w-4 h-4 text-teal-700 rounded border-slate-300"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-careq-md border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">{t('consent.voiceTitle')}</span>
                <span className="text-[11px] text-slate-500">{t('consent.voiceDesc')}</span>
              </div>
              <input
                type="checkbox"
                checked={categories.voiceTranscript}
                onChange={() => handleToggle('voiceTranscript')}
                className="w-4 h-4 text-teal-700 rounded border-slate-300"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-careq-md border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">{t('consent.translationTitle')}</span>
                <span className="text-[11px] text-slate-500">{t('consent.translationDesc')}</span>
              </div>
              <input
                type="checkbox"
                checked={categories.translation}
                onChange={() => handleToggle('translation')}
                className="w-4 h-4 text-teal-700 rounded border-slate-300"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-careq-md border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">{t('consent.previousAssessmentsTitle')}</span>
                <span className="text-[11px] text-slate-500">{t('consent.previousAssessmentsDesc')}</span>
              </div>
              <input
                type="checkbox"
                checked={categories.previousAssessments}
                onChange={() => handleToggle('previousAssessments')}
                className="w-4 h-4 text-teal-700 rounded border-slate-300"
              />
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
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

          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#0A1E3F] hover:bg-[#163B66] text-white font-bold rounded-careq-sm transition-colors shadow-careq-xs flex items-center gap-1.5"
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
  );
};
