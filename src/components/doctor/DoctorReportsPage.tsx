import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_REPORTS_LIBRARY } from '../../data/mockData';
import { 
  FileCheck, 
  Search, 
  Filter, 
  Building2, 
  Calendar, 
  AlertTriangle, 
  Eye, 
  Download,
  ShieldCheck,
  FileText
} from 'lucide-react';

export const DoctorReportsPage: React.FC = () => {
  const { assessments, navigate, setSelectedAssessmentId } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Hematology' | 'Radiology' | 'Biochemistry'>('All');

  const reports = SAMPLE_REPORTS_LIBRARY.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (categoryFilter !== 'All' && r.badge !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-md">
            Diagnostic Health Vault
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Lab & Radiology Reports Vault
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Multimodal clinical documents processed via OCR extraction pipeline for healthcare worker review.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-2xs">
          Showing {reports.length} extracted records
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {(['All', 'Hematology', 'Radiology', 'Biochemistry'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === cat
                  ? 'bg-[#0A1E3F] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search test name, hospital, or findings..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden"
          />
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reports.map((rep) => (
          <div 
            key={rep.id} 
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  rep.badge === 'Hematology' ? 'bg-red-50 text-red-700 border border-red-200' :
                  rep.badge === 'Radiology' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                  'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {rep.badge}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ OCR 98.4% Conf.
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900">{rep.title}</h3>
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  <span>{rep.hospital}</span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{rep.date}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Extracted Findings:
                </span>
                <p className="leading-snug">{rep.summary}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400 text-[11px]">2.4 MB PDF</span>
              <button
                onClick={() => navigate('/doctor/queue')}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-semibold transition-all flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5 text-slate-600" />
                <span>Open in Case</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
