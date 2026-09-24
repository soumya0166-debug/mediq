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
  Award
} from 'lucide-react';

export const DoctorRegisterPage: React.FC = () => {
  const { navigate, loginAsDoctor, addAuditEvent } = useApp();

  const [fullName, setFullName] = useState('Dr. Ananya Sharma');
  const [role, setRole] = useState<DoctorUser['role']>('Medical Officer');
  const [facility, setFacility] = useState('CAREQ Demo Primary Health Centre, Jatni');
  const [facilityId, setFacilityId] = useState('FAC-DEMO-OD-001');
  const [state, setState] = useState('Odisha');
  const [regId, setRegId] = useState('NMC/ORI/2015/084920');
  const [experienceYears, setExperienceYears] = useState(11);
  const [phone, setPhone] = useState('+91 94370 12399');
  const [email, setEmail] = useState('dr.ananya.sharma@careq-health.gov.in');
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyProfessionalId = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      addAuditEvent(
        'Professional Accreditation Verified',
        fullName,
        'Healthcare Worker',
        `Simulated council verification passed for ID: ${regId}. Assigned facility: ${facility}`
      );
    }, 600);
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
      `Accredited clinical reviewer account activated. Facility: ${facility}`
    );

    loginAsDoctor('DOC-NMC-84920');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A1E3F] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
          Professional Accreditation
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] tracking-tight">
          Register as Healthcare Professional
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Access institutional patient review queues and author formal clinical referral notes on CAREQ
        </p>
      </div>

      <div className="bg-white rounded-careq-lg p-6 sm:p-8 border border-slate-200 shadow-careq-sm space-y-6">
        
        {/* Notice */}
        <div className="p-3.5 rounded-careq-md bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Educational Prototype Notice:</strong> Medical Council verification is simulated. 
            Do not enter confidential institutional passwords or real credentials.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name & Title *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-careq-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Healthcare Role *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-careq-sm text-slate-900 font-bold"
              >
                <option value="Medical Officer">Medical Officer (PHC / CHC)</option>
                <option value="Doctor">Doctor (Consultant / Specialist)</option>
                <option value="Nurse">Staff Nurse / Triage Specialist</option>
                <option value="Health Worker">Community Health Officer (CHO)</option>
                <option value="Clinical Reviewer">Clinical Reviewer</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Assigned Health Facility *</label>
              <select
                value={facility}
                onChange={(e) => {
                  setFacility(e.target.value);
                  if (e.target.value.includes('Jatni')) setFacilityId('FAC-DEMO-OD-001');
                  else if (e.target.value.includes('Khordha')) setFacilityId('FAC-DEMO-OD-002');
                  else setFacilityId('FAC-DEMO-OD-003');
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-careq-sm text-slate-900 font-semibold"
              >
                <option value="CAREQ Demo Primary Health Centre, Jatni">CAREQ Demo Primary Health Centre, Jatni (FAC-DEMO-OD-001)</option>
                <option value="CAREQ Demo Community Health Centre, Khordha">CAREQ Demo Community Health Centre, Khordha (FAC-DEMO-OD-002)</option>
                <option value="CAREQ Demo District Hospital, Cuttack">CAREQ Demo District Hospital, Cuttack (FAC-DEMO-OD-003)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">State / Council Jurisdiction *</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-careq-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Years of Experience *</label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-careq-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Mobile Contact *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-careq-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Institutional Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-careq-sm text-slate-900"
              />
            </div>
          </div>

          {/* Professional Credential Section */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700">
                Medical Registration / Council Number *
              </label>
              {isVerified && (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  🟢 Professional Identity Verified
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={regId}
                onChange={(e) => setRegId(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-careq-sm font-mono font-bold text-slate-900"
              />
              <button
                type="button"
                onClick={handleVerifyProfessionalId}
                disabled={isVerifying}
                className="px-4 py-2 bg-[#0A1E3F] hover:bg-[#163B66] text-white rounded-careq-sm font-bold transition-colors whitespace-nowrap"
              >
                {isVerifying ? 'Validating...' : 'Verify Professional ID'}
              </button>
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-slate-500 hover:text-slate-800 font-semibold"
            >
              ← Back to Sign In
            </button>
            <button
              type="submit"
              disabled={!isVerified}
              className="px-6 py-2.5 bg-[#0A1E3F] hover:bg-[#163B66] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-careq-sm transition-colors flex items-center gap-1.5"
            >
              <span>Complete Clinician Onboarding</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
