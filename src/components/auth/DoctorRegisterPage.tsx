import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DoctorUser } from '../../types';
import { 
  Stethoscope, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Award, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase 
} from 'lucide-react';

export const DoctorRegisterPage: React.FC = () => {
  const { navigate, loginAsDoctor, addAuditEvent } = useApp();

  const [fullName, setFullName] = useState('Dr. Ananya Sharma');
  const [role, setRole] = useState<DoctorUser['role']>('Doctor');
  const [facility, setFacility] = useState('Capital Hospital & Community Health Centre, Bhubaneswar');
  const [state, setState] = useState('Odisha');
  const [regId, setRegId] = useState('NMC/ORI/2015/084920');
  const [experienceYears, setExperienceYears] = useState(11);
  const [phone, setPhone] = useState('+91 94370 12399');
  const [email, setEmail] = useState('dr.ananya.sharma@health.odisha.gov.in');
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyProfessionalId = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      addAuditEvent(
        'Simulated Professional Verification Completed',
        fullName,
        'Healthcare Worker',
        `Credential check passed for simulated Council ID: ${regId}. Facility: ${facility}`
      );
    }, 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) {
      alert('Please click "Verify Professional ID" first to simulate credential validation.');
      return;
    }

    addAuditEvent(
      'Healthcare Worker Enrolled',
      fullName,
      'Healthcare Worker',
      `Accredited clinical reviewer account activated. Role: ${role}`
    );

    loginAsDoctor('DOC-NMC-84920');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Header */}
      <div className="text-center mb-8 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
          Clinical Practitioner Registration
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Register as Verified Healthcare Worker
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Access institutional patient queues, review AI-synthesized multimodal triage notes, and author formal referrals
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200">
        
        {/* Synthetic Safety Alert */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Educational Simulation Notice:</strong>
            <p className="mt-1 text-amber-800 leading-relaxed">
              Medical registration validation is simulated for demonstration purposes. This system does not query 
              live National Medical Commission (NMC) or state council registries. Do not enter confidential credentials.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name & Title *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all"
                placeholder="e.g. Dr. Ananya Sharma"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Designated Healthcare Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all"
              >
                <option value="Doctor">Doctor (Consultant / Specialist)</option>
                <option value="Medical Officer">Medical Officer (PHC / CHC)</option>
                <option value="Nurse">Staff Nurse / Triage Specialist</option>
                <option value="Health Worker">Community Health Officer (CHO)</option>
                <option value="Clinical Reviewer">Clinical Reviewer</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Healthcare Facility / Hospital *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all"
                  placeholder="e.g. SCB Medical College, Cuttack"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State / Jurisdiction *
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Years of Clinical Experience *
              </label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                min={1}
                max={50}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Mobile Number *
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institutional Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>
          </div>

          {/* Section: Professional Verification */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-700" />
                  Professional Credential Verification
                </h3>
                <p className="text-xs text-slate-500">
                  Provide your Medical Registration Council / Nursing Council ID
                </p>
              </div>
              {isVerified && (
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Healthcare Worker
                </span>
              )}
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={regId}
                  onChange={(e) => setRegId(e.target.value)}
                  placeholder="e.g. NMC/ORI/2015/084920"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-mono tracking-wide text-slate-900 font-semibold"
                />
              </div>
              <button
                type="button"
                onClick={handleVerifyProfessionalId}
                disabled={isVerifying}
                className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold shadow-xs whitespace-nowrap transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isVerifying ? (
                  <span className="animate-pulse">Validating Ledger...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify Professional ID</span>
                  </>
                )}
              </button>
            </div>

            {isVerified && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-start gap-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-extrabold text-sm text-emerald-900 flex items-center gap-2">
                    ✓ Professional Identity Verified
                  </div>
                  <p className="text-emerald-800 leading-snug">
                    Simulated verification confirmed credentials: <strong>{regId}</strong> ({fullName}, {role} at {facility}).
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              ← Back to Sign In
            </button>
            <button
              type="submit"
              disabled={!isVerified}
              className="px-8 py-3 bg-blue-900 hover:bg-blue-950 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <span>Complete Clinician Registration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
