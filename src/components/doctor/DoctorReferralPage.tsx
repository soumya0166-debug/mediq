import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
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
  Send,
  Save,
  CheckCircle2
} from 'lucide-react';

export const DoctorReferralPage: React.FC = () => {
  const { selectedAssessment, currentDoctor, currentFacility, facilityId, navigate, saveReferralNote } = useApp();
  const { t } = useLanguage();
  const assessment = selectedAssessment;

  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [referralStatus, setReferralStatus] = useState<'Draft' | 'Approved'>('Draft');

  // Form Fields for Referral Note (Section 36)
  const [targetFacility, setTargetFacility] = useState('SCB Medical College & Hospital, Cuttack');
  const [priority, setPriority] = useState<ReferralDraft['priority']>('Urgent (within 24h)');
  const [referralReason, setReferralReason] = useState(
    'Evaluation of acute respiratory distress with persistent fever and leukocytosis (14,200/µL). Rule out lower respiratory tract infection / community-acquired pneumonia requiring tertiary radiological imaging and arterial blood gas (ABG) evaluation.'
  );
  const [presentingConcerns, setPresentingConcerns] = useState(
    'Fever for 2 days, persistent cough, reported dyspnea and chest heaviness upon minor exertion.'
  );
  const [timelineSummary, setTimelineSummary] = useState(
    'Day 1: Acute fever onset. Day 2: Cough aggravated, took paracetamol without sustained defervescence. Day 3: Morning onset of chest tightness and breathing discomfort.'
  );
  const [relevantReports, setRelevantReports] = useState(
    'Complete Blood Count (CBC): Elevated WBC (14,200 /µL), Neutrophils 82%, Lymphocytes 13%, ESR 38 mm/hr.'
  );
  const [urgencySignals, setUrgencySignals] = useState(
    '1. Acute onset breathing difficulty reported\n2. Leukocytosis with neutrophilic shift\n3. Persistent fever (>48 hours)'
  );
  const [informationMissing, setInformationMissing] = useState(
    'Resting vs exertional SpO2 not documented; objective thermometer reading pending.'
  );
  const [healthcareWorkerNotes, setHealthcareWorkerNotes] = useState(
    'Patient oriented to time and place. Primary stabilization started. Transferred via institutional ambulance with oxygen standby.'
  );

  if (!assessment) {
    return (
      <div className="p-12 text-center text-slate-500 space-y-3">
        <p className="text-sm">No active case selected for referral.</p>
        <button 
          onClick={() => navigate('/doctor/queue')} 
          className="px-4 py-2 bg-[#0A1E3F] text-white rounded-lg text-xs font-semibold"
        >
          Return to Queue
        </button>
      </div>
    );
  }

  const handleCopyNote = () => {
    const fullText = `
CAREQ REFERRAL DRAFT — FOR HEALTHCARE WORKER REVIEW
=====================================================
Educational Prototype — Triage Support Only — Not for Diagnosis
Draft generated from patient-provided information. Reviewed by authorized clinician.

1. PATIENT INFORMATION:
Name: ${assessment.patientName}
Age/Gender: ${assessment.patientAge} / ${assessment.patientGender}
Patient ID: ${assessment.patientId}
Case Reference: ${assessment.id}
Referring Facility: ${currentFacility || 'CAREQ Demo Primary Health Centre'} (${facilityId || 'FAC-DEMO-OD-001'})
Referring Clinician: ${currentDoctor?.name || 'Dr. Ananya Sharma'} (${currentDoctor?.medicalRegistrationId || 'NMC-84920'})

2. RECEIVING FACILITY:
${targetFacility} (Priority: ${priority})

3. REFERRAL REASON:
${referralReason}

4. PRESENTING CONCERNS:
${presentingConcerns}

5. TIMELINE:
${timelineSummary}

6. RELEVANT REPORTS:
${relevantReports}

7. URGENCY SIGNALS:
${urgencySignals}

8. INFORMATION MISSING:
${informationMissing}

9. HEALTHCARE WORKER NOTES:
${healthcareWorkerNotes}

STATUS: ${referralStatus}
=====================================================`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveDraft = () => {
    setIsEditing(false);
    alert('Referral draft saved successfully.');
  };

  const handleApproveReferral = () => {
    setReferralStatus('Approved');
    setIsEditing(false);
    saveReferralNote({
      id: `REF-${Date.now()}`,
      assessmentId: assessment.id,
      patientId: assessment.patientId,
      patientName: assessment.patientName,
      patientAge: assessment.patientAge,
      patientGender: assessment.patientGender,
      referringFacility: currentFacility || 'CAREQ Demo Primary Health Centre',
      referringFacilityId: facilityId || 'FAC-DEMO-OD-001',
      referringDoctor: currentDoctor?.name || 'Dr. Ananya Sharma',
      targetFacility,
      priority,
      reasonForReferral: referralReason,
      presentingConcerns,
      timelineSummary,
      extractedFindings: relevantReports,
      urgencySignalsList: urgencySignals,
      pendingQuestions: informationMissing,
      attachmentsList: assessment.extractedReports.map(r => r.reportName),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDraft: false
    });
    alert(`Referral Note approved and transmitted to ${targetFacility}.`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/doctor/review/${assessment.id}`)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
            title="Back to Review"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('referral.pageTitle')}
            </h1>
            <p className="text-xs text-slate-500">
              {t('referral.pageSubtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyNote}
            className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? t('referral.copiedBadge') : t('referral.copyTextBtn')}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t('referral.printBtn')}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Section 36: Professional Document-like Interface                          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-md p-6 sm:p-10 space-y-8 font-sans">
        
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-5 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-teal-800">
                {t('common.brandName')} • {t('common.tagline')}
              </div>
              <h2 className="text-2xl font-black text-slate-950 tracking-tight">
                {t('referral.clinicalReferralForm')}
              </h2>
            </div>

            {/* Status (Section 36 Spec) */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">{t('common.status')}:</span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                referralStatus === 'Approved' 
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                {referralStatus === 'Approved' ? t('referral.statusApproved') : t('referral.statusDraft')}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 flex flex-wrap gap-4 pt-1 font-mono">
            <span>Case Ref: {assessment.id}</span>
            <span>{t('clinical.currentFacility')}: {currentFacility || 'CAREQ Demo Primary Health Centre'}</span>
          </div>
        </div>

        {/* Section 1: Patient Information */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            {t('referral.secPatientInfo')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[10px]">Patient Name:</span>
              <span className="font-bold text-slate-900">{assessment.patientName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Digital ID:</span>
              <span className="font-mono font-bold text-slate-900">{assessment.patientId}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Age / Gender:</span>
              <span className="font-bold text-slate-900">{assessment.patientAge}y / {assessment.patientGender}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Attending Clinician:</span>
              <span className="font-bold text-slate-900">{currentDoctor?.name || 'Dr. Ananya Sharma'}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Presenting Concerns */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            {t('referral.secPresentingConcerns')}
          </h3>
          {isEditing ? (
            <textarea
              rows={2}
              value={presentingConcerns}
              onChange={(e) => setPresentingConcerns(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
            />
          ) : (
            <p className="text-xs text-slate-800 leading-relaxed">{presentingConcerns}</p>
          )}
        </div>

        {/* Section 3: Timeline */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            {t('referral.secTimeline')}
          </h3>
          {isEditing ? (
            <textarea
              rows={2}
              value={timelineSummary}
              onChange={(e) => setTimelineSummary(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
            />
          ) : (
            <p className="text-xs text-slate-800 leading-relaxed">{timelineSummary}</p>
          )}
        </div>

        {/* Section 4: Relevant Reports */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            {t('referral.secRelevantReports')}
          </h3>
          {isEditing ? (
            <textarea
              rows={2}
              value={relevantReports}
              onChange={(e) => setRelevantReports(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
            />
          ) : (
            <p className="text-xs text-slate-800 leading-relaxed font-mono bg-slate-50 p-2.5 rounded border border-slate-200">
              {relevantReports}
            </p>
          )}
        </div>

        {/* Section 5: Urgency Signals */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            {t('referral.secUrgencySignals')}
          </h3>
          {isEditing ? (
            <textarea
              rows={3}
              value={urgencySignals}
              onChange={(e) => setUrgencySignals(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
            />
          ) : (
            <pre className="text-xs text-slate-800 font-sans whitespace-pre-line leading-relaxed">
              {urgencySignals}
            </pre>
          )}
        </div>

        {/* Section 6: Information Missing */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            {t('referral.secInformationMissing')}
          </h3>
          {isEditing ? (
            <textarea
              rows={2}
              value={informationMissing}
              onChange={(e) => setInformationMissing(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
            />
          ) : (
            <p className="text-xs text-slate-800 leading-relaxed">{informationMissing}</p>
          )}
        </div>

        {/* Section 7: Healthcare Worker Notes */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            {t('referral.secClinicianNotes')}
          </h3>
          {isEditing ? (
            <textarea
              rows={2}
              value={healthcareWorkerNotes}
              onChange={(e) => setHealthcareWorkerNotes(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
            />
          ) : (
            <p className="text-xs text-slate-800 leading-relaxed">{healthcareWorkerNotes}</p>
          )}
        </div>

        {/* Section 8: Referral Reason */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            {t('referral.secReferralReason')}
          </h3>
          {isEditing ? (
            <textarea
              rows={3}
              value={referralReason}
              onChange={(e) => setReferralReason(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
            />
          ) : (
            <p className="text-xs text-slate-800 leading-relaxed font-semibold bg-blue-50/50 p-2.5 rounded border border-blue-200">
              {referralReason}
            </p>
          )}
        </div>

        {/* Section 9: Receiving Facility */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            {t('referral.secReceivingFacility')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {isEditing ? (
              <>
                <div>
                  <label className="text-slate-500 block text-[10px]">Target Center:</label>
                  <input
                    type="text"
                    value={targetFacility}
                    onChange={(e) => setTargetFacility(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block text-[10px]">Urgency Classification:</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                  >
                    <option value="Urgent (within 24h)">Urgent (within 24h)</option>
                    <option value="Semi-urgent (48-72h)">Semi-urgent (48-72h)</option>
                    <option value="Routine (within 7 days)">Routine (within 7 days)</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Target Institution:</span>
                  <span className="font-bold text-slate-900">{targetFacility}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Transfer Priority:</span>
                  <span className="font-bold text-red-700">{priority}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Attestation & Disclaimer */}
        <div className="pt-4 border-t-2 border-slate-200 text-[11px] text-slate-500 space-y-1">
          <p>
            <strong>{t('common.educationalDisclaimer')}:</strong> {t('clinical.clinicalOversightMandate')}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* Section 36 Bottom Actions: [Edit], [Save Draft], [Approve Referral]       */}
        {/* ========================================================================= */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-end gap-3">
          
          {isEditing ? (
            <button
              onClick={handleSaveDraft}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t('referral.saveDraftBtn')}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
              <span>{t('referral.editBtn')}</span>
            </button>
          )}

          <button
            onClick={handleSaveDraft}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-all"
          >
            {t('referral.saveDraftBtn')}
          </button>

          <button
            onClick={handleApproveReferral}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('referral.approveReferralBtn')}</span>
          </button>

        </div>

      </div>

    </div>
  );
};
