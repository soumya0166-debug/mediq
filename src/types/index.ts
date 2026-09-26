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
  authAssuranceLevel?: 'STANDARD' | 'HIGH_ASSURANCE';
  stepUpVerifiedAt?: string;
  clinicalJustification?: string;
  patientIdentity?: PatientIdentity;
  professionalIdentity?: ProfessionalIdentity;
}

export interface StepUpChallengeRequest {
  targetRole: UserRole;
  challengeType: 'PIN' | 'OTP';
  code: string;
  clinicalJustification?: string;
}

export interface StepUpChallengeResult {
  success: boolean;
  message: string;
  token?: string;
  attemptsRemaining?: number;
}

export interface EmailOtpSendResponse {
  success: boolean;
  message: string;
  maskedEmail?: string;
  cooldownSeconds?: number;
  expiresInSeconds?: number;
  providerConfigured?: boolean;
  provider?: string;
  missingConfig?: string[];
}

export interface EmailOtpVerifyResponse {
  success: boolean;
  message?: string;
  sessionToken?: string;
  role?: UserRole;
  verifiedRoles?: UserRole[];
  userId?: string;
  identityId?: string;
  email?: string;
  patientId?: string;
  professionalId?: string;
  userName?: string;
  permissions?: string[];
  attemptsRemaining?: number;
}

export interface MobileOtpSendResponse {
  success: boolean;
  message: string;
  maskedMobile?: string;
  cooldownSeconds?: number;
  expiresInSeconds?: number;
  providerConfigured?: boolean;
  provider?: string;
  missingConfig?: string[];
  code?: string;
}

export interface MobileOtpVerifyResponse {
  success: boolean;
  message?: string;
  targetRole?: UserRole;
  sessionToken?: string;
  newSession?: AuthSession;
  attemptsRemaining?: number;
}

export interface ProviderConfigStatus {
  emailProvider: string;
  emailConfigured: boolean;
  missingEmailConfig: string[];
  smsProvider: string;
  smsConfigured: boolean;
  missingSmsConfig: string[];
  isDevMode: boolean;
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
  mobileVerified?: boolean;
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
  mobileVerified?: boolean;
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
  documentType?: 'lab_report' | 'prescription' | 'radiology' | 'discharge_summary' | 'other';
  doctorName?: string;
  facilityName?: string;
  rawText?: string;
  fileUrl?: string;
  prescriptions?: {
    medicineName: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    instructions?: string;
  }[];
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
  | 'WORKSPACE_SWITCH_INITIATED'
  | 'WORKSPACE_SWITCH_COMPLETED'
  | 'WORKSPACE_SWITCH_REJECTED'
  | 'WORKSPACE_ACCESS_DENIED'
  | 'PATIENT_RECORD_VIEWED'
  | 'CLINICAL_CASE_OPENED'
  | 'CLINICAL_REVIEW_COMPLETED'
  | 'FOLLOWUP_REQUESTED'
  | 'REFERRAL_CREATED'
  | 'CONSENT_UPDATED'
  | 'VOICE_RECORDING_ACCESSED'
  | 'STEP_UP_CHALLENGE_ISSUED'
  | 'STEP_UP_CHALLENGE_VERIFIED'
  | 'STEP_UP_CHALLENGE_FAILED'
  | 'WORKSPACE_CHANGE_REQUESTED'
  | 'MOBILE_OTP_REQUESTED'
  | 'MOBILE_OTP_SENT'
  | 'MOBILE_OTP_VERIFIED'
  | 'MOBILE_OTP_FAILED'
  | 'WORKSPACE_CHANGE_DENIED'
  | 'SESSION_TERMINATED'
  | 'PATIENT_SESSION_TERMINATED'
  | 'PROFESSIONAL_SESSION_CREATED'
  | 'PROFESSIONAL_SESSION_TERMINATED'
  | 'PATIENT_SESSION_CREATED'
  | 'EMAIL_OTP_REQUESTED'
  | 'EMAIL_OTP_SENT'
  | 'EMAIL_OTP_VERIFIED'
  | 'EMAIL_OTP_FAILED'
  | 'RATE_LIMIT_TRIGGERED'
  | 'AUTH_EMAIL_OTP_REQUESTED'
  | 'AUTH_EMAIL_OTP_VERIFIED'
  | 'AUTH_EMAIL_OTP_FAILED'
  | 'AUTH_SESSION_CREATED'
  | 'AUTH_SESSION_TERMINATED'
  | 'AUTH_UNAUTHORIZED_ACCESS_ATTEMPT';

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
