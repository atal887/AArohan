import React, { useEffect } from 'react';
import { ArrowRight, CheckCircle2, Compass, Sparkles, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { DISCOVER_DOMAINS } from '../demoData';

export default function DiscoverResultScreen() {
  const { navigateTo, setSelectedDomain, setHasCompletedAssessment } = useApp();

  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  }, []);

  const playVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = 'आपकी रुचि और क्षमताओं के आधार पर हमें 3 क्षेत्र मिले हैं। पहला: आपूर्ति श्रृंखला प्रबंधन। दूसरा: व्यवसाय और उद्यमिता। तीसरा: लॉजिस्टिक्स और संचालन। कृपया अपना पसंदीदा क्षेत्र चुनें।';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectDomain = (domain) => {
    setSelectedDomain(domain.name);
    setHasCompletedAssessment(true);
    navigateTo('domainConfirmation');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between max-w-md mx-auto">
      <Header title="शीर्ष ३ क्षेत्र" showBack={false} />

      <div className="p-4 sm:p-5 flex-1 space-y-4">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white rounded-3xl p-5 shadow-lg shadow-orange-600/25 text-center relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              मूल्यांकन परिणाम
            </span>
            <button
              onClick={playVoice}
              className="flex items-center gap-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-bold active:scale-95 transition"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>सुनें</span>
            </button>
          </div>

          <div className="w-12 h-12 bg-white text-orange-600 rounded-2xl mx-auto flex items-center justify-center mb-2 shadow-sm">
            <Sparkles className="w-6 h-6 text-amber-500 fill-amber-500" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black leading-snug">
            आपकी रुचि और क्षमताओं के आधार पर हमें 3 क्षेत्र मिले हैं
          </h2>

          <p className="text-xs text-orange-100 mt-2 font-medium max-w-xs mx-auto">
            नीचे दिए गए तीनों क्षेत्रों को देखें और वह क्षेत्र चुनें जिसमें आप आगे सीखना चाहते हैं:
          </p>
        </div>

        {/* 3 Domain Cards */}
        <div className="space-y-3.5">
          {DISCOVER_DOMAINS.map((domain, index) => (
            <div
              key={domain.id}
              className={`bg-white rounded-3xl p-4 sm:p-5 border-2 transition-all duration-200 shadow-xs hover:shadow-md ${
                index === 0
                  ? 'border-orange-400 bg-orange-50/20 ring-1 ring-orange-200'
                  : 'border-stone-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-black text-orange-800 bg-orange-100 px-2.5 py-0.5 rounded-full">
                  {domain.highlightBadge}
                </span>
                <span className="text-xs text-stone-400 font-bold">
                  विकल्प {index + 1}
                </span>
              </div>

              <h3 className="text-lg font-black text-stone-900 leading-tight mb-2">
                {domain.name}
              </h3>

              {/* 2-3 Short bullet points */}
              <div className="space-y-1.5 mb-3 bg-stone-50/80 p-2.5 rounded-2xl border border-stone-100">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                  आपके उत्तरों से क्यों मेल खाता है:
                </span>
                {domain.reasons.map((reason, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-bold text-stone-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                {domain.summary}
              </p>

              {/* Button: यह क्षेत्र चुनें */}
              <button
                onClick={() => handleSelectDomain(domain)}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm shadow-md active:scale-95 transition flex items-center justify-center gap-2 ${
                  index === 0
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-orange-600/30 hover:shadow-lg'
                    : 'bg-stone-900 text-white hover:bg-stone-800'
                }`}
              >
                <span>यह क्षेत्र चुनें</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-stone-400 pb-2">
          चुनने के बाद आपकी व्यक्तिगत सीखने की यात्रा शुरू होगी
        </p>
      </div>
    </div>
  );
}
