import React from 'react';
import { ArrowRight, Compass, Sparkles, TrendingUp, Users, Volume2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function WelcomeScreen() {
  const { navigateTo } = useApp();

  const playVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = 'आरोहण में आपका स्वागत है। सीखें, बढ़ें, कमाएँ। यह मंच आपको नए कौशल सीखने और अपने लिए बेहतरीन अवसर ढूँढने में मदद करता है।';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50 flex flex-col justify-between max-w-md mx-auto">
      <Header title="स्वागत" showBack={true} stepNumber={1} totalSteps={5} />

      <div className="p-6 flex-1 flex flex-col justify-center text-center">
        {/* Visual Badge & Audio */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 flex items-center justify-center shadow-xl shadow-orange-500/25 rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="text-white text-5xl font-black tracking-tight">आ</span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-md border-2 border-white">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Titles */}
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            AAROHAN
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold shadow-xs">
            <span>सीखें</span>
            <span>•</span>
            <span>बढ़ें</span>
            <span>•</span>
            <span>कमाएँ</span>
          </div>
        </div>

        {/* Short explanation line */}
        <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-sm mx-auto font-medium">
          Aarohan आपको अपने छुपे हुए हुनर और कौशलों को पहचानने, व्यावहारिक ज्ञान सीखने और सुरक्षित रोजगार के अवसर पाने में मदद करता है।
        </p>

        {/* Feature Highlights for rural trust */}
        <div className="grid grid-cols-3 gap-2.5 my-8 text-left">
          <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 mb-2">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-stone-800">हुनर पहचान</span>
            <span className="text-[11px] text-stone-500">बोलकर जांचें</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-stone-800">कैरियर मार्ग</span>
            <span className="text-[11px] text-stone-500">सही दिशा</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-stone-800">स्थानीय काम</span>
            <span className="text-[11px] text-stone-500">सीधा संपर्क</span>
          </div>
        </div>

        {/* Listen button */}
        <button
          onClick={playVoice}
          className="self-center inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/80 text-amber-900 border border-amber-300 text-xs font-semibold hover:bg-amber-200/80 active:scale-95 transition"
        >
          <Volume2 className="w-4 h-4 text-amber-700" />
          <span>इस पेज को बोलकर सुनें</span>
        </button>
      </div>

      {/* Button: शुरू करें */}
      <div className="p-4 sm:p-6 bg-white/80 border-t border-orange-100 backdrop-blur-xs">
        <button
          onClick={() => navigateTo('profile')}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white font-bold text-lg shadow-lg shadow-orange-600/30 hover:shadow-xl hover:shadow-orange-600/40 active:scale-[0.98] transition flex items-center justify-center gap-3"
        >
          <span>शुरू करें</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-center text-xs text-stone-400 mt-2">
          बिना किसी शुल्क • 100% निःशुल्क मार्गदर्शन
        </p>
      </div>
    </div>
  );
}
