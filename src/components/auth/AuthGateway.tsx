import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';
import { UserRole, EmailOtpVerifyResponse } from '../../types';
import { 
  Activity, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  Stethoscope, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft,
  Mail, 
  Clock, 
  RotateCw, 
  KeyRound,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const AuthGateway: React.FC = () => {
  const { sendEmailOtp, verifyEmailOtp, loginWithVerifiedSession, navigate } = useApp();
  const { t } = useLanguage();

  // Gateway Stages: 'REQUEST_OTP' | 'VERIFY_OTP' | 'SELECT_WORKSPACE' | 'SIGN_UP_CHOICE'
  const [gatewayStage, setGatewayStage] = useState<'REQUEST_OTP' | 'VERIFY_OTP' | 'SELECT_WORKSPACE' | 'SIGN_UP_CHOICE'>('REQUEST_OTP');

  // Input States
  const [emailInput, setEmailInput] = useState('riya.das.demo@careq-health.org');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [maskedEmail, setMaskedEmail] = useState('');
  
  // Status & Feedback States
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [missingConfig, setMissingConfig] = useState<string[] | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);

  // Timers
  const [expiresIn, setExpiresIn] = useState(300); // 5 minutes (300s)
  const [resendCooldown, setResendCooldown] = useState(0); // 60s cooldown

  // Verified Multi-role transition holder
  const [verifiedResponse, setVerifiedResponse] = useState<EmailOtpVerifyResponse | null>(null);

  // Auto-focus refs
  const digitInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Expiration countdown
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (gatewayStage === 'VERIFY_OTP' && expiresIn > 0) {
      timer = setInterval(() => {
        setExpiresIn(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gatewayStage, expiresIn]);

  // Resend cooldown countdown
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 1. Send Email OTP Request
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage(t('auth.invalidEmail') || 'Please enter a valid email address.');
      return;
    }

    setIsSending(true);
    setErrorMessage(null);
    setMissingConfig(null);

    const result = await sendEmailOtp(cleanEmail, 'login');
    setIsSending(false);

    if (result.success) {
      setMaskedEmail(result.maskedEmail || cleanEmail);
      setGatewayStage('VERIFY_OTP');
      setExpiresIn(result.expiresInSeconds || 300);
      setResendCooldown(result.cooldownSeconds || 60);
      setOtpDigits(['', '', '', '', '', '']);
      setAttemptsRemaining(null);
      setTimeout(() => {
        digitInputRefs.current[0]?.focus();
      }, 150);
    } else {
      if (result.missingConfig && result.missingConfig.length > 0) {
        setMissingConfig(result.missingConfig);
      }
      setErrorMessage(result.message || 'We could not send the verification code. Please try again.');
    }
  };

  // 2. OTP Digit Change & Auto-Advance
  const handleDigitChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = val.slice(-1);
    setOtpDigits(newDigits);
    setErrorMessage(null);

    if (val && index < 5) {
      digitInputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits entered
    const fullCode = newDigits.join('');
    if (fullCode.length === 6 && !newDigits.includes('')) {
      handleVerifyOtp(fullCode);
    }
  };

  // 3. Paste Support
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

  // 4. Backspace Navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitInputRefs.current[index - 1]?.focus();
    }
  };

  // 5. Verify OTP
  const handleVerifyOtp = async (codeOverride?: string) => {
    const code = codeOverride || otpDigits.join('');
    if (code.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    const result = await verifyEmailOtp(emailInput.trim().toLowerCase(), code, 'login');
    setIsVerifying(false);

    if (result.success) {
      setSuccessMessage('✓ Email verified successfully. Authenticating session...');
      
      // Check if account has multiple verified roles (Section 6)
      if (result.verifiedRoles && result.verifiedRoles.length > 1) {
        setVerifiedResponse(result);
        setGatewayStage('SELECT_WORKSPACE');
      } else {
        // Direct entry based on server authoritative role
        setTimeout(() => {
          loginWithVerifiedSession(result);
        }, 600);
      }
    } else {
      if (typeof result.attemptsRemaining === 'number') {
        setAttemptsRemaining(result.attemptsRemaining);
      }
      setErrorMessage(result.message || 'The verification code is incorrect. Please try again.');
    }
  };

  // 6. Multi-role workspace selection handler
  const handleSelectWorkspace = (chosenRole: UserRole) => {
    if (!verifiedResponse) return;
    const overriddenResponse: EmailOtpVerifyResponse = {
      ...verifiedResponse,
      role: chosenRole
    };
    loginWithVerifiedSession(overriddenResponse);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4 bg-gradient-to-b from-slate-100 via-slate-50 to-teal-50/30">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
        
        {/* Gateway Header Banner */}
        <div className="bg-[#0A1E3F] p-6 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2DD4BF_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Language Switcher in Header */}
            <div className="absolute top-0 right-0">
              <LanguageSelector />
            </div>

            {/* Emblem */}
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-inner mb-3">
              <Activity className="w-6 h-6 stroke-[2.4]" />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-extrabold tracking-tight">CAREQ</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-400/20 text-teal-200 border border-teal-300/30 px-2 py-0.5 rounded-full">
                Healthcare Gateway
              </span>
            </div>

            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Connected Health Information. Faster Clinical Review.
            </p>
          </div>
        </div>

        {/* Sign In vs Sign Up Tabs */}
        {gatewayStage !== 'VERIFY_OTP' && gatewayStage !== 'SELECT_WORKSPACE' && (
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => {
                setGatewayStage('REQUEST_OTP');
                setErrorMessage(null);
              }}
              className={`flex-1 py-3 text-center text-xs font-bold transition-all border-b-2 ${
                gatewayStage === 'REQUEST_OTP'
                  ? 'border-[#0A1E3F] text-[#0A1E3F]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t('auth.signInTab') || 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => {
                setGatewayStage('SIGN_UP_CHOICE');
                setErrorMessage(null);
              }}
              className={`flex-1 py-3 text-center text-xs font-bold transition-all border-b-2 ${
                gatewayStage === 'SIGN_UP_CHOICE'
                  ? 'border-[#0A1E3F] text-[#0A1E3F]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t('auth.signUpTab') || 'Create Account'}
            </button>
          </div>
        )}

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* ========================================================= */}
          {/* STAGE 1: REQUEST OTP (SIGN IN)                            */}
          {/* ========================================================= */}
          {gatewayStage === 'REQUEST_OTP' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="space-y-1 text-center">
                <h2 className="text-xl font-extrabold text-[#0A1E3F] tracking-tight">
                  {t('auth.gatewayTitle') || 'Sign in to CAREQ'}
                </h2>
                <p className="text-xs text-slate-600">
                  {t('auth.gatewaySubtitle') || 'Secure access to your CAREQ healthcare workspace.'}
                </p>
              </div>

              {/* Security Pill */}
              <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-teal-50/80 border border-teal-200/80 rounded-full text-[11px] font-medium text-teal-900 mx-auto w-fit">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                <span>{t('auth.secureEmailVerification') || 'Secure email verification'}</span>
              </div>

              {/* Error Box */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">{errorMessage}</p>
                    {missingConfig && missingConfig.length > 0 && (
                      <div className="text-[11px] text-red-700 bg-white/70 p-2 rounded border border-red-200 font-mono">
                        <span className="font-bold">Missing configuration:</span> {missingConfig.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="careq-email" className="block text-xs font-bold text-slate-700">
                    {t('auth.emailAddressLabel') || 'Email address'}
                  </label>
                  <div className="relative">
                    <input
                      id="careq-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder={t('auth.emailPlaceholder') || 'name@careq-health.gov.in'}
                      disabled={isSending}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-700 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-2.5 px-4 bg-[#0A1E3F] hover:bg-[#163B66] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin text-teal-400" />
                      <span>{t('auth.sendingCode') || 'Sending verification code...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('auth.sendVerificationCodeBtn') || 'Send verification code'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Evaluator Access Section */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Evaluator Quick Fill</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Pre-registered identities</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmailInput('riya.das.demo@careq-health.org');
                      setErrorMessage(null);
                    }}
                    className="p-2 text-left rounded-lg border border-slate-200 hover:border-teal-400 bg-slate-50 hover:bg-teal-50/50 transition-all text-[11px]"
                  >
                    <div className="font-bold text-[#0A1E3F] flex items-center gap-1">
                      <User className="w-3 h-3 text-teal-600" />
                      <span>Riya Das</span>
                    </div>
                    <div className="text-[10px] text-slate-500">Patient Workspace</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmailInput('dr.ananya.sharma@careq-health.gov.in');
                      setErrorMessage(null);
                    }}
                    className="p-2 text-left rounded-lg border border-slate-200 hover:border-teal-400 bg-slate-50 hover:bg-teal-50/50 transition-all text-[11px]"
                  >
                    <div className="font-bold text-[#0A1E3F] flex items-center gap-1">
                      <Stethoscope className="w-3 h-3 text-teal-600" />
                      <span>Dr. Sharma</span>
                    </div>
                    <div className="text-[10px] text-slate-500">Clinical Workspace</div>
                  </button>
                </div>
              </div>

              {/* Don't have an account? Sign up link */}
              <div className="pt-2 text-center text-xs text-slate-600 border-t border-slate-100">
                <span>{t('auth.newToCareqPrompt') || "Don't have an account?"} </span>
                <button
                  type="button"
                  onClick={() => setGatewayStage('SIGN_UP_CHOICE')}
                  className="font-bold text-teal-800 hover:text-teal-950 underline inline-flex items-center gap-0.5"
                >
                  <span>{t('auth.createAccountLink') || 'Sign up here'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Security Privacy Notice */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
                <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>
                  {t('auth.gatewaySecurityNote') || 'All sessions are end-to-end encrypted, role-isolated, and audited under Digital Health Security Standards.'}
                </span>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* STAGE: SIGN UP CHOICE                                     */}
          {/* ========================================================= */}
          {gatewayStage === 'SIGN_UP_CHOICE' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              <div className="space-y-1 text-center">
                <h2 className="text-xl font-extrabold text-[#0A1E3F] tracking-tight">
                  {t('auth.signUpTitle') || 'Create your CAREQ Account'}
                </h2>
                <p className="text-xs text-slate-600">
                  {t('auth.signUpSubtitle') || 'Select your healthcare role to start registration'}
                </p>
              </div>

              {/* Registration Option 1: Patient */}
              <div 
                onClick={() => navigate('/register/patient')}
                className="p-4 rounded-xl border border-slate-200 hover:border-teal-500 bg-white hover:bg-teal-50/30 transition-all cursor-pointer shadow-xs hover:shadow-md group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center text-teal-800 group-hover:bg-teal-800 group-hover:text-white transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#0A1E3F] group-hover:text-teal-900">
                        {t('auth.patientRoleTitle') || 'Patient / Family Caregiver'}
                      </div>
                      <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                        Personal Health Access
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-800 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed pl-11">
                  {t('auth.patientSignUpDesc') || 'Submit voice assessments, manage records locker, and control clinical data sharing consent.'}
                </p>
                <div className="pt-1 pl-11">
                  <span className="text-xs font-bold text-teal-800 group-hover:underline inline-flex items-center gap-1">
                    <span>{t('auth.registerPatientBtn') || 'Register as Patient'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Registration Option 2: Healthcare Professional */}
              <div 
                onClick={() => navigate('/register/doctor')}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 bg-white hover:bg-indigo-50/30 transition-all cursor-pointer shadow-xs hover:shadow-md group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-800 group-hover:bg-indigo-800 group-hover:text-white transition-colors">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#0A1E3F] group-hover:text-indigo-900">
                        {t('auth.clinicalRoleTitle') || 'Healthcare Worker / Clinician'}
                      </div>
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                        Accredited Clinical Review
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-800 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed pl-11">
                  {t('auth.clinicianSignUpDesc') || 'Access emergency triage queue, verify medical council ID, and generate structured referrals.'}
                </p>
                <div className="pt-1 pl-11">
                  <span className="text-xs font-bold text-indigo-800 group-hover:underline inline-flex items-center gap-1">
                    <span>{t('auth.registerDoctorBtn') || 'Register as Healthcare Professional'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Bottom toggle back to Sign In */}
              <div className="pt-2 text-center text-xs text-slate-600 border-t border-slate-100">
                <span>{t('auth.alreadyHaveAccountPrompt') || 'Already have an account?'} </span>
                <button
                  type="button"
                  onClick={() => setGatewayStage('REQUEST_OTP')}
                  className="font-bold text-teal-800 hover:text-teal-950 underline"
                >
                  {t('auth.signInEmailOtpLink') || 'Sign in with Email OTP'}
                </button>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* STAGE 2: VERIFY OTP                                       */}
          {/* ========================================================= */}
          {gatewayStage === 'VERIFY_OTP' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="space-y-1 text-center">
                <h2 className="text-xl font-extrabold text-[#0A1E3F] tracking-tight">
                  {t('auth.verifyEmailHeading') || 'Verify your email'}
                </h2>
                <p className="text-xs text-slate-600">
                  {t('auth.verifyEmailInstruction') || 'Enter the 6-digit verification code sent to your email.'}
                </p>
              </div>

              {/* Masked Email Badge & Change Action */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-teal-700" />
                  <span className="font-mono font-bold text-slate-800">{maskedEmail}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setGatewayStage('REQUEST_OTP');
                    setErrorMessage(null);
                  }}
                  className="text-xs text-teal-800 hover:text-teal-900 font-bold hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>{t('auth.changeEmail') || 'Change'}</span>
                </button>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">{errorMessage}</p>
                    {attemptsRemaining !== null && attemptsRemaining > 0 && (
                      <p className="text-[11px] text-red-700 font-medium">
                        {attemptsRemaining} {t('auth.attemptsRemaining') || 'attempts remaining'}.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Success Banner */}
              {successMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-bold">{successMessage}</span>
                </div>
              )}

              {/* 6-Digit OTP Entry Boxes */}
              <div className="space-y-3">
                <div className="flex justify-between gap-1.5 sm:gap-2 max-w-xs mx-auto">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { digitInputRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      autoComplete="one-time-code"
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={handlePaste}
                      disabled={isVerifying}
                      aria-label={`Digit ${idx + 1} of verification code`}
                      className={`w-11 h-12 text-center text-lg font-bold font-mono rounded-xl border bg-slate-50 transition-all focus:outline-hidden focus:ring-2 focus:ring-teal-700 focus:bg-white ${
                        digit ? 'border-teal-700 text-teal-900 bg-teal-50/30' : 'border-slate-300 text-slate-900'
                      }`}
                    />
                  ))}
                </div>

                {/* Expiration Countdown */}
                <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('auth.codeExpiresIn') || 'Code expires in'}:</span>
                    <span className={`font-mono font-bold ${expiresIn < 60 ? 'text-red-600' : 'text-slate-800'}`}>
                      {formatCountdown(expiresIn)}
                    </span>
                  </div>

                  {/* Resend Action */}
                  <button
                    type="button"
                    onClick={() => handleRequestOtp()}
                    disabled={resendCooldown > 0 || isSending}
                    className="font-bold text-teal-800 hover:text-teal-900 hover:underline disabled:opacity-40 disabled:no-underline"
                  >
                    {resendCooldown > 0 
                      ? `${t('auth.resendCode') || 'Resend'} (${resendCooldown}s)`
                      : t('auth.resendCode') || 'Resend Code'}
                  </button>
                </div>
              </div>

              {/* Verify Button */}
              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={isVerifying || otpDigits.includes('')}
                className="w-full py-2.5 px-4 bg-[#0A1E3F] hover:bg-[#163B66] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-teal-400" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-teal-400" />
                    <span>{t('auth.verifyAndContinue') || 'Verify & Sign In'}</span>
                  </>
                )}
              </button>

            </div>
          )}

          {/* ========================================================= */}
          {/* STAGE 3: SELECT AUTHORIZED WORKSPACE                      */}
          {/* ========================================================= */}
          {gatewayStage === 'SELECT_WORKSPACE' && verifiedResponse && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="space-y-1 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-extrabold text-[#0A1E3F] tracking-tight">
                  {t('auth.selectAuthorizedWorkspace') || 'Select Authorized Workspace'}
                </h2>
                <p className="text-xs text-slate-600">
                  {t('auth.selectWorkspacePrompt') || 'This verified account has permissions for multiple healthcare roles. Choose which workspace to enter:'}
                </p>
              </div>

              <div className="space-y-3">
                {/* Option 1: Patient Workspace */}
                <button
                  type="button"
                  onClick={() => handleSelectWorkspace('PATIENT')}
                  className="w-full p-4 rounded-xl border-2 border-slate-200 hover:border-teal-700 bg-white hover:bg-teal-50/30 text-left transition-all group shadow-2xs hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-800 group-hover:text-white transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-[#0A1E3F]">
                          {t('auth.patientWorkspaceOption') || 'Patient Workspace'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Access personal health assessments, reports & timeline
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>

                {/* Option 2: Healthcare Professional Workspace */}
                <button
                  type="button"
                  onClick={() => handleSelectWorkspace('HEALTHCARE_PROFESSIONAL')}
                  className="w-full p-4 rounded-xl border-2 border-slate-200 hover:border-teal-700 bg-white hover:bg-teal-50/30 text-left transition-all group shadow-2xs hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-900 group-hover:text-white transition-colors">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-[#0A1E3F]">
                          {t('auth.clinicalWorkspaceOption') || 'Healthcare Professional Workspace'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Review triage queues, manage clinical cases & issue referrals
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              </div>

              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                <span className="font-bold">Security Note:</span> Cross-workspace transitions require re-authentication with Mobile OTP to prevent unauthorized privilege escalation.
              </div>

            </div>
          )}

        </div>

        {/* Footer info banner */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>DISHA / ABDM Architecture</span>
          </div>
          <span className="font-mono text-[10px]">Zero Plaintext OTP</span>
        </div>

      </div>
    </div>
  );
};
