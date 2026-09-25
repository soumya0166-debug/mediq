import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldAlert, ArrowLeft, Stethoscope, Lock, CheckCircle2 } from 'lucide-react';

export const HealthcareAccessRestricted: React.FC = () => {
  const { currentPatient, navigate, currentSession, openWorkspaceSwitcher, logout } = useApp();
  const { t } = useLanguage();

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-2xl border border-red-200 shadow-xl overflow-hidden text-center">
        
        {/* Top Warning Banner Header */}
        <div className="bg-red-50/80 border-b border-red-100 p-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-600 mb-3 shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
            <Lock className="w-3.5 h-3.5" />
            {t('accessRestricted.badge', 'Restricted Access')}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-3">
            {t('accessRestricted.title', 'Healthcare Professional Portal Restricted')}
          </h1>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-5 text-left">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p className="font-medium">
              {t(
                'accessRestricted.description',
                { name: currentPatient?.name || 'Riya Das' },
                `You are currently signed in with a Patient profile (${currentPatient?.name || 'Riya Das'}). The Clinical Triage Queue, Diagnostic Review Workspace, and Medical Audit Ledger are strictly restricted to verified healthcare professionals with National Medical Commission (NMC) registration.`
              )}
            </p>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Role-Based Access Control (RBAC) enforced under National Digital Health Mission (ABHA) guidelines.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Patient medical records and triage queues are confidential and restricted to authenticated practitioners.</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/patient/dashboard')}
              className="flex-1 py-3 px-4 bg-[#0A1E3F] hover:bg-[#163B66] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('accessRestricted.returnDashboard', 'Return to Patient Dashboard')}</span>
            </button>

            {currentSession?.verifiedRoles.includes('HEALTHCARE_PROFESSIONAL') ? (
              <button
                onClick={() => openWorkspaceSwitcher('HEALTHCARE_PROFESSIONAL')}
                className="py-3 px-4 bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs sm:text-sm rounded-xl transition-all border border-teal-300 flex items-center justify-center gap-2"
              >
                <Stethoscope className="w-4 h-4 text-teal-700" />
                <span>Switch to Clinical Workspace</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition-all border border-slate-300 flex items-center justify-center gap-2"
              >
                <Stethoscope className="w-4 h-4 text-teal-700" />
                <span>Sign In as Healthcare Worker</span>
              </button>
            )}

            <button
              onClick={() => logout()}
              className="py-3 px-3 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 font-semibold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1.5"
              title="Sign Out"
            >
              <span>Sign Out</span>
            </button>
          </div>

          <p className="text-[11px] text-center text-slate-400">
            {t('accessRestricted.securityNotice', 'Security Audit Trail: Unauthorized navigation attempts are logged in the cryptographic ledger.')}
          </p>
        </div>

      </div>
    </div>
  );
};
