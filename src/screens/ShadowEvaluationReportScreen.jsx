import React from 'react';
import {
  TrendingDown,
  TrendingUp,
  RotateCcw,
  User,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Volume2,
  Award,
  Layers,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { WEAK_ASSESSMENT_EVALUATION } from '../shadowData';

export default function ShadowEvaluationReportScreen() {
  const {
    latestEvaluation,
    performanceRating,
    navigateTo,
    setActiveTab,
  } = useApp();

  const report = latestEvaluation || WEAK_ASSESSMENT_EVALUATION;

  const playVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `आपका प्रदर्शन तैयार है। आपकी वर्तमान प्रदर्शन रेटिंग: ${report.newRating} अंक। इस परीक्षण में आपकी रेटिंग 16 अंक कम हुई। ${report.encouragementMessage}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRetakeSimulation = () => {
    navigateTo('shadowSimulation');
  };

  const handleViewProfile = () => {
    navigateTo('learnerProfile');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between max-w-md mx-auto pb-12">
      <Header title="प्रदर्शन मूल्यांकन" showBack={false} />

      <div className="p-4 sm:p-5 flex-1 space-y-4">
        {/* ================= HEADER: REPORT READY ================= */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-5 rounded-3xl shadow-lg shadow-orange-600/25 text-center relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              कार्यस्थल सिमुलेशन रिपोर्ट
            </span>
            <button
              onClick={playVoice}
              className="flex items-center gap-1 text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full font-bold active:scale-95 transition"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>सुनें</span>
            </button>
          </div>

          <div className="w-12 h-12 bg-white text-orange-600 rounded-2xl mx-auto flex items-center justify-center mb-2 shadow-sm font-black">
            <Layers className="w-6 h-6 text-amber-500" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black">
            आपका प्रदर्शन तैयार है
          </h2>

          <p className="text-xs text-orange-100 mt-1 max-w-xs mx-auto font-medium">
            {report.summaryMessage}
          </p>

          {/* RATING UPDATE DISPLAY (200 -> 184) */}
          <div className="mt-4 p-3.5 bg-black/20 rounded-2xl backdrop-blur-xs flex items-center justify-around">
            <div className="text-center">
              <span className="text-[10px] text-stone-300 font-bold block uppercase">
                पहले
              </span>
              <span className="text-xl font-bold text-stone-300">
                {report.previousRating}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="px-2 py-0.5 rounded-full bg-red-500/80 text-white text-[11px] font-black flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" />
                <span>{report.ratingChange} अंक</span>
              </div>
              <span className="text-white text-xs mt-0.5">➔</span>
            </div>

            <div className="text-center">
              <span className="text-[10px] text-amber-200 font-bold block uppercase">
                वर्तमान रेटिंग
              </span>
              <span className="text-2xl font-black text-white">
                {report.newRating}
              </span>
            </div>
          </div>
        </div>

        {/* Encouraging Context Note */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 font-medium leading-relaxed">
          <p className="font-bold text-amber-900 mb-0.5">सुझाव:</p>
          "{report.encouragementMessage}"
        </div>

        {/* ================= PERFORMANCE BREAKDOWN BARS ================= */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-md space-y-3">
          <h3 className="text-sm font-black text-stone-900 border-b border-stone-100 pb-2 flex items-center justify-between">
            <span>प्रदर्शन विश्लेषण (Performance Breakdown)</span>
            <span className="text-[11px] text-stone-500">100 में से अंक</span>
          </h3>

          <div className="space-y-3">
            {report.skillBreakdown.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-stone-800">{item.name}</span>
                  <span className="text-stone-900 font-black">{item.score} / {item.max}</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.score >= 50
                        ? 'bg-emerald-500'
                        : item.score >= 40
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= WHAT YOU DID WELL ================= */}
        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-200/80 shadow-md space-y-2.5">
          <h3 className="text-sm font-black text-emerald-950 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>आपने क्या अच्छा किया?</span>
          </h3>

          <div className="space-y-1.5">
            {report.whatYouDidWell.map((well, i) => (
              <div key={i} className="flex items-start gap-2 text-xs font-bold text-stone-800">
                <span className="text-emerald-600 font-black">✓</span>
                <span>{well}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= WHERE TO IMPROVE ================= */}
        <div className="bg-white rounded-3xl p-5 border-2 border-amber-200/80 shadow-md space-y-2.5">
          <h3 className="text-sm font-black text-amber-950 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>आपको कहाँ सुधार करना है?</span>
          </h3>

          <div className="space-y-1.5">
            {report.whereToImprove.map((imp, i) => (
              <div key={i} className="flex items-start gap-2 text-xs font-bold text-stone-800">
                <span className="text-amber-600 font-black">△</span>
                <span>{imp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= QUESTION-WISE REPORT ================= */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-md space-y-3.5">
          <h3 className="text-sm font-black text-stone-900 border-b border-stone-100 pb-2">
            परिस्थिति-वार विश्लेषण (Question-wise Report)
          </h3>

          <div className="space-y-3">
            {report.scenarioReports.map((sc, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs text-stone-900">{sc.scenarioTitle}</h4>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                    {sc.performanceGrade}
                  </span>
                </div>

                <div className="text-xs text-stone-700">
                  <strong className="text-emerald-800">क्या अच्छा रहा:</strong> {sc.whatWasGood}
                </div>

                <div className="text-xs text-stone-700">
                  <strong className="text-red-800">क्या छूटा:</strong> {sc.whatWasMissed}
                </div>

                <div className="text-xs text-stone-900 bg-white p-2 rounded-xl border border-stone-200/60 font-semibold">
                  <strong className="text-orange-700">अगली बार:</strong> {sc.nextTimeAdvice}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= ACTION BUTTONS ================= */}
        <div className="pt-2 space-y-2.5">
          <button
            onClick={handleRetakeSimulation}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white font-black text-sm shadow-lg shadow-orange-600/30 hover:shadow-xl active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>मैं फिर अभ्यास करना चाहता/चाहती हूँ</span>
          </button>

          <button
            onClick={handleViewProfile}
            className="w-full py-3.5 px-6 rounded-2xl bg-stone-900 text-white font-bold text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            <span>मेरी प्रोफ़ाइल देखें</span>
          </button>
        </div>
      </div>
    </div>
  );
}
