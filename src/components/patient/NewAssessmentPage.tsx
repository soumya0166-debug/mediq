import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
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
  Trash2,
  Volume2,
  Check,
  Edit2,
  Eye,
  AlertCircle,
  UploadCloud,
  File,
  X,
  RefreshCw,
  Clock,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export const NewAssessmentPage: React.FC = () => {
  const { currentPatient, addAssessment, navigate, addAuditEvent } = useApp();
  const { t, locale } = useLanguage();

  // Workflow Step: 01 Describe -> 02 Add Reports -> 03 Review -> 04 Share
  const [assessmentStep, setAssessmentStep] = useState<1 | 2 | 3 | 4>(1);

  // Input states
  const initialLang = locale === 'or-IN' ? 'Odia' : locale === 'hi-IN' ? 'Hindi' : locale === 'bn-IN' ? 'Bengali' : locale === 'te-IN' ? 'Telugu' : 'English';
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLang);
  const [symptomText, setSymptomText] = useState(
    initialLang === 'Odia' 
      ? 'ମୋର ଦୁଇ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଓ କାଶ ହେଉଛି। ଆଜି ସକାଳୁ ଛାତି ଟିକେ ଭାରି ଲାଗୁଛି ଏବଂ ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି।'
      : initialLang === 'Hindi'
      ? 'पेट के निचले दाहिने हिस्से में 6 घंटे से बहुत तेज दर्द हो रहा है। चलने या खांसने पर दर्द बहुत बढ़ जाता है।'
      : initialLang === 'Bengali'
      ? 'আমার দুই দিন ধরে তীব্র জ্বর ও কাশি হচ্ছে। আজ সকাল থেকে বুকে চাপ এবং শ্বাসকষ্ট অনুভব করছি।'
      : initialLang === 'Telugu'
      ? 'నాకు రెండు రోజులుగా తీవ్రమైన జ్వరం మరియు దగ్గు ఉంది. ఈ ఉదయం నుండి ఛాతీలో బిగుతుగా మరియు శ్వాస తీసుకోవడంలో ఇబ్బందిగా ఉంది.'
      : 'I have had severe fever and cough for 2 days. From this morning my chest feels slightly heavy and I have difficulty breathing.'
  );
  const [englishTranslation, setEnglishTranslation] = useState(
    'I have had severe fever and cough for 2 days. From this morning my chest feels slightly heavy and I have difficulty breathing.'
  );

  // Sync when global locale changes
  useEffect(() => {
    if (locale === 'or-IN') {
      handleApplyPreset('Odia');
    } else if (locale === 'hi-IN') {
      handleApplyPreset('Hindi');
    } else if (locale === 'bn-IN') {
      handleApplyPreset('Bengali');
    } else if (locale === 'te-IN') {
      handleApplyPreset('Telugu');
    } else {
      handleApplyPreset('English');
    }
  }, [locale]);

  // Voice recording state
  const [voiceState, setVoiceState] = useState<'idle' | 'recording' | 'captured'>('captured');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceTranscript, setVoiceTranscript] = useState(
    'ମୋର ଦୁଇ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଓ କାଶ ହେଉଛି। ଆଜି ସକାଳୁ ଛାତି ଟିକେ ଭାରି ଲାଗୁଛି ଏବଂ ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି।'
  );

  // Document upload state (Multi-format: PDF, JPG, PNG, WEBP)
  const [uploadedReports, setUploadedReports] = useState<ExtractedReportItem[]>([
    {
      id: 'REP-CBC-NEW',
      reportName: 'Complete Blood Count (CBC) with Differential',
      reportDate: '2026-09-24',
      category: 'Hematology',
      fileName: 'blood_report.pdf',
      fileSize: '2.4 MB',
      ocrConfidence: 0.98,
      tests: SAMPLE_REPORTS_LIBRARY[0].tests,
      summary: 'Automated cell counter values demonstrate significant leukocytosis with elevated Neutrophils.'
    }
  ]);

  // Format filter tab
  const [activeUploadFormat, setActiveUploadFormat] = useState<'all' | 'pdf' | 'jpg' | 'png'>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const handleApplyPreset = (lang: string) => {
    setSelectedLanguage(lang);
    if (lang === 'Odia') {
      setSymptomText('ମୋର ଦୁଇ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଓ କାଶ ହେଉଛି। ଆଜି ସକାଳୁ ଛାତି ଟିକେ ଭାରି ଲାଗୁଛି ଏବଂ ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି।');
      setVoiceTranscript('ମୋର ଦୁଇ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଓ କାଶ ହେଉଛି। ଆଜି ସକାଳୁ ଛାତି ଟିକେ ଭାରି ଲାଗୁଛି ଏବଂ ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି।');
      setEnglishTranslation('Continuous high fever and worsening cough for 2 days. Chest tightness and breathing discomfort since this morning.');
      setVoiceState('captured');
    } else if (lang === 'Hindi') {
      setSymptomText('पेट के निचले दाहिने हिस्से में 6 घंटे से बहुत तेज दर्द हो रहा है। चलने या खांसने पर दर्द बहुत बढ़ जाता है।');
      setVoiceTranscript('पेट के निचले दाहिने हिस्से में 6 घंटे से बहुत तेज दर्द हो रहा है। चलने या खांसने पर दर्द बहुत बढ़ जाता है।');
      setEnglishTranslation('Severe right lower quadrant abdominal pain for 6 hours. Pain severely escalates during walking or coughing.');
      setVoiceState('captured');
    } else if (lang === 'Bengali') {
      setSymptomText('আমার দুই দিন ধরে তীব্র জ্বর ও কাশি হচ্ছে। আজ সকাল থেকে বুকে চাপ এবং শ্বাসকষ্ট অনুভব করছি।');
      setVoiceTranscript('আমার দুই দিন ধরে তীব্র জ্বর ও কাশি হচ্ছে। আজ সকাল থেকে বুকে চাপ এবং শ্বাসকষ্ট অনুভব করছি।');
      setEnglishTranslation('High fever and cough for 2 days with progressive dyspnea and retrosternal heaviness.');
      setVoiceState('captured');
    } else if (lang === 'Telugu') {
      setSymptomText('నాకు రెండు రోజులుగా తీవ్రమైన జ్వరం మరియు దగ్గు ఉంది. ఈ ఉదయం నుండి ఛాతీలో బిగుతుగా మరియు శ్వాస తీసుకోవడంలో ఇబ్బందిగా ఉంది.');
      setVoiceTranscript('నాకు రెండు రోజులుగా తీవ్రమైన జ్వరం మరియు దగ్గు ఉంది. ఈ ఉదయం నుండి ఛాతీలో బిగుతుగా మరియు శ్వాస తీసుకోవడంలో ఇబ్బందిగా ఉంది.');
      setEnglishTranslation('High fever and persistent cough for 48 hours accompanied by acute chest heaviness.');
      setVoiceState('captured');
    } else {
      setSymptomText('Persistent high fever for 48 hours, productive cough, and mild shortness of breath upon routine exertion.');
      setVoiceTranscript('Persistent high fever for 48 hours, productive cough, and mild shortness of breath upon routine exertion.');
      setEnglishTranslation('Persistent high fever for 48 hours, productive cough, and mild shortness of breath upon routine exertion.');
      setVoiceState('captured');
    }
  };

  // Multi-format File Handling (PDF, JPG, PNG, WEBP)
  const handleFiles = (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Determine type
    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type.includes('pdf');
    const isImage = file.type.includes('image') || file.name.toLowerCase().match(/\.(jpg|jpeg|png|webp)$/i);

    if (isImage) setHasImage(true);

    // Trigger OCR progress animation
    setOcrProcessing(true);
    setOcrProgress(15);

    setTimeout(() => setOcrProgress(45), 250);
    setTimeout(() => setOcrProgress(80), 550);
    setTimeout(() => {
      setOcrProgress(100);

      // Create new extracted report based on file extension
      const ext = file.name.split('.').pop()?.toUpperCase() || 'DOC';
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

      const newReport: ExtractedReportItem = {
        id: `REP-${Date.now().toString().slice(-4)}`,
        reportName: file.name.replace(/\.[^/.]+$/, ""),
        reportDate: new Date().toISOString().split('T')[0],
        category: isPdf ? 'Hematology' : 'Biochemistry',
        fileName: file.name,
        fileSize: sizeStr,
        ocrConfidence: 0.98,
        tests: isPdf 
          ? SAMPLE_REPORTS_LIBRARY[0].tests 
          : [
              { testName: 'WBC Total Count', result: '14,200', unit: '/mcL', referenceRange: '4,000 - 11,000', isAbnormal: true },
              { testName: 'Hemoglobin (Hb)', result: '11.8', unit: 'g/dL', referenceRange: '12.0 - 15.5', isAbnormal: true },
              { testName: 'C-Reactive Protein (CRP)', result: '18.4', unit: 'mg/L', referenceRange: '< 5.0', isAbnormal: true },
              { testName: 'Platelet Count', result: '210,000', unit: '/mcL', referenceRange: '150,000 - 450,000', isAbnormal: false }
            ],
        summary: `Automated ${ext} OCR extraction identified 4 clinical parameters with 98% text alignment.`
      };

      setUploadedReports(prev => [newReport, ...prev]);
      setOcrProcessing(false);
    }, 850);
  };

  // Preset sample loader
  const handleLoadSample = (sampleType: 'cbc_pdf' | 'rx_jpg' | 'lipid_png') => {
    setOcrProcessing(true);
    setOcrProgress(20);
    setTimeout(() => setOcrProgress(60), 200);
    setTimeout(() => {
      setOcrProgress(100);

      if (sampleType === 'cbc_pdf') {
        const item: ExtractedReportItem = {
          id: `REP-CBC-${Date.now().toString().slice(-3)}`,
          reportName: 'Automated CBC Blood Panel',
          reportDate: '2026-09-24',
          category: 'Hematology',
          fileName: 'cbc_blood_test.pdf',
          fileSize: '2.1 MB',
          ocrConfidence: 0.99,
          tests: SAMPLE_REPORTS_LIBRARY[0].tests,
          summary: 'Automated cell counter values demonstrate leukocytosis (14,200 /mcL).'
        };
        setUploadedReports(prev => [item, ...prev]);
      } else if (sampleType === 'rx_jpg') {
        setHasImage(true);
        const item: ExtractedReportItem = {
          id: `REP-RX-${Date.now().toString().slice(-3)}`,
          reportName: 'Primary Care Doctor Prescription',
          reportDate: '2026-09-23',
          category: 'Biochemistry',
          fileName: 'rx_slip_scan.jpg',
          fileSize: '1.4 MB',
          ocrConfidence: 0.96,
          tests: [
            { testName: 'Amoxicillin 500mg', result: 'TID x 5 days', unit: 'oral', referenceRange: 'Standard', isAbnormal: false },
            { testName: 'Paracetamol 650mg', result: 'SOS for Fever', unit: 'oral', referenceRange: 'Max 3g/day', isAbnormal: false },
            { testName: 'Blood Pressure Note', result: '138/88', unit: 'mmHg', referenceRange: '< 120/80', isAbnormal: true }
          ],
          summary: 'Handwritten prescription OCR identified 2 medications and pre-hypertensive vital note.'
        };
        setUploadedReports(prev => [item, ...prev]);
      } else {
        setHasImage(true);
        const item: ExtractedReportItem = {
          id: `REP-LIP-${Date.now().toString().slice(-3)}`,
          reportName: 'Fast Lipid Profile Panel',
          reportDate: '2026-09-22',
          category: 'Biochemistry',
          fileName: 'lipid_profile_scan.png',
          fileSize: '1.8 MB',
          ocrConfidence: 0.98,
          tests: [
            { testName: 'Total Cholesterol', result: '224', unit: 'mg/dL', referenceRange: '< 200', isAbnormal: true },
            { testName: 'HDL Cholesterol', result: '42', unit: 'mg/dL', referenceRange: '> 50', isAbnormal: true },
            { testName: 'LDL Cholesterol', result: '148', unit: 'mg/dL', referenceRange: '< 100', isAbnormal: true },
            { testName: 'Triglycerides', result: '170', unit: 'mg/dL', referenceRange: '< 150', isAbnormal: true }
          ],
          summary: 'OCR extraction verified hyperlipidemia panel with elevated LDL.'
        };
        setUploadedReports(prev => [item, ...prev]);
      }

      setOcrProcessing(false);
    }, 450);
  };

  const handleRemoveReport = (id: string) => {
    setUploadedReports(prev => prev.filter(r => r.id !== id));
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
      riskLevel: symptomText.includes('ନିଶ୍ୱାସ') || symptomText.includes('breathing') || symptomText.includes('दर्द') || symptomText.includes('শ্বাসকষ্ট') ? 'HIGH' : 'MEDIUM',
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
        { id: 'mi-3', field: 'Presence of chest pain', description: 'Screening for acute cardiac or pleuritic pain.', importance: 'HIGH' }
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
          {t('assessment.pageBadge', 'Guided Clinical Triage Intake')}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] tracking-tight">
          {t('assessment.pageTitle', 'New Health Assessment')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {t('assessment.pageSubtitle', 'Share your symptoms, spoken voice, or lab reports. CAREQ structures your timeline for clinical review.')}
        </p>
      </div>

      {/* Guided Top Progress Bar */}
      <div className="bg-white p-4 rounded-careq-md border border-slate-200 shadow-careq-xs">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { num: '01', label: t('assessment.stepDescribe', 'Describe') },
            { num: '02', label: t('assessment.stepAddReports', 'Add Reports') },
            { num: '03', label: t('assessment.stepReview', 'Review') },
            { num: '04', label: t('assessment.stepShare', 'Share') },
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
          {t('assessment.evaluatorScenarios', 'Judge demo scenarios:')}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {[
            { key: 'Odia', label: 'ଓଡ଼ିଆ (Odia)' },
            { key: 'Hindi', label: 'हिन्दी (Hindi)' },
            { key: 'Bengali', label: 'বাংলা (Bengali)' },
            { key: 'Telugu', label: 'తెలుగు (Telugu)' },
            { key: 'English', label: 'English' }
          ].map(p => (
            <button
              key={p.key}
              type="button"
              onClick={() => handleApplyPreset(p.key)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                selectedLanguage === p.key ? 'bg-[#0A1E3F] text-white shadow-2xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 01: Unified Multimodal Input Workspace */}
      {assessmentStep === 1 && (
        <div className="bg-white rounded-careq-lg p-6 sm:p-8 border border-slate-200 shadow-careq-sm space-y-6">
          
          {/* Header with Compact Source Chips */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t('assessment.step1Title', 'Step 01: Describe what you are experiencing')}
              </h2>
              <p className="text-xs text-slate-500">
                {t('assessment.step1Subtitle', 'Type your symptoms or use the microphone to speak in your regional language.')}
              </p>
            </div>

            {/* Compact Source Chips */}
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold">
              <span className={`px-2 py-0.5 rounded border ${symptomText ? 'bg-teal-50 text-teal-800 border-teal-300' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                {t('assessment.sourceChipText', 'TEXT')} {symptomText ? '✓' : ''}
              </span>
              <span className={`px-2 py-0.5 rounded border ${voiceState === 'captured' ? 'bg-teal-50 text-teal-800 border-teal-300' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                {t('assessment.sourceChipVoice', 'VOICE')} {voiceState === 'captured' ? '✓' : ''}
              </span>
              <span className={`px-2 py-0.5 rounded border ${uploadedReports.length > 0 ? 'bg-teal-50 text-teal-800 border-teal-300' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                {t('assessment.sourceChipReport', 'REPORT')} {uploadedReports.length > 0 ? '✓' : ''}
              </span>
              <span className={`px-2 py-0.5 rounded border ${hasImage ? 'bg-teal-50 text-teal-800 border-teal-300' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                {t('assessment.sourceChipImage', 'IMAGE')} {hasImage ? '✓' : ''}
              </span>
            </div>
          </div>

          {/* Voice UI with Large Circular Microphone */}
          <div className="p-6 rounded-careq-md bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center space-y-4">
            
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs bg-white px-3 py-1.5 rounded-full border border-slate-200">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <Mic className="w-3.5 h-3.5 text-teal-700" />
                <span>{t('assessment.speakIn', 'Speak in:')}</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {['English', 'Hindi', 'Odia', 'Bengali', 'Telugu'].map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleApplyPreset(lang)}
                    className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                      selectedLanguage === lang ? 'bg-[#0A1E3F] text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {lang === 'Odia' ? 'ଓଡ଼ିଆ' : lang === 'Hindi' ? 'हिन्दी' : lang === 'Bengali' ? 'বাংলা' : lang === 'Telugu' ? 'తెలుగు' : 'English'}
                  </button>
                ))}
              </div>
            </div>

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

            {/* Voice Status Text */}
            <div className="space-y-0.5">
              <div className="font-bold text-sm text-slate-900">
                {voiceState === 'recording' && `${t('assessment.recordingInProgress', 'Recording in progress...')} (${recordingSeconds}s)`}
                {voiceState === 'captured' && (
                  <span className="text-teal-800 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>{t('assessment.voiceNoteCaptured', 'Voice Note Captured')}</span>
                  </span>
                )}
                {voiceState === 'idle' && t('assessment.clickToRecord', 'Click to Start Recording')}
              </div>
              <p className="text-[11px] text-slate-500">
                {voiceState === 'captured' 
                  ? t('assessment.recordedAudioReady', 'Audio recording ready for automated clinical transcription')
                  : t('assessment.voiceRecordingDesc', 'Speak naturally in your native language about your fever, pain, or discomfort.')}
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

            {/* Voice Actions */}
            {voiceState === 'captured' && (
              <div className="flex items-center gap-2 pt-1 text-xs">
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 font-semibold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3 text-teal-700" />
                  <span>{t('assessment.reRecord', 'Record Again')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVoiceState('idle');
                    setVoiceTranscript('');
                  }}
                  className="px-3 py-1 bg-white hover:bg-red-50 border border-red-200 rounded text-red-700 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3 text-red-600" />
                  <span>{t('assessment.clearAudio', 'Clear Audio')}</span>
                </button>
              </div>
            )}

          </div>

          {/* Symptom Input Textarea */}
          <div className="space-y-2">
            <label htmlFor="symptom-textarea" className="block text-xs font-bold text-slate-700">
              {t('assessment.symptomTextLabel', 'Detailed Symptom Description (or edit transcription)')}
            </label>
            <textarea
              id="symptom-textarea"
              rows={4}
              value={symptomText}
              onChange={(e) => {
                setSymptomText(e.target.value);
                setEnglishTranslation(e.target.value);
              }}
              placeholder={t('assessment.symptomPlaceholder', 'Describe how you feel, when symptoms started, body temperature, pain location, and any medications taken...')}
              className="w-full p-3.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-careq-sm focus:ring-2 focus:ring-[#0A1E3F] focus:border-[#0A1E3F] outline-none font-sans"
            />
          </div>

          {/* Live Translation Notice */}
          <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-careq-sm text-xs text-teal-900 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-teal-800">
              <Languages className="w-3.5 h-3.5 text-teal-700" />
              {t('assessment.englishTranslationNotice', 'Automated Clinical English Translation (for healthcare team):')}
            </span>
            <p className="italic text-slate-700 bg-white/70 p-2 rounded border border-teal-100">
              "{englishTranslation}"
            </p>
          </div>

          {/* Navigation CTA */}
          <div className="pt-4 flex justify-between items-center border-t border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => navigate('/patient/dashboard')}
              className="text-slate-500 hover:text-slate-800 font-semibold"
            >
              ← {t('assessment.previous', 'Back')}
            </button>
            <button
              type="button"
              onClick={() => setAssessmentStep(2)}
              className="px-5 py-2.5 bg-[#0A1E3F] hover:bg-[#163B66] text-white font-bold rounded-careq-sm transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <span>{t('assessment.continue', 'Continue')}: {t('assessment.stepAddReports', 'Add Reports')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 02: Multi-Format OCR Upload Workspace (PDF, JPG, PNG, WEBP) */}
      {assessmentStep === 2 && (
        <div className="bg-white rounded-careq-lg p-6 sm:p-8 border border-slate-200 shadow-careq-sm space-y-6">
          
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              {t('assessment.step2Title', 'Step 02: Upload Diagnostic Reports & Prescriptions')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('assessment.step2Subtitle', 'Upload laboratory blood tests, prescriptions, or X-rays for automated OCR parameter extraction.')}
            </p>
          </div>

          {/* Format Filter Selection Tabs */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-700">Supported Formats:</span>
            {[
              { id: 'all', label: t('assessment.uploadFormatAll', 'All Formats') },
              { id: 'pdf', label: t('assessment.uploadFormatPdf', 'PDF Document (.pdf)') },
              { id: 'jpg', label: t('assessment.uploadFormatJpg', 'JPG Photo (.jpg)') },
              { id: 'png', label: t('assessment.uploadFormatPng', 'PNG Scan (.png)') },
            ].map(fmt => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setActiveUploadFormat(fmt.id as any)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                  activeUploadFormat === fmt.id
                    ? 'bg-[#0A1E3F] text-white border-[#0A1E3F] shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>

          {/* Interactive Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer p-8 rounded-careq-md border-2 border-dashed transition-all flex flex-col items-center justify-center text-center space-y-3 ${
              isDragging
                ? 'border-teal-500 bg-teal-50/60 ring-4 ring-teal-100'
                : 'border-slate-300 hover:border-teal-600 bg-slate-50/80 hover:bg-slate-50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files);
              }}
              accept=".pdf,.jpg,.jpeg,.png,.webp,image/*,application/pdf"
              className="hidden"
              multiple
            />

            <div className="w-14 h-14 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-sm">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <p className="font-bold text-sm text-slate-800">
                {t('assessment.dragDropText', 'Drag & drop your medical document here, or')}{' '}
                <span className="text-teal-700 underline font-black">{t('assessment.browseFiles', 'Browse Files')}</span>
              </p>
              <p className="text-xs text-slate-500">
                {t('assessment.supportedFormatsNotice', 'Supported formats: PDF, JPG, JPEG, PNG, WEBP (Max 15MB). Automated OCR parameter extraction.')}
              </p>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-600 pt-1">
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">📄 .PDF</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">🖼️ .JPG / .JPEG</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">📊 .PNG</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">📱 Mobile Scan</span>
            </div>
          </div>

          {/* Quick Demo Templates */}
          <div className="p-3.5 bg-slate-50 rounded-careq-md border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {t('assessment.sampleTemplates', 'Sample demo reports:')}
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleLoadSample('cbc_pdf')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded font-bold text-slate-800 transition-colors flex items-center gap-1 text-[11px]"
              >
                <FileText className="w-3 h-3 text-red-600" />
                <span>{t('assessment.sampleCbcPdf', 'Sample CBC Blood Test (PDF)')}</span>
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('rx_jpg')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded font-bold text-slate-800 transition-colors flex items-center gap-1 text-[11px]"
              >
                <ImageIcon className="w-3 h-3 text-blue-600" />
                <span>{t('assessment.samplePrescriptionJpg', 'Sample Prescription Slip (JPG)')}</span>
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('lipid_png')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded font-bold text-slate-800 transition-colors flex items-center gap-1 text-[11px]"
              >
                <File className="w-3 h-3 text-emerald-600" />
                <span>{t('assessment.sampleLipidPng', 'Sample Lipid Profile (PNG)')}</span>
              </button>
            </div>
          </div>

          {/* OCR Processing Progress Indicator */}
          {ocrProcessing && (
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-careq-md space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-teal-900">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-teal-700" />
                  Running Neural OCR Parameter Extraction...
                </span>
                <span className="font-mono">{ocrProgress}%</span>
              </div>
              <div className="w-full bg-teal-200/60 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-teal-700 h-full transition-all duration-300 ease-out" 
                  style={{ width: `${ocrProgress}%` }} 
                />
              </div>
            </div>
          )}

          {/* List of Uploaded & Extracted Reports */}
          {uploadedReports.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Attached Reports ({uploadedReports.length})
                </h3>
                <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  OCR Verified
                </span>
              </div>

              {uploadedReports.map((report) => (
                <div key={report.id} className="p-5 rounded-careq-md bg-slate-50 border border-slate-200 space-y-4">
                  
                  {/* File Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-careq-sm bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 flex-shrink-0">
                        {report.fileName.toLowerCase().endsWith('.pdf') ? (
                          <FileText className="w-5 h-5 text-red-600" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <span>{report.fileName}</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-white border border-slate-200 text-slate-600">
                            {report.fileName.split('.').pop()?.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {report.fileSize} • {report.reportName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Checkpoints */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-teal-800 font-semibold">
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                          ✓ {t('assessment.uploadedBadge', 'Uploaded')}
                        </span>
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                          ✓ {t('assessment.ocrProcessedBadge', 'OCR processed')}
                        </span>
                        <span className="bg-teal-100 text-teal-900 px-2 py-0.5 rounded font-bold">
                          ✓ {t('assessment.readyBadge', 'Ready for review')}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveReport(report.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title={t('assessment.removeFile', 'Remove')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Extracted Parameters Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3">{t('assessment.tableColParameter', 'Test Parameter')}</th>
                          <th className="py-2 px-3">{t('assessment.tableColResult', 'Result')}</th>
                          <th className="py-2 px-3">{t('assessment.tableColRange', 'Reference Range')}</th>
                          <th className="py-2 px-3">{t('assessment.tableColStatus', 'Status')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {report.tests.map((tItem, idx) => (
                          <tr key={idx} className={tItem.isAbnormal ? 'bg-amber-50/40' : ''}>
                            <td className="py-2 px-3 font-semibold text-slate-800">{tItem.testName}</td>
                            <td className="py-2 px-3 font-mono font-bold text-slate-900">
                              {tItem.result} <span className="text-slate-400 text-[10px] font-normal">{tItem.unit}</span>
                            </td>
                            <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{tItem.referenceRange}</td>
                            <td className="py-2 px-3">
                              {tItem.isAbnormal ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                  {t('assessment.statusAttention', 'Attention Flag')}
                                </span>
                              ) : (
                                <span className="text-slate-400">
                                  {t('assessment.statusNormal', 'Normal')}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Navigation CTA */}
          <div className="pt-4 flex justify-between items-center border-t border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setAssessmentStep(1)}
              className="text-slate-500 hover:text-slate-800 font-semibold"
            >
              ← {t('assessment.previous', 'Back')}
            </button>
            <button
              type="button"
              onClick={() => setAssessmentStep(3)}
              className="px-5 py-2.5 bg-[#0A1E3F] hover:bg-[#163B66] text-white font-bold rounded-careq-sm transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <span>{t('assessment.continue', 'Continue')}: {t('assessment.stepReview', 'Review')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 03: Patient Review Screen Before Submission */}
      {assessmentStep === 3 && (
        <div className="bg-white rounded-careq-lg p-6 sm:p-8 border border-slate-200 shadow-careq-sm space-y-6">
          
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl font-extrabold text-[#0A1E3F]">
              {t('assessment.step3Title', 'Step 03: Review Before Clinical Submission')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('assessment.step3Subtitle', 'Please review the summary below before sending to the healthcare review team.')}
            </p>
          </div>

          <div className="space-y-4 text-xs">
            
            {/* 1. Symptoms Card */}
            <div className="p-4 rounded-careq-md border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  1. {t('assessment.symptomsSummaryTitle', 'Reported Symptoms')}
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
                {t('assessment.duration', 'Duration')}: <strong>2 days</strong>
              </div>
            </div>

            {/* 2. Voice Transcript */}
            <div className="p-4 rounded-careq-md border border-slate-200 bg-slate-50/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  2. {t('assessment.voiceSummaryTitle', 'Voice Recording & Transcript')}
                </span>
                <span className="text-teal-800 font-mono text-[10px]">✓ Audio Attached</span>
              </div>
              <p className="text-slate-800 font-medium">
                "{voiceTranscript}"
              </p>
            </div>

            {/* 3. Reports Card */}
            <div className="p-4 rounded-careq-md border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  3. {t('assessment.reportsSummaryTitle', 'Extracted Reports & Lab Findings')} ({uploadedReports.length})
                </span>
                <button
                  onClick={() => setAssessmentStep(2)}
                  className="text-teal-800 hover:underline font-bold flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> View / Change
                </button>
              </div>
              <div className="space-y-1.5">
                {uploadedReports.map(r => (
                  <div key={r.id} className="font-semibold text-slate-800 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-teal-700 flex-shrink-0" />
                    <span>{r.fileName} ({r.reportName}) — {r.tests.length} parameters extracted</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Translation for Clinician */}
            <div className="p-4 rounded-careq-md border border-slate-200 bg-slate-50/60 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                4. {t('assessment.englishTranslationNotice', 'Automated Clinical English Translation (for healthcare team):')}
              </span>
              <p className="text-slate-800 italic">
                "{englishTranslation}"
              </p>
            </div>

            {/* Legal / Consent Notice */}
            <div className="p-3 rounded bg-amber-50/70 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
              <p>
                {t('assessment.confirmationNotice', 'By submitting, you consent to sharing this triage summary with the on-duty healthcare professional under Section 24 of the CareQ Clinical Protocol.')}
              </p>
            </div>

          </div>

          {/* Submission CTA */}
          <div className="pt-4 flex justify-between items-center border-t border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setAssessmentStep(2)}
              className="text-slate-500 hover:text-slate-800 font-semibold"
            >
              ← {t('assessment.previous', 'Back')}
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#0A1E3F] hover:bg-[#163B66] disabled:opacity-50 text-white font-bold rounded-careq-sm transition-colors shadow-careq-xs flex items-center gap-2"
            >
              {isSubmitting ? t('assessment.submitting', 'Submitting Assessment...') : t('assessment.submit', 'Submit for Review')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 04: Submission Confirmation State */}
      {assessmentStep === 4 && (
        <div className="bg-white rounded-careq-lg p-6 sm:p-10 border border-slate-200 shadow-careq-sm space-y-6 text-xs animate-in zoom-in-95">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center font-bold shadow-sm">
              <Check className="w-6 h-6 text-emerald-700" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {t('assessment.step4Title', 'Assessment Submitted Successfully')}
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">
              {t('assessment.caseIdLabel', 'Tracking ID')}: <strong className="font-mono text-slate-800">{submittedCaseId}</strong>
            </p>
          </div>

          {/* Status Timeline */}
          <div className="p-5 rounded-careq-md bg-slate-50 border border-slate-200 space-y-3 max-w-lg mx-auto">
            <div className="space-y-2 font-medium text-slate-700">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('patient.dashboard.stepSubmitted', 'Information submitted')}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('patient.dashboard.stepConsent', 'Consent recorded')}</span>
              </div>
              <div className="flex items-center gap-2 text-amber-800 font-bold">
                <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                <span>{t('assessment.statusUnderReview', 'Under Review by Healthcare Worker')}</span>
              </div>
            </div>
          </div>

          {/* Next Steps Guidance */}
          <div className="p-4 rounded-careq-md bg-blue-50/50 border border-blue-200 max-w-lg mx-auto space-y-2">
            <div className="font-bold text-[#0A1E3F] text-xs">
              {t('assessment.nextStepsTitle', 'Next Steps:')}
            </div>
            <ul className="text-slate-600 text-[11px] leading-relaxed space-y-1 list-disc list-inside">
              <li>{t('assessment.nextStep1', 'A registered healthcare worker at your primary health centre will review your symptoms.')}</li>
              <li>{t('assessment.nextStep2', 'If follow-up clarification is needed, you will receive a notification in your patient dashboard.')}</li>
              <li className="text-amber-800 font-semibold">{t('assessment.nextStep3', 'Emergency Warning: If you experience chest pain, severe shortness of breath, or loss of consciousness, seek immediate emergency care.')}</li>
            </ul>
          </div>

          <div className="text-center pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => navigate('/patient/dashboard')}
              className="px-6 py-2.5 bg-[#0A1E3F] hover:bg-[#163B66] text-white font-bold rounded-careq-sm transition-colors shadow-careq-xs"
            >
              {t('assessment.returnToDashboard', 'Return to Patient Dashboard')}
            </button>
            <button
              onClick={() => navigate('/patient/history')}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-careq-sm transition-colors border border-slate-300"
            >
              {t('patient.myAssessments', 'My Health Assessments')} →
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
