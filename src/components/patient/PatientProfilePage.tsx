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
  CheckCircle2
} from 'lucide-react';

export const PatientProfilePage: React.FC = () => {
  const { currentPatient, setPrivacyModalOpen } = useApp();

  const [preferredLang, setPreferredLang] = useState(currentPatient?.preferredLanguage || 'Odia');
  const [consentTriage, setConsentTriage] = useState(true);
  const [consentShare, setConsentShare] = useState(true);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
          Patient Account & Identity
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Patient Profile & Consent Ledger
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your verified demographic details, language preferences, and clinical consent records
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-6">
        
        {/* Identity Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-2 border-emerald-300">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold text-xl shadow-md">
              {currentPatient?.name.charAt(0) || 'R'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {currentPatient?.name || 'Riya Das'}
                </h2>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified Patient
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-mono">
                Assigned ID: {currentPatient?.id || 'PAT-2026-00124'}
              </p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-emerald-200 sm:pl-4 text-xs space-y-1">
            <div className="text-slate-500 text-[11px]">Demo Aadhaar Token</div>
            <div className="font-mono font-bold text-slate-800">XXXX-XXXX-{currentPatient?.demoAadhaarLast4 || '1234'}</div>
            <div className="text-[10px] text-emerald-700">🔒 Simulated identity token</div>
          </div>
        </div>

        {/* Demographics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Age & Gender</span>
            <div className="font-bold text-slate-900 text-sm">
              {currentPatient?.age} Years • {currentPatient?.gender}
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> DOB: {currentPatient?.dob}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Primary Contact</span>
            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-teal-700" />
              {currentPatient?.phone}
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> {currentPatient?.email}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Residential Address</span>
            <div className="font-semibold text-slate-800 flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>{currentPatient?.address || 'Khandagiri, Bhubaneswar, Khordha, Odisha'}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Emergency Contact</span>
            <div className="font-semibold text-slate-800">
              {currentPatient?.emergencyContact || 'Debashis Das (Spouse) - +91 98765 11223'}
            </div>
            <span className="text-[10px] text-slate-400">Notified upon triage high-risk escalation</span>
          </div>

        </div>

        {/* Language Preference */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-teal-700" />
                Preferred Voice & Clinical Interface Language
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Our speech engine defaults to your regional dialect for voice symptom intake
              </p>
            </div>
            <select
              value={preferredLang}
              onChange={(e) => setPreferredLang(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 shadow-2xs"
            >
              <option value="Odia">ଓଡ଼ିଆ (Odia)</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
              <option value="English">English</option>
              <option value="Bengali">বাংলা (Bengali)</option>
              <option value="Tamil">தமிழ் (Tamil)</option>
            </select>
          </div>
        </div>

        {/* Consent Status Ledger */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-teal-700" />
            Digital Consent Status
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-center justify-between">
              <span className="text-slate-800 font-medium">
                Triage-Assistance Scope Acknowledgement (Non-diagnostic educational support)
              </span>
              <span className="font-bold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active Consent
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-center justify-between">
              <span className="text-slate-800 font-medium">
                Authorization for Accredited Healthcare Worker Clinical Review
              </span>
              <span className="font-bold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active Consent
              </span>
            </div>
          </div>
        </div>

        {/* Data Governance & Export */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-slate-200">
          <button
            onClick={() => setPrivacyModalOpen(true)}
            className="text-teal-700 hover:underline font-bold flex items-center gap-1"
          >
            <Lock className="w-3.5 h-3.5" />
            Review Data Minimization & Retention Policy
          </button>
          
          <button
            onClick={() => alert('Simulated export: All patient triage logs and reports packaged as encrypted JSON archive.')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export My Health Record (JSON)</span>
          </button>
        </div>

      </div>

    </div>
  );
};
