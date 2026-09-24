import React from 'react';
import { useApp } from '../../context/AppContext';
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
  ChevronRight
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

export const PatientDashboard: React.FC = () => {
  const { currentPatient, assessments, navigate, setSelectedAssessmentId } = useApp();

  const patientAssessments = assessments.filter(a => a.patientId === currentPatient?.id) || [];
  const latestAssessment = patientAssessments[0] || assessments[0];

  // Check if doctor requested information on any active assessment (Section 18)
  const pendingDoctorQuestion = latestAssessment?.followUpQuestions?.find(q => q.status === 'ASKED');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      
      {/* Calm & Human Patient Header (Section 17) */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Verified Patient ID: {currentPatient?.id || 'PAT-2026-00124'} ({currentPatient?.preferredLanguage})
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] tracking-tight">
              Good morning, {currentPatient?.name?.split(' ')[0] || 'Riya'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Your CAREQ health overview
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Assigned Centre:</span>
            <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-careq-sm">
              CAREQ Demo PHC Jatni
            </span>
          </div>
        </div>
      </div>

      {/* ACTION REQUIRED BANNER (Section 18 - Visually Strongest) */}
      {pendingDoctorQuestion && (
        <div className="p-4 sm:p-5 rounded-careq-md bg-amber-50 border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-careq-xs animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-careq-sm bg-amber-500/20 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
              <HelpCircle className="w-5 h-5 text-amber-700" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                Action Required
              </span>
              <h3 className="font-bold text-sm text-slate-900">
                Your healthcare worker has requested additional information
              </h3>
              <p className="text-xs text-amber-900 leading-snug">
                "{pendingDoctorQuestion.question}"
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedAssessmentId(latestAssessment.id);
              navigate('/patient/history');
            }}
            className="px-4 py-2 bg-[#0A1E3F] hover:bg-[#163B66] text-white rounded-careq-sm text-xs font-bold transition-colors shadow-careq-xs whitespace-nowrap self-start sm:self-auto"
          >
            Respond Now →
          </button>
        </div>
      )}

      {/* HERO CTA: Start a New Assessment (Section 17) */}
      <div className="bg-white rounded-careq-lg p-6 sm:p-8 border border-slate-200 shadow-careq-sm space-y-5">
        <div className="max-w-2xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
            Clinical Triage Intake
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A1E3F]">
            Start a new assessment
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Share symptoms, voice, reports or images for healthcare-worker review. CAREQ structures your health information into a clinical triage note for faster doctor review.
          </p>
        </div>

        {/* 3 Clean Action Triggers (Section 17) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          
          <button
            onClick={() => navigate('/patient/new-assessment')}
            className="p-4 rounded-careq-md border border-slate-200 hover:border-[#0A1E3F] bg-slate-50/60 hover:bg-slate-50 text-left transition-all flex items-center justify-between group"
          >
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#0A1E3F]">
                Describe Symptoms
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Type in Odia, Hindi, or English.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0A1E3F] group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => navigate('/patient/new-assessment')}
            className="p-4 rounded-careq-md border border-slate-200 hover:border-teal-700 bg-slate-50/60 hover:bg-slate-50 text-left transition-all flex items-center justify-between group"
          >
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-teal-800 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-teal-700" />
                <span>Use Voice</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Speak naturally in your mother tongue.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-800 group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => navigate('/patient/new-assessment')}
            className="p-4 rounded-careq-md border border-slate-200 hover:border-[#0A1E3F] bg-slate-50/60 hover:bg-slate-50 text-left transition-all flex items-center justify-between group"
          >
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#0A1E3F] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-700" />
                <span>Upload Report</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Automated OCR for blood tests & X-rays.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0A1E3F] group-hover:translate-x-1 transition-all" />
          </button>

        </div>
      </div>

      {/* INFORMATION HIERARCHY (Section 18) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: 1. Current Assessment & 3. Health Timeline */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Current Assessment Card (Section 18) */}
          <div className="bg-white rounded-careq-lg p-5 sm:p-6 border border-slate-200 shadow-careq-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-700" />
                <h3 className="font-bold text-sm text-slate-900">
                  Current Assessment
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400 font-bold">
                {latestAssessment?.id}
              </span>
            </div>

            {latestAssessment ? (
              <div className="space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="font-bold text-slate-800 text-sm">
                      Awaiting healthcare-worker review
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RiskBadge level={latestAssessment.riskLevel} size="sm" />
                    <span className="font-mono text-slate-500">
                      Queue position #{latestAssessment.queuePosition}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-careq-sm bg-slate-50 border border-slate-200 text-slate-700">
                  <strong className="text-slate-900 block text-[11px] uppercase mb-0.5">Reported Symptoms:</strong>
                  {latestAssessment.structuredSymptoms.join(' • ')}
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      setSelectedAssessmentId(latestAssessment.id);
                      navigate('/patient/history');
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-careq-sm transition-colors text-xs flex items-center gap-1"
                  >
                    <span>View Status & Timeline</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                No active assessment pending review.
              </div>
            )}
          </div>

          {/* Health Timeline Preview (Section 39) */}
          <div className="bg-white rounded-careq-lg p-5 sm:p-6 border border-slate-200 shadow-careq-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-700" />
                <h3 className="font-bold text-sm text-slate-900">
                  Longitudinal Health Timeline
                </h3>
              </div>
              <button
                onClick={() => navigate('/patient/timeline')}
                className="text-xs font-bold text-teal-800 hover:underline"
              >
                View Full Timeline →
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-careq-sm bg-slate-50 border border-slate-200">
                <span className="font-mono font-bold text-slate-500 w-16 flex-shrink-0">24 Sep</span>
                <div className="flex-1">
                  <div className="font-bold text-slate-900">Assessment Submitted</div>
                  <p className="text-slate-600 mt-0.5">Fever, cough, and breathing tightness recorded with Odia voice track.</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Completed</span>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-careq-sm bg-slate-50 border border-slate-200">
                <span className="font-mono font-bold text-slate-500 w-16 flex-shrink-0">24 Sep</span>
                <div className="flex-1">
                  <div className="font-bold text-slate-900">CBC Lab Report Attached</div>
                  <p className="text-slate-600 mt-0.5">blood_report.pdf OCR processed. Elevated WBC extracted.</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Processed</span>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-careq-sm bg-slate-50 border border-slate-200">
                <span className="font-mono font-bold text-slate-500 w-16 flex-shrink-0">24 Sep</span>
                <div className="flex-1">
                  <div className="font-bold text-slate-900">Clinical Review In-Progress</div>
                  <p className="text-slate-600 mt-0.5">Assigned to Dr. Ananya Sharma at CAREQ Demo PHC Jatni.</p>
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">In Progress</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right 4 Cols: 4. Reports & 5. Consent Center */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Reports Locker Card */}
          <div className="bg-white rounded-careq-lg p-5 border border-slate-200 shadow-careq-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Diagnostic Reports
              </h3>
              <span className="text-[10px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded font-bold">
                1 Document
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Access machine-extracted parameters from your blood tests and imaging.
            </p>
            <div className="p-3 rounded-careq-sm bg-slate-50 border border-slate-200 text-xs">
              <div className="font-bold text-slate-900">blood_report.pdf</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Complete Blood Count • OCR 97% Verified</div>
            </div>
            <button
              onClick={() => navigate('/patient/reports')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-careq-sm text-xs transition-colors"
            >
              Open Reports Vault →
            </button>
          </div>

          {/* Consent Status Card (Section 16 & 38) */}
          <div className="bg-white rounded-careq-lg p-5 border border-slate-200 shadow-careq-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-slate-700">
                <Lock className="w-3.5 h-3.5 text-teal-700" />
                <span>Consent & Control</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-500">
              You control which data categories authorized doctors can view.
            </p>
            <div className="space-y-1 text-[11px] text-slate-700 font-medium">
              <div>✓ Symptoms authorized</div>
              <div>✓ Diagnostic reports authorized</div>
              <div>✓ Voice transcript authorized</div>
              <div>✓ Clinical translation authorized</div>
            </div>
            <button
              onClick={() => navigate('/patient/consent')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-careq-sm text-xs transition-colors"
            >
              Manage Consent Preferences →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
