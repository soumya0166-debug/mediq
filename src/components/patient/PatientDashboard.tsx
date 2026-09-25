import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Sparkles, 
  Mic, 
  FileText, 
  ArrowRight, 
  Clock, 
  HelpCircle, 
  Activity, 
  Lock, 
  Calendar,
  CheckCircle2,
  ChevronRight,
  Send,
  FileCheck,
  History,
  MessageSquare
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

export const PatientDashboard: React.FC = () => {
  const { 
    currentPatient, 
    assessments, 
    navigate, 
    setSelectedAssessmentId,
    markQuestionAnswered 
  } = useApp();
  const { t } = useLanguage();

  const patientAssessments = assessments.filter(a => a.patientId === currentPatient?.id) || [];
  const latestAssessment = patientAssessments[0] || assessments[0];

  // Section 27: Check if healthcare worker requested information
  const pendingDoctorQuestion = latestAssessment?.followUpQuestions?.find(q => q.status === 'ASKED');
  
  // Section 27: Interactive response states
  const [activeResponseMode, setActiveResponseMode] = useState<'NONE' | 'TEXT' | 'VOICE'>('NONE');
  const [responseText, setResponseText] = useState('');
  const [responseSubmitted, setResponseSubmitted] = useState(false);

  const handleSendTextResponse = () => {
    if (!latestAssessment || !pendingDoctorQuestion || !responseText.trim()) return;
    markQuestionAnswered(latestAssessment.id, pendingDoctorQuestion.id, responseText);
    setResponseSubmitted(true);
    setActiveResponseMode('NONE');
  };

  const handleSimulateVoiceResponse = () => {
    if (!latestAssessment || !pendingDoctorQuestion) return;
    const voiceAnswer = 'Simulated Odia voice response: "No, breathing difficulty has slightly subsided after resting."';
    markQuestionAnswered(latestAssessment.id, pendingDoctorQuestion.id, voiceAnswer);
    setResponseSubmitted(true);
    setActiveResponseMode('NONE');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      
      {/* ========================================================================= */}
      {/* Section 9: Calm & Mobile-Friendly Header                                   */}
      {/* ========================================================================= */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] tracking-tight">
              {t('patient.dashboard.greeting', { name: currentPatient?.name?.split(' ')[0] || 'Riya' })}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              {t('patient.dashboard.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left sm:text-right">
              <div className="font-mono text-xs font-bold text-slate-800">
                {currentPatient?.id || 'PAT-2026-00124'}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span>{t('patient.dashboard.identityVerified')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Section 27: Healthcare Worker Request & Response Card                      */}
      {/* ========================================================================= */}
      {pendingDoctorQuestion && !responseSubmitted && (
        <div className="p-5 sm:p-6 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-950 space-y-4 shadow-2xs animate-in fade-in">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 flex-shrink-0 mt-0.5">
              <HelpCircle className="w-5 h-5 text-amber-700" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                {t('patient.doctorRequestTitle')}
              </span>
              <h3 className="font-bold text-base text-slate-900 mt-1">
                {t('patient.doctorRequestDesc')}
              </h3>
              <p className="text-xs text-slate-700 font-medium">
                {t('clinical.requestQuestionLabel')}:
              </p>
              <div className="p-3 bg-white rounded-lg border border-amber-200 text-slate-900 font-semibold text-xs mt-1">
                "{pendingDoctorQuestion.question}"
              </div>
            </div>
          </div>

          {/* Section 27 Buttons: Answer by Text / Answer by Voice */}
          {activeResponseMode === 'NONE' && (
            <div className="flex flex-wrap items-center gap-2 pt-1 pl-0 sm:pl-13">
              <button
                onClick={() => setActiveResponseMode('TEXT')}
                className="px-4 py-2 bg-[#0A1E3F] hover:bg-[#07152c] text-white rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{t('patient.answerByTextBtn')}</span>
              </button>

              <button
                onClick={() => setActiveResponseMode('VOICE')}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{t('patient.answerByVoiceBtn')}</span>
              </button>
            </div>
          )}

          {/* Text Input Mode */}
          {activeResponseMode === 'TEXT' && (
            <div className="pt-2 pl-0 sm:pl-13 space-y-2 text-xs">
              <textarea
                rows={2}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder={t('patient.typeYourAnswerPlaceholder')}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 outline-hidden focus:ring-1 focus:ring-slate-400"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSendTextResponse}
                  className="px-4 py-1.5 bg-[#0A1E3F] text-white rounded-md font-bold text-xs"
                >
                  {t('common.submit')}
                </button>
                <button
                  onClick={() => setActiveResponseMode('NONE')}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-md text-xs font-medium"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          )}

          {/* Voice Input Mode */}
          {activeResponseMode === 'VOICE' && (
            <div className="pt-2 pl-0 sm:pl-13 p-4 bg-white rounded-lg border border-amber-200 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <Mic className="w-4 h-4 text-teal-700 animate-pulse" />
                <span>{t('assessment.recordVoice')}:</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSimulateVoiceResponse}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold text-xs shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('common.submit')}</span>
                </button>
                <button
                  onClick={() => setActiveResponseMode('NONE')}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Response Submitted State (Section 27 Spec) */}
      {responseSubmitted && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <div className="font-bold text-sm text-emerald-900">
              {t('common.success')}: {t('patient.responseSubmittedBadge')}
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {t('patient.doctorRequestDesc')}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Section 10: PATIENT PRIMARY ACTION (Largest Element on Dashboard)          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="max-w-3xl space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded">
            {t('patient.dashboard.preClinicalIngestion')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] tracking-tight">
            {t('patient.dashboard.startAssessment')}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t('patient.dashboard.startAssessmentDesc')}
          </p>
        </div>

        {/* Primary Action Button (Prominent) */}
        <div>
          <button
            onClick={() => navigate('/patient/new-assessment')}
            className="px-8 py-3.5 bg-[#0A1E3F] hover:bg-[#07152c] text-white rounded-lg text-sm font-bold shadow-xs transition-all flex items-center gap-2"
          >
            <span>{t('patient.dashboard.startAssessment')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Secondary Quick Actions: Voice, Upload Report, Describe Symptoms (Section 10 Spec) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          
          <button
            onClick={() => navigate('/patient/new-assessment')}
            className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <Mic className="w-4 h-4 text-teal-700" />
              <div>
                <span className="font-bold text-xs text-slate-900 block">{t('patient.dashboard.voiceIntake')}</span>
                <span className="text-[11px] text-slate-500">{t('patient.dashboard.voiceLanguages')}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => navigate('/patient/new-assessment')}
            className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-slate-700" />
              <div>
                <span className="font-bold text-xs text-slate-900 block">{t('patient.dashboard.uploadReport')}</span>
                <span className="text-[11px] text-slate-500">{t('patient.dashboard.automatedLabOcr')}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => navigate('/patient/new-assessment')}
            className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-slate-700" />
              <div>
                <span className="font-bold text-xs text-slate-900 block">{t('patient.dashboard.describeSymptoms')}</span>
                <span className="text-[11px] text-slate-500">{t('patient.dashboard.detailedPlainInput')}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* Section 11: PATIENT CURRENT STATUS CARD                                   */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              {t('patient.dashboard.currentAssessment')}
            </h3>
            <span className="text-[11px] font-mono text-slate-500">
              {t('patient.dashboard.caseRef')}: {latestAssessment?.id || 'ASM-2026-00124'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              <span>{t('patient.dashboard.awaitingReview')}</span>
            </span>
          </div>
        </div>

        {/* Stepper Timeline (Section 11 Spec) */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            
            <div className="p-3 bg-white rounded-lg border border-emerald-200 space-y-1 shadow-2xs">
              <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('patient.dashboard.stepSubmitted')}</span>
              </div>
              <div className="text-[11px] text-slate-500">{t('patient.dashboard.symptomsVoiceRecorded')}</div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-emerald-200 space-y-1 shadow-2xs">
              <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('patient.dashboard.stepConsent')}</span>
              </div>
              <div className="text-[11px] text-slate-500">{t('patient.dashboard.categoriesAuthorized')}</div>
            </div>

            <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200 space-y-1 shadow-2xs">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{t('patient.dashboard.stepReview')}</span>
              </div>
              <div className="text-[11px] text-slate-600">{t('patient.dashboard.pendingExamination')}</div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1 shadow-2xs opacity-75">
              <div className="font-semibold text-slate-600 flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full border border-slate-400 inline-block" />
                <span>{t('patient.dashboard.stepFollowUp')}</span>
              </div>
              <div className="text-[11px] text-slate-400">{t('patient.dashboard.nextCareStep')}</div>
            </div>

          </div>
        </div>

        {/* Button: View Assessment (Section 11 Spec) */}
        <div className="flex justify-end pt-1">
          <button
            onClick={() => {
              if (latestAssessment) {
                setSelectedAssessmentId(latestAssessment.id);
                navigate('/patient/history');
              }
            }}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <span>{t('patient.dashboard.viewAssessment')}</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* Section 12: PATIENT DASHBOARD CARDS (My Reports, Timeline, Requests)      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: My Reports (Section 12 Spec: 4 documents [View Reports]) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {t('patient.dashboard.lockerDocuments')}
            </span>
            <h3 className="font-extrabold text-base text-slate-900">
              {t('patient.dashboard.myReports')}
            </h3>
            <div className="text-xl font-bold font-mono text-slate-800 pt-1">
              {t('patient.dashboard.reportsCount')}
            </div>
            <p className="text-xs text-slate-500">
              {t('patient.dashboard.reportsDesc')}
            </p>
          </div>

          <button
            onClick={() => navigate('/patient/reports')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1"
          >
            <span>{t('patient.dashboard.viewReports')}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Card 2: Health Timeline (Section 12 Spec: Last updated: 24 Sep 2026 [View Timeline]) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {t('patient.dashboard.careProgression')}
            </span>
            <h3 className="font-extrabold text-base text-slate-900">
              {t('patient.dashboard.healthTimeline')}
            </h3>
            <div className="text-xs font-semibold text-slate-700 pt-1">
              {t('patient.dashboard.lastUpdated')}: <span className="font-bold text-slate-900">24 Sep 2026</span>
            </div>
            <p className="text-xs text-slate-500">
              {t('patient.dashboard.timelineDesc')}
            </p>
          </div>

          <button
            onClick={() => navigate('/patient/timeline')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1"
          >
            <span>{t('patient.dashboard.viewTimeline')}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Card 3: Information Requests (Section 12 Spec: 1 response required [Respond]) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
              {t('patient.dashboard.healthcareInquiry')}
            </span>
            <h3 className="font-extrabold text-base text-slate-900">
              {t('patient.dashboard.infoRequests')}
            </h3>
            <div className="text-xs font-semibold text-amber-800 pt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              <span>{pendingDoctorQuestion ? t('patient.dashboard.responseRequired') : t('patient.dashboard.noPendingRequests')}</span>
            </div>
            <p className="text-xs text-slate-500">
              {t('patient.dashboard.inquiryDesc')}
            </p>
          </div>

          <button
            onClick={() => {
              if (latestAssessment) {
                setSelectedAssessmentId(latestAssessment.id);
                navigate('/patient/history');
              }
            }}
            className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
          >
            <span>{t('patient.dashboard.respond')}</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
          </button>
        </div>

      </div>

    </div>
  );
};
