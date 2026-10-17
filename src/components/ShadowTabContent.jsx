import React from 'react';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  TrendingDown,
  User,
  Volume2,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ShadowTabContent() {
  const {
    navigateTo,
    performanceRating,
    shadowTestsCompleted,
    latestEvaluation,
    selectedDomain
  } = useApp();

  const domainName = selectedDomain || 'आपूर्ति श्रृंखला प्रबंधन';

  const playVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = 'शैडो अप्रेंटिसशिप। वास्तविक काम जैसी परिस्थितियों में अपनी क्षमता आज़माएँ। इस अभ्यास में आपको वास्तविक कार्यस्थल जैसी परिस्थितियाँ दी जाएँगी। आपको समस्या को समझकर निर्णय लेना होगा।';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartSimulation = () => {
    navigateTo('shadowSimulation');
  };

  const handleViewReport = () => {
    navigateTo('shadowEvaluationReport');
  };

  const handleViewProfile = () => {
    navigateTo('learnerProfile');
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* ================= INTRO BANNER ================= */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white p-5 rounded-3xl shadow-lg shadow-purple-700/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            कार्यस्थल सिमुलेशन
          </span>
          <button
            onClick={playVoice}
            className="flex items-center gap-1 text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full font-bold active:scale-95 transition"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>सुनें</span>
          </button>
        </div>

        <h2 className="text-xl sm:text-2xl font-black leading-tight">
          शैडो अप्रेंटिसशिप
        </h2>

        <p className="text-xs text-purple-100 mt-1 font-medium">
          वास्तविक काम जैसी परिस्थितियों में अपनी क्षमता आज़माएँ।
        </p>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/20 text-center">
          <div className="p-2 bg-black/20 rounded-xl">
            <span className="text-[10px] text-purple-200 block font-bold">समय</span>
            <span className="text-xs font-black text-white">15 मिनट</span>
          </div>

          <div className="p-2 bg-black/20 rounded-xl">
            <span className="text-[10px] text-purple-200 block font-bold">परिस्थितियाँ</span>
            <span className="text-xs font-black text-white">2</span>
          </div>

          <div className="p-2 bg-black/20 rounded-xl">
            <span className="text-[10px] text-amber-300 block font-bold">प्रदर्शन रेटिंग</span>
            <span className="text-xs font-black text-white">{performanceRating}</span>
          </div>
        </div>
      </div>

      {/* ================= SIMULATION EXPLANATION ================= */}
      <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-md space-y-3">
        <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-purple-600" />
          <span>यह क्या है?</span>
        </h3>

        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
          इस अभ्यास में आपको <strong>{domainName}</strong> के वास्तविक कार्यस्थल जैसी परिस्थितियाँ दी जाएँगी। आपको समस्या को समझकर निर्णय लेना होगा।
        </p>

        <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 space-y-2 text-xs">
          <div className="flex items-start gap-2 text-purple-950 font-bold">
            <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
            <span>कोई किताबी परीक्षा नहीं — शुद्ध व्यावहारिक निर्णय</span>
          </div>
          <div className="flex items-start gap-2 text-purple-950 font-bold">
            <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
            <span>बोलकर आवाज़ में अपने निर्णय का कारण समझाएं</span>
          </div>
          <div className="flex items-start gap-2 text-purple-950 font-bold">
            <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
            <span>आपके निर्णय सीधे आपकी 'प्रदर्शन रेटिंग' को प्रभावित करेंगे</span>
          </div>
        </div>

        {/* Status or Previous Result card */}
        {shadowTestsCompleted > 0 && latestEvaluation && (
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-stone-800">पिछला सिमुलेशन परिणाम:</span>
              <span className="font-black text-orange-600">रेटिंग: {performanceRating}</span>
            </div>
            <p className="text-[11px] text-stone-600 mb-2">
              {latestEvaluation.summaryMessage}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleViewReport}
                className="px-3 py-1.5 rounded-xl bg-stone-900 text-white font-bold text-xs active:scale-95 transition"
              >
                रिपोर्ट देखें
              </button>
              <button
                onClick={handleViewProfile}
                className="px-3 py-1.5 rounded-xl bg-orange-100 text-orange-900 font-bold text-xs hover:bg-orange-200"
              >
                प्रोफ़ाइल में देखें
              </button>
            </div>
          </div>
        )}

        {/* Button: अभ्यास शुरू करें */}
        <div className="pt-2">
          <button
            onClick={handleStartSimulation}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white font-black text-base shadow-lg shadow-purple-700/30 hover:shadow-xl active:scale-[0.98] transition flex items-center justify-center gap-2.5"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>{shadowTestsCompleted > 0 ? 'पुनः अभ्यास शुरू करें' : 'अभ्यास शुरू करें'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
