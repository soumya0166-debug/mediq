import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Activity, 
  ShieldCheck, 
  User, 
  Stethoscope, 
  Sparkles, 
  Lock, 
  HelpCircle,
  FileText,
  Clock,
  LogOut,
  FolderHeart,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentRole, 
    currentPatient, 
    currentDoctor, 
    currentRoute, 
    navigate, 
    switchRole,
    setPrivacyModalOpen,
    setDemoGuideOpen,
    logout
  } = useApp();

  const isAuthPage = currentRoute.startsWith('/login') || currentRoute.startsWith('/register') || currentRoute.startsWith('/verify');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand & Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(currentRole === 'patient' ? '/patient/dashboard' : '/doctor/dashboard')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 flex items-center justify-center text-white shadow-md shadow-blue-900/10">
              <Activity className="w-6 h-6 text-cyan-300 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl text-blue-950 tracking-tight font-sans">
                  SwasthyaSetu <span className="text-teal-600 font-black">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                  Triage Assistant
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Smarter information. Faster review. Better-connected care.
              </p>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          {!isAuthPage && (
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold">
              {currentRole === 'patient' ? (
                <>
                  <button
                    onClick={() => navigate('/patient/dashboard')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      currentRoute === '/patient/dashboard'
                        ? 'bg-white text-blue-950 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-blue-950'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/patient/new-assessment')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      currentRoute === '/patient/new-assessment'
                        ? 'bg-blue-900 text-white shadow-xs font-bold'
                        : 'text-blue-900 hover:bg-blue-50'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    New Assessment
                  </button>
                  <button
                    onClick={() => navigate('/patient/history')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      currentRoute === '/patient/history'
                        ? 'bg-white text-blue-950 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-blue-950'
                    }`}
                  >
                    History
                  </button>
                  <button
                    onClick={() => navigate('/patient/reports')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      currentRoute === '/patient/reports'
                        ? 'bg-white text-blue-950 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-blue-950'
                    }`}
                  >
                    My Reports
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/doctor/dashboard')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      currentRoute === '/doctor/dashboard'
                        ? 'bg-white text-blue-950 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-blue-950'
                    }`}
                  >
                    Clinical Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/doctor/queue')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      currentRoute === '/doctor/queue'
                        ? 'bg-blue-900 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-blue-950'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Patient Queue
                  </button>
                  <button
                    onClick={() => navigate('/doctor/reports')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      currentRoute === '/doctor/reports'
                        ? 'bg-white text-blue-950 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-blue-950'
                    }`}
                  >
                    Lab OCR Vault
                  </button>
                  <button
                    onClick={() => navigate('/doctor/audit-log')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      currentRoute === '/doctor/audit-log'
                        ? 'bg-white text-blue-950 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-blue-950'
                    }`}
                  >
                    Audit Trail
                  </button>
                </>
              )}
            </nav>
          )}

          {/* Right Action Tools: Role Switcher, Judge Demo, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Hackathon Judge Demo Walkthrough Trigger */}
            <button
              onClick={() => setDemoGuideOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs hover:from-amber-600 hover:to-amber-700 transition-all border border-amber-600"
              title="Open step-by-step hackathon demo flow"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-100" />
              <span className="hidden sm:inline">Judge Demo Guide</span>
              <span className="sm:hidden font-black">Demo</span>
            </button>

            {/* Quick Role Switcher Pill */}
            {!isAuthPage && (
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  onClick={() => switchRole('patient')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                    currentRole === 'patient'
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Switch view to Patient Experience"
                >
                  <User className="w-3 h-3" />
                  <span className="hidden sm:inline">Patient</span>
                </button>
                <button
                  onClick={() => switchRole('doctor')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                    currentRole === 'doctor'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Switch view to Healthcare Worker Experience"
                >
                  <Stethoscope className="w-3 h-3" />
                  <span className="hidden sm:inline">Clinician</span>
                </button>
              </div>
            )}

            {/* Privacy & Trust Badge */}
            <button
              onClick={() => setPrivacyModalOpen(true)}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-slate-600 hover:text-blue-900 hover:bg-blue-50 text-xs font-medium border border-transparent hover:border-blue-200 transition-all flex items-center gap-1"
              title="Open Privacy & Responsible AI Framework"
            >
              <Lock className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden md:inline">Privacy Center</span>
            </button>

            {/* User Profile / Status */}
            {!isAuthPage ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1 justify-end">
                    {currentRole === 'patient' ? currentPatient?.name : currentDoctor?.name}
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {currentRole === 'patient' ? currentPatient?.id : currentDoctor?.medicalRegistrationId}
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-900 text-white hover:bg-blue-950 transition-all"
              >
                Sign In
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
