import React from 'react';
import { Check, Globe2, Sparkles, Volume2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LanguageSelectScreen() {
  const { selectedLanguage, setSelectedLanguage, navigateTo } = useApp();

  const languages = [
    { id: 'hi', name: 'हिंदी', native: 'हिन्दी', desc: 'मुख्य प्रवाह (डेमो के लिए अनुशंसित)', active: true },
    { id: 'en', name: 'English', native: 'English', desc: 'English interface', active: false },
    { id: 'ta', name: 'தமிழ்', native: 'Tamil', desc: 'தமிழ் இடைமுகம்', active: false },
    { id: 'te', name: 'తెలుగు', native: 'Telugu', desc: 'తెలుగు ఇంటర్ఫేస్', active: false },
    { id: 'mr', name: 'मराठी', native: 'Marathi', desc: 'मराठी इंटरफेस', active: false },
  ];

  const handleSelect = (langId) => {
    setSelectedLanguage(langId);
    // As per requirement: "For the demo, selecting 'हिंदी' is the main flow. After Hindi is selected, ALL screens, buttons, labels, messages and content must be in Hindi."
    navigateTo('welcome');
  };

  const playVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance('कृपया अपनी पसंदीदा भाषा चुनें। डेमो के लिए हिंदी चुनें।');
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50 flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto">
      {/* Top Banner */}
      <div className="pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold">
            <Globe2 className="w-4 h-4 text-orange-600" />
            <span>चरण 1 / भाषा चयन</span>
          </div>
          <button
            onClick={playVoice}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-stone-700 shadow-xs border border-stone-200 text-xs font-medium active:scale-95 transition"
          >
            <Volume2 className="w-3.5 h-3.5 text-orange-600" />
            <span>सुनें</span>
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-orange-500/20 mb-3">
            <span className="text-white text-2xl font-black">आ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            अपनी भाषा चुनें
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            कृपया वह भाषा चुनें जिसमें आप ऐप का उपयोग करना चाहते हैं
          </p>
        </div>

        {/* Language Cards */}
        <div className="space-y-3">
          {languages.map((lang) => {
            const isSelected = selectedLanguage === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => handleSelect(lang.id)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between relative overflow-hidden group ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/80 shadow-md shadow-orange-500/10'
                    : 'border-stone-200 bg-white hover:border-orange-300 hover:bg-orange-50/30'
                }`}
              >
                {lang.active && (
                  <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 bg-orange-500 text-white rounded-full">
                    मुख्य डेमो
                  </span>
                )}
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                      isSelected
                        ? 'bg-orange-500 text-white'
                        : 'bg-stone-100 text-stone-700 group-hover:bg-orange-100 group-hover:text-orange-700'
                    }`}
                  >
                    {lang.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-stone-900 flex items-center gap-2">
                      {lang.name}
                      {lang.id !== 'hi' && (
                        <span className="text-xs font-normal text-stone-400">({lang.native})</span>
                      )}
                    </div>
                    <div className="text-xs text-stone-500">{lang.desc}</div>
                  </div>
                </div>

                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-orange-500 bg-orange-500 text-white'
                      : 'border-stone-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="pt-6 pb-2">
        <button
          onClick={() => handleSelect('hi')}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white font-bold text-lg shadow-lg shadow-orange-600/30 hover:shadow-xl hover:shadow-orange-600/40 active:scale-[0.98] transition flex items-center justify-center gap-2"
        >
          <span>आगे बढ़ें (हिंदी में जारी रखें)</span>
          <Sparkles className="w-5 h-5 text-amber-200" />
        </button>
        <p className="text-center text-xs text-stone-400 mt-3">
          सरल • सुलभ • ग्रामीण युवाओं के लिए विशेष रूप से निर्मित
        </p>
      </div>
    </div>
  );
}
