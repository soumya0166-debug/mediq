import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  Eye, 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  Mic, 
  ShieldCheck,
  Share2
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

export const DoctorQueuePage: React.FC = () => {
  const { assessments, navigate, setSelectedAssessmentId } = useApp();
  const [filter, setFilter] = useState<'All' | 'High' | 'New' | 'Waiting' | 'Reviewed' | 'Referral'>('All');
  const [search, setSearch] = useState('');

  const filteredAssessments = assessments.filter(a => {
    // Search match
    const matchesSearch = 
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.patientId.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    // Filter match
    if (filter === 'High') return a.riskLevel === 'HIGH';
    if (filter === 'New') return a.waitingMinutes <= 10;
    if (filter === 'Waiting') return a.status === 'WAITING_REVIEW';
    if (filter === 'Reviewed') return a.status === 'REVIEWED';
    if (filter === 'Referral') return a.status === 'REFERRED';

    return true;
  });

  const handleOpenReview = (id: string) => {
    setSelectedAssessmentId(id);
    navigate(`/doctor/review/${id}`);
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            Clinical Workflow • Priority Sorting
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Patient Triage Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time multimodal queue prioritized by calculated risk signals for doctor examination
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-200">
          Showing {filteredAssessments.length} of {assessments.length} cases
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {(['All', 'High', 'New', 'Waiting', 'Reviewed', 'Referral'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === tab
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tab === 'High' ? '🔴 High Priority' : tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient, ID, or case..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600"
          />
        </div>

      </div>

      {/* Polished Table (Section 15) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Patient ID</th>
                <th className="py-3.5 px-4">Age / Gender</th>
                <th className="py-3.5 px-4">Multimodal Input</th>
                <th className="py-3.5 px-4">Risk Signal</th>
                <th className="py-3.5 px-4">Waiting Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Clinical Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssessments.length > 0 ? (
                filteredAssessments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* Patient ID */}
                    <td className="py-4 px-4">
                      <div className="font-mono font-bold text-slate-900">{a.patientId}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{a.id}</div>
                    </td>

                    {/* Age / Gender */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{a.patientName}</div>
                      <div className="text-[11px] text-slate-500">
                        {a.patientAge} / {a.patientGender === 'Female' ? 'F' : 'M'} • {a.patientLanguage}
                      </div>
                    </td>

                    {/* Input */}
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        {a.hasVoice && (
                          <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
                            Voice
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                          Text
                        </span>
                        {a.hasReport && (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold">
                            Report
                          </span>
                        )}
                        {a.hasImage && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                            Image
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Risk Signal */}
                    <td className="py-4 px-4">
                      <RiskBadge level={a.riskLevel} size="md" />
                    </td>

                    {/* Waiting */}
                    <td className="py-4 px-4 font-mono text-slate-700">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{a.waitingMinutes} min</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        a.status === 'REVIEWED' ? 'bg-emerald-100 text-emerald-800' :
                        a.status === 'REFERRED' ? 'bg-indigo-100 text-indigo-800' :
                        a.status === 'INFO_REQUESTED' ? 'bg-purple-100 text-purple-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {a.status === 'WAITING_REVIEW' ? 'Waiting Review' : a.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleOpenReview(a.id)}
                        className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold shadow-xs transition-all inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review</span>
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 text-xs">
                    No cases match the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
