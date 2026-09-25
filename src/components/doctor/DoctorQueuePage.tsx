import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
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
  Share2,
  SlidersHorizontal,
  BookmarkCheck,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

export const DoctorQueuePage: React.FC = () => {
  const { assessments, navigate, setSelectedAssessmentId } = useApp();
  const { t } = useLanguage();
  
  // URL search query check for initial filter
  const urlFilter = new URLSearchParams(window.location.search).get('filter');
  
  const [filter, setFilter] = useState<'All' | 'High' | 'Waiting' | 'Reviewed' | 'Referral'>(
    urlFilter === 'HIGH' ? 'High' : 
    urlFilter === 'REVIEWED' ? 'Reviewed' : 
    urlFilter === 'REFERRED' ? 'Referral' : 
    urlFilter === 'WAITING' ? 'Waiting' : 'All'
  );

  const [savedView, setSavedView] = useState<'All Active' | 'Priority Shift' | 'Unreviewed Lab Data'>('All Active');
  const [sortBy, setSortBy] = useState<'WaitTime' | 'Urgency' | 'Age'>('WaitTime');
  const [search, setSearch] = useState('');

  const filteredAssessments = assessments.filter(a => {
    // Search match
    const matchesSearch = 
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.patientId.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    // Saved views filter
    if (savedView === 'Priority Shift' && a.riskLevel !== 'HIGH') return false;
    if (savedView === 'Unreviewed Lab Data' && (!a.hasReport || a.status === 'REVIEWED')) return false;

    // Filter match
    if (filter === 'High') return a.riskLevel === 'HIGH';
    if (filter === 'Waiting') return a.status === 'WAITING_REVIEW';
    if (filter === 'Reviewed') return a.status === 'REVIEWED';
    if (filter === 'Referral') return a.status === 'REFERRED';

    return true;
  }).sort((a, b) => {
    if (sortBy === 'WaitTime') return b.waitingMinutes - a.waitingMinutes;
    if (sortBy === 'Urgency') {
      const score = (lvl: string) => lvl === 'HIGH' ? 3 : lvl === 'MEDIUM' ? 2 : 1;
      return score(b.riskLevel) - score(a.riskLevel);
    }
    if (sortBy === 'Age') return b.patientAge - a.patientAge;
    return 0;
  });

  const handleOpenReview = (id: string) => {
    setSelectedAssessmentId(id);
    navigate(`/doctor/review/${id}`);
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-6 max-w-7xl mx-auto">
      
      {/* ========================================================================= */}
      {/* Section 26: Header                                                        */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-md">
            {t('nav.queue')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            {t('clinical.queueTitle')}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {t('clinical.queueSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs font-mono text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-2xs">
            Showing <span className="font-bold text-slate-900">{filteredAssessments.length}</span> of {assessments.length} cases
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Section 26: Toolbar: Search, Filters, Sort, Saved Views                   */}
      {/* ========================================================================= */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        
        {/* Row 1: Search & Filter Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'All', label: t('clinical.queueFilterAll') },
              { id: 'High', label: t('clinical.queueFilterHigh') },
              { id: 'Waiting', label: t('clinical.queueFilterWaiting') },
              { id: 'Reviewed', label: t('clinical.queueFilterReviewed') },
              { id: 'Referral', label: t('clinical.queueFilterReferral') },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === tab.id
                    ? 'bg-[#0A1E3F] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {tab.id === 'High' && <span className="w-2 h-2 rounded-full bg-red-500 inline-block mr-1.5" />}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('clinical.searchPlaceholder')}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden font-sans"
            />
          </div>

        </div>

        {/* Row 2: Saved Views & Sort Options */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Saved Views (Section 26) */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <BookmarkCheck className="w-3.5 h-3.5 text-teal-700" />
              Saved Views:
            </span>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'All Active', label: t('clinical.savedViewActive') },
                { id: 'Priority Shift', label: t('clinical.savedViewPriority') },
                { id: 'Unreviewed Lab Data', label: t('clinical.savedViewUnreviewed') },
              ].map((view) => (
                <button
                  key={view.id}
                  onClick={() => setSavedView(view.id as any)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                    savedView === view.id
                      ? 'bg-teal-50 text-teal-800 border border-teal-200 font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By (Section 26) */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              {t('common.sort')}:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 font-medium"
            >
              <option value="WaitTime">{t('clinical.sortByWaitTime')}</option>
              <option value="Urgency">{t('clinical.sortByUrgency')}</option>
              <option value="Age">{t('clinical.sortByAge')}</option>
            </select>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* Section 26 & 27: Patient Queue Table (Restrained Urgency Design)          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        
        {filteredAssessments.length === 0 ? (
          /* Section 48: Empty States */
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              No matching cases found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All current cases are outside this filter criteria, or active cases have already been reviewed.
            </p>
            <button
              onClick={() => {
                setFilter('All');
                setSavedView('All Active');
                setSearch('');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
            >
              View all cases
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">{t('patient.patientIdLabel')}</th>
                  <th className="py-3.5 px-4">{t('clinical.colPatient')} / {t('clinical.colAge')}</th>
                  <th className="py-3.5 px-4">{t('clinical.colInput')}</th>
                  <th className="py-3.5 px-4">{t('clinical.colUrgency')}</th>
                  <th className="py-3.5 px-4">{t('clinical.colWaiting')}</th>
                  <th className="py-3.5 px-4">{t('clinical.colStatus')}</th>
                  <th className="py-3.5 px-4 text-right">{t('clinical.colAction')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssessments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Patient ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {a.patientId}
                    </td>

                    {/* Patient Details */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{a.patientName}</div>
                      <div className="text-[11px] text-slate-500">
                        {a.patientAge} / {a.patientGender === 'Female' ? t('common.female') : a.patientGender === 'Male' ? t('common.male') : t('common.other')} • {a.patientLanguage}
                      </div>
                    </td>

                    {/* Multimodal Input Sources Chips */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap items-center gap-1 font-mono text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {t('clinical.typeText').toUpperCase()}
                        </span>
                        {a.hasVoice && (
                          <span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-medium">
                            {t('clinical.typeVoice').toUpperCase()}
                          </span>
                        )}
                        {a.hasReport && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                            {t('nav.reports').toUpperCase()}
                          </span>
                        )}
                        {a.hasImage && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                            {t('clinical.tabImages').toUpperCase()}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Urgency Signal (Section 27: restrained status indicator) */}
                    <td className="py-3.5 px-4">
                      <RiskBadge level={a.riskLevel} size="sm" />
                    </td>

                    {/* Waiting Time */}
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {a.waitingMinutes} {t('common.minutes')}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        a.status === 'REVIEWED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        a.status === 'REFERRED' ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {a.status === 'WAITING_REVIEW' ? t('clinical.needsReviewStatus') : 
                         a.status === 'REVIEWED' ? t('clinical.reviewedStatus') : 
                         a.status === 'REFERRED' ? t('clinical.referredStatus') : a.status}
                      </span>
                    </td>

                    {/* Action: Open */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenReview(a.id)}
                        className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-md text-xs font-semibold shadow-2xs transition-all inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        <span>{t('clinical.openBtn')}</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
