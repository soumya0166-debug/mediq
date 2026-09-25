export type UserRole = 'PATIENT' | 'HEALTHCARE_PROFESSIONAL';

// Backward compatibility alias for UI components
export type LegacyUserRole = 'patient' | 'doctor';

export type PatientPermission = 
  | 'patient:self:read'
  | 'patient:self:update'
  | 'patient:self:assessment:create'
  | 'patient:self:assessment:read'
  | 'patient:self:voice:create'
  | 'patient:self:reports:read'
  | 'patient:self:timeline:read'
  | 'patient:self:followup:read'
  | 'patient:self:followup:respond'
  | 'patient:self:consent:read'
  | 'patient:self:consent:update'
  | 'patient:self:referral:read';

export type ProfessionalPermission =
  | 'clinical:queue:read'
  | 'clinical:priority:read'
  | 'clinical:case:read'
  | 'clinical:case:review'
  | 'clinical:case:update'
  | 'clinical:case:request_information'
  | 'clinical:case:priority'
  | 'clinical:referral:create'
  | 'clinical:referral:read'
  | 'clinical:notes:create'
  | 'clinical:timeline:read'
  | 'clinical:reports:read'
  | 'clinical:consent:read'
  | 'clinical:audit:read';

export type AppPermission = PatientPermission | ProfessionalPermission;

export const PATIENT_PERMISSIONS: PatientPermission[] = [
  'patient:self:read',
  'patient:self:update',
  'patient:self:assessment:create',
  'patient:self:assessment:read',
  'patient:self:voice:create',
  'patient:self:reports:read',
  'patient:self:timeline:read',
  'patient:self:followup:read',
  'patient:self:followup:respond',
  'patient:self:consent:read',
  'patient:self:consent:update',
  'patient:self:referral:read'
];

export const PROFESSIONAL_PERMISSIONS: ProfessionalPermission[] = [
  'clinical:queue:read',
  'clinical:priority:read',
  'clinical:case:read',
  'clinical:case:review',
  'clinical:case:update',
  'clinical:case:request_information',
  'clinical:case:priority',
  'clinical:referral:create',
  'clinical:referral:read',
  'clinical:notes:create',
  'clinical:timeline:read',
  'clinical:reports:read',
  'clinical:consent:read',
  'clinical:audit:read'
];

export interface PatientIdentity {
  userId: string;
  role: 'PATIENT';
  patientId: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  abhaNumber?: string;
  verifiedStatus: 'DEMO_VERIFIED' | 'VERIFIED' | 'PENDING';
}

export interface ProfessionalIdentity {
  userId: string;
  role: 'HEALTHCARE_PROFESSIONAL';
  professionalId: string;
  name: string;
  title: string;
  facilityId: string;
  facilityName: string;
  medicalRegistrationId: string;
  state: string;
  verifiedStatus: 'DEMO_VERIFIED' | 'VERIFIED' | 'PENDING';
}

export interface AuthSession {
  sessionId: string;
  userId: string;
  role: UserRole;
  identityId: string;
  permissions: AppPermission[];
  issuedAt: string;
  expiresAt: string;
  verifiedRoles: UserRole[];
  patientIdentity?: PatientIdentity;
  professionalIdentity?: ProfessionalIdentity;
}

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type AssessmentStatus = 'WAITING_REVIEW' | 'IN_REVIEW' | 'REVIEWED' | 'INFO_REQUESTED' | 'REFERRED';

export interface Facility {
  id: string;
  name: string;
  type: string;
  district: string;
  state: string;
}

export interface ConsentCategories {
  symptoms: boolean;
  reports: boolean;
  voiceTranscript: boolean;
  translation: boolean;
  previousAssessments: boolean;
}

export interface PatientUser {
  id: string; // e.g. PAT-2026-00124
  name: string;
  dob: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  phone: string;
  email: string;
  preferredLanguage: string;
  demoAadhaarLast4: string;
  isVerified: boolean;
  consentGiven: boolean;
  consentCategories?: ConsentCategories;
  address?: string;
  emergencyContact?: string;
  assignedFacility?: string;
}

export interface DoctorUser {
  id: string; // e.g. DOC-NMC-84920
  name: string;
  role: 'Doctor' | 'Medical Officer' | 'Nurse' | 'Health Worker' | 'Clinical Reviewer';
  facility: string;
  facilityId: string; // e.g. FAC-DEMO-OD-001
  state: string;
  medicalRegistrationId: string;
  experienceYears: number;
  phone: string;
  email: string;
  isVerified: boolean;
  specialization?: string;
}

export interface ExtractedReportItem {
  id: string;
  reportName: string;
  reportDate: string;
  category: 'Hematology' | 'Radiology' | 'Biochemistry' | 'Microbiology';
  fileName: string;
  fileSize: string;
  ocrConfidence: number;
  tests: {
    testName: string;
    result: string;
    unit: string;
    referenceRange: string;
    isAbnormal: boolean;
    severity?: 'mild' | 'moderate' | 'critical';
  }[];
  summary: string;
}

export interface UrgencySignal {
  id: string;
  level: RiskLevel;
  signal: string;
  source: 'voice' | 'text' | 'report' | 'vitals';
  confidence: number;
  note: string;
  rawExcerpt?: string;
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  rationale: string;
  status: 'PENDING' | 'ASKED' | 'ANSWERED';
  responseType?: 'text' | 'voice' | 'choice';
  answer?: string;
  sourceSignal?: string;
}

export interface TimelineEvent {
  day: string;
  date?: string;
  title: string;
  description: string;
  source: 'patient_voice' | 'patient_text' | 'lab_report' | 'system' | 'clinician';
  actor?: string;
  status?: string;
}

export interface MissingInfoItem {
  id: string;
  field: string;
  description: string;
  importance: 'HIGH' | 'MEDIUM' | 'OPTIONAL';
}

export interface SourceTraceItem {
  id: string;
  statement: string;
  sourceType: 'voice' | 'text' | 'report' | 'questionnaire';
  sourceLabel: string;
  sourceExcerpt: string;
  confidenceScore?: number;
}

export interface FirstReportData {
  summary: string;
  source: string;
  originalLanguage: string;
  languageConfidence: number;
  transcriptionConfidence: number;
  reportedSymptoms: string[];
  reportedDuration: string;
  reportedConcerns: string[];
  otherReported?: string[];
  missingInformation: string[];
  clinicalReviewRequired: boolean;
  generatedAt: string;
  modelVersions?: string;
}

export interface ExtractedInformationData {
  symptoms: string[];
  duration: string;
  onset?: string;
  severity?: string;
  bodyLocation?: string;
  concerns: string[];
  existingConditions?: string;
  medications?: string;
  notProvided: string[];
}

export interface Assessment {
  id: string; // e.g. ASM-2026-00124
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Female' | 'Male' | 'Other';
  patientLanguage: string;
  detectedLanguage?: string;
  languageConfidence?: number;
  transcriptionConfidence?: number;
  translatedEnglishText?: string;
  rawSymptomText: string;
  voiceTranscript?: string;
  hasVoice: boolean;
  audioUrl?: string;
  audioDurationSeconds?: number;
  hasReport: boolean;
  hasImage: boolean;
  imageUrls?: string[];
  submittedAt: string;
  waitingMinutes: number;
  queuePosition: number;
  riskLevel: RiskLevel;
  status: AssessmentStatus;
  facilityId?: string;
  
  // Structured triage outputs & First Report
  firstReport?: FirstReportData;
  extractedInformation?: ExtractedInformationData;
  structuredSymptoms: string[];
  reportedDuration: string;
  reportedConcerns: string[];
  timeline: TimelineEvent[];
  missingInformation: MissingInfoItem[];
  urgencySignals: UrgencySignal[];
  followUpQuestions: FollowUpQuestion[];
  extractedReports: ExtractedReportItem[];
  sourceTraceability?: SourceTraceItem[];

  // Clinical Review
  reviewedBy?: string;
  reviewedAt?: string;
  clinicalNotes?: string;
  doctorInstructions?: string;
  referralNote?: ReferralDraft;
}

export interface ReferralDraft {
  id: string;
  assessmentId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  referringDoctor: string;
  referringFacility: string;
  referringFacilityId?: string;
  targetFacility: string;
  priority: 'Immediate' | 'Urgent (within 24h)' | 'Routine OPD';
  reasonForReferral: string;
  presentingConcerns: string;
  timelineSummary: string;
  extractedFindings: string;
  urgencySignalsList: string;
  pendingQuestions: string;
  attachmentsList: string[];
  createdAt: string;
  isDraft: boolean;
}

export type AuditEventType =
  | 'PATIENT_LOGIN'
  | 'PATIENT_LOGOUT'
  | 'PROFESSIONAL_LOGIN'
  | 'PROFESSIONAL_LOGOUT'
  | 'WORKSPACE_SWITCH_REQUESTED'
  | 'WORKSPACE_SWITCH_COMPLETED'
  | 'WORKSPACE_ACCESS_DENIED'
  | 'PATIENT_RECORD_VIEWED'
  | 'CLINICAL_CASE_OPENED'
  | 'CLINICAL_REVIEW_COMPLETED'
  | 'FOLLOWUP_REQUESTED'
  | 'REFERRAL_CREATED'
  | 'CONSENT_UPDATED'
  | 'VOICE_RECORDING_ACCESSED';

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: 'Patient' | 'Healthcare Worker' | 'System OCR' | 'System Triage';
  action: string;
  eventType?: AuditEventType;
  details: string;
  ipHash: string;
  caseId?: string;
}
