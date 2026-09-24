import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, Lock, Users, Clock, AlertCircle, Check } from 'lucide-react';

export const PrivacyModal: React.FC = () => {
  const { isPrivacyModalOpen, setPrivacyModalOpen, currentPatient, updatePatientConsent } = useApp();

  const [categories, setCategories] = useState(
    currentPatient?.consentCategories || {
      symptoms: true,
      reports: true,
      voiceTranscript: true,
      translation: true,
      previousAssessments: false,
    }
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isPrivacyModalOpen) return null;

  const handleToggle = (key: keyof typeof categories) => {
    setCategories(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    updatePatientConsent(categories);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setPrivacyModalOpen(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-careq-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-careq-md border border-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-careq-sm bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Consent & Access Center</h3>
              <p className="text-xs text-slate-500">CAREQ Data Governance & Patient Control Framework</p>
            </div>
          </div>
          <button 
            onClick={() => setPrivacyModalOpen(false)}
            className="p-1.5 rounded-careq-sm text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content (Section 38 & 51) */}
        <div className="p-6 space-y-6 text-slate-700 text-sm">
          
          {/* Privacy statement banner */}
          <div className="p-3.5 rounded-careq-md bg-teal-50/70 border border-teal-200 text-teal-900 text-xs flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-teal-700 flex-shrink-0" />
            <span>
              <strong>Your information is shared only with authorized clinical reviewers.</strong> 
              You can inspect and customize data category permissions below.
            </span>
          </div>

          {/* Section 38: Who, What, Why, When */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-careq-md border border-slate-200 bg-slate-50">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Who has access
              </div>
              <p className="font-semibold text-slate-800">
                Authorized clinical officers at {currentPatient?.assignedFacility || 'CAREQ Demo Primary Health Centre'}
              </p>
            </div>

            <div className="p-3 rounded-careq-md border border-slate-200 bg-slate-50">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Why they have access
              </div>
              <p className="font-semibold text-slate-800">
                To perform triage priority review and prepare clinical referral notes
              </p>
            </div>

            <div className="p-3 rounded-careq-md border border-slate-200 bg-slate-50">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                When access expires
              </div>
              <p className="font-semibold text-slate-800">
                Active triage session (auto-archives 24h post-review)
              </p>
            </div>

            <div className="p-3 rounded-careq-md border border-slate-200 bg-slate-50">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Security & Verification
              </div>
              <p className="font-semibold text-slate-800">
                Role-Based Access Control (RBAC) + SHA-256 Audit Trail
              </p>
            </div>
          </div>

          {/* What they can access - Granular Category Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                What information can be accessed:
              </h4>
              <span className="text-[11px] text-slate-500">Toggle categories anytime</span>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-3 rounded-careq-md border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Reported Symptoms & Notes</span>
                  <span className="text-[11px] text-slate-500">Text descriptions, duration, and patient concerns</span>
                </div>
                <input
                  type="checkbox"
                  checked={categories.symptoms}
                  onChange={() => handleToggle('symptoms')}
                  className="w-4 h-4 text-teal-700 rounded border-slate-300 focus:ring-teal-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-careq-md border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Uploaded Laboratory Reports</span>
                  <span className="text-[11px] text-slate-500">OCR extracted test values, reference intervals, and flags</span>
                </div>
                <input
                  type="checkbox"
                  checked={categories.reports}
                  onChange={() => handleToggle('reports')}
                  className="w-4 h-4 text-teal-700 rounded border-slate-300 focus:ring-teal-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-careq-md border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Voice Recording Transcript</span>
                  <span className="text-[11px] text-slate-500">Transcribed audio clip from regional language input</span>
                </div>
                <input
                  type="checkbox"
                  checked={categories.voiceTranscript}
                  onChange={() => handleToggle('voiceTranscript')}
                  className="w-4 h-4 text-teal-700 rounded border-slate-300 focus:ring-teal-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-careq-md border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">English Clinical Translation</span>
                  <span className="text-[11px] text-slate-500">Machine translation prepared for clinician understanding</span>
                </div>
                <input
                  type="checkbox"
                  checked={categories.translation}
                  onChange={() => handleToggle('translation')}
                  className="w-4 h-4 text-teal-700 rounded border-slate-300 focus:ring-teal-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-careq-md border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Previous Triage Assessments</span>
                  <span className="text-[11px] text-slate-500">Share longitudinal history from prior visits</span>
                </div>
                <input
                  type="checkbox"
                  checked={categories.previousAssessments}
                  onChange={() => handleToggle('previousAssessments')}
                  className="w-4 h-4 text-teal-700 rounded border-slate-300 focus:ring-teal-600"
                />
              </label>
            </div>
          </div>

          {/* Demonstration Notice */}
          <div className="bg-slate-100 rounded-careq-sm p-3 text-xs text-slate-500 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Demonstration Environment Notice:</strong> Real Aadhaar IDs and live biometric records are never collected. All patient tokens are synthetic demo records.
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              setCategories({
                symptoms: false,
                reports: false,
                voiceTranscript: false,
                translation: false,
                previousAssessments: false,
              });
            }}
            className="text-xs text-red-600 font-bold hover:underline"
          >
            Revoke All Access
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setPrivacyModalOpen(false)}
              className="px-4 py-2 rounded-careq-sm border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-careq-sm bg-[#0A1E3F] hover:bg-[#163B66] text-white text-xs font-bold transition-colors shadow-careq-xs flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Preferences Saved!</span>
                </>
              ) : (
                <span>Save Consent Preferences</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
