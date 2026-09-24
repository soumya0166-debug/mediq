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
  Search, 
  Filter, 
  SlidersHorizontal, 
  RotateCw, 
  Building2, 
  HelpCircle, 
  ShieldCheck, 
  ArrowRightLeft
} from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUrgency, setFilterUrgency] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [sortBy, setSortBy] = useState<'WAITING' | 'URGENCY' | 'AGE'>('WAITING');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleOpenReview = (id: string) => {
    setSelectedAssessmentId(id);
    navigate(`/clinical/patient/${id}`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Section 18: Four Statistics (24, 6, 8, 4)
  const stats = [
    {
      label: 'NEW CASES',
      value: 24,
      subtext: '4 in the last hour',
      icon: Users,
      badge: 'Active Intake'
    },
    {
      label: 'PRIORITY REVIEW',
      value: 6,
      subtext: 'Requires clinical attention',
      icon: AlertCircle,
      isPriority: true,
      badge: 'Action Needed'
    },
    {
      label: 'AWAITING INFORMATION',
      value: 8,
      subtext: 'Follow-up requests pending',
      icon: HelpCircle,
      badge: 'Patient Pending'
    },
    {
      label: 'REFERRALS',
      value: 4,
      subtext: 'Prepared for specialist transfer',
      icon: Share2,
      badge: 'SCB / AIIMS'
    }
  ];

  // Filtering & Sorting for Section 20 Queue
  const filteredQueue = assessments.filter(a => {
    const matchesSearch = 
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filterUrgency !== 'ALL' && a.riskLevel !== filterUrgency) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'WAITING') return b.waitingMinutes - a.waitingMinutes;
    if (sortBy === 'URGENCY') {
      const score = (r: string) => r === 'HIGH' ? 3 : r === 'MEDIUM' ? 2 : 1;
      return score(b.riskLevel) - score(a.riskLevel);
    }
    if (sortBy === 'AGE') return b.patientAge - a.patientAge;
    return 0;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* ========================================================================= */}
      {/* Section 16: FACILITY CONTEXT (Compact)                                    */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 flex-shrink-0">
            <Building2 className="w-4 h-4 text-teal-700" />
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Current Facility</span>
              <span className="font-bold text-slate-900">{currentFacility || 'CAREQ Demo Primary Health Centre'}</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Role</span>
              <span className="font-semibold text-slate-700">Medical Officer</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Department</span>
              <span className="font-semibold text-slate-700">Primary Care</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Facility ID</span>
              <span className="font-mono text-[11px] text-teal-800 font-semibold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                {facilityId || 'FAC-DEMO-OD-001'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowFacilityModal(true)}
          className="self-start sm:self-auto px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 flex-shrink-0"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
          <span>Switch Facility</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* Section 17: CLINICAL DASHBOARD HEADER                                     */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] tracking-tight">
              Clinical Review Workspace
            </h1>
            <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
              Triage Support
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            AI-assisted information organization for human review
          </p>
        </div>

        {/* Section 17 Top-Right Clinical Identity */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
          <div className="w-9 h-9 rounded-full bg-[#0A1E3F] text-white flex items-center justify-center font-bold text-xs">
            AS
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900">{currentDoctor?.name || 'Dr. Ananya Sharma'}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Verified
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Facility: <span className="font-medium text-slate-700">{currentFacility || 'CAREQ Demo Primary Health Centre'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Section 18: TOP STATISTICS (24, 6, 8, 4)                                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div 
              key={idx} 
              className={`bg-white p-5 rounded-xl border transition-all shadow-2xs ${
                s.isPriority ? 'border-red-200/80 bg-red-50/10' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {s.label}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                  s.isPriority ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  {s.badge}
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                  {s.value}
                </div>
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                  <Icon className={`w-4 h-4 ${s.isPriority ? 'text-red-600' : 'text-slate-600'}`} />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 font-medium">
                {s.subtext}
              </p>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* Section 20: PATIENT REVIEW QUEUE                                          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        
        {/* Section 20 Toolbar: Search, Filter, Sort, Refresh */}
        <div className="p-4 sm:p-5 border-b border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Patient Review Queue
                </h2>
                <span className="bg-slate-100 text-slate-700 text-xs font-mono font-bold px-2 py-0.5 rounded">
                  {filteredQueue.length} Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Multimodal patient submissions organized for licensed medical officer triage
              </p>
            </div>

            <button
              onClick={handleRefresh}
              className="self-start sm:self-auto px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <RotateCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
            
            {/* Search Patient ID / Name */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Patient ID / Name..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden"
              />
            </div>

            {/* Filter & Sort Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              
              {/* Filter */}
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
                <button
                  onClick={() => setFilterUrgency('ALL')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                    filterUrgency === 'ALL' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterUrgency('HIGH')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all flex items-center gap-1 ${
                    filterUrgency === 'HIGH' ? 'bg-white text-red-700 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block" />
                  Priority
                </button>
                <button
                  onClick={() => setFilterUrgency('MEDIUM')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all flex items-center gap-1 ${
                    filterUrgency === 'MEDIUM' ? 'bg-white text-amber-700 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                  Attention
                </button>
                <button
                  onClick={() => setFilterUrgency('LOW')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all flex items-center gap-1 ${
                    filterUrgency === 'LOW' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  Routine
                </button>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-semibold"
                >
                  <option value="WAITING">Sort: Waiting Time</option>
                  <option value="URGENCY">Sort: Urgency</option>
                  <option value="AGE">Sort: Patient Age</option>
                </select>
              </div>

            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* Section 20 Table Columns: Patient | Age | Input | Urgency | Waiting | Status | Action */}
        {/* Section 21: Queue Status System (Red only for urgency indicator)          */}
        {/* ========================================================================= */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Age</th>
                <th className="py-3 px-4">Input</th>
                <th className="py-3 px-4">Urgency</th>
                <th className="py-3 px-4">Waiting</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQueue.map((a) => {
                // Section 21 Urgency Status Indicators:
                // HIGH PRIORITY: Red indicator (🔴 Priority)
                // ATTENTION: Amber indicator (🟠 Attention)
                // ROUTINE: Neutral/green indicator (⚪ Routine)
                const isHigh = a.riskLevel === 'HIGH';
                const isMedium = a.riskLevel === 'MEDIUM';

                return (
                  <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Patient */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900">{a.patientId}</div>
                      <div className="text-[11px] text-slate-600 font-medium">{a.patientName}</div>
                    </td>

                    {/* Age & Gender */}
                    <td className="py-3 px-4 text-slate-700">
                      <span className="font-semibold">{a.patientAge}</span> / {a.patientGender[0]}
                    </td>

                    {/* Input Modalities (e.g. Text + Report, Voice, etc.) */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-mono text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          Text
                        </span>
                        {a.hasVoice && (
                          <span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-medium">
                            + Voice
                          </span>
                        )}
                        {a.hasReport && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                            + Report
                          </span>
                        )}
                        {a.hasImage && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                            + Image
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Section 21: Restrained Urgency Indicator (Only indicator uses red) */}
                    <td className="py-3 px-4">
                      {isHigh ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold text-red-700 bg-red-50 border border-red-200">
                          <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-pulse" />
                          🔴 Priority
                        </span>
                      ) : isMedium ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200">
                          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                          🟠 Attention
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200">
                          <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                          ⚪ Routine
                        </span>
                      )}
                    </td>

                    {/* Waiting */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      {a.waitingMinutes} min
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        a.status === 'REVIEWED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        a.status === 'REFERRED' ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' :
                        a.status === 'INFO_REQUESTED' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {a.status === 'WAITING_REVIEW' ? 'Needs Review' :
                         a.status === 'INFO_REQUESTED' ? 'Awaiting Info' :
                         a.status === 'REVIEWED' ? 'Reviewed' : a.status}
                      </span>
                    </td>

                    {/* Action: [Open] */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenReview(a.id)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-50 text-[#0A1E3F] border border-slate-300 rounded-md text-xs font-bold shadow-2xs transition-all inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        <span>Open</span>
                      </button>
                    </td>

                  </tr>
                );
              })}
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

