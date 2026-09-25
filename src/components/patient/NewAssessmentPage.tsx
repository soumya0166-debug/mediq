import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Assessment, ExtractedReportItem, FirstReportData, ExtractedInformationData, SourceTraceItem } from '../../types';
import { SAMPLE_REPORTS_LIBRARY } from '../../data/mockData';
import { voiceService, LanguageDetectionResult } from '../../services/voiceService';
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
  AlertCircle,
  UploadCloud,
  File,
  RefreshCw,
  Clock,
  ShieldCheck,
  Play,
  Pause,
  AlertTriangle,
  HelpCircle,
  FileCheck
} from 'lucide-react';

export const NewAssessmentPage: React.FC = () => {
  const { currentPatient, addAssessment, navigate, addAuditEvent } = useApp();
  const { t, locale } = useLanguage();

  // Workflow Step: 01 Describe -> 02 Add Reports -> 03 Review -> 04 Share
  const [assessmentStep, setAssessmentStep] = useState<1 | 2 | 3 | 4>(1);

  // Spoken Language / Detection State
  const initialLang = locale === 'or-IN' ? 'Odia' : locale === 'hi-IN' ? 'Hindi' : locale === 'bn-IN' ? 'Bengali' : locale === 'te-IN' ? 'Telugu' : 'English';
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLang);
  const [detectedLanguageData, setDetectedLanguageData] = useState<LanguageDetectionResult>({
    locale: locale === 'or-IN' ? 'or-IN' : locale === 'hi-IN' ? 'hi-IN' : 'en-IN',
    languageName: locale === 'or-IN' ? 'Odia' : locale === 'hi-IN' ? 'Hindi' : 'English',
    nativeName: locale === 'or-IN' ? 'ଓଡ଼ିଆ' : locale === 'hi-IN' ? 'हिन्दी' : 'English',
    confidence: 0.96,
    isAmbiguous: false
  });

  // Text inputs
  const [symptomText, setSymptomText] = useState(
    initialLang === 'Odia' 
      ? 'ମୋର ଦୁଇ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଓ କାଶ ହେଉଛି। ଆଜି ସକାଳୁ ଛାତି ଟିକେ ଭାରି ଲାଗୁଛି ଏବଂ ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି।'
      : initialLang === 'Hindi'
      ? 'पेट के निचले दाहिने हिस्से में 6 घंटे से बहुत तेज दर्द हो रहा है। चलने या खांसने पर दर्द बहुत बढ़ जाता है।'
      : 'I have had continuous high fever and cough for two days. From this morning my chest feels slightly heavy and I have difficulty breathing.'
  );
  const [englishTranslation, setEnglishTranslation] = useState(
    'I have had continuous high fever and cough for two days. From this morning my chest feels slightly heavy and I have difficulty breathing.'
  );
  const [voiceTranscript, setVoiceTranscript] = useState(
    'ମୋର ଦୁଇ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଓ କାଶ ହେଉଛି। ଆଜି ସକାଳୁ ଛାତି ଟିକେ ଭାରି ଲାଗୁଛି ଏବଂ ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି।'
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

  // Real Microphone Capture State
  const [voiceState, setVoiceState] = useState<'idle' | 'requesting' | 'recording' | 'processing' | 'captured' | 'error'>('captured');
  const [voiceProcessingStep, setVoiceProcessingStep] = useState<string>('');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [audioDurationSeconds, setAudioDurationSeconds] = useState<number>(14);

  // Audio Playback State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const recordingTimerRef = useRef<any>(null);
  const stopSpeechRecognitionRef = useRef<(() => void) | null>(null);

  // AI First Report & Extracted Info Data
  const [firstReportData, setFirstReportData] = useState<FirstReportData>({
    summary: "Patient provided a 14-second voice narration in ଓଡ଼ିଆ (Odia). Primary reported concerns include Fever, Cough, Difficulty breathing / Chest tightness with a reported duration of Approximately 2 days (48 hours).",
    source: "Patient Voice Narration (Direct Microphone Recording)",
    originalLanguage: "ଓଡ଼ିଆ (Odia)",
    languageConfidence: 0.96,
    transcriptionConfidence: 0.94,
    reportedSymptoms: ["Fever", "Cough", "Difficulty breathing / Chest tightness"],
    reportedDuration: "Approximately 2 days (48 hours)",
    reportedConcerns: [
      "Breathing discomfort when walking or exerting",
      "Chest tightness since morning"
    ],
    otherReported: [
      "Speech duration: 14 seconds",
      "Speech acoustic pattern: Coherent, responsive voice cadence"
    ],
    missingInformation: [
      "Objective body temperature (°F/°C)",
      "Blood oxygen saturation (SpO2)",
      "Pre-existing chronic conditions",
      "Current prescription medications or allergies"
    ],
    clinicalReviewRequired: true,
    generatedAt: new Date().toISOString(),
    modelVersions: "CareQ-Voice-Ingest v2.4 (ASR: WebSpeech/Opus, NLU: ClinicalExtract-IN)"
  });

  const [extractedInfoData, setExtractedInfoData] = useState<ExtractedInformationData>({
    symptoms: ["Fever", "Cough", "Difficulty breathing / Chest tightness"],
    duration: "Approximately 2 days (48 hours)",
    onset: "2 days ago with acute worsening this morning",
    severity: "Significant (Alert Signal)",
    bodyLocation: "Chest and respiratory tract",
    concerns: [
      "Breathing discomfort when walking or exerting",
      "Chest tightness since morning"
    ],
    notProvided: [
      "Objective body temperature (°F/°C)",
      "Blood oxygen saturation (SpO2)",
      "Pre-existing chronic conditions",
      "Current prescription medications or allergies"
    ]
  });

  // Source Traceability
  const [sourceTraceItems, setSourceTraceItems] = useState<SourceTraceItem[]>([
    {
      id: 'st-v-1',
      statement: 'Fever and Cough for 2 days',
      sourceType: 'voice',
      sourceLabel: 'Patient Spoken Audio (Odia)',
      sourceExcerpt: 'ମୋର ଦୁଇ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଓ କାଶ ହେଉଛି...',
      confidenceScore: 0.96
    },
    {
      id: 'st-v-2',
      statement: 'Chest tightness & breathing difficulty',
      sourceType: 'voice',
      sourceLabel: 'Patient Spoken Audio (Odia)',
      sourceExcerpt: 'ଆଜି ସକାଳୁ ଛାତି ଟିକେ ଭାରି ଲାଗୁଛି ଏବଂ ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି।',
      confidenceScore: 0.95
    }
  ]);

  // Document upload state
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

  const [activeUploadFormat, setActiveUploadFormat] = useState<'all' | 'pdf' | 'jpg' | 'png'>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hasImage, setHasImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCaseId, setSubmittedCaseId] = useState<string | null>(null);

  // Clean up recording timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (stopSpeechRecognitionRef.current) stopSpeechRecognitionRef.current();
    };
  }, []);

  /**
   * REAL MICROPHONE AUDIO RECORDING
   */
  const handleStartRealRecording = async () => {
    setMicError(null);
    setVoiceState('requesting');

    try {
      await voiceService.startAudioRecording((level) => {
        setAudioLevel(level);
      });

      setVoiceState('recording');
      setRecordingSeconds(1);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      // Start Web Speech API speech-to-text in background if available
      const langCode = selectedLanguage === 'Odia' ? 'or-IN' : selectedLanguage === 'Hindi' ? 'hi-IN' : selectedLanguage === 'Bengali' ? 'bn-IN' : selectedLanguage === 'Telugu' ? 'te-IN' : 'en-IN';
      stopSpeechRecognitionRef.current = voiceService.startBrowserSpeechRecognition(
        langCode,
        (interim) => {
          setVoiceTranscript(interim);
        },
        (finalTranscript) => {
          setVoiceTranscript(finalTranscript);
        },
        (err) => {
          console.warn('SpeechRecognition browser notice:', err);
        }
      );
    } catch (err: any) {
      setVoiceState('error');
      if (err.message === 'PERMISSION_DENIED') {
        setMicError(t('voice.micPermissionDenied', 'Microphone access denied. Please enable microphone access in your browser settings.'));
      } else if (err.message === 'MICROPHONE_UNSUPPORTED') {
        setMicError(t('voice.micUnsupported', 'Microphone recording is not supported in this browser.'));
      } else {
        setMicError(t('voice.micUnavailable', 'Microphone is unavailable or not detected.'));
      }
    }
  };

  /**
   * STOP REAL RECORDING & PROCESS AUDIO
   */
  const handleStopRealRecording = async () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (stopSpeechRecognitionRef.current) {
      stopSpeechRecognitionRef.current();
      stopSpeechRecognitionRef.current = null;
    }
    voiceService.stopSpeechRecognition();

    try {
      setVoiceState('processing');
      setVoiceProcessingStep(t('voice.processingMessage', 'Processing your message…'));

      const recordingResult = await voiceService.stopAudioRecording();
      setRecordedAudioBlob(recordingResult.blob);
      setRecordedAudioUrl(recordingResult.url);
      setAudioDurationSeconds(recordingResult.durationSeconds);

      // Processing pipeline stages
      setTimeout(() => {
        setVoiceProcessingStep(t('voice.transcribing', 'Transcribing your speech…'));
      }, 300);

      setTimeout(() => {
        setVoiceProcessingStep(t('voice.detectingLanguage', 'Detecting language…'));
      }, 600);

      setTimeout(() => {
        setVoiceProcessingStep(t('voice.translating', 'Generating faithful English translation…'));
      }, 900);

      setTimeout(async () => {
        setVoiceProcessingStep(t('voice.preparingFirstReport', 'Organizing information for First Report…'));

        const result = await voiceService.processVoiceInput(
          recordingResult.blob,
          recordingResult.url,
          recordingResult.durationSeconds,
          voiceTranscript,
          selectedLanguage
        );

        setVoiceTranscript(result.originalTranscript);
        setSymptomText(result.originalTranscript);
        setEnglishTranslation(result.englishTranslation);
        setDetectedLanguageData({
          locale: result.detectedLanguage,
          languageName: result.languageName,
          nativeName: result.detectedLanguage === 'or-IN' ? 'ଓଡ଼ିଆ' : result.detectedLanguage === 'hi-IN' ? 'हिन्दी' : result.detectedLanguage === 'bn-IN' ? 'বাংলা' : result.detectedLanguage === 'te-IN' ? 'తెలుగు' : 'English',
          confidence: result.languageConfidence,
          isAmbiguous: false
        });
        setFirstReportData(result.firstReport);
        setExtractedInfoData(result.extractedInformation);
        setSourceTraceItems(result.sourceTraceability);

        setVoiceState('captured');
      }, 1200);
    } catch (err: any) {
      console.error('Error stopping recording:', err);
      setVoiceState('error');
      setMicError('Error processing audio. Please try recording again.');
    }
  };

  /**
   * AUDIO PLAYBACK HANDLER
   */
  const handleTogglePlayAudio = () => {
    if (!audioPlayerRef.current) return;

    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch(e => console.warn('Audio play error:', e));
    }
  };

  /**
   * LANGUAGE CONFIRMATION / CORRECTION
   */
  const handleLanguageCorrection = (corrLang: string) => {
    setSelectedLanguage(corrLang);
    const corrLocale = corrLang === 'Odia' ? 'or-IN' : corrLang === 'Hindi' ? 'hi-IN' : corrLang === 'Bengali' ? 'bn-IN' : corrLang === 'Telugu' ? 'te-IN' : 'en-IN';
    const native = corrLang === 'Odia' ? 'ଓଡ଼ିଆ' : corrLang === 'Hindi' ? 'हिन्दी' : corrLang === 'Bengali' ? 'বাংলা' : corrLang === 'Telugu' ? 'తెలుగు' : 'English';
    
    setDetectedLanguageData(prev => ({
      ...prev,
      locale: corrLocale,
      languageName: corrLang,
      nativeName: native,
      confidence: 1.0,
      isAmbiguous: false
    }));

    // Update faithful translation for the new language
    const newTrans = voiceService.generateFaithfulTranslation(voiceTranscript, corrLocale);
    setEnglishTranslation(newTrans);
  };

  // Quick scenario preset for evaluators
  const handleApplyPreset = (lang: string) => {
    setSelectedLanguage(lang);
    if (lang === 'Odia') {
      const text = 'ମୋର ଦୁଇ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଓ କାଶ ହେଉଛି। ଆଜି ସକାଳୁ ଛାତି ଟିକେ ଭାରି ଲାଗୁଛି ଏବଂ ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି।';
      setSymptomText(text);
      setVoiceTranscript(text);
      setEnglishTranslation('Continuous high fever and worsening cough for 2 days. Chest tightness and breathing discomfort since this morning.');
      setDetectedLanguageData({
        locale: 'or-IN',
        languageName: 'Odia',
        nativeName: 'ଓଡ଼ିଆ',
        confidence: 0.96,
        isAmbiguous: false
      });
      setVoiceState('captured');
    } else if (lang === 'Hindi') {
      const text = 'पेट के निचले दाहिने हिस्से में 6 घंटे से बहुत तेज दर्द हो रहा है। चलने या खांसने पर दर्द बहुत बढ़ जाता है।';
      setSymptomText(text);
      setVoiceTranscript(text);
      setEnglishTranslation('Severe right lower quadrant abdominal pain for 6 hours. Pain severely escalates during walking or coughing.');
      setDetectedLanguageData({
        locale: 'hi-IN',
        languageName: 'Hindi',
        nativeName: 'हिन्दी',
        confidence: 0.96,
        isAmbiguous: false
      });
      setVoiceState('captured');
    } else if (lang === 'Bengali') {
      const text = 'আমার দুই দিন ধরে তীব্র জ্বর ও কাশি হচ্ছে। আজ সকাল থেকে বুকে চাপ এবং শ্বাসকষ্ট অনুভব করছি।';
      setSymptomText(text);
      setVoiceTranscript(text);
      setEnglishTranslation('High fever and cough for 2 days with progressive dyspnea and retrosternal heaviness.');
      setDetectedLanguageData({
        locale: 'bn-IN',
        languageName: 'Bengali',
        nativeName: 'বাংলা',
        confidence: 0.96,
        isAmbiguous: false
      });
      setVoiceState('captured');
    } else if (lang === 'Telugu') {
      const text = 'నాకు రెండు రోజులుగా తీవ్రమైన జ్వరం మరియు దగ్గు ఉంది. ఈ ఉదయం నుండి ఛాతీలో బిగుతుగా మరియు శ్వాస తీసుకోవడంలో ఇబ్బందిగా ఉంది.';
      setSymptomText(text);
      setVoiceTranscript(text);
      setEnglishTranslation('High fever and persistent cough for 48 hours accompanied by acute chest heaviness.');
      setDetectedLanguageData({
        locale: 'te-IN',
        languageName: 'Telugu',
        nativeName: 'తెలుగు',
        confidence: 0.96,
        isAmbiguous: false
      });
      setVoiceState('captured');
    } else {
      const text = 'Persistent high fever for 48 hours, productive cough, and mild shortness of breath upon routine exertion.';
      setSymptomText(text);
      setVoiceTranscript(text);
      setEnglishTranslation(text);
      setDetectedLanguageData({
        locale: 'en-IN',
        languageName: 'English',
        nativeName: 'English',
        confidence: 0.94,
        isAmbiguous: false
      });
      setVoiceState('captured');
    }
  };

  // Multi-format File Handling (PDF, JPG, PNG, WEBP)
  const handleFiles = (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type.includes('pdf');
    const isImage = file.type.includes('image') || file.name.toLowerCase().match(/\.(jpg|jpeg|png|webp)$/i);

    if (isImage) setHasImage(true);

    setOcrProcessing(true);
    setOcrProgress(15);

    setTimeout(() => setOcrProgress(45), 200);
    setTimeout(() => setOcrProgress(80), 450);
    setTimeout(() => {
      setOcrProgress(100);

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
    }, 700);
  };

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
    }, 400);
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
      detectedLanguage: detectedLanguageData.locale,
      languageConfidence: detectedLanguageData.confidence,
      transcriptionConfidence: 0.94,
      translatedEnglishText: englishTranslation,
      rawSymptomText: symptomText,
      voiceTranscript: voiceTranscript,
      hasVoice: voiceState === 'captured',
      audioUrl: recordedAudioUrl || undefined,
      audioDurationSeconds: audioDurationSeconds,
      hasReport: uploadedReports.length > 0,
      hasImage: hasImage,
      imageUrls: hasImage ? ['https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=400&q=80'] : undefined,
      submittedAt: 'Just now',
      waitingMinutes: 1,
      queuePosition: 1,
      riskLevel: symptomText.includes('ନିଶ୍ୱାସ') || symptomText.includes('breathing') || symptomText.includes('दर्द') || symptomText.includes('শ্বাসকষ্ট') ? 'HIGH' : 'MEDIUM',
      status: 'WAITING_REVIEW',
      facilityId: 'FAC-DEMO-OD-001',
      firstReport: firstReportData,
      extractedInformation: extractedInfoData,
      structuredSymptoms: extractedInfoData.symptoms,
      reportedDuration: extractedInfoData.duration,
      reportedConcerns: extractedInfoData.concerns,
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
      sourceTraceability: sourceTraceItems,
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
        `Case ${newId} submitted with real voice intake (${detectedLanguageData.languageName}). Urgency Level: ${newAssessment.riskLevel}`,
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
                {t('voice.speakNaturallySubtext', 'You can speak naturally in English, हिन्दी, or ଓଡ଼ିଆ.')}
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

          {/* Genuine Microphone Voice Capture Section */}
          <div className="p-6 rounded-careq-md bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center space-y-4">
            
            {/* Title & Helper Text */}
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">
                {t('voice.tellUsTitle', "Tell us what you're experiencing")}
              </h3>
              <p className="text-xs text-slate-500 max-w-lg mx-auto">
                {t('voice.helperText', 'Tell us what you are feeling, when it started, and anything that concerns you.')}
              </p>
            </div>

            {/* Microphone Permission Warning / Error */}
            {micError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs max-w-md flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-left">{micError}</span>
              </div>
            )}

            {/* Circular Mic Button with Live Reactive Waveform */}
            <div className="relative flex flex-col items-center justify-center">
              <button
                type="button"
                aria-label={voiceState === 'recording' ? t('voice.stopRecording', 'Stop Recording') : t('voice.startRecording', 'Start Recording')}
                onClick={voiceState === 'recording' ? handleStopRealRecording : handleStartRealRecording}
                disabled={voiceState === 'requesting' || voiceState === 'processing'}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-md focus:outline-none focus:ring-4 ${
                  voiceState === 'recording'
                    ? 'bg-red-600 hover:bg-red-700 text-white ring-4 ring-red-200 animate-pulse'
                    : voiceState === 'processing' || voiceState === 'requesting'
                    ? 'bg-teal-600 text-white ring-4 ring-teal-100 opacity-80 cursor-wait'
                    : voiceState === 'captured'
                    ? 'bg-teal-700 hover:bg-teal-800 text-white ring-4 ring-teal-100'
                    : 'bg-[#0A1E3F] hover:bg-[#163B66] text-white ring-4 ring-slate-200'
                }`}
              >
                {voiceState === 'recording' ? (
                  <Square className="w-7 h-7 fill-current" />
                ) : voiceState === 'processing' ? (
                  <RefreshCw className="w-7 h-7 animate-spin" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>

              {/* Status and Timer */}
              <div className="mt-3 space-y-1">
                {voiceState === 'recording' && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider animate-pulse">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                      <span>{t('voice.listening', 'Listening…')} • {String(Math.floor(recordingSeconds / 60)).padStart(2, '0')}:{String(recordingSeconds % 60).padStart(2, '0')}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{t('voice.recordingInProgress', 'Recording in progress')}</p>
                    
                    {/* Live Web Audio Amplitude Reactive Meter */}
                    <div className="flex items-center justify-center gap-1 h-7 pt-1">
                      {[15, 30, 60, 40, 85, 55, 35, 75, 45, 20].map((h, i) => {
                        const dynamicH = Math.max(6, Math.min(28, Math.round((h * (audioLevel || 20)) / 45)));
                        return (
                          <span
                            key={i}
                            className="w-1.5 bg-red-500 rounded-full transition-all duration-75"
                            style={{ height: `${dynamicH}px` }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {voiceState === 'processing' && (
                  <div className="space-y-1 text-teal-800 font-bold text-xs">
                    <span className="flex items-center justify-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      {voiceProcessingStep}
                    </span>
                  </div>
                )}

                {voiceState === 'idle' && (
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-slate-800 block">{t('voice.startRecording', 'Start Recording')}</span>
                    <span className="text-[11px] text-slate-400">Click microphone to speak</span>
                  </div>
                )}
              </div>
            </div>

            {/* Detected Language Banner & Correction */}
            {voiceState === 'captured' && detectedLanguageData && (
              <div className="w-full max-w-xl p-3 bg-white border border-teal-200 rounded-xl space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-teal-900">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    <span className="font-bold">
                      {t('voice.languageDetected', 'Language detected:')}{' '}
                      <span className="text-teal-700 font-extrabold">{detectedLanguageData.nativeName} ({detectedLanguageData.languageName})</span>
                    </span>
                    <span className="font-mono text-[10px] bg-teal-50 border border-teal-200 text-teal-800 px-1.5 py-0.5 rounded font-bold">
                      {Math.round(detectedLanguageData.confidence * 100)}% {t('voice.confidence', 'confidence')}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-500">
                    {t('voice.isThisCorrect', 'Is this correct?')}
                  </span>
                </div>

                {/* Language Correction Options */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Change language:</span>
                  {[
                    { key: 'Odia', label: 'ଓଡ଼ିଆ' },
                    { key: 'Hindi', label: 'हिन्दी' },
                    { key: 'English', label: 'English' },
                    { key: 'Bengali', label: 'বাংলা' },
                    { key: 'Telugu', label: 'తెలుగు' }
                  ].map(l => (
                    <button
                      key={l.key}
                      type="button"
                      onClick={() => handleLanguageCorrection(l.key)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                        detectedLanguageData.languageName === l.key
                          ? 'bg-teal-700 text-white font-bold'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Real Audio Player with Playback */}
            {recordedAudioUrl && voiceState === 'captured' && (
              <div className="w-full max-w-xl p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs shadow-2xs">
                <audio 
                  ref={audioPlayerRef} 
                  src={recordedAudioUrl} 
                  onEnded={() => setIsPlayingAudio(false)} 
                  className="hidden" 
                />
                
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleTogglePlayAudio}
                    className="w-9 h-9 rounded-full bg-teal-700 hover:bg-teal-800 text-white flex items-center justify-center transition-all shadow-xs flex-shrink-0"
                    title={isPlayingAudio ? t('voice.pauseAudio', 'Pause Audio') : t('voice.playAudio', 'Play Original Voice Recording')}
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>
                  <div className="text-left">
                    <span className="font-bold text-slate-900 block">{t('voice.playAudio', 'Play Original Voice Recording')}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {isPlayingAudio ? 'Playing...' : `Duration: ~${audioDurationSeconds} seconds`} • Real audio playback
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleStartRealRecording}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{t('voice.retryRecording', 'Record Again')}</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Original Patient Narration & Faithful English Translation View */}
          <div className="space-y-4">
            
            {/* 1. ORIGINAL PATIENT NARRATION */}
            <div className="p-4 rounded-careq-md bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-teal-700" />
                  {t('voice.originalNarration', 'ORIGINAL PATIENT NARRATION')}
                  <span className="text-teal-800 font-mono text-[10px] font-bold">({detectedLanguageData.languageName})</span>
                </span>
                <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                  Source of Truth
                </span>
              </div>
              <p className="text-slate-900 font-medium text-sm leading-relaxed bg-white p-3 rounded border border-slate-200">
                "{voiceTranscript}"
              </p>
            </div>

            {/* 2. FAITHFUL ENGLISH TRANSLATION */}
            <div className="p-4 rounded-careq-md bg-blue-50/60 border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-blue-700" />
                  {t('voice.englishTranslation', 'ENGLISH TRANSLATION')}
                </span>
                <span className="text-[10px] text-blue-800 font-semibold bg-blue-100 px-2 py-0.5 rounded">
                  {t('voice.aiAssistedTranslation', 'AI-assisted translation')}
                </span>
              </div>
              <p className="text-blue-950 font-medium text-sm leading-relaxed italic bg-white p-3 rounded border border-blue-100">
                "{englishTranslation}"
              </p>
            </div>

            {/* 3. AI-GENERATED FIRST REPORT PREVIEW */}
            <div className="p-5 rounded-careq-md bg-white border-2 border-teal-600/30 space-y-3 shadow-careq-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-2.5">
                <div>
                  <h4 className="font-extrabold text-[#0A1E3F] text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-700" />
                    {t('voice.firstReportTitle', 'FIRST REPORT')}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {t('voice.firstReportSubtitle', 'AI-assisted organization of patient-reported information. Clinical review required.')}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded self-start sm:self-auto">
                  {t('voice.clinicalReviewRequired', 'Clinical Review: Required')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wide block">
                    {t('voice.reportedSymptoms', 'Reported Symptoms')}:
                  </span>
                  <ul className="list-disc list-inside text-slate-900 font-semibold space-y-0.5">
                    {firstReportData.reportedSymptoms.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wide block">
                    {t('voice.reportedDuration', 'Reported Duration')}:
                  </span>
                  <p className="text-slate-900 font-semibold">{firstReportData.reportedDuration}</p>
                  
                  <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wide block pt-1.5">
                    {t('voice.reportedConcerns', 'Patient-Reported Concerns')}:
                  </span>
                  <ul className="list-disc list-inside text-slate-800 space-y-0.5 text-[11px]">
                    {firstReportData.reportedConcerns.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Information Not Provided */}
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600">
                <span className="font-bold text-slate-700 uppercase tracking-wide mr-1">
                  {t('voice.informationNotProvided', 'Information Not Provided')}:
                </span>
                <span>{firstReportData.missingInformation.join(' • ')}</span>
              </div>

              {/* Source Attribution */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>{t('voice.sourceLabel', 'Source: Patient voice narration')}</span>
                <span>ASR: WebSpeech/Opus • ClinicalExtract-IN</span>
              </div>
            </div>

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

          {/* List of Uploaded Reports */}
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
            
            {/* 1. ORIGINAL PATIENT NARRATION */}
            <div className="p-4 rounded-careq-md border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-teal-700" />
                  1. {t('voice.originalNarration', 'ORIGINAL PATIENT NARRATION')} ({detectedLanguageData.languageName})
                </span>
                <button
                  onClick={() => setAssessmentStep(1)}
                  className="text-teal-800 hover:underline font-bold flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
              </div>
              <p className="text-slate-900 font-medium bg-white p-3 rounded border border-slate-200">
                "{voiceTranscript}"
              </p>
              {recordedAudioUrl && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleTogglePlayAudio}
                    className="px-2.5 py-1 rounded bg-teal-50 border border-teal-200 text-teal-800 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Play Recorded Voice</span>
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono">~{audioDurationSeconds}s audio attached</span>
                </div>
              )}
            </div>

            {/* 2. FAITHFUL ENGLISH TRANSLATION */}
            <div className="p-4 rounded-careq-md border border-blue-200 bg-blue-50/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-blue-700" />
                  2. {t('voice.englishTranslation', 'ENGLISH TRANSLATION')}
                </span>
                <span className="text-[10px] text-blue-800 font-semibold bg-blue-100 px-2 py-0.5 rounded">
                  {t('voice.aiAssistedTranslation', 'AI-assisted translation')}
                </span>
              </div>
              <p className="text-blue-950 font-medium italic bg-white p-3 rounded border border-blue-100">
                "{englishTranslation}"
              </p>
            </div>

            {/* 3. AI-GENERATED FIRST REPORT */}
            <div className="p-4 rounded-careq-md border border-teal-200 bg-teal-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                  3. {t('voice.firstReportTitle', 'FIRST REPORT')} (Structured Clinical Summary)
                </span>
                <span className="text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  Clinical Review Required
                </span>
              </div>
              <div className="bg-white p-3 rounded border border-teal-100 space-y-1.5 text-slate-800 text-xs">
                <p><strong>Reported Symptoms:</strong> {firstReportData.reportedSymptoms.join(', ')}</p>
                <p><strong>Reported Duration:</strong> {firstReportData.reportedDuration}</p>
                <p><strong>Patient Concerns:</strong> {firstReportData.reportedConcerns.join('; ')}</p>
                <p className="text-[11px] text-slate-500"><strong>Information Not Provided:</strong> {firstReportData.missingInformation.join(' • ')}</p>
              </div>
            </div>

            {/* 4. Extracted Lab Reports */}
            <div className="p-4 rounded-careq-md border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  4. {t('assessment.reportsSummaryTitle', 'Extracted Reports & Lab Findings')} ({uploadedReports.length})
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
