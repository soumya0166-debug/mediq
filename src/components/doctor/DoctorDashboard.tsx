import React from 'react';
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
  Sparkles
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

export const DoctorDashboard: React.FC = () => {
  const { currentDoctor, assessments, navigate, setSelectedAssessmentId } = useApp();

  const handleOpenReview = (id: string) => {
    setSelectedAssessmentId(id);
    navigate(`/doctor/review/${id}`);
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto">
      
      {/* Section 14: Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            Clinical Review Workspace • Human Decision Support
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Good morning, {currentDoctor?.name || 'Dr. Ananya'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Clinical Review Dashboard • {currentDoctor?.facility || 'Capital Hospital & Community Health Centre'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/doctor/queue')}
            className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <span>Open Full Patient Queue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Section 14: Top 4 Metric Cards (Synthetic Numbers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Waiting for Review */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Waiting for Review
            </span>
            <div className="text-3xl font-extrabold text-slate-950 font-mono">
              24
            </div>
            <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" /> Average wait: 6.2 mins
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
            <Users className="w-6 h-6 text-blue-900" />
          </div>
        </div>

        {/* Card 2: Priority Cases */}
        <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-xs flex items-center justify-between bg-gradient-to-br from-red-50/40 to-white">
          <div className="space-y-1">
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-red-600" />
              Priority Cases
            </span>
            <div className="text-3xl font-extrabold text-red-700 font-mono">
              6
            </div>
            <span className="text-[11px] text-red-600 font-semibold">
              Immediate attention advised
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-800 flex items-center justify-center font-bold">
            <ShieldAlert className="w-6 h-6 text-red-600" />
          </div>
        </div>

        {/* Card 3: Reports Processed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Reports Processed
            </span>
            <div className="text-3xl font-extrabold text-slate-950 font-mono">
              38
            </div>
            <span className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
              <FileCheck className="w-3 h-3" /> 97.4% OCR precision
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold">
            <FileCheck className="w-6 h-6 text-teal-700" />
          </div>
        </div>

        {/* Card 4: Referrals Prepared */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Referrals Prepared
            </span>
            <div className="text-3xl font-extrabold text-slate-950 font-mono">
              4
            </div>
            <span className="text-[11px] text-indigo-700 font-semibold flex items-center gap-1">
              <Share2 className="w-3 h-3" /> Tertiary SCB / AIIMS
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-800 flex items-center justify-center font-bold">
            <Share2 className="w-6 h-6 text-indigo-700" />
          </div>
        </div>

      </div>

      {/* Priority Triage Queue Preview Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                Live Ingested Triage Queue
              </h2>
              <span className="bg-blue-100 text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full font-mono">
                {assessments.length} Active Cases
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Multimodal inputs summarized for human medical prioritization
            </p>
          </div>

          <button
            onClick={() => navigate('/doctor/queue')}
            className="text-xs font-bold text-blue-900 hover:text-blue-950 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All with Advanced Filters</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Patient ID</th>
                <th className="py-3.5 px-4">Patient / Age</th>
                <th className="py-3.5 px-4">Multimodal Input</th>
                <th className="py-3.5 px-4">Risk Signal</th>
                <th className="py-3.5 px-4">Waiting</th>
                <th className="py-3.5 px-4">Review Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assessments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Patient ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {a.patientId}
                  </td>

                  {/* Patient Details */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{a.patientName}</div>
                    <div className="text-[11px] text-slate-500">
                      {a.patientAge}y / {a.patientGender} • {a.patientLanguage}
                    </div>
                  </td>

                  {/* Multimodal Inputs */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      {a.hasVoice && (
                        <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 font-medium">
                          🎤 Voice
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        Text
                      </span>
                      {a.hasReport && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 font-medium">
                          📄 Report
                        </span>
                      )}
                      {a.hasImage && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                          📷 Image
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Risk Signal */}
                  <td className="py-3.5 px-4">
                    <RiskBadge level={a.riskLevel} size="sm" />
                  </td>

                  {/* Waiting Time */}
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                    {a.waitingMinutes} min
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      a.status === 'REVIEWED' ? 'bg-emerald-100 text-emerald-800' :
                      a.status === 'REFERRED' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {a.status === 'WAITING_REVIEW' ? 'Waiting Review' : a.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenReview(a.id)}
                      className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold shadow-2xs transition-all inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
