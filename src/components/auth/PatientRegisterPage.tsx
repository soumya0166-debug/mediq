import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientUser } from '../../types';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Languages, 
  Fingerprint, 
  KeyRound,
  FileCheck,
  Check
} from 'lucide-react';

export const PatientRegisterPage: React.FC = () => {
  const { navigate, loginAsPatient, addAuditEvent } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [fullName, setFullName] = useState('Riya Das');
  const [dob, setDob] = useState('1992-04-12');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('riya.das.demo@swasthyasetu.org');
  const [preferredLanguage, setPreferredLanguage] = useState('Odia');

  // Step 2 State (Mock Aadhaar OTP)
  const [demoAadhaar, setDemoAadhaar] = useState('XXXX XXXX 1234');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const [generatedPatientId, setGeneratedPatientId] = useState('PAT-2026-00124');

  // Step 3 State (Consent)
  const [consentTriage, setConsentTriage] = useState(false);
  const [consentSharing, setConsentSharing] = useState(false);

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtpValue('849201'); // realistic simulated OTP
  };

  const handleVerifyOtp = () => {
    if (otpValue.length >= 4) {
      setIsIdentityVerified(true);
      addAuditEvent(
        'Simulated Identity Verified',
        fullName,
        'Patient',
        `Mock Aadhaar verification completed. Assigned synthetic ID: ${generatedPatientId}`
      );
    }
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentTriage || !consentSharing) {
      alert('Please check both required consent acknowledgments.');
      return;
    }

    addAuditEvent(
      'Patient Account Created',
      fullName,
      'Patient',
      `Full registration complete with signed digital consent. Language: ${preferredLanguage}`
    );

    loginAsPatient(generatedPatientId);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Top Breadcrumb & Title */}
      <div className="text-center mb-8 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
          Patient Onboarding Workflow
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Your Patient Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          3-step verified enrollment for multimodal triage and hospital appointment readiness
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center w-full max-w-md">
          {/* Step 1 Indicator */}
          <div className="flex flex-col items-center flex-1">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 1 ? 'bg-teal-700 text-white shadow-sm' : 'bg-slate-200 text-slate-500'
            }`}>
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <span className="text-[11px] font-bold mt-1 text-slate-700">Basic Info</span>
          </div>

          <div className={`h-1 flex-1 transition-all ${step >= 2 ? 'bg-teal-600' : 'bg-slate-200'}`} />

          {/* Step 2 Indicator */}
          <div className="flex flex-col items-center flex-1">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 2 ? 'bg-teal-700 text-white shadow-sm' : 'bg-slate-200 text-slate-500'
            }`}>
              {step > 2 ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <span className="text-[11px] font-bold mt-1 text-slate-700">Verify Identity</span>
          </div>

          <div className={`h-1 flex-1 transition-all ${step >= 3 ? 'bg-teal-600' : 'bg-slate-200'}`} />

          {/* Step 3 Indicator */}
          <div className="flex flex-col items-center flex-1">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
              step === 3 ? 'bg-teal-700 text-white shadow-sm' : 'bg-slate-200 text-slate-500'
            }`}>
              3
            </div>
            <span className="text-[11px] font-bold mt-1 text-slate-700">Consent</span>
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200">
        
        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-teal-700" />
                Step 1: Patient Demographic Information
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter primary details for healthcare registration and hospital record matching
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name (as per ID) *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 transition-all"
                  placeholder="e.g. Riya Das"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date of Birth *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender *
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 transition-all"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Language *
                </label>
                <div className="relative">
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 transition-all font-medium"
                  >
                    <option value="Odia">ଓଡ଼ିଆ (Odia)</option>
                    <option value="Hindi">हिन्दी (Hindi)</option>
                    <option value="English">English</option>
                    <option value="Bengali">বাংলা (Bengali)</option>
                    <option value="Tamil">தமிழ் (Tamil)</option>
                    <option value="Telugu">తెలుగు (Telugu)</option>
                    <option value="Malayalam">മലയാളം (Malayalam)</option>
                    <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                ← Back to Login
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
              >
                <span>Continue to Step 2: Identity Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Identity Verification */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-teal-700" />
                Step 2: Verify Your Identity
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulated government identity verification layer for patient uniqueness and hospital matching
              </p>
            </div>

            {/* Mandatory Safety Rule Alert */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Educational Prototype Notice:</strong>
                <p className="mt-1 text-amber-800 leading-relaxed">
                  For this educational prototype, identity verification is simulated. 
                  <strong className="underline decoration-amber-500"> Do not enter a real Aadhaar number.</strong> 
                  Real Aadhaar APIs are not connected, and no live government databases are touched.
                </p>
              </div>
            </div>

            {!isIdentityVerified ? (
              <div className="space-y-4 max-w-lg mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Demo Aadhaar ID (Simulated)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={demoAadhaar}
                      onChange={(e) => setDemoAadhaar(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-mono tracking-wider text-slate-900"
                      placeholder="XXXX XXXX 1234"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold shadow-xs whitespace-nowrap transition-all"
                    >
                      {otpSent ? 'Resend OTP' : 'Send Verification OTP'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Placeholder digits for test simulation.
                  </p>
                </div>

                {otpSent && (
                  <div className="space-y-3 pt-3 border-t border-slate-200 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-slate-700">
                        Enter 6-digit Verification OTP
                      </label>
                      <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Demo OTP sent to {phone}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value)}
                        maxLength={6}
                        placeholder="849201"
                        className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-center text-sm font-mono tracking-widest text-slate-900 font-bold"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                      >
                        Verify Identity
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Verified Green Card as mandated in Section 6 */
              <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-900 space-y-3 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-emerald-950 flex items-center gap-2">
                      ✓ Identity Verified (Simulation)
                    </h3>
                    <p className="text-xs text-emerald-800">
                      Demo Aadhaar token successfully validated against synthetic authority ledger.
                    </p>
                  </div>
                </div>

                <div className="bg-white/80 rounded-xl p-3.5 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Allocated Public Health Record:</span>
                    <div className="font-mono font-bold text-sm text-slate-900">
                      Patient ID: {generatedPatientId}
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium bg-emerald-100/70 px-2.5 py-1 rounded-md">
                    🔒 Zero real Aadhaar stored or exposed
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-between items-center border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                ← Back to Step 1
              </button>
              <button
                type="button"
                disabled={!isIdentityVerified}
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
              >
                <span>Continue to Step 3: Consent</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Consent */}
        {step === 3 && (
          <form onSubmit={handleCompleteRegistration} className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-teal-700" />
                Step 3: Informed Patient Consent
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review platform triage scope and authorize qualified medical review
              </p>
            </div>

            <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consentTriage}
                  onChange={(e) => setConsentTriage(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-teal-600 rounded-sm border-slate-300 focus:ring-teal-500"
                />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900 font-semibold block mb-0.5">
                    I understand this platform provides triage support and does not provide diagnosis or treatment.
                  </strong>
                  SwasthyaSetu AI is an assistive pre-clinical summarizer. I understand all medical evaluations, clinical advice, and prescriptions must be delivered exclusively by licensed clinicians.
                </div>
              </label>

              <div className="h-px bg-slate-200" />

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consentSharing}
                  onChange={(e) => setConsentSharing(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-teal-600 rounded-sm border-slate-300 focus:ring-teal-500"
                />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900 font-semibold block mb-0.5">
                    I consent to sharing information with authorized healthcare workers for review.
                  </strong>
                  I authorize my submitted symptoms, audio recordings, OCR report extractions, and timeline summaries to be displayed to government and accredited institutional medical staff for clinical prioritization.
                </div>
              </label>

            </div>

            {/* Summary Preview */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
              <div className="font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                Enrollment Profile Prepared:
              </div>
              <p className="text-blue-800">
                {fullName} ({gender}, {preferredLanguage}) • Assigned ID: <span className="font-mono font-bold">{generatedPatientId}</span>
              </p>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                ← Back to Step 2
              </button>
              <button
                type="submit"
                disabled={!consentTriage || !consentSharing}
                className="px-8 py-3 bg-teal-700 hover:bg-teal-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
              >
                <span>Create Patient Account & Launch Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

      </div>

    </div>
  );
};
