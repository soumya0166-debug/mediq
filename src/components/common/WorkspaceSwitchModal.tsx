import React, { useState, useEffect } from 'react';
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
  Smartphone, 
  Clock, 
  RefreshCw, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const WorkspaceSwitchModal: React.FC = () => {
  const { 
    isWorkspaceSwitchModalOpen, 
    setWorkspaceSwitchModalOpen, 
    targetSwitchRole, 
    currentRole, 
    currentPatient, 
    currentDoctor, 
    facilityId, 
    currentFacility,
    sendMobileOtpForWorkspaceSwitch,
    verifyMobileOtpForWorkspaceSwitch
  } = useApp();

  // Workflow Stages: 1. CONFIRMATION, 2. OTP_ENTRY, 3. TRANSITIONING
  const [stage, setStage] = useState<'CONFIRMATION' | 'OTP_ENTRY' | 'TRANSITIONING'>('CONFIRMATION');
  const [mobileOtp, setMobileOtp] = useState('');
  const [maskedMobile, setMaskedMobile] = useState('+91 ******4821');
  const [clinicalJustification, setClinicalJustification] = useState('Active OPD & Triage Shift Duty');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [missingConfig, setMissingConfig] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [devToken, setDevToken] = useState<string | undefined>();
  
  // Timer states
  const [expiresIn, setExpiresIn] = useState(300);
  const [cooldown, setCooldown] = useState(0);

  // Transition animation steps (Section 20)
  const [transitionStep, setTransitionStep] = useState(1);

  useEffect(() => {
    let timer: any;
    if (stage === 'OTP_ENTRY' && expiresIn > 0) {
      timer = setInterval(() => setExpiresIn(prev => Math.max(0, prev - 1)), 1000);
    }
    return () => clearInterval(timer);
  }, [stage, expiresIn]);

  useEffect(() => {
    let cdTimer: any;
    if (cooldown > 0) {
      cdTimer = setInterval(() => setCooldown(prev => Math.max(0, prev - 1)), 1000);
    }
    return () => clearInterval(cdTimer);
  }, [cooldown]);

  if (!isWorkspaceSwitchModalOpen || !targetSwitchRole) return null;

  const isSwitchingToClinical = targetSwitchRole === 'HEALTHCARE_PROFESSIONAL';

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // STAGE 1 -> Send Mobile OTP
  const handleSendOtp = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setMissingConfig([]);

    const res = await sendMobileOtpForWorkspaceSwitch(targetSwitchRole, clinicalJustification);
    setIsProcessing(false);

    if (res.success) {
      if (res.maskedMobile) setMaskedMobile(res.maskedMobile);
      if (res.devPreviewToken) setDevToken(res.devPreviewToken);
      setExpiresIn(res.expiresInSeconds || 300);
      setCooldown(res.cooldownSeconds || 60);
      setStage('OTP_ENTRY');
    } else {
      setErrorMessage(res.message || 'Mobile verification service is not configured.');
      if (res.missingConfig) setMissingConfig(res.missingConfig);
    }
  };

  // STAGE 2 -> Verify Mobile OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileOtp.trim() || mobileOtp.trim().length !== 6) {
      setErrorMessage('Please enter the complete 6-digit Mobile OTP verification code.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const res = await verifyMobileOtpForWorkspaceSwitch(mobileOtp.trim(), targetSwitchRole, clinicalJustification);
    setIsProcessing(false);

    if (res.success) {
      // Begin verified transition state (Section 20)
      setStage('TRANSITIONING');
      setTransitionStep(1);

      setTimeout(() => setTransitionStep(2), 600);
      setTimeout(() => setTransitionStep(3), 1200);
      setTimeout(() => setTransitionStep(4), 1800);
      setTimeout(() => {
        setTransitionStep(5);
        setTimeout(() => {
          handleClose();
        }, 800);
      }, 2400);
    } else {
      setErrorMessage(res.message || 'The verification code is incorrect. Please try again.');
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isProcessing) return;
    setIsProcessing(true);
    setErrorMessage(null);
    const res = await sendMobileOtpForWorkspaceSwitch(targetSwitchRole, clinicalJustification);
    setIsProcessing(false);
    if (res.success) {
      setExpiresIn(res.expiresInSeconds || 300);
      setCooldown(res.cooldownSeconds || 60);
      if (res.devPreviewToken) setDevToken(res.devPreviewToken);
    } else {
      setErrorMessage(res.message || 'Failed to resend code.');
    }
  };

  const handleClose = () => {
    if (isProcessing && stage === 'TRANSITIONING') return;
    setStage('CONFIRMATION');
    setMobileOtp('');
    setErrorMessage(null);
    setMissingConfig([]);
    setWorkspaceSwitchModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden space-y-0 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0A1E3F] text-white p-5 flex items-start justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 flex-shrink-0">
              <ArrowRightLeft className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  {stage === 'CONFIRMATION' && 'Change Workspace'}
                  {stage === 'OTP_ENTRY' && 'Verify Your Mobile Number'}
                  {stage === 'TRANSITIONING' && 'Securing Workspace Transition'}
                </h3>
                <span className="text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                  Mobile OTP Barrier
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                CAREQ High-Assurance Identity Gateway
              </p>
            </div>
          </div>
          {stage !== 'TRANSITIONING' && (
            <button
              type="button"
              onClick={handleClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* STAGE 1: SECURITY CONFIRMATION SCREEN (Section 18 Spec)                   */}
        {/* ========================================================================= */}
        {stage === 'CONFIRMATION' && (
          <div className="p-6 space-y-5 text-xs text-slate-700 overflow-y-auto">
            
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">
                You are requesting access to your {isSwitchingToClinical ? 'Healthcare Professional' : 'Patient'} workspace.
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                For your security, CAREQ requires verified Mobile OTP confirmation before changing your workspace. This prevents unauthorized workspace switching and ensures strict session isolation.
              </p>
            </div>

            {/* Current vs Target Workspace Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
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
                  {isSwitchingToClinical ? 'Dr. Ananya Sharma • Medical Officer' : 'Riya Das • PAT-2026-00124'}
                </div>
              </div>
            </div>

            {/* Clinical Justification (When entering clinical workspace) */}
            {isSwitchingToClinical && (
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-800">
                  Clinical Session Purpose <span className="text-red-500">*</span>
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

            {/* Registered Mobile Confirmation */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Target Verification Destination:
              </span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-teal-700" />
                  <span className="font-semibold text-slate-800">
                    Registered Mobile Number: <span className="font-mono">{maskedMobile}</span>
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Verified SMS
                </span>
              </div>
            </div>

            {/* Error Message & Missing Configuration (Section 37 Spec) */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1.5 text-red-900">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                {missingConfig.length > 0 && (
                  <div className="text-[11px] text-red-700 bg-white/60 p-2 rounded border border-red-200 space-y-0.5 font-mono">
                    <span className="font-bold">Missing Environment Variables:</span>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {missingConfig.map(c => <li key={c}>{c}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Strict Session Isolation Notice */}
            <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl space-y-1 text-amber-950">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>Strict Session & Memory Invalidation</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-900/90">
                Once Mobile OTP is verified, the current {currentRole === 'PATIENT' ? 'Patient' : 'Clinical'} session will be permanently terminated. Incomplete local drafts and temporary recording buffers are wiped to prevent cross-role data leaks.
              </p>
            </div>

            {/* Actions */}
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
                type="button"
                onClick={handleSendOtp}
                disabled={isProcessing}
                className="px-5 py-2.5 bg-[#0A1E3F] hover:bg-[#163B66] text-white font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                {isProcessing ? (
                  <span>Dispatching Code…</span>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4 text-teal-400" />
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 2: MOBILE OTP ENTRY SCREEN (Section 19 Spec)                        */}
        {/* ========================================================================= */}
        {stage === 'OTP_ENTRY' && (
          <form onSubmit={handleVerifyOtp} className="p-6 space-y-5 text-xs text-slate-700 overflow-y-auto">
            
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">
                We've sent a verification code to your registered mobile number:
              </h4>
              <div className="text-sm font-mono font-bold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200 inline-block">
                {maskedMobile}
              </div>
            </div>

            {/* 6-Digit OTP Input Box */}
            <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <label className="font-bold text-slate-800">
                  Enter 6-Digit Mobile Verification Code
                </label>
                {devToken && (
                  <button
                    type="button"
                    onClick={() => { setMobileOtp(devToken); setErrorMessage(null); }}
                    className="text-teal-800 hover:underline font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-teal-600" />
                    <span>Auto-fill Dev SMS ({devToken})</span>
                  </button>
                )}
              </div>

              <input
                type="text"
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
                value={mobileOtp}
                onChange={(e) => setMobileOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                autoFocus
                className="w-full text-center tracking-widest text-2xl font-mono font-black p-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-teal-700 outline-hidden"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Code expires in <strong className="font-mono text-slate-800">{formatTimer(expiresIn)}</strong></span>
                </span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0 || isProcessing}
                  className={`font-semibold flex items-center gap-1 ${
                    cooldown > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-teal-800 hover:underline'
                  }`}
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}</span>
                </button>
              </div>
            </div>

            {/* Error State */}
            {errorMessage && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStage('CONFIRMATION')}
                className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold transition-all text-xs"
                disabled={isProcessing}
              >
                Back to Confirmation
              </button>
              <div className="flex gap-2">
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
                  disabled={isProcessing || mobileOtp.length !== 6}
                  className={`px-5 py-2.5 font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 ${
                    mobileOtp.length === 6 && !isProcessing
                      ? 'bg-[#0A1E3F] hover:bg-[#163B66] text-white cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? (
                    <span>Verifying Code…</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      <span>Verify & Continue</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        )}

        {/* ========================================================================= */}
        {/* STAGE 3: SUCCESSFUL WORKSPACE TRANSITION (Section 20 Spec)                 */}
        {/* ========================================================================= */}
        {stage === 'TRANSITIONING' && (
          <div className="p-8 space-y-6 text-center">
            
            <div className="w-14 h-14 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mx-auto animate-pulse">
              <Lock className="w-7 h-7 text-teal-600" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-slate-900">
                Authorizing Workspace Transition
              </h4>
              <p className="text-xs text-slate-500">
                Cryptographic session handover in progress...
              </p>
            </div>

            {/* Step-by-Step Security Transition Checklist (Section 20 Spec) */}
            <div className="max-w-xs mx-auto space-y-2 text-left text-xs">
              
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">Verifying your identity...</span>
                {transitionStep >= 1 ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                    <Check className="w-3.5 h-3.5" /> Mobile verified
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px]">Pending</span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">Securing previous workspace...</span>
                {transitionStep >= 2 ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                    <Check className="w-3.5 h-3.5" /> Terminated
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px]">Pending</span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">Creating new workspace session...</span>
                {transitionStep >= 3 ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                    <Check className="w-3.5 h-3.5" /> Created
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px]">Pending</span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">Applying permissions...</span>
                {transitionStep >= 4 ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                    <Check className="w-3.5 h-3.5" /> Applied
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px]">Pending</span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-teal-50 border border-teal-200">
                <span className="text-teal-950 font-bold">Opening {isSwitchingToClinical ? 'Clinical' : 'Patient'} Workspace...</span>
                {transitionStep >= 5 ? (
                  <span className="text-teal-700 font-bold flex items-center gap-1 text-[11px]">
                    <Check className="w-3.5 h-3.5" /> Ready
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px]">Authorizing</span>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
