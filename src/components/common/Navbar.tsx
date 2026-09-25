import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { 
  Activity, 
  ShieldCheck, 
  User, 
  Stethoscope, 
  Sparkles, 
  Lock, 
  LogOut,
  Building2,
  FileText,
  Clock,
  CheckCircle2,
  LayoutDashboard,
  ArrowRightLeft
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentRole, 
    isPatient,
    currentPatient, 
    currentDoctor, 
    currentRoute, 
    navigate, 
    openWorkspaceSwitcher,
    verifiedRoles,
    setPrivacyModalOpen,
    setDemoGuideOpen,
    logout
  } = useApp();

  const { t } = useLanguage();

  const isAuthPage = currentRoute.startsWith('/login') || currentRoute.startsWith('/register') || currentRoute.startsWith('/verify');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Brand & Identity */}
          <div 
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none flex-shrink-0" 
            onClick={() => navigate(isPatient ? '/patient/dashboard' : '/clinical/dashboard')}
          >
            <div className="w-9 h-9 rounded-lg bg-[#0A1E3F] flex items-center justify-center text-white shadow-2xs">
              <Activity className="w-5 h-5 text-teal-400 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-[#0A1E3F] tracking-tight font-sans">
                  CAREQ
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-1.5 py-0.2 rounded font-mono">
                  Demo
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                {t('common.tagline')}
              </p>
            </div>
          </div>

          {/* Navigation Links for Patient */}
          {!isAuthPage && isPatient && (
            <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-600">
              <button
                onClick={() => navigate('/patient/dashboard')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  currentRoute === '/patient/dashboard' || currentRoute === '/'
                    ? 'bg-slate-100 text-[#0A1E3F] font-bold'
                    : 'hover:text-[#0A1E3F]'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{t('nav.dashboard')}</span>
              </button>
              <button
                onClick={() => navigate('/patient/new-assessment')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  currentRoute === '/patient/new-assessment'
                    ? 'bg-[#0A1E3F] text-white font-bold'
                    : 'text-[#0A1E3F] hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>{t('patient.startAssessmentBtn')}</span>
              </button>
              <button
                onClick={() => navigate('/patient/history')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentRoute === '/patient/history'
                    ? 'bg-slate-100 text-[#0A1E3F] font-bold'
                    : 'hover:text-[#0A1E3F]'
                }`}
              >
                <span>{t('nav.assessments')}</span>
              </button>
              <button
                onClick={() => navigate('/patient/reports')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentRoute === '/patient/reports'
                    ? 'bg-slate-100 text-[#0A1E3F] font-bold'
                    : 'hover:text-[#0A1E3F]'
                }`}
              >
                <span>{t('nav.reports')}</span>
              </button>
              <button
                onClick={() => navigate('/patient/timeline')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentRoute === '/patient/timeline'
                    ? 'bg-slate-100 text-[#0A1E3F] font-bold'
                    : 'hover:text-[#0A1E3F]'
                }`}
              >
                <span>{t('nav.timeline')}</span>
              </button>
              <button
                onClick={() => navigate('/patient/consent')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentRoute === '/patient/consent'
                    ? 'bg-slate-100 text-[#0A1E3F] font-bold'
                    : 'hover:text-[#0A1E3F]'
                }`}
              >
                <span>{t('nav.consent')}</span>
              </button>
            </nav>
          )}

          {/* Right Action Tools: Language Selector, Workspace Role Indicator, Switcher, Judge Demo, Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Preferred Language Selector (Section 37 - Preserves Role Separation) */}
            <LanguageSelector variant="header" />

            {/* Explicit Role Indicator & Workspace Badge (Section 40) */}
            {!isAuthPage && (
              <div className="flex items-center gap-2">
                {isPatient ? (
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 font-bold text-xs shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-teal-600 inline-block animate-pulse" />
                    <span className="uppercase tracking-wider text-[10px]">PATIENT WORKSPACE</span>
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-950 font-bold text-xs shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block animate-pulse" />
                    <span className="uppercase tracking-wider text-[10px]">CLINICAL REVIEW WORKSPACE</span>
                  </div>
                )}

                {/* Secure Workspace Switching Trigger (Section 16, 26, 27) */}
                {verifiedRoles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => openWorkspaceSwitcher()}
                    className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-all shadow-2xs"
                    title={isPatient ? "Switch to verified Healthcare Professional Workspace" : "Switch to verified Patient Workspace"}
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 text-teal-600" />
                    <span className="hidden md:inline">Switch Workspace</span>
                  </button>
                )}
              </div>
            )}

            {/* Judge Demo Walkthrough Trigger */}
            <button
              onClick={() => setDemoGuideOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors border border-amber-600 shadow-2xs flex-shrink-0"
              title="Open step-by-step hackathon demo flow"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden sm:inline">{t('nav.evaluationGuide')}</span>
              <span className="sm:hidden font-bold">Demo</span>
            </button>

            {/* Privacy Center Button */}
            <button
              onClick={() => setPrivacyModalOpen(true)}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-slate-600 hover:text-[#0A1E3F] hover:bg-slate-100 text-xs font-semibold border border-transparent hover:border-slate-200 transition-colors hidden md:flex items-center gap-1.5 flex-shrink-0"
              title="Open Consent & Privacy Center"
            >
              <Lock className="w-3.5 h-3.5 text-teal-600" />
              <span>{t('nav.consent')}</span>
            </button>

            {/* User Profile / Status */}
            {!isAuthPage ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right hidden xl:block">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1 justify-end">
                    <span>{isPatient ? currentPatient?.name : currentDoctor?.name}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" title="Verified Identity" />
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {isPatient ? currentPatient?.id : currentDoctor?.medicalRegistrationId}
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                  title={t('nav.signOut')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#0A1E3F] text-white hover:bg-[#163B66] transition-colors"
              >
                {t('auth.signInBtn')}
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
