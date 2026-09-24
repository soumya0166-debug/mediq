import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Languages, 
  HeartHandshake, 
  Lock, 
  Download, 
  FileCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const PatientProfilePage: React.FC = () => {
  const { currentPatient, setPrivacyModalOpen, navigate } = useApp();

  const [preferredLang, setPreferredLang] = useState(currentPatient?.preferredLanguage || 'Odia');

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-md">
          Patient Account
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
          Patient Profile & Identity
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage your verified demographic record, language preferences, and clinical consent authorizations.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
        
        {/* Identity Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#0A1E3F] text-white flex items-center justify-center font-bold text-lg shadow-2xs">
              {currentPatient?.name.charAt(0) || 'R'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {currentPatient?.name || 'Riya Das'}
                </h2>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified Identity
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-mono">
                Patient ID: {currentPatient?.id || 'PAT-2026-00124'}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs space-y-0.5">
            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Demo Identity Token</div>
            <div className="font-mono font-bold text-slate-800">XXXX-XXXX-{currentPatient?.demoAadhaarLast4 || '1234'}</div>
            <div className="text-[10px] text-emerald-700">Simulated test identity</div>
          </div>
        </div>

        {/* Demographics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Age & Gender</span>
            <div className="font-bold text-slate-900 text-sm">
              {currentPatient?.age} Years • {currentPatient?.gender}
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Date of Birth: {currentPatient?.dob}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Primary Contact</span>
            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-teal-700" />
              {currentPatient?.phone}
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> {currentPatient?.email}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Residential Address</span>
            <div className="font-semibold text-slate-800 flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>{currentPatient?.address || 'Plot 42, Khandagiri Enclave, Bhubaneswar, Odisha 751030'}</span>
            </div>
            <div className="text-[11px] text-slate-500">District: Khordha • State: Odisha</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Preferred Language</span>
            <div className="flex items-center gap-2">
              {(['Odia', 'Hindi', 'English'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setPreferredLang(lang)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                    preferredLang === lang
                      ? 'bg-[#0A1E3F] text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500">
              Symptom questions and voice transcripts will default to this language.
            </p>
          </div>

        </div>

        {/* Consent Center Quick Link (Section 38) */}
        <div className="p-5 rounded-xl bg-teal-50/50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <h3 className="font-bold text-sm text-teal-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              Consent & Access Management (Section 38)
            </h3>
            <p className="text-slate-600 text-xs mt-0.5">
              Control which categories of your health data are shared with authorized healthcare workers.
            </p>
          </div>

          <button
            onClick={() => navigate('/patient/consent')}
            className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg font-semibold transition-all shadow-2xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Open Consent Center</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
