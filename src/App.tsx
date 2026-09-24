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

// Doctor Pages
import { DoctorLayout } from './components/doctor/DoctorLayout';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { DoctorQueuePage } from './components/doctor/DoctorQueuePage';
import { DoctorReviewPage } from './components/doctor/DoctorReviewPage';
import { DoctorReferralPage } from './components/doctor/DoctorReferralPage';
import { DoctorReportsPage } from './components/doctor/DoctorReportsPage';
import { DoctorAuditLogPage } from './components/doctor/DoctorAuditLogPage';

const AppContent: React.FC = () => {
  const { currentRoute, currentRole, setSelectedAssessmentId } = useApp();

  // Route parser for dynamic parameters like /doctor/review/:id
  const renderRoute = () => {
    // Auth Routes
    if (currentRoute === '/login') return <LoginPage />;
    if (currentRoute === '/register/patient') return <PatientRegisterPage />;
    if (currentRoute === '/register/doctor') return <DoctorRegisterPage />;
    if (currentRoute === '/verify') return <VerifyPage />;

    // Patient Routes
    if (currentRoute === '/patient/dashboard') return <PatientDashboard />;
    if (currentRoute === '/patient/new-assessment') return <NewAssessmentPage />;
    if (currentRoute === '/patient/history') return <PatientHistoryPage />;
    if (currentRoute === '/patient/reports') return <PatientReportsPage />;
    if (currentRoute === '/patient/profile') return <PatientProfilePage />;

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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Prominent Safety Disclaimer Banner */}
      <SafetyBanner />

      {/* Primary Navigation */}
      <Navbar />

      {/* Main Dynamic Viewport */}
      <div className="flex-1">
        {renderRoute()}
      </div>

      {/* Universal Footer with Mandatory Disclaimers */}
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
