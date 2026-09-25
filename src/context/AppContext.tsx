import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  PatientUser, 
  DoctorUser, 
  Assessment, 
  AuditEvent, 
  ReferralDraft, 
  UserRole,
  ConsentCategories,
  Facility,
  AuthSession,
  PatientIdentity,
  ProfessionalIdentity,
  AppPermission,
  AuditEventType,
  PATIENT_PERMISSIONS,
  PROFESSIONAL_PERMISSIONS
} from '../types';
import { 
  MOCK_PATIENTS, 
  MOCK_DOCTORS, 
  INITIAL_ASSESSMENTS, 
  INITIAL_AUDIT_LOGS,
  CAREQ_FACILITIES
} from '../data/mockData';

const DEFAULT_PATIENT_IDENTITY: PatientIdentity = {
  userId: 'USR-DEMO-001',
  role: 'PATIENT',
  patientId: 'PAT-2026-00124',
  name: 'Riya Das',
  age: 28,
  gender: 'Female',
  phone: '+91 98765 43210',
  abhaNumber: '91-4820-9481-2041',
  verifiedStatus: 'DEMO_VERIFIED'
};

const DEFAULT_PROFESSIONAL_IDENTITY: ProfessionalIdentity = {
  userId: 'USR-DEMO-002',
  role: 'HEALTHCARE_PROFESSIONAL',
  professionalId: 'PROF-DEMO-00451',
  name: 'Dr. Ananya Sharma',
  title: 'Medical Officer',
  facilityId: 'FAC-DEMO-OD-001',
  facilityName: 'CAREQ Demo Primary Health Centre, Jatni',
  medicalRegistrationId: 'NMC-84920',
  state: 'Odisha',
  verifiedStatus: 'DEMO_VERIFIED'
};

interface AppContextType {
  currentRole: UserRole;
  isPatient: boolean;
  isProfessional: boolean;
  currentSession: AuthSession | null;
  patientIdentity: PatientIdentity | null;
  professionalIdentity: ProfessionalIdentity | null;
  verifiedRoles: UserRole[];
  currentPatient: PatientUser | null;
  currentDoctor: DoctorUser | null;
  currentFacility: string;
  facilityId: string;
  availableFacilities: Facility[];
  currentRoute: string;
  assessments: Assessment[];
  selectedAssessment: Assessment | null;
  selectedAssessmentId: string | null;
  auditLogs: AuditEvent[];
  isPrivacyModalOpen: boolean;
  isDemoGuideOpen: boolean;
  demoGuideStep: number;
  isWorkspaceSwitchModalOpen: boolean;
  targetSwitchRole: UserRole | null;
  navigate: (route: string) => void;
  switchRole: (role: any) => void;
  switchFacility: (facilityName: string, id: string) => void;
  setCurrentRoute: (route: string) => void;
  setSelectedAssessmentId: (id: string | null) => void;
  loginAsPatient: (patientId?: string) => void;
  loginAsDoctor: (doctorId?: string) => void;
  logout: () => void;
  openWorkspaceSwitcher: (targetRole?: UserRole) => void;
  setWorkspaceSwitchModalOpen: (open: boolean) => void;
  switchWorkspace: (
    targetRole: UserRole,
    stepUpData?: {
      challengeType: 'PIN' | 'OTP';
      code: string;
      clinicalJustification?: string;
    }
  ) => Promise<{ success: boolean; message: string }>;
  hasPermission: (permission: AppPermission | string) => boolean;
  isAuthorizedForRoute: (route: string) => boolean;
  addAssessment: (newAssessment: Assessment) => void;
  updateAssessment: (id: string, updates: Partial<Assessment>) => void;
  addAuditEvent: (action: string, actor: string, role: AuditEvent['actorRole'], details: string, caseId?: string, eventType?: AuditEventType) => void;
  markAssessmentReviewed: (assessmentId: string, clinicalNotes: string) => void;
  requestFollowUp: (assessmentId: string, question: string, rationale: string, responseType?: 'text' | 'voice' | 'choice') => void;
  markQuestionAnswered: (assessmentId: string, questionId: string, answer: string) => void;
  saveReferralNote: (referral: ReferralDraft) => void;
  updatePatientConsent: (categories: ConsentCategories) => void;
  setPrivacyModalOpen: (open: boolean) => void;
  setDemoGuideOpen: (open: boolean) => void;
  setDemoGuideStep: (step: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPatient, setCurrentPatient] = useState<PatientUser | null>(MOCK_PATIENTS[0]); // Riya Das
  const [currentDoctor, setCurrentDoctor] = useState<DoctorUser | null>(MOCK_DOCTORS[0]); // Dr. Ananya Sharma
  const [patientIdentity, setPatientIdentity] = useState<PatientIdentity | null>(DEFAULT_PATIENT_IDENTITY);
  const [professionalIdentity, setProfessionalIdentity] = useState<ProfessionalIdentity | null>(DEFAULT_PROFESSIONAL_IDENTITY);
  
  // Role-scoped session isolation (Section 17)
  const [currentSession, setCurrentSession] = useState<AuthSession | null>(() => {
    return {
      sessionId: 'SES-INIT-PAT-9042',
      userId: 'USR-DEMO-001',
      role: 'PATIENT',
      identityId: 'PAT-2026-00124',
      permissions: PATIENT_PERMISSIONS,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      verifiedRoles: ['PATIENT', 'HEALTHCARE_PROFESSIONAL'],
      patientIdentity: DEFAULT_PATIENT_IDENTITY,
      professionalIdentity: DEFAULT_PROFESSIONAL_IDENTITY
    };
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('PATIENT');
  const [currentFacility, setCurrentFacility] = useState<string>('CAREQ Demo Primary Health Centre, Jatni');
  const [facilityId, setFacilityId] = useState<string>('FAC-DEMO-OD-001');
  const [currentRoute, setCurrentRoute] = useState<string>('/patient/dashboard');
  
  // Workspace Switch Modal State
  const [isWorkspaceSwitchModalOpen, setWorkspaceSwitchModalOpen] = useState(false);
  const [targetSwitchRole, setTargetSwitchRole] = useState<UserRole | null>(null);

  const isPatient = currentRole === 'PATIENT';
  const isProfessional = currentRole === 'HEALTHCARE_PROFESSIONAL';
  const verifiedRoles: UserRole[] = currentSession?.verifiedRoles || ['PATIENT', 'HEALTHCARE_PROFESSIONAL'];

  const [assessments, setAssessments] = useState<Assessment[]>(() => {
    const saved = localStorage.getItem('careq_assessments');
    return saved ? JSON.parse(saved) : INITIAL_ASSESSMENTS;
  });

  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>('ASM-2026-00124');
  
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(() => {
    const saved = localStorage.getItem('careq_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [isPrivacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [isDemoGuideOpen, setDemoGuideOpen] = useState(false);
  const [demoGuideStep, setDemoGuideStep] = useState(1);

  useEffect(() => {
    localStorage.setItem('careq_assessments', JSON.stringify(assessments));
  }, [assessments]);

  useEffect(() => {
    localStorage.setItem('careq_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const navigate = (route: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentRoute(route);
  };

  const hasPermission = (permission: AppPermission | string): boolean => {
    if (!currentSession) return false;
    return currentSession.permissions.includes(permission as any);
  };

  const isAuthorizedForRoute = (route: string): boolean => {
    if (!currentSession) {
      return route.startsWith('/login') || route.startsWith('/register') || route.startsWith('/verify');
    }
    if (currentSession.role === 'PATIENT') {
      return !route.startsWith('/clinical') && !route.startsWith('/doctor');
    }
    if (currentSession.role === 'HEALTHCARE_PROFESSIONAL') {
      return !route.startsWith('/patient');
    }
    return false;
  };

  // Open Workspace Switcher Modal (Section 16)
  const openWorkspaceSwitcher = (targetRole?: UserRole) => {
    const defaultTarget: UserRole = currentRole === 'PATIENT' ? 'HEALTHCARE_PROFESSIONAL' : 'PATIENT';
    setTargetSwitchRole(targetRole || defaultTarget);
    setWorkspaceSwitchModalOpen(true);
  };

  // Execute High-Assurance Workspace Switch (Sections 7, 16, 18, 26, 27)
  const switchWorkspace = async (
    targetRole: UserRole,
    stepUpData?: {
      challengeType: 'PIN' | 'OTP';
      code: string;
      clinicalJustification?: string;
    }
  ): Promise<{ success: boolean; message: string }> => {
    if (!currentSession?.verifiedRoles.includes(targetRole)) {
      addAuditEvent(
        'Workspace Access Denied',
        currentRole === 'PATIENT' ? 'Patient' : 'Healthcare Worker',
        'System Triage',
        `Attempted workspace switch to unverified role: ${targetRole}`,
        undefined,
        'WORKSPACE_ACCESS_DENIED'
      );
      return { success: false, message: `Role ${targetRole} is not an independently verified identity for this account.` };
    }

    // 1. Audit Switch Request
    addAuditEvent(
      'Workspace Switch Requested',
      currentRole === 'PATIENT' ? (currentPatient?.name || 'Riya Das') : (currentDoctor?.name || 'Dr. Ananya Sharma'),
      currentRole === 'PATIENT' ? 'Patient' : 'Healthcare Worker',
      `Secure workspace transition requested: ${currentRole} -> ${targetRole}. High-assurance re-authentication initiated.`,
      undefined,
      'WORKSPACE_SWITCH_REQUESTED'
    );

    // 2. High-Assurance Step-Up Verification Challenge
    let stepUpToken = `STU-LOCAL-${Date.now().toString(36).toUpperCase()}`;
    if (stepUpData) {
      addAuditEvent(
        'Step-Up Challenge Issued',
        targetRole === 'HEALTHCARE_PROFESSIONAL' ? (currentDoctor?.name || 'Dr. Ananya Sharma') : (currentPatient?.name || 'Riya Das'),
        targetRole === 'HEALTHCARE_PROFESSIONAL' ? 'Healthcare Worker' : 'Patient',
        `High-assurance ${stepUpData.challengeType} challenge presented for ${targetRole} credential verification.`,
        undefined,
        'STEP_UP_CHALLENGE_ISSUED'
      );

      try {
        const response = await fetch('/api/auth/step-up-challenge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetRole,
            challengeType: stepUpData.challengeType,
            code: stepUpData.code,
            clinicalJustification: stepUpData.clinicalJustification
          })
        });

        const resData = await response.json();

        if (!response.ok || !resData.success) {
          addAuditEvent(
            'Step-Up Challenge Failed',
            targetRole === 'HEALTHCARE_PROFESSIONAL' ? (currentDoctor?.name || 'Dr. Ananya Sharma') : (currentPatient?.name || 'Riya Das'),
            targetRole === 'HEALTHCARE_PROFESSIONAL' ? 'Healthcare Worker' : 'Patient',
            `Step-up challenge rejected: ${resData.message || 'Incorrect credentials'}. Transition aborted.`,
            undefined,
            'STEP_UP_CHALLENGE_FAILED'
          );
          return { success: false, message: resData.message || 'Invalid step-up verification code.' };
        }

        stepUpToken = resData.stepUpToken || stepUpToken;

        addAuditEvent(
          'Step-Up Challenge Verified',
          targetRole === 'HEALTHCARE_PROFESSIONAL' ? (currentDoctor?.name || 'Dr. Ananya Sharma') : (currentPatient?.name || 'Riya Das'),
          targetRole === 'HEALTHCARE_PROFESSIONAL' ? 'Healthcare Worker' : 'Patient',
          `High-assurance identity verification succeeded. Token: ${stepUpToken.substring(0, 16)}... Reason: ${stepUpData.clinicalJustification || 'Clinical Duty'}`,
          undefined,
          'STEP_UP_CHALLENGE_VERIFIED'
        );
      } catch {
        // Fallback local verification
        const isDocValid = targetRole === 'HEALTHCARE_PROFESSIONAL' && (stepUpData.code === '482910' || stepUpData.code === '719402');
        const isPatValid = targetRole === 'PATIENT' && (stepUpData.code === '123456' || stepUpData.code === '654321');
        if (!isDocValid && !isPatValid) {
          addAuditEvent(
            'Step-Up Challenge Failed',
            targetRole === 'HEALTHCARE_PROFESSIONAL' ? (currentDoctor?.name || 'Dr. Ananya Sharma') : (currentPatient?.name || 'Riya Das'),
            targetRole === 'HEALTHCARE_PROFESSIONAL' ? 'Healthcare Worker' : 'Patient',
            `Step-up verification code rejected (Local fallback check).`,
            undefined,
            'STEP_UP_CHALLENGE_FAILED'
          );
          return { success: false, message: 'Invalid verification code. Please check your credentials.' };
        }
      }
    }

    // 3. Clear role-scoped state to prevent data leakage (Section 18)
    setSelectedAssessmentId(null);

    // 4. Issue new role-scoped session with High Assurance
    const newSessionId = `SES-${Date.now().toString(36).toUpperCase()}`;
    const newPermissions = targetRole === 'PATIENT' ? PATIENT_PERMISSIONS : PROFESSIONAL_PERMISSIONS;
    const newIdentityId = targetRole === 'PATIENT' 
      ? (patientIdentity?.patientId || 'PAT-2026-00124') 
      : (professionalIdentity?.professionalId || 'PROF-DEMO-00451');

    const newSession: AuthSession = {
      sessionId: newSessionId,
      userId: targetRole === 'PATIENT' ? (patientIdentity?.userId || 'USR-DEMO-001') : (professionalIdentity?.userId || 'USR-DEMO-002'),
      role: targetRole,
      identityId: newIdentityId,
      permissions: newPermissions,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      verifiedRoles: currentSession.verifiedRoles,
      authAssuranceLevel: 'HIGH_ASSURANCE',
      stepUpVerifiedAt: new Date().toISOString(),
      clinicalJustification: stepUpData?.clinicalJustification || (targetRole === 'HEALTHCARE_PROFESSIONAL' ? 'Primary Health Shift Review' : 'Personal Health Access'),
      patientIdentity: patientIdentity || undefined,
      professionalIdentity: professionalIdentity || undefined
    };

    setCurrentSession(newSession);
    setCurrentRole(targetRole);

    // 5. Audit Switch Completed
    addAuditEvent(
      'Workspace Switch Completed',
      targetRole === 'PATIENT' ? (currentPatient?.name || 'Riya Das') : (currentDoctor?.name || 'Dr. Ananya Sharma'),
      targetRole === 'PATIENT' ? 'Patient' : 'Healthcare Worker',
      `High-Assurance workspace transition complete. Session ${newSessionId} issued with ${newPermissions.length} permissions. Level: HIGH_ASSURANCE.`,
      undefined,
      'WORKSPACE_SWITCH_COMPLETED'
    );

    // 6. Navigate to target workspace
    if (targetRole === 'PATIENT') {
      navigate('/patient/dashboard');
    } else {
      navigate('/clinical/dashboard');
    }

    return { success: true, message: 'Workspace switch verified and authorized.' };
  };

  const switchRole = (newRole: UserRole | 'patient' | 'doctor') => {
    const mappedRole: UserRole = (newRole === 'doctor' || newRole === 'HEALTHCARE_PROFESSIONAL') 
      ? 'HEALTHCARE_PROFESSIONAL' 
      : 'PATIENT';
    openWorkspaceSwitcher(mappedRole);
  };

  const loginAsPatient = (patientId?: string) => {
    const foundPatient = MOCK_PATIENTS.find(p => p.id === patientId) || MOCK_PATIENTS[0];
    setCurrentPatient(foundPatient);
    const newSessionId = `SES-PAT-${Date.now().toString(36).toUpperCase()}`;
    const newIdentity: PatientIdentity = {
      userId: `USR-${foundPatient.id.toUpperCase()}`,
      role: 'PATIENT',
      patientId: `PAT-2026-${foundPatient.id.slice(-5)}`,
      name: foundPatient.name,
      age: foundPatient.age,
      gender: foundPatient.gender,
      phone: foundPatient.phone,
      verifiedStatus: 'DEMO_VERIFIED'
    };
    setPatientIdentity(newIdentity);
    const newSession: AuthSession = {
      sessionId: newSessionId,
      userId: newIdentity.userId,
      role: 'PATIENT',
      identityId: newIdentity.patientId,
      permissions: PATIENT_PERMISSIONS,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      verifiedRoles: ['PATIENT', 'HEALTHCARE_PROFESSIONAL'],
      patientIdentity: newIdentity,
      professionalIdentity: professionalIdentity || undefined
    };
    setCurrentSession(newSession);
    setCurrentRole('PATIENT');
    setSelectedAssessmentId(null);
    addAuditEvent(
      'Patient Sign In',
      foundPatient.name,
      'Patient',
      `Authenticated with Demo Identity Verification. Session ${newSessionId} issued.`,
      undefined,
      'PATIENT_LOGIN'
    );
    navigate('/patient/dashboard');
  };

  const loginAsDoctor = (doctorId?: string) => {
    const foundDoctor = MOCK_DOCTORS.find(d => d.id === doctorId) || MOCK_DOCTORS[0];
    setCurrentDoctor(foundDoctor);
    const newSessionId = `SES-PROF-${Date.now().toString(36).toUpperCase()}`;
    const newIdentity: ProfessionalIdentity = {
      userId: `USR-${foundDoctor.id.toUpperCase()}`,
      role: 'HEALTHCARE_PROFESSIONAL',
      professionalId: `PROF-DEMO-00${foundDoctor.id.slice(-3)}`,
      name: foundDoctor.name,
      title: foundDoctor.role,
      medicalRegistrationId: `MCI-${foundDoctor.id.toUpperCase()}-2024`,
      facilityId: facilityId || 'FAC-DEMO-OD-001',
      facilityName: currentFacility,
      state: 'Odisha',
      verifiedStatus: 'DEMO_VERIFIED'
    };
    setProfessionalIdentity(newIdentity);
    const newSession: AuthSession = {
      sessionId: newSessionId,
      userId: newIdentity.userId,
      role: 'HEALTHCARE_PROFESSIONAL',
      identityId: newIdentity.professionalId,
      permissions: PROFESSIONAL_PERMISSIONS,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      verifiedRoles: ['PATIENT', 'HEALTHCARE_PROFESSIONAL'],
      patientIdentity: patientIdentity || undefined,
      professionalIdentity: newIdentity
    };
    setCurrentSession(newSession);
    setCurrentRole('HEALTHCARE_PROFESSIONAL');
    setSelectedAssessmentId(null);
    addAuditEvent(
      'Healthcare Professional Sign In',
      foundDoctor.name,
      'Healthcare Worker',
      `Authenticated with Demo Medical Officer Credentials. Session ${newSessionId} issued.`,
      undefined,
      'PROFESSIONAL_LOGIN'
    );
    navigate('/clinical/dashboard');
  };

  const logout = () => {
    const actorName = currentRole === 'PATIENT' ? (currentPatient?.name || 'Patient') : (currentDoctor?.name || 'Doctor');
    const actorRole = currentRole === 'PATIENT' ? 'Patient' : 'Healthcare Worker';
    const eventType: AuditEventType = currentRole === 'PATIENT' ? 'PATIENT_LOGOUT' : 'PROFESSIONAL_LOGOUT';
    addAuditEvent(
      'Session Terminated / Sign Out',
      actorName,
      actorRole,
      `User signed out. Role-scoped session invalidated and temporary state purged.`,
      undefined,
      eventType
    );
    setCurrentSession(null);
    setSelectedAssessmentId(null);
    navigate('/login');
  };

  const switchFacility = (facilityName: string, id: string) => {
    setCurrentFacility(facilityName);
    setFacilityId(id);
    addAuditEvent(
      'Facility Context Switched',
      currentDoctor?.name || 'Dr. Ananya Sharma',
      'Healthcare Worker',
      `Practitioner switched active facility context to: ${facilityName} (${id})`
    );
  };

  const addAuditEvent = (
    action: string, 
    actor: string, 
    role: AuditEvent['actorRole'], 
    details: string, 
    caseId?: string,
    eventType?: AuditEventType
  ) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLog: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: timeStr,
      actor,
      actorRole: role,
      action,
      details,
      ipHash: `sha256-${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
      caseId,
      eventType: eventType || (role === 'Patient' ? 'PATIENT_RECORD_VIEWED' : 'CLINICAL_CASE_OPENED')
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addAssessment = (newAssessment: Assessment) => {
    setAssessments(prev => [newAssessment, ...prev]);
    setSelectedAssessmentId(newAssessment.id);
    addAuditEvent(
      'New Assessment Submitted',
      newAssessment.patientName,
      'Patient',
      `Triage assessment submitted with informed consent. Urgency Signal: ${newAssessment.riskLevel}`,
      newAssessment.id
    );
  };

  const updateAssessment = (id: string, updates: Partial<Assessment>) => {
    setAssessments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const markAssessmentReviewed = (assessmentId: string, clinicalNotes: string) => {
    const reviewerName = currentDoctor?.name || 'Dr. Ananya Sharma';
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    updateAssessment(assessmentId, {
      status: 'REVIEWED',
      reviewedBy: reviewerName,
      reviewedAt: `Today, ${nowStr}`,
      clinicalNotes
    });
    addAuditEvent(
      'Completed review',
      reviewerName,
      'Healthcare Worker',
      `Clinical review completed. Note: "${clinicalNotes.substring(0, 48)}..."`,
      assessmentId
    );
  };

  const requestFollowUp = (
    assessmentId: string, 
    question: string, 
    rationale: string,
    responseType: 'text' | 'voice' | 'choice' = 'text'
  ) => {
    const reviewerName = currentDoctor?.name || 'Dr. Ananya Sharma';
    setAssessments(prev => prev.map(a => {
      if (a.id === assessmentId) {
        const newQ = {
          id: `fq-${Date.now().toString().slice(-3)}`,
          question,
          rationale,
          status: 'ASKED' as const,
          responseType,
          sourceSignal: 'Clinical review inquiry'
        };
        return {
          ...a,
          status: 'INFO_REQUESTED',
          followUpQuestions: [newQ, ...a.followUpQuestions]
        };
      }
      return a;
    }));
    addAuditEvent(
      'Requested information',
      reviewerName,
      'Healthcare Worker',
      `Sent inquiry to patient: "${question}" (Expected: ${responseType})`,
      assessmentId
    );
  };

  const markQuestionAnswered = (assessmentId: string, questionId: string, answer: string) => {
    setAssessments(prev => prev.map(a => {
      if (a.id === assessmentId) {
        return {
          ...a,
          followUpQuestions: a.followUpQuestions.map(q => 
            q.id === questionId ? { ...q, status: 'ANSWERED', answer } : q
          )
        };
      }
      return a;
    }));
    addAuditEvent(
      'Submitted response',
      currentPatient?.name || 'Patient',
      'Patient',
      `Answer recorded: "${answer}"`,
      assessmentId
    );
  };

  const saveReferralNote = (referral: ReferralDraft) => {
    const reviewerName = currentDoctor?.name || 'Dr. Ananya Sharma';
    updateAssessment(referral.assessmentId, {
      status: 'REFERRED',
      referralNote: referral
    });
    addAuditEvent(
      'Approved Referral',
      reviewerName,
      'Healthcare Worker',
      `Structured referral approved for transfer to: ${referral.targetFacility} (${referral.priority})`,
      referral.assessmentId
    );
  };

  const updatePatientConsent = (categories: ConsentCategories) => {
    if (currentPatient) {
      const updated = {
        ...currentPatient,
        consentCategories: categories
      };
      setCurrentPatient(updated);
      addAuditEvent(
        'Consent Preferences Updated',
        currentPatient.name,
        'Patient',
        `Data sharing permissions updated in personal consent ledger.`
      );
    }
  };

  const selectedAssessment = assessments.find(a => a.id === selectedAssessmentId) || assessments[0] || null;

  return (
    <AppContext.Provider
      value={{
        currentRole,
        isPatient,
        isProfessional,
        currentSession,
        patientIdentity,
        professionalIdentity,
        verifiedRoles,
        currentPatient,
        currentDoctor,
        currentFacility,
        facilityId,
        availableFacilities: CAREQ_FACILITIES,
        currentRoute,
        assessments,
        selectedAssessment,
        selectedAssessmentId,
        auditLogs,
        isPrivacyModalOpen,
        isDemoGuideOpen,
        demoGuideStep,
        isWorkspaceSwitchModalOpen,
        targetSwitchRole,
        navigate,
        switchRole,
        switchFacility,
        setCurrentRoute,
        setSelectedAssessmentId,
        loginAsPatient,
        loginAsDoctor,
        logout,
        openWorkspaceSwitcher,
        setWorkspaceSwitchModalOpen,
        switchWorkspace,
        hasPermission,
        isAuthorizedForRoute,
        addAssessment,
        updateAssessment,
        addAuditEvent,
        markAssessmentReviewed,
        requestFollowUp,
        markQuestionAnswered,
        saveReferralNote,
        updatePatientConsent,
        setPrivacyModalOpen,
        setDemoGuideOpen,
        setDemoGuideStep,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
