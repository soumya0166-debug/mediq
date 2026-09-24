import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Mic, 
  FileText, 
  Image as ImageIcon, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  FileSearch, 
  AlertCircle,
  Activity,
  HeartHandshake
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

export const PatientDashboard: React.FC = () => {
  const { currentPatient, assessments, navigate, setSelectedAssessmentId } = useApp();

  const patientAssessments = assessments.filter(a => a.patientId === currentPatient?.id) || [];
  const latestAssessment = patientAssessments[0] || assessments[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      
      {/* Friendly Patient Greeting */}
      <div className="bg-gradient-to-r from-teal-800 via-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-cyan-300 border border-white/15">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
            Verified Patient: {currentPatient?.id || 'PAT-2026-00124'} ({currentPatient?.preferredLanguage})
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good morning, {currentPatient?.name?.split(' ')[0] || 'Riya'} 👋
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            How can we help organize your health information today? Your symptoms and reports will be prepared for doctor review.
          </p>
        </div>

        {/* Decorative wave */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Large Primary Action Card (Section 8) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div>
          <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-teal-600" />
            Assistive Triage Intake
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Start a New Health Assessment
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Share your symptoms, voice description, or medical reports for structured review. The system organizes your timeline and flags missing vitals before a doctor examines your case.
          </p>
        </div>

        {/* 4 Multimodal Intake Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <button
            onClick={() => navigate('/patient/new-assessment')}
            className="p-5 rounded-2xl border-2 border-slate-200 hover:border-teal-600 bg-slate-50/60 hover:bg-teal-50/40 text-left transition-all group shadow-2xs hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-6 h-6 text-teal-700" />
            </div>
            <div className="font-bold text-slate-900 text-sm group-hover:text-teal-900 flex items-center justify-between">
              <span>Describe Symptoms</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Type what you feel in your regional language or English.
            </p>
          </button>

          <button
            onClick={() => navigate('/patient/new-assessment')}
            className="p-5 rounded-2xl border-2 border-slate-200 hover:border-blue-600 bg-slate-50/60 hover:bg-blue-50/40 text-left transition-all group shadow-2xs hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Mic className="w-6 h-6 text-blue-700" />
            </div>
            <div className="font-bold text-slate-900 text-sm group-hover:text-blue-900 flex items-center justify-between">
              <span>🎤 Use Voice</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Speak naturally in Odia, Hindi, or English. Auto-translated.
            </p>
          </button>

          <button
            onClick={() => navigate('/patient/new-assessment')}
            className="p-5 rounded-2xl border-2 border-slate-200 hover:border-indigo-600 bg-slate-50/60 hover:bg-indigo-50/40 text-left transition-all group shadow-2xs hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6 text-indigo-700" />
            </div>
            <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-900 flex items-center justify-between">
              <span>📄 Upload Report</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-700 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Automated OCR parsing for blood tests, X-rays, and panels.
            </p>
          </button>

          <button
            onClick={() => navigate('/patient/new-assessment')}
            className="p-5 rounded-2xl border-2 border-slate-200 hover:border-amber-600 bg-slate-50/60 hover:bg-amber-50/40 text-left transition-all group shadow-2xs hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ImageIcon className="w-6 h-6 text-amber-700" />
            </div>
            <div className="font-bold text-slate-900 text-sm group-hover:text-amber-900 flex items-center justify-between">
              <span>📷 Upload Image</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Attach visible skin rash, joint swelling, or throat photo.
            </p>
          </button>

        </div>
      </div>

      {/* Grid: Active Assessment Status & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Active Triage Status Banner (Section 12 Preview) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-700" />
              Latest Submitted Assessment Status
            </h3>
            <button
              onClick={() => navigate('/patient/history')}
              className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
            >
              View Full Timeline →
            </button>
          </div>

          {latestAssessment ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                  <span className="font-extrabold text-sm text-amber-950">
                    Waiting for Healthcare Worker Review
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <RiskBadge level={latestAssessment.riskLevel} />
                  <span className="text-xs text-slate-500 font-mono">
                    Position #{latestAssessment.queuePosition} in queue
                  </span>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-amber-200/80 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                  <span className="text-emerald-600 font-bold">✓</span> Submitted
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                  <span className="text-emerald-600 font-bold">✓</span> OCR Processed
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                  <span className="text-emerald-600 font-bold">✓</span> Triage Synthesized
                </div>
                <div className="flex items-center gap-1.5 text-amber-900 font-bold animate-pulse">
                  <span>●</span> Clinician Reviewing
                </div>
              </div>

              <div className="bg-white/80 p-3 rounded-xl border border-amber-200/80 text-xs text-slate-700">
                <strong className="text-slate-900 block mb-0.5">Reported Symptoms:</strong>
                {latestAssessment.structuredSymptoms.join(' • ')}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs">
              No recent health assessments submitted yet. Click "Start a New Health Assessment" above.
            </div>
          )}
        </div>

        {/* Right 1 Col: Trust & Safety Card */}
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-blue-950 font-bold text-sm">
            <HeartHandshake className="w-5 h-5 text-teal-700" />
            Human-in-the-Loop Care
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            SwasthyaSetu AI never diagnoses or prescribes autonomously. It is an assistant that converts your speech and medical tests into clean clinical notes so public hospital doctors can review faster.
          </p>
          <div className="bg-white p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <div className="font-semibold text-slate-800">Your Data Protections:</div>
            <div>✓ End-to-end encrypted triage ingestion</div>
            <div>✓ Digital consent recorded</div>
            <div>✓ Zero storage of real Aadhaar IDs</div>
          </div>
          <button
            onClick={() => navigate('/patient/reports')}
            className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all"
          >
            Access My Reports Locker
          </button>
        </div>

      </div>

    </div>
  );
};
