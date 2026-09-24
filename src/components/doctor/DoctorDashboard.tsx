import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  AlertCircle, 
  FileCheck, 
  Share2, 
  ArrowRight, 
  Clock, 
  Activity, 
  CheckCircle2, 
  ChevronRight, 
  Eye, 
  ShieldAlert,
  Search,
  Sparkles,
  Building2,
  HelpCircle,
  ShieldCheck,
  ArrowRightLeft,
  CheckSquare,
  FileText,
  UserCheck
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';
import { Facility } from '../../types';

export const DoctorDashboard: React.FC = () => {
  const { 
    currentDoctor, 
    assessments, 
    navigate, 
    setSelectedAssessmentId,
    currentFacility,
    facilityId,
    switchFacility,
    availableFacilities 
  } = useApp();

  const [showFacilityModal, setShowFacilityModal] = useState(false);

  const handleOpenReview = (id: string) => {
    setSelectedAssessmentId(id);
    navigate(`/doctor/review/${id}`);
  };

  const newCasesCount = assessments.filter(a => a.waitingMinutes <= 15).length;
  const priorityReviewCount = assessments.filter(a => a.riskLevel === 'HIGH').length;
  const awaitingInfoCount = assessments.filter(a => a.followUpQuestions.some(q => q.status === 'ASKED')).length;
  const referralsCount = assessments.filter(a => a.status === 'REFERRED').length;

  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto">
      
      {/* ========================================================================= */}
      {/* Section 40: Facility Context Banner                                       */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 flex-shrink-0">
            <Building2 className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Current Facility (Section 40)
            </div>
            <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span>{currentFacility || 'CAREQ Demo Primary Health Centre'}</span>
              <span className="font-mono text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {facilityId || 'FAC-DEMO-OD-001'}
              </span>
            </div>
            <div className="text-xs text-slate-500">
              Role: <span className="font-semibold text-slate-700">Medical Officer</span> • Clinical Jurisdiction: Sub-District Primary Health
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowFacilityModal(true)}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
          <span>Switch Facility</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* Section 25: Header & Subtitle                                             */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-md">
            Clinical Review Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Clinical Review Workspace
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            AI-assisted information organization for human review.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/doctor/queue')}
            className="px-4 py-2.5 bg-[#0A1E3F] hover:bg-[#07152c] text-white rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center gap-2"
          >
            <span>Open Patient Queue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Section 25: Top Metric Cards (Restrained Colors)                           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: New Cases */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              New Cases
            </span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {newCasesCount || 14}
            </div>
            <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-slate-400" /> Past 2 hours
            </span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5 text-slate-700" />
          </div>
        </div>

        {/* Metric 2: Priority Review (Restrained red badge, not flashy) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              Priority Review
            </span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {priorityReviewCount}
            </div>
            <span className="text-[11px] text-red-700 font-medium">
              Requires attention
            </span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-red-50 text-red-700 border border-red-100 flex items-center justify-center font-bold">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
        </div>

        {/* Metric 3: Awaiting Information */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Awaiting Information
            </span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {awaitingInfoCount || 3}
            </div>
            <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-amber-600" /> Follow-ups sent
            </span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        {/* Metric 4: Referrals */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Referrals
            </span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {referralsCount || 4}
            </div>
            <span className="text-[11px] text-teal-700 font-medium flex items-center gap-1">
              <Share2 className="w-3 h-3 text-teal-600" /> Tertiary SCB / AIIMS
            </span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center font-bold">
            <Share2 className="w-5 h-5 text-teal-600" />
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* Section 41: Digital Health Ecosystem Visual — Connected Care              */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-700" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Connected Care Ecosystem
            </h2>
          </div>
          <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Demo Workflow (Section 41)
          </span>
        </div>

        <div className="py-2 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] text-xs">
            
            {/* Node 1: Patient */}
            <div className="flex flex-col items-center text-center space-y-1 w-24">
              <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-800 font-bold">
                1
              </div>
              <span className="font-bold text-slate-900 text-[11px]">Patient</span>
              <span className="text-[10px] text-slate-400">Reports inputs</span>
            </div>

            <div className="flex-1 h-0.5 bg-slate-200 relative mx-2">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 text-xs">→</div>
            </div>

            {/* Node 2: Digital Identity */}
            <div className="flex flex-col items-center text-center space-y-1 w-28">
              <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-bold">
                2
              </div>
              <span className="font-bold text-slate-900 text-[11px]">Digital Identity</span>
              <span className="text-[10px] text-slate-400">Consent recorded</span>
            </div>

            <div className="flex-1 h-0.5 bg-slate-200 relative mx-2">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 text-xs">→</div>
            </div>

            {/* Node 3: CAREQ */}
            <div className="flex flex-col items-center text-center space-y-1 w-24">
              <div className="w-9 h-9 rounded-lg bg-[#0A1E3F] text-white flex items-center justify-center font-bold shadow-xs">
                3
              </div>
              <span className="font-bold text-[#0A1E3F] text-[11px]">CAREQ</span>
              <span className="text-[10px] text-slate-400">AI triage synthesis</span>
            </div>

            <div className="flex-1 h-0.5 bg-slate-200 relative mx-2">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 text-xs">→</div>
            </div>

            {/* Node 4: Healthcare Worker */}
            <div className="flex flex-col items-center text-center space-y-1 w-32">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold">
                4
              </div>
              <span className="font-bold text-slate-900 text-[11px]">Healthcare Worker</span>
              <span className="text-[10px] text-slate-400">Human clinical review</span>
            </div>

            <div className="flex-1 h-0.5 bg-slate-200 relative mx-2">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 text-xs">→</div>
            </div>

            {/* Node 5: Facility */}
            <div className="flex flex-col items-center text-center space-y-1 w-28">
              <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-800 font-bold">
                5
              </div>
              <span className="font-bold text-slate-900 text-[11px]">Facility</span>
              <span className="text-[10px] text-slate-400">PHC / CHC triage</span>
            </div>

            <div className="flex-1 h-0.5 bg-slate-200 relative mx-2">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 text-xs">→</div>
            </div>

            {/* Node 6: Referral */}
            <div className="flex flex-col items-center text-center space-y-1 w-28">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-800 font-bold">
                6
              </div>
              <span className="font-bold text-slate-900 text-[11px]">Referral Review</span>
              <span className="text-[10px] text-slate-400">Tertiary continuity</span>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Section 26 & 27: Priority Patient Review Queue Table                       */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Patient Review Queue
              </h2>
              <span className="bg-slate-100 text-slate-700 text-xs font-mono font-bold px-2 py-0.5 rounded">
                {assessments.length} Active Cases
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Multimodal triage inputs summarized for licensed healthcare professional examination
            </p>
          </div>

          <button
            onClick={() => navigate('/doctor/queue')}
            className="text-xs font-bold text-teal-800 hover:text-teal-900 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All in Queue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Table with restrained indicators (Section 27) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Patient / Age</th>
                <th className="py-3 px-4">Input Sources</th>
                <th className="py-3 px-4">Urgency Signal</th>
                <th className="py-3 px-4">Waiting</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assessments.slice(0, 6).map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                  
                  {/* Patient ID */}
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {a.patientId}
                  </td>

                  {/* Patient Details */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{a.patientName}</div>
                    <div className="text-[11px] text-slate-500">
                      {a.patientAge} / {a.patientGender} • {a.patientLanguage}
                    </div>
                  </td>

                  {/* Input Sources Chips */}
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap items-center gap-1 font-mono text-[10px]">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        TEXT
                      </span>
                      {a.hasVoice && (
                        <span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-medium">
                          VOICE
                        </span>
                      )}
                      {a.hasReport && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                          REPORT
                        </span>
                      )}
                      {a.hasImage && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          IMAGE
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Urgency Signal (Restrained dot + label - Section 27) */}
                  <td className="py-3 px-4">
                    <RiskBadge level={a.riskLevel} size="sm" />
                  </td>

                  {/* Waiting Time */}
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                    {a.waitingMinutes} min
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      a.status === 'REVIEWED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      a.status === 'REFERRED' ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {a.status === 'WAITING_REVIEW' ? 'Needs Review' : a.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenReview(a.id)}
                      className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-md text-xs font-semibold shadow-2xs transition-all inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>Open</span>
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Facility Switch Modal */}
      {showFacilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-2xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-700" />
                Select Clinical Facility
              </h3>
              <button 
                onClick={() => setShowFacilityModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            <p className="text-xs text-slate-500">
              Switching facility filters the patient triage queue to the respective jurisdiction.
            </p>

            <div className="space-y-2">
              {availableFacilities.map((f: Facility) => (
                <div
                  key={f.id}
                  onClick={() => {
                    switchFacility(f.name, f.id);
                    setShowFacilityModal(false);
                  }}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    facilityId === f.id
                      ? 'bg-teal-50/80 border-teal-600 font-bold text-teal-950'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold">{f.name}</div>
                    <div className="text-[11px] font-mono text-slate-500 mt-0.5">{f.id} • {f.type}</div>
                  </div>
                  {facilityId === f.id && (
                    <span className="text-teal-700 font-bold">Active</span>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowFacilityModal(false)}
                className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
