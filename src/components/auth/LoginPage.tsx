import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_PATIENTS, MOCK_DOCTORS } from '../../data/mockData';
import { 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  ArrowRight, 
  Stethoscope, 
  User, 
  Sparkles, 
  Phone, 
  KeyRound,
  CheckCircle2,
  Building2,
  AlertCircle
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { navigate, loginAsPatient, loginAsDoctor } = useApp();
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient');
  const [identifier, setIdentifier] = useState('9876543210');
  const [password, setPassword] = useState('••••••••');
  const [selectedDemoPatient, setSelectedDemoPatient] = useState(MOCK_PATIENTS[0].id);
  const [selectedDemoDoctor, setSelectedDemoDoctor] = useState(MOCK_DOCTORS[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'patient') {
      loginAsPatient(selectedDemoPatient);
    } else {
      loginAsDoctor(selectedDemoDoctor);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* LEFT COLUMN: Trust & Narrative */}
        <div className="lg:col-span-6 bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            
            {/* National branding badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Public Healthcare Decision Support
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Trusted healthcare information, organized for faster review.
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Connect with verified patients and healthcare professionals through a secure triage-support platform engineered for government and institutional facilities.
              </p>
            </div>

            {/* Three Trust Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs space-y-1.5 hover:bg-white/10 transition-all">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-white">✓ Verified Identity</div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Simulated Aadhaar & professional MCI registration.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs space-y-1.5 hover:bg-white/10 transition-all">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-cyan-300 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-white">✓ Human Review</div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Qualified doctor in the loop. Zero autonomous diagnosis.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs space-y-1.5 hover:bg-white/10 transition-all">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-white">✓ Privacy First</div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Data minimization, explicit consent & full auditability.
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Educational Disclaimer */}
          <div className="relative z-10 pt-8 mt-8 border-t border-white/10 text-[11px] text-slate-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              Educational Prototype — Triage Support Only — Not for Diagnosis or Treatment.
            </span>
          </div>

        </div>

        {/* RIGHT COLUMN: Authentication Card */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-slate-50/50">
          <div className="max-w-md w-full mx-auto space-y-6">
            
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Sign in to SwasthyaSetu AI
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select your portal role to access triage services or clinical queue
              </p>
            </div>

            {/* Role Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-200/80 rounded-2xl border border-slate-300/80">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('patient');
                  setIdentifier('9876543210');
                }}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'patient'
                    ? 'bg-white text-teal-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Patient Portal</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('doctor');
                  setIdentifier('dr.ananya.sharma@health.gov.in');
                }}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'doctor'
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>Healthcare Worker</span>
              </button>
            </div>

            {/* Hackathon Judge Quick Demo Selector */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Quick Demo Profile for Judges:
                </span>
                <span className="text-[10px] text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded font-mono">
                  1-Click Ready
                </span>
              </div>
              
              {activeTab === 'patient' ? (
                <div className="grid grid-cols-2 gap-2">
                  {MOCK_PATIENTS.slice(0, 2).map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedDemoPatient(p.id);
                        setIdentifier(p.phone);
                      }}
                      className={`p-2 rounded-xl text-left border text-xs transition-all ${
                        selectedDemoPatient === p.id 
                          ? 'bg-white border-teal-600 shadow-xs ring-1 ring-teal-500' 
                          : 'bg-white/80 border-amber-200 hover:bg-white'
                      }`}
                    >
                      <div className="font-bold text-slate-800">{p.name}</div>
                      <div className="text-[10px] text-slate-500">{p.preferredLanguage} • {p.age}y</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {MOCK_DOCTORS.slice(0, 2).map(d => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        setSelectedDemoDoctor(d.id);
                        setIdentifier(d.email);
                      }}
                      className={`p-2 rounded-xl text-left border text-xs transition-all ${
                        selectedDemoDoctor === d.id 
                          ? 'bg-white border-blue-900 shadow-xs ring-1 ring-blue-900' 
                          : 'bg-white/80 border-amber-200 hover:bg-white'
                      }`}
                    >
                      <div className="font-bold text-slate-800">{d.name}</div>
                      <div className="text-[10px] text-slate-500">{d.role} • 11y exp</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {activeTab === 'patient' ? 'Mobile Number / Demo Patient ID' : 'Official Email / Registration ID'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    {activeTab === 'patient' ? <Phone className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
                    placeholder={activeTab === 'patient' ? 'e.g. 98765 43210' : 'e.g. dr.ananya@health.gov.in'}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Security PIN / Password
                  </label>
                  <span className="text-[11px] text-slate-400">Demo PIN pre-filled</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'patient'
                    ? 'bg-teal-700 hover:bg-teal-800 shadow-teal-700/20'
                    : 'bg-blue-900 hover:bg-blue-950 shadow-blue-900/20'
                }`}
              >
                <span>Sign In to {activeTab === 'patient' ? 'Patient Portal' : 'Clinical Hub'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Registration Callout */}
            <div className="pt-4 border-t border-slate-200 text-center space-y-2">
              <p className="text-xs text-slate-500">
                Don't have an account yet?
              </p>
              <div className="flex items-center justify-center gap-4 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => navigate('/register/patient')}
                  className="text-teal-700 hover:text-teal-900 hover:underline"
                >
                  Create Patient Account →
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => navigate('/register/doctor')}
                  className="text-blue-900 hover:text-blue-950 hover:underline"
                >
                  Clinician Registration →
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
