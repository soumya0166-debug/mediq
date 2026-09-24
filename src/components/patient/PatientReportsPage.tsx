import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
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
  const { currentPatient, assessments } = useApp();

  const [activeReportIndex, setActiveReportIndex] = useState(0);
  const sampleReports = SAMPLE_REPORTS_LIBRARY;
  const currentReport = sampleReports[activeReportIndex] || sampleReports[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
            Ayushman Digital Locker • ABDM Compatible
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            My Medical Reports & OCR Extractions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Structured laboratory parameters extracted automatically for clinical review
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 font-semibold flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Verified Locker: {currentPatient?.id}
          </span>
        </div>
      </div>

      {/* Grid: Left Report Selector | Right Extracted Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Report List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Available Documents ({sampleReports.length})
          </h3>

          <div className="space-y-2">
            {sampleReports.map((r, idx) => (
              <div
                key={r.id}
                onClick={() => setActiveReportIndex(idx)}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                  activeReportIndex === idx
                    ? 'bg-blue-50/80 border-blue-600 shadow-sm ring-1 ring-blue-500/20'
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
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {r.hospital}
                </p>
                
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span className="text-emerald-700 font-semibold">✓ OCR Extracted</span>
                  <span className="font-semibold text-blue-900">View Data →</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-teal-700" />
              Upload Additional Report
            </span>
            <p className="text-slate-500 text-[11px]">
              Supported: PDF, JPG, PNG from diagnostic centers. Max 10MB.
            </p>
            <button
              onClick={() => alert('Demo simulated upload: You can attach new reports from "New Assessment"')}
              className="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold rounded-xl transition-all shadow-2xs"
            >
              Browse Files...
            </button>
          </div>
        </div>

        {/* Right Column: OCR Extraction Deep Dive */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            
            {/* Report Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {currentReport.badge} Diagnostic Report
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                  {currentReport.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {currentReport.hospital}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {currentReport.date}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => alert('Simulated report PDF downloaded to your device.')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

            {/* Guardrail Banner */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Information Extracted from Report:</strong>
                <p className="mt-0.5 text-amber-800 leading-snug">
                  The values below were transcribed automatically by Optical Character Recognition (OCR). This summary is for healthcare-worker review and does not constitute a clinical diagnosis.
                </p>
              </div>
            </div>

            {/* Extracted Tests Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Test Parameter</th>
                    <th className="py-3 px-4">Extracted Result</th>
                    <th className="py-3 px-4">Reference Range</th>
                    <th className="py-3 px-4">Signal Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentReport.tests.map((t, i) => (
                    <tr key={i} className={t.isAbnormal ? 'bg-amber-50/60' : ''}>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{t.testName}</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                        {t.result} <span className="text-slate-500 text-[10px] font-normal">{t.unit}</span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-500 font-mono text-[11px]">{t.referenceRange}</td>
                      <td className="py-2.5 px-4">
                        {t.isAbnormal ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            Outside Reference Interval
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">Normal</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Raw OCR Text View (Collapsible) */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Raw Machine-Readable OCR Output
              </h4>
              <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-48 border border-slate-800">
                {currentReport.rawOcrText}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
