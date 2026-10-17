import React from 'react';
import { ArrowRight, Sparkles, Volume2, HelpCircle, Compass, Clock, Award, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function DiscoverIntroScreen() {
  const { navigateTo } = useApp();

  const playVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = 'आइए जानें आप किस चीज़ में अच्छे हैं। यह लगभग 20 मिनट का अनुभव है। इसमें 3 भाग हैं। 3 परीक्षण, 9 परिस्थितियाँ, अपनी आवाज़ में जवाब दें।';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between max-w-md mx-auto">
      <Header title="कौशल पहचान" showBack={true} />

      <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
        {/* Top Header & Assistant */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>कौशल पहचान (Discover)</span>
            </span>

            <button
              onClick={playVoice}
              className="flex items-center gap-1.5 text-xs text-amber-900 bg-amber-100 px-3 py-1.5 rounded-full font-bold active:scale-95 transition"
            >
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>बोलकर सुनें</span>
            </button>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
            आइए जानें आप किस चीज़ में अच्छे हैं
          </h2>

          <p className="text-stone-600 text-sm mt-2 font-medium">
            यह लगभग 20 मिनट का अनुभव है। इसमें 3 भाग हैं।
          </p>
        </div>

        {/* Center Pillars Card */}
        <div className="my-6 bg-gradient-to-br from-orange-50 via-white to-amber-50 rounded-3xl p-5 border-2 border-orange-200 shadow-md">
          <div className="text-center mb-5">
            <div className="w-16 h-16 rounded-2xl bg-orange-500 text-white mx-auto flex items-center justify-center shadow-md shadow-orange-500/25 mb-3">
              <Compass className="w-8 h-8" />
            </div>
            <div className="inline-block px-3.5 py-1 bg-orange-100 text-orange-900 text-xs font-extrabold rounded-full mb-1">
              3 परीक्षण • 9 परिस्थितियाँ • अपनी आवाज़ में जवाब दें
            </div>
            <p className="text-xs text-stone-600 mt-1">
              कोई किताबी परीक्षा नहीं — बस अपनी समझ से बोलकर उत्तर दें
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-white rounded-2xl border border-stone-200 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                १
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">भाग 1: समस्या समाधान</h4>
                <p className="text-[11px] text-stone-500">3 वास्तविक व्यावहारिक परिस्थितियाँ</p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-stone-200 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                २
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">भाग 2: संवाद एवं निर्णय</h4>
                <p className="text-[11px] text-stone-500">3 ग्राहक व टीम समन्वय परिस्थितियाँ</p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-stone-200 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                ३
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">भाग 3: कार्य एवं व्यवसायिक सोच</h4>
                <p className="text-[11px] text-stone-500">3 संसाधन और योजना से जुड़ी परिस्थितियाँ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Button: शुरू करें */}
        <div>
          <button
            onClick={() => navigateTo('discoverAssessment')}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white font-bold text-lg shadow-lg shadow-orange-600/30 hover:shadow-xl hover:shadow-orange-600/40 active:scale-[0.98] transition flex items-center justify-center gap-3"
          >
            <span>शुरू करें</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-center text-xs text-stone-400 mt-2">
            आप जब चाहें माइक से रिकॉर्ड कर सकते हैं और रोक सकते हैं
          </p>
        </div>
      </div>
    </div>
  );
}
