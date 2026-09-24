import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
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
  ExternalLink,
  Globe
} from 'lucide-react';

export const PatientProfilePage: React.FC = () => {
  const { currentPatient, setPrivacyModalOpen, navigate } = useApp();
  const { t, locale, setLocale, locales } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-md">
          {t('nav.profile')}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
          {t('nav.profile')} & Identity
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
                  {t('auth.trustVerified')}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-mono">
                {t('clinical.patientId')}: {currentPatient?.id || 'PAT-2026-00124'}
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
            <span className="text-slate-400 font-bold uppercase text-[10px]">{t('clinical.age')} & {t('clinical.gender')}</span>
            <div className="font-bold text-slate-900 text-sm">
              {currentPatient?.age} {t('common.years')} • {currentPatient?.gender === 'Female' ? t('common.female') : t('common.male')}
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

          {/* Section 32 & 33: Preferred Language Settings */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                <Globe className="w-3 h-3 text-teal-700" />
                <span>Preferred Language (Section 32/33)</span>
              </span>
              <span className="text-[10px] text-teal-800 font-bold font-mono">Real-time switch</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {locales.map((loc) => {
                const isSelected = locale === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setLocale(loc.id)}
                    className={`py-2 px-2 rounded text-xs font-bold text-center transition-all ${
                      isSelected
                        ? 'bg-[#0A1E3F] text-white shadow-2xs ring-2 ring-teal-500'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>{loc.nativeName}</div>
                    <div className="text-[9px] font-normal opacity-75">{loc.name}</div>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-600 leading-tight pt-1">
              Use this language across CAREQ: controls dashboard, assessments, follow-ups, notifications, and consent.
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
