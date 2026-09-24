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
            {t('consent.title')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('consent.subtitle')}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-careq-lg p-6 sm:p-8 border border-slate-200 shadow-careq-xs space-y-6 text-xs">
        
        {/* Persistent Privacy Message (Section 22 & 51) */}
        <div className="p-3.5 rounded-careq-md bg-teal-50/70 border border-teal-200 text-teal-950 flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-teal-700 flex-shrink-0" />
          <span>
            <strong>{t('consent.rightsNotice')}</strong>
          </span>
        </div>

        {/* Section 38: Who, What, Why, When */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-careq-md border border-slate-200 bg-slate-50 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Who has access
            </span>
            <p className="font-bold text-slate-900">
              Accredited Clinical Staff at CAREQ Demo PHC Jatni
            </p>
            <p className="text-slate-500 text-[11px]">Facility ID: FAC-DEMO-OD-001</p>
          </div>

          <div className="p-3.5 rounded-careq-md border border-slate-200 bg-slate-50 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Why they have access
            </span>
            <p className="font-bold text-slate-900">
              Pre-clinical triage review, priority sorting, and referral dispatch
            </p>
            <p className="text-slate-500 text-[11px]">Legitimate Public Health Purpose</p>
          </div>

          <div className="p-3.5 rounded-careq-md border border-slate-200 bg-slate-50 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              When access expires
            </span>
            <p className="font-bold text-slate-900">
              24-hour review window post-submission
            </p>
            <p className="text-slate-500 text-[11px]">Session auto-closes upon review completion</p>
          </div>

          <div className="p-3.5 rounded-careq-md border border-slate-200 bg-slate-50 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Access Governance
            </span>
            <p className="font-bold text-slate-900">
              End-to-End Cryptographic Audit Trail
            </p>
            <p className="text-slate-500 text-[11px]">Every clinician view logged with SHA-256 hash</p>
          </div>
        </div>

        {/* What they can access: Category Toggles */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            {t('consent.categories')}:
          </h3>

          <div className="space-y-2">
            <label className="flex items-center justify-between p-3.5 rounded-careq-md border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">{t('consent.symptomsCat')}</span>
                <span className="text-[11px] text-slate-500">Subjective descriptions of onset, fever duration, and discomfort</span>
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
                <span className="font-bold text-slate-900 block">{t('consent.reportsCat')}</span>
                <span className="text-[11px] text-slate-500">OCR parsed blood tests (CBC, Glucose) and X-ray summaries</span>
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
                <span className="font-bold text-slate-900 block">{t('consent.voiceCat')}</span>
                <span className="text-[11px] text-slate-500">Regional language audio stream converted into clinical transcript</span>
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
                <span className="font-bold text-slate-900 block">{t('consent.translationCat')}</span>
                <span className="text-[11px] text-slate-500">Standard English clinical translation for medical officer review</span>
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
                <span className="font-bold text-slate-900 block">{t('consent.historyCat')}</span>
                <span className="text-[11px] text-slate-500">Share previous historical assessments from prior clinic sessions</span>
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
            {t('consent.revokeAccess')}
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#0A1E3F] hover:bg-[#163B66] text-white font-bold rounded-careq-sm transition-colors shadow-careq-xs flex items-center gap-1.5"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{t('common.success')}</span>
              </>
            ) : (
              <span>{t('common.save')}</span>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
