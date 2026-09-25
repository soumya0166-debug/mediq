import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldCheck, 
  ArrowRightLeft, 
  User, 
  Stethoscope, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Lock,
  Building2,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../../types';

export const WorkspaceSwitchModal: React.FC = () => {
  const { 
    isWorkspaceSwitchModalOpen, 
    setWorkspaceSwitchModalOpen, 
    targetSwitchRole, 
    currentRole, 
    currentPatient, 
    currentDoctor, 
    switchWorkspace,
    facilityId,
    currentFacility
  } = useApp();

  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isWorkspaceSwitchModalOpen || !targetSwitchRole) return null;

  const isSwitchingToClinical = targetSwitchRole === 'HEALTHCARE_PROFESSIONAL';

  const handleConfirmSwitch = async () => {
    setIsProcessing(true);
    try {
      await switchWorkspace(targetSwitchRole);
      setWorkspaceSwitchModalOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden space-y-0">
        
        {/* Modal Header */}
        <div className="bg-[#0A1E3F] text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 flex-shrink-0">
              <ArrowRightLeft className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Secure Workspace Switch</span>
                <span className="text-[10px] font-mono font-bold bg-teal-900/80 text-teal-300 px-2 py-0.5 rounded border border-teal-700/60">
                  RBAC Enforced
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Multi-Role Authorization Gateway
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setWorkspaceSwitchModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          
          {/* Workspaces Comparison Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            {/* Source Workspace */}
            <div className="space-y-1.5 p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Current Workspace
              </span>
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                {currentRole === 'PATIENT' ? (
                  <>
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    <span>Patient Workspace</span>
                  </>
                ) : (
                  <>
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                    <span>Clinical Workspace</span>
                  </>
                )}
              </div>
              <div className="text-[11px] text-slate-500 truncate font-mono">
                {currentRole === 'PATIENT' ? (currentPatient?.name || 'Riya Das') : (currentDoctor?.name || 'Dr. Ananya Sharma')}
              </div>
            </div>

            {/* Target Workspace */}
            <div className="space-y-1.5 p-2.5 bg-teal-50/70 rounded-lg border border-teal-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block flex items-center justify-between">
                <span>Target Workspace</span>
                <span className="text-[9px] font-mono bg-teal-200/80 text-teal-900 px-1 py-0.2 rounded font-bold">✓ Verified</span>
              </span>
              <div className="flex items-center gap-1.5 font-bold text-teal-950">
                {isSwitchingToClinical ? (
                  <>
                    <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
                    <span>Clinical Review Workspace</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-teal-700" />
                    <span>Patient Workspace</span>
                  </>
                )}
              </div>
              <div className="text-[11px] text-teal-800 truncate font-mono font-medium">
                {isSwitchingToClinical 
                  ? `Dr. Ananya Sharma • NMC-84920` 
                  : `Riya Das • PAT-2026-00124`}
              </div>
            </div>
          </div>

          {/* Role-Scoped Isolation Notice */}
          <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl space-y-1 text-amber-950">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>Strict Session & Memory Isolation</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900/90">
              Switching workspaces ends the current role session. Incomplete drafts, active queue selections, and temporary voice recording buffers are wiped to ensure zero cross-role leakage.
            </p>
          </div>

          {/* Target Role Verification Details */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Target Credential Re-Verification:
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-800">
                  {isSwitchingToClinical ? 'Medical Council Practitioner Registry' : 'ABHA Demo Patient Identity'}
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Authorized
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setWorkspaceSwitchModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-all"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmSwitch}
              disabled={isProcessing}
              className="px-5 py-2.5 bg-[#0A1E3F] hover:bg-[#163B66] text-white font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              {isProcessing ? (
                <span>Re-verifying & Switching…</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>
                    {isSwitchingToClinical ? 'Enter Clinical Workspace' : 'Enter Patient Workspace'}
                  </span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
