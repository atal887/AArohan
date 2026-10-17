import React from 'react';
import { ArrowRight, Briefcase, GraduationCap, School, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function SelectUserTypeScreen() {
  const { userType, setUserType, navigateTo } = useApp();

  const options = [
    {
      id: 'student',
      title: 'विद्यार्थी',
      subtitle: 'छात्र / युवा आकांक्षी',
      desc: 'कौशल सीखें, अपनी क्षमता पहचानें और उपयुक्त नौकरी या प्रशिक्षण पाएँ।',
      icon: GraduationCap,
      badge: 'मुख्य डेमो प्रवाह',
      color: 'orange',
      bgGradient: 'from-orange-500 to-amber-500',
      borderActive: 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-400',
      iconBg: 'bg-orange-100 text-orange-600',
    },
    {
      id: 'teacher',
      title: 'शिक्षक / सुविधा प्रदाता',
      subtitle: 'मेंटॉर / स्कूल-कॉलेज शिक्षक',
      desc: 'अपने विद्यार्थियों की प्रगति देखें, मार्गदर्शन दें और कौशल रिपोर्ट ट्रैक करें।',
      icon: School,
      badge: 'डैशबोर्ड उपलब्ध',
      color: 'blue',
      bgGradient: 'from-blue-600 to-indigo-600',
      borderActive: 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-400',
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'employer',
      title: 'नियोक्ता / कंपनी',
      subtitle: 'स्थानीय व्यापार / भर्तीकर्ता',
      desc: 'कुशल स्थानीय युवाओं को खोजें, सीधे साक्षात्कार लें और काम पर रखें।',
      icon: Briefcase,
      badge: 'डैशबोर्ड उपलब्ध',
      color: 'emerald',
      bgGradient: 'from-emerald-600 to-teal-600',
      borderActive: 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-400',
      iconBg: 'bg-emerald-100 text-emerald-600',
    },
  ];

  const handleSelectAndProceed = (selectedId) => {
    setUserType(selectedId);
    if (selectedId === 'student') {
      navigateTo('studentEducation');
    } else if (selectedId === 'teacher') {
      navigateTo('teacherOnboarding');
    } else if (selectedId === 'employer') {
      navigateTo('employerOnboarding');
    }
  };

  const playVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = 'आप आरोहण का उपयोग किस रूप में करेंगे? पहला विकल्प: विद्यार्थी। दूसरा विकल्प: शिक्षक या सुविधा प्रदाता। तीसरा विकल्प: नियोक्ता या कंपनी।';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between max-w-md mx-auto">
      <Header title="उपयोगकर्ता का प्रकार" stepNumber={3} totalSteps={5} />

      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        {/* Title & Guidance */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full">
              चरण 3 / भूमिका
            </span>
            <button
              onClick={playVoice}
              className="flex items-center gap-1 text-xs text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full font-medium"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
              <span>सुनें</span>
            </button>
          </div>
          <h2 className="text-2xl font-bold text-stone-900 leading-snug">
            आप Aarohan का उपयोग किस रूप में करेंगे?
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            नीचे दिए गए तीन विकल्पों में से किसी एक को चुनें
          </p>
        </div>

        {/* 3 Large Cards */}
        <div className="space-y-3.5 flex-1">
          {options.map((opt) => {
            const isSelected = userType === opt.id;
            const Icon = opt.icon;

            return (
              <button
                key={opt.id}
                onClick={() => setUserType(opt.id)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 relative group active:scale-[0.99] ${
                  isSelected
                    ? opt.borderActive + ' shadow-md'
                    : 'border-stone-200 bg-white hover:border-stone-300 shadow-xs'
                }`}
              >
                {/* Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      opt.id === 'student'
                        ? 'bg-orange-500 text-white'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {opt.badge}
                  </span>

                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500 text-white'
                        : 'border-stone-300'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className={`w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 ${opt.iconBg}`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-stone-900 leading-tight">
                      {opt.title}
                    </h3>
                    <p className="text-xs font-semibold text-orange-700 mt-0.5">
                      {opt.subtitle}
                    </p>
                    <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                      {opt.desc}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-4 sm:p-6 bg-white border-t border-stone-200">
        <button
          onClick={() => handleSelectAndProceed(userType)}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white font-bold text-lg shadow-lg shadow-orange-600/30 hover:shadow-xl hover:shadow-orange-600/40 active:scale-[0.98] transition flex items-center justify-center gap-3"
        >
          <span>आगे बढ़ें ({options.find((o) => o.id === userType)?.title})</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
