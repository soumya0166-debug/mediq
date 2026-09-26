import React, { useEffect } from 'react';
import { useApp, AppProvider } from './context/AppContext';
import { SafetyBanner } from './components/common/SafetyBanner';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { PrivacyModal } from './components/common/PrivacyModal';
import { DemoGuideModal } from './components/common/DemoGuideModal';

// Auth Pages
import { AuthGateway } from './components/auth/AuthGateway';
import { LoginPage } from './components/auth/LoginPage';
import { PatientRegisterPage } from './components/auth/PatientRegisterPage';
import { DoctorRegisterPage } from './components/auth/DoctorRegisterPage';
import { VerifyPage } from './components/auth/VerifyPage';

// Patient Pages
import { PatientDashboard } from './components/patient/PatientDashboard';
import { NewAssessmentPage } from './components/patient/NewAssessmentPage';
import { PatientHistoryPage } from './components/patient/PatientHistoryPage';
import { PatientReportsPage } from './components/patient/PatientReportsPage';
import { PatientProfilePage } from './components/patient/PatientProfilePage';
import { PatientTimelinePage } from './components/patient/PatientTimelinePage';
import { PatientConsentPage } from './components/patient/PatientConsentPage';

// Doctor Pages
import { DoctorLayout } from './components/doctor/DoctorLayout';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { DoctorQueuePage } from './components/doctor/DoctorQueuePage';
import { DoctorReviewPage } from './components/doctor/DoctorReviewPage';
import { DoctorReferralPage } from './components/doctor/DoctorReferralPage';
import { DoctorReportsPage } from './components/doctor/DoctorReportsPage';
import { DoctorAuditLogPage } from './components/doctor/DoctorAuditLogPage';

// Common Pages
import { HealthcareAccessRestricted } from './components/common/HealthcareAccessRestricted';
import { PatientAccessRestricted } from './components/common/PatientAccessRestricted';
import { WorkspaceSwitchModal } from './components/common/WorkspaceSwitchModal';

// Mobile navigation localized labels
import { LayoutDashboard, ClipboardList, FileText, History, User } from 'lucide-react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { LanguageWelcomeModal } from './components/common/LanguageWelcomeModal';

const AppContent: React.FC = () => {
  const { currentRoute, currentRole, currentSession, navigate, setSelectedAssessmentId } = useApp();
  const { t } = useLanguage();

  // URL bypass guard: redirect unauthenticated users hitting protected routes directly to /auth
  useEffect(() => {
    if (!currentSession) {
      if (
        currentRoute !== '/auth' && 
        currentRoute !== '/login' && 
        !currentRoute.startsWith('/register') && 
        currentRoute !== '/verify'
      ) {
        navigate('/auth');
      }
    }
  }, [currentSession, currentRoute, navigate]);

  // Auto-sync selectedAssessmentId when navigating to a patient review route
  useEffect(() => {
    if (currentRoute.startsWith('/clinical/patient/') || currentRoute.startsWith('/doctor/review/')) {
      const parts = currentRoute.split('/');
      const id = parts[3];
      if (id) {
        setSelectedAssessmentId(id);
      }
    }
  }, [currentRoute, setSelectedAssessmentId]);

  // Route parser with strict role separation (Sections 1, 5, 6, 7, 8, 9)
  const renderRoute = () => {
    // 1. Unauthenticated Gateway Barrier (Sections 1, 9)
    if (!currentSession) {
      if (currentRoute === '/register/patient') return <PatientRegisterPage />;
      if (currentRoute === '/register/doctor') return <DoctorRegisterPage />;
      if (currentRoute === '/verify') return <VerifyPage />;
      // Any attempt to access dashboards or auth routes renders the Auth Gateway
      return <AuthGateway />;
    }

    // 2. Authenticated Session: If visiting /auth or /login, redirect into authorized workspace
    if (currentRoute === '/auth' || currentRoute === '/login') {
      if (currentRole === 'HEALTHCARE_PROFESSIONAL') {
        return <DoctorLayout><DoctorDashboard /></DoctorLayout>;
      }
      return <PatientDashboard />;
    }

    // Public / registration routes
    if (currentRoute === '/register/patient') return <PatientRegisterPage />;
    if (currentRoute === '/register/doctor') return <DoctorRegisterPage />;
    if (currentRoute === '/verify') return <VerifyPage />;

    // 3. Patient Routes (Section 7, 9)
    if (currentRoute === '/' || currentRoute.startsWith('/patient')) {
      // Strict Access Restriction: Clinicians must NOT enter patient self-service without switching workspaces
      if (currentRole !== 'PATIENT') {
        return <PatientAccessRestricted />;
      }
      if (currentRoute === '/patient/dashboard' || currentRoute === '/') return <PatientDashboard />;
      if (currentRoute === '/patient/new-assessment') return <NewAssessmentPage />;
      if (currentRoute === '/patient/history') return <PatientHistoryPage />;
      if (currentRoute === '/patient/reports') return <PatientReportsPage />;
      if (currentRoute === '/patient/profile') return <PatientProfilePage />;
      if (currentRoute === '/patient/timeline') return <PatientTimelinePage />;
      if (currentRoute === '/patient/consent') return <PatientConsentPage />;
      return <PatientDashboard />;
    }

    // 4. Clinical / Healthcare Professional Routes (Section 8, 9)
    if (currentRoute.startsWith('/clinical') || currentRoute.startsWith('/doctor')) {
      // Strict Access Restriction: Patients must NOT have access to healthcare dashboard
      if (currentRole !== 'HEALTHCARE_PROFESSIONAL') {
        return <HealthcareAccessRestricted />;
      }
      const renderDoctorContent = () => {
        if (currentRoute === '/clinical/dashboard' || currentRoute === '/doctor/dashboard') return <DoctorDashboard />;
        if (currentRoute.startsWith('/clinical/queue') || currentRoute.startsWith('/doctor/queue')) return <DoctorQueuePage />;
        if (
          currentRoute.startsWith('/clinical/patient') || 
          currentRoute.startsWith('/clinical/review') || 
          currentRoute.startsWith('/doctor/review') || 
          currentRoute.startsWith('/doctor/patient')
        ) return <DoctorReviewPage />;
        if (currentRoute.startsWith('/clinical/referral') || currentRoute.startsWith('/doctor/referral')) return <DoctorReferralPage />;
        if (currentRoute === '/clinical/reports' || currentRoute === '/doctor/reports') return <DoctorReportsPage />;
        if (currentRoute === '/clinical/audit-log' || currentRoute === '/doctor/audit-log') return <DoctorAuditLogPage />;
        return <DoctorDashboard />;
      };

      return <DoctorLayout>{renderDoctorContent()}</DoctorLayout>;
    }

    // Default fallback based on active role
    return currentRole === 'PATIENT' ? <PatientDashboard /> : <DoctorLayout><DoctorDashboard /></DoctorLayout>;
  };

  const isPatientRoute = Boolean(currentSession) && currentRole === 'PATIENT' && !currentRoute.startsWith('/login') && !currentRoute.startsWith('/register') && currentRoute !== '/auth';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-teal-700 selection:text-white pb-16 md:pb-0">
      {/* Top Prominent Educational Prototype Disclaimer Banner */}
      <SafetyBanner />

      {/* Primary Navigation */}
      <Navbar />

      {/* Main Dynamic Viewport */}
      <div className="flex-1">
        {renderRoute()}
      </div>

      {/* Mobile Bottom Navigation for Patient */}
      {isPatientRoute && (
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-40 px-2 py-1.5 shadow-lg flex items-center justify-around text-[10px] font-semibold text-slate-600">
          <button
            onClick={() => navigate('/patient/dashboard')}
            className={`flex flex-col items-center gap-0.5 p-1 rounded transition-colors ${
              currentRoute === '/patient/dashboard' || currentRoute === '/' ? 'text-teal-800 font-bold' : 'hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{t('nav.dashboard')}</span>
          </button>

          <button
            onClick={() => navigate('/patient/history')}
            className={`flex flex-col items-center gap-0.5 p-1 rounded transition-colors ${
              currentRoute === '/patient/history' ? 'text-teal-800 font-bold' : 'hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>{t('nav.assessments')}</span>
          </button>

          <button
            onClick={() => navigate('/patient/reports')}
            className={`flex flex-col items-center gap-0.5 p-1 rounded transition-colors ${
              currentRoute === '/patient/reports' ? 'text-teal-800 font-bold' : 'hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t('nav.reports')}</span>
          </button>

          <button
            onClick={() => navigate('/patient/timeline')}
            className={`flex flex-col items-center gap-0.5 p-1 rounded transition-colors ${
              currentRoute === '/patient/timeline' ? 'text-teal-800 font-bold' : 'hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>{t('nav.timeline')}</span>
          </button>

          <button
            onClick={() => navigate('/patient/profile')}
            className={`flex flex-col items-center gap-0.5 p-1 rounded transition-colors ${
              currentRoute === '/patient/profile' ? 'text-teal-800 font-bold' : 'hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{t('nav.profile')}</span>
          </button>
        </nav>
      )}

      {/* Universal Footer with Mandatory Disclaimers */}
      <Footer />

      {/* Global Modals */}
      <PrivacyModal />
      <DemoGuideModal />
      <LanguageWelcomeModal />
      <WorkspaceSwitchModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AppProvider>
  );
}

export default App;
