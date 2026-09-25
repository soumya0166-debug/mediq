import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
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
  Sparkles,
  KeyRound,
  Smartphone,
  Info,
  Clock
} from 'lucide-react';

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

  const [challengeType, setChallengeType] = useState<'PIN' | 'OTP'>('PIN');
  const [pinCode, setPinCode] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [clinicalJustification, setClinicalJustification] = useState('Active OPD & Triage Shift Duty');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isWorkspaceSwitchModalOpen || !targetSwitchRole) return null;

  const isSwitchingToClinical = targetSwitchRole === 'HEALTHCARE_PROFESSIONAL';

  // Demo auto-fill values
  const defaultPin = isSwitchingToClinical ? '482910' : '123456';
  const defaultOtp = isSwitchingToClinical ? '719402' : '654321';

  const handleAutoFill = () => {
    setErrorMessage(null);
    if (challengeType === 'PIN') {
      setPinCode(defaultPin);
    } else {
      setOtpCode(defaultOtp);
    }
  };

  const handleConfirmSwitch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const activeCode = challengeType === 'PIN' ? pinCode.trim() : otpCode.trim();

    if (!activeCode) {
      setErrorMessage(`Please enter your 6-digit ${challengeType === 'PIN' ? 'Security PIN' : 'Verification OTP'}.`);
      return;
    }

    if (activeCode.length !== 6) {
      setErrorMessage('The verification code must be exactly 6 digits.');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await switchWorkspace(targetSwitchRole, {
        challengeType,
        code: activeCode,
        clinicalJustification: isSwitchingToClinical ? clinicalJustification : 'Patient Personal Health Portal Access'
      });

      if (!result.success) {
        setErrorMessage(result.message || 'High-assurance re-authentication failed. Please check credentials.');
      } else {
        setWorkspaceSwitchModalOpen(false);
        setPinCode('');
        setOtpCode('');
      }
    } catch {
      setErrorMessage('Network or server error during step-up challenge verification.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (isProcessing) return;
    setErrorMessage(null);
    setPinCode('');
    setOtpCode('');
    setWorkspaceSwitchModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden space-y-0 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-[#0A1E3F] text-white p-5 flex items-start justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 flex-shrink-0">
              <ArrowRightLeft className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  High-Assurance Role Change
                </h3>
                <span className="text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                  Step-Up Challenge
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Verified Cross-Workspace Identity Re-Authentication
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable if height constrained) */}
        <div className="p-6 space-y-5 text-xs text-slate-700 overflow-y-auto">
          
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
                  ? `Dr. Ananya Sharma • Demo Medical Officer` 
                  : `Riya Das • PAT-2026-00124`}
              </div>
            </div>
          </div>

          {/* Clinical Shift Justification (Only when entering clinical role) */}
          {isSwitchingToClinical && (
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-800">
                Clinical Session Justification <span className="text-red-500">*</span>
              </label>
              <select
                value={clinicalJustification}
                onChange={(e) => setClinicalJustification(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:ring-1 focus:ring-teal-600 outline-hidden"
              >
                <option value="Active OPD & Triage Shift Duty">Active OPD & Triage Shift Duty</option>
                <option value="Urgent Inpatient & Referral Case Review">Urgent Inpatient & Referral Case Review</option>
                <option value="Emergency Department Secondary Triage">Emergency Department Secondary Triage</option>
                <option value="Facility Clinical Audit & Case Supervision">Facility Clinical Audit & Case Supervision</option>
              </select>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-0.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Facility: {currentFacility} ({facilityId})</span>
              </div>
            </div>
          )}

          {/* High-Assurance Step-Up Verification Box */}
          <form onSubmit={handleConfirmSwitch} className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Lock className="w-3.5 h-3.5 text-teal-700" />
                  <span>Step-Up Re-Authentication Required</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Assurance: High</span>
              </div>

              {/* Challenge Mode Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-slate-200/70 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => { setChallengeType('PIN'); setErrorMessage(null); }}
                  className={`py-1.5 px-3 rounded-md font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                    challengeType === 'PIN'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5 text-teal-700" />
                  <span>Security PIN</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setChallengeType('OTP'); setErrorMessage(null); }}
                  className={`py-1.5 px-3 rounded-md font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                    challengeType === 'OTP'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-blue-700" />
                  <span>Mobile OTP</span>
                </button>
              </div>

              {/* Challenge Input Field */}
              {challengeType === 'PIN' ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <label className="font-bold text-slate-700">
                      Enter 6-Digit {isSwitchingToClinical ? 'Clinical Security PIN' : 'Patient Access PIN'}
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoFill}
                      className="text-teal-800 hover:underline font-semibold flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-teal-600" />
                      <span>Auto-fill Demo ({defaultPin})</span>
                    </button>
                  </div>
                  <input
                    type="password"
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    autoFocus
                    className="w-full text-center tracking-widest text-lg font-mono font-bold p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-teal-700 outline-hidden"
                  />
                  <p className="text-[10px] text-slate-500">
                    {isSwitchingToClinical 
                      ? 'Default prototype clinical PIN: 482910' 
                      : 'Default prototype patient PIN: 123456'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <span>SMS OTP sent to</span>
                      <span className="font-mono text-slate-900 font-bold">
                        {isSwitchingToClinical ? '+91 ••••• ••849' : '+91 ••••• ••210'}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoFill}
                      className="text-teal-800 hover:underline font-semibold flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-teal-600" />
                      <span>Auto-fill Demo ({defaultOtp})</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    autoFocus
                    className="w-full text-center tracking-widest text-lg font-mono font-bold p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-teal-700 outline-hidden"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Code expires in 04:59</span>
                    </span>
                    <span>Demo OTP: {defaultOtp}</span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{errorMessage}</div>
                </div>
              )}
            </div>

            {/* Strict Session & Memory Isolation Warning */}
            <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl space-y-1 text-amber-950">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>Strict Memory Isolation & State Revocation</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-900/90">
                Authorizing this role change immediately terminates the previous session token. Active scratchpad notes, queue locks, and temporary recordings are purged from client memory to prevent cross-role data contamination.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-all"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-5 py-2.5 bg-[#0A1E3F] hover:bg-[#163B66] text-white font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                {isProcessing ? (
                  <span>Verifying Credentials & Transitioning…</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>
                      {isSwitchingToClinical ? 'Authorize Clinical Workspace' : 'Authorize Patient Workspace'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};
