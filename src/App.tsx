import React, { useEffect } from 'react';
import { useApp, AppProvider } from './context/AppContext';
import { SafetyBanner } from './components/common/SafetyBanner';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { PrivacyModal } from './components/common/PrivacyModal';
import { DemoGuideModal } from './components/common/DemoGuideModal';

// Auth Pages
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

// Lucide icons for mobile bottom navigation (Section 12 & 42)
import { Home, ClipboardList, FileText, History, User } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentRoute, currentRole, navigate, setSelectedAssessmentId } = useApp();

  // Route parser
  const renderRoute = () => {
    // Auth Routes
    if (currentRoute === '/login') return <LoginPage />;
    if (currentRoute === '/register/patient') return <PatientRegisterPage />;
    if (currentRoute === '/register/doctor') return <DoctorRegisterPage />;
    if (currentRoute === '/verify') return <VerifyPage />;

    // Patient Routes
    if (currentRoute === '/patient/dashboard' || currentRoute === '/') return <PatientDashboard />;
    if (currentRoute === '/patient/new-assessment') return <NewAssessmentPage />;
    if (currentRoute === '/patient/history') return <PatientHistoryPage />;
    if (currentRoute === '/patient/reports') return <PatientReportsPage />;
    if (currentRoute === '/patient/profile') return <PatientProfilePage />;
    if (currentRoute === '/patient/timeline') return <PatientTimelinePage />;
    if (currentRoute === '/patient/consent') return <PatientConsentPage />;

    // Doctor Routes (Nested in DoctorLayout)
    if (currentRoute.startsWith('/doctor')) {
      const renderDoctorContent = () => {
        if (currentRoute === '/doctor/dashboard') return <DoctorDashboard />;
        if (currentRoute.startsWith('/doctor/queue')) return <DoctorQueuePage />;
        if (currentRoute.startsWith('/doctor/review') || currentRoute.startsWith('/doctor/patient')) return <DoctorReviewPage />;
        if (currentRoute.startsWith('/doctor/referral')) return <DoctorReferralPage />;
        if (currentRoute === '/doctor/reports') return <DoctorReportsPage />;
        if (currentRoute === '/doctor/audit-log') return <DoctorAuditLogPage />;
        return <DoctorDashboard />;
      };

      return <DoctorLayout>{renderDoctorContent()}</DoctorLayout>;
    }

    // Default fallback based on active role
    return currentRole === 'patient' ? <PatientDashboard /> : <DoctorLayout><DoctorDashboard /></DoctorLayout>;
  };

  const isPatientRoute = currentRole === 'patient' && !currentRoute.startsWith('/login') && !currentRoute.startsWith('/register');

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

      {/* Mobile Bottom Navigation for Patient (Section 12 & 42 Spec) */}
      {isPatientRoute && (
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-40 px-2 py-1.5 shadow-lg flex items-center justify-around text-[10px] font-semibold text-slate-600">
          <button
            onClick={() => navigate('/patient/dashboard')}
            className={`flex flex-col items-center gap-0.5 p-1 rounded transition-colors ${
              currentRoute === '/patient/dashboard' || currentRoute === '/' ? 'text-teal-800 font-bold' : 'hover:text-slate-900'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => navigate('/patient/history')}
            className={`flex flex-col items-center gap-0.5 p-1 rounded transition-colors ${
              currentRoute === '/patient/history' ? 'text-teal-800 font-bold' : 'hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Assessments</span>
          </button>

          <button
            onClick={() => navigate('/patient/reports')}
            className={`flex flex-col items-center gap-0.5 p-1 rounded transition-colors ${
              currentRoute === '/patient/reports' ? 'text-teal-800 font-bold' : 'hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Reports</span>
          </button>

          <button
            onClick={() => navigate('/patient/timeline')}
            className={`flex flex-col items-center gap-0.5 p-1 rounded transition-colors ${
              currentRoute === '/patient/timeline' ? 'text-teal-800 font-bold' : 'hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Timeline</span>
          </button>

          <button
            onClick={() => navigate('/patient/profile')}
            className={`flex flex-col items-center gap-0.5 p-1 rounded transition-colors ${
              currentRoute === '/patient/profile' ? 'text-teal-800 font-bold' : 'hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </nav>
      )}

      {/* Universal Footer with Mandatory Section 50 Disclaimers */}
      <Footer />

      {/* Global Modals */}
      <PrivacyModal />
      <DemoGuideModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
