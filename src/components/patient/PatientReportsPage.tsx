import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { SAMPLE_REPORTS_LIBRARY } from '../../data/mockData';
import { 
  FileText, 
  FileCheck, 
  UploadCloud, 
  Calendar, 
  Building2, 
  AlertTriangle, 
  Download, 
  Eye, 
  ShieldCheck 
} from 'lucide-react';

export const PatientReportsPage: React.FC = () => {
  const { currentPatient, assessments, navigate } = useApp();
  const { t } = useLanguage();

  const [activeReportIndex, setActiveReportIndex] = useState(0);
  const sampleReports = SAMPLE_REPORTS_LIBRARY;
  const currentReport = sampleReports[activeReportIndex] || sampleReports[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-md">
            {t('patient.lockerTitle')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            {t('patient.lockerSubtitle')}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {t('patient.lockerDesc')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 font-medium flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {t('patient.patientIdLabel')}: {currentPatient?.id}
          </span>
        </div>
      </div>

      {/* Grid: Left Report Selector | Right Extracted Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Report List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Available Documents ({sampleReports.length})
          </h3>

          <div className="space-y-2">
            {sampleReports.map((r, idx) => (
              <div
                key={r.id}
                onClick={() => setActiveReportIndex(idx)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  activeReportIndex === idx
                    ? 'bg-teal-50/50 border-teal-600 shadow-2xs ring-1 ring-teal-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    r.badge === 'Hematology' ? 'bg-red-50 text-red-700 border border-red-200' :
                    r.badge === 'Radiology' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                    'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {r.badge}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{r.date}</span>
                </div>
                
                <h4 className="font-bold text-xs text-slate-900 mt-2">
                  {r.title}
                </h4>
                
                <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                  <span className="truncate">{r.hospital}</span>
                  <span className="font-mono text-emerald-800 font-semibold">98.4% OCR</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/patient/new-assessment')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 border border-slate-300"
          >
            <UploadCloud className="w-4 h-4 text-slate-600" />
            <span>Upload New Report in Assessment</span>
          </button>
        </div>

        {/* Right Column: Active Extracted Report Detail */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Extracted Document Record
                </span>
                <h2 className="text-lg font-extrabold text-slate-900">
                  {currentReport.title}
                </h2>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                  <span>{currentReport.hospital}</span>
                  <span>•</span>
                  <span>Date: {currentReport.date}</span>
                  <span>•</span>
                  <span className="font-mono">2.4 MB PDF</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                  ✓ OCR Confidence: 98.4%
                </span>
              </div>
            </div>

            {/* Extracted Clinical Summary */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                OCR Extracted Summary:
              </span>
              <p className="text-slate-800 leading-relaxed font-medium">
                {currentReport.summary}
              </p>
            </div>

            {/* Structured Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Extracted Biomarkers & Test Parameters
              </h3>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="py-2.5 px-4">Test Parameter</th>
                      <th className="py-2.5 px-4">Observed Value</th>
                      <th className="py-2.5 px-4">Reference Range</th>
                      <th className="py-2.5 px-4 text-right">Status Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentReport.tests.map((t, idx) => (
                      <tr key={idx} className={t.isAbnormal ? 'bg-amber-50/60 font-semibold' : ''}>
                        <td className="py-2.5 px-4 text-slate-900">{t.testName}</td>
                        <td className="py-2.5 px-4 font-mono text-slate-900">{t.result} {t.unit}</td>
                        <td className="py-2.5 px-4 text-slate-500">{t.referenceRange}</td>
                        <td className="py-2.5 px-4 text-right">
                          {t.isAbnormal ? (
                            <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px] font-bold">
                              Outside Reference
                            </span>
                          ) : (
                            <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px] font-medium">
                              Normal
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500">
              <strong>Advisory Extraction Notice:</strong> Automated report extractions are generated to assist healthcare workers in clinical triage and must be verified against original physical or signed pathology copies.
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
