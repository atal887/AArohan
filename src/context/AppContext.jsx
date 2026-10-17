import React, { createContext, useContext, useState } from 'react';
import { WEAK_ASSESSMENT_EVALUATION, AVERAGE_ASSESSMENT_EVALUATION } from '../shadowData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Step 1: language ('hi' by default)
  const [selectedLanguage, setSelectedLanguage] = useState('hi');

  // Screen state
  // 'language' | 'welcome' | 'profile' | 'userType' | 'studentEducation' | 'studentRelocation' | 'teacherOnboarding' | 'teacherDashboard' | 'employerOnboarding' | 'employerDashboard' | 'dashboard' | 'discoverIntro' | 'discoverAssessment' | 'discoverResult' | 'domainConfirmation' | 'shadowSimulation' | 'shadowEvaluationReport' | 'learnerProfile'
  const [currentScreen, setCurrentScreen] = useState('language');

  // Navigation history
  const [screenHistory, setScreenHistory] = useState([]);

  // Active dashboard tab: 'learn' | 'network' | 'discover' | 'opportunities' | 'shadow'
  const [activeTab, setActiveTab] = useState('discover');

  // Discover state:
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);

  // Profile data (East Delhi, Delhi hardcoded)
  const [profile, setProfile] = useState({
    name: 'दीपक कुमार',
    phone: '9876543210',
    location: 'East Delhi, Delhi',
    isLiveLocation: true,
  });

  // User type: 'student' | 'teacher' | 'employer'
  const [userType, setUserType] = useState('student');

  // Student specific data
  const [studentData, setStudentData] = useState({
    educationStage: 'कक्षा 11–12',
    classStream: '12वीं (कला संकाय)',
    collegeCourse: '',
    collegeYear: '',
    canRelocate: 'हाँ, मैं बाहर जा सकता/सकती हूँ',
  });

  // Teacher specific data
  const [teacherData, setTeacherData] = useState({
    name: 'रमेश चंद्र जी',
    phone: '9812345678',
    location: 'East Delhi, Delhi',
    institutionName: 'राजकीय सर्वोदय बाल विद्यालय',
    mentorshipFocus: '10वीं और 12वीं के विद्यार्थी',
  });

  // Employer specific data
  const [employerData, setEmployerData] = useState({
    name: 'विक्रम राज',
    phone: '9823456789',
    companyName: 'पूर्वी दिल्ली लॉजिस्टिक्स प्रा. लि.',
    location: 'East Delhi, Delhi',
    businessType: 'आपूर्ति श्रृंखला एवं वेयरहाउसिंग',
  });

  // ================= PERFORMANCE RATING & SHADOW APPRENTICESHIP STATE =================
  // Baseline initial rating: exactly 200 (without any prior tests)
  const [performanceRating, setPerformanceRating] = useState(200);

  // Rating history points for graph: starts with [ { testName: "प्रारंभिक", rating: 200 } ]
  const [ratingHistory, setRatingHistory] = useState([
    { testName: 'प्रारंभिक', rating: 200, testNumber: 0 },
  ]);

  // Shadow Apprenticeship test attempts count
  const [shadowTestsCompleted, setShadowTestsCompleted] = useState(0);

  // Latest evaluation report object
  const [latestEvaluation, setLatestEvaluation] = useState(null);

  // Practical performance indicators (synchronized with Shadow Apprenticeship evaluations)
  // Initially neutral moderate, updated by test results
  const [practicalSkills, setPracticalSkills] = useState({
    problemSolving: 50,
    decisionMaking: 50,
    businessThinking: 50,
    timeManagement: 50,
    inventoryManagement: 50,
    strengths: 'व्यावहारिक परिस्थितियों को समझने की अच्छी शुरुआत',
    improvementNeeds: 'समय के दबाव में निर्णय लेना',
  });

  // Function to apply Shadow Apprenticeship test result
  const recordShadowTestCompletion = () => {
    if (shadowTestsCompleted === 0) {
      // First attempt: deliberately WEAK (200 -> 184, -16)
      const evalData = WEAK_ASSESSMENT_EVALUATION;
      setPerformanceRating(evalData.newRating);
      setRatingHistory((prev) => [
        ...prev,
        { testName: 'परीक्षण 1', rating: evalData.newRating, testNumber: 1, change: evalData.ratingChange },
      ]);
      setShadowTestsCompleted(1);
      setLatestEvaluation(evalData);
      setPracticalSkills({
        problemSolving: 42,
        decisionMaking: 38,
        businessThinking: 45,
        timeManagement: 50,
        inventoryManagement: 40,
        strengths: 'व्यावहारिक परिस्थितियों को समझने की अच्छी शुरुआत',
        improvementNeeds: 'समय के दबाव में निर्णय लेना',
      });
      return evalData;
    } else {
      // Subsequent attempt: improvement (184 -> 192, +8)
      const evalData = AVERAGE_ASSESSMENT_EVALUATION;
      setPerformanceRating(evalData.newRating);
      setRatingHistory((prev) => [
        ...prev,
        { testName: `परीक्षण ${prev.length}`, rating: evalData.newRating, testNumber: prev.length, change: evalData.ratingChange },
      ]);
      setShadowTestsCompleted((prev) => prev + 1);
      setLatestEvaluation(evalData);
      setPracticalSkills({
        problemSolving: 58,
        decisionMaking: 55,
        businessThinking: 60,
        timeManagement: 65,
        inventoryManagement: 56,
        strengths: 'लागत और समय के बीच बेहतर संतुलन',
        improvementNeeds: 'आपातकालीन योजनाओं को और मजबूत करना',
      });
      return evalData;
    }
  };

  const navigateTo = (nextScreen) => {
    setScreenHistory((prev) => [...prev, currentScreen]);
    setCurrentScreen(nextScreen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (screenHistory.length > 0) {
      const prev = screenHistory[screenHistory.length - 1];
      setScreenHistory((history) => history.slice(0, -1));
      setCurrentScreen(prev);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const resetDemo = () => {
    setCurrentScreen('language');
    setScreenHistory([]);
    setActiveTab('discover');
    setHasCompletedAssessment(false);
    setSelectedDomain(null);
    setPerformanceRating(200);
    setRatingHistory([{ testName: 'प्रारंभिक', rating: 200, testNumber: 0 }]);
    setShadowTestsCompleted(0);
    setLatestEvaluation(null);
    setPracticalSkills({
      problemSolving: 50,
      decisionMaking: 50,
      businessThinking: 50,
      timeManagement: 50,
      inventoryManagement: 50,
      strengths: 'व्यावहारिक परिस्थितियों को समझने की अच्छी शुरुआत',
      improvementNeeds: 'समय के दबाव में निर्णय लेना',
    });
  };

  return (
    <AppContext.Provider
      value={{
        selectedLanguage,
        setSelectedLanguage,
        currentScreen,
        setCurrentScreen,
        screenHistory,
        navigateTo,
        goBack,
        resetDemo,
        activeTab,
        setActiveTab,
        hasCompletedAssessment,
        setHasCompletedAssessment,
        selectedDomain,
        setSelectedDomain,
        profile,
        setProfile,
        userType,
        setUserType,
        studentData,
        setStudentData,
        teacherData,
        setTeacherData,
        employerData,
        setEmployerData,
        performanceRating,
        ratingHistory,
        shadowTestsCompleted,
        latestEvaluation,
        practicalSkills,
        recordShadowTestCompletion,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
