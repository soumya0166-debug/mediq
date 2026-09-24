import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  HelpCircle, 
  Send, 
  ShieldCheck, 
  Activity, 
  Stethoscope,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

export const PatientHistoryPage: React.FC = () => {
  const { currentPatient, assessments, markQuestionAnswered, navigate, setSelectedAssessmentId } = useApp();

  const patientAssessments = assessments.filter(a => a.patientId === currentPatient?.id) || [];
  const activeAssessment = patientAssessments[0] || assessments[0];

  const [activeAnswerInput, setActiveAnswerInput] = useState<{ [key: string]: string }>({});

  const handleAnswerSubmit = (assessmentId: string, questionId: string) => {
    const text = activeAnswerInput[questionId];
    if (!text || text.trim() === '') return;
    markQuestionAnswered(assessmentId, questionId, text);
    setActiveAnswerInput(prev => ({ ...prev, [questionId]: '' }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
            Patient Portal • Live Care Progress
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            My Triage Assessments & Review Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track real-time clinical review stage, answer doctor questions, and access referral notes
          </p>
        </div>

        <button
          onClick={() => navigate('/patient/new-assessment')}
          className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <span>+ New Assessment</span>
        </button>
      </div>

      {/* Section 12: Primary Status Screen */}
      {activeAssessment && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-6">
          
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 font-bold">
                <Clock className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-500">Case ID: {activeAssessment.id}</span>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  Waiting for Healthcare Worker Review
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <RiskBadge level={activeAssessment.riskLevel} size="md" />
              <div className="bg-slate-100 text-slate-700 px-3 py-1 rounded-xl text-xs font-mono font-semibold">
                Est. Queue #{activeAssessment.queuePosition} ({activeAssessment.waitingMinutes} min ago)
              </div>
            </div>
          </div>

          {/* Stepper Timeline as mandated in Section 12 */}
          <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
              Clinical Workflow Progression
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
              
              {/* Step 1 */}
              <div className="flex items-center sm:flex-col sm:items-start gap-3 p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Information Submitted</div>
                  <div className="text-[10px] text-slate-500">{activeAssessment.submittedAt}</div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center sm:flex-col sm:items-start gap-3 p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Reports Processed</div>
                  <div className="text-[10px] text-slate-500">OCR parsing complete</div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-center sm:flex-col sm:items-start gap-3 p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Triage Note Prepared</div>
                  <div className="text-[10px] text-slate-500">Timeline & signals built</div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-center sm:flex-col sm:items-start gap-3 p-3 bg-amber-50 rounded-xl border-2 border-amber-400 shadow-xs ring-2 ring-amber-400/20">
                <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold flex-shrink-0 animate-pulse">
                  ●
                </div>
                <div>
                  <div className="font-bold text-amber-950">Clinician Reviewing</div>
                  <div className="text-[10px] text-amber-800">In doctor active queue</div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex items-center sm:flex-col sm:items-start gap-3 p-3 bg-white/60 rounded-xl border border-slate-200 opacity-60">
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold flex-shrink-0">
                  ○
                </div>
                <div>
                  <div className="font-bold text-slate-700">Follow-up / Referral</div>
                  <div className="text-[10px] text-slate-400">Post-review action</div>
                </div>
              </div>

            </div>
          </div>

          {/* Interactive Doctor Follow-up Questions (if doctor requested more info) */}
          {activeAssessment.followUpQuestions && activeAssessment.followUpQuestions.length > 0 && (
            <div className="border border-blue-200 bg-blue-50/60 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-700" />
                  <h3 className="font-bold text-sm text-blue-950">
                    Clinical Questions from Reviewing Healthcare Worker
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                  Action Requested
                </span>
              </div>

              <div className="space-y-3">
                {activeAssessment.followUpQuestions.map((fq) => (
                  <div key={fq.id} className="bg-white rounded-xl p-4 border border-blue-200 shadow-2xs space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-xs sm:text-sm text-slate-800">
                        {fq.question}
                      </p>
                      {fq.status === 'ANSWERED' ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex-shrink-0">
                          ✓ Answered
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex-shrink-0">
                          Awaiting your reply
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[11px] text-slate-500 italic">
                      Why asked: {fq.rationale}
                    </p>

                    {fq.status === 'ANSWERED' ? (
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                        <strong className="text-slate-900 block text-[10px] uppercase">Your Answer:</strong>
                        {fq.answer}
                      </div>
                    ) : (
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          value={activeAnswerInput[fq.id] || ''}
                          onChange={(e) => setActiveAnswerInput({ ...activeAnswerInput, [fq.id]: e.target.value })}
                          placeholder="Type your response (e.g. Yes, 101.4°F or SpO2 is 98%)..."
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-600"
                        />
                        <button
                          type="button"
                          onClick={() => handleAnswerSubmit(activeAssessment.id, fq.id)}
                          className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinician Review Notes (if reviewed) */}
          {activeAssessment.status === 'REVIEWED' && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-xs text-emerald-900 uppercase">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Case Reviewed by {activeAssessment.reviewedBy || 'Dr. Ananya Sharma'}
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                {activeAssessment.clinicalNotes || 'Triage review completed. Patient advised routine OPD consult.'}
              </p>
            </div>
          )}

        </div>
      )}

      {/* History List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Previous Assessments & Timeline Records
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {patientAssessments.map((a) => (
            <div
              key={a.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-800">{a.id}</span>
                  <RiskBadge level={a.riskLevel} size="sm" />
                  <span className="text-[11px] text-slate-400">• {a.submittedAt}</span>
                </div>
                <p className="text-xs text-slate-600 font-medium line-clamp-1">
                  {a.structuredSymptoms.join(', ')}
                </p>
                <div className="text-[11px] text-slate-400">
                  Multimodal Inputs: {a.hasVoice ? '✓ Voice' : ''} {a.hasReport ? '✓ Lab Report' : ''} {a.hasImage ? '✓ Photo' : ''}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                  a.status === 'REVIEWED' ? 'bg-emerald-100 text-emerald-800' :
                  a.status === 'REFERRED' ? 'bg-indigo-100 text-indigo-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {a.status === 'WAITING_REVIEW' ? 'Waiting for Review' : a.status}
                </span>
                
                {a.referralNote && (
                  <button
                    onClick={() => {
                      setSelectedAssessmentId(a.id);
                      navigate(`/doctor/referral/${a.id}`);
                    }}
                    className="text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1"
                  >
                    View Referral Draft →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
