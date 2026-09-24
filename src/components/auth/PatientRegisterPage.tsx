import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Phone, 
  Lock, 
  Calendar, 
  Mail, 
  Languages, 
  Check, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export const PatientRegisterPage: React.FC = () => {
  const { navigate, loginAsPatient, addAuditEvent } = useApp();

  // Multi-step signup: Step 1 Basic Details, Step 2 Digital Health Identity, Step 3 Consent (Sections 7 & 8)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Basic Details (Section 7 Spec)
  const [fullName, setFullName] = useState('Riya Das');
  const [dob, setDob] = useState('1992-04-12');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [mobileNumber, setMobileNumber] = useState('+91 98765 43210');
  const [email, setEmail] = useState('riya.das.demo@careq-health.org');
  const [preferredLanguage, setPreferredLanguage] = useState('Odia');

  // Step 2: Digital Health Identity (Section 7 Spec - Simulated Demo ID)
  const [demoHealthId, setDemoHealthId] = useState('XX-9482-1029-4821');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const generatedPatientId = 'PAT-2026-00124';

  // Step 3: Consent (Section 8 Spec)
  const [consentSymptoms, setConsentSymptoms] = useState(true);
  const [consentReports, setConsentReports] = useState(true);
  const [consentVoice, setConsentVoice] = useState(true);
  const [consentTranslation, setConsentTranslation] = useState(true);

  const handleVerifyDemoIdentity = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsIdentityVerified(true);
      addAuditEvent(
        'Simulated Digital Health Identity Verified',
        fullName,
        'Patient',
        `Assigned synthetic Patient ID: ${generatedPatientId}`
      );
    }, 600);
  };

  const handleCreateAccount = () => {
    addAuditEvent(
      'Patient Account Created',
      fullName,
      'Patient',
      `Registered with verified demo health identity and authorized consent ledger.`
    );
    loginAsPatient(generatedPatientId);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded">
          Patient Onboarding
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] tracking-tight">
          Create Your CAREQ Patient Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Connected health information with personal consent control
        </p>
      </div>

      {/* Progress Indicator (3 Steps - Sections 7 & 8) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          {[
            { num: '01', title: 'Basic Details' },
            { num: '02', title: 'Digital Health Identity' },
            { num: '03', title: 'Consent' },
          ].map((item, idx) => {
            const stepNum = (idx + 1) as 1 | 2 | 3;
            const isActive = step === stepNum;
            const isDone = step > stepNum;

            return (
              <div
                key={item.num}
                onClick={() => {
                  if (step > stepNum) setStep(stepNum);
                }}
                className={`p-2.5 rounded-lg border transition-all ${
                  isActive
                    ? 'border-[#0A1E3F] bg-blue-50/50 font-bold text-[#0A1E3F]'
                    : isDone
                    ? 'border-emerald-200 bg-emerald-50/50 text-emerald-900 cursor-pointer'
                    : 'border-slate-200 bg-slate-50 text-slate-400'
                }`}
              >
                <div className="font-mono text-[10px] text-slate-400">Step {item.num}</div>
                <div className="font-semibold text-xs mt-0.5">{item.title}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Form Container */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
        
        {/* ========================================================================= */}
        {/* STEP 1: Basic Details (Section 7 Spec)                                    */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">
                Step 1 — Basic Details
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Please enter your demographic information as you would like it presented to clinical reviewers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Riya Das"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden font-medium"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden font-medium"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden font-medium"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden font-medium"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. riya@careq.org"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden font-medium"
                />
              </div>

              {/* Preferred Language */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Preferred Language</label>
                <div className="flex gap-2">
                  {(['Odia', 'Hindi', 'English'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setPreferredLanguage(lang)}
                      className={`px-4 py-2 rounded-lg border text-xs font-semibold transition-all ${
                        preferredLanguage === lang
                          ? 'bg-[#0A1E3F] text-white border-[#0A1E3F]'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Back to Login
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-[#0A1E3F] hover:bg-[#07152c] text-white rounded-lg font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>Continue to Identity Verification</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: Digital Health Identity (Section 7 Spec)                          */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                Demo Verification Flow
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                Verify your identity
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulated digital health identity flow. Real government documents are neither requested nor stored.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Demo Health ID
                </label>
                <input
                  type="text"
                  value={demoHealthId}
                  onChange={(e) => setDemoHealthId(e.target.value)}
                  placeholder="e.g. XX-XXXX-XXXX-XXXX"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono text-sm focus:ring-1 focus:ring-slate-400 outline-hidden font-bold"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Format: XX-XXXX-XXXX-XXXX (Simulated sandbox identifier)
                </span>
              </div>

              {!isIdentityVerified ? (
                <button
                  type="button"
                  onClick={handleVerifyDemoIdentity}
                  disabled={isVerifying}
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold text-xs shadow-xs transition-all flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isVerifying ? 'Verifying Identity...' : 'Verify Identity'}</span>
                </button>
              ) : (
                /* Verification Success State (Section 7 Spec) */
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block animate-pulse" />
                    <span>Identity Verified</span>
                  </div>
                  <div className="text-xs text-emerald-950 font-mono font-bold">
                    Patient ID: {generatedPatientId}
                  </div>
                  <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200 mt-1">
                    Demo Verification
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                ← Back
              </button>

              <button
                type="button"
                disabled={!isIdentityVerified}
                onClick={() => setStep(3)}
                className={`px-6 py-2.5 rounded-lg font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 ${
                  isIdentityVerified
                    ? 'bg-[#0A1E3F] hover:bg-[#07152c] text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Continue to Consent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: Consent During Signup (Section 8 Spec)                            */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">
                You control your health information
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                “CAREQ organizes your health information and shares it with authorized healthcare professionals for review when you provide consent.”
              </p>
            </div>

            {/* Checkbox Category Permissions (Section 8 Spec) */}
            <div className="space-y-3 text-xs">
              <div 
                onClick={() => setConsentSymptoms(!consentSymptoms)}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-slate-900">Symptoms</div>
                  <p className="text-slate-500 text-[11px]">Reported complaints, onset timeline, and duration.</p>
                </div>
                <input
                  type="checkbox"
                  checked={consentSymptoms}
                  onChange={() => {}}
                  className="w-4 h-4 text-[#0A1E3F] rounded"
                />
              </div>

              <div 
                onClick={() => setConsentReports(!consentReports)}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-slate-900">Reports</div>
                  <p className="text-slate-500 text-[11px]">Lab pathology and imaging documents extracted via OCR.</p>
                </div>
                <input
                  type="checkbox"
                  checked={consentReports}
                  onChange={() => {}}
                  className="w-4 h-4 text-[#0A1E3F] rounded"
                />
              </div>

              <div 
                onClick={() => setConsentVoice(!consentVoice)}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-slate-900">Voice information</div>
                  <p className="text-slate-500 text-[11px]">Recorded regional audio snippets and speech transcription.</p>
                </div>
                <input
                  type="checkbox"
                  checked={consentVoice}
                  onChange={() => {}}
                  className="w-4 h-4 text-[#0A1E3F] rounded"
                />
              </div>

              <div 
                onClick={() => setConsentTranslation(!consentTranslation)}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-slate-900">Translation</div>
                  <p className="text-slate-500 text-[11px]">Regional-to-English translation generated for clinician review.</p>
                </div>
                <input
                  type="checkbox"
                  checked={consentTranslation}
                  onChange={() => {}}
                  className="w-4 h-4 text-[#0A1E3F] rounded"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleCreateAccount}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Create Patient Account</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
