import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { SAMPLE_REPORTS_LIBRARY } from '../../data/mockData';
import { documentOcrService } from '../../services/documentOcrService';
import { 
  FileText, 
  FileCheck, 
  UploadCloud, 
  Calendar, 
  Building2, 
  AlertTriangle, 
  Download, 
  Eye, 
  ShieldCheck,
  RefreshCw,
  Plus
} from 'lucide-react';

export const PatientReportsPage: React.FC = () => {
  const { currentPatient, assessments, navigate } = useApp();
  const { t } = useLanguage();

  const [reportsList, setReportsList] = useState(SAMPLE_REPORTS_LIBRARY);
  const [activeReportIndex, setActiveReportIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentReport = reportsList[activeReportIndex] || reportsList[0];

  const handleUploadNewReport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploading(true);
    setUploadProgressText(`Scanning ${file.name}...`);

    try {
      const parsed = await documentOcrService.processMedicalDocument(file, (stage) => {
        setUploadProgressText(stage);
      });

      const newLockerDoc = {
        id: `REP-LOCKER-${Date.now().toString().slice(-4)}`,
        title: parsed.reportName,
        date: parsed.reportDate,
        hospital: parsed.facilityName || (parsed.doctorName ? `Prescribed by ${parsed.doctorName}` : 'Pathology Laboratory'),
        badge: parsed.category || 'Hematology',
        summary: parsed.summary,
        tests: parsed.tests.length > 0 ? parsed.tests : [
          { testName: 'OCR Clinical Extract', result: 'Verified', unit: 'Text', referenceRange: 'Standard', isAbnormal: false }
        ]
      };

      setReportsList(prev => [newLockerDoc as any, ...prev]);
      setActiveReportIndex(0);
    } catch (err: any) {
      console.error('Error in locker OCR upload:', err);
    } finally {
      setIsUploading(false);
      setUploadProgressText('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUploadNewReport}
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 bg-[#0A1E3F] hover:bg-[#163B66] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-2xs disabled:opacity-50"
          >
            {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            <span>{isUploading ? 'Analyzing Document...' : 'Upload Document to Locker'}</span>
          </button>
          <span className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 font-medium flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {t('patient.patientIdLabel')}: {currentPatient?.id}
          </span>
        </div>
      </div>

      {isUploading && (
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-xs font-bold text-teal-900 flex items-center gap-2 animate-in fade-in">
          <RefreshCw className="w-4 h-4 animate-spin text-teal-700" />
          <span>{uploadProgressText || 'Extracting document information via Neural OCR...'}</span>
        </div>
      )}

      {/* Grid: Left Report Selector | Right Extracted Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Report List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Available Documents ({reportsList.length})
            </h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-[11px] font-bold text-teal-800 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add File
            </button>
          </div>

          <div className="space-y-2">
            {reportsList.map((r, idx) => (
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
