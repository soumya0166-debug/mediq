import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Assessment, ExtractedReportItem } from '../../types';
import { SAMPLE_REPORTS_LIBRARY } from '../../data/mockData';
import { 
  Mic, 
  Square, 
  FileText, 
  Image as ImageIcon, 
  Languages, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  Trash2,
  FileCheck,
  Volume2,
  Check,
  Edit2,
  Eye,
  AlertCircle
} from 'lucide-react';

export const NewAssessmentPage: React.FC = () => {
  const { currentPatient, addAssessment, navigate, addAuditEvent } = useApp();

  // Workflow Step: 01 Describe -> 02 Add Reports -> 03 Review -> 04 Share (Section 19)
  const [assessmentStep, setAssessmentStep] = useState<1 | 2 | 3 | 4>(1);

  // Input states
  const [selectedLanguage, setSelectedLanguage] = useState(currentPatient?.preferredLanguage || 'Odia');
  const [symptomText, setSymptomText] = useState(
    'ମୋର ଦୁଇ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଓ କାଶ ହେଉଛି। ଆଜି ସକାଳୁ ଛାତି ଟିକେ ଭାରି ଲାଗୁଛି ଏବଂ ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି।'
  );
  const [englishTranslation, setEnglishTranslation] = useState(
    'I have had severe fever and cough for 2 days. From this morning my chest feels slightly heavy and I have difficulty breathing.'
  );

  // Voice recording state (Section 21)
  const [voiceState, setVoiceState] = useState<'idle' | 'recording' | 'captured'>('captured');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceTranscript, setVoiceTranscript] = useState(
    'ମୋର ଦୁଇ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଓ କାଶ ହେଉଛି। ଆଜି ସକାଳୁ ଛାତି ଟିକେ ଭାରି ଲାଗୁଛି ଏବଂ ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି।'
  );

  // Document upload state (Section 22)
  const [uploadedReports, setUploadedReports] = useState<ExtractedReportItem[]>([
    {
      id: 'REP-CBC-NEW',
      reportName: 'Complete Blood Count (CBC) with Differential',
      reportDate: '2026-09-24',
      category: 'Hematology',
      fileName: 'blood_report.pdf',
      fileSize: '2.4 MB',
      ocrConfidence: 0.97,
      tests: SAMPLE_REPORTS_LIBRARY[0].tests,
      summary: 'Automated cell counter values demonstrate significant leukocytosis with elevated Neutrophils.'
    }
  ]);

  const [hasImage, setHasImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCaseId, setSubmittedCaseId] = useState<string | null>(null);

  // Voice toggle handler
  const handleToggleVoice = () => {
    if (voiceState === 'idle') {
      setVoiceState('recording');
      setRecordingSeconds(1);
      const interval = setInterval(() => {
        setRecordingSeconds(prev => {
          if (prev >= 5) {
            clearInterval(interval);
            setVoiceState('captured');
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (voiceState === 'recording') {
      setVoiceState('captured');
    } else {
      setVoiceState('idle');
    }
  };

  // Quick scenario preset for evaluators
  const handleApplyPreset = (lang: 'Odia' | 'Hindi' | 'English') => {
    if (lang === 'Odia') {
      setSelectedLanguage('Odia');
      setSymptomText('ମୋର ଦୁଇ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଓ କାଶ ହେଉଛି। ଆଜି ସକାଳୁ ଛାତି ଟିକେ ଭାରି ଲାଗୁଛି ଏବଂ ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି।');
      setVoiceTranscript('ମୋର ଦୁଇ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଓ କାଶ ହେଉଛି। ଆଜି ସକାଳୁ ଛାତି ଟିକେ ଭାରି ଲାଗୁଛି ଏବଂ ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି।');
      setEnglishTranslation('I have had continuous high fever and worsening cough for 2 days. Chest tightness and breathing discomfort since this morning.');
      setVoiceState('captured');
    } else if (lang === 'Hindi') {
      setSelectedLanguage('Hindi');
      setSymptomText('पेट के निचले दाहिने हिस्से में 6 घंटे से बहुत तेज दर्द हो रहा है। चलने या खांसने पर दर्द बहुत बढ़ जाता है।');
      setVoiceTranscript('पेट के निचले दाहिने हिस्से में 6 घंटे से बहुत तेज दर्द हो रहा है। चलने या खांसने पर दर्द बहुत बढ़ जाता है।');
      setEnglishTranslation('Severe right lower quadrant abdominal pain for 6 hours. Pain severely escalates during walking or coughing.');
      setVoiceState('captured');
    } else {
      setSelectedLanguage('English');
      setSymptomText('Persistent high fever for 48 hours, productive cough, and mild shortness of breath upon routine exertion.');
      setVoiceTranscript('Persistent high fever for 48 hours, productive cough, and mild shortness of breath upon routine exertion.');
      setEnglishTranslation('Persistent high fever for 48 hours, productive cough, and mild shortness of breath upon routine exertion.');
      setVoiceState('captured');
    }
  };

  // Final submission handler
  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    const newId = `ASM-2026-${Date.now().toString().slice(-5)}`;
    
    const newAssessment: Assessment = {
      id: newId,
      patientId: currentPatient?.id || 'PAT-2026-00124',
      patientName: currentPatient?.name || 'Riya Das',
      patientAge: currentPatient?.age || 34,
      patientGender: currentPatient?.gender || 'Female',
      patientLanguage: selectedLanguage,
      detectedLanguage: selectedLanguage,
      translatedEnglishText: englishTranslation,
      rawSymptomText: symptomText,
      voiceTranscript: voiceState === 'captured' ? voiceTranscript : undefined,
      hasVoice: voiceState === 'captured',
      hasReport: uploadedReports.length > 0,
      hasImage: hasImage,
      imageUrls: hasImage ? ['https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=400&q=80'] : undefined,
      submittedAt: 'Just now',
      waitingMinutes: 1,
      queuePosition: 1,
      riskLevel: symptomText.includes('ନିଶ୍ୱାସ') || symptomText.includes('breathing') || symptomText.includes('दर्द') ? 'HIGH' : 'MEDIUM',
      status: 'WAITING_REVIEW',
      facilityId: 'FAC-DEMO-OD-001',
      structuredSymptoms: [
        'Fever for 2 days',
        'Cough for 2 days',
        'Fatigue and malaise',
        'Breathing discomfort / tightness'
      ],
      reportedDuration: '2 days',
      reportedConcerns: ['Breathing discomfort while lying down'],
      timeline: [
        {
          day: 'Day 1',
          date: '22 Sep 2026',
          title: 'Fever began',
          description: 'Sudden onset of fever and malaise.',
          source: 'patient_voice',
          actor: 'Patient'
        },
        {
          day: 'Day 2',
          date: '23 Sep 2026',
          title: 'Cough increased & breathing tightness',
          description: 'Cough aggravated, followed by chest tightness.',
          source: 'patient_text',
          actor: 'Patient'
        }
      ],
      missingInformation: [
        { id: 'mi-1', field: 'Current Temperature (°F/°C)', description: 'Exact objective reading not entered.', importance: 'HIGH' },
        { id: 'mi-2', field: 'Oxygen saturation (SpO2)', description: 'Pulse oximeter reading needed to gauge hypoxia.', importance: 'HIGH' },
        { id: 'mi-3', field: 'Presence of chest pain', description: 'Screening for acute cardiac or pleuritic pain.', importance: 'HIGH' },
        { id: 'mi-4', field: 'Pre-existing medical conditions', description: 'History of asthma, diabetes, or hypertension.', importance: 'MEDIUM' }
      ],
      urgencySignals: [
        {
          id: 'us-1',
          level: 'HIGH',
          signal: 'Reported breathing difficulty',
          source: 'voice',
          confidence: 0.94,
          note: 'Acoustic voice analysis detected shallow breathing cadence and vocal strain.',
          rawExcerpt: 'Breathing difficulty and chest tightness reported'
        },
        {
          id: 'us-2',
          level: 'MEDIUM',
          signal: 'Persistent fever for 48 hours',
          source: 'text',
          confidence: 0.96,
          note: 'Reported continuous elevated body temperature.',
          rawExcerpt: 'Fever for 2 continuous days'
        }
      ],
      sourceTraceability: [
        {
          id: 'st-new-1',
          statement: 'Fever and cough for 2 days with breathing discomfort',
          sourceType: 'voice',
          sourceLabel: 'Voice Input (Recorded Speech Audio)',
          sourceExcerpt: symptomText,
          confidenceScore: 0.96
        }
      ],
      followUpQuestions: [
        {
          id: 'fq-1',
          question: 'Are you currently experiencing difficulty breathing while resting, or only when walking?',
          rationale: 'Clarifies whether dyspnea is at rest (emergency) or on mild exertion.',
          status: 'PENDING',
          responseType: 'choice',
          sourceSignal: 'Breathing discomfort'
        },
        {
          id: 'fq-2',
          question: 'Do you have access to a fingertip pulse oximeter for SpO2?',
          rationale: 'Critical vital for respiratory compromise assessment.',
          status: 'PENDING',
          responseType: 'text',
          sourceSignal: 'Missing SpO2'
        }
      ],
      extractedReports: uploadedReports
    };

    setTimeout(() => {
      addAssessment(newAssessment);
      addAuditEvent(
        'Triage Case Submitted',
        currentPatient?.name || 'Riya Das',
        'Patient',
        `Case ${newId} submitted for clinical review. Urgency Level: ${newAssessment.riskLevel}`,
        newId
      );
      setSubmittedCaseId(newId);
      setIsSubmitting(false);
      setAssessmentStep(4);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      
      {/* Top Header */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded">
          Guided Clinical Triage Intake
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] tracking-tight">
          New Health Assessment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Share your symptoms, spoken voice, or lab reports. CAREQ structures your timeline for clinical review.
        </p>
      </div>

      {/* Guided Top Progress Bar (Section 19) */}
      <div className="bg-white p-4 rounded-careq-md border border-slate-200 shadow-careq-xs">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { num: '01', label: 'Describe' },
            { num: '02', label: 'Add Reports' },
            { num: '03', label: 'Review' },
            { num: '04', label: 'Share' },
          ].map((item, idx) => {
            const stepNum = idx + 1;
            const isActive = assessmentStep === stepNum;
            const isCompleted = assessmentStep > stepNum;

            return (
              <div key={item.num} className="space-y-1">
                <div className={`h-1 rounded-full transition-colors ${
                  isCompleted ? 'bg-teal-600' : isActive ? 'bg-[#0A1E3F]' : 'bg-slate-200'
                }`} />
                <div className="flex items-center justify-center gap-1">
                  <span className={`font-mono text-[11px] font-bold ${
                    isActive ? 'text-[#0A1E3F]' : isCompleted ? 'text-teal-700' : 'text-slate-400'
                  }`}>
                    {item.num}
                  </span>
                  <span className={`text-[11px] font-semibold hidden sm:inline ${
                    isActive ? 'text-slate-900 font-bold' : 'text-slate-500'
                  }`}>
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evaluator Quick Scenario Preset Bar */}
      <div className="bg-slate-50 p-3 rounded-careq-md border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-slate-700 flex items-center gap-1.5">
          <Languages className="w-3.5 h-3.5 text-teal-700" />
          Judge demo scenarios:
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleApplyPreset('Odia')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
              selectedLanguage === 'Odia' ? 'bg-[#0A1E3F] text-white' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            ଓଡ଼ିଆ (Odia - Fever/Dyspnea)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('Hindi')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
              selectedLanguage === 'Hindi' ? 'bg-[#0A1E3F] text-white' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            हिन्दी (Hindi - Abdominal)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('English')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
              selectedLanguage === 'English' ? 'bg-[#0A1E3F] text-white' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* STEP 01: Unified Multimodal Input Workspace (Sections 20 & 21) */}
      {assessmentStep === 1 && (
        <div className="bg-white rounded-careq-lg p-6 sm:p-8 border border-slate-200 shadow-careq-sm space-y-6">
          
          {/* Header with Compact Source Chips (Section 20) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Step 01: Describe what you are experiencing
              </h2>
              <p className="text-xs text-slate-500">
                Type your symptoms or use the microphone to speak in your regional language.
              </p>
            </div>

            {/* Compact Source Chips (Section 20) */}
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold">
              <span className={`px-2 py-0.5 rounded border ${symptomText ? 'bg-teal-50 text-teal-800 border-teal-300' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                TEXT {symptomText ? '✓' : ''}
              </span>
              <span className={`px-2 py-0.5 rounded border ${voiceState === 'captured' ? 'bg-teal-50 text-teal-800 border-teal-300' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                VOICE {voiceState === 'captured' ? '✓' : ''}
              </span>
              <span className={`px-2 py-0.5 rounded border ${uploadedReports.length > 0 ? 'bg-teal-50 text-teal-800 border-teal-300' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                REPORT {uploadedReports.length > 0 ? '✓' : ''}
              </span>
              <span className={`px-2 py-0.5 rounded border ${hasImage ? 'bg-teal-50 text-teal-800 border-teal-300' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                IMAGE {hasImage ? '✓' : ''}
              </span>
            </div>
          </div>

          {/* Voice UI with Large Circular Microphone (Section 21) */}
          <div className="p-6 rounded-careq-md bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center space-y-4">
            
            {/* Circular Mic Button */}
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-careq-xs ${
                voiceState === 'recording'
                  ? 'bg-red-600 text-white ring-4 ring-red-200 animate-pulse'
                  : voiceState === 'captured'
                  ? 'bg-teal-700 text-white ring-4 ring-teal-100'
                  : 'bg-[#0A1E3F] hover:bg-[#163B66] text-white'
              }`}
              title="Voice recording"
            >
              {voiceState === 'recording' ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-7 h-7" />}
            </button>

            {/* Voice Status Text (Section 21) */}
            <div className="space-y-0.5">
              <div className="font-bold text-sm text-slate-900">
                {voiceState === 'recording' && `Listening... (${recordingSeconds}s)`}
                {voiceState === 'captured' && 'Voice captured ✓'}
                {voiceState === 'idle' && 'Tap to speak'}
              </div>
              <p className="text-[11px] text-slate-500">
                {voiceState === 'captured' ? 'Audio stream transcribed in Odia' : 'Speak naturally in Odia, Hindi, or English'}
              </p>
            </div>

            {/* Audio Waveform visualization */}
            {voiceState === 'captured' && (
              <div className="flex items-center gap-1 h-6 pt-1">
                {[6, 14, 22, 16, 26, 18, 12, 24, 16, 8].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-teal-600 rounded-full"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Text Input Area */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Symptom Text Description
              </label>
              <span className="text-slate-400">Language: {selectedLanguage}</span>
            </div>
            <textarea
              rows={3}
              value={symptomText}
              onChange={(e) => setSymptomText(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-careq-sm text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-[#0A1E3F]"
              placeholder="Describe what you feel (e.g. fever for 2 days, difficulty breathing)..."
            />
          </div>

          {/* Section 21: Clear distinction between Original and Translated for review */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-careq-sm bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Original Input ({selectedLanguage})
              </div>
              <p className="text-slate-800 font-medium leading-relaxed">
                "{symptomText}"
              </p>
            </div>

            <div className="p-3.5 rounded-careq-sm bg-teal-50/50 border border-teal-200 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                Translated for Review (English)
              </div>
              <p className="text-teal-950 font-medium leading-relaxed italic">
                "{englishTranslation}"
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => navigate('/patient/dashboard')}
              className="text-slate-500 hover:text-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setAssessmentStep(2)}
              className="px-5 py-2.5 bg-[#0A1E3F] hover:bg-[#163B66] text-white font-bold rounded-careq-sm transition-colors flex items-center gap-1.5"
            >
              <span>Continue to Step 02: Add Reports</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 02: Document Processing UI (Section 22) */}
      {assessmentStep === 2 && (
        <div className="bg-white rounded-careq-lg p-6 sm:p-8 border border-slate-200 shadow-careq-sm space-y-6">
          
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Step 02: Add Medical Report
            </h2>
            <p className="text-xs text-slate-500">
              Upload laboratory blood tests or X-rays for automated OCR parameter extraction.
            </p>
          </div>

          {/* Document Processing Card (Section 22) */}
          <div className="p-5 rounded-careq-md bg-slate-50 border border-slate-200 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-careq-sm bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    blood_report.pdf
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    2.4 MB • Complete Blood Count
                  </div>
                </div>
              </div>

              {/* 4 Processing Checkpoints (Section 22) */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-teal-800 font-semibold">
                <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200">
                  ✓ Uploaded
                </span>
                <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200">
                  ✓ OCR processed
                </span>
                <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200">
                  ✓ Information extracted
                </span>
                <span className="flex items-center gap-1 bg-teal-100 text-teal-900 px-2 py-0.5 rounded font-bold">
                  ✓ Ready for review
                </span>
              </div>
            </div>

            {/* Extracted Fields in Structured Table (Section 22) */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Test Parameter</th>
                    <th className="py-2 px-3">Result</th>
                    <th className="py-2 px-3">Reference Range</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {uploadedReports[0].tests.map((t, idx) => (
                    <tr key={idx} className={t.isAbnormal ? 'bg-amber-50/40' : ''}>
                      <td className="py-2 px-3 font-semibold text-slate-800">{t.testName}</td>
                      <td className="py-2 px-3 font-mono font-bold text-slate-900">
                        {t.result} <span className="text-slate-400 text-[10px] font-normal">{t.unit}</span>
                      </td>
                      <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{t.referenceRange}</td>
                      <td className="py-2 px-3">
                        {t.isAbnormal ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            Attention Flag
                          </span>
                        ) : (
                          <span className="text-slate-400">Normal</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          <div className="pt-4 flex justify-between items-center border-t border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setAssessmentStep(1)}
              className="text-slate-500 hover:text-slate-800 font-semibold"
            >
              ← Back to Describe
            </button>
            <button
              type="button"
              onClick={() => setAssessmentStep(3)}
              className="px-5 py-2.5 bg-[#0A1E3F] hover:bg-[#163B66] text-white font-bold rounded-careq-sm transition-colors flex items-center gap-1.5"
            >
              <span>Continue to Step 03: Review Information</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 03: Patient Review Screen Before Submission (Section 23) */}
      {assessmentStep === 3 && (
        <div className="bg-white rounded-careq-lg p-6 sm:p-8 border border-slate-200 shadow-careq-sm space-y-6">
          
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl font-extrabold text-[#0A1E3F]">
              Review your information
            </h2>
            <p className="text-xs text-slate-500">
              Verify all extracted details before sending to the on-duty healthcare worker.
            </p>
          </div>

          {/* Section 23 Structured Cards with Edit / View / Remove */}
          <div className="space-y-4 text-xs">
            
            {/* 1. Symptoms Card */}
            <div className="p-4 rounded-careq-md border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  1. Reported Symptoms
                </span>
                <button
                  onClick={() => setAssessmentStep(1)}
                  className="text-teal-800 hover:underline font-bold flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
              </div>
              <p className="text-slate-900 font-medium">
                "{symptomText}"
              </p>
              <div className="text-[11px] text-slate-500">
                Duration: <strong>2 days</strong>
              </div>
            </div>

            {/* 2. Timeline Card */}
            <div className="p-4 rounded-careq-md border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  2. Reported Timeline
                </span>
                <span className="text-slate-400 text-[10px]">Auto-structured</span>
              </div>
              <div className="space-y-1 text-slate-700">
                <div>• Day 1: Fever began with chills</div>
                <div>• Day 2: Cough aggravated and breathing discomfort appeared</div>
              </div>
            </div>

            {/* 3. Reports Card */}
            <div className="p-4 rounded-careq-md border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  3. Diagnostic Reports Attached
                </span>
                <button
                  onClick={() => setAssessmentStep(2)}
                  className="text-teal-800 hover:underline font-bold flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> View / Change
                </button>
              </div>
              <div className="font-semibold text-slate-800">
                blood_report.pdf (CBC with Differential) — Elevated Leukocyte count extracted.
              </div>
            </div>

            {/* 4. Voice Transcript */}
            <div className="p-4 rounded-careq-md border border-slate-200 bg-slate-50/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  4. Voice Transcript
                </span>
                <span className="text-teal-800 font-mono text-[10px]">✓ Audio Attached</span>
              </div>
              <p className="text-slate-800 font-medium">
                "{voiceTranscript}"
              </p>
            </div>

            {/* 5. Translation for Clinician */}
            <div className="p-4 rounded-careq-md border border-slate-200 bg-slate-50/60 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                5. Clinical Translation Preview
              </span>
              <p className="text-slate-800 italic">
                "{englishTranslation}"
              </p>
            </div>

          </div>

          {/* Section 23 CTA */}
          <div className="pt-4 flex justify-between items-center border-t border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setAssessmentStep(2)}
              className="text-slate-500 hover:text-slate-800 font-semibold"
            >
              ← Back to Reports
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#0A1E3F] hover:bg-[#163B66] disabled:opacity-50 text-white font-bold rounded-careq-sm transition-colors shadow-careq-xs flex items-center gap-2"
            >
              {isSubmitting ? 'Securing & Dispatching...' : 'Submit for healthcare review'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 04: Submission Confirmation State (Section 24) */}
      {assessmentStep === 4 && (
        <div className="bg-white rounded-careq-lg p-6 sm:p-10 border border-slate-200 shadow-careq-sm space-y-6 text-xs animate-in zoom-in-95">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center font-bold">
              <Check className="w-6 h-6 text-emerald-700" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Your information has been securely submitted
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Case Reference: <strong className="font-mono text-slate-800">{submittedCaseId}</strong>
            </p>
          </div>

          {/* Section 24 Timeline */}
          <div className="p-5 rounded-careq-md bg-slate-50 border border-slate-200 space-y-3 max-w-lg mx-auto">
            <div className="space-y-2 font-medium text-slate-700">
              <div className="flex items-center gap-2 text-emerald-700">
                <span>✓</span> Information collected
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <span>✓</span> Consent recorded
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <span>✓</span> Information organized
              </div>
              <div className="flex items-center gap-2 text-amber-800 font-bold">
                <span>●</span> Waiting for healthcare-worker review
              </div>
            </div>
          </div>

          {/* Section 24: What happens next? */}
          <div className="p-4 rounded-careq-md bg-blue-50/50 border border-blue-200 max-w-lg mx-auto space-y-1">
            <div className="font-bold text-[#0A1E3F] text-xs">
              What happens next?
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              An authorized healthcare worker will review the information and may request additional details or prepare a clinical referral note.
            </p>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => navigate('/patient/history')}
              className="px-6 py-2.5 bg-[#0A1E3F] hover:bg-[#163B66] text-white font-bold rounded-careq-sm transition-colors shadow-careq-xs"
            >
              Track Live Status in Assessments →
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
