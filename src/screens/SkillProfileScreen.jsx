import React, { useEffect } from 'react';
import { ArrowRight, Award, CheckCircle2, MessageSquare, ShieldAlert, Sparkles, TrendingUp, Volume2, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { SCENARIOS } from '../demoData';

export default function SkillProfileScreen() {
  const { navigateTo, profile } = useApp();
  const demoAnalysis = SCENARIOS[0].demoAnalysis;

  useEffect(() => {
    // Joyful celebration feedback
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  const playVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = 'बधाई हो! आपकी कौशल प्रोफ़ाइल तैयार है। समस्या समाधान: अच्छा। संवाद कौशल: बहुत अच्छा। निर्णय लेने की क्षमता: अच्छा। रचनात्मक सोच: अच्छा।';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between max-w-md mx-auto">
      <Header title="आपकी कौशल प्रोफाइल" stepNumber={7} totalSteps={7} />

      <div className="p-4 sm:p-6 flex-1 space-y-4">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-4 text-white shadow-lg shadow-emerald-600/20 text-center relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              विश्लेषण पूर्ण
            </span>
            <button
              onClick={playVoice}
              className="flex items-center gap-1 text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full font-bold active:scale-95 transition"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>सुनें</span>
            </button>
          </div>

          <div className="w-12 h-12 bg-white text-emerald-700 rounded-2xl mx-auto flex items-center justify-center mb-2 shadow-sm font-black text-xl">
            <Sparkles className="w-6 h-6 text-amber-500 fill-amber-500" />
          </div>

          <h2 className="text-xl font-black">
            शाबाश, {profile.name}!
          </h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-xs mx-auto font-medium">
            आपके व्यावहारिक उत्तर के आधार पर आपकी मजबूत क्षमताओं का खाका:
          </p>
        </div>

        {/* 4 Required Hardcoded Skills */}
        <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs space-y-3.5">
          <h3 className="text-sm font-bold text-stone-800 flex items-center justify-between border-b border-stone-100 pb-2">
            <span>पहचाने गए मुख्य कौशल (Competencies)</span>
            <span className="text-[11px] text-emerald-700 font-bold">4/4 सत्यापित</span>
          </h3>

          <div className="space-y-3">
            {demoAnalysis.skills.map((skill, index) => {
              const isTop = skill.rating === 'बहुत अच्छा';
              return (
                <div
                  key={index}
                  className={`p-3 rounded-2xl border transition-all ${
                    isTop
                      ? 'bg-blue-50/60 border-blue-200 shadow-2xs'
                      : 'bg-stone-50/60 border-stone-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">
                        {skill.name}
                      </span>
                      {isTop && (
                        <span className="text-[10px] bg-blue-600 text-white font-extrabold px-2 py-0.2 rounded-full">
                          शीर्ष शक्ति ⭐
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        isTop
                          ? 'bg-blue-100 text-blue-900 font-bold'
                          : 'bg-emerald-100 text-emerald-900 font-bold'
                      }`}
                    >
                      {skill.rating}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-500 mb-2">
                    {skill.desc}
                  </p>

                  {/* Visual Bar */}
                  <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isTop
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                      }`}
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-0.5">
              विशेषज्ञ समीक्षा:
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              "{demoAnalysis.aiFeedback}"
            </p>
          </div>
        </div>
      </div>

      {/* Footer Navigation directly leading to Career Discovery */}
      <div className="p-4 sm:p-6 bg-white border-t border-stone-200">
        <button
          onClick={() => navigateTo('careerDiscovery')}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white font-bold text-lg shadow-lg shadow-orange-600/30 hover:shadow-xl hover:shadow-orange-600/40 active:scale-[0.98] transition flex items-center justify-center gap-3"
        >
          <span>आपके लिए उपयुक्त करियर देखें</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-center text-xs text-stone-400 mt-2">
          आपकी गतिशीलता व कौशल के आधार पर वर्गीकृत
        </p>
      </div>
    </div>
  );
}
