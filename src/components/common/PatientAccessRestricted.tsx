import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldAlert, ArrowLeft, User, Lock, CheckCircle2, RefreshCw, LogOut } from 'lucide-react';

export const PatientAccessRestricted: React.FC = () => {
  const { currentDoctor, navigate, openWorkspaceSwitcher, logout, currentSession } = useApp();
  const { t } = useLanguage();

  const hasPatientRole = currentSession?.verifiedRoles.includes('PATIENT');

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-2xl border border-amber-200 shadow-xl overflow-hidden text-center">
        
        {/* Top Warning Banner Header */}
        <div className="bg-amber-50/80 border-b border-amber-100 p-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 mb-3 shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
            <Lock className="w-3.5 h-3.5" />
            Patient Workspace Required
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-3">
            Patient Self-Service Workspace Restricted
          </h1>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-5 text-left">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p className="font-medium">
              You are currently signed in with an active <strong>Healthcare Professional session</strong> ({currentDoctor?.name || 'Dr. Ananya Sharma'} • NMC-84920). 
              Personal health assessments, patient voice intake, and personal symptom reporting are strictly restricted to verified patient identities to prevent accidental cross-contamination of clinical records.
            </p>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Strict Role-Based Access Control: Clinical reviewer sessions cannot submit self-assessments.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>If you are legitimately acting as a patient, switch workspaces using your verified patient identity.</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/clinical/dashboard')}
              className="flex-1 py-3 px-4 bg-[#0A1E3F] hover:bg-[#163B66] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Clinical Dashboard</span>
            </button>

            {hasPatientRole && (
              <button
                onClick={() => openWorkspaceSwitcher('PATIENT')}
                className="py-3 px-4 bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs sm:text-sm rounded-xl transition-all border border-teal-300 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4 text-teal-700" />
                <span>Switch to Patient Workspace</span>
              </button>
            )}

            <button
              onClick={logout}
              className="py-3 px-3 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 font-semibold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1.5"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          <p className="text-[11px] text-center text-slate-400">
            Security Audit Trail: Cross-role navigation requests are recorded in the security audit ledger.
          </p>
        </div>

      </div>
    </div>
  );
};
