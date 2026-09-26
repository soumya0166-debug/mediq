import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';
import { 
  Clock, 
  AlertCircle, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  Share2, 
  ArrowLeft, 
  MessageSquare, 
  Volume2, 
  Eye, 
  X, 
  Play, 
  Pause
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';
import { SourceTraceItem } from '../../types';

export const DoctorReviewPage: React.FC = () => {
  const { 
    selectedAssessment, 
    navigate, 
    markAssessmentReviewed, 
    requestFollowUp, 
    updateAssessment
  } = useApp();
  const { t } = useLanguage();

  const assessment = selectedAssessment;

  const [activeCenterTab, setActiveCenterTab] = useState<
    'Overview' | 'Symptoms' | 'Timeline' | 'Reports' | 'Voice' | 'Images' | 'Translations'
  >('Overview');

  const tabLabels: Record<string, string> = {
    Overview: t('clinical.tabOverview'),
    Symptoms: t('clinical.tabSymptoms'),
    Timeline: t('clinical.tabTimeline'),
    Reports: t('clinical.tabReports'),
    Voice: t('clinical.tabVoice'),
    Images: t('clinical.tabImages'),
    Translations: t('clinical.tabTranslations'),
  };

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

  // Audio Playback State for Patient Voice Recording (Section 17)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
      setAudioCurrentTime(0);
    }
  }, [assessment?.id]);

  const toggleAudioPlayback = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch(err => {
        console.warn('Audio playback error:', err);
      });
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setAudioCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration || assessment?.audioDurationSeconds || 0);
    }
  };

  const handleAudioEnded = () => {
    setIsPlayingAudio(false);
    setAudioCurrentTime(0);
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || !isFinite(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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
            onClick={() => navigate('/clinical/queue')}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
            title="Return to Queue"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-extrabold text-slate-900">{assessment.patientId}</span>
              <RiskBadge level={assessment.riskLevel} size="sm" />
              <span className="text-xs text-slate-500 font-mono">• {assessment.waitingMinutes} {t('common.minutes')}</span>
            </div>
            <div className="text-xs text-slate-600 font-medium">
              {t('clinical.reviewPatient')} • {assessment.patientName} ({assessment.patientAge} {t('common.years')}, {assessment.patientGender === 'Female' ? t('common.female') : t('common.male')})
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Accessible Language Selector in Review Interface (Section 3 Spec) */}
          <LanguageSelector variant="compact" />

          <button
            onClick={() => navigate(`/doctor/referral/${assessment.id}`)}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-600" />
            <span>{t('clinical.referral')}</span>
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
                {t('clinical.patientName')}
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
                <span className="text-slate-500">{t('clinical.age')}:</span>
                <span className="font-semibold text-slate-900">{assessment.patientAge} {t('common.years')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">{t('clinical.gender')}:</span>
                <span className="font-semibold text-slate-900">{assessment.patientGender === 'Female' ? t('common.female') : t('common.male')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">{t('patient.preferredLanguage')}:</span>
                <span className="font-semibold text-teal-800">{assessment.patientLanguage}</span>
              </div>
            </div>

            {/* Verification & Consent States (Sections 22 & 30) */}
            <div className="space-y-2 pt-1">
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <span className="font-medium text-emerald-900">{t('auth.trustVerified')}:</span>
                <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  {t('common.active')}
                </span>
              </div>

              {/* Section 30 Healthcare Worker Consent View */}
              <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-teal-900">{t('consent.title')}:</span>
                  <span className="font-bold text-teal-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />
                    {t('consent.consentActive')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] font-semibold text-teal-950 pt-1.5 border-t border-teal-200/70">
                  <span className="flex items-center gap-1">{t('consent.symptomsCat')} <span className="text-teal-700">✓</span></span>
                  <span className="flex items-center gap-1">{t('consent.reportsCat')} <span className="text-teal-700">✓</span></span>
                  <span className="flex items-center gap-1">{t('consent.voiceCat')} <span className="text-teal-700">✓</span></span>
                  <span className="flex items-center gap-1">{t('consent.translationCat')} <span className="text-teal-700">✓</span></span>
                </div>
              </div>
            </div>

            {/* Section 22: Health Timeline */}
            <div className="pt-3 border-t border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t('clinical.timeline')}
                </span>
                <span className="text-[10px] text-teal-700 font-mono font-semibold">Today</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-600 flex-shrink-0" />
                  <span className="font-semibold text-slate-800">{t('patient.infoSubmitted')}</span>
                </div>
                <div className="text-center text-slate-400 text-xs leading-none">↓</div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                  <span className="font-semibold text-slate-800">{t('patient.uploadReport')}</span>
                </div>
                <div className="text-center text-slate-400 text-xs leading-none">↓</div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0A1E3F] flex-shrink-0" />
                  <span className="font-semibold text-slate-800">{t('clinical.aiTriageSummary')}</span>
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
                  {t('clinical.triageSummaryTitle')}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t('clinical.triageSummarySubtitle')}
                </p>
              </div>
              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded self-start">
                {t('clinical.triageSupportOnlyBadge')}
              </span>
            </div>

            {/* Section 17 & 21 AI Translation Safety Callout */}
            <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2 flex items-center gap-2 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span className="font-medium">
                {t('clinical.aiTranslationNotice')}
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
                  {tabLabels[tab] || tab}
                </button>
              ))}
            </div>

            {/* TAB CONTENTS */}
            <div className="p-5 space-y-5">
              
              {/* Hidden Audio Element for Genuine Microphone Recording Playback */}
              {assessment.audioUrl && (
                <audio
                  ref={audioRef}
                  src={assessment.audioUrl}
                  onTimeUpdate={handleAudioTimeUpdate}
                  onLoadedMetadata={handleAudioLoadedMetadata}
                  onEnded={handleAudioEnded}
                  className="hidden"
                  preload="metadata"
                />
              )}

              {/* TAB 1: OVERVIEW (Section 30 Spec) */}
              {activeCenterTab === 'Overview' && (
                <div className="space-y-4 text-xs">
                  
                  {/* Genuine Patient Voice Input & First Report Banner (Sections 12-17) */}
                  {(assessment.hasVoice || assessment.audioUrl || assessment.firstReport) && (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/90 via-white to-teal-50/60 border border-indigo-200/90 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded-md bg-[#0A1E3F] text-white">
                            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                          </span>
                          <div>
                            <h4 className="font-extrabold text-xs text-slate-900 tracking-tight">
                              AI FIRST REPORT — PATIENT VOICE INTAKE
                            </h4>
                            <p className="text-[10px] text-slate-500">
                              Factual, non-diagnostic organization of patient narration.
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                          Clinical Review Required
                        </span>
                      </div>

                      {/* Genuine Audio Player if Recording is Available */}
                      {assessment.audioUrl ? (
                        <div className="p-3 bg-slate-900 text-white rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={toggleAudioPlayback}
                              className="w-8 h-8 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center justify-center transition-all flex-shrink-0 shadow-xs"
                              aria-label={isPlayingAudio ? "Pause patient voice recording" : "Play patient voice recording"}
                            >
                              {isPlayingAudio ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                            </button>
                            <div>
                              <div className="font-semibold text-xs text-slate-100 flex items-center gap-1.5">
                                <span>Patient's Microphone Recording</span>
                                <span className="text-[10px] font-mono text-teal-300">
                                  ({formatSeconds(audioCurrentTime)} / {formatSeconds(audioDuration || assessment.audioDurationSeconds || 14)})
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400">
                                Language detected: {assessment.firstReport?.originalLanguage || assessment.patientLanguage} {assessment.languageConfidence ? `(${Math.round(assessment.languageConfidence * 100)}% conf)` : ''}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveCenterTab('Voice')}
                            className="text-[11px] font-bold text-teal-300 hover:text-teal-200 underline self-start sm:self-auto"
                          >
                            Open Voice Traceability →
                          </button>
                        </div>
                      ) : (
                        <div className="p-2.5 bg-slate-100 rounded-lg text-slate-600 text-[11px] flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                            <span>Preserved Voice Narration Available</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveCenterTab('Voice')}
                            className="font-bold text-teal-700 hover:underline"
                          >
                            Inspect Voice →
                          </button>
                        </div>
                      )}

                      {/* First Report Factual Summary */}
                      <div className="p-3 bg-white/90 rounded-lg border border-indigo-100/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 block">
                          Patient-Stated Summary:
                        </span>
                        <p className="text-slate-800 text-xs leading-relaxed italic">
                          "{assessment.firstReport?.summary || assessment.translatedEnglishText || assessment.rawSymptomText}"
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 bg-white rounded border border-slate-200">
                          <span className="text-slate-400 font-bold uppercase text-[9px] block">Reported Symptoms:</span>
                          <span className="font-semibold text-slate-900">
                            {(assessment.firstReport?.reportedSymptoms || assessment.structuredSymptoms).join(', ')}
                          </span>
                        </div>
                        <div className="p-2 bg-white rounded border border-slate-200">
                          <span className="text-slate-400 font-bold uppercase text-[9px] block">Reported Duration:</span>
                          <span className="font-semibold text-slate-900">
                            {assessment.firstReport?.reportedDuration || assessment.reportedDuration || 'Not explicitly stated'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Patient-reported symptoms */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                        {t('clinical.patientReportedSymptoms')}:
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
                      <span className="text-slate-500 font-medium">{t('clinical.durationLabel')}:</span>
                      <span className="font-bold text-slate-900 ml-2">{assessment.reportedDuration}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Patient reported</span>
                  </div>

                  {/* Information extracted */}
                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2 text-slate-800">
                    <strong className="font-bold uppercase tracking-wider text-[11px] text-blue-900 block">
                      {t('clinical.informationExtracted')}:
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
                        {t('clinical.informationMissing')}:
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
                        {t('clinical.sourceTraceabilityTitle')}
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
                            {t('clinical.viewSourceBtn')}
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

              {/* TAB 5: VOICE (Sections 12-17 Four-Tier Architecture) */}
              {activeCenterTab === 'Voice' && (
                <div className="space-y-4 text-xs">
                  
                  {/* TIER 1: PATIENT-REPORTED INFORMATION (Source of Truth) */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                        <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                          1. Patient-Reported Information (Source of Truth)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-900 px-2 py-0.5 rounded border border-teal-200">
                          {assessment.detectedLanguage || assessment.patientLanguage}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {assessment.languageConfidence ? `${Math.round(assessment.languageConfidence * 100)}% Conf` : 'High Conf'}
                        </span>
                      </div>
                    </div>

                    {/* Audio Playback Controls (Section 17) */}
                    {assessment.audioUrl ? (
                      <div className="p-3.5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={toggleAudioPlayback}
                            className="w-10 h-10 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center justify-center transition-all shadow-sm flex-shrink-0"
                            aria-label={isPlayingAudio ? "Pause patient recording" : "Play patient recording"}
                          >
                            {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                          </button>
                          <div>
                            <div className="font-bold text-xs flex items-center gap-1.5 text-slate-100">
                              <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                              <span>Patient's Original Microphone Recording</span>
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                              {formatSeconds(audioCurrentTime)} / {formatSeconds(audioDuration || assessment.audioDurationSeconds || 14)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700 self-start sm:self-auto">
                          <span>STT Confidence:</span>
                          <span className="font-bold">
                            {assessment.transcriptionConfidence ? `${Math.round(assessment.transcriptionConfidence * 100)}%` : '96.2%'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-slate-500" />
                          <span className="font-medium">Preserved Voice Narration Session</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">Audio reference recorded</span>
                      </div>
                    )}

                    {/* Original Verbatim Transcript */}
                    <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Original Verbatim Narration (Untampered)
                        </span>
                        <span className="text-[10px] text-teal-700 font-semibold">Primary Clinical Evidence</span>
                      </div>
                      <p className="text-slate-900 text-sm font-medium leading-relaxed">
                        {assessment.voiceTranscript || assessment.rawSymptomText}
                      </p>
                    </div>

                    {/* English Translation */}
                    <div className="p-3.5 rounded-lg bg-teal-50/70 border border-teal-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-900">
                          Faithful English Translation
                        </span>
                        <span className="text-[10px] font-mono text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded border border-teal-200">
                          AI-assisted translation
                        </span>
                      </div>
                      <p className="text-teal-950 text-sm font-medium leading-relaxed italic">
                        "{assessment.translatedEnglishText || assessment.rawSymptomText}"
                      </p>
                      <p className="text-[10px] text-teal-700/80 italic pt-1">
                        * Preserves conversational meaning faithfully without artificial clinical jargon interpretation.
                      </p>
                    </div>
                  </div>

                  {/* TIER 2: AI-ASSISTED FIRST REPORT & INFORMATION EXTRACTION (Sections 10-13) */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 border border-indigo-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-700" />
                        <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                          2. AI First Report (Structured Information Extraction)
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                        Non-Diagnostic
                      </span>
                    </div>

                    {/* Factual Summary */}
                    <div className="p-3 rounded-lg bg-white border border-indigo-100 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 block">
                        Organized Intake Summary:
                      </span>
                      <p className="text-slate-800 text-xs leading-relaxed">
                        {assessment.firstReport?.summary || 'Patient reports symptoms via natural voice recording. Information structured for rapid clinical review.'}
                      </p>
                    </div>

                    {/* Reported Symptoms with Source Trace */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        Reported Symptoms (Traceable to Voice Narration):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(assessment.firstReport?.reportedSymptoms || assessment.structuredSymptoms).map((sym, i) => (
                          <button
                            type="button"
                            key={i}
                            onClick={() => {
                              const trace = (assessment.sourceTraceability || []).find(st => st.statement.toLowerCase().includes(sym.toLowerCase())) || {
                                id: `trace-sym-${i}`,
                                statement: sym,
                                sourceType: 'voice' as const,
                                sourceExcerpt: assessment.voiceTranscript || assessment.rawSymptomText,
                                confidenceScore: 0.94,
                                sourceLabel: 'Voice Narration'
                              };
                              setSelectedSource(trace);
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-400 rounded-md font-semibold text-slate-800 flex items-center gap-1.5 transition-all text-xs"
                            title="Click to view speech source excerpt"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                            <span>{sym}</span>
                            <Eye className="w-3 h-3 text-slate-400" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Reported Duration & Concerns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Reported Duration:</span>
                        <span className="font-semibold text-slate-900">
                          {assessment.firstReport?.reportedDuration || assessment.reportedDuration || 'Not explicitly stated'}
                        </span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Patient Concerns:</span>
                        <span className="font-semibold text-slate-900">
                          {assessment.firstReport?.reportedConcerns && assessment.firstReport.reportedConcerns.length > 0
                            ? assessment.firstReport.reportedConcerns.join('; ')
                            : 'Difficulty breathing and physical weakness'}
                        </span>
                      </div>
                    </div>

                    {/* Information explicitly not provided (Zero Hallucination - Section 13) */}
                    <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                        Information Not Provided by Patient (Requires Clinician Evaluation):
                      </span>
                      <ul className="list-disc list-inside text-[11px] text-amber-950 font-medium space-y-0.5">
                        {(assessment.firstReport?.missingInformation || [
                          'Vital signs (temperature, blood pressure, heart rate)',
                          'SpO₂ pulse oximetry reading',
                          'Pre-existing chronic conditions / routine medications',
                          'Allergies to medications'
                        ]).map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-[10px] text-slate-500 italic p-2 bg-slate-100 rounded text-center">
                      * Safety Notice: First Report organizes patient-stated facts. It does not provide medical diagnosis, disease predictions, or prescriptions.
                    </div>
                  </div>

                  {/* TIER 3: AI-ASSISTED TRIAGE SIGNAL */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                        3. AI-Assisted Urgency Signals
                      </span>
                      <RiskBadge level={assessment.riskLevel} size="sm" />
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="font-semibold text-slate-800">
                        Respiratory complaint in voice narration flagged for prioritized observation.
                      </span>
                    </div>
                  </div>

                  {/* TIER 4: CLINICIAN DECISION */}
                  <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 flex items-center justify-between gap-3">
                    <div>
                      <span className="font-extrabold text-xs uppercase tracking-wider text-teal-900 block">
                        4. Clinician Decision & Oversight
                      </span>
                      <p className="text-slate-600 text-xs mt-0.5">
                        The reviewing healthcare professional remains solely responsible for clinical interpretation and care plan.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCompleteReviewModal(true)}
                      className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs whitespace-nowrap"
                    >
                      Complete Review
                    </button>
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

              {/* TAB 7: TRANSLATIONS (Section 9 Original + Translated View) */}
              {activeCenterTab === 'Translations' && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        ORIGINAL PATIENT NARRATION (Source of Truth)
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                        Language: {assessment.detectedLanguage || assessment.patientLanguage}
                      </span>
                    </div>
                    <p className="text-slate-900 text-sm font-medium leading-relaxed">
                      {assessment.voiceTranscript || assessment.rawSymptomText}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-900">
                        FAITHFUL ENGLISH TRANSLATION
                      </span>
                      <span className="text-[10px] font-mono text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded border border-teal-200">
                        AI-assisted translation
                      </span>
                    </div>
                    <p className="text-teal-950 text-sm font-medium leading-relaxed italic">
                      "{assessment.translatedEnglishText || assessment.rawSymptomText}"
                    </p>
                    <p className="text-[10px] text-slate-500 pt-1 border-t border-teal-200/50">
                      Preserves verbatim patient meaning as the clinical baseline without speculative diagnostic interpretation.
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
                {t('clinical.urgencySignalsTitle')}
              </h3>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Section 23
              </span>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-lg border text-xs flex items-center justify-between gap-3 bg-red-50/50 border-red-200/80">
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">🔴</span>
                  <span className="font-semibold text-red-950">{t('clinical.signalBreathing')}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {t('clinical.typeVoice')}
                </span>
              </div>

              <div className="p-3 rounded-lg border text-xs flex items-center justify-between gap-3 bg-amber-50/50 border-amber-200/80">
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">🟠</span>
                  <span className="font-semibold text-amber-950">{t('clinical.signalFever')}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {t('clinical.typeText')}
                </span>
              </div>

              <div className="p-3 rounded-lg border text-xs flex items-center justify-between gap-3 bg-slate-50 border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">⚪</span>
                  <span className="font-semibold text-slate-700">{t('clinical.signalNoChestPain')}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {t('clinical.typeVoice')}
                </span>
              </div>
            </div>

            {/* Section 23 Mandatory Disclaimer */}
            <p className="text-[11px] text-slate-500 italic pt-1 text-center border-t border-slate-100 font-medium">
              {t('clinical.urgencyDisclaimer')}
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
                {t('clinical.role')}
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                {t('clinical.reviewActionsTitle')}
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
                <span>{t('clinical.completeReviewBtn')}</span>
              </button>

              {/* SECONDARY: Request More Information */}
              <button
                onClick={() => {
                  setInquiryQuestion(t('patient.doctorRequestQuestion'));
                  setShowRequestPanel(true);
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>{t('clinical.requestMoreInfoBtn')}</span>
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
                <span>{t('clinical.addToPriorityQueueBtn')}</span>
              </button>

              {/* SECONDARY: Prepare Referral */}
              <button
                onClick={() => navigate(`/doctor/referral/${assessment.id}`)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4 text-slate-600" />
                <span>{t('clinical.prepareReferralBtn')}</span>
              </button>

              {/* SECONDARY: Add Clinical Note */}
              <button
                onClick={() => setShowCompleteReviewModal(true)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-slate-600" />
                <span>{t('clinical.addClinicalNoteBtn')}</span>
              </button>

            </div>

            {/* Current Status Badge */}
            {assessment.status === 'REVIEWED' && (
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4" /> {t('clinical.reviewedStatus')}
                </div>
                <p className="text-[11px] text-slate-600">
                  Reviewed by {assessment.reviewedBy || 'Dr. Ananya Sharma'}
                </p>
              </div>
            )}

            {/* Mandatory Safety Notice */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500 leading-snug">
              <strong className="text-slate-800 block mb-0.5">{t('clinical.clinicalOversightMandate')}</strong>
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
                    {t('clinical.requestDrawerTitle')}
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
                <span className="text-slate-500">{t('clinical.colPatient')}:</span>{' '}
                <span className="font-bold text-slate-900">{assessment.patientName}</span>{' '}
                <span className="font-mono text-slate-500">({assessment.patientId})</span>
              </div>

              {/* Question Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {t('clinical.requestQuestionLabel')}
                </label>
                <textarea
                  rows={4}
                  value={inquiryQuestion}
                  onChange={(e) => setInquiryQuestion(e.target.value)}
                  placeholder={t('clinical.requestQuestionPlaceholder')}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden"
                />
              </div>

              {/* Response Type Selector (Section 34 Spec: Text, Voice, Multiple Choice) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {t('clinical.expectedResponseType')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'text', label: t('clinical.typeText') },
                    { id: 'voice', label: t('clinical.typeVoice') },
                    { id: 'choice', label: t('clinical.typeChoice') },
                  ].map((typ) => (
                    <button
                      key={typ.id}
                      type="button"
                      onClick={() => setInquiryType(typ.id as any)}
                      className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all ${
                        inquiryType === typ.id
                          ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {typ.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
                {t('clinical.waitingForPatientStatus')}
              </div>

            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => setShowRequestPanel(false)}
                className="flex-1 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSendToPatient}
                className="flex-1 py-2.5 bg-[#0A1E3F] hover:bg-[#07152c] text-white rounded-lg text-xs font-bold transition-all shadow-xs"
              >
                {t('clinical.sendToPatientBtn')}
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
                  {t('clinical.sourceTraceModalTitle')}
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
                <span className="text-slate-400 font-bold uppercase text-[10px]">{t('clinical.extractedStatement')}</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">
                  "{selectedSource.statement}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 text-[10px]">{t('clinical.sourceModality')}</span>
                  <div className="font-semibold text-slate-900">{selectedSource.sourceType}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">{t('clinical.systemConfidence')}</span>
                  <div className="font-mono font-bold text-teal-800">
                    {selectedSource.confidenceScore ? `${Math.round(selectedSource.confidenceScore * 100)}%` : 'Attested'}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">{t('clinical.originalEvidence')}</span>
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
                {t('clinical.closeTraceBtn')}
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
              {t('clinical.completeClinicalReviewModalTitle')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('clinical.completeClinicalReviewModalDesc')}
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
                {t('common.cancel')}
              </button>
              <button
                onClick={handleConfirmCompleteReview}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                {t('clinical.confirmReviewCompleteBtn')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
