import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Phone, 
  Fingerprint, 
  Lock,
  Check,
  ChevronRight
} from 'lucide-react';

export const PatientRegisterPage: React.FC = () => {
  const { navigate, loginAsPatient, addAuditEvent } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Identity
  const [demoAadhaar, setDemoAadhaar] = useState('XXXX XXXX 1234');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const [generatedPatientId] = useState('PAT-2026-00124');

  // Step 2: Profile
  const [fullName, setFullName] = useState('Riya Das');
  const [dob, setDob] = useState('1992-04-12');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [preferredLanguage, setPreferredLanguage] = useState('Odia');

  // Step 3: Consent Categories (Section 16)
  const [consentCategories, setConsentCategories] = useState({
    symptoms: true,
    reports: true,
    voiceTranscript: true,
    translation: true,
    previousAssessments: false,
  });

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtpValue('849201');
  };

  const handleVerifyOtp = () => {
    if (otpValue.length >= 4) {
      setIsIdentityVerified(true);
      addAuditEvent(
        'Simulated Identity Verified',
        fullName,
        'Patient',
        `Demo identity validated. Assigned synthetic ID: ${generatedPatientId}`
      );
    }
  };

  const handleCompleteRegistration = () => {
    addAuditEvent(
      'Patient Registration Completed',
      fullName,
      'Patient',
      `Onboarding complete with custom consent ledger. Assigned ID: ${generatedPatientId}`
    );
    loginAsPatient(generatedPatientId);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      
      {/* Title */}
      <div className="text-center space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded">
          Patient Onboarding
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] tracking-tight">
          Register with CAREQ
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Create a verified digital health profile with personal consent control
        </p>
      </div>

      {/* Progressive Disclosure Progress Indicator (Section 15) */}
      <div className="bg-white p-4 rounded-careq-md border border-slate-200 shadow-careq-xs">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { num: '01', label: 'Identity' },
            { num: '02', label: 'Profile' },
            { num: '03', label: 'Consent' },
            { num: '04', label: 'Complete' },
          ].map((item, idx) => {
            const stepNum = idx + 1;
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;

            return (
              <div key={item.num} className="space-y-1">
                <div className={`h-1 rounded-full transition-colors ${
                  isCompleted ? 'bg-teal-600' : isActive ? 'bg-[#0A1E3F]' : 'bg-slate-200'
                }`} />
                <div className="flex items-center justify-center gap-1">
                  <span className={`font-mono text-[11px] font-bold ${
                    isActive ? 'text-[#0A1E3F]' : isCompleted ? 'text-teal-700' : 'text-slate-400'
                  }`}>
                    {item.num}
                  </span>
                  <span className={`text-[11px] font-semibold hidden sm:inline ${
                    isActive ? 'text-slate-900 font-bold' : 'text-slate-500'
                  }`}>
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-careq-lg p-6 sm:p-8 border border-slate-200 shadow-careq-sm">
        
        {/* STEP 01: Identity Verification (Section 15) */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-teal-700" />
                Step 01: Verify your digital health identity
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulated identity validation to establish patient uniqueness without collecting real credentials
              </p>
            </div>

            {/* Mandatory Demo Label Notice */}
            <div className="p-3.5 rounded-careq-md bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Demo Verification Notice:</strong>
                <p className="mt-0.5 text-amber-800 leading-relaxed">
                  This educational prototype uses simulated identity verification. 
                  <strong> Do not enter real Aadhaar numbers or personal biometric data.</strong> 
                  No government APIs are connected.
                </p>
              </div>
            </div>

            {!isIdentityVerified ? (
              <div className="space-y-4 max-w-md mx-auto bg-slate-50 p-5 rounded-careq-md border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Demo Identity Number (Simulated)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={demoAadhaar}
                      onChange={(e) => setDemoAadhaar(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-careq-sm text-xs font-mono font-bold tracking-wider text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-3 py-2 bg-[#0A1E3F] hover:bg-[#163B66] text-white rounded-careq-sm text-xs font-bold transition-colors whitespace-nowrap"
                    >
                      {otpSent ? 'Resend OTP' : 'Send Demo OTP'}
                    </button>
                  </div>
                </div>

                {otpSent && (
                  <div className="space-y-3 pt-3 border-t border-slate-200 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-slate-700">Enter Demo OTP</label>
                      <span className="text-[11px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        Demo OTP: 849201
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value)}
                        placeholder="849201"
                        maxLength={6}
                        className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-careq-sm text-center font-mono font-bold text-sm tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-careq-sm text-xs font-bold transition-colors"
                      >
                        Verify Identity
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 rounded-careq-md bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                  Identity verified
                </div>
                <div className="text-xs font-mono text-emerald-800">
                  Patient ID: <strong>{generatedPatientId}</strong>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Zero real government credentials stored. Synthetic health ledger token generated.
                </p>
              </div>
            )}

            <div className="pt-4 flex justify-between items-center border-t border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-slate-500 hover:text-slate-800 font-semibold"
              >
                ← Return to Login
              </button>
              <button
                type="button"
                disabled={!isIdentityVerified}
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-[#0A1E3F] hover:bg-[#163B66] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-careq-sm transition-colors flex items-center gap-1.5"
              >
                <span>Continue to Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 02: Profile Information */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-teal-700" />
                Step 02: Demographic Details
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Provide your basic details for clinical record alignment
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-careq-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-careq-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Gender *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-careq-sm text-slate-900"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Preferred Language *</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-careq-sm text-slate-900 font-bold"
                >
                  <option value="Odia">ଓଡ଼ିଆ (Odia)</option>
                  <option value="Hindi">हिन्दी (Hindi)</option>
                  <option value="English">English</option>
                  <option value="Bengali">বাংলা (Bengali)</option>
                  <option value="Tamil">தமிழ் (Tamil)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Contact *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-careq-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Demo Facility</label>
                <div className="p-2 bg-slate-100 rounded-careq-sm border border-slate-200 text-slate-700">
                  CAREQ Demo Primary Health Centre (FAC-DEMO-OD-001)
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-slate-500 hover:text-slate-800 font-semibold"
              >
                ← Back to Identity
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 bg-[#0A1E3F] hover:bg-[#163B66] text-white font-bold rounded-careq-sm transition-colors flex items-center gap-1.5"
              >
                <span>Continue to Consent</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 03: Dedicated Consent Card (Section 16) */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-teal-700" />
                Step 03: You control your health information
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Transparent data authorization model. You choose what information is shared with authorized reviewers.
              </p>
            </div>

            {/* Visual Data Flow (Section 16) */}
            <div className="bg-slate-50 p-4 rounded-careq-md border border-slate-200 text-center font-mono text-xs">
              <div className="flex items-center justify-center gap-4 text-slate-700">
                <span className="bg-white px-3 py-1.5 rounded border border-slate-200 font-bold">Patient</span>
                <span className="text-teal-700 font-bold">↓</span>
                <span className="bg-[#0A1E3F] text-white px-3 py-1.5 rounded font-bold">CAREQ Triage</span>
                <span className="text-teal-700 font-bold">↓</span>
                <span className="bg-white px-3 py-1.5 rounded border border-slate-200 font-bold">Authorized Healthcare Worker</span>
              </div>
            </div>

            {/* Granular Categories (Section 16) */}
            <div className="space-y-2 text-xs">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Select categories to authorize:
              </span>

              <label className="flex items-center justify-between p-3 rounded-careq-md border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">Reported Symptoms</span>
                  <span className="text-[11px] text-slate-500">Subjective descriptions of onset and fever duration</span>
                </div>
                <input
                  type="checkbox"
                  checked={consentCategories.symptoms}
                  onChange={(e) => setConsentCategories({ ...consentCategories, symptoms: e.target.checked })}
                  className="w-4 h-4 text-teal-700 rounded border-slate-300"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-careq-md border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">Diagnostic Reports</span>
                  <span className="text-[11px] text-slate-500">OCR parsed lab values (CBC, blood sugar, X-rays)</span>
                </div>
                <input
                  type="checkbox"
                  checked={consentCategories.reports}
                  onChange={(e) => setConsentCategories({ ...consentCategories, reports: e.target.checked })}
                  className="w-4 h-4 text-teal-700 rounded border-slate-300"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-careq-md border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">Voice Transcript</span>
                  <span className="text-[11px] text-slate-500">Regional speech converted to clinical text</span>
                </div>
                <input
                  type="checkbox"
                  checked={consentCategories.voiceTranscript}
                  onChange={(e) => setConsentCategories({ ...consentCategories, voiceTranscript: e.target.checked })}
                  className="w-4 h-4 text-teal-700 rounded border-slate-300"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-careq-md border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">English Clinical Translation</span>
                  <span className="text-[11px] text-slate-500">Standard translation for healthcare-worker review</span>
                </div>
                <input
                  type="checkbox"
                  checked={consentCategories.translation}
                  onChange={(e) => setConsentCategories({ ...consentCategories, translation: e.target.checked })}
                  className="w-4 h-4 text-teal-700 rounded border-slate-300"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-careq-md border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">Previous Triage History</span>
                  <span className="text-[11px] text-slate-500">Historical records from previous clinic sessions</span>
                </div>
                <input
                  type="checkbox"
                  checked={consentCategories.previousAssessments}
                  onChange={(e) => setConsentCategories({ ...consentCategories, previousAssessments: e.target.checked })}
                  className="w-4 h-4 text-teal-700 rounded border-slate-300"
                />
              </label>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-slate-500 hover:text-slate-800 font-semibold"
              >
                ← Back to Profile
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-5 py-2.5 bg-[#0A1E3F] hover:bg-[#163B66] text-white font-bold rounded-careq-sm transition-colors flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 04: Complete & Launch */}
        {step === 4 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center font-bold">
              <Check className="w-6 h-6 text-emerald-700" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900">
                Registration Complete
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your verified digital health profile and consent settings have been secured on CAREQ.
              </p>
            </div>

            <div className="p-4 rounded-careq-md bg-slate-50 border border-slate-200 max-w-sm mx-auto text-left text-xs space-y-1.5">
              <div className="text-slate-500">Patient Identifier:</div>
              <div className="font-mono font-bold text-slate-900 text-sm">{generatedPatientId}</div>
              <div className="text-slate-500 pt-1">Authorized Facility:</div>
              <div className="font-semibold text-slate-800">CAREQ Demo Primary Health Centre</div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleCompleteRegistration}
                className="px-6 py-3 bg-[#0A1E3F] hover:bg-[#163B66] text-white font-bold rounded-careq-sm text-xs sm:text-sm transition-colors shadow-careq-xs inline-flex items-center gap-2"
              >
                <span>Launch Patient Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
