import React, { useState } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  Volume2,
  TrendingUp,
  TrendingDown,
  Award,
  BookOpen,
  Briefcase,
  Layers,
  Sparkles,
  MapPin,
  CheckCircle2,
  HelpCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Download,
  FileText,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export default function LearnerProfileScreen() {
  const {
    profile,
    studentData,
    selectedDomain,
    performanceRating,
    ratingHistory,
    shadowTestsCompleted,
    practicalSkills,
    goBack,
    resetDemo,
    unlockedModules = [1],
  } = useApp();

  const domainName = selectedDomain || 'आपूर्ति श्रृंखला प्रबंधन';
  const education = studentData?.classStream || studentData?.educationStage || '12वीं (कला संकाय)';
  const location = profile?.location || 'पूर्वी दिल्ली, दिल्ली';
  const studentName = profile?.name || 'दीपक कुमार';

  // Modal state for generated Professional Resume-Style PDF Report
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Dynamic Skill Scores Calculation using local data
  const hasTakenTest = shadowTestsCompleted > 0;
  const problemSolvingScore = hasTakenTest ? practicalSkills.problemSolving : 68;
  const decisionMakingScore = hasTakenTest ? practicalSkills.decisionMaking : 62;
  const businessThinkingScore = hasTakenTest ? practicalSkills.businessThinking : 74;
  const timeManagementScore = hasTakenTest ? practicalSkills.timeManagement : 70;
  const communicationScore = hasTakenTest ? 65 : 72;

  // Professional Resume-Style Summary for PDF
  const professionalSummary = hasTakenTest
    ? `समस्या समाधान, योजना बनाने और कार्यों को व्यवस्थित करने में रुचि रखने वाले शिक्षार्थी। ${domainName} से संबंधित बुनियादी सिद्धांतों और स्थानीय डिपो/गोदाम प्रबंधन के 8 मॉड्यूल्स में अध्ययनरत हैं। व्यावहारिक शैडो अप्रेंटिसशिप में भाग लेकर वास्तविक परिस्थितियों में निर्णय लेने, इन्वेंटरी ऑडिट और समय प्रबंधन को और अधिक सुदृढ़ करने की दिशा में निरंतर कार्यरत हैं।`
    : `समस्या समाधान, योजना बनाने और कार्यों को व्यवस्थित करने में सक्रिय रुचि रखने वाले शिक्षार्थी। ${domainName} से संबंधित सीखने और व्यावहारिक गतिविधियों में नामांकित हैं। समय प्रबंधन और व्यावसायिक निर्णय क्षमता को और मजबूत करने की दिशा में कार्यरत हैं।`;

  // Key Strengths for PDF
  const keyStrengths = [
    'गोदाम सूची (इन्वेंटरी) और सामान के प्रवाह को क्रमबद्ध रखने की स्पष्ट व्यावहारिक समझ।',
    'दैनिक कार्यों और डिलीवरी योजनाओं को निर्धारित समय सीमा के भीतर पूरा करने के प्रति गंभीरता।',
    'व्यावहारिक समस्याओं को शांत रहकर समझने और तर्कसंगत विकल्प चुनने की तत्परता।'
  ];

  // Improvement Areas for PDF
  const improvementAreas = [
    'समय के दबाव और आपातकालीन परिस्थितियों में तुरंत बैकअप योजना (Contingency Plan) तैयार करना।',
    'संख्यात्मक प्रविष्टियों और डिजिटल इन्वेंटरी सॉफ़्टवेयर में डेटा प्रविष्टि की गति बढ़ाना।',
    'संकट के समय टीम के अन्य सदस्यों को संक्षिप्त और स्पष्ट निर्देश देना।'
  ];

  // Next Development Phase for PDF
  const nextDevelopmentSteps = [
    'सप्लाई चेन के उन्नत इन्वेंटरी ऑडिट और बारकोड स्कैनिंग का सिमुलेशन अभ्यास।',
    'सप्लायर भाव तुलना और खरीद मोलभाव (Procurement Negotiation) का व्यावहारिक अध्ययन।',
    'शैडो अप्रेंटिसशिप के अगले स्तर के परिदृश्यों में भाग लेकर रेटिंग में सुधार दर्ज करना।'
  ];

  const handleGenerateSkillReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsPdfModalOpen(true);
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }, 600);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const playVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `मेरी प्रोफ़ाइल। ${profile.name}। आपका चुना हुआ क्षेत्र: ${domainName}। प्रदर्शन रेटिंग: ${performanceRating} अंक।`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  // SVG Line Graph calculation for Rating History
  const minRating = 160;
  const maxRating = 220;
  const graphWidth = 280;
  const graphHeight = 110;

  const points = ratingHistory.map((item, index) => {
    const x =
      ratingHistory.length === 1
        ? graphWidth / 2
        : 45 + (index / (ratingHistory.length - 1)) * (graphWidth - 90);
    const normalized = (item.rating - minRating) / (maxRating - minRating);
    const y = graphHeight - 25 - normalized * (graphHeight - 50);
    return { x, y, ...item };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const completedModulesCount = 1; // Initially Module 1 is active, 8 modules total
  const totalModulesCount = 8;
  const moduleProgressPercent = Math.round((completedModulesCount / totalModulesCount) * 100);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between max-w-md mx-auto pb-12">
      {/* Top Header with "← वापस" button - hidden during print */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-xs print:hidden">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={goBack}
              aria-label="वापस जाएं"
              className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-900 border border-orange-200 hover:bg-orange-100 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-black cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-orange-800" />
              <span>वापस</span>
            </button>

            <div>
              <h1 className="text-sm font-black text-stone-900">
                मेरी प्रोफ़ाइल
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={playVoice}
              title="बोलकर सुनें"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold hover:bg-amber-100 active:scale-95 transition"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">सुनें</span>
            </button>

            <button
              onClick={resetDemo}
              title="प्रारंभ से शुरू करें"
              className="p-2 rounded-xl text-stone-500 hover:bg-stone-100 active:rotate-180 transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4 text-stone-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Profile Screen (Restored dashboard-style layout) - hidden during print */}
      <div className="p-4 sm:p-5 flex-1 space-y-4 print:hidden">
        {/* ================= 1. AT THE TOP ================= */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-5 rounded-3xl shadow-lg shadow-orange-600/20 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              शिक्षार्थी पहचान
            </span>
            <span className="text-xs text-amber-200 font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{profile.location}</span>
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white text-orange-600 flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black leading-tight">
                {profile.name}
              </h2>
              <div className="mt-1">
                <span className="text-[11px] text-orange-100 font-semibold block">
                  आपका चुना हुआ क्षेत्र
                </span>
                <span className="text-xs sm:text-sm font-black text-white bg-black/20 px-2 py-0.5 rounded-md inline-block mt-0.5">
                  {domainName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 1.5. मेरी कौशल रिपोर्ट बनाएं BUTTON ================= */}
        <div className="bg-white rounded-3xl p-4 border-2 border-orange-200 shadow-md">
          <button
            onClick={handleGenerateSkillReport}
            disabled={isGenerating}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black text-sm shadow-md shadow-orange-600/30 hover:shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'कौशल रिपोर्ट तैयार हो रही है...' : 'मेरी कौशल रिपोर्ट बनाएं'}</span>
          </button>
        </div>

        {/* ================= 2. LARGE RATING CARD ================= */}
        <div className="bg-white rounded-3xl p-5 border-2 border-orange-200/90 shadow-md">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                प्रदर्शन रेटिंग
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-4xl font-black text-stone-900 tracking-tight">
                  {performanceRating}
                </span>
                <span className="text-xs font-semibold text-stone-500">
                  {hasTakenTest ? '(परीक्षण 1 के बाद)' : 'आपकी प्रारंभिक रेटिंग'}
                </span>
              </div>
            </div>

            {hasTakenTest && (
              <div className="px-2.5 py-1 rounded-full text-xs font-black bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>-16 अंक</span>
              </div>
            )}
          </div>

          {/* Context note */}
          <p className="text-xs text-stone-600 leading-relaxed font-medium mb-4">
            {hasTakenTest
              ? 'पहले के प्रदर्शन की तुलना में आपकी रेटिंग 16 अंक कम हुई है। चिंता न करें, अगले अभ्यास में बेहतर निर्णय लेकर आप इसे बढ़ा सकते हैं।'
              : 'प्रत्येक विद्यार्थी 200 की आधार रेटिंग से शुरू करता है। केवल शैडो अप्रेंटिसशिप के व्यावहारिक निर्णय आपकी रेटिंग तय करते हैं।'}
          </p>

          {/* ================= 3. RATING LINE GRAPH ================= */}
          <div className="pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-2">
              <span>आपकी प्रगति (रेटिंग ग्राफ़)</span>
              <span className="text-[11px] text-stone-500">
                {hasTakenTest ? 'परीक्षण 0 → 200, परीक्षण 1 → 184' : 'परीक्षण 0 → 200'}
              </span>
            </div>

            <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200/80">
              <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="w-full h-28 overflow-visible">
                {/* Horizontal reference grid lines */}
                <line x1="20" y1="20" x2={graphWidth - 20} y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                <line x1="20" y1="55" x2={graphWidth - 20} y2="55" stroke="#e2e8f0" strokeDasharray="3 3" />
                <line x1="20" y1="90" x2={graphWidth - 20} y2="90" stroke="#e2e8f0" strokeDasharray="3 3" />

                {/* Y-axis text */}
                <text x="5" y="24" fontSize="9" fill="#94a3b8" fontWeight="bold">210</text>
                <text x="5" y="59" fontSize="9" fill="#94a3b8" fontWeight="bold">190</text>
                <text x="5" y="94" fontSize="9" fill="#94a3b8" fontWeight="bold">170</text>

                {/* Line Path */}
                {pathD && ratingHistory.length > 1 && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#ea580c"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Points */}
                {points.map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r="5.5" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
                    <text
                      x={pt.x}
                      y={pt.y - 9}
                      fontSize="10"
                      fontWeight="black"
                      textAnchor="middle"
                      fill="#1e293b"
                    >
                      {pt.rating}
                    </text>
                    <text
                      x={pt.x}
                      y={graphHeight - 5}
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill="#64748b"
                    >
                      {i === 0 ? 'परीक्षण 0' : `परीक्षण ${i}`}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* ================= 4. SHADOW APPRENTICESHIP PERFORMANCE ================= */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200/90 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <h3 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>शैडो अप्रेंटिसशिप</span>
            </h3>
            <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full">
              परीक्षण दिए गए: {shadowTestsCompleted}
            </span>
          </div>

          {!hasTakenTest ? (
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-1">
              <p className="font-bold text-stone-900">अभी तक कोई परीक्षण नहीं दिया गया।</p>
              <p className="text-stone-600">आपकी प्रारंभिक प्रदर्शन रेटिंग 200 है।</p>
            </div>
          ) : (
            <div className="p-3.5 bg-orange-50/70 rounded-2xl border border-orange-200 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold">
                <span className="text-stone-800">अंतिम रेटिंग:</span>
                <span className="text-base font-black text-orange-700">184</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700 font-semibold">
                <span>रेटिंग बदलाव:</span>
                <span className="font-black text-stone-900">200 → 184</span>
                <span className="text-red-700 font-black bg-red-100 px-2 py-0.2 rounded-full">
                  ↓ 16 अंक
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ================= 5. SKILL PERFORMANCE ================= */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200/90 shadow-md space-y-3.5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <h3 className="text-sm font-black text-stone-900">
              आपकी क्षमताएँ
            </h3>
            <span className="text-[11px] font-bold text-orange-700">
              व्यावहारिक प्रदर्शन
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-stone-800">समस्या समाधान</span>
                <span className="text-stone-900 font-black">{practicalSkills.problemSolving}%</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-orange-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${practicalSkills.problemSolving}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-stone-800">निर्णय क्षमता</span>
                <span className="text-stone-900 font-black">{practicalSkills.decisionMaking}%</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${practicalSkills.decisionMaking}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-stone-800">व्यावसायिक सोच</span>
                <span className="text-stone-900 font-black">{practicalSkills.businessThinking}%</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${practicalSkills.businessThinking}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-stone-800">समय प्रबंधन</span>
                <span className="text-stone-900 font-black">{practicalSkills.timeManagement}%</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${practicalSkills.timeManagement}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-stone-800">सूची प्रबंधन</span>
                <span className="text-stone-900 font-black">{practicalSkills.inventoryManagement}%</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${practicalSkills.inventoryManagement}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= 6. STRENGTHS & IMPROVEMENT AREAS ================= */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200/90 shadow-md space-y-3.5">
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-black text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>मेरी प्रमुख ताकतें:</span>
            </div>
            <ul className="space-y-1 text-emerald-950 font-medium pl-5 list-disc">
              <li>सामान और संसाधनों को क्रमबद्ध तरीके से व्यवस्थित करने की सहज समझ।</li>
              <li>कार्यों को समय सीमा के भीतर पूरा करने के प्रति गंभीरता।</li>
              <li>दैनिक व्यावहारिक चुनौतियों को धैर्यपूर्वक समझने की इच्छा।</li>
            </ul>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-black text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>मुझे किन कौशलों में सुधार करना चाहिए:</span>
            </div>
            <ul className="space-y-1 text-amber-900 font-medium pl-5 list-disc">
              <li>आपातकालीन स्थितियों में तुरंत बैकअप योजना तैयार करना।</li>
              <li>संख्यात्मक और डिजिटल इन्वेंटरी प्रविष्टियों में गति बढ़ाना।</li>
              <li>कठिन परिस्थितियों में टीम के सदस्यों के साथ स्पष्ट निर्देश साझा करना।</li>
            </ul>
          </div>
        </div>

        {/* ================= 7. LEARNING PROGRESS ================= */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200/90 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <h3 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-orange-600" />
              <span>सीखने की प्रगति</span>
            </h3>
            <span className="text-xs font-bold text-stone-500">
              {moduleProgressPercent}% पूर्ण
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-100 font-bold">
              <span className="text-stone-600">सीखने के मॉड्यूल</span>
              <span className="text-stone-900">{completedModulesCount} / {totalModulesCount} सक्रिय</span>
            </div>

            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-100 font-bold">
              <span className="text-stone-600">वर्तमान क्षेत्र:</span>
              <span className="text-orange-700">{domainName}</span>
            </div>
          </div>

          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${moduleProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ================= MODAL: PROFESSIONAL RESUME PDF (Appears on click) ================= */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-stone-300 animate-fadeIn my-auto max-h-[92vh] flex flex-col">
            {/* Modal Top Bar - Hidden during print */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50 rounded-t-2xl shrink-0 print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-stone-800" />
                <span className="font-black text-sm text-stone-900">
                  AAROHAN कौशल प्रोफ़ाइल (PDF)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-black active:scale-95 transition flex items-center gap-1.5 shadow-2xs"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF डाउनलोड करें</span>
                </button>

                <button
                  onClick={() => setIsPdfModalOpen(false)}
                  className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-200 text-sm font-bold"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: The Complete Resume-Style Document */}
            <div className="p-6 sm:p-8 overflow-y-auto text-stone-900 space-y-6 bg-white" id="aarohan-resume-doc">
              {/* Document Header */}
              <div className="border-b-2 border-stone-900 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block">
                      AAROHAN • राष्ट्रीय कौशल रिपोर्ट
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-stone-950 mt-1 tracking-tight">
                      {studentName}
                    </h1>
                  </div>

                  <div className="text-right">
                    <span className="inline-block text-[10px] font-black uppercase tracking-wider bg-stone-100 text-stone-800 border border-stone-300 px-2.5 py-0.5 rounded">
                      सत्यापित शिक्षार्थी
                    </span>
                    <span className="block text-[11px] text-stone-500 mt-1 font-medium">
                      दस्तावेज़ संख्या: ARH-2026-904
                    </span>
                  </div>
                </div>

                {/* Sub-meta: Education | Location | Domain */}
                <div className="mt-3 pt-3 border-t border-stone-200 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-stone-700 font-semibold">
                  <span>{education}</span>
                  <span className="text-stone-300">|</span>
                  <span>{location}</span>
                  <span className="text-stone-300">|</span>
                  <span className="text-orange-900 font-bold">चयनित क्षेत्र: {domainName}</span>
                </div>
              </div>

              {/* Section 1: व्यावसायिक सारांश (Professional Summary) */}
              <section className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-1">
                  व्यावसायिक सारांश
                </h2>
                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-normal text-justify">
                  {professionalSummary}
                </p>
              </section>

              {/* Section 2: मुख्य कौशल (Skills + Score /100 + Subtle Progress Bar) */}
              <section className="space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 pb-1">
                  <h2 className="text-xs font-black uppercase tracking-wider text-stone-800">
                    मुख्य कौशल एवं मूल्यांकन
                  </h2>
                  <span className="text-[10px] text-stone-500 font-medium">
                    मानक पैमाना: 100 अंक
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-stone-800 mb-1">
                      <span>समस्या समाधान</span>
                      <span className="font-mono">{problemSolvingScore}/100</span>
                    </div>
                    <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-stone-800 h-full rounded-full" style={{ width: `${problemSolvingScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-stone-800 mb-1">
                      <span>निर्णय क्षमता</span>
                      <span className="font-mono">{decisionMakingScore}/100</span>
                    </div>
                    <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-stone-800 h-full rounded-full" style={{ width: `${decisionMakingScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-stone-800 mb-1">
                      <span>व्यावसायिक सोच</span>
                      <span className="font-mono">{businessThinkingScore}/100</span>
                    </div>
                    <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-stone-800 h-full rounded-full" style={{ width: `${businessThinkingScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-stone-800 mb-1">
                      <span>समय प्रबंधन</span>
                      <span className="font-mono">{timeManagementScore}/100</span>
                    </div>
                    <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-stone-800 h-full rounded-full" style={{ width: `${timeManagementScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-stone-800 mb-1">
                      <span>संचार</span>
                      <span className="font-mono">{communicationScore}/100</span>
                    </div>
                    <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-stone-800 h-full rounded-full" style={{ width: `${communicationScore}%` }} />
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3: मुख्य ताकतें (Key Strengths) */}
              <section className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-1">
                  मुख्य ताकतें
                </h2>
                <ul className="space-y-1.5 text-xs text-stone-800 pl-4 list-disc">
                  {keyStrengths.map((item, index) => (
                    <li key={index} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Section 4: सुधार के क्षेत्र (Areas of Improvement) */}
              <section className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-1">
                  सुधार के क्षेत्र
                </h2>
                <ul className="space-y-1.5 text-xs text-stone-800 pl-4 list-disc">
                  {improvementAreas.map((item, index) => (
                    <li key={index} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Section 5: सीखने की प्रगति (Learning Progress) */}
              <section className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-1">
                  सीखने की प्रगति
                </h2>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1.5">
                  <div className="flex justify-between font-bold text-stone-800">
                    <span>पाठ्यक्रम मार्ग:</span>
                    <span>{domainName} (व्यावसायिक पाठ्यक्रम)</span>
                  </div>
                  <div className="flex justify-between text-stone-700">
                    <span>पूर्ण किए गए मॉड्यूल:</span>
                    <span className="font-semibold">मॉड्यूल 1 सक्रिय / कुल 8 मॉड्यूल</span>
                  </div>
                  <div className="flex justify-between text-stone-700">
                    <span>स्लाइड-कास्ट पाठ एवं प्रश्नोत्तरी:</span>
                    <span className="font-semibold">23 व्यावहारिक पाठ एवं ज्ञान जाँच</span>
                  </div>
                </div>
              </section>

              {/* Section 6: व्यावहारिक प्रदर्शन (Shadow Apprenticeship Performance) */}
              <section className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-1">
                  व्यावहारिक प्रदर्शन (शैडो अप्रेंटिसशिप)
                </h2>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1.5">
                  <div className="flex justify-between font-bold text-stone-800">
                    <span>वर्तमान प्रदर्शन रेटिंग:</span>
                    <span className="font-mono text-sm text-stone-900 font-black">
                      {performanceRating} अंक
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-700">
                    <span>पूर्ण किए गए कार्यस्थल परीक्षण:</span>
                    <span>{shadowTestsCompleted} व्यावहारिक सिमुलेशन</span>
                  </div>
                  <div className="flex justify-between text-stone-700">
                    <span>रेटिंग इतिहास:</span>
                    <span>
                      {ratingHistory.map((r) => `${r.testName}: ${r.rating}`).join(' → ')}
                    </span>
                  </div>
                </div>
              </section>

              {/* Section 7: अगला विकास चरण (Next Development Steps) */}
              <section className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-1">
                  अगला विकास चरण
                </h2>
                <ul className="space-y-1.5 text-xs text-stone-800 pl-4 list-disc">
                  {nextDevelopmentSteps.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Document Footer */}
              <div className="pt-4 border-t border-stone-300 text-[10px] text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-1">
                <span>जारीकर्ता: AAROHAN कौशल विकास एवं रोजगार नेटवर्क</span>
                <span>अखिल भारतीय स्तर पर सत्यापित डिजिटल कौशल पहचान</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Specific Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #aarohan-resume-doc, #aarohan-resume-doc * {
            visibility: visible;
          }
          #aarohan-resume-doc {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      ` }} />
    </div>
  );
}
