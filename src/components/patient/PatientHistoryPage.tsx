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
  ArrowRight,
  MessageSquare,
  Sparkles
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
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-md">
            Patient Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Assessments & Review Status
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Track real-time clinical review stage, answer healthcare worker inquiries, and view continuity notes.
          </p>
        </div>

        <button
          onClick={() => navigate('/patient/new-assessment')}
          className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>+ Start New Assessment</span>
        </button>
      </div>

      {/* Primary Status Card */}
      {activeAssessment && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs space-y-6">
          
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400">Case Ref: {activeAssessment.id}</span>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {activeAssessment.status === 'REVIEWED' ? 'Review Completed' : 'Awaiting Healthcare-Worker Review'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <RiskBadge level={activeAssessment.riskLevel} size="md" />
              <div className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-mono font-medium">
                Queue #{activeAssessment.queuePosition} ({activeAssessment.waitingMinutes}m ago)
              </div>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Clinical Review Progression
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              
              {/* Step 1 */}
              <div className="p-3 bg-white rounded-lg border border-emerald-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>1. Collected</span>
                </div>
                <div className="text-[11px] text-slate-500">{activeAssessment.submittedAt}</div>
              </div>

              {/* Step 2 */}
              <div className="p-3 bg-white rounded-lg border border-emerald-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>2. Organized</span>
                </div>
                <div className="text-[11px] text-slate-500">AI triage synthesis complete</div>
              </div>

              {/* Step 3 */}
              <div className={`p-3 rounded-lg border shadow-2xs space-y-1 ${
                activeAssessment.status === 'REVIEWED'
                  ? 'bg-white border-emerald-200 text-emerald-900'
                  : 'bg-amber-50/60 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-center gap-1.5 font-bold">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>3. Human Review</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  {activeAssessment.status === 'REVIEWED' ? 'Attested by Dr. Ananya' : 'In triage queue'}
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                  <Stethoscope className="w-4 h-4 text-slate-400" />
                  <span>4. Next Care Steps</span>
                </div>
                <div className="text-[11px] text-slate-500">Advisory instructions</div>
              </div>

            </div>
          </div>

          {/* Section 18 & 34: Action Required Banner if doctor asked questions */}
          {activeAssessment.followUpQuestions.some(q => q.status === 'ASKED') && (
            <div className="p-5 rounded-xl bg-amber-50 border border-amber-300 space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0" />
                <div>
                  <h3 className="font-extrabold text-sm text-amber-950">
                    Action Required: Your Healthcare Worker Requested Clarification
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Please provide an answer below to help Dr. Sharma complete your clinical triage review.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {activeAssessment.followUpQuestions.filter(q => q.status === 'ASKED').map((q) => (
                  <div key={q.id} className="p-4 bg-white rounded-lg border border-amber-200 space-y-2 text-xs">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-teal-700" />
                      <span>{q.question}</span>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={activeAnswerInput[q.id] || ''}
                        onChange={(e) => setActiveAnswerInput(prev => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder="Type your response here..."
                        className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                      />
                      <button
                        onClick={() => handleAnswerSubmit(activeAssessment.id, q.id)}
                        className="px-4 py-2 bg-[#0A1E3F] hover:bg-[#07152c] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Response</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinician Review Notes if reviewed */}
          {activeAssessment.status === 'REVIEWED' && activeAssessment.clinicalNotes && (
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1.5 text-xs text-emerald-950">
              <span className="font-bold text-emerald-800 block text-[11px] uppercase tracking-wider">
                Clinician Advice (Dr. Ananya Sharma):
              </span>
              <p className="leading-relaxed font-medium">"{activeAssessment.clinicalNotes}"</p>
            </div>
          )}

        </div>
      )}

      {/* Historical Assessments List */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900">
          Previous Assessments
        </h3>

        <div className="space-y-2 text-xs">
          {patientAssessments.slice(1).map((a) => (
            <div key={a.id} className="p-3.5 rounded-lg border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-all">
              <div>
                <span className="font-mono font-bold text-slate-900">{a.id}</span>
                <p className="text-slate-600 text-[11px] mt-0.5 truncate max-w-md">{a.rawSymptomText}</p>
                <span className="text-[10px] text-slate-400 font-mono">Submitted: {a.submittedAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <RiskBadge level={a.riskLevel} size="sm" />
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                  {a.status}
                </span>
              </div>
            </div>
          ))}
          {patientAssessments.length <= 1 && (
            <p className="text-slate-400 text-xs py-2">No earlier assessments recorded.</p>
          )}
        </div>
      </div>

    </div>
  );
};
