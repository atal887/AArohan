import React from 'react';
import { useApp } from './context/AppContext';
import LanguageSelectScreen from './screens/LanguageSelectScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import BasicProfileScreen from './screens/BasicProfileScreen';
import SelectUserTypeScreen from './screens/SelectUserTypeScreen';
import StudentEducationScreen from './screens/StudentEducationScreen';
import StudentRelocationScreen from './screens/StudentRelocationScreen';
import TeacherOnboardingScreen from './screens/TeacherOnboardingScreen';
import TeacherDashboardScreen from './screens/TeacherDashboardScreen';
import EmployerOnboardingScreen from './screens/EmployerOnboardingScreen';
import EmployerDashboardScreen from './screens/EmployerDashboardScreen';
import DashboardScreen from './screens/DashboardScreen';
import DiscoverIntroScreen from './screens/DiscoverIntroScreen';
import DiscoverAssessmentScreen from './screens/DiscoverAssessmentScreen';
import DiscoverResultScreen from './screens/DiscoverResultScreen';
import DomainConfirmationScreen from './screens/DomainConfirmationScreen';
import ShadowSimulationScreen from './screens/ShadowSimulationScreen';
import ShadowEvaluationReportScreen from './screens/ShadowEvaluationReportScreen';
import LearnerProfileScreen from './screens/LearnerProfileScreen';

function AppContent() {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'language':
        return <LanguageSelectScreen />;
      case 'welcome':
        return <WelcomeScreen />;
      case 'profile':
        return <BasicProfileScreen />;
      case 'userType':
        return <SelectUserTypeScreen />;
      case 'studentEducation':
        return <StudentEducationScreen />;
      case 'studentRelocation':
        return <StudentRelocationScreen />;
      case 'teacherOnboarding':
        return <TeacherOnboardingScreen />;
      case 'teacherDashboard':
        return <TeacherDashboardScreen />;
      case 'employerOnboarding':
        return <EmployerOnboardingScreen />;
      case 'employerDashboard':
        return <EmployerDashboardScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'discoverIntro':
        return <DiscoverIntroScreen />;
      case 'discoverAssessment':
        return <DiscoverAssessmentScreen />;
      case 'discoverResult':
        return <DiscoverResultScreen />;
      case 'domainConfirmation':
        return <DomainConfirmationScreen />;
      case 'shadowSimulation':
        return <ShadowSimulationScreen />;
      case 'shadowEvaluationReport':
        return <ShadowEvaluationReportScreen />;
      case 'learnerProfile':
        return <LearnerProfileScreen />;
      default:
        return <LanguageSelectScreen />;
    }
  };

  return (
    <main className="min-h-screen bg-stone-100 flex justify-center selection:bg-orange-200">
      <div className="w-full max-w-md bg-stone-50 min-h-screen shadow-2xl relative">
        {renderScreen()}
      </div>
    </main>
  );
}

export default function App() {
  return <AppContent />;
}
