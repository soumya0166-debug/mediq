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
  ShieldCheck
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
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            Clinical Diagnostic Vault • OCR Extraction Pipeline
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Multimodal Medical Reports Repository
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Ingested pathology, biochemistry, and radiologic reports transcribed for public health facility review
          </p>
        </div>

        <div className="text-xs font-mono text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-200">
          Showing {reports.length} extracted records
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {(['All', 'Hematology', 'Radiology', 'Biochemistry'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === cat
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search test name, hospital, or findings..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((rep) => (
          <div key={rep.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                  rep.badge === 'Hematology' ? 'bg-red-50 text-red-700 border border-red-200' :
                  rep.badge === 'Radiology' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                  'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {rep.badge}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  ✓ OCR 97%
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                {rep.title}
              </h3>

              <div className="text-xs text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{rep.hospital}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Collected: {rep.date}</span>
                </div>
              </div>

              {/* Extracted Parameters Preview */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Extracted Parameters:</span>
                {rep.tests.slice(0, 3).map((t, i) => (
                  <div key={i} className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-700 font-medium truncate max-w-[160px]">{t.testName}</span>
                    <span className={`font-mono font-bold ${t.isAbnormal ? 'text-red-700' : 'text-slate-900'}`}>
                      {t.result} {t.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                {rep.sampleType}
              </span>
              <button
                onClick={() => {
                  setSelectedAssessmentId('ASM-2026-00124');
                  navigate('/doctor/review/ASM-2026-00124');
                }}
                className="text-xs font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1"
              >
                <span>Inspect in Review</span>
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
