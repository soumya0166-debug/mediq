import { PatientUser, DoctorUser, Assessment, AuditEvent } from '../types';

export const MOCK_PATIENTS: PatientUser[] = [
  {
    id: 'PAT-2026-00124',
    name: 'Riya Das',
    dob: '1992-04-12',
    age: 34,
    gender: 'Female',
    phone: '+91 98765 43210',
    email: 'riya.das.demo@swasthyasetu.org',
    preferredLanguage: 'Odia',
    demoAadhaarLast4: '1234',
    isVerified: true,
    consentGiven: true,
    address: 'Khandagiri, Bhubaneswar, Khordha, Odisha - 751030',
    emergencyContact: 'Debashis Das (Spouse) - +91 98765 11223'
  },
  {
    id: 'PAT-2026-00125',
    name: 'Amit Kumar',
    dob: '1981-08-25',
    age: 45,
    gender: 'Male',
    phone: '+91 94371 88921',
    email: 'amit.kumar.demo@swasthyasetu.org',
    preferredLanguage: 'Hindi',
    demoAadhaarLast4: '8842',
    isVerified: true,
    consentGiven: true,
    address: 'Patia, Bhubaneswar, Odisha',
    emergencyContact: 'Sunita Kumar (Wife) - +91 94371 44556'
  },
  {
    id: 'PAT-2026-00126',
    name: 'Sunita Devi',
    dob: '1968-11-03',
    age: 58,
    gender: 'Female',
    phone: '+91 91234 56789',
    email: 'sunita.devi.demo@swasthyasetu.org',
    preferredLanguage: 'Bengali',
    demoAadhaarLast4: '4491',
    isVerified: true,
    consentGiven: true,
    address: 'Cuttack Sadar, Odisha',
    emergencyContact: 'Rajesh Devi (Son) - +91 91234 99887'
  },
  {
    id: 'PAT-2026-00127',
    name: 'Rahul Patnaik',
    dob: '1998-02-14',
    age: 28,
    gender: 'Male',
    phone: '+91 82490 12345',
    email: 'rahul.p.demo@swasthyasetu.org',
    preferredLanguage: 'Odia',
    demoAadhaarLast4: '6731',
    isVerified: true,
    consentGiven: true,
    address: 'Nayapalli, Bhubaneswar, Odisha'
  },
  {
    id: 'PAT-2026-00128',
    name: 'Priya Singh',
    dob: '2004-06-19',
    age: 22,
    gender: 'Female',
    phone: '+91 97760 98765',
    email: 'priya.singh.demo@swasthyasetu.org',
    preferredLanguage: 'English',
    demoAadhaarLast4: '5219',
    isVerified: true,
    consentGiven: true,
    address: 'Saheed Nagar, Bhubaneswar, Odisha'
  }
];

export const MOCK_DOCTORS: DoctorUser[] = [
  {
    id: 'DOC-NMC-84920',
    name: 'Dr. Ananya Sharma',
    role: 'Doctor',
    facility: 'Capital Hospital & Community Health Centre, Unit-6',
    state: 'Odisha',
    medicalRegistrationId: 'NMC/ORI/2015/084920',
    experienceYears: 11,
    phone: '+91 94370 12399',
    email: 'dr.ananya.sharma@health.odisha.gov.in',
    isVerified: true,
    specialization: 'General Medicine & Public Health'
  },
  {
    id: 'DOC-NMC-71204',
    name: 'Dr. Arjun Mehta',
    role: 'Medical Officer',
    facility: 'SCB Medical College & Hospital, Cuttack',
    state: 'Odisha',
    medicalRegistrationId: 'NMC/ORI/2018/071204',
    experienceYears: 8,
    phone: '+91 94372 99881',
    email: 'dr.arjun.mehta@scbmc.ac.in',
    isVerified: true,
    specialization: 'Emergency & Critical Care'
  },
  {
    id: 'NUR-INC-39210',
    name: 'Nurse Kavita Das',
    role: 'Nurse',
    facility: 'Primary Health Centre (PHC), Jatni',
    state: 'Odisha',
    medicalRegistrationId: 'INC/ONC/2020/039210',
    experienceYears: 6,
    phone: '+91 93380 55443',
    email: 'kavita.das@health.odisha.gov.in',
    isVerified: true,
    specialization: 'Triage & Community Nursing'
  }
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'ASM-2026-00124',
    patientId: 'PAT-2026-00124',
    patientName: 'Riya Das',
    patientAge: 34,
    patientGender: 'Female',
    patientLanguage: 'Odia',
    detectedLanguage: 'ଓଡ଼ିଆ (Odia)',
    translatedEnglishText: 'I have had continuous high fever and worsening dry cough for 2 days. From this morning, I am feeling mild chest tightness and difficulty taking deep breaths. Body aches and heavy fatigue.',
    rawSymptomText: 'ମୋର ଦୁଇ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଓ କାଶ ହେଉଛି। ଆଜି ସକାଳୁ ଛାତି ଟିକେ ଭାରି ଲାଗୁଛି ଏବଂ ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି। ଦେହ ହାତ ଘୋଳାବିନ୍ଧା ଓ ଅତ୍ୟଧିକ ଦୁର୍ବଳତା ଲାଗୁଛି।',
    voiceTranscript: '[00:00 - 00:14] ମୋର ଦୁଇ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଓ କାଶ ହେଉଛି। ଆଜି ସକାଳୁ ଛାତି ଟିକେ ଭାରି ଲାଗୁଛି ଏବଂ ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି। ଦେହ ହାତ ଘୋଳାବିନ୍ଧା ଓ ଅତ୍ୟଧିକ ଦୁର୍ବଳତା ଲାଗୁଛି।',
    hasVoice: true,
    hasReport: true,
    hasImage: true,
    imageUrls: ['https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=400&q=80'],
    submittedAt: 'Today, 10:42 AM',
    waitingMinutes: 4,
    queuePosition: 1,
    riskLevel: 'HIGH',
    status: 'WAITING_REVIEW',
    structuredSymptoms: ['High fever for 2 days', 'Persistent dry cough', 'Reported breathing discomfort / chest tightness', 'Severe fatigue & myalgia'],
    reportedDuration: '2 days (acute worsening today)',
    reportedConcerns: ['Breathing difficulty while lying down', 'Unable to keep food down due to severe malaise'],
    timeline: [
      {
        day: 'Day 1 (48h ago)',
        title: 'Onset of Fever & Chills',
        description: 'Patient felt sudden evening chills followed by fever (approx 101°F). Took oral paracetamol.',
        source: 'patient_voice'
      },
      {
        day: 'Day 2 (24h ago)',
        title: 'Cough Aggravation',
        description: 'Dry cough intensified, paracetamol gave only brief temperature relief. CBC report done at local clinic.',
        source: 'patient_text'
      },
      {
        day: 'Day 3 (Today morning)',
        title: 'Dyspnea & Chest Tightness',
        description: 'Noticeable difficulty catching breath, heavy chest sensation upon slight exertion.',
        source: 'patient_voice'
      }
    ],
    missingInformation: [
      {
        id: 'mi-1',
        field: 'SpO2 (Pulse Oximeter Reading)',
        description: 'No oxygen saturation level provided. Critical for evaluating respiratory compromise.',
        importance: 'HIGH'
      },
      {
        id: 'mi-2',
        field: 'Current Temperature reading (°F/°C)',
        description: 'Exact objective temperature value is missing.',
        importance: 'HIGH'
      },
      {
        id: 'mi-3',
        field: 'Pre-existing respiratory conditions',
        description: 'History of asthma, bronchitis, or allergies not specified.',
        importance: 'MEDIUM'
      },
      {
        id: 'mi-4',
        field: 'Current medications taken',
        description: 'Dosages and names of antipyretics taken in last 24h.',
        importance: 'MEDIUM'
      }
    ],
    urgencySignals: [
      {
        id: 'us-1',
        level: 'HIGH',
        signal: 'Reported breathing difficulty / dyspnea',
        source: 'voice',
        confidence: 0.94,
        note: 'Acoustic voice analysis detected shallow breathing cadence and vocal strain.'
      },
      {
        id: 'us-2',
        level: 'HIGH',
        signal: 'CBC report: Elevated WBC (14,200 /µL) with Neutrophilia (82%)',
        source: 'report',
        confidence: 0.98,
        note: 'Leukocytosis detected in uploaded automated hematology counter report.'
      },
      {
        id: 'us-3',
        level: 'MEDIUM',
        signal: 'Persistent acute fever (>48 hours)',
        source: 'text',
        confidence: 0.96,
        note: 'Reported unresponsiveness to routine domestic antipyretics.'
      },
      {
        id: 'us-4',
        level: 'LOW',
        signal: 'No crushing cardiac-type chest pain reported',
        source: 'text',
        confidence: 0.91,
        note: 'Discomfort reported as respiratory tightness rather than retrosternal radiating pain.'
      }
    ],
    followUpQuestions: [
      {
        id: 'fq-1',
        question: 'Are you currently experiencing difficulty breathing while resting, or only when walking?',
        rationale: 'Clarifies whether dyspnea is at rest (urgent) vs exertional.',
        status: 'PENDING',
        sourceSignal: 'Reported breathing discomfort'
      },
      {
        id: 'fq-2',
        question: 'Do you have access to a fingertip pulse oximeter? If yes, what is your oxygen reading (SpO2)?',
        rationale: 'Rule out hypoxemia needing emergency supplemental oxygen.',
        status: 'PENDING',
        sourceSignal: 'Missing SpO2'
      },
      {
        id: 'fq-3',
        question: 'What was your highest recorded temperature with a thermometer today?',
        rationale: 'Determines objective grade of fever.',
        status: 'PENDING',
        sourceSignal: 'Persistent fever'
      },
      {
        id: 'fq-4',
        question: 'Do you have any known medical conditions like asthma, diabetes, or hypertension?',
        rationale: 'Screens for clinical co-morbidities elevating triage urgency.',
        status: 'PENDING',
        sourceSignal: 'Missing medical history'
      }
    ],
    extractedReports: [
      {
        id: 'REP-CBC-001',
        reportName: 'Complete Blood Count (CBC) with Differential',
        reportDate: '2026-09-23',
        category: 'Hematology',
        fileName: 'riya_das_cbc_report.pdf',
        fileSize: '412 KB',
        ocrConfidence: 0.97,
        tests: [
          { testName: 'Total Leukocyte Count (WBC)', result: '14,200', unit: '/µL', referenceRange: '4,000 - 11,000', isAbnormal: true, severity: 'moderate' },
          { testName: 'Neutrophils', result: '82', unit: '%', referenceRange: '40 - 70', isAbnormal: true, severity: 'moderate' },
          { testName: 'Lymphocytes', result: '13', unit: '%', referenceRange: '20 - 45', isAbnormal: true, severity: 'mild' },
          { testName: 'Hemoglobin (Hb)', result: '12.4', unit: 'g/dL', referenceRange: '12.0 - 15.5', isAbnormal: false },
          { testName: 'Platelet Count', result: '215,000', unit: '/µL', referenceRange: '150,000 - 450,000', isAbnormal: false },
          { testName: 'ESR (1st Hour)', result: '38', unit: 'mm/hr', referenceRange: '0 - 20', isAbnormal: true, severity: 'mild' }
        ],
        summary: 'Extracted automated cell counter values demonstrate significant leukocytosis with absolute neutrophilia and elevated erythrocyte sedimentation rate.'
      }
    ]
  },
  {
    id: 'ASM-2026-00125',
    patientId: 'PAT-2026-00125',
    patientName: 'Amit Kumar',
    patientAge: 45,
    patientGender: 'Male',
    patientLanguage: 'Hindi',
    detectedLanguage: 'हिन्दी (Hindi)',
    translatedEnglishText: 'Severe right lower abdominal pain started 6 hours ago. Nausea and low grade fever. Pain increases while coughing or walking.',
    rawSymptomText: 'पेट के निचले दाहिने हिस्से में 6 घंटे से बहुत तेज दर्द हो रहा है। जी मिचला रहा है और हल्का बुखार है। चलने या खांसने पर दर्द बहुत बढ़ जाता है।',
    hasVoice: true,
    hasReport: false,
    hasImage: false,
    submittedAt: 'Today, 10:38 AM',
    waitingMinutes: 8,
    queuePosition: 2,
    riskLevel: 'HIGH',
    status: 'WAITING_REVIEW',
    structuredSymptoms: ['Acute right lower quadrant abdominal pain (6h)', 'Associated nausea & anorexia', 'Low grade fever', 'Peritoneal aggravation with coughing'],
    reportedDuration: '6 hours (rapid acute onset)',
    reportedConcerns: ['Unable to straighten up or walk upright', 'Pain progressively worsening'],
    timeline: [
      {
        day: '6 hours ago',
        title: 'Periumbilical discomfort began',
        description: 'Vague crampy pain around naval.',
        source: 'patient_voice'
      },
      {
        day: '3 hours ago',
        title: 'Pain localized to Right Lower Quadrant',
        description: 'Shifted to right iliac fossa with sharp constant pain and nausea.',
        source: 'patient_voice'
      }
    ],
    missingInformation: [
      { id: 'mi-10', field: 'Last food intake / Bowel movement', description: 'NPO status relevant if surgical review needed.', importance: 'HIGH' },
      { id: 'mi-11', field: 'Urinary symptoms', description: 'Presence of dysuria or hematuria.', importance: 'MEDIUM' }
    ],
    urgencySignals: [
      {
        id: 'us-10',
        level: 'HIGH',
        signal: 'Acute right lower quadrant pain with peritoneal signs',
        source: 'voice',
        confidence: 0.95,
        note: 'Symptom cluster characteristic of acute abdominal pathology.'
      }
    ],
    followUpQuestions: [
      {
        id: 'fq-10',
        question: 'Have you had any episodes of vomiting or diarrhea since the pain started?',
        rationale: 'Assesses GI complications and hydration status.',
        status: 'PENDING'
      },
      {
        id: 'fq-11',
        question: 'When did you last eat or drink anything?',
        rationale: 'Pre-procedural fasting assessment.',
        status: 'PENDING'
      }
    ],
    extractedReports: []
  },
  {
    id: 'ASM-2026-00126',
    patientId: 'PAT-2026-00126',
    patientName: 'Sunita Devi',
    patientAge: 58,
    patientGender: 'Female',
    patientLanguage: 'Bengali',
    detectedLanguage: 'বাংলা (Bengali)',
    translatedEnglishText: 'Both knees have stiffness and dull pain for past 3 weeks, worse after waking up in morning. Uploaded X-ray report from last week.',
    rawSymptomText: 'গত ৩ সপ্তাহ ধরে দুই হাঁটুতে ব্যথা ও শক্ত ভাব হচ্ছে। সকালে ঘুম থেকে উঠলে বেশি কষ্ট হয়। গত সপ্তাহের এক্স-রে রিপোর্ট আপলোড করেছি।',
    hasVoice: false,
    hasReport: true,
    hasImage: false,
    submittedAt: 'Today, 10:31 AM',
    waitingMinutes: 15,
    queuePosition: 3,
    riskLevel: 'LOW',
    status: 'WAITING_REVIEW',
    structuredSymptoms: ['Bilateral knee joint pain & morning stiffness', 'Duration 3 weeks', 'No acute swelling or red erythema'],
    reportedDuration: '3 weeks (chronic / subacute)',
    reportedConcerns: ['Difficulty using traditional stairs', 'Stiffness eases after 20 minutes of mild movement'],
    timeline: [
      {
        day: '3 weeks ago',
        title: 'Mild joint stiffness onset',
        description: 'Gradual onset after household chores.',
        source: 'patient_text'
      }
    ],
    missingInformation: [
      { id: 'mi-20', field: 'Any history of uric acid / gout testing', description: 'Helps correlate inflammatory vs degenerative signs.', importance: 'OPTIONAL' }
    ],
    urgencySignals: [
      {
        id: 'us-20',
        level: 'LOW',
        signal: 'Chronic bilateral weight-bearing joint symptoms',
        source: 'text',
        confidence: 0.92,
        note: 'Absence of constitutional red flags like high fever or rapid effusion.'
      }
    ],
    followUpQuestions: [
      {
        id: 'fq-20',
        question: 'Is there any swelling, warmth, or redness around either knee joint?',
        rationale: 'Differentiates septic / active inflammatory effusion.',
        status: 'PENDING'
      }
    ],
    extractedReports: [
      {
        id: 'REP-RAD-002',
        reportName: 'Bilateral Knee X-Ray AP & Lateral Views',
        reportDate: '2026-09-18',
        category: 'Radiology',
        fileName: 'sunita_devi_knee_xray.pdf',
        fileSize: '1.2 MB',
        ocrConfidence: 0.95,
        tests: [
          { testName: 'Medial Joint Space', result: 'Mild to moderate narrowing', unit: '', referenceRange: 'Preserved / Normal', isAbnormal: true, severity: 'mild' },
          { testName: 'Osteophyte Formation', result: 'Marginal tibial osteophytes noted', unit: '', referenceRange: 'None', isAbnormal: true, severity: 'mild' },
          { testName: 'Bone Mineral Density', result: 'Mild osteopenia', unit: '', referenceRange: 'Normal', isAbnormal: false }
        ],
        summary: 'Radiological findings report grade II degenerative changes of bilateral medial tibiofemoral compartments.'
      }
    ]
  },
  {
    id: 'ASM-2026-00127',
    patientId: 'PAT-2026-00127',
    patientName: 'Rahul Patnaik',
    patientAge: 28,
    patientGender: 'Male',
    patientLanguage: 'Odia',
    detectedLanguage: 'ଓଡ଼ିଆ (Odia)',
    translatedEnglishText: 'Mild itchy skin rash on forearms and chest for 2 days. Mild fever (99.5°F). Took a new herbal preparation 3 days ago.',
    rawSymptomText: 'ମୋ ହାତ ଏବଂ ଛାତିରେ ଦୁଇ ଦିନ ହେଲା କୁଣ୍ଡେଇ ହୋଇ ନାଲି ଦାଗ ବାହାରିଛି। ସାମାନ୍ୟ ଜ୍ୱର ଅଛି। ତିନି ଦିନ ତଳେ ଏକ ନୂଆ ଆୟୁର୍ବେଦିକ ଔଷଧ ନେଇଥିଲି।',
    hasVoice: false,
    hasReport: false,
    hasImage: true,
    imageUrls: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80'],
    submittedAt: 'Today, 10:15 AM',
    waitingMinutes: 31,
    queuePosition: 4,
    riskLevel: 'MEDIUM',
    status: 'IN_REVIEW',
    structuredSymptoms: ['Erythematous maculopapular pruritic rash', 'Mild low-grade fever', 'Potential new substance / allergen exposure'],
    reportedDuration: '2 days',
    reportedConcerns: ['Spreading itching sensation', 'Concerned regarding drug reaction'],
    timeline: [
      {
        day: '3 days ago',
        title: 'Herb / supplement ingestion',
        description: 'Started self-prescribed decoction.',
        source: 'patient_text'
      },
      {
        day: '2 days ago',
        title: 'Forearm rash',
        description: 'Itchy bumps appeared on bilateral forearms.',
        source: 'patient_text'
      }
    ],
    missingInformation: [
      { id: 'mi-30', field: 'Any facial or lip swelling (Angioedema)', description: 'Crucial to rule out anaphylactic progression.', importance: 'HIGH' },
      { id: 'mi-31', field: 'Any wheezing or throat tightness', description: 'Airway involvement assessment.', importance: 'HIGH' }
    ],
    urgencySignals: [
      {
        id: 'us-30',
        level: 'MEDIUM',
        signal: 'Possible acute drug-induced exanthem',
        source: 'text',
        confidence: 0.91,
        note: 'Temporal correlation with newly introduced preparation.'
      }
    ],
    followUpQuestions: [
      {
        id: 'fq-30',
        question: 'Do you feel any swelling of your lips, tongue, or difficulty swallowing?',
        rationale: 'Screening for angioedema / anaphylaxis.',
        status: 'PENDING'
      }
    ],
    extractedReports: []
  },
  {
    id: 'ASM-2026-00128',
    patientId: 'PAT-2026-00128',
    patientName: 'Priya Singh',
    patientAge: 22,
    patientGender: 'Female',
    patientLanguage: 'English',
    detectedLanguage: 'English',
    translatedEnglishText: 'Sore throat, sneezing, and runny nose for 3 days. No high fever, no breathing trouble. Mostly feeling tired and nasal congestion.',
    rawSymptomText: 'Sore throat, sneezing, and runny nose for 3 days. No high fever, no breathing trouble. Mostly feeling tired and nasal congestion.',
    hasVoice: true,
    hasReport: false,
    hasImage: false,
    submittedAt: 'Today, 09:50 AM',
    waitingMinutes: 56,
    queuePosition: 5,
    riskLevel: 'LOW',
    status: 'REVIEWED',
    reviewedBy: 'Dr. Ananya Sharma',
    reviewedAt: 'Today, 10:10 AM',
    clinicalNotes: 'Mild upper respiratory catarrhal symptoms without lower respiratory distress. Advised hydration, warm saline gargles, and routine tele-OPD follow-up if symptoms persist past day 5.',
    structuredSymptoms: ['Sore throat', 'Rhinorrhea / nasal congestion', 'Fatigue without tachypnea'],
    reportedDuration: '3 days',
    reportedConcerns: ['Difficulty talking continuously in college classes'],
    timeline: [
      {
        day: '3 days ago',
        title: 'Throat irritation',
        description: 'Dry scratchy sensation in pharynx.',
        source: 'patient_voice'
      }
    ],
    missingInformation: [],
    urgencySignals: [
      {
        id: 'us-40',
        level: 'LOW',
        signal: 'Uncomplicated upper respiratory symptom cluster',
        source: 'text',
        confidence: 0.95,
        note: 'Absence of dyspnea, stridor, or high pyrexia.'
      }
    ],
    followUpQuestions: [],
    extractedReports: []
  }
];

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'AUD-001',
    timestamp: '10:42 AM',
    actor: 'Riya Das (Patient)',
    actorRole: 'Patient',
    action: 'Submitted multimodal symptoms',
    details: 'Voice recording (14s) + Text description in Odia submitted with consent',
    ipHash: 'sha256-e91b...a47f',
    caseId: 'ASM-2026-00124'
  },
  {
    id: 'AUD-002',
    timestamp: '10:43 AM',
    actor: 'Multimodal Audio Subsystem',
    actorRole: 'System Triage',
    action: 'Voice converted to text & translated',
    details: 'Transcribed Odia audio stream with 96.2% acoustic confidence; generated English translation for clinical team',
    ipHash: 'internal-pipeline-01',
    caseId: 'ASM-2026-00124'
  },
  {
    id: 'AUD-003',
    timestamp: '10:43 AM',
    actor: 'Medical Document Engine',
    actorRole: 'System OCR',
    action: 'Report OCR completed',
    details: 'Processed riya_das_cbc_report.pdf (6 test parameters parsed, 3 out-of-range flags detected)',
    ipHash: 'internal-ocr-03',
    caseId: 'ASM-2026-00124'
  },
  {
    id: 'AUD-004',
    timestamp: '10:44 AM',
    actor: 'Clinical Triage Synthesizer',
    actorRole: 'System Triage',
    action: 'Structured triage note generated',
    details: 'Synthesized timeline, identified 4 missing critical data points, highlighted 2 high-priority urgency signals',
    ipHash: 'internal-triage-ai',
    caseId: 'ASM-2026-00124'
  },
  {
    id: 'AUD-005',
    timestamp: '10:45 AM',
    actor: 'Dr. Ananya Sharma',
    actorRole: 'Healthcare Worker',
    action: 'Healthcare worker opened case',
    details: 'Dr. Ananya Sharma accessed patient review workspace (Verification ID: NMC/ORI/2015/084920)',
    ipHash: '10.24.180.12',
    caseId: 'ASM-2026-00124'
  },
  {
    id: 'AUD-006',
    timestamp: '10:47 AM',
    actor: 'Dr. Ananya Sharma',
    actorRole: 'Healthcare Worker',
    action: 'Follow-up question requested',
    details: 'Sent verified notification to patient: "Do you have access to a fingertip pulse oximeter?"',
    ipHash: '10.24.180.12',
    caseId: 'ASM-2026-00124'
  },
  {
    id: 'AUD-007',
    timestamp: '10:10 AM',
    actor: 'Dr. Ananya Sharma',
    actorRole: 'Healthcare Worker',
    action: 'Case marked reviewed',
    details: 'Completed clinical review for Priya Singh (ASM-2026-00128). Status updated to REVIEWED.',
    ipHash: '10.24.180.12',
    caseId: 'ASM-2026-00128'
  },
  {
    id: 'AUD-008',
    timestamp: '09:48 AM',
    actor: 'Priya Singh (Patient)',
    actorRole: 'Patient',
    action: 'Patient registered with demo Aadhaar',
    details: 'Simulated OTP verification for demo Aadhaar ending 5219; consent recorded in state ledger',
    ipHash: 'sha256-77ca...12fa',
    caseId: 'PAT-2026-00128'
  }
];

export const SAMPLE_REPORTS_LIBRARY = [
  {
    id: 'SAMPLE-CBC',
    title: 'Complete Blood Count (CBC) with Platelets',
    hospital: 'Capital Hospital Laboratory Services, Bhubaneswar',
    sampleType: 'Whole Blood EDTA',
    date: '2026-09-24',
    badge: 'Hematology',
    summary: 'Elevated WBC count (14,200 /µL) with elevated Neutrophils (82%). Hemoglobin: 12.4 g/dL, Platelets: 215,000 /µL.',
    rawOcrText: `CAPITAL HOSPITAL BHUBANESWAR - CENTRAL PATHOLOGY LAB
PATIENT: RIYA DAS | AGE: 34 / F | REF BY: DR. CLINICAL TRIAGE
SAMPLE: WHOLE BLOOD EDTA | COLLECTION: 24/09/2026 08:15 AM
TEST NAME                    RESULT       UNIT       REF RANGE
Total Leukocyte Count (WBC)  14,200 [H]   /µL        4,000 - 11,000
Neutrophils                  82 [H]       %          40 - 70
Lymphocytes                  13 [L]       %          20 - 45
Eosinophils                  3            %          1 - 6
Monocytes                    2            %          2 - 8
Hemoglobin                   12.4         g/dL       12.0 - 15.5
Platelet Count               215,000      /µL        150,000 - 450,000
ESR (Westergren 1 hr)        38 [H]       mm/hr      0 - 20
--- REPORT EXTRACTED VIA OPTICAL CHARACTER RECOGNITION (OCR) ---`,
    tests: [
      { testName: 'Total Leukocyte Count (WBC)', result: '14,200', unit: '/µL', referenceRange: '4,000 - 11,000', isAbnormal: true, severity: 'moderate' as const },
      { testName: 'Neutrophils', result: '82', unit: '%', referenceRange: '40 - 70', isAbnormal: true, severity: 'moderate' as const },
      { testName: 'Lymphocytes', result: '13', unit: '%', referenceRange: '20 - 45', isAbnormal: true, severity: 'mild' as const },
      { testName: 'Hemoglobin', result: '12.4', unit: 'g/dL', referenceRange: '12.0 - 15.5', isAbnormal: false },
      { testName: 'Platelet Count', result: '215,000', unit: '/µL', referenceRange: '150,000 - 450,000', isAbnormal: false },
      { testName: 'ESR (1st Hour)', result: '38', unit: 'mm/hr', referenceRange: '0 - 20', isAbnormal: true, severity: 'mild' as const }
    ]
  },
  {
    id: 'SAMPLE-CHEST-XRAY',
    title: 'Chest Radiograph (PA View) Report',
    hospital: 'All India Institute of Medical Sciences (AIIMS) Bhubaneswar',
    sampleType: 'Digital Radiography',
    date: '2026-09-23',
    badge: 'Radiology',
    summary: 'Subtle patchy opacities in right lower zone. Costophrenic angles clear. Cardiothoracic ratio within normal physiological limits.',
    rawOcrText: `DEPARTMENT OF RADIODIAGNOSIS - AIIMS BHUBANESWAR
EXAMINATION: CHEST X-RAY PA VIEW
FINDINGS:
- Bronchovascular markings mildly prominent in bilateral perihilar regions.
- Mild patchy ill-defined airspace opacity noted in the right lower lung zone.
- Bilateral costophrenic and cardiophrenic angles appear clear.
- Cardiac silhouette is normal in shape and size (CTR < 0.50).
- Bony thorax and visualized soft tissues appear unremarkable.
IMPRESSION: Mild right lower zone parenchymal infiltrate. Correlate clinically with inflammatory/infectious markers.
--- OPTICAL CHARACTER RECOGNITION EXTRACTED ---`,
    tests: [
      { testName: 'Right Lower Zone Airspace', result: 'Patchy opacity noted', unit: '', referenceRange: 'Clear / Radiolucent', isAbnormal: true, severity: 'moderate' as const },
      { testName: 'Costophrenic Angles', result: 'Clear bilaterally', unit: '', referenceRange: 'Clear', isAbnormal: false },
      { testName: 'Cardiothoracic Ratio', result: '< 0.50 Normal', unit: '', referenceRange: '< 0.50', isAbnormal: false }
    ]
  },
  {
    id: 'SAMPLE-METABOLIC',
    title: 'Random Blood Glucose & Renal Function Panel',
    hospital: 'District Headquarters Hospital (DHH) Khordha',
    sampleType: 'Serum / Fluoride Plasma',
    date: '2026-09-22',
    badge: 'Biochemistry',
    summary: 'Blood Sugar Random: 142 mg/dL. Serum Creatinine: 0.9 mg/dL. Blood Urea: 24 mg/dL. Electrolytes within normal limits.',
    rawOcrText: `DHH KHORDHA - CLINICAL BIOCHEMISTRY
TEST NAME               RESULT     UNIT     REFERENCE RANGE
Blood Glucose (Random)  142 [H]    mg/dL    70 - 140
Serum Creatinine        0.9        mg/dL    0.6 - 1.2
Blood Urea              24         mg/dL    15 - 40
Serum Sodium (Na+)      139        mEq/L    135 - 145
Serum Potassium (K+)    4.2        mEq/L    3.5 - 5.0
--- OCR VERIFIED ---`,
    tests: [
      { testName: 'Blood Glucose (Random)', result: '142', unit: 'mg/dL', referenceRange: '70 - 140', isAbnormal: true, severity: 'mild' as const },
      { testName: 'Serum Creatinine', result: '0.9', unit: 'mg/dL', referenceRange: '0.6 - 1.2', isAbnormal: false },
      { testName: 'Blood Urea', result: '24', unit: 'mg/dL', referenceRange: '15 - 40', isAbnormal: false }
    ]
  }
];
