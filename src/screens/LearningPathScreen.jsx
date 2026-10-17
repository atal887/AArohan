import React, { useState } from 'react';
import { ArrowLeft, Award, BookOpen, CheckCircle, ChevronDown, ChevronUp, FileCheck, PhoneCall, Play, RotateCcw, ShieldCheck, Sparkles, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { LEARNING_PATHS } from '../demoData';

export default function LearningPathScreen() {
  const { selectedCareer, resetDemo, profile } = useApp();
  const [completedLessons, setCompletedLessons] = useState(['l1']);
  const [activeLessonModal, setActiveLessonModal] = useState(null);

  const careerName = selectedCareer?.title || 'ई-कॉमर्स एवं लॉजिस्टिक्स सुपरवाइजर';

  const toggleLesson = (id) => {
    if (completedLessons.includes(id)) {
      setCompletedLessons(completedLessons.filter((item) => item !== id));
    } else {
      setCompletedLessons([...completedLessons, id]);
      try {
        confetti({
          particleCount: 30,
          spread: 40,
          origin: { y: 0.8 },
        });
      } catch (e) {}
    }
  };

  const playVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `${careerName} के लिए आपका व्यक्तिगत शिक्षण मार्ग। तीन चरणों में सीखें और सीधे रोजगार पाएं।`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between max-w-md mx-auto">
      <Header title="व्यक्तिगत शिक्षण मार्ग" showBack={true} />

      <div className="p-4 sm:p-6 flex-1 space-y-4">
        {/* Career Header */}
        <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 text-white rounded-3xl p-5 shadow-lg shadow-orange-600/25">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
              लक्ष्य करियर
            </span>
            <button
              onClick={playVoice}
              className="flex items-center gap-1 text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full font-bold active:scale-95 transition"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>सुनें</span>
            </button>
          </div>

          <h2 className="text-xl font-black leading-tight">{careerName}</h2>
          <p className="text-xs text-orange-100 mt-1 font-medium">
            प्रशिक्षार्थी: <strong>{profile.name}</strong> • स्थान: <strong>{profile.location.split('(')[0]}</strong>
          </p>

          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-semibold">
            <span>प्रगति: {completedLessons.length} / 7 पाठ पूर्ण</span>
            <span className="bg-white text-orange-900 px-2 py-0.5 rounded-full text-[11px] font-extrabold">
              {Math.round((completedLessons.length / 7) * 100)}% पूरा
            </span>
          </div>
        </div>

        {/* 3 Step Roadmap */}
        <div className="space-y-4">
          {LEARNING_PATHS.map((step) => (
            <div
              key={step.step}
              className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-stone-200/90 shadow-xs relative overflow-hidden"
            >
              {/* Step Header */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                    {step.badge}
                  </span>
                  <h3 className="text-base font-bold text-stone-900 mt-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-stone-500">{step.duration}</p>
                </div>
              </div>

              {/* Government certification or verified tie-up badge */}
              <div className="my-2.5 p-2 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs font-semibold text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{step.governmentScheme}</span>
              </div>

              {/* Lesson Items */}
              <div className="space-y-2 mt-3">
                {step.lessons.map((lesson) => {
                  const isDone = completedLessons.includes(lesson.id);

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => toggleLesson(lesson.id)}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                        isDone
                          ? 'bg-emerald-50/70 border-emerald-300'
                          : 'bg-stone-50 border-stone-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white border-2 border-stone-300 text-stone-400'
                          }`}
                        >
                          {isDone ? <CheckCircle className="w-4 h-4" /> : <Play className="w-3 h-3 fill-stone-400 ml-0.5" />}
                        </div>

                        <div>
                          <div
                            className={`text-xs font-bold ${
                              isDone ? 'line-through text-stone-500' : 'text-stone-900'
                            }`}
                          >
                            {lesson.title}
                          </div>
                          <div className="text-[10px] text-stone-500">
                            {lesson.type} • {lesson.duration}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md shrink-0 ml-2">
                        {isDone ? 'पूर्ण' : 'शुरू करें'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Guaranteed Job Direct Connect Card */}
        <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-3xl p-4 shadow-md text-center">
          <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white mx-auto flex items-center justify-center mb-2">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm">प्रमाणपत्र एवं सीधा रोज़गार</h4>
          <p className="text-xs text-stone-300 mt-1 max-w-xs mx-auto">
            पाठ पूरा करने के बाद आपका सत्यापित बायोडाटा स्थानीय कंपनियों एवं नियोक्ताओं के साथ साझा किया जाएगा।
          </p>
        </div>
      </div>

      {/* Footer Navigation: Demo Finish & Restart */}
      <div className="p-4 sm:p-6 bg-white border-t border-stone-200 space-y-2">
        <button
          onClick={resetDemo}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white font-bold text-base shadow-lg shadow-orange-600/30 hover:shadow-xl active:scale-[0.98] transition flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>नया डेमो शुरू करें (प्रारंभ से)</span>
        </button>
        <p className="text-center text-[11px] text-stone-400">
          AAROHAN — ग्रामीण युवाओं के लिए कौशल एवं रोजगार क्रांति
        </p>
      </div>
    </div>
  );
}
