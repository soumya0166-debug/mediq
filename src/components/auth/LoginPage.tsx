import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';
import { MOCK_PATIENTS, MOCK_DOCTORS } from '../../data/mockData';
import { 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  ArrowRight, 
  Stethoscope, 
  User, 
  Phone, 
  Building2, 
  AlertCircle, 
  Activity, 
  CheckCircle2, 
  ArrowLeft,
  KeyRound,
  Mail,
  Sparkles,
  ClipboardList
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { navigate, loginAsPatient, loginAsDoctor } = useApp();
  const { t } = useLanguage();

  // Mode: initial role choice vs specific sign-in form (Sections 5, 6, 14)
  const [viewState, setViewState] = useState<'CHOICE' | 'PATIENT_SIGNIN' | 'DOCTOR_SIGNIN'>('CHOICE');

  // Form states
  const [patientIdentifier, setPatientIdentifier] = useState('9876543210');
  const [patientPassword, setPatientPassword] = useState('••••••••');
  const [selectedDemoPatient, setSelectedDemoPatient] = useState(MOCK_PATIENTS[0].id);

  const [doctorIdentifier, setDoctorIdentifier] = useState('dr.ananya.sharma@careq-health.gov.in');
  const [doctorPassword, setDoctorPassword] = useState('••••••••');
  const [selectedDemoDoctor, setSelectedDemoDoctor] = useState(MOCK_DOCTORS[0].id);

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsPatient(selectedDemoPatient);
  };

  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsDoctor(selectedDemoDoctor);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-[#F8FAFC]">
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* ========================================================================= */}
        {/* LEFT PANEL — BRAND EXPERIENCE (Section 4 Spec: 55% width)                 */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 bg-[#F4F7FB] border-b lg:border-b-0 lg:border-r border-slate-200 p-8 sm:p-12 lg:p-14 flex flex-col justify-between space-y-8">
          
          <div className="space-y-8">
            
            {/* Header Identity */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#0A1E3F] text-white flex items-center justify-center shadow-xs">
                  <Activity className="w-5 h-5 text-teal-400 stroke-[2.4]" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1E3F] font-sans">
                  CAREQ
                </h1>
              </div>

              <div className="space-y-1 pt-2">
                <h2 className="text-xl sm:text-2xl font-bold text-[#0A1E3F] tracking-tight leading-snug">
                  {t('common.tagline')}
                </h2>
                <h2 className="text-xl sm:text-2xl font-bold text-teal-700 tracking-tight leading-snug">
                  {t('common.taglineSubtitle')}
                </h2>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed max-w-lg pt-1">
                {t('auth.brandSummary')}
              </p>
            </div>

            {/* Three Trust Indicators (Section 4 Spec) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-1 shadow-2xs">
                <div className="text-emerald-700 flex items-center gap-1.5 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{t('auth.trustVerified')}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Simulated digital identity validation for patients and professionals.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-1 shadow-2xs">
                <div className="text-teal-800 flex items-center gap-1.5 font-bold text-xs">
                  <Lock className="w-4 h-4 text-teal-600" />
                  <span>{t('auth.trustConsent')}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Patients decide which categories of health data to share with reviewers.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-1 shadow-2xs">
                <div className="text-blue-900 flex items-center gap-1.5 font-bold text-xs">
                  <UserCheck className="w-4 h-4 text-blue-700" />
                  <span>{t('auth.trustHuman')}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Assists qualified clinicians. Never replaces medical judgment.
                </p>
              </div>
            </div>

            {/* Subtle Abstract Healthcare Data Visualization (Section 4 Spec) */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-2xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Connected Information Flow (Abstract)
              </div>
              
              <div className="flex flex-col items-center space-y-2 text-xs">
                {/* Level 1: Patient Information */}
                <div className="w-full max-w-sm py-2 px-3 rounded-md bg-slate-50 border border-slate-200 text-center font-semibold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    <span>{t('auth.patientRoleTitle')}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Symptoms • Voice • OCR</span>
                </div>

                <div className="text-slate-400 text-xs font-mono">↓</div>

                {/* Level 2: CAREQ Engine */}
                <div className="w-full max-w-sm py-2 px-3 rounded-md bg-[#0A1E3F] text-white text-center font-bold flex items-center justify-between shadow-2xs">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-teal-400" />
                    <span>CAREQ Triage Support</span>
                  </span>
                  <span className="text-[10px] text-teal-300 font-mono">Synthesizes & Prioritizes</span>
                </div>

                <div className="text-slate-400 text-xs font-mono">↓</div>

                {/* Level 3: Healthcare Professional */}
                <div className="w-full max-w-sm py-2 px-3 rounded-md bg-emerald-50 border border-emerald-200 text-center font-semibold text-emerald-950 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t('auth.clinicalRoleTitle')}</span>
                  </span>
                  <span className="text-[10px] text-emerald-800 font-mono">Clinical Review & Care</span>
                </div>
              </div>
            </div>

          </div>

          {/* Educational Prototype Footnote */}
          <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>
              <strong>{t('common.educationalPrototype')}:</strong> {t('common.prototypeNotice')}
            </span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL — AUTHENTICATION CARD (Section 5, 6, 14 Spec: 45% width)      */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-center bg-white relative">
          {/* Top-right Language Selector for Quick Accessibility (Section 3 Spec) */}
          <div className="absolute top-4 right-4 z-10">
            <LanguageSelector variant="compact" />
          </div>

          <div className="max-w-md w-full mx-auto space-y-6 pt-6 sm:pt-0">
            
            {/* VIEW 1: Role Selection Cards (Section 5 Spec) */}
            {viewState === 'CHOICE' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#0A1E3F] tracking-tight">
                    {t('auth.welcomeTitle')}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {t('auth.welcomeSubtitle')}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* PATIENT CARD (Section 5 Spec) */}
                  <div className="p-5 rounded-lg border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50/50 transition-all space-y-3 shadow-2xs">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 flex-shrink-0">
                        <User className="w-5 h-5 text-teal-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">
                          {t('auth.patientRoleTitle')}
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                          {t('auth.patientRoleDesc')}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setViewState('PATIENT_SIGNIN')}
                      className="w-full py-2.5 bg-[#0A1E3F] hover:bg-[#07152c] text-white rounded-md text-xs font-semibold shadow-2xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>{t('auth.continuePatientBtn')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* CLINICAL / HEALTHCARE WORKER CARD (Section 5 Spec) */}
                  <div className="p-5 rounded-lg border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50/50 transition-all space-y-3 shadow-2xs">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900 flex-shrink-0">
                        <Stethoscope className="w-5 h-5 text-blue-800" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">
                          {t('auth.clinicalRoleTitle')}
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                          {t('auth.clinicalRoleDesc')}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setViewState('DOCTOR_SIGNIN')}
                      className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-xs font-semibold shadow-2xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>{t('auth.continueClinicalBtn')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Quick Register Switch */}
                <div className="pt-2 text-center text-xs text-slate-500">
                  New to CAREQ?{' '}
                  <button
                    onClick={() => navigate('/register/patient')}
                    className="font-bold text-teal-800 hover:underline"
                  >
                    {t('auth.createPatientAccount')}
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 2: Patient Sign In Form (Section 6 Spec) */}
            {viewState === 'PATIENT_SIGNIN' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <button
                  onClick={() => setViewState('CHOICE')}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t('auth.chooseDifferentRole', 'Choose a different role')}</span>
                </button>

                <div>
                  <h2 className="text-2xl font-extrabold text-[#0A1E3F] tracking-tight">
                    {t('auth.patientSignInTitle')}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {t('auth.patientSignInDesc', 'Enter your registered credentials to access your health portal.')}
                  </p>
                </div>

                {/* Demo Evaluator Profile Fast-Select */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-teal-700" />
                      {t('auth.demoFastLogin')}:
                    </span>
                    <span className="text-[10px] text-teal-800 font-mono font-semibold">1-Click Auto-Fill</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {MOCK_PATIENTS.slice(0, 2).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelectedDemoPatient(p.id);
                          setPatientIdentifier(p.phone);
                        }}
                        className={`p-2 rounded text-left border text-xs transition-colors ${
                          selectedDemoPatient === p.id 
                            ? 'bg-white border-[#0A1E3F] font-bold text-[#0A1E3F] shadow-2xs' 
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="truncate">{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{p.preferredLanguage} • {p.age}y</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Patient Sign In Form (Section 6 Fields) */}
                <form onSubmit={handlePatientSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t('auth.mobileOrEmail')}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={patientIdentifier}
                        onChange={(e) => setPatientIdentifier(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full pl-9 p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700">
                        {t('auth.password')}
                      </label>
                      <button
                        type="button"
                        onClick={() => alert('Demo prototype password recovery: Default test password is pre-filled.')}
                        className="text-[11px] text-teal-800 hover:underline"
                      >
                        {t('auth.forgotPassword')}
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        value={patientPassword}
                        onChange={(e) => setPatientPassword(e.target.value)}
                        className="w-full pl-9 p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#0A1E3F] hover:bg-[#07152c] text-white rounded-md font-bold text-xs transition-all shadow-xs"
                  >
                    {t('auth.signInBtn')}
                  </button>
                </form>

                {/* Secondary: Create Patient Account */}
                <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
                  {t('auth.dontHaveAccount', "Don't have a patient account?")}{' '}
                  <button
                    onClick={() => navigate('/register/patient')}
                    className="font-bold text-teal-800 hover:underline"
                  >
                    {t('auth.createPatientAccount')}
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 3: Clinical / Healthcare Worker Access Form (Section 14 Spec) */}
            {viewState === 'DOCTOR_SIGNIN' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <button
                  onClick={() => setViewState('CHOICE')}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t('auth.chooseDifferentRole', 'Choose a different role')}</span>
                </button>

                <div>
                  <h2 className="text-2xl font-extrabold text-[#0A1E3F] tracking-tight">
                    {t('auth.clinicalSignInTitle')}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {t('auth.clinicalSubtitle')}
                  </p>
                </div>

                {/* Demo Evaluator Profile Fast-Select */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-teal-700" />
                      {t('auth.demoFastLogin')}:
                    </span>
                    <span className="text-[10px] text-teal-800 font-mono font-semibold">1-Click Auto-Fill</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {MOCK_DOCTORS.slice(0, 2).map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          setSelectedDemoDoctor(d.id);
                          setDoctorIdentifier(d.email);
                        }}
                        className={`p-2 rounded text-left border text-xs transition-colors ${
                          selectedDemoDoctor === d.id 
                            ? 'bg-white border-[#0A1E3F] font-bold text-[#0A1E3F] shadow-2xs' 
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="truncate">{d.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{d.role} • Demo Verified (Prototype)</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Doctor Sign In Form (Section 14 Fields) */}
                <form onSubmit={handleDoctorSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t('auth.professionalId')}
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={selectedDemoDoctor}
                        readOnly
                        className="w-full pl-9 p-2 bg-slate-100 border border-slate-200 rounded-md text-slate-700 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t('auth.mobileOrEmail')}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={doctorIdentifier}
                        onChange={(e) => setDoctorIdentifier(e.target.value)}
                        placeholder="e.g. dr.ananya@careq-health.gov.in"
                        className="w-full pl-9 p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t('auth.password')}
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        value={doctorPassword}
                        onChange={(e) => setDoctorPassword(e.target.value)}
                        className="w-full pl-9 p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-md font-bold text-xs transition-all shadow-xs"
                  >
                    {t('auth.signInBtn')}
                  </button>
                </form>

                {/* Secondary: Register as Healthcare Professional */}
                <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
                  New clinical practitioner?{' '}
                  <button
                    onClick={() => navigate('/register/doctor')}
                    className="font-bold text-teal-800 hover:underline"
                  >
                    {t('auth.registerDoctor')}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
