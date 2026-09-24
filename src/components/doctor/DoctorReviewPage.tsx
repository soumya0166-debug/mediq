import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  User, 
  FileText, 
  Mic, 
  Image as ImageIcon, 
  Clock, 
  AlertCircle, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  Share2, 
  ArrowLeft, 
  MessageSquare, 
  FileCheck, 
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Volume2,
  Calendar,
  Send,
  Eye,
  X,
  ExternalLink,
  Edit2,
  Trash2,
  Check
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';
import { SourceTraceItem } from '../../types';

export const DoctorReviewPage: React.FC = () => {
  const { 
    selectedAssessment, 
    navigate, 
    markAssessmentReviewed, 
    requestFollowUp, 
    markQuestionAnswered,
    updateAssessment
  } = useApp();

  const assessment = selectedAssessment;

  const [activeCenterTab, setActiveCenterTab] = useState<
    'Overview' | 'Symptoms' | 'Timeline' | 'Reports' | 'Voice' | 'Images' | 'Translations'
  >('Overview');

  // Source Traceability Modal / Drawer (Section 31)
  const [selectedSource, setSelectedSource] = useState<SourceTraceItem | null>(null);

  // Section 34: Request Information Side Panel / Drawer
  const [showRequestPanel, setShowRequestPanel] = useState(false);
  const [inquiryQuestion, setInquiryQuestion] = useState('');
  const [inquiryType, setInquiryType] = useState<'text' | 'voice' | 'choice'>('text');

  // Review & Clinical Note Modals
  const [showCompleteReviewModal, setShowCompleteReviewModal] = useState(false);
  const [clinicalNoteInput, setClinicalNoteInput] = useState('');

  // Editing Follow-up Questions (Section 33)
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editingQuestionText, setEditingQuestionText] = useState('');

  if (!assessment) {
    return (
      <div className="p-12 text-center text-slate-500 space-y-3">
        <p className="text-sm">No active case selected for clinical review.</p>
        <button 
          onClick={() => navigate('/doctor/queue')} 
          className="px-4 py-2 bg-[#0A1E3F] text-white rounded-lg text-xs font-semibold"
        >
          Return to Patient Queue
        </button>
      </div>
    );
  }

  // Handle Completing Review (Section 35)
  const handleConfirmCompleteReview = () => {
    const note = clinicalNoteInput.trim() || 'Reviewed patient-reported symptoms and lab findings. Supportive care advised, patient alerted to monitoring protocol.';
    markAssessmentReviewed(assessment.id, note);
    setShowCompleteReviewModal(false);
  };

  // Handle Section 34 Send to Patient
  const handleSendToPatient = () => {
    if (!inquiryQuestion.trim()) return;
    requestFollowUp(assessment.id, inquiryQuestion, `Clinician requested via ${inquiryType} response format`);
    setInquiryQuestion('');
    setShowRequestPanel(false);
  };

  // Handle Edit Follow-up question (Section 33)
  const handleSaveEditedQuestion = (qId: string) => {
    if (!editingQuestionText.trim()) return;
    const updated = assessment.followUpQuestions.map(q => 
      q.id === qId ? { ...q, question: editingQuestionText } : q
    );
    updateAssessment(assessment.id, { followUpQuestions: updated });
    setEditingQuestionId(null);
  };

  // Handle Remove Follow-up question (Section 33)
  const handleRemoveQuestion = (qId: string) => {
    const updated = assessment.followUpQuestions.filter(q => q.id !== qId);
    updateAssessment(assessment.id, { followUpQuestions: updated });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      
      {/* Top Breadcrumb & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/doctor/queue')}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
            title="Return to Queue"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-extrabold text-slate-900">{assessment.patientId}</span>
              <RiskBadge level={assessment.riskLevel} size="sm" />
              <span className="text-xs text-slate-500 font-mono">• Ingested {assessment.waitingMinutes}m ago</span>
            </div>
            <div className="text-xs text-slate-600 font-medium">
              Case Review • {assessment.patientName} ({assessment.patientAge}y, {assessment.patientGender})
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/doctor/referral/${assessment.id}`)}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-600" />
            <span>Referral Draft</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Section 28: THREE-PANEL CLINICAL REVIEW WORKSPACE                         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT PANEL (Section 22): Patient Context & Health Timeline               */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
            
            {/* Header: Patient Context */}
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                PATIENT CONTEXT
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                {assessment.patientName}
              </h2>
              <div className="text-xs font-mono font-bold text-slate-600">
                {assessment.patientId}
              </div>
            </div>

            {/* Demographics */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Age:</span>
                <span className="font-semibold text-slate-900">{assessment.patientAge} years</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Gender:</span>
                <span className="font-semibold text-slate-900">{assessment.patientGender}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Language:</span>
                <span className="font-semibold text-teal-800">{assessment.patientLanguage}</span>
              </div>
            </div>

            {/* Verification & Consent States (Sections 22 & 30) */}
            <div className="space-y-2 pt-1">
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <span className="font-medium text-emerald-900">Identity:</span>
                <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Verified
                </span>
              </div>

              {/* Section 30 Healthcare Worker Consent View */}
              <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-teal-900">Patient Consent:</span>
                  <span className="font-bold text-teal-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />
                    Active
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] font-semibold text-teal-950 pt-1.5 border-t border-teal-200/70">
                  <span className="flex items-center gap-1">Symptoms <span className="text-teal-700">✓</span></span>
                  <span className="flex items-center gap-1">Reports <span className="text-teal-700">✓</span></span>
                  <span className="flex items-center gap-1">Voice <span className="text-teal-700">✓</span></span>
                  <span className="flex items-center gap-1">Translation <span className="text-teal-700">✓</span></span>
                </div>
              </div>
            </div>

            {/* Section 22: Health Timeline */}
            <div className="pt-3 border-t border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Health Timeline
                </span>
                <span className="text-[10px] text-teal-700 font-mono font-semibold">Today</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-600 flex-shrink-0" />
                  <span className="font-semibold text-slate-800">Symptoms submitted</span>
                </div>
                <div className="text-center text-slate-400 text-xs leading-none">↓</div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                  <span className="font-semibold text-slate-800">Report uploaded</span>
                </div>
                <div className="text-center text-slate-400 text-xs leading-none">↓</div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0A1E3F] flex-shrink-0" />
                  <span className="font-semibold text-slate-800">Information organized</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTER PANEL (Sections 30-33): AI-Assisted Triage Summary                */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Main Card with Tabs */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            
            {/* Header: AI-Assisted Triage Summary (Section 30) */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  AI-Assisted Triage Summary
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Organized clinical information synthesized for human oversight.
                </p>
              </div>
              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded self-start">
                Triage Support Only
              </span>
            </div>

            {/* Navigation Tabs (Section 30) */}
            <div className="flex items-center border-b border-slate-200 overflow-x-auto bg-slate-50/80 px-2 py-1 gap-1 text-xs font-semibold">
              {(['Overview', 'Symptoms', 'Timeline', 'Reports', 'Voice', 'Images', 'Translations'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCenterTab(tab)}
                  className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                    activeCenterTab === tab
                      ? 'bg-white text-slate-900 shadow-2xs font-bold border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB CONTENTS */}
            <div className="p-5 space-y-5">
              
              {/* TAB 1: OVERVIEW (Section 30 Spec) */}
              {activeCenterTab === 'Overview' && (
                <div className="space-y-4 text-xs">
                  
                  {/* Patient-reported symptoms */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                        Patient-reported symptoms:
                      </strong>
                      <span className="text-[10px] text-slate-400 font-mono">Multimodal Extraction</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {assessment.structuredSymptoms.map((s, idx) => (
                        <div 
                          key={idx} 
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-md font-semibold text-slate-800 flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 font-medium">Duration:</span>
                      <span className="font-bold text-slate-900 ml-2">{assessment.reportedDuration}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Patient reported</span>
                  </div>

                  {/* Information extracted */}
                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2 text-slate-800">
                    <strong className="font-bold uppercase tracking-wider text-[11px] text-blue-900 block">
                      Information extracted:
                    </strong>
                    {assessment.extractedReports.length > 0 ? (
                      <div className="space-y-1">
                        <div className="font-semibold text-slate-900">
                          {assessment.extractedReports[0].reportName} ({assessment.extractedReports[0].fileName})
                        </div>
                        <p className="text-slate-600 text-[11px]">
                          Elevated WBC (14,200 /µL), Neutrophilia (82%), Elevated ESR. Rest of basic panel within baseline reference.
                        </p>
                      </div>
                    ) : (
                      <p className="text-slate-500">No lab documents attached in current submission.</p>
                    )}
                  </div>

                  {/* Information missing (Section 30) */}
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2 text-amber-950">
                    <div className="flex items-center justify-between">
                      <strong className="font-bold uppercase tracking-wider text-[11px] text-amber-900">
                        Information missing:
                      </strong>
                      <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                        Action Required
                      </span>
                    </div>
                    <ul className="space-y-1 text-slate-700 list-disc list-inside">
                      {assessment.missingInformation.map((m, idx) => (
                        <li key={idx} className="font-medium">
                          {typeof m === 'string' ? m : `${(m as any).field || ''}: ${(m as any).description || ''}`}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Section 31: Source Traceability List */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                        Source Traceability (Section 31)
                      </span>
                      <span className="text-[10px] text-slate-400">Click to view source</span>
                    </div>

                    <div className="space-y-1.5">
                      {(assessment.sourceTraceability || []).map((item) => (
                        <div 
                          key={item.id}
                          className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-teal-500/50 transition-all flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="truncate">
                            <span className="font-semibold text-slate-900">"{item.statement}"</span>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <span>Source:</span>
                              <span className="font-medium text-slate-700">{item.sourceLabel || item.sourceType}</span>
                              {item.confidenceScore && <span>• Conf: {Math.round(item.confidenceScore * 100)}%</span>}
                            </div>
                          </div>

                          <button
                            onClick={() => setSelectedSource(item)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 text-[11px] font-semibold flex-shrink-0 transition-all"
                          >
                            View Source
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: SYMPTOMS */}
              {activeCenterTab === 'Symptoms' && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Raw Patient Input ({assessment.detectedLanguage})
                    </span>
                    <p className="text-slate-900 font-medium leading-relaxed text-sm">
                      {assessment.rawSymptomText}
                    </p>
                  </div>

                  {assessment.translatedEnglishText && (
                    <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900">
                        English Translation for Healthcare Professional Review
                      </span>
                      <p className="text-blue-950 font-medium leading-relaxed text-sm italic">
                        "{assessment.translatedEnglishText}"
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: TIMELINE */}
              {activeCenterTab === 'Timeline' && (
                <div className="space-y-3 text-xs">
                  {assessment.timeline.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex gap-3">
                      <div className="font-mono font-bold text-slate-900 min-w-16">{item.day}</div>
                      <div>
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <p className="text-slate-600 mt-0.5">{item.description}</p>
                        <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                          Ingestion source: {item.source}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: REPORTS */}
              {activeCenterTab === 'Reports' && (
                <div className="space-y-4 text-xs">
                  {assessment.extractedReports.map((rep) => (
                    <div key={rep.id} className="border border-slate-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-sm">{rep.reportName}</h4>
                        <span className="font-mono text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                          OCR Confidence {Math.round(rep.ocrConfidence * 100)}%
                        </span>
                      </div>
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-semibold">
                          <tr>
                            <th className="p-2">Test Name</th>
                            <th className="p-2">Observed Result</th>
                            <th className="p-2">Reference Range</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {rep.tests.map((t, idx) => (
                            <tr key={idx} className={t.isAbnormal ? 'bg-amber-50/70 font-semibold' : ''}>
                              <td className="p-2 text-slate-900">{t.testName}</td>
                              <td className="p-2 font-mono text-slate-900">{t.result} {t.unit}</td>
                              <td className="p-2 text-slate-500">{t.referenceRange}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 5: VOICE */}
              {activeCenterTab === 'Voice' && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-teal-400" />
                      <span className="font-medium">Voice Record Track (14 seconds)</span>
                    </div>
                    <span className="font-mono text-emerald-400 text-[11px]">96.2% STT Confidence</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Original Odia Audio Transcription
                    </span>
                    <p className="text-slate-900 text-sm">
                      {assessment.voiceTranscript || 'Voice transcript present.'}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 6: IMAGES */}
              {activeCenterTab === 'Images' && (
                <div className="space-y-3 text-xs">
                  {assessment.imageUrls && assessment.imageUrls.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {assessment.imageUrls.map((url, i) => (
                        <div key={i} className="rounded-xl overflow-hidden border border-slate-200">
                          <img src={url} alt="Clinical upload" className="w-full h-44 object-cover" />
                          <div className="p-2 bg-slate-50 text-[11px] text-slate-600 text-center font-medium">
                            Patient clinical photograph #{i + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      No photographic attachments provided.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: TRANSLATIONS */}
              {activeCenterTab === 'Translations' && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Source Speech Language: {assessment.patientLanguage}
                    </span>
                    <p className="text-slate-900 text-sm">
                      {assessment.rawSymptomText}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-900">
                      Clinician Translation: English
                    </span>
                    <p className="text-teal-950 text-sm font-medium">
                      "{assessment.translatedEnglishText}"
                    </p>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* ========================================================================= */}
          {/* Section 23: Urgency Signals Card                                          */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                Urgency Signals
              </h3>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Section 23
              </span>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-lg border text-xs flex items-center justify-between gap-3 bg-red-50/50 border-red-200/80">
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">🔴</span>
                  <span className="font-semibold text-red-950">Breathing difficulty reported</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Voice
                </span>
              </div>

              <div className="p-3 rounded-lg border text-xs flex items-center justify-between gap-3 bg-amber-50/50 border-amber-200/80">
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">🟠</span>
                  <span className="font-semibold text-amber-950">Persistent fever reported</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Text
                </span>
              </div>

              <div className="p-3 rounded-lg border text-xs flex items-center justify-between gap-3 bg-slate-50 border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">⚪</span>
                  <span className="font-semibold text-slate-700">No chest pain reported</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Voice
                </span>
              </div>
            </div>

            {/* Section 23 Mandatory Disclaimer */}
            <p className="text-[11px] text-slate-500 italic pt-1 text-center border-t border-slate-100 font-medium">
              These are information signals requiring professional review. They are not a diagnosis.
            </p>
          </div>

          {/* ========================================================================= */}
          {/* Section 33: Suggested Follow-up Questions Card                            */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-teal-700" />
                  Suggested Follow-up Questions (Section 33)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  AI-identified information gaps to support clinical triage review.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {assessment.followUpQuestions.map((q, idx) => (
                <div key={q.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
                  
                  {editingQuestionId === q.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editingQuestionText}
                        onChange={(e) => setEditingQuestionText(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEditedQuestion(q.id)}
                          className="px-2.5 py-1 bg-teal-700 text-white rounded text-[11px] font-bold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingQuestionId(null)}
                          className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded text-[11px]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-medium text-slate-900">
                        <span className="text-teal-700 font-bold mr-1.5">{idx + 1}.</span>
                        <span>{q.question}</span>
                      </div>
                      
                      {q.status === 'ANSWERED' ? (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex-shrink-0">
                          ✓ Answered
                        </span>
                      ) : q.status === 'ASKED' ? (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded flex-shrink-0">
                          Sent to Patient
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 bg-slate-200 px-2 py-0.5 rounded flex-shrink-0">
                          Suggested
                        </span>
                      )}
                    </div>
                  )}

                  {/* Patient Answer if available */}
                  {q.answer && (
                    <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium text-[11px]">
                      Patient Response: "{q.answer}"
                    </div>
                  )}

                  {/* Section 33 Action buttons: Ask Patient, Edit, Remove */}
                  {q.status !== 'ANSWERED' && !editingQuestionId && (
                    <div className="flex items-center gap-1.5 pt-1">
                      {q.status === 'PENDING' && (
                        <button
                          onClick={() => {
                            setInquiryQuestion(q.question);
                            setShowRequestPanel(true);
                          }}
                          className="px-2.5 py-1 bg-[#0A1E3F] hover:bg-[#07152c] text-white rounded text-[11px] font-semibold transition-all"
                        >
                          Ask Patient
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditingQuestionId(q.id);
                          setEditingQuestionText(q.question);
                        }}
                        className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-[11px] font-medium transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemoveQuestion(q.id)}
                        className="px-2 py-1 bg-white hover:bg-red-50 text-slate-500 hover:text-red-700 border border-slate-300 rounded text-[11px] font-medium transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL (Section 35): Review Actions Panel                            */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4 sticky top-20">
            
            <div className="border-b border-slate-100 pb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Healthcare Review Actions
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                Review Actions (Section 35)
              </h3>
            </div>

            {/* Actions Stack */}
            <div className="space-y-2.5">
              
              {/* PRIMARY CTA: Complete Review (Visually dominant) */}
              <button
                onClick={() => setShowCompleteReviewModal(true)}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Review</span>
              </button>

              {/* SECONDARY: Request More Information */}
              <button
                onClick={() => {
                  setInquiryQuestion('Are you currently experiencing difficulty breathing?');
                  setShowRequestPanel(true);
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Request More Information</span>
              </button>

              {/* SECONDARY: Add to Priority Queue */}
              <button
                onClick={() => {
                  updateAssessment(assessment.id, { riskLevel: 'HIGH' });
                  alert(`Case ${assessment.patientId} flagged as HIGH PRIORITY.`);
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4 text-red-600" />
                <span>Add to Priority Queue</span>
              </button>

              {/* SECONDARY: Prepare Referral */}
              <button
                onClick={() => navigate(`/doctor/referral/${assessment.id}`)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4 text-slate-600" />
                <span>Prepare Referral</span>
              </button>

              {/* SECONDARY: Add Clinical Note */}
              <button
                onClick={() => setShowCompleteReviewModal(true)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-slate-600" />
                <span>Add Clinical Note</span>
              </button>

            </div>

            {/* Current Status Badge */}
            {assessment.status === 'REVIEWED' && (
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4" /> Review Complete
                </div>
                <p className="text-[11px] text-slate-600">
                  Reviewed by {assessment.reviewedBy || 'Dr. Ananya Sharma'}
                </p>
              </div>
            )}

            {/* Mandatory Safety Notice */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500 leading-snug">
              <strong className="text-slate-800 block mb-0.5">Clinical Oversight Mandate:</strong>
              CAREQ provides advisory triage support only. All diagnostic decisions and referrals remain the sole responsibility of the authorized reviewer.
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* Section 34: Patient ↔ Healthcare Worker Loop (Side Panel)                  */}
      {/* ========================================================================= */}
      {showRequestPanel && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-2xs">
          <div className="bg-white w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Request Information
                  </h3>
                  <p className="text-xs text-slate-500">
                    Patient ↔ Healthcare Worker Loop (Section 34)
                  </p>
                </div>
                <button
                  onClick={() => setShowRequestPanel(false)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Patient recipient banner */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500">Recipient:</span>{' '}
                <span className="font-bold text-slate-900">{assessment.patientName}</span>{' '}
                <span className="font-mono text-slate-500">({assessment.patientId})</span>
              </div>

              {/* Question Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Question for Patient:
                </label>
                <textarea
                  rows={4}
                  value={inquiryQuestion}
                  onChange={(e) => setInquiryQuestion(e.target.value)}
                  placeholder="e.g. Are you currently experiencing difficulty breathing?"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden"
                />
              </div>

              {/* Response Type Selector (Section 34 Spec: Text, Voice, Multiple Choice) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Select Expected Response Type:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'text', label: 'Text' },
                    { id: 'voice', label: 'Voice' },
                    { id: 'choice', label: 'Multiple Choice' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setInquiryType(t.id as any)}
                      className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all ${
                        inquiryType === t.id
                          ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
                Sending this inquiry will notify the patient portal and set the case status to "Awaiting Information".
              </div>

            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => setShowRequestPanel(false)}
                className="flex-1 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendToPatient}
                className="flex-1 py-2.5 bg-[#0A1E3F] hover:bg-[#07152c] text-white rounded-lg text-xs font-bold transition-all shadow-xs"
              >
                Send to Patient
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Section 31: Source Traceability Inspection Modal                           */}
      {/* ========================================================================= */}
      {selectedSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-2xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-700" />
                <h3 className="font-bold text-sm text-slate-900">
                  AI Source Traceability (Section 31)
                </h3>
              </div>
              <button
                onClick={() => setSelectedSource(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Extracted Statement:</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">
                  "{selectedSource.statement}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 text-[10px]">Source Modality:</span>
                  <div className="font-semibold text-slate-900">{selectedSource.sourceType}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">System Confidence:</span>
                  <div className="font-mono font-bold text-teal-800">
                    {selectedSource.confidenceScore ? `${Math.round(selectedSource.confidenceScore * 100)}%` : 'Attested'}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Original Evidence Snippet:</span>
                <p className="text-slate-800 font-mono text-[11px] leading-relaxed">
                  {selectedSource.sourceExcerpt}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSource(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Complete Review & Clinical Note Modal (Section 35)                         */}
      {/* ========================================================================= */}
      {showCompleteReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-2xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">
              Complete Clinical Review
            </h3>
            <p className="text-xs text-slate-500">
              Document your clinical triage note. This action attests that a qualified healthcare worker has reviewed the multimodal inputs.
            </p>
            <textarea
              rows={4}
              value={clinicalNoteInput}
              onChange={(e) => setClinicalNoteInput(e.target.value)}
              placeholder="e.g. Evaluated reported symptoms and CBC leukocytosis. Advised supportive therapy, strict oral hydration, and red-flag re-evaluation if dyspnea worsens."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCompleteReviewModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCompleteReview}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                Confirm Review Complete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
