import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';
import { Facility } from '../../types';
import { 
  Activity, 
  Clock, 
  AlertCircle, 
  FileText, 
  Share2, 
  History, 
  Settings, 
  ShieldCheck, 
  Stethoscope, 
  Layers, 
  Sparkles, 
  ChevronRight, 
  LogOut, 
  Building2, 
  FileCheck, 
  CheckCircle2, 
  CheckSquare, 
  HelpCircle, 
  Shield, 
  ArrowRightLeft, 
  ChevronDown,
  Globe,
  Languages,
  X
} from 'lucide-react';

export const DoctorLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    currentDoctor, 
    currentRoute, 
    navigate, 
    logout, 
    setDemoGuideOpen, 
    assessments, 
    currentFacility, 
    facilityId,
    switchFacility, 
    availableFacilities 
  } = useApp();
  const { 
    t, 
    locale, 
    setLocale, 
    patientCommLocale, 
    setPatientCommLocale, 
    locales 
  } = useLanguage();

  const [facilityDropdownOpen, setFacilityDropdownOpen] = useState(false);
  const [showLangProfileModal, setShowLangProfileModal] = useState(false);

  const highPriorityCount = assessments.filter(a => a.riskLevel === 'HIGH' && a.status === 'WAITING_REVIEW').length;
  const waitingCount = assessments.filter(a => a.status === 'WAITING_REVIEW').length;
  const followUpCount = assessments.filter(a => a.followUpQuestions.some(q => q.status === 'ASKED')).length;
  const reviewedCount = assessments.filter(a => a.status === 'REVIEWED').length;
  const referralCount = assessments.filter(a => a.status === 'REFERRED').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      
      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR — CAREQ Section 11 Specification                         */}
      {/* ========================================================================= */}
      <aside className="w-full lg:w-64 bg-[#0A1E3F] text-slate-300 flex-shrink-0 flex flex-col justify-between border-r border-slate-800 shadow-xl">
        
        {/* Top: Facility Branding */}
        <div>
          {/* Section 11 Brand Header */}
          <div className="p-4 border-b border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div 
                className="flex items-center gap-2.5 cursor-pointer group" 
                onClick={() => navigate('/clinical/dashboard')}
              >
                <div className="w-8 h-8 rounded-lg bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-300 shadow-xs">
                  <Stethoscope className="w-4 h-4 text-teal-300" />
                </div>
                <div>
                  <span className="font-extrabold text-white text-sm tracking-tight block leading-tight">
                    CAREQ
                  </span>
                  <span className="text-[10px] font-medium text-teal-400 tracking-normal block">
                    Digital Health Triage
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Accessible Language Selector in Clinical Workspace (Section 3 Spec) */}
            <div className="pt-1">
              <LanguageSelector variant="compact" />
            </div>

            {/* Clinician Language Profile Trigger (Section 34 Spec) */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowLangProfileModal(true)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-teal-300 hover:text-white bg-teal-950/40 hover:bg-teal-900/60 border border-teal-800/50 transition-all"
              >
                <div className="flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-teal-400" />
                  <span>{t('clinical.doctorLanguageProfileTitle')}</span>
                </div>
                <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-teal-900/60 text-teal-300 border border-teal-700/50">
                  {patientCommLocale.split('-')[0]}
                </span>
              </button>
            </div>
          </div>

          {/* Navigation Links — Section 11 Architecture */}
          <nav className="p-3 space-y-4">
            
            {/* GROUP 1: WORKSPACE */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t('clinical.workspaceTitle', 'Workspace')}
              </div>

              {/* Dashboard */}
              <button
                onClick={() => navigate('/clinical/dashboard')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  currentRoute === '/clinical/dashboard' || currentRoute === '/doctor/dashboard'
                    ? 'bg-slate-800 text-white font-bold border-l-2 border-teal-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-teal-400" />
                  <span>{t('nav.dashboard')}</span>
                </div>
              </button>

              {/* Patient Queue */}
              <button
                onClick={() => navigate('/clinical/queue')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  (currentRoute === '/clinical/queue' || currentRoute === '/doctor/queue') && !window.location.search.includes('filter=')
                    ? 'bg-slate-800 text-white font-bold border-l-2 border-teal-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{t('nav.queue')}</span>
                </div>
                {waitingCount > 0 && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-700 text-slate-200">
                    {waitingCount}
                  </span>
                )}
              </button>

              {/* Priority Cases */}
              <button
                onClick={() => navigate('/clinical/queue?filter=HIGH')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  currentRoute.includes('filter=HIGH')
                    ? 'bg-slate-800 text-white font-bold border-l-2 border-red-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span>{t('nav.priorityCases')}</span>
                </div>
                {highPriorityCount > 0 && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-900/80 border border-red-500/50 text-red-200">
                    {highPriorityCount}
                  </span>
                )}
              </button>

              {/* My Reviews */}
              <button
                onClick={() => navigate('/clinical/queue?filter=REVIEWED')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  currentRoute.includes('filter=REVIEWED')
                    ? 'bg-slate-800 text-white font-bold border-l-2 border-teal-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CheckSquare className="w-4 h-4 text-teal-400" />
                  <span>{t('nav.myReviews')}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{reviewedCount}</span>
              </button>

              {/* Follow-ups */}
              <button
                onClick={() => navigate('/clinical/queue?filter=WAITING')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  currentRoute.includes('filter=WAITING')
                    ? 'bg-slate-800 text-white font-bold border-l-2 border-amber-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>{t('nav.followUps')}</span>
                </div>
                {followUpCount > 0 && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-200">
                    {followUpCount}
                  </span>
                )}
              </button>

              {/* Referrals */}
              <button
                onClick={() => navigate('/clinical/queue?filter=REFERRED')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  currentRoute.includes('filter=REFERRED')
                    ? 'bg-slate-800 text-white font-bold border-l-2 border-teal-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Share2 className="w-4 h-4 text-teal-400" />
                  <span>{t('nav.referrals')}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{referralCount}</span>
              </button>
            </div>

            {/* GROUP 2: HEALTH INFORMATION */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t('clinical.sourceInformation', 'Health Information')}
              </div>

              {/* Health Timeline */}
              <button
                onClick={() => navigate('/clinical/queue')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <History className="w-4 h-4 text-slate-400" />
                  <span>{t('nav.timeline')}</span>
                </div>
              </button>

              {/* Reports */}
              <button
                onClick={() => navigate('/clinical/reports')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  currentRoute === '/clinical/reports' || currentRoute === '/doctor/reports'
                    ? 'bg-slate-800 text-white font-bold border-l-2 border-teal-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-4 h-4 text-teal-400" />
                  <span>{t('nav.reports')}</span>
                </div>
              </button>

              {/* Consent */}
              <button
                onClick={() => navigate('/patient/consent')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>{t('nav.consent')}</span>
                </div>
              </button>
            </div>

            {/* GROUP 3: GOVERNANCE */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Governance
              </div>

              {/* Audit Log */}
              <button
                onClick={() => navigate('/clinical/audit-log')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  currentRoute === '/clinical/audit-log' || currentRoute === '/doctor/audit-log'
                    ? 'bg-slate-800 text-white font-bold border-l-2 border-teal-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <History className="w-4 h-4 text-teal-400" />
                  <span>{t('nav.auditLog')}</span>
                </div>
              </button>

              {/* Facility Context / Switcher */}
              <div className="relative">
                <button
                  onClick={() => setFacilityDropdownOpen(!facilityDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{t('nav.facility')}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                </button>

                {facilityDropdownOpen && (
                  <div className="p-2 mt-1 bg-slate-950 border border-slate-800 rounded-lg space-y-1 text-xs shadow-xl animate-in fade-in">
                    <div className="px-2 py-1 text-[10px] text-slate-400 font-bold uppercase">
                      {t('nav.switchFacility')}
                    </div>
                    {availableFacilities.map((f: Facility) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          switchFacility(f.name, f.id);
                          setFacilityDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded text-[11px] transition-all flex items-center justify-between ${
                          facilityId === f.id
                            ? 'bg-teal-900/40 text-teal-300 font-bold border border-teal-600/30'
                            : 'text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <div className="truncate">
                          <div>{f.name}</div>
                          <div className="text-[9px] font-mono text-slate-500">{f.id}</div>
                        </div>
                        {facilityId === f.id && <span className="text-teal-400 text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Settings / Evaluator Guide */}
              <button
                onClick={() => setDemoGuideOpen(true)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-amber-300/90 hover:text-amber-200 hover:bg-amber-950/30 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{t('nav.evaluationGuide')}</span>
                </div>
              </button>
            </div>

          </nav>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM: Verified Professional (Section 11 Spec)                          */}
        {/* ========================================================================= */}
        <div className="p-4 border-t border-slate-800 space-y-2 bg-[#081730]">
          
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {t('auth.trustVerified')}
            </span>
            <div className="font-bold text-sm text-white truncate">
              {currentDoctor?.name || 'Dr. Ananya Sharma'}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>Verified • NMC-84920</span>
            </div>
            <div className="text-[11px] text-slate-400 truncate pt-0.5">
              {currentFacility || 'CAREQ Demo Primary Health Centre'}
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              ID: {facilityId || 'FAC-DEMO-OD-001'}
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full mt-2 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('nav.signOut')}</span>
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Clinician Language Profile Modal (Section 34 Spec) */}
      {showLangProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#0A1E3F] text-white p-5 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 flex-shrink-0 mt-0.5">
                  <Languages className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {t('clinical.doctorLanguageProfileTitle')}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-snug">
                    {t('clinical.doctorLanguageProfileSubtitle')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLangProfileModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Option 1: Workspace Interface Language */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    {t('clinical.interfaceLanguageLabel')}
                  </label>
                  <span className="text-[11px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Active: {locale}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {locales.map((loc) => {
                    const isSelected = locale === loc.id;
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => setLocale(loc.id)}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                          isSelected
                            ? 'bg-teal-50 border-teal-600 text-teal-900 shadow-2xs font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-sm font-bold">{loc.nativeName}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{loc.name}</span>
                        {isSelected && (
                          <span className="text-[10px] text-teal-700 font-semibold mt-0.5">✓ Active</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Option 2: Patient Communication Language */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    {t('clinical.patientCommLanguageLabel')}
                  </label>
                  <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Default: {patientCommLocale}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Patient questions, triage follow-ups, and regional guidance will default to this language.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {locales.map((loc) => {
                    const isSelected = patientCommLocale === loc.id;
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => setPatientCommLocale(loc.id)}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-2xs font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-sm font-bold">{loc.nativeName}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{loc.name}</span>
                        {isSelected && (
                          <span className="text-[10px] text-blue-700 font-semibold mt-0.5">✓ Selected</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Governance & Privacy attestation */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p>
                  Language preferences are encrypted and synchronized with your clinical practitioner credentials.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLangProfileModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={() => setShowLangProfileModal(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t('clinical.savePreferences')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
