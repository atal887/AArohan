import React from 'react';
import { ArrowRight, BookOpen, CheckCircle, GraduationCap, School, Volume2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function StudentEducationScreen() {
  const { studentData, setStudentData, navigateTo } = useApp();

  const educationStages = [
    { id: 'कक्षा 9–10', title: 'कक्षा 9–10', icon: School, desc: 'माध्यमिक विद्यालय स्तर' },
    { id: 'कक्षा 11–12', title: 'कक्षा 11–12', icon: BookOpen, desc: 'उच्च माध्यमिक विद्यालय स्तर' },
    { id: 'कॉलेज / स्नातक', title: 'कॉलेज / स्नातक', icon: GraduationCap, desc: 'डिप्लोमा, BA, B.Sc, B.Com, ITI' },
    { id: 'अभी पढ़ाई नहीं कर रहे', title: 'अभी पढ़ाई नहीं कर रहे', icon: CheckCircle, desc: 'शिक्षा छोड़ चुके / स्वरोजगार की तलाश' },
  ];

  const streams = [
    'कला संकाय (मानविकी)',
    'विज्ञान संकाय (भौतिकी, रसायन, गणित/जीवविज्ञान)',
    'वाणिज्य संकाय (लेखा एवं व्यापार)',
    'व्यावसायिक एवं कौशल प्रशिक्षण (आईटीआई)',
  ];

  const collegeCourses = [
    'बी.ए. (कला स्नातक)',
    'बी.कॉम. (वाणिज्य स्नातक)',
    'बी.एससी. (विज्ञान स्नातक)',
    'पॉलिटेक्निक / आईटीआई डिप्लोमा',
    'अन्य सामान्य डिग्री या डिप्लोमा',
  ];

  const collegeYears = ['प्रथम वर्ष', 'द्वितीय वर्ष', 'तृतीय / अंतिम वर्ष'];

  const playVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = 'आप अभी कहाँ पढ़ रहे हैं? कक्षा 9 से 10, कक्षा 11 से 12, कॉलेज या स्नातक, अथवा अभी पढ़ाई नहीं कर रहे हैं?';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleContinue = () => {
    navigateTo('studentRelocation');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between max-w-md mx-auto">
      <Header title="शिक्षा की स्थिति" stepNumber={4} totalSteps={5} />

      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        {/* Title & Guidance */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full">
              चरण 4 / शिक्षा
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
            आप अभी कहाँ पढ़ रहे हैं?
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            अपनी वर्तमान पढ़ाई या स्तर का चयन करें
          </p>
        </div>

        {/* Education Options */}
        <div className="space-y-3 mb-5">
          {educationStages.map((stage) => {
            const isSelected = studentData.educationStage === stage.id;
            const Icon = stage.icon;

            return (
              <button
                key={stage.id}
                onClick={() =>
                  setStudentData((prev) => ({
                    ...prev,
                    educationStage: stage.id,
                  }))
                }
                className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all duration-200 active:scale-[0.99] ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/70 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-orange-200'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-orange-500 text-white'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900">
                      {stage.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">{stage.desc}</p>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? 'border-orange-500 bg-orange-500 text-white'
                      : 'border-stone-300'
                  }`}
                >
                  {isSelected && <CheckCircle className="w-4 h-4" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Conditional Sub-questions */}
        {(studentData.educationStage === 'कक्षा 11–12' ||
          studentData.educationStage === 'कक्षा 9–10') && (
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs mb-4 animate-fadeIn">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              कक्षा और संकाय (Stream) चुनें:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {streams.map((stream) => (
                <button
                  key={stream}
                  type="button"
                  onClick={() =>
                    setStudentData((prev) => ({
                      ...prev,
                      classStream: stream,
                    }))
                  }
                  className={`p-3 rounded-xl border text-left text-sm font-semibold transition ${
                    studentData.classStream === stream
                      ? 'border-orange-500 bg-orange-50 text-orange-950 font-bold'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {stream}
                </button>
              ))}
            </div>
          </div>
        )}

        {studentData.educationStage === 'कॉलेज / स्नातक' && (
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs mb-4 space-y-3 animate-fadeIn">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                कोर्स / डिग्री का नाम:
              </label>
              <select
                value={studentData.collegeCourse || collegeCourses[0]}
                onChange={(e) =>
                  setStudentData((prev) => ({
                    ...prev,
                    collegeCourse: e.target.value,
                  }))
                }
                className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 font-medium text-stone-800 text-sm focus:border-orange-500"
              >
                {collegeCourses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                अध्ययन वर्ष:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {collegeYears.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() =>
                      setStudentData((prev) => ({
                        ...prev,
                        collegeYear: year,
                      }))
                    }
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition ${
                      studentData.collegeYear === year ||
                      (!studentData.collegeYear && year === 'प्रथम वर्ष')
                        ? 'border-orange-500 bg-orange-50 text-orange-900'
                        : 'border-stone-200 text-stone-700'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="p-4 sm:p-6 bg-white border-t border-stone-200">
        <button
          onClick={handleContinue}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white font-bold text-lg shadow-lg shadow-orange-600/30 hover:shadow-xl hover:shadow-orange-600/40 active:scale-[0.98] transition flex items-center justify-center gap-3"
        >
          <span>आगे बढ़ें</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
