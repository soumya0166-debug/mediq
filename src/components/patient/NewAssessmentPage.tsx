import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Assessment, ExtractedReportItem } from '../../types';
import { SAMPLE_REPORTS_LIBRARY } from '../../data/mockData';
import { 
  Mic, 
  Square, 
  FileText, 
  Image as ImageIcon, 
  UploadCloud, 
  Languages, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight, 
  HelpCircle, 
  Trash2,
  FileCheck,
  Volume2
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

export const NewAssessmentPage: React.FC = () => {
  const { currentPatient, addAssessment, navigate, addAuditEvent } = useApp();

  // Mode toggles
  const [selectedLanguage, setSelectedLanguage] = useState(currentPatient?.preferredLanguage || 'Odia');
  const [detectedLanguage, setDetectedLanguage] = useState('ଓଡ଼ିଆ (Odia)');
  const [showEnglishTranslation, setShowEnglishTranslation] = useState(true);

  // Input states
  const [symptomText, setSymptomText] = useState(
    'ମୋର ଦୁଇ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଓ କାଶ ହେଉଛି। ଆଜି ସକାଳୁ ଛାତି ଟିକେ ଭାରି ଲାଗୁଛି ଏବଂ ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି।'
  );
  const [englishTranslation, setEnglishTranslation] = useState(
    'I have had severe fever and cough for 2 days. From this morning my chest feels slightly heavy and I have difficulty breathing.'
  );

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [hasVoiceInput, setHasVoiceInput] = useState(true);
  const [voiceTranscript, setVoiceTranscript] = useState(
    '[00:00 - 00:14] ମୋର ଦୁଇ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଓ କାଶ ହେଉଛି। ଆଜି ସକାଳୁ ଛାତି ଟିକେ ଭାରି ଲାଗୁଛି ଏବଂ ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି।'
  );

  // Uploaded report state
  const [selectedReportId, setSelectedReportId] = useState<string | null>('SAMPLE-CBC');
  const [uploadedReports, setUploadedReports] = useState<ExtractedReportItem[]>([
    {
      id: 'REP-CBC-NEW',
      reportName: 'Complete Blood Count (CBC) with Differential',
      reportDate: '2026-09-24',
      category: 'Hematology',
      fileName: 'blood_report.pdf',
      fileSize: '412 KB',
      ocrConfidence: 0.97,
      tests: SAMPLE_REPORTS_LIBRARY[0].tests,
      summary: 'Automated cell counter values demonstrate significant leukocytosis with elevated Neutrophils.'
    }
  ]);

  // Uploaded image state
  const [hasImage, setHasImage] = useState(false);

  // Pre-Triage Synthesis Preview State (Section 11)
  const [isPreTriageReady, setIsPreTriageReady] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Voice recording simulation handler
  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingSeconds(1);
      const interval = setInterval(() => {
        setRecordingSeconds(prev => {
          if (prev >= 6) {
            clearInterval(interval);
            setIsRecording(false);
            setHasVoiceInput(true);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setIsRecording(false);
      setHasVoiceInput(true);
    }
  };

  // Pre-load regional sample for judge quick test
  const handleSetSamplePreset = (lang: 'Odia' | 'Hindi' | 'English') => {
    if (lang === 'Odia') {
      setSelectedLanguage('Odia');
      setDetectedLanguage('ଓଡ଼ିଆ (Odia)');
      setSymptomText('ମୋର ଦୁଇ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଓ କାଶ ହେଉଛି। ଆଜି ସକାଳୁ ଛାତି ଟିକେ ଭାରି ଲାଗୁଛି ଏବଂ ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି।');
      setEnglishTranslation('I have had continuous high fever and worsening cough for 2 days. Chest tightness and breathing discomfort since this morning.');
    } else if (lang === 'Hindi') {
      setSelectedLanguage('Hindi');
      setDetectedLanguage('हिन्दी (Hindi)');
      setSymptomText('पेट के निचले दाहिने हिस्से में 6 घंटे से बहुत तेज दर्द हो रहा है। चलने या खांसने पर दर्द बहुत बढ़ जाता है।');
      setEnglishTranslation('Severe right lower quadrant abdominal pain for 6 hours. Pain severely escalates during walking or coughing.');
    } else {
      setSelectedLanguage('English');
      setDetectedLanguage('English');
      setSymptomText('Persistent high fever for 48 hours, productive cough, and mild shortness of breath upon routine exertion.');
      setEnglishTranslation('Persistent high fever for 48 hours, productive cough, and mild shortness of breath upon routine exertion.');
    }
  };

  const handleSelectSampleReport = (sampleId: string) => {
    setSelectedReportId(sampleId);
    const sample = SAMPLE_REPORTS_LIBRARY.find(s => s.id === sampleId);
    if (sample) {
      const newReport: ExtractedReportItem = {
        id: `REP-${Date.now()}`,
        reportName: sample.title,
        reportDate: sample.date,
        category: sample.badge as any,
        fileName: `${sample.badge.toLowerCase()}_report.pdf`,
        fileSize: '520 KB',
        ocrConfidence: 0.96,
        tests: sample.tests,
        summary: sample.summary
      };
      setUploadedReports([newReport]);
    }
  };

  const handlePrepareForReview = () => {
    setIsPreTriageReady(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleSubmitForReview = () => {
    setIsSubmitting(true);
    const newId = `ASM-2026-${Date.now().toString().slice(-5)}`;
    
    const newAssessment: Assessment = {
      id: newId,
      patientId: currentPatient?.id || 'PAT-2026-00124',
      patientName: currentPatient?.name || 'Riya Das',
      patientAge: currentPatient?.age || 34,
      patientGender: currentPatient?.gender || 'Female',
      patientLanguage: selectedLanguage,
      detectedLanguage: detectedLanguage,
      translatedEnglishText: englishTranslation,
      rawSymptomText: symptomText,
      voiceTranscript: hasVoiceInput ? voiceTranscript : undefined,
      hasVoice: hasVoiceInput,
      hasReport: uploadedReports.length > 0,
      hasImage: hasImage,
      imageUrls: hasImage ? ['https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=400&q=80'] : undefined,
      submittedAt: 'Just now',
      waitingMinutes: 1,
      queuePosition: 1,
      riskLevel: symptomText.includes('ନିଶ୍ୱାସ') || symptomText.includes('breathing') || symptomText.includes('दर्द') ? 'HIGH' : 'MEDIUM',
      status: 'WAITING_REVIEW',
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
          title: 'Fever began',
          description: 'Sudden onset of fever and malaise.',
          source: 'patient_voice'
        },
        {
          day: 'Day 2',
          title: 'Cough increased & breathing tightness',
          description: 'Cough aggravated, followed by chest tightness.',
          source: 'patient_text'
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
          note: 'Acoustic voice analysis detected shallow breathing cadence and vocal strain.'
        },
        {
          id: 'us-2',
          level: 'MEDIUM',
          signal: 'Persistent fever for 48 hours',
          source: 'text',
          confidence: 0.96,
          note: 'Reported continuous elevated body temperature.'
        },
        {
          id: 'us-3',
          level: 'LOW',
          signal: 'No crushing retrosternal chest pain reported',
          source: 'text',
          confidence: 0.91,
          note: 'Pain characterized as respiratory stiffness rather than cardiac radiation.'
        }
      ],
      followUpQuestions: [
        {
          id: 'fq-1',
          question: 'Are you currently experiencing difficulty breathing while resting, or only when walking?',
          rationale: 'Clarifies whether dyspnea is at rest (emergency) or on mild exertion.',
          status: 'PENDING',
          sourceSignal: 'Breathing discomfort'
        },
        {
          id: 'fq-2',
          question: 'What is your highest recorded temperature today?',
          rationale: 'Quantifies grade of pyrexia.',
          status: 'PENDING',
          sourceSignal: 'Persistent fever'
        },
        {
          id: 'fq-3',
          question: 'Do you have access to a fingertip pulse oximeter for SpO2?',
          rationale: 'Critical vital for respiratory compromise assessment.',
          status: 'PENDING',
          sourceSignal: 'Missing SpO2'
        },
        {
          id: 'fq-4',
          question: 'Do you have any existing medical conditions or take daily medications?',
          rationale: 'Screens for co-morbid risk factors.',
          status: 'PENDING',
          sourceSignal: 'Medical history'
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
        `Case ${newId} submitted for clinical review. Risk Level: ${newAssessment.riskLevel}`,
        newId
      );
      setIsSubmitting(false);
      navigate('/patient/history');
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          Multimodal Intake Assistant
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Tell us what you're experiencing
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          You can type, speak in your mother tongue, or upload clinic reports. Our system will organize your timeline for doctor review.
        </p>
      </div>

      {/* Judge Preset Quick Switcher */}
      <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-amber-900 flex items-center gap-1.5">
          <Languages className="w-4 h-4 text-amber-700" />
          Judge Demo: Load regional test scenarios:
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleSetSamplePreset('Odia')}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              selectedLanguage === 'Odia' ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-amber-100'
            }`}
          >
            ଓଡ଼ିଆ (Odia - Fever/Breathing)
          </button>
          <button
            type="button"
            onClick={() => handleSetSamplePreset('Hindi')}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              selectedLanguage === 'Hindi' ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-amber-100'
            }`}
          >
            हिन्दी (Hindi - Abdominal Pain)
          </button>
          <button
            type="button"
            onClick={() => handleSetSamplePreset('English')}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              selectedLanguage === 'English' ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-amber-100'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Main Multimodal Card (Section 9) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-6">
        
        {/* Language Selection Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase">Input Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                setDetectedLanguage(e.target.value);
              }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value="Odia">ଓଡ଼ିଆ (Odia)</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
              <option value="English">English</option>
              <option value="Bengali">বাংলা (Bengali)</option>
              <option value="Tamil">தமிழ் (Tamil)</option>
              <option value="Telugu">తెలుగు (Telugu)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 bg-teal-50 text-teal-800 rounded-lg border border-teal-200 font-semibold">
              Detected Language: {detectedLanguage}
            </span>
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Symptom Description
          </label>
          <textarea
            rows={4}
            value={symptomText}
            onChange={(e) => setSymptomText(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 transition-all leading-relaxed font-sans"
            placeholder="Example: I have had fever and cough for 2 days..."
          />
        </div>

        {/* Translation For Clinician Understanding */}
        {showEnglishTranslation && (
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-1.5 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-blue-900 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-blue-700" />
                Clinician English Translation Preview
              </span>
              <span className="text-[10px] text-blue-700 font-medium bg-blue-100 px-2 py-0.5 rounded">
                Prepared for Doctor Review
              </span>
            </div>
            <p className="text-xs text-blue-950 italic leading-relaxed">
              "{englishTranslation}"
            </p>
          </div>
        )}

        {/* Multimodal Action Bar (Voice, Report, Image) */}
        <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Voice Record Simulator Button */}
          <button
            type="button"
            onClick={handleToggleRecord}
            className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-xs ${
              isRecording
                ? 'bg-red-500 text-white border-red-600 animate-pulse'
                : hasVoiceInput
                ? 'bg-teal-50 border-teal-300 text-teal-800'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>Recording ({recordingSeconds}s)... Click Stop</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-teal-700" />
                <span>{hasVoiceInput ? '✓ Voice Clip Recorded (14s)' : '🎤 Record Voice'}</span>
              </>
            )}
          </button>

          {/* Sample Report Picker */}
          <button
            type="button"
            onClick={() => handleSelectSampleReport('SAMPLE-CBC')}
            className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-xs ${
              uploadedReports.length > 0
                ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-700" />
            <span>{uploadedReports.length > 0 ? '✓ blood_report.pdf (Attached)' : '📎 Attach Medical Report'}</span>
          </button>

          {/* Image Toggle */}
          <button
            type="button"
            onClick={() => setHasImage(!hasImage)}
            className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-xs ${
              hasImage
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-amber-700" />
            <span>{hasImage ? '✓ Clinical Photo Attached' : '📷 Add Clinical Photo'}</span>
          </button>

        </div>

        {/* Live Audio Waveform Simulation (if voice active) */}
        {hasVoiceInput && (
          <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">Patient Voice Track (Odia Acoustic Input)</span>
                <span className="text-[11px] text-slate-400">Duration: 0:14 • Confidence: 96.2%</span>
              </div>
            </div>

            {/* Simulated Animated Waveform Bars */}
            <div className="flex items-center gap-1 h-6">
              {[4, 12, 18, 24, 16, 20, 8, 22, 14, 26, 18, 10, 6].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-cyan-400 rounded-full transition-all duration-300"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Section 10: Patient Report Upload & OCR Extraction Card */}
      {uploadedReports.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Optical Character Recognition (OCR) Engine
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-teal-700" />
                Information extracted from report
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                blood_report.pdf
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                ✓ OCR Processed (97% Conf.)
              </span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Clinical Guardrail:</strong> Report values are extracted strictly as structured laboratory observations for doctor review. No automated diagnostic interpretation is made.
            </span>
          </div>

          {/* Extracted Parameters Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Test Parameter</th>
                  <th className="py-2.5 px-3">Extracted Result</th>
                  <th className="py-2.5 px-3">Reference Range</th>
                  <th className="py-2.5 px-3">Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {uploadedReports[0].tests.map((t, idx) => (
                  <tr key={idx} className={t.isAbnormal ? 'bg-amber-50/50' : ''}>
                    <td className="py-2 px-3 font-semibold text-slate-800">{t.testName}</td>
                    <td className="py-2 px-3 font-mono font-bold text-slate-900">
                      {t.result} <span className="text-slate-500 text-[10px]">{t.unit}</span>
                    </td>
                    <td className="py-2 px-3 text-slate-500">{t.referenceRange}</td>
                    <td className="py-2 px-3">
                      {t.isAbnormal ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          Outside Reference Range
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Normal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Button to Trigger Synthesis */}
      {!isPreTriageReady && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={handlePrepareForReview}
            className="px-8 py-3.5 bg-blue-900 hover:bg-blue-950 text-white rounded-2xl text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 mx-auto"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Prepare Information for Review</span>
          </button>
        </div>
      )}

      {/* Section 11: Patient Assessment Result / Pre-Triage Organization */}
      {isPreTriageReady && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-teal-600/30 space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
              Triage Note Preparation
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              Your information has been organized for healthcare-worker review
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review what our assistant extracted and what additional vitals the clinic doctor will ask for
            </p>
          </div>

          {/* Grid: Information Collected vs Information Still Needed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Information Collected */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Information Collected
              </h3>
              
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Reported Symptoms:</span>
                  <span className="font-bold text-slate-800">Fever, cough, fatigue, breathing discomfort</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Duration:</span>
                  <span className="font-semibold text-slate-800">2 days (acute worsening today)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Reported Concerns:</span>
                  <span className="font-semibold text-slate-800">Breathing discomfort while lying down</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Uploaded Reports:</span>
                  <span className="font-semibold text-slate-800">1 (Complete Blood Count PDF)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Language Processed:</span>
                  <span className="font-semibold text-slate-800">Odia → English translation ready</span>
                </div>
              </div>
            </div>

            {/* Information Still Needed */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                Information Still Needed (For Doctor)
              </h3>
              
              <ul className="space-y-2 text-xs text-amber-950">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>Temperature:</strong> Exact thermometer reading in °F or °C?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>Oxygen Saturation:</strong> Finger pulse oximeter (SpO2) if available?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>Chest Pain:</strong> Any sharp or retrosternal cardiac-type pain?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>Medical History:</strong> Any existing asthma, diabetes, or medication?</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Mandatory Critical Safety Rule Banner */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-cyan-300 font-bold">Important Safety Confirmation:</strong>
              <p className="text-slate-300 text-[11px] mt-0.5">
                This system does not declare a medical diagnosis or prescribe treatments. Your structured triage note will be sent directly to the licensed on-duty healthcare worker queue.
              </p>
            </div>
          </div>

          {/* Final Submit Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Estimated initial review time: <strong>4-8 minutes</strong> (Priority Queue)
            </div>
            <button
              type="button"
              onClick={handleSubmitForReview}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-700/20 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Synthesizing & Submitting...</span>
              ) : (
                <>
                  <span>Submit for Healthcare Worker Review</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
