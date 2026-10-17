import React from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Volume2, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function DomainConfirmationScreen() {
  const { selectedDomain, setActiveTab, navigateTo } = useApp();

  const domainTitle = selectedDomain || 'आपूर्ति श्रृंखला प्रबंधन';

  const playVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `आपने चुना: ${domainTitle}। अब हम आपकी सीखने की यात्रा तैयार करेंगे।`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartLearning = () => {
    setActiveTab('learn');
    navigateTo('dashboard');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between max-w-md mx-auto">
      <Header title="चयनित क्षेत्र" showBack={true} />

      <div className="p-4 sm:p-6 flex-1 flex flex-col justify-center text-center">
        {/* Animated Celebration Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white mx-auto flex items-center justify-center shadow-xl shadow-orange-500/30 mb-6">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        {/* आपने चुना */}
        <span className="text-sm font-bold text-stone-500 uppercase tracking-wider block mb-1">
          आपने चुना:
        </span>

        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight mb-3">
          "{domainTitle}"
        </h2>

        {/* अब हम आपकी सीखने की यात्रा तैयार करेंगे */}
        <div className="p-4 bg-orange-50 rounded-3xl border border-orange-200/80 max-w-xs mx-auto mb-6">
          <p className="text-sm font-bold text-orange-950 leading-relaxed">
            अब हम आपकी सीखने की यात्रा तैयार करेंगे।
          </p>
          <p className="text-xs text-stone-600 mt-1">
            सरल दृश्य-श्रव्य स्लाइड-कास्ट और बोलकर सवाल पूछने की सुविधा के साथ।
          </p>
        </div>

        <button
          onClick={playVoice}
          className="self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold active:scale-95 transition"
        >
          <Volume2 className="w-3.5 h-3.5 text-amber-700" />
          <span>बोलकर सुनें</span>
        </button>
      </div>

      {/* Button: मेरी सीखने की यात्रा शुरू करें */}
      <div className="p-4 sm:p-6 bg-white border-t border-stone-200">
        <button
          onClick={handleStartLearning}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white font-black text-lg shadow-lg shadow-orange-600/30 hover:shadow-xl hover:shadow-orange-600/40 active:scale-[0.98] transition flex items-center justify-center gap-3"
        >
          <span>मेरी सीखने की यात्रा शुरू करें</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
