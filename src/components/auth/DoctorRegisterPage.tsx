import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { DoctorUser } from '../../types';
import { 
  Stethoscope, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Award,
  Check,
  ArrowLeft
} from 'lucide-react';

export const DoctorRegisterPage: React.FC = () => {
  const { navigate, loginAsDoctor, addAuditEvent } = useApp();
  const { t } = useLanguage();

  // Multi-step: Step 1 Professional Details, Step 2 Professional Verification (Section 15 Spec)
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1: Professional Details (Section 15 Fields)
  const [fullName, setFullName] = useState('Dr. Ananya Sharma');
  const [role, setRole] = useState<DoctorUser['role']>('Medical Officer');
  const [facility, setFacility] = useState('CAREQ Demo Primary Health Centre, Jatni');
  const [department, setDepartment] = useState('Primary Care & Emergency Triage');
  const [mobile, setMobile] = useState('+91 94370 12399');
  const [email, setEmail] = useState('dr.ananya.sharma@careq-health.gov.in');

  // Step 2: Professional Verification (Section 15 Fields)
  const [regId, setRegId] = useState('NMC/ORI/2015/084920');
  const [state, setState] = useState('Odisha');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerifyProfessionalIdentity = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      addAuditEvent(
        'Professional Accreditation Verified',
        fullName,
        'Healthcare Worker',
        `Simulated council verification passed for Registration ID: ${regId}. Assigned facility: ${facility}`
      );
    }, 600);
  };

  const handleCompleteEnrollment = () => {
    addAuditEvent(
      'Healthcare Professional Enrolled',
      fullName,
      'Healthcare Worker',
      `Accredited clinical reviewer account activated. Facility: ${facility}`
    );
    loginAsDoctor('DOC-NMC-84920');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded">
          {t('auth.clinicalRoleTitle')}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] tracking-tight">
          {t('auth.registerDoctor')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {t('auth.clinicalSubtitle')}
        </p>
      </div>

      {/* Progress Indicator (Section 15: 2 Steps) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-2 gap-3 text-center text-xs">
          {[
            { num: '01', title: t('auth.professionalDetailsTitle') },
            { num: '02', title: t('auth.professionalVerifyTitle') },
          ].map((item, idx) => {
            const stepNum = (idx + 1) as 1 | 2;
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

      {/* Main Card */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        {/* Notice */}
        <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Educational Prototype Notice:</strong> Credential verification is simulated for the hackathon evaluation. Do not input actual private credentials.
          </div>
        </div>

        {/* STEP 1: Professional Details (Section 15 Fields) */}
        {step === 1 && (
          <div className="space-y-4 text-xs animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">
                {t('auth.professionalDetailsSubtitle')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('clinical.workspaceSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('auth.fullName')} *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Ananya Sharma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('auth.professionalRole')} *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                >
                  <option value="Medical Officer">{t('auth.medicalOfficerRole')}</option>
                  <option value="Doctor">{t('auth.clinicalRoleTitle')}</option>
                  <option value="Nurse">Community Health Officer / Nurse</option>
                  <option value="Clinical Reviewer">Clinical Reviewer</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('auth.facilityLabel')} *</label>
                <input
                  type="text"
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('auth.departmentLabel')} *</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('auth.mobileNumber')} *</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('auth.emailAddress')} *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                {t('common.back')}
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-[#0A1E3F] hover:bg-[#07152c] text-white rounded-lg font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>{t('auth.verifyProfessionalBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Professional Verification (Section 15 Fields) */}
        {step === 2 && (
          <div className="space-y-4 text-xs animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">
                {t('auth.professionalVerifySubtitle')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('common.educationalDisclaimer')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('auth.professionalId')} *</label>
                  <input
                    type="text"
                    value={regId}
                    onChange={(e) => setRegId(e.target.value)}
                    placeholder="e.g. NMC/ORI/2015/084920"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('auth.stateLabel')} *</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                  >
                    <option value="Odisha">Odisha</option>
                    <option value="National Medical Commission">National Medical Commission (Central)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">{t('auth.facilityLabel')} *</label>
                  <input
                    type="text"
                    value={facility}
                    readOnly
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium"
                  />
                </div>
              </div>

              {!isVerified ? (
                <button
                  type="button"
                  onClick={handleVerifyProfessionalIdentity}
                  disabled={isVerifying}
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold text-xs shadow-xs transition-all flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isVerifying ? t('common.loading') : t('auth.verifyProfessionalBtn')}</span>
                </button>
              ) : (
                /* Verification Success State (Section 15 Spec) */
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block animate-pulse" />
                    <span>{t('auth.professionalVerifiedBadge')}</span>
                  </div>
                  <div className="text-xs text-slate-800">
                    <strong>{fullName}</strong> • {t('clinical.role')}: <span className="font-semibold text-teal-800">{role}</span>
                  </div>
                  <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 mt-1">
                    {t('common.verified')} — {t('common.demoVerification')}
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
                ← {t('common.back')}
              </button>

              <button
                type="button"
                disabled={!isVerified}
                onClick={handleCompleteEnrollment}
                className={`px-6 py-2.5 rounded-lg font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 ${
                  isVerified
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{t('auth.registerDoctor')}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
