import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, Lock, Users, FileText, Trash2, Database, AlertCircle } from 'lucide-react';

export const PrivacyModal: React.FC = () => {
  const { isPrivacyModalOpen, setPrivacyModalOpen } = useApp();

  if (!isPrivacyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Privacy & Responsible AI Center</h3>
              <p className="text-xs text-slate-500">Public Health Data Governance & Safety Framework</p>
            </div>
          </div>
          <button 
            onClick={() => setPrivacyModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-slate-700 text-sm">
          
          {/* Synthetic Data Alert */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Demonstration Environment Notice:</strong>
              <p className="mt-1 text-amber-800 leading-relaxed">
                This hackathon deployment uses 100% synthetic dummy data. Real Aadhaar numbers, biometric data, 
                and actual protected health information (PHI) are strictly barred from entry and never collected or persisted.
              </p>
            </div>
          </div>

          {/* Core Privacy Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase tracking-wider">
                <Database className="w-4 h-4" />
                <span>1. Data Minimization</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The triage system collects strictly the minimum symptom descriptors and lab parameters needed for triage queue prioritization.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>2. Explicit Consent</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every patient registration records digital consent for triage-assisted information synthesis and qualified clinical review.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                <Users className="w-4 h-4" />
                <span>3. Role-Based Access</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Patients can only access their own profile and assessments. Clinicians can only review cases within their accredited jurisdiction.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>4. Immutable Audit Trail</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every symptom entry, OCR extraction, audio conversion, and clinician review event is cryptographically logged with timestamps.
              </p>
            </div>

          </div>

          {/* Retention & Human In The Loop */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-slate-500" />
              Ephemeral Processing & Human-In-The-Loop Principle
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              In production public health deployments, audio waveforms are discarded post-transcription. 
              The system operates strictly as a decision-support instrument: no diagnostic label or prescription is ever issued autonomously.
            </p>
          </div>

          {/* Footer note */}
          <div className="bg-slate-100 rounded-xl p-3 text-center text-xs text-slate-500">
            Compliant with Digital Personal Data Protection (DPDP) Act guidelines and Ayushman Bharat Digital Mission (ABDM) standards.
          </div>

        </div>

        {/* Action button */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setPrivacyModalOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs shadow-xs transition-all"
          >
            I Understand & Close
          </button>
        </div>

      </div>
    </div>
  );
};
