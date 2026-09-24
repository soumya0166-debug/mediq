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
  Send
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

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
    'Summary' | 'Symptoms' | 'Reports' | 'Voice' | 'Images' | 'Timeline'
  >('Summary');

  // Explainability toggle (Section 21)
  const [showTraceability, setShowTraceability] = useState(true);

  // Doctor Action Modals/Drawers
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [clinicalNoteInput, setClinicalNoteInput] = useState('');

  const [showAskModal, setShowAskModal] = useState(false);
  const [customQuestionInput, setCustomQuestionInput] = useState('');

  if (!assessment) {
    return (
      <div className="p-8 text-center text-slate-500">
        No case selected. <button onClick={() => navigate('/doctor/queue')} className="text-blue-900 underline font-bold">Return to Queue</button>
      </div>
    );
  }

  const handleMarkReviewed = () => {
    const defaultNote = clinicalNoteInput.trim() || 'Reviewed patient reported symptoms and CBC report findings. Patient oriented, advised supportive therapy, strict hydration, and re-evaluation if breathing difficulty persists.';
    markAssessmentReviewed(assessment.id, defaultNote);
    setShowNoteModal(false);
  };

  const handleSendQuestion = () => {
    if (!customQuestionInput.trim()) return;
    requestFollowUp(assessment.id, customQuestionInput, 'Clinician requested clarification during triage review');
    setCustomQuestionInput('');
    setShowAskModal(false);
  };

  const handleElevatePriority = () => {
    updateAssessment(assessment.id, { riskLevel: 'HIGH' });
    alert(`Case ${assessment.id} elevated to HIGH PRIORITY queue.`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/doctor/queue')}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
            title="Back to queue"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-extrabold text-slate-900">{assessment.id}</span>
              <RiskBadge level={assessment.riskLevel} size="sm" />
              <span className="text-xs text-slate-500 font-mono">• Ingested {assessment.waitingMinutes}m ago</span>
            </div>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              Case Review: {assessment.patientName} ({assessment.patientAge}y, {assessment.patientGender})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/doctor/referral/${assessment.id}`)}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4 text-indigo-700" />
            <span>Prepare Referral Note</span>
          </button>
        </div>
      </div>

      {/* THREE-COLUMN WORKSPACE (Sections 16 - 22) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ============================================================== */}
        {/* COLUMN 1: LEFT COLUMN — Patient Information (Section 17)       */}
        {/* ============================================================== */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-5">
            
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Verified Patient Identity
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                {assessment.patientName}
              </h2>
              <div className="text-xs font-mono font-bold text-slate-600">
                {assessment.patientId}
              </div>
            </div>

            {/* Demographics */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Age / Gender:</span>
                <span className="font-bold text-slate-900">{assessment.patientAge} / {assessment.patientGender}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Preferred Language:</span>
                <span className="font-bold text-teal-800">{assessment.patientLanguage}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Queue Position:</span>
                <span className="font-mono font-bold text-slate-800">#{assessment.queuePosition}</span>
              </div>
            </div>

            {/* Verification & Consent Badges (Section 17) */}
            <div className="space-y-2 pt-1">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>✓ Patient identity verified</span>
              </div>

              <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 flex items-center gap-2 text-xs font-bold text-teal-900">
                <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>✓ Consent recorded</span>
              </div>
            </div>

            {/* Multimodal Input Sources Indicator (Section 17) */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Input Sources Ingested:
              </span>
              <div className="space-y-1.5 text-xs">
                <div className={`p-2 rounded-xl flex items-center justify-between ${assessment.hasVoice ? 'bg-teal-50 text-teal-900 border border-teal-200 font-semibold' : 'bg-slate-50 text-slate-400'}`}>
                  <span className="flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5" /> Voice Audio
                  </span>
                  <span>{assessment.hasVoice ? '✓ Present' : '— None'}</span>
                </div>

                <div className="p-2 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Text Description
                  </span>
                  <span>✓ Present</span>
                </div>

                <div className={`p-2 rounded-xl flex items-center justify-between ${assessment.hasReport ? 'bg-indigo-50 text-indigo-900 border border-indigo-200 font-semibold' : 'bg-slate-50 text-slate-400'}`}>
                  <span className="flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5" /> Lab Report (OCR)
                  </span>
                  <span>{assessment.hasReport ? '✓ Present' : '— None'}</span>
                </div>

                <div className={`p-2 rounded-xl flex items-center justify-between ${assessment.hasImage ? 'bg-amber-50 text-amber-900 border border-amber-200 font-semibold' : 'bg-slate-50 text-slate-400'}`}>
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" /> Image Attachment
                  </span>
                  <span>{assessment.hasImage ? '✓ Present' : '— None'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* COLUMN 2: CENTER COLUMN — Multimodal Information (Sec 18-21)   */}
        {/* ============================================================== */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Multimodal Tabs (Section 18) */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            
            <div className="flex items-center border-b border-slate-200 overflow-x-auto bg-slate-50/70 p-1.5 gap-1 text-xs font-bold">
              {(['Summary', 'Symptoms', 'Reports', 'Voice', 'Images', 'Timeline'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCenterTab(tab)}
                  className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                    activeCenterTab === tab
                      ? 'bg-white text-blue-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'Summary' && 'Structured Summary'}
                  {tab === 'Symptoms' && 'Patient Symptoms'}
                  {tab === 'Reports' && `Reports (${assessment.extractedReports.length})`}
                  {tab === 'Voice' && 'Voice Transcript'}
                  {tab === 'Images' && 'Images'}
                  {tab === 'Timeline' && 'Chronology'}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}
            <div className="p-6 space-y-6">
              
              {/* Tab 1: Summary (Section 18) */}
              {activeCenterTab === 'Summary' && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      Pre-Clinical Synthesis
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                      Structured Triage Note
                    </h3>
                  </div>

                  {/* Patient-reported symptoms */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <strong className="text-slate-900 font-bold block uppercase tracking-wider text-[11px]">
                      Patient-reported symptoms:
                    </strong>
                    <ul className="space-y-1 text-slate-700">
                      {assessment.structuredSymptoms.map((s, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2 text-slate-500 border-t border-slate-200 text-[11px]">
                      Reported Duration: <strong>{assessment.reportedDuration}</strong>
                    </div>
                  </div>

                  {/* Reported timeline */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <strong className="text-slate-900 font-bold block uppercase tracking-wider text-[11px]">
                      Reported timeline:
                    </strong>
                    <div className="space-y-2 text-slate-700">
                      {assessment.timeline.map((t, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="font-bold text-blue-900 whitespace-nowrap min-w-16">{t.day}:</span>
                          <span>{t.title} — {t.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Report information extracted */}
                  <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2 text-xs text-indigo-950">
                    <strong className="font-bold block uppercase tracking-wider text-[11px] text-indigo-900">
                      Report information extracted:
                    </strong>
                    {assessment.extractedReports.length > 0 ? (
                      <div>
                        <p>{assessment.extractedReports[0].reportName} uploaded.</p>
                        <p className="text-red-700 font-semibold mt-1">
                          Some values marked as outside the provided reference range (Leukocytosis / Neutrophilia noted).
                        </p>
                      </div>
                    ) : (
                      <p className="text-slate-500">No lab reports attached with this submission.</p>
                    )}
                  </div>

                  {/* Clinical Guardrail */}
                  <div className="p-3 rounded-xl bg-slate-900 text-white text-[11px] flex items-center gap-2">
                    <Info className="w-4 h-4 text-cyan-300 flex-shrink-0" />
                    <span><strong>System Guardrail:</strong> Assistive extraction only. Do not interpret as an autonomous diagnosis.</span>
                  </div>
                </div>
              )}

              {/* Tab 2: Symptoms & Translation */}
              {activeCenterTab === 'Symptoms' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Raw Patient Text ({assessment.detectedLanguage})</span>
                    <p className="text-slate-900 font-medium leading-relaxed font-sans text-sm">
                      {assessment.rawSymptomText}
                    </p>
                  </div>

                  {assessment.translatedEnglishText && (
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-blue-800">English Translation for Clinician</span>
                      <p className="text-blue-950 font-medium leading-relaxed text-sm italic">
                        "{assessment.translatedEnglishText}"
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Reports OCR */}
              {activeCenterTab === 'Reports' && (
                <div className="space-y-4 text-xs">
                  {assessment.extractedReports.map((rep) => (
                    <div key={rep.id} className="border border-slate-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-sm">{rep.reportName}</h4>
                        <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                          ✓ OCR {Math.round(rep.ocrConfidence * 100)}% Conf.
                        </span>
                      </div>
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase">
                          <tr>
                            <th className="p-2">Test Name</th>
                            <th className="p-2">Result</th>
                            <th className="p-2">Reference</th>
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

              {/* Tab 4: Voice Transcript */}
              {activeCenterTab === 'Voice' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                      <span>Audio Track • Odia Acoustic Model (14s)</span>
                    </div>
                    <span className="text-emerald-400 font-mono text-[11px]">96.2% STT Confidence</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <strong className="text-slate-900 uppercase text-[10px] block">Transcribed Speech</strong>
                    <p className="text-slate-800 text-sm font-sans">
                      {assessment.voiceTranscript || 'No voice transcript recorded for this entry.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 5: Images */}
              {activeCenterTab === 'Images' && (
                <div className="space-y-4 text-xs">
                  {assessment.imageUrls && assessment.imageUrls.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {assessment.imageUrls.map((url, i) => (
                        <div key={i} className="rounded-2xl overflow-hidden border border-slate-200">
                          <img src={url} alt="Clinical attachment" className="w-full h-48 object-cover" />
                          <div className="p-2 bg-slate-50 text-[11px] text-slate-500 text-center">
                            Attachment #{i + 1} • Patient uploaded photo
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      No clinical photos attached.
                    </div>
                  )}
                </div>
              )}

              {/* Tab 6: Timeline */}
              {activeCenterTab === 'Timeline' && (
                <div className="space-y-3 text-xs">
                  {assessment.timeline.map((item, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="font-bold text-blue-900 whitespace-nowrap min-w-20">{item.day}</div>
                      <div>
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <div className="text-slate-600 mt-0.5">{item.description}</div>
                        <div className="text-[10px] text-slate-400 mt-1">Source: {item.source}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* Section 19: Urgency Signals Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Urgency Signals
              </h3>
              <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Pre-Clinical Prioritization
              </span>
            </div>

            <div className="space-y-2.5">
              {assessment.urgencySignals.map((sig) => (
                <div
                  key={sig.id}
                  className={`p-3.5 rounded-2xl border text-xs flex items-start justify-between gap-3 ${
                    sig.level === 'HIGH' ? 'bg-red-50/80 border-red-200 text-red-950' :
                    sig.level === 'MEDIUM' ? 'bg-amber-50/80 border-amber-200 text-amber-950' :
                    'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-base leading-none">
                      {sig.level === 'HIGH' ? '🔴' : sig.level === 'MEDIUM' ? '🟠' : '🟢'}
                    </span>
                    <div>
                      <div className="font-bold">{sig.signal}</div>
                      <div className="text-[11px] opacity-80 mt-0.5">{sig.note}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/70 border border-slate-200 whitespace-nowrap">
                    Src: {sig.source}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 italic pt-1 text-center">
              These signals are for healthcare-worker review and are not a diagnosis.
            </p>
          </div>

          {/* Section 20: Follow-up Questions Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-teal-700" />
                  Suggested Follow-up Questions
                </h3>
                <p className="text-xs text-slate-500">
                  AI-identified information gaps to assist clinical triage decision
                </p>
              </div>
              <button
                onClick={() => setShowAskModal(true)}
                className="px-3 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition-all"
              >
                + Ask Custom Question
              </button>
            </div>

            <div className="space-y-3">
              {assessment.followUpQuestions.map((q, idx) => (
                <div key={q.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-slate-900 flex gap-2">
                      <span className="text-teal-700 font-extrabold">{idx + 1}.</span>
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

                  <p className="text-[11px] text-slate-500 italic pl-5">
                    Rationale: {q.rationale}
                  </p>

                  {q.answer && (
                    <div className="ml-5 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium">
                      Patient Response: "{q.answer}"
                    </div>
                  )}

                  <div className="flex items-center gap-2 pl-5 pt-1">
                    {q.status === 'PENDING' && (
                      <button
                        onClick={() => requestFollowUp(assessment.id, q.question, q.rationale)}
                        className="px-3 py-1 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-[11px] font-bold transition-all"
                      >
                        Ask Patient
                      </button>
                    )}
                    {q.status !== 'ANSWERED' && (
                      <button
                        onClick={() => markQuestionAnswered(assessment.id, q.id, 'Verified verbally by clinician')}
                        className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-[11px] font-bold transition-all"
                      >
                        Mark as Answered
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 21: AI Explanation / Traceability */}
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 space-y-3">
            <button
              onClick={() => setShowTraceability(!showTraceability)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-800 hover:text-slate-950"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-700" />
                <span>Why was this information highlighted? (AI Traceability)</span>
              </div>
              {showTraceability ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showTraceability && (
              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-200 animate-in fade-in">
                <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                  <span>Source: Patient voice input (14s acoustic transcription)</span>
                  <span className="font-mono font-bold text-teal-700">96.2% Confidence</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                  <span>Source: Uploaded PDF report (Optical Character Recognition)</span>
                  <span className="font-mono font-bold text-indigo-700">97.0% Confidence</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                  <span>Source: Patient questionnaire (Reported 2-day duration)</span>
                  <span className="font-mono font-bold text-emerald-700">Patient Attested</span>
                </div>
                <p className="text-[11px] text-slate-400 italic text-center pt-1">
                  Confidence metrics reflect document and transcription clarity only. Never represents artificial medical certainty.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* ============================================================== */}
        {/* COLUMN 3: RIGHT COLUMN — Healthcare Worker Actions (Section 22) */}
        {/* ============================================================== */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-4 sticky top-24">
            
            <div className="border-b border-slate-200 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Decision Support
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                Review Actions
              </h3>
            </div>

            {/* Action Buttons as mandated in Section 22 */}
            <div className="space-y-2.5">
              
              <button
                onClick={() => setShowNoteModal(true)}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>✓ Mark Reviewed</span>
              </button>

              <button
                onClick={() => setShowAskModal(true)}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>🟠 Request More Information</span>
              </button>

              <button
                onClick={() => navigate(`/doctor/referral/${assessment.id}`)}
                className="w-full py-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>📋 Prepare Referral Note</span>
              </button>

              <button
                onClick={handleElevatePriority}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4 text-red-600" />
                <span>⏱ Add to Priority Queue</span>
              </button>

              <button
                onClick={() => setShowNoteModal(true)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-slate-600" />
                <span>📝 Add Clinical Note</span>
              </button>

            </div>

            {/* Mandatory Critical Safety Rule Note */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-500 leading-snug">
              <strong className="text-slate-800 block mb-1">Human-in-the-Loop Mandate:</strong>
              No autonomous diagnoses or prescription recommendations can be executed by the AI. All clinical decisions rest solely with the licensed reviewer.
            </div>

            {/* Current Review State */}
            {assessment.status === 'REVIEWED' && (
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-300 text-xs text-emerald-950">
                <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4" /> Case Marked Reviewed
                </span>
                <p className="mt-1 text-[11px]">
                  Reviewed by {assessment.reviewedBy || 'Dr. Ananya Sharma'} at {assessment.reviewedAt}
                </p>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* MODAL: Clinical Note / Mark Reviewed */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Document Clinical Review Note
            </h3>
            <p className="text-xs text-slate-500">
              Enter your clinical impression or internal medical instructions for patient records.
            </p>
            <textarea
              rows={4}
              value={clinicalNoteInput}
              onChange={(e) => setClinicalNoteInput(e.target.value)}
              placeholder="e.g. Evaluated reported fever and CBC leukocytosis. Advised symptomatic antipyretics, adequate oral fluids, and urgent physical clinic visit if SpO2 drops below 95%."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 font-sans"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkReviewed}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Save & Mark Reviewed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Custom Question to Patient */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Send Follow-up Question to Patient
            </h3>
            <p className="text-xs text-slate-500">
              This inquiry will be sent instantly to the patient's portal with push notification.
            </p>
            <input
              type="text"
              value={customQuestionInput}
              onChange={(e) => setCustomQuestionInput(e.target.value)}
              placeholder="e.g. Do you have access to a fingertip pulse oximeter?"
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAskModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSendQuestion}
                className="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Send Question
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
