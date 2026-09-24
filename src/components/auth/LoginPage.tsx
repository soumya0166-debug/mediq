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
  Phone, 
  Building2,
  AlertCircle,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { navigate, loginAsPatient, loginAsDoctor } = useApp();
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor'>('patient');
  const [identifier, setIdentifier] = useState('9876543210');
  const [password, setPassword] = useState('••••••••');
  const [selectedDemoPatient, setSelectedDemoPatient] = useState(MOCK_PATIENTS[0].id);
  const [selectedDemoDoctor, setSelectedDemoDoctor] = useState(MOCK_DOCTORS[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'patient') {
      loginAsPatient(selectedDemoPatient);
    } else {
      loginAsDoctor(selectedDemoDoctor);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-[#F8FAFC]">
      <div className="max-w-6xl w-full bg-white rounded-careq-xl shadow-careq-md border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* LEFT 55%: CAREQ Identity Area (Section 13) */}
        <div className="lg:col-span-7 bg-[#0A1E3F] text-white p-8 sm:p-12 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#163B66]">
          <div className="space-y-6">
            
            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
                CAREQ
              </h1>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-200 leading-snug">
                Connected health information.<br />
                Faster clinical review.
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed max-w-lg pt-1">
                CAREQ organizes patient-provided health information for review by authorized healthcare professionals across institutional health facilities.
              </p>
            </div>

            {/* Three Elegant Trust Indicators (Section 13) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#0F294A] border border-[#1E4575] rounded-careq-md p-3.5 space-y-1">
                <div className="text-teal-400 flex items-center gap-1.5 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Identity</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Patient and clinician credential validation.
                </p>
              </div>

              <div className="bg-[#0F294A] border border-[#1E4575] rounded-careq-md p-3.5 space-y-1">
                <div className="text-teal-400 flex items-center gap-1.5 font-bold text-xs">
                  <Lock className="w-4 h-4" />
                  <span>Consent Controlled</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Patient decides which data categories are shared.
                </p>
              </div>

              <div className="bg-[#0F294A] border border-[#1E4575] rounded-careq-md p-3.5 space-y-1">
                <div className="text-teal-400 flex items-center gap-1.5 font-bold text-xs">
                  <UserCheck className="w-4 h-4" />
                  <span>Human Reviewed</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Licensed medical review in the loop. Zero autonomous diagnosis.
                </p>
              </div>
            </div>

            {/* Abstract Health-Data Flow Diagram (Section 13 - Not stock photo) */}
            <div className="pt-2">
              <div className="bg-[#0F294A]/80 border border-[#1E4575] rounded-careq-md p-4 text-xs font-mono">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                  Connected Care Data Architecture
                </div>
                <div className="grid grid-cols-5 items-center text-center gap-1 text-[11px]">
                  <div className="bg-[#163B66] p-2 rounded text-slate-200">Patient Input</div>
                  <div className="text-teal-400 font-bold">→</div>
                  <div className="bg-[#163B66] p-2 rounded text-slate-200">CAREQ Triage</div>
                  <div className="text-teal-400 font-bold">→</div>
                  <div className="bg-teal-900/60 border border-teal-500/40 p-2 rounded text-teal-200 font-bold">Clinician Review</div>
                </div>
              </div>
            </div>

          </div>

          {/* Educational Prototype Disclaimer */}
          <div className="pt-6 mt-6 border-t border-[#163B66] text-[11px] text-slate-400 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>
              Educational Prototype — Triage Support Only — Not for Diagnosis or Treatment.
            </span>
          </div>

        </div>

        {/* RIGHT 45%: Clean Authentication Panel (Section 13) */}
        <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            
            {/* Header */}
            <div>
              <h2 className="text-2xl font-extrabold text-[#0A1E3F] tracking-tight">
                Welcome to CAREQ
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose how you want to continue.
              </p>
            </div>

            {/* Two Distinct Role Selection Cards (Section 13) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <div
                onClick={() => {
                  setSelectedRole('patient');
                  setIdentifier('9876543210');
                }}
                className={`p-4 rounded-careq-md border text-left cursor-pointer transition-all ${
                  selectedRole === 'patient'
                    ? 'border-[#0A1E3F] bg-blue-50/50 shadow-careq-xs ring-1 ring-[#0A1E3F]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded flex items-center justify-center ${
                    selectedRole === 'patient' ? 'bg-[#0A1E3F] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <User className="w-4 h-4" />
                  </div>
                  {selectedRole === 'patient' && (
                    <span className="w-2 h-2 rounded-full bg-teal-600" />
                  )}
                </div>
                <div className="font-bold text-sm text-[#0A1E3F]">Patient</div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Submit health info and track clinical review.
                </p>
              </div>

              <div
                onClick={() => {
                  setSelectedRole('doctor');
                  setIdentifier('dr.ananya.sharma@careq-health.gov.in');
                }}
                className={`p-4 rounded-careq-md border text-left cursor-pointer transition-all ${
                  selectedRole === 'doctor'
                    ? 'border-[#0A1E3F] bg-blue-50/50 shadow-careq-xs ring-1 ring-[#0A1E3F]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded flex items-center justify-center ${
                    selectedRole === 'doctor' ? 'bg-[#0A1E3F] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  {selectedRole === 'doctor' && (
                    <span className="w-2 h-2 rounded-full bg-teal-600" />
                  )}
                </div>
                <div className="font-bold text-sm text-[#0A1E3F]">Healthcare Professional</div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Review patient cases & support triage workflows.
                </p>
              </div>

            </div>

            {/* Quick Test Demo Profile Selector */}
            <div className="p-3 bg-slate-50 rounded-careq-md border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  Demo profile for evaluators:
                </span>
                <span className="text-[10px] text-teal-800 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded font-mono font-bold">
                  1-Click Select
                </span>
              </div>
              
              {selectedRole === 'patient' ? (
                <div className="grid grid-cols-2 gap-2">
                  {MOCK_PATIENTS.slice(0, 2).map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedDemoPatient(p.id);
                        setIdentifier(p.phone);
                      }}
                      className={`p-2 rounded text-left border text-xs transition-colors ${
                        selectedDemoPatient === p.id 
                          ? 'bg-white border-[#0A1E3F] font-bold text-[#0A1E3F] shadow-careq-xs' 
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{p.preferredLanguage} • {p.age}y</div>
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
                      className={`p-2 rounded text-left border text-xs transition-colors ${
                        selectedDemoDoctor === d.id 
                          ? 'bg-white border-[#0A1E3F] font-bold text-[#0A1E3F] shadow-careq-xs' 
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="truncate">{d.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{d.role}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {selectedRole === 'patient' ? 'Mobile Number / Patient ID' : 'Official Email / Registration ID'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    {selectedRole === 'patient' ? <Phone className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-careq-sm text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#0A1E3F] focus:border-[#0A1E3F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Security PIN / Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-careq-sm text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#0A1E3F] focus:border-[#0A1E3F]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-careq-sm bg-[#0A1E3F] hover:bg-[#163B66] text-white font-bold text-xs sm:text-sm transition-colors shadow-careq-xs flex items-center justify-center gap-2"
              >
                <span>Continue to {selectedRole === 'patient' ? 'Patient Portal' : 'Clinical Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Registration Links */}
            <div className="pt-3 border-t border-slate-200 text-center space-y-1.5">
              <p className="text-xs text-slate-500">
                New to CAREQ?
              </p>
              <div className="flex items-center justify-center gap-3 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => navigate('/register/patient')}
                  className="text-teal-700 hover:text-teal-900 hover:underline"
                >
                  Register as Patient →
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => navigate('/register/doctor')}
                  className="text-[#0A1E3F] hover:underline"
                >
                  Healthcare Professional Registration →
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
