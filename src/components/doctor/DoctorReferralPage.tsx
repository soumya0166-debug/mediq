import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ReferralDraft } from '../../types';
import { 
  Share2, 
  Copy, 
  Printer, 
  Check, 
  Edit3, 
  Building2, 
  AlertCircle, 
  ArrowLeft, 
  ShieldCheck, 
  FileCheck,
  Send
} from 'lucide-react';

export const DoctorReferralPage: React.FC = () => {
  const { selectedAssessment, currentDoctor, navigate, saveReferralNote } = useApp();
  const assessment = selectedAssessment;

  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form Fields for Referral Note (Section 23)
  const [targetFacility, setTargetFacility] = useState('SCB Medical College & Hospital, Cuttack');
  const [priority, setPriority] = useState<ReferralDraft['priority']>('Urgent (within 24h)');
  const [reasonForReferral, setReasonForReferral] = useState(
    'Evaluation of acute respiratory distress with persistent fever and leukocytosis (14,200/µL). Rule out lower respiratory tract infection / community-acquired pneumonia requiring tertiary radiological imaging and arterial blood gas (ABG) evaluation.'
  );
  const [presentingConcerns, setPresentingConcerns] = useState(
    'Fever for 2 days, persistent cough, reported dyspnea and chest heaviness upon minor exertion.'
  );
  const [timelineSummary, setTimelineSummary] = useState(
    'Day 1: Acute fever onset. Day 2: Cough aggravated, took paracetamol without sustained defervescence. Day 3: Morning onset of chest tightness and breathing discomfort.'
  );
  const [informationExtracted, setInformationExtracted] = useState(
    'Complete Blood Count (CBC): Elevated WBC (14,200 /µL), Neutrophils 82%, Lymphocytes 13%, ESR 38 mm/hr.'
  );
  const [urgencySignalsList, setUrgencySignalsList] = useState(
    '1. Acute onset breathing discomfort\n2. Leukocytosis with neutrophilic shift\n3. Persistent fever (>48 hours)'
  );
  const [pendingQuestions, setPendingQuestions] = useState(
    'Resting vs exertional SpO2 not documented; objective highest thermometer reading pending.'
  );

  if (!assessment) {
    return (
      <div className="p-8 text-center text-slate-500">
        No case selected. <button onClick={() => navigate('/doctor/queue')} className="text-blue-900 underline font-bold">Return to Queue</button>
      </div>
    );
  }

  const handleCopyNote = () => {
    const fullText = `
REFERRAL NOTE — DRAFT FOR HEALTHCARE WORKER REVIEW
=====================================================
Educational Prototype — Triage Support Only — Not for Diagnosis
Draft generated from patient-provided information. Review and edit before use.

PATIENT INFORMATION:
Name: ${assessment.patientName}
Age/Gender: ${assessment.patientAge} / ${assessment.patientGender}
Patient ID: ${assessment.patientId}
Case Reference: ${assessment.id}
Referring Facility: ${currentDoctor?.facility || 'Capital Hospital & CHC, Bhubaneswar'}
Referring Clinician: ${currentDoctor?.name || 'Dr. Ananya Sharma'} (${currentDoctor?.medicalRegistrationId || 'NMC-84920'})
Receiving Facility: ${targetFacility}
Referral Urgency: ${priority}

REASON FOR REFERRAL:
${reasonForReferral}

PRESENTING CONCERNS:
${presentingConcerns}

CHRONOLOGICAL TIMELINE:
${timelineSummary}

INFORMATION EXTRACTED (LAB/OCR):
${informationExtracted}

URGENCY SIGNALS HIGHLIGHTED:
${urgencySignalsList}

MISSING INFORMATION / QUESTIONS:
${pendingQuestions}

REPORTS ATTACHED:
${assessment.extractedReports.map(r => `- ${r.reportName} (${r.fileName})`).join('\n') || '- None'}

CLINICAL ATTESTATION:
Draft prepared via SwasthyaSetu AI triage assistant. Verified by referring clinician.
=====================================================`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveReferral = () => {
    const newReferral: ReferralDraft = {
      id: `REF-${Date.now().toString().slice(-4)}`,
      assessmentId: assessment.id,
      patientId: assessment.patientId,
      patientName: assessment.patientName,
      patientAge: assessment.patientAge,
      patientGender: assessment.patientGender,
      referringDoctor: currentDoctor?.name || 'Dr. Ananya Sharma',
      referringFacility: currentDoctor?.facility || 'Capital Hospital & CHC',
      targetFacility,
      priority,
      reasonForReferral,
      presentingConcerns,
      timelineSummary,
      extractedFindings: informationExtracted,
      urgencySignalsList,
      pendingQuestions,
      attachmentsList: assessment.extractedReports.map(r => r.fileName),
      createdAt: 'Today, Just now',
      isDraft: false
    };

    saveReferralNote(newReferral);
    alert('Referral note finalized and saved to institutional audit ledger.');
    navigate('/doctor/queue');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      
      {/* Top Bar (No Print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/doctor/review/${assessment.id}`)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white border border-slate-200 transition-all"
            title="Return to review workspace"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Institutional Referral Note Generator
            </h1>
            <p className="text-xs text-slate-500">
              Structured clinical handover note for tertiary care escalation
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              isEditing ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Done Editing' : 'Edit Fields'}</span>
          </button>

          <button
            onClick={handleCopyNote}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Note'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export / Print PDF</span>
          </button>
        </div>
      </div>

      {/* Mandatory Safety Alert (Section 23) */}
      <div className="no-print p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-extrabold text-sm block">Draft for Healthcare Worker Review:</strong>
          <p className="mt-0.5 text-amber-900">
            Draft generated from patient-provided information and automated OCR. Review and edit before use. 
            This document must be signed and approved by the attending clinical officer.
          </p>
        </div>
      </div>

      {/* FORMAL REFERRAL NOTE PAPER VIEW (Section 23) */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-300 space-y-6 print:border-none print:shadow-none">
        
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Government of Odisha • Department of Health & Family Welfare
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Referral Note — Draft for Healthcare Worker Review
            </h2>
            <p className="text-xs text-slate-500 font-serif italic">
              SwasthyaSetu AI Decision Support Subsystem • Inter-Hospital Clinical Transfer
            </p>
          </div>

          <div className="text-right sm:border-l-2 sm:border-slate-200 sm:pl-4 text-xs font-mono">
            <div className="text-slate-500 text-[10px]">CASE REF</div>
            <div className="font-bold text-slate-900">{assessment.id}</div>
            <div className="text-[10px] text-slate-400 mt-1">Date: 24-Sep-2026</div>
          </div>
        </div>

        {/* Section 1: Patient Information */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient Name</span>
            <span className="font-bold text-slate-900 text-sm">{assessment.patientName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient ID / Age / Gender</span>
            <span className="font-mono font-bold text-slate-800">{assessment.patientId} • {assessment.patientAge}y / {assessment.patientGender}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Referring Facility</span>
            <span className="font-semibold text-slate-800">{currentDoctor?.facility || 'Capital Hospital & CHC'}</span>
          </div>
        </div>

        {/* Section 2: Destination Facility & Urgency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Receiving Facility (Tertiary Centre) *
            </label>
            {isEditing ? (
              <select
                value={targetFacility}
                onChange={(e) => setTargetFacility(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="SCB Medical College & Hospital, Cuttack">SCB Medical College & Hospital, Cuttack</option>
                <option value="All India Institute of Medical Sciences (AIIMS) Bhubaneswar">AIIMS Bhubaneswar</option>
                <option value="District Headquarters Hospital (DHH) Khordha">DHH Khordha</option>
                <option value="MKCG Medical College & Hospital, Berhampur">MKCG Medical College, Berhampur</option>
              </select>
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-900">
                {targetFacility}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Referral Priority Level *
            </label>
            {isEditing ? (
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="Immediate">Immediate (Emergency Ambulance Transfer)</option>
                <option value="Urgent (within 24h)">Urgent (within 24h)</option>
                <option value="Routine OPD">Routine OPD Specialist Consult</option>
              </select>
            ) : (
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 font-bold text-red-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <span>{priority}</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Reason for Referral */}
        <div className="space-y-1.5 text-xs">
          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
            Reason for Referral
          </label>
          {isEditing ? (
            <textarea
              rows={3}
              value={reasonForReferral}
              onChange={(e) => setReasonForReferral(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white"
            />
          ) : (
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 text-slate-800 leading-relaxed font-sans">
              {reasonForReferral}
            </div>
          )}
        </div>

        {/* Section 4: Presenting Concerns & Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              Presenting Concerns
            </label>
            {isEditing ? (
              <textarea
                rows={3}
                value={presentingConcerns}
                onChange={(e) => setPresentingConcerns(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white"
              />
            ) : (
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                {presentingConcerns}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              Reported Chronological Timeline
            </label>
            {isEditing ? (
              <textarea
                rows={3}
                value={timelineSummary}
                onChange={(e) => setTimelineSummary(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white"
              />
            ) : (
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                {timelineSummary}
              </div>
            )}
          </div>
        </div>

        {/* Section 5: Extracted Findings & Urgency Signals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              Information Extracted (Lab OCR)
            </label>
            {isEditing ? (
              <textarea
                rows={3}
                value={informationExtracted}
                onChange={(e) => setInformationExtracted(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white"
              />
            ) : (
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                {informationExtracted}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              Urgency Signals Highlighted
            </label>
            {isEditing ? (
              <textarea
                rows={3}
                value={urgencySignalsList}
                onChange={(e) => setUrgencySignalsList(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white"
              />
            ) : (
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                {urgencySignalsList}
              </div>
            )}
          </div>
        </div>

        {/* Section 6: Missing Info & Attachments */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Questions / Missing Information</span>
            <p className="text-slate-700 mt-1 leading-snug">{pendingQuestions}</p>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Reports Attached to Case File</span>
            <ul className="text-slate-700 mt-1 space-y-0.5">
              {assessment.extractedReports.map((r, i) => (
                <li key={i} className="flex items-center gap-1 font-semibold text-blue-900">
                  <FileCheck className="w-3.5 h-3.5 text-teal-700" />
                  <span>{r.fileName} (Complete Blood Count OCR)</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Signatures & Clinician Attestation */}
        <div className="pt-8 border-t-2 border-slate-200 grid grid-cols-2 gap-8 text-xs">
          <div>
            <div className="font-bold text-slate-900">Referring Medical Officer:</div>
            <div className="mt-4 font-mono font-semibold text-slate-800">{currentDoctor?.name || 'Dr. Ananya Sharma'}</div>
            <div className="text-[11px] text-slate-500">Reg: {currentDoctor?.medicalRegistrationId || 'NMC/ORI/2015/084920'}</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-slate-900">Clinical Attestation Stamp:</div>
            <div className="mt-4 text-emerald-700 font-bold flex items-center gap-1 justify-end">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Digitally Signed via SwasthyaSetu Hub</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Timestamp: 2026-09-24T10:49:12+05:30</div>
          </div>
        </div>

      </div>

      {/* Final Action Bar (No Print) */}
      <div className="no-print flex justify-end gap-3 pt-2">
        <button
          onClick={() => navigate(`/doctor/review/${assessment.id}`)}
          className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveReferral}
          className="px-6 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Finalize & Dispatch Referral Note</span>
        </button>
      </div>

    </div>
  );
};
