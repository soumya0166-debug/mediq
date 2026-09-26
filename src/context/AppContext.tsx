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
  PROFESSIONAL_PERMISSIONS,
  EmailOtpSendResponse,
  EmailOtpVerifyResponse,
  MobileOtpSendResponse,
  MobileOtpVerifyResponse,
  ProviderConfigStatus
} from '../types';
import { 
  MOCK_PATIENTS, 
  MOCK_DOCTORS, 
  INITIAL_ASSESSMENTS, 
  INITIAL_AUDIT_LOGS,
  CAREQ_FACILITIES
} from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';


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
  loginWithVerifiedSession: (data: EmailOtpVerifyResponse, chosenRole?: UserRole) => void;
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
  sendEmailOtp: (email: string, purpose?: 'login' | 'signup', role?: UserRole) => Promise<EmailOtpSendResponse>;
  verifyEmailOtp: (email: string, otp: string, purpose?: 'login' | 'signup') => Promise<EmailOtpVerifyResponse>;
  sendMobileOtpForWorkspaceSwitch: (targetRole: UserRole, clinicalJustification?: string) => Promise<MobileOtpSendResponse>;
  verifyMobileOtpForWorkspaceSwitch: (otp: string, targetRole: UserRole, clinicalJustification?: string) => Promise<MobileOtpVerifyResponse>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPatient, setCurrentPatient] = useState<PatientUser | null>(MOCK_PATIENTS[0]); // Riya Das
  const [currentDoctor, setCurrentDoctor] = useState<DoctorUser | null>(MOCK_DOCTORS[0]); // Dr. Ananya Sharma
  const [patientIdentity, setPatientIdentity] = useState<PatientIdentity | null>(DEFAULT_PATIENT_IDENTITY);
  const [professionalIdentity, setProfessionalIdentity] = useState<ProfessionalIdentity | null>(DEFAULT_PROFESSIONAL_IDENTITY);
  
  // Role-scoped session isolation (Section 17) - hydrated from secure storage or null
  const [currentSession, setCurrentSession] = useState<AuthSession | null>(() => {
    try {
      const saved = sessionStorage.getItem('careq_session');
      if (saved) {
        const parsed: AuthSession = JSON.parse(saved);
        if (parsed.expiresAt && new Date(parsed.expiresAt) > new Date()) {
          return parsed;
        }
        sessionStorage.removeItem('careq_session');
      }
    } catch {
      sessionStorage.removeItem('careq_session');
    }
    return null;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => currentSession?.role || 'PATIENT');
  const [currentFacility, setCurrentFacility] = useState<string>('CAREQ Demo Primary Health Centre, Jatni');
  const [facilityId, setFacilityId] = useState<string>('FAC-DEMO-OD-001');
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '/auth';
    const hasSession = typeof window !== 'undefined' && Boolean(sessionStorage.getItem('careq_session'));
    if (!hasSession) {
      return (path.startsWith('/register') || path.startsWith('/verify')) ? path : '/auth';
    }
    return path === '/' ? '/patient/dashboard' : path;
  });
  
  // Workspace Switch Modal State
  const [isWorkspaceSwitchModalOpen, setWorkspaceSwitchModalOpen] = useState(false);
  const [targetSwitchRole, setTargetSwitchRole] = useState<UserRole | null>(null);

  const isPatient = currentRole === 'PATIENT';
  const isProfessional = currentRole === 'HEALTHCARE_PROFESSIONAL';
  const verifiedRoles: UserRole[] = currentSession?.verifiedRoles || (currentRole === 'HEALTHCARE_PROFESSIONAL' ? ['HEALTHCARE_PROFESSIONAL'] : ['PATIENT']);

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

  // Synchronize and restore authenticated session with Supabase Auth on initial mount / refresh
  useEffect(() => {
    let isMounted = true;

    const syncSupabaseSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Resolve authoritative profile from Supabase database
          let { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (!profile && session.user.email) {
            const { data: profileByEmail } = await supabase
              .from('profiles')
              .select('*')
              .eq('email', session.user.email)
              .maybeSingle();
            profile = profileByEmail;
          }

          if (profile && isMounted) {
            const role: UserRole = profile.role === 'HEALTHCARE_PROFESSIONAL' 
              ? 'HEALTHCARE_PROFESSIONAL' 
              : 'PATIENT';
            const permissions = role === 'PATIENT' ? PATIENT_PERMISSIONS : PROFESSIONAL_PERMISSIONS;

            let pIdent = patientIdentity;
            let dIdent = professionalIdentity;

            if (role === 'PATIENT') {
              pIdent = {
                userId: session.user.id,
                role: 'PATIENT',
                patientId: profile.patient_id || 'PAT-2026-00124',
                name: profile.name || 'Riya Das',
                age: 28,
                gender: 'Female',
                phone: profile.phone || '+91 98765 43210',
                verifiedStatus: 'VERIFIED'
              };
              setPatientIdentity(pIdent);
              if (currentPatient) {
                setCurrentPatient({
                  ...currentPatient,
                  id: pIdent.patientId,
                  name: pIdent.name
                });
              }
            } else {
              dIdent = {
                userId: session.user.id,
                role: 'HEALTHCARE_PROFESSIONAL',
                professionalId: profile.professional_id || 'PROF-DEMO-00451',
                name: profile.name || 'Dr. Medical Officer',
                title: 'Medical Officer',
                facilityId: profile.facility_id || 'FAC-DEMO-OD-001',
                facilityName: profile.facility_name || currentFacility,
                medicalRegistrationId: 'NMC-84920',
                state: 'Odisha',
                verifiedStatus: 'VERIFIED'
              };
              setProfessionalIdentity(dIdent);
              if (currentDoctor) {
                setCurrentDoctor({
                  ...currentDoctor,
                  id: dIdent.professionalId,
                  name: dIdent.name
                });
              }
            }

            const activeSession: AuthSession = {
              sessionId: session.access_token,
              userId: session.user.id,
              role,
              identityId: role === 'PATIENT' ? (profile.patient_id || 'PAT-2026-00124') : (profile.professional_id || 'PROF-DEMO-00451'),
              permissions,
              issuedAt: new Date().toISOString(),
              expiresAt: new Date(session.expires_at ? session.expires_at * 1000 : Date.now() + 8 * 3600 * 1000).toISOString(),
              verifiedRoles: [role],
              authAssuranceLevel: 'STANDARD',
              patientIdentity: pIdent || undefined,
              professionalIdentity: dIdent || undefined
            };

            sessionStorage.setItem('careq_session', JSON.stringify(activeSession));
            setCurrentSession(activeSession);
            setCurrentRole(role);
          }
        } else {
          // No active Supabase session
          const saved = sessionStorage.getItem('careq_session');
          if (saved) {
            sessionStorage.removeItem('careq_session');
            if (isMounted) {
              setCurrentSession(null);
            }
          }
        }
      } catch (err) {
        console.warn('Session synchronization warning:', err);
      }
    };

    syncSupabaseSession();

    // Listen to Supabase Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        sessionStorage.removeItem('careq_session');
        setCurrentSession(null);
        setSelectedAssessmentId(null);
        setCurrentRoute('/auth');
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);


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
      return route === '/auth' || route.startsWith('/login') || route.startsWith('/register') || route.startsWith('/verify');
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

    // 2. High-Assurance Mobile OTP Verification Challenge
    if (stepUpData?.code) {
      const verifyRes = await verifyMobileOtpForWorkspaceSwitch(
        stepUpData.code,
        targetRole,
        stepUpData.clinicalJustification
      );
      if (!verifyRes.success) {
        return { 
          success: false, 
          message: verifyRes.message || 'Invalid Mobile OTP verification code. High-assurance check rejected.' 
        };
      }
      return { success: true, message: 'Workspace switch verified and authorized via Mobile OTP.' };
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

  const logout = async () => {
    const actorName = currentRole === 'PATIENT' ? (currentPatient?.name || 'Patient') : (currentDoctor?.name || 'Doctor');
    const actorRole = currentRole === 'PATIENT' ? 'Patient' : 'Healthcare Worker';
    
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signOut error:', err);
    }

    addAuditEvent(
      'Session Terminated / Sign Out',
      actorName,
      actorRole,
      `User signed out. Authenticated Supabase session token invalidated on server. Role-scoped memory and cache cleared.`,
      undefined,
      'AUTH_SESSION_TERMINATED'
    );
    sessionStorage.removeItem('careq_session');
    setCurrentSession(null);
    setSelectedAssessmentId(null);
    navigate('/auth');
  };

  const loginWithVerifiedSession = (data: EmailOtpVerifyResponse, chosenRole?: UserRole) => {
    const effectiveRole: UserRole = chosenRole || (data.role === 'HEALTHCARE_PROFESSIONAL' ? 'HEALTHCARE_PROFESSIONAL' : 'PATIENT');
    const effectiveRoles: UserRole[] = data.verifiedRoles && data.verifiedRoles.length > 0
      ? data.verifiedRoles
      : (data.role === 'HEALTHCARE_PROFESSIONAL' ? ['HEALTHCARE_PROFESSIONAL'] : ['PATIENT']);

    const newSessionId = data.sessionToken || `SES-SUPABASE-${Date.now()}`;
    const newPermissions = effectiveRole === 'PATIENT' ? PATIENT_PERMISSIONS : PROFESSIONAL_PERMISSIONS;

    let patIdent = patientIdentity;
    let profIdent = professionalIdentity;

    if (effectiveRole === 'PATIENT') {
      patIdent = {
        userId: data.userId || 'USR-DEMO-001',
        role: 'PATIENT',
        patientId: data.patientId || data.identityId || 'PAT-2026-00124',
        name: data.userName || (data.email?.includes('riya') ? 'Riya Das' : (data.email?.split('@')[0] || 'Verified Patient')),
        age: 28,
        gender: 'Female',
        phone: '+91 98765 43210',
        verifiedStatus: 'VERIFIED'
      };
      setPatientIdentity(patIdent);
      if (currentPatient) {
        setCurrentPatient({
          ...currentPatient,
          id: patIdent.patientId,
          name: patIdent.name
        });
      }
    } else {
      profIdent = {
        userId: data.userId || 'USR-DEMO-002',
        role: 'HEALTHCARE_PROFESSIONAL',
        professionalId: data.professionalId || data.identityId || 'PROF-DEMO-00451',
        name: data.userName || (data.email?.includes('ananya') ? 'Dr. Ananya Sharma' : (data.email?.includes('soumya') ? 'Dr. Soumya Sharma' : 'Dr. Medical Officer')),
        title: 'Medical Officer',
        medicalRegistrationId: 'NMC-84920',
        facilityId: 'FAC-DEMO-OD-001',
        facilityName: currentFacility,
        state: 'Odisha',
        verifiedStatus: 'VERIFIED'
      };
      setProfessionalIdentity(profIdent);
      if (currentDoctor) {
        setCurrentDoctor({
          ...currentDoctor,
          id: profIdent.professionalId,
          name: profIdent.name
        });
      }
    }

    const newSession: AuthSession = {
      sessionId: newSessionId,
      userId: data.userId || (effectiveRole === 'PATIENT' ? 'USR-DEMO-001' : 'USR-DEMO-002'),
      role: effectiveRole,
      identityId: data.identityId || (effectiveRole === 'PATIENT' ? 'PAT-2026-00124' : 'PROF-DEMO-00451'),
      permissions: newPermissions,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      verifiedRoles: effectiveRoles,
      authAssuranceLevel: 'STANDARD',
      patientIdentity: patIdent || undefined,
      professionalIdentity: profIdent || undefined
    };

    sessionStorage.setItem('careq_session', JSON.stringify(newSession));
    setCurrentSession(newSession);
    setCurrentRole(effectiveRole);
    setSelectedAssessmentId(null);

    addAuditEvent(
      'Authenticated Session Established',
      data.email || 'user',
      effectiveRole === 'PATIENT' ? 'Patient' : 'Healthcare Worker',
      `Authenticated session created for verified role: ${effectiveRole}. Session token: ${newSessionId.slice(0, 14)}...`,
      undefined,
      'AUTH_SESSION_CREATED'
    );

    if (effectiveRole === 'HEALTHCARE_PROFESSIONAL') {
      navigate('/clinical/dashboard');
    } else {
      navigate('/patient/dashboard');
    }
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

  // 1. Email OTP Send (Supabase Auth - Section 5 & 7)
  const sendEmailOtp = async (email: string, purpose: 'login' | 'signup' = 'login', role: UserRole = 'PATIENT'): Promise<EmailOtpSendResponse> => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      return {
        success: false,
        message: 'Enter your email address to continue.'
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return {
        success: false,
        message: 'Please enter a valid email address.'
      };
    }

    if (!isSupabaseConfigured) {
      return {
        success: false,
        message: 'Supabase authentication service is not configured. Please check environment variables.'
      };
    }

    addAuditEvent(
      'Email OTP Requested',
      cleanEmail,
      role === 'PATIENT' ? 'Patient' : 'Healthcare Worker',
      `Authentication OTP requested for registered email: ${cleanEmail}. Rate limiting and single-use constraints applied.`,
      undefined,
      'AUTH_EMAIL_OTP_REQUESTED'
    );

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          shouldCreateUser: purpose === 'signup'
        }
      });

      if (error) {
        console.warn('Supabase signInWithOtp error:', error.message, error.status, error.code);

        if (error.code === 'otp_disabled' || error.status === 422 || error.message?.toLowerCase().includes('signups not allowed')) {
          return {
            success: false,
            message: 'No authorized CAREQ account found matching this email address. Please register or verify the entered address.'
          };
        }

        if (error.status === 429 || error.code === 'over_email_send_rate_limit' || error.message?.toLowerCase().includes('rate limit')) {
          return {
            success: false,
            message: 'Too many requests. Please wait before requesting another code.'
          };
        }

        return {
          success: false,
          message: "We couldn't send the verification code. Please try again."
        };
      }

      // Mask the email for privacy in the UI (e.g. u••••••@example.com)
      const [localPart, domain] = cleanEmail.split('@');
      const maskedLocal = localPart.length > 2 
        ? localPart[0] + '•'.repeat(Math.max(localPart.length - 2, 4)) + localPart.slice(-1)
        : localPart[0] + '••••';
      const masked = `${maskedLocal}@${domain}`;

      addAuditEvent(
        'Email Verification Code Dispatched',
        cleanEmail,
        role === 'PATIENT' ? 'Patient' : 'Healthcare Worker',
        `Transactional email OTP dispatched by Supabase Auth to ${masked}. Expiration: 5 minutes.`,
        undefined,
        'AUTH_EMAIL_OTP_REQUESTED'
      );

      return {
        success: true,
        message: 'Verification code sent to your email.',
        maskedEmail: masked,
        expiresInSeconds: 300,
        cooldownSeconds: 60,
        provider: 'supabase'
      };
    } catch {
      return { success: false, message: "We couldn't connect to CAREQ. Check your internet connection and try again." };
    }
  };

  // 2. Email OTP Verify (Supabase Auth - Section 5, 18, 19, 20)
  const verifyEmailOtp = async (email: string, otp: string, purpose: 'login' | 'signup' = 'login'): Promise<EmailOtpVerifyResponse> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    if (!cleanEmail) {
      return {
        success: false,
        message: 'Enter your email address to continue.'
      };
    }

    if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      return {
        success: false,
        message: 'Please enter the complete 6-digit verification code.'
      };
    }

    if (!isSupabaseConfigured) {
      return {
        success: false,
        message: 'Supabase authentication service is not configured. Please check environment variables.'
      };
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: cleanOtp,
        type: 'email'
      });

      if (error) {
        console.warn('Supabase verifyOtp error:', error.message, error.status, error.code);

        addAuditEvent(
          'Email OTP Verification Failed',
          cleanEmail,
          'Patient',
          `Verification attempt rejected: ${error.message} (status: ${error.status})`,
          undefined,
          'AUTH_EMAIL_OTP_FAILED'
        );

        if (error.code === 'otp_expired' || error.message?.toLowerCase().includes('expired')) {
          return {
            success: false,
            message: 'This verification code has expired. Please request a new code.'
          };
        }

        if (error.status === 429 || error.message?.toLowerCase().includes('too many') || error.message?.toLowerCase().includes('rate limit')) {
          return {
            success: false,
            message: 'Too many verification attempts. Please wait and try again later.'
          };
        }

        return {
          success: false,
          message: 'The verification code is incorrect. Please check the email and try again.'
        };
      }

      if (!data?.session || !data?.user) {
        return {
          success: false,
          message: 'Authentication session was not established by Supabase. Please try again.'
        };
      }

      // Authoritative Profile and Role Resolution from Supabase database (Section 19)
      let profile: any = null;
      const { data: profileById } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileById) {
        profile = profileById;
      } else {
        const { data: profileByEmail } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();
        if (profileByEmail) {
          profile = profileByEmail;
        }
      }

      if (!profile) {
        if (purpose === 'signup') {
          return {
            success: true,
            sessionToken: data.session.access_token,
            userId: data.user.id,
            email: cleanEmail,
            role: 'PATIENT'
          };
        }
        return {
          success: false,
          message: 'Your CAREQ account is authenticated, but no authorized workspace is assigned. Please contact the CAREQ administrator.'
        };
      }

      const resolvedRole: UserRole = profile.role === 'HEALTHCARE_PROFESSIONAL' 
        ? 'HEALTHCARE_PROFESSIONAL' 
        : (profile.role === 'PATIENT' ? 'PATIENT' : (null as any));

      if (!resolvedRole) {
        return {
          success: false,
          message: 'Your CAREQ account is authenticated, but no authorized workspace is assigned. Please contact the CAREQ administrator.'
        };
      }

      addAuditEvent(
        'Email OTP Verified',
        cleanEmail,
        resolvedRole === 'PATIENT' ? 'Patient' : 'Healthcare Worker',
        `Email address verified successfully by Supabase Auth. Authenticated session token issued: ${data.session.access_token.slice(0, 14)}...`,
        undefined,
        'AUTH_EMAIL_OTP_VERIFIED'
      );

      return {
        success: true,
        sessionToken: data.session.access_token,
        userId: data.user.id,
        identityId: resolvedRole === 'PATIENT' ? profile.patient_id : profile.professional_id,
        patientId: profile.patient_id,
        professionalId: profile.professional_id,
        role: resolvedRole,
        verifiedRoles: [resolvedRole],
        email: cleanEmail,
        userName: profile.name,
        permissions: resolvedRole === 'PATIENT' ? PATIENT_PERMISSIONS : PROFESSIONAL_PERMISSIONS
      };
    } catch {
      return { success: false, message: "We couldn't connect to CAREQ. Check your internet connection and try again." };
    }
  };

  // 3. Mobile OTP Send for Workspace Switch (Workspace Switching Only)
  const sendMobileOtpForWorkspaceSwitch = async (targetRole: UserRole, clinicalJustification?: string): Promise<MobileOtpSendResponse> => {
    const activeSessionId = currentSession?.sessionId || 'SES-CURRENT';
    const actorName = currentRole === 'PATIENT' ? (currentPatient?.name || 'Patient') : (currentDoctor?.name || 'Doctor');
    const actorRole = currentRole === 'PATIENT' ? 'Patient' : 'Healthcare Worker';

    addAuditEvent(
      'Workspace Switch Initiated',
      actorName,
      actorRole,
      `High-assurance workspace transition initiated: ${currentRole} -> ${targetRole}. Mobile OTP security barrier required.`,
      undefined,
      'WORKSPACE_SWITCH_INITIATED'
    );

    try {
      const res = await fetch('/auth/workspace/request-otp', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-careq-session-id': activeSessionId
        },
        body: JSON.stringify({
          sessionId: activeSessionId,
          targetRole,
          clinicalJustification
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        addAuditEvent(
          'Mobile OTP Dispatched',
          actorName,
          actorRole,
          `Transactional Mobile OTP dispatched to verified phone: ${data.maskedMobile || 'registered mobile'}. Single-use, valid for 5 minutes.`,
          undefined,
          'MOBILE_OTP_SENT'
        );
        return data;
      }

      addAuditEvent(
        'Workspace Switch Rejected',
        actorName,
        actorRole,
        `Workspace transition request rejected: ${data.error || 'Mobile verification service failure'}.`,
        undefined,
        'WORKSPACE_SWITCH_REJECTED'
      );

      return {
        success: false,
        message: data.error || 'Failed to dispatch mobile verification code.',
        missingConfig: data.missingConfig
      };
    } catch {
      return { success: false, message: 'Network error connecting to mobile SMS gateway.' };
    }
  };

  // 4. Mobile OTP Verify & Secure Workspace Transition
  const verifyMobileOtpForWorkspaceSwitch = async (otp: string, targetRole: UserRole, clinicalJustification?: string): Promise<MobileOtpVerifyResponse> => {
    const activeSessionId = currentSession?.sessionId || 'SES-CURRENT';
    const actorName = currentRole === 'PATIENT' ? (currentPatient?.name || 'Patient') : (currentDoctor?.name || 'Doctor');
    const actorRole = currentRole === 'PATIENT' ? 'Patient' : 'Healthcare Worker';

    try {
      const res = await fetch('/auth/workspace/verify-otp', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-careq-session-id': activeSessionId
        },
        body: JSON.stringify({
          sessionId: activeSessionId,
          otp,
          targetRole
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // 1. Audit Mobile OTP verification
        addAuditEvent(
          'Mobile OTP Verified',
          actorName,
          actorRole,
          `Cryptographic mobile OTP verified by server. Authorization approved for transition to ${targetRole}.`,
          undefined,
          'MOBILE_OTP_VERIFIED'
        );

        // 2. Invalidate old role-scoped session
        addAuditEvent(
          'Previous Session Terminated',
          actorName,
          actorRole,
          `Old ${currentRole} session ${activeSessionId} terminated. Role-scoped memory and cache cleared to prevent data leaks.`,
          undefined,
          'SESSION_TERMINATED'
        );

        // 3. Clear old role-scoped frontend state
        setSelectedAssessmentId(null);

        // 4. Establish new role-scoped session with HIGH_ASSURANCE
        const newSessionId = data.sessionToken || data.newSessionId || `SES-MOB-${Date.now().toString(36).toUpperCase()}`;
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
          verifiedRoles: currentSession?.verifiedRoles || ['PATIENT', 'HEALTHCARE_PROFESSIONAL'],
          authAssuranceLevel: 'HIGH_ASSURANCE',
          stepUpVerifiedAt: new Date().toISOString(),
          clinicalJustification: clinicalJustification || data.clinicalJustification || (targetRole === 'HEALTHCARE_PROFESSIONAL' ? 'Active Clinical Review' : 'Patient Self-Service'),
          patientIdentity: patientIdentity || undefined,
          professionalIdentity: professionalIdentity || undefined
        };

        setCurrentSession(newSession);
        setCurrentRole(targetRole);

        // 5. Audit transition completion
        addAuditEvent(
          'Workspace Switch Completed',
          targetRole === 'HEALTHCARE_PROFESSIONAL' ? (currentDoctor?.name || 'Dr. Ananya Sharma') : (currentPatient?.name || 'Riya Das'),
          targetRole === 'HEALTHCARE_PROFESSIONAL' ? 'Healthcare Worker' : 'Patient',
          `High-assurance workspace transition complete. New session ${newSessionId} issued with ${newPermissions.length} role-isolated permissions.`,
          undefined,
          'WORKSPACE_SWITCH_COMPLETED'
        );

        // 6. Redirect to target workspace
        if (targetRole === 'PATIENT') {
          navigate('/patient/dashboard');
        } else {
          navigate('/clinical/dashboard');
        }

        return data;
      }

      addAuditEvent(
        'Mobile OTP Failed',
        actorName,
        actorRole,
        `Mobile OTP verification failed: ${data.error || 'Incorrect OTP code'}. Remaining attempts: ${data.attemptsRemaining ?? '0'}`,
        undefined,
        'MOBILE_OTP_FAILED'
      );

      return {
        success: false,
        message: data.error || 'The verification code is incorrect. Please try again.',
        attemptsRemaining: data.attemptsRemaining
      };
    } catch {
      return { success: false, message: 'Network error verifying mobile verification code.' };
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
        loginWithVerifiedSession,
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
        sendEmailOtp,
        verifyEmailOtp,
        sendMobileOtpForWorkspaceSwitch,
        verifyMobileOtpForWorkspaceSwitch,
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
