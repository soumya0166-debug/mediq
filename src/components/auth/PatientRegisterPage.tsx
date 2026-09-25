import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { SupportedLocale } from '../../locales';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Phone, 
  Lock, 
  Calendar, 
  Mail, 
  Languages, 
  Check, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export const PatientRegisterPage: React.FC = () => {
  const { navigate, loginAsPatient, addAuditEvent } = useApp();
  const { locale, setLocale, t } = useLanguage();

  // Multi-step signup: Step 1 Basic Details, Step 2 Digital Health Identity, Step 3 Consent (Sections 7 & 8)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Basic Details (Section 7 Spec)
  const [fullName, setFullName] = useState('Riya Das');
  const [dob, setDob] = useState('1992-04-12');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [mobileNumber, setMobileNumber] = useState('+91 98765 43210');
  const [email, setEmail] = useState('riya.das.demo@careq-health.org');
  const [preferredLanguage, setPreferredLanguage] = useState<SupportedLocale>(locale);

  // Step 2: Digital Health Identity (Section 7 Spec - Simulated Demo ID)
  const [demoHealthId, setDemoHealthId] = useState('XX-9482-1029-4821');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const generatedPatientId = 'PAT-2026-00124';

  // Step 3: Consent (Section 8 Spec)
  const [consentSymptoms, setConsentSymptoms] = useState(true);
  const [consentReports, setConsentReports] = useState(true);
  const [consentVoice, setConsentVoice] = useState(true);
  const [consentTranslation, setConsentTranslation] = useState(true);

  const handleVerifyDemoIdentity = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsIdentityVerified(true);
      addAuditEvent(
        'Simulated Digital Health Identity Verified',
        fullName,
        'Patient',
        `Assigned synthetic Patient ID: ${generatedPatientId}`
      );
    }, 600);
  };

  const handleCreateAccount = () => {
    addAuditEvent(
      'Patient Account Created',
      fullName,
      'Patient',
      `Registered with verified demo health identity and authorized consent ledger.`
    );
    loginAsPatient(generatedPatientId);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded">
          {t('auth.patientRoleTitle')}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] tracking-tight">
          {t('auth.createPatientAccount')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {t('auth.step3Desc')}
        </p>
      </div>

      {/* Progress Indicator (3 Steps - Sections 7 & 8) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          {[
            { num: '01', title: t('auth.step1Title') },
            { num: '02', title: t('auth.step2Title') },
            { num: '03', title: t('nav.consent') },
          ].map((item, idx) => {
            const stepNum = (idx + 1) as 1 | 2 | 3;
            const isActive = step === stepNum;
            const isDone = step > stepNum;

            return (
              <div
                key={item.num}
                onClick={() => {
                  if (step > stepNum) setStep(stepNum);
                }}
                className={`p-2.5 rounded-lg border transition-all ${
                  isActive
                    ? 'border-[#0A1E3F] bg-blue-50/50 font-bold text-[#0A1E3F]'
                    : isDone
                    ? 'border-emerald-200 bg-emerald-50/50 text-emerald-900 cursor-pointer'
                    : 'border-slate-200 bg-slate-50 text-slate-400'
                }`}
              >
                <div className="font-mono text-[10px] text-slate-400">Step {item.num}</div>
                <div className="font-semibold text-xs mt-0.5">{item.title}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Form Container */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
        
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* STEP 1: Basic Details (Section 7 Spec)                                    */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">
                {t('auth.step1Subtitle')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('auth.brandSummary')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">{t('auth.fullName')}</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Riya Das"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden font-medium"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('auth.dateOfBirth')}</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden font-medium"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('auth.gender')}</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden font-medium"
                >
                  <option value="Female">{t('common.female')}</option>
                  <option value="Male">{t('common.male')}</option>
                  <option value="Other">{t('common.other')}</option>
                </select>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('auth.mobileNumber')}</label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden font-medium"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('auth.emailAddress')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. riya@careq.org"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden font-medium"
                />
              </div>

              {/* Preferred Language */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">{t('auth.preferredLanguage')}</label>
                <div className="flex gap-2">
                  {[
                    { id: 'en-IN', label: 'English' },
                    { id: 'hi-IN', label: 'हिन्दी' },
                    { id: 'or-IN', label: 'ଓଡ଼ିଆ' },
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => {
                        setPreferredLanguage(lang.id as any);
                        setLocale(lang.id as any);
                      }}
                      className={`px-4 py-2 rounded-lg border text-xs font-semibold transition-all ${
                        locale === lang.id
                          ? 'bg-[#0A1E3F] text-white border-[#0A1E3F]'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                {t('common.back')}
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-[#0A1E3F] hover:bg-[#07152c] text-white rounded-lg font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>{t('auth.verifyIdentityBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: Digital Health Identity (Section 7 Spec)                          */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                {t('common.demoVerification')}
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                {t('auth.step2Title')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('auth.step2Desc')}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t('auth.demoHealthIdLabel')}
                </label>
                <input
                  type="text"
                  value={demoHealthId}
                  onChange={(e) => setDemoHealthId(e.target.value)}
                  placeholder="e.g. XX-XXXX-XXXX-XXXX"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono text-sm focus:ring-1 focus:ring-slate-400 outline-hidden font-bold"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Format: XX-XXXX-XXXX-XXXX ({t('common.syntheticDataNotice')})
                </span>
              </div>

              {!isIdentityVerified ? (
                <button
                  type="button"
                  onClick={handleVerifyDemoIdentity}
                  disabled={isVerifying}
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold text-xs shadow-xs transition-all flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isVerifying ? t('common.loading') : t('auth.verifyIdentityBtn')}</span>
                </button>
              ) : (
                /* Verification Success State (Section 7 Spec) */
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block animate-pulse" />
                    <span>{t('auth.identityVerifiedBadge')}</span>
                  </div>
                  <div className="text-xs text-emerald-950 font-mono font-bold">
                    {t('patient.patientIdLabel')}: {generatedPatientId}
                  </div>
                  <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200 mt-1">
                    {t('common.demoVerification')}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                ← {t('common.back')}
              </button>

              <button
                type="button"
                disabled={!isIdentityVerified}
                onClick={() => setStep(3)}
                className={`px-6 py-2.5 rounded-lg font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 ${
                  isIdentityVerified
                    ? 'bg-[#0A1E3F] hover:bg-[#07152c] text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{t('common.next')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: Consent During Signup (Section 8 Spec)                            */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">
                {t('auth.step3Title')}
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {t('auth.step3Desc')}
              </p>
            </div>

            {/* Checkbox Category Permissions (Section 8 Spec) */}
            <div className="space-y-3 text-xs">
              <div 
                onClick={() => setConsentSymptoms(!consentSymptoms)}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-slate-900">{t('consent.symptomsTitle')}</div>
                  <p className="text-slate-500 text-[11px]">{t('consent.symptomsDesc')}</p>
                </div>
                <input
                  type="checkbox"
                  checked={consentSymptoms}
                  onChange={() => {}}
                  className="w-4 h-4 text-[#0A1E3F] rounded"
                />
              </div>

              <div 
                onClick={() => setConsentReports(!consentReports)}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-slate-900">{t('consent.reportsTitle')}</div>
                  <p className="text-slate-500 text-[11px]">{t('consent.reportsDesc')}</p>
                </div>
                <input
                  type="checkbox"
                  checked={consentReports}
                  onChange={() => {}}
                  className="w-4 h-4 text-[#0A1E3F] rounded"
                />
              </div>

              <div 
                onClick={() => setConsentVoice(!consentVoice)}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-slate-900">{t('consent.voiceTitle')}</div>
                  <p className="text-slate-500 text-[11px]">{t('consent.voiceDesc')}</p>
                </div>
                <input
                  type="checkbox"
                  checked={consentVoice}
                  onChange={() => {}}
                  className="w-4 h-4 text-[#0A1E3F] rounded"
                />
              </div>

              <div 
                onClick={() => setConsentTranslation(!consentTranslation)}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-slate-900">{t('consent.translationTitle')}</div>
                  <p className="text-slate-500 text-[11px]">{t('consent.translationDesc')}</p>
                </div>
                <input
                  type="checkbox"
                  checked={consentTranslation}
                  onChange={() => {}}
                  className="w-4 h-4 text-[#0A1E3F] rounded"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                ← {t('common.back')}
              </button>

              <button
                type="button"
                onClick={handleCreateAccount}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{t('auth.createAccountBtn')}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
