import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';
import { MOCK_PATIENTS, MOCK_DOCTORS } from '../../data/mockData';
import { UserRole } from '../../types';
import { 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  ArrowRight, 
  Stethoscope, 
  User, 
  AlertCircle, 
  Activity, 
  CheckCircle2, 
  ArrowLeft,
  Mail, 
  Sparkles,
  Clock,
  RotateCw,
  KeyRound
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { navigate, sendEmailOtp, verifyEmailOtp, loginAsPatient, loginAsDoctor } = useApp();
  const { t } = useLanguage();

  // Authentication Mode: EMAIL_OTP (Primary per specs) vs LEGACY_PASSWORD
  const [authMode, setAuthMode] = useState<'EMAIL_OTP' | 'PASSWORD'>('EMAIL_OTP');

  // Email OTP Flow Stages: 'INPUT_EMAIL' | 'VERIFY_OTP' | 'SUCCESS_TRANSITION'
  const [otpStage, setOtpStage] = useState<'INPUT_EMAIL' | 'VERIFY_OTP' | 'SUCCESS_TRANSITION'>('INPUT_EMAIL');

  // Input states
  const [emailInput, setEmailInput] = useState('riya.das.demo@careq-health.org');
  const [targetWorkspace, setTargetWorkspace] = useState<UserRole>('PATIENT');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [missingConfig, setMissingConfig] = useState<string[] | null>(null);

  // Expiration countdown (300 seconds = 5 minutes)
  const [timeLeft, setTimeLeft] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Ref for input auto-focus
  const digitInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password fallback mode states
  const [viewState, setViewState] = useState<'CHOICE' | 'PATIENT_SIGNIN' | 'DOCTOR_SIGNIN'>('CHOICE');
  const [selectedDemoPatient, setSelectedDemoPatient] = useState(MOCK_PATIENTS[0].id);
  const [selectedDemoDoctor, setSelectedDemoDoctor] = useState(MOCK_DOCTORS[0].id);
  const [pwdIdentifier, setPwdIdentifier] = useState('9876543210');
  const [pwdValue, setPwdValue] = useState('••••••••');

  // Handle countdown timers
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (otpStage === 'VERIFY_OTP' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpStage, timeLeft]);

  useEffect(() => {
    let cooldownTimer: ReturnType<typeof setInterval>;
    if (resendCooldown > 0) {
      cooldownTimer = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(cooldownTimer);
  }, [resendCooldown]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Mask email for privacy (e.g., "so****@example.com")
  const getMaskedEmail = (raw: string) => {
    if (!raw.includes('@')) return raw;
    const [user, domain] = raw.split('@');
    if (user.length <= 2) return `${user}***@${domain}`;
    return `${user.slice(0, 2)}****@${domain}`;
  };

  // 1. Send Email OTP
  const handleSendEmailOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      setOtpError('Please enter a valid email address.');
      return;
    }

    setIsSendingOtp(true);
    setOtpError(null);
    setMissingConfig(null);

    const result = await sendEmailOtp(emailInput.trim(), 'login', targetWorkspace);
    setIsSendingOtp(false);

    if (result.success) {
      setOtpStage('VERIFY_OTP');
      setTimeLeft(300);
      setResendCooldown(60);
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => {
        digitInputRefs.current[0]?.focus();
      }, 150);
    } else {
      if (result.missingConfig && result.missingConfig.length > 0) {
        setMissingConfig(result.missingConfig);
      }
      setOtpError(result.message || 'We could not send the verification code. Please try again.');
    }
  };

  // 2. Digit input change & auto-advance
  const handleDigitChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = val.slice(-1);
    setOtpDigits(newDigits);
    setOtpError(null);

    if (val && index < 5) {
      digitInputRefs.current[index + 1]?.focus();
    }

    // Auto verify when all 6 digits entered
    const fullCode = newDigits.join('');
    if (fullCode.length === 6 && !newDigits.includes('')) {
      handleVerifyOtp(fullCode);
    }
  };

  // 3. Paste support
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const split = pasted.split('');
      setOtpDigits(split);
      digitInputRefs.current[5]?.focus();
      handleVerifyOtp(pasted);
    }
  };

  // 4. Backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitInputRefs.current[index - 1]?.focus();
    }
  };

  // 5. Verify OTP
  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length !== 6) {
      setOtpError('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);

    const result = await verifyEmailOtp(emailInput.trim(), code, 'login');
    setIsVerifyingOtp(false);

    if (result.success) {
      setOtpSuccessMessage('✓ Email verified successfully. Entering your workspace...');
      setOtpStage('SUCCESS_TRANSITION');
      setTimeout(() => {
        if (targetWorkspace === 'HEALTHCARE_PROFESSIONAL') {
          loginAsDoctor(selectedDemoDoctor);
        } else {
          loginAsPatient(selectedDemoPatient);
        }
      }, 1000);
    } else {
      setOtpError(result.message || 'The verification code is incorrect. Please try again.');
    }
  };



  // Quick Demo Auto-fills
  const handleSelectDemoUser = (type: 'PATIENT' | 'DOCTOR') => {
    if (type === 'PATIENT') {
      setEmailInput('riya.das.demo@careq-health.org');
      setTargetWorkspace('PATIENT');
      setSelectedDemoPatient(MOCK_PATIENTS[0].id);
    } else {
      setEmailInput('dr.ananya.sharma@careq-health.gov.in');
      setTargetWorkspace('HEALTHCARE_PROFESSIONAL');
      setSelectedDemoDoctor(MOCK_DOCTORS[0].id);
    }
    setOtpError(null);
    setMissingConfig(null);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-[#F8FAFC]">
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* ========================================================================= */}
        {/* LEFT PANEL — BRAND EXPERIENCE & HEALTHCARE ARCHITECTURE                    */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 bg-[#F4F7FB] border-b lg:border-b-0 lg:border-r border-slate-200 p-8 sm:p-12 lg:p-14 flex flex-col justify-between space-y-8">
          
          <div className="space-y-8">
            {/* Header Identity */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#0A1E3F] text-white flex items-center justify-center shadow-xs">
                  <Activity className="w-5 h-5 text-teal-400 stroke-[2.4]" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1E3F] font-sans">
                  CAREQ
                </h1>
              </div>

              <div className="space-y-1 pt-2">
                <h2 className="text-xl sm:text-2xl font-bold text-[#0A1E3F] tracking-tight leading-snug">
                  {t('common.tagline')}
                </h2>
                <h2 className="text-xl sm:text-2xl font-bold text-teal-700 tracking-tight leading-snug">
                  {t('common.taglineSubtitle')}
                </h2>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed max-w-lg pt-1">
                {t('auth.brandSummary')}
              </p>
            </div>

            {/* Three Security & Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-1 shadow-2xs">
                <div className="text-emerald-700 flex items-center gap-1.5 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Email & Mobile OTP</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Cryptographic salted tokens for zero-trust identity verification.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-1 shadow-2xs">
                <div className="text-teal-800 flex items-center gap-1.5 font-bold text-xs">
                  <Lock className="w-4 h-4 text-teal-600" />
                  <span>Isolated Sessions</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Strict boundary between Patient and Clinical workspaces.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-1 shadow-2xs">
                <div className="text-blue-900 flex items-center gap-1.5 font-bold text-xs">
                  <UserCheck className="w-4 h-4 text-blue-700" />
                  <span>{t('auth.trustHuman')}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Certified clinical triage support with immutable audit logging.
                </p>
              </div>
            </div>

            {/* Abstract Healthcare Data Flow */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-2xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Multi-Workspace Architecture</span>
                <span className="text-teal-700 font-mono font-semibold">Separate RBAC Boundaries</span>
              </div>
              
              <div className="flex flex-col items-center space-y-2 text-xs">
                <div className="w-full max-w-sm py-2 px-3 rounded-md bg-slate-50 border border-slate-200 text-center font-semibold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    <span>Patient Workspace</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">/patient/* • Voice & OCR</span>
                </div>

                <div className="text-slate-400 text-xs font-mono">↕ Mobile OTP Guarded Switch ↕</div>

                <div className="w-full max-w-sm py-2 px-3 rounded-md bg-emerald-50 border border-emerald-200 text-center font-semibold text-emerald-950 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Healthcare Professional Workspace</span>
                  </span>
                  <span className="text-[10px] text-emerald-800 font-mono">/clinical/* • Clinical Review</span>
                </div>
              </div>
            </div>

          </div>

          {/* Prototype Footnote */}
          <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>
              <strong>{t('common.educationalPrototype')}:</strong> {t('common.prototypeNotice')}
            </span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL — AUTHENTICATION CARD                                         */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-center bg-white relative">
          {/* Top-right Language Selector */}
          <div className="absolute top-4 right-4 z-10">
            <LanguageSelector variant="compact" />
          </div>

          <div className="max-w-md w-full mx-auto space-y-6 pt-6 sm:pt-0">

            {/* ===================================================================== */}
            {/* PRIMARY FLOW: FUNCTIONAL EMAIL OTP AUTHENTICATION                     */}
            {/* ===================================================================== */}
            {authMode === 'EMAIL_OTP' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                
                {/* STAGE A: ENTER EMAIL */}
                {otpStage === 'INPUT_EMAIL' && (
                  <div className="space-y-5">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded mb-2">
                        <Mail className="w-3 h-3 text-teal-700" />
                        <span>Functional Email OTP Verification</span>
                      </div>
                      <h2 className="text-2xl font-extrabold text-[#0A1E3F] tracking-tight">
                        {t('auth.emailOtpLoginTitle')}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        {t('auth.emailOtpLoginSubtitle')}
                      </p>
                    </div>

                    {/* Evaluator Quick-Fill Cards */}
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-700 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-teal-700" />
                          <span>Evaluator Quick-Fill:</span>
                        </span>
                        <span className="text-[10px] text-teal-800 font-mono font-semibold">1-Click Auto-Fill</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectDemoUser('PATIENT')}
                          className={`p-2 rounded text-left border text-xs transition-colors ${
                            targetWorkspace === 'PATIENT'
                              ? 'bg-white border-[#0A1E3F] font-bold text-[#0A1E3F] shadow-2xs' 
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="truncate font-semibold">Riya Das</div>
                          <div className="text-[10px] text-slate-400 font-normal">Patient Workspace</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectDemoUser('DOCTOR')}
                          className={`p-2 rounded text-left border text-xs transition-colors ${
                            targetWorkspace === 'HEALTHCARE_PROFESSIONAL'
                              ? 'bg-white border-teal-700 font-bold text-teal-900 shadow-2xs' 
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="truncate font-semibold">Dr. Ananya Sharma</div>
                          <div className="text-[10px] text-slate-400 font-normal">Clinical Review</div>
                        </button>
                      </div>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleSendEmailOtp} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          {t('auth.emailAddress')}
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="email"
                            required
                            value={emailInput}
                            onChange={(e) => {
                              setEmailInput(e.target.value);
                              setOtpError(null);
                            }}
                            placeholder="e.g. yourname@example.com"
                            className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden font-medium text-xs"
                          />
                        </div>
                      </div>

                      {/* Target Workspace Selector */}
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          {t('auth.targetWorkspaceLabel')}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setTargetWorkspace('PATIENT')}
                            className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                              targetWorkspace === 'PATIENT'
                                ? 'bg-slate-900 text-white border-slate-900 font-semibold shadow-xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                            }`}
                          >
                            <User className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{t('auth.patientWorkspaceOption')}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setTargetWorkspace('HEALTHCARE_PROFESSIONAL')}
                            className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                              targetWorkspace === 'HEALTHCARE_PROFESSIONAL'
                                ? 'bg-teal-700 text-white border-teal-700 font-semibold shadow-xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                            }`}
                          >
                            <Stethoscope className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{t('auth.clinicalWorkspaceOption')}</span>
                          </button>
                        </div>
                      </div>

                      {/* Error Banner */}
                      {otpError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-semibold">{otpError}</div>
                            {missingConfig && missingConfig.length > 0 && (
                              <div className="mt-1 text-[11px] font-mono text-red-800">
                                Missing environment variables: {missingConfig.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSendingOtp}
                        className="w-full py-2.5 bg-[#0A1E3F] hover:bg-[#07152c] disabled:opacity-50 text-white rounded-lg font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2"
                      >
                        {isSendingOtp ? (
                          <>
                            <RotateCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Generating & Sending OTP...</span>
                          </>
                        ) : (
                          <>
                            <span>{t('auth.continueEmailOtpBtn')}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </form>

                    {/* Secondary actions: Register Patient or legacy password fallback */}
                    <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100 flex flex-col gap-2">
                      <div>
                        {t('auth.dontHaveAccount', "Don't have a patient account?")}{' '}
                        <button
                          onClick={() => navigate('/register/patient')}
                          className="font-bold text-teal-800 hover:underline"
                        >
                          {t('auth.createPatientAccount')}
                        </button>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('PASSWORD');
                            setViewState('CHOICE');
                          }}
                          className="text-[11px] text-slate-400 hover:text-slate-600 hover:underline"
                        >
                          Alternate: Sign in with password (Legacy/Demo)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STAGE B: VERIFY 6-DIGIT EMAIL OTP */}
                {otpStage === 'VERIFY_OTP' && (
                  <div className="space-y-5 animate-in fade-in duration-150">
                    <button
                      type="button"
                      onClick={() => setOtpStage('INPUT_EMAIL')}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{t('auth.changeEmail')}</span>
                    </button>

                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded mb-2">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Security Challenge</span>
                      </div>
                      <h2 className="text-2xl font-extrabold text-[#0A1E3F] tracking-tight">
                        {t('auth.verifyEmailTitle')}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        {t('auth.verifyEmailSubtitle')}
                      </p>
                      <div className="text-xs font-mono font-bold text-slate-800 mt-0.5">
                        {getMaskedEmail(emailInput)}
                      </div>
                    </div>



                    {/* 6-Digit OTP Entry */}
                    <div className="space-y-4">
                      <div className="flex justify-between gap-2 max-w-xs mx-auto">
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => { digitInputRefs.current[idx] = el; }}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleDigitChange(idx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            onPaste={handlePaste}
                            className={`w-11 h-12 text-center text-lg font-mono font-bold rounded-lg border transition-all outline-hidden ${
                              digit
                                ? 'border-[#0A1E3F] bg-blue-50/30 text-slate-900 shadow-2xs'
                                : 'border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Expiration Timer & Resend */}
                      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{t('auth.codeExpiresIn')} <strong className="font-mono text-slate-800">{formatTime(timeLeft)}</strong></span>
                        </div>

                        <button
                          type="button"
                          disabled={resendCooldown > 0 || isSendingOtp}
                          onClick={() => handleSendEmailOtp()}
                          className="font-semibold text-teal-800 hover:underline disabled:opacity-40 disabled:no-underline"
                        >
                          {resendCooldown > 0
                            ? `${t('auth.resendCode')} (${resendCooldown}s)`
                            : t('auth.resendCode')}
                        </button>
                      </div>

                      {/* Error Display */}
                      {otpError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{otpError}</span>
                        </div>
                      )}

                      {/* Verify Button */}
                      <button
                        type="button"
                        disabled={isVerifyingOtp || otpDigits.includes('')}
                        onClick={() => handleVerifyOtp()}
                        className="w-full py-2.5 bg-[#0A1E3F] hover:bg-[#07152c] disabled:opacity-50 text-white rounded-lg font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2"
                      >
                        {isVerifyingOtp ? (
                          <>
                            <RotateCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Verifying Code with Server...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                            <span>{t('auth.verifyAndContinue')}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="pt-2 text-center text-[11px] text-slate-400">
                      Never share your OTP with anyone. CAREQ staff will never ask for your verification code.
                    </div>
                  </div>
                )}

                {/* STAGE C: SUCCESS TRANSITION */}
                {otpStage === 'SUCCESS_TRANSITION' && (
                  <div className="py-8 text-center space-y-4 animate-in fade-in">
                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xs">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-base text-slate-900">
                        {otpSuccessMessage || t('auth.emailVerifiedSuccess')}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Issuing authenticated session credentials and opening workspace...
                      </p>
                    </div>
                    <div className="flex justify-center pt-2">
                      <RotateCw className="w-5 h-5 animate-spin text-teal-700" />
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ===================================================================== */}
            {/* SECONDARY / LEGACY ROLE-BASED PASSWORD SIGN-IN (Preserved)           */}
            {/* ===================================================================== */}
            {authMode === 'PASSWORD' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={() => setAuthMode('EMAIL_OTP')}
                  className="text-xs text-teal-800 hover:underline flex items-center gap-1 font-bold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Recommended Email OTP Login</span>
                </button>

                {/* Role Selection View */}
                {viewState === 'CHOICE' && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-extrabold text-[#0A1E3F] tracking-tight">
                        {t('auth.welcomeTitle')}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Select workspace for legacy demonstration login.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="p-4 rounded-lg border border-slate-200 hover:border-slate-400 bg-white transition-all space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-teal-50 text-teal-700 flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900">{t('auth.patientRoleTitle')}</h4>
                            <p className="text-[11px] text-slate-500">{t('auth.patientRoleDesc')}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setViewState('PATIENT_SIGNIN')}
                          className="w-full py-2 bg-[#0A1E3F] text-white rounded text-xs font-semibold"
                        >
                          {t('auth.continuePatientBtn')}
                        </button>
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 hover:border-slate-400 bg-white transition-all space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-blue-50 text-blue-800 flex items-center justify-center">
                            <Stethoscope className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900">{t('auth.clinicalRoleTitle')}</h4>
                            <p className="text-[11px] text-slate-500">{t('auth.clinicalRoleDesc')}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setViewState('DOCTOR_SIGNIN')}
                          className="w-full py-2 bg-teal-700 text-white rounded text-xs font-semibold"
                        >
                          {t('auth.continueClinicalBtn')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Patient Sign In Form */}
                {viewState === 'PATIENT_SIGNIN' && (
                  <form onSubmit={(e) => { e.preventDefault(); loginAsPatient(selectedDemoPatient); }} className="space-y-4 text-xs">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{t('auth.patientSignInTitle')}</h3>
                      <p className="text-xs text-slate-500">Sign in with demo credentials.</p>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">{t('auth.mobileOrEmail')}</label>
                      <input
                        type="text"
                        value={pwdIdentifier}
                        onChange={(e) => setPwdIdentifier(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">{t('auth.password')}</label>
                      <input
                        type="password"
                        value={pwdValue}
                        onChange={(e) => setPwdValue(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-900 font-mono"
                      />
                    </div>
                    <button type="submit" className="w-full py-2 bg-[#0A1E3F] text-white rounded font-bold text-xs">
                      {t('auth.signInBtn')}
                    </button>
                  </form>
                )}

                {/* Doctor Sign In Form */}
                {viewState === 'DOCTOR_SIGNIN' && (
                  <form onSubmit={(e) => { e.preventDefault(); loginAsDoctor(selectedDemoDoctor); }} className="space-y-4 text-xs">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{t('auth.clinicalSignInTitle')}</h3>
                      <p className="text-xs text-slate-500">{t('auth.clinicalSubtitle')}</p>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">{t('auth.professionalId')}</label>
                      <input
                        type="text"
                        value={selectedDemoDoctor}
                        readOnly
                        className="w-full p-2 bg-slate-100 border border-slate-200 rounded font-mono text-slate-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">{t('auth.mobileOrEmail')}</label>
                      <input
                        type="text"
                        value="dr.ananya@careq-health.gov.in"
                        readOnly
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-900"
                      />
                    </div>
                    <button type="submit" className="w-full py-2 bg-teal-700 text-white rounded font-bold text-xs">
                      {t('auth.signInBtn')}
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
