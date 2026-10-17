import React from 'react';
import { ArrowRight, Compass, Home, MapPin, Sparkles, Volume2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function StudentRelocationScreen() {
  const { studentData, setStudentData, navigateTo } = useApp();

  const options = [
    {
      id: 'हाँ, मैं बाहर जा सकता/सकती हूँ',
      title: 'हाँ, मैं बाहर जा सकता/सकती हूँ',
      subtitle: 'ज़िला, राज्य या अन्य महानगर में अवसर के लिए तैयार',
      desc: 'लॉजिस्टिक्स, ई-कॉमर्स, टेक व बड़ी कंपनियों में करियर के अधिक विकल्प।',
      icon: Compass,
      color: 'emerald',
      badge: 'अधिक अवसर',
    },
    {
      id: 'नहीं, मुझे अपने आसपास अवसर चाहिए',
      title: 'नहीं, मुझे अपने आसपास अवसर चाहिए',
      subtitle: 'घर के पास / स्थानीय क्षेत्र में ही काम',
      desc: 'डिजिटल सेवा केंद्र, स्थानीय रिटेल, एग्री-बिजनेस व स्थानीय स्व-रोजगार।',
      icon: Home,
      color: 'blue',
      badge: 'घर के नज़दीक',
    },
    {
      id: 'अभी निश्चित नहीं हूँ',
      title: 'अभी निश्चित नहीं हूँ',
      subtitle: 'वेतन और काम की परिस्थितियों पर निर्भर करेगा',
      desc: 'हम आपको दोनों तरह के विकल्पों के बारे में बताएंगे ताकि आप सोच सकें।',
      icon: MapPin,
      color: 'amber',
      badge: 'लचीला विकल्प',
    },
  ];

  const playVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = 'क्या आप रोजगार के लिए अपने क्षेत्र से बाहर जा सकते हैं? पहला: हाँ, मैं बाहर जा सकता हूँ। दूसरा: नहीं, मुझे आसपास ही अवसर चाहिए। तीसरा: अभी निश्चित नहीं हूँ।';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleContinue = () => {
    // CRITICAL REQUIREMENT 2 & 11:
    // Take the student directly to the MAIN DASHBOARD, NOT Discover!
    navigateTo('dashboard');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between max-w-md mx-auto">
      <Header title="रोजगार गतिशीलता" stepNumber={5} totalSteps={5} />

      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        {/* Title & Guidance */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full">
              चरण 5 / गतिशीलता
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
            क्या आप रोजगार के लिए अपने क्षेत्र से बाहर जा सकते हैं?
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            आपकी पसंद के आधार पर आगे करियर और प्रशिक्षण की सिफारिशें तैयार होंगी
          </p>
        </div>

        {/* Mobility Options Cards */}
        <div className="space-y-3.5 flex-1">
          {options.map((opt) => {
            const isSelected = studentData.canRelocate === opt.id;
            const Icon = opt.icon;

            return (
              <button
                key={opt.id}
                onClick={() =>
                  setStudentData((prev) => ({
                    ...prev,
                    canRelocate: opt.id,
                  }))
                }
                className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition-all duration-200 relative group active:scale-[0.99] ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/70 shadow-md ring-2 ring-orange-300'
                    : 'border-stone-200 bg-white hover:border-orange-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected
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

                <div className="flex items-start gap-3.5">
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
                    <h3 className="text-base font-bold text-stone-900 leading-tight">
                      {opt.title}
                    </h3>
                    <p className="text-xs font-semibold text-orange-700 mt-0.5">
                      {opt.subtitle}
                    </p>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      {opt.desc}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 mt-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 leading-relaxed font-medium">
            चिंता न करें, आप इसे बाद में कभी भी बदल सकते हैं। इसके बाद आपका मुख्य डैशबोर्ड खुलेगा जहाँ आप अपनी सुविधा से अपनी क्षमता खोज सकते हैं।
          </p>
        </div>
      </div>

      {/* Footer Navigation: Route to main dashboard directly */}
      <div className="p-4 sm:p-6 bg-white border-t border-stone-200">
        <button
          onClick={handleContinue}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white font-bold text-lg shadow-lg shadow-orange-600/30 hover:shadow-xl hover:shadow-orange-600/40 active:scale-[0.98] transition flex items-center justify-center gap-3"
        >
          <span>मुख्य डैशबोर्ड खोलें</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
