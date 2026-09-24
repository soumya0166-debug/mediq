import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  PatientUser, 
  DoctorUser, 
  Assessment, 
  AuditEvent, 
  ReferralDraft, 
  UserRole 
} from '../types';
import { 
  MOCK_PATIENTS, 
  MOCK_DOCTORS, 
  INITIAL_ASSESSMENTS, 
  INITIAL_AUDIT_LOGS 
} from '../data/mockData';

interface AppContextType {
  currentRole: UserRole;
  currentPatient: PatientUser | null;
  currentDoctor: DoctorUser | null;
  currentRoute: string;
  assessments: Assessment[];
  selectedAssessment: Assessment | null;
  selectedAssessmentId: string | null;
  auditLogs: AuditEvent[];
  isPrivacyModalOpen: boolean;
  isDemoGuideOpen: boolean;
  demoGuideStep: number;
  navigate: (route: string) => void;
  switchRole: (role: UserRole) => void;
  setCurrentRoute: (route: string) => void;
  setSelectedAssessmentId: (id: string | null) => void;
  loginAsPatient: (patientId?: string) => void;
  loginAsDoctor: (doctorId?: string) => void;
  logout: () => void;
  addAssessment: (newAssessment: Assessment) => void;
  updateAssessment: (id: string, updates: Partial<Assessment>) => void;
  addAuditEvent: (action: string, actor: string, role: AuditEvent['actorRole'], details: string, caseId?: string) => void;
  markAssessmentReviewed: (assessmentId: string, clinicalNotes: string) => void;
  requestFollowUp: (assessmentId: string, question: string, rationale: string) => void;
  markQuestionAnswered: (assessmentId: string, questionId: string, answer: string) => void;
  saveReferralNote: (referral: ReferralDraft) => void;
  setPrivacyModalOpen: (open: boolean) => void;
  setDemoGuideOpen: (open: boolean) => void;
  setDemoGuideStep: (step: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('patient');
  const [currentPatient, setCurrentPatient] = useState<PatientUser | null>(MOCK_PATIENTS[0]); // Riya Das
  const [currentDoctor, setCurrentDoctor] = useState<DoctorUser | null>(MOCK_DOCTORS[0]); // Dr. Ananya Sharma
  const [currentRoute, setCurrentRoute] = useState<string>('/patient/dashboard');
  const [assessments, setAssessments] = useState<Assessment[]>(() => {
    const saved = localStorage.getItem('swasthyasetu_assessments');
    return saved ? JSON.parse(saved) : INITIAL_ASSESSMENTS;
  });
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>('ASM-2026-00124');
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(() => {
    const saved = localStorage.getItem('swasthyasetu_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });
  const [isPrivacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [isDemoGuideOpen, setDemoGuideOpen] = useState(false);
  const [demoGuideStep, setDemoGuideStep] = useState(1);

  useEffect(() => {
    localStorage.setItem('swasthyasetu_assessments', JSON.stringify(assessments));
  }, [assessments]);

  useEffect(() => {
    localStorage.setItem('swasthyasetu_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const navigate = (route: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentRoute(route);
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'patient') {
      if (!currentPatient) setCurrentPatient(MOCK_PATIENTS[0]);
      navigate('/patient/dashboard');
    } else if (role === 'doctor') {
      if (!currentDoctor) setCurrentDoctor(MOCK_DOCTORS[0]);
      navigate('/doctor/dashboard');
    }
  };

  const loginAsPatient = (patientId = 'PAT-2026-00124') => {
    const found = MOCK_PATIENTS.find(p => p.id === patientId) || MOCK_PATIENTS[0];
    setCurrentPatient(found);
    setCurrentRole('patient');
    navigate('/patient/dashboard');
    addAuditEvent('Patient authenticated', found.name, 'Patient', `Logged in via verified demo session ID: ${found.id}`);
  };

  const loginAsDoctor = (doctorId = 'DOC-NMC-84920') => {
    const found = MOCK_DOCTORS.find(d => d.id === doctorId) || MOCK_DOCTORS[0];
    setCurrentDoctor(found);
    setCurrentRole('doctor');
    navigate('/doctor/dashboard');
    addAuditEvent('Healthcare worker authenticated', found.name, 'Healthcare Worker', `Verified session initialized. Registration: ${found.medicalRegistrationId}`);
  };

  const logout = () => {
    navigate('/login');
  };

  const addAuditEvent = (
    action: string, 
    actor: string, 
    role: AuditEvent['actorRole'], 
    details: string, 
    caseId?: string
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
      caseId
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
      `Multimodal triage note prepared. Risk priority calculated: ${newAssessment.riskLevel}`,
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
      'Case marked reviewed',
      reviewerName,
      'Healthcare Worker',
      `Clinical review completed. Clinical note documented: "${clinicalNotes.substring(0, 45)}..."`,
      assessmentId
    );
  };

  const requestFollowUp = (assessmentId: string, question: string, rationale: string) => {
    const reviewerName = currentDoctor?.name || 'Dr. Ananya Sharma';
    setAssessments(prev => prev.map(a => {
      if (a.id === assessmentId) {
        const newQ = {
          id: `fq-${Date.now().toString().slice(-3)}`,
          question,
          rationale,
          status: 'ASKED' as const,
          sourceSignal: 'Clinical review follow-up'
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
      'Follow-up question requested',
      reviewerName,
      'Healthcare Worker',
      `Sent clinical inquiry to patient: "${question}"`,
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
      'Patient response received',
      'Patient Portal Subsystem',
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
      'Referral Note Prepared',
      reviewerName,
      'Healthcare Worker',
      `Structured referral generated for target facility: ${referral.targetFacility} (${referral.priority})`,
      referral.assessmentId
    );
  };

  const selectedAssessment = assessments.find(a => a.id === selectedAssessmentId) || assessments[0] || null;

  return (
    <AppContext.Provider
      value={{
        currentRole,
        currentPatient,
        currentDoctor,
        currentRoute,
        assessments,
        selectedAssessment,
        selectedAssessmentId,
        auditLogs,
        isPrivacyModalOpen,
        isDemoGuideOpen,
        demoGuideStep,
        navigate,
        switchRole,
        setCurrentRoute,
        setSelectedAssessmentId,
        loginAsPatient,
        loginAsDoctor,
        logout,
        addAssessment,
        updateAssessment,
        addAuditEvent,
        markAssessmentReviewed,
        requestFollowUp,
        markQuestionAnswered,
        saveReferralNote,
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
