import React, { useState, useEffect } from 'react';
import { ArrowRight, Mic, MicOff, Sparkles, Volume2, HelpCircle, Check, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { SCENARIOS } from '../demoData';

export default function DiscoverScenarioScreen() {
  const { navigateTo } = useApp();
  const scenario = SCENARIOS[0];

  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Audio timer
  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((sec) => {
          if (sec >= 4) {
            // Auto complete recording demo
            stopRecording();
            return 4;
          }
          return sec + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const playScenarioVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `आइए जानें आप किस चीज़ में अच्छे हैं। स्थिति सुनिए: ${scenario.situation}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    setHasRecorded(false);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecorded(true);
  };

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    // Smooth transition simulation for demo without blocking navigation
    setTimeout(() => {
      setIsAnalyzing(false);
      navigateTo('skillProfile');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between max-w-md mx-auto">
      <Header title="कौशल पहचान (Discover)" stepNumber={6} totalSteps={7} />

      <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
        {/* Top Header & Voice Assistant */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Voice AI डिस्कवरी</span>
            </span>

            <button
              onClick={playScenarioVoice}
              className="flex items-center gap-1.5 text-xs text-amber-900 bg-amber-100 px-3 py-1.5 rounded-full font-bold active:scale-95 transition"
            >
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>प्रश्न बोलकर सुनें</span>
            </button>
          </div>

          <h2 className="text-2xl font-black text-stone-900 leading-tight">
            आइए जानें आप किस चीज़ में अच्छे हैं
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            बिना किसी परीक्षा या लिखने के डर के — बस अपनी भाषा में बोलकर बताएं
          </p>
        </div>

        {/* Hindi Scenario Card */}
        <div className="my-4 bg-white rounded-3xl p-5 border-2 border-orange-200/90 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-amber-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-xl uppercase tracking-wider">
            व्यावहारिक परिस्थिति
          </div>

          <div className="flex items-center gap-2 mb-2 text-orange-700 text-xs font-bold">
            <HelpCircle className="w-4 h-4" />
            <span>परिदृश्य #{scenario.id}:</span>
          </div>

          <p className="text-base sm:text-lg font-bold text-stone-900 leading-relaxed mb-4">
            "{scenario.situation}"
          </p>

          <div className="p-3 bg-orange-50/80 rounded-2xl border border-orange-100 flex items-start gap-2.5">
            <span className="text-xs font-bold text-orange-800 shrink-0 mt-0.5">सलाह:</span>
            <span className="text-xs text-stone-600">
              {scenario.hint}
            </span>
          </div>
        </div>

        {/* Microphone Recording Section */}
        <div className="flex flex-col items-center justify-center my-2">
          {/* Wave animation or pulsing ring */}
          <div className="relative flex items-center justify-center">
            {isRecording && (
              <div className="absolute w-36 h-36 rounded-full bg-red-400/30 animate-pulse-ring pointer-events-none" />
            )}
            {hasRecorded && !isRecording && (
              <div className="absolute w-32 h-32 rounded-full bg-emerald-400/20 pointer-events-none" />
            )}

            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-xl transition-all duration-300 active:scale-95 z-10 ${
                isRecording
                  ? 'bg-red-600 text-white shadow-red-500/40 ring-4 ring-red-200 animate-pulse'
                  : hasRecorded
                  ? 'bg-emerald-600 text-white shadow-emerald-500/30 ring-4 ring-emerald-100'
                  : 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-orange-500/40 hover:scale-105'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-9 h-9" />
                  <span className="text-[10px] font-bold mt-1">00:0{recordingSeconds}s</span>
                </>
              ) : hasRecorded ? (
                <>
                  <Check className="w-10 h-10 stroke-[3]" />
                  <span className="text-[9px] font-bold mt-0.5">रिकॉर्डेड</span>
                </>
              ) : (
                <>
                  <Mic className="w-9 h-9 animate-bounce" />
                  <span className="text-[10px] font-bold mt-1">बोलें</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center mt-3">
            <p className="text-sm font-bold text-stone-800">
              {isRecording
                ? 'सुन रहे हैं... कृपया अपना उत्तर बोलें'
                : hasRecorded
                ? 'आपका उत्तर सफलतापूर्वक रिकॉर्ड हो गया!'
                : 'माइक बटन दबाएं और अपना जवाब बोलें'}
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              {hasRecorded
                ? 'यदि आप दोबारा बोलना चाहते हैं तो पुनः माइक दबाएं'
                : 'टाइप करने की कोई ज़रूरत नहीं है'}
            </p>
          </div>

          {/* Hardcoded Demo Recorded Transcript preview */}
          {hasRecorded && (
            <div className="mt-4 w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-left animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 mb-1">
                <span>पहचाना गया जवाब (ऑडियो ट्रांसक्रिप्ट):</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">सत्यापित</span>
              </div>
              <p className="text-xs text-stone-800 leading-relaxed font-medium italic">
                "{scenario.demoAnalysis.userAnswerHindi}"
              </p>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="pt-2">
          {isAnalyzing ? (
            <div className="w-full py-4 px-6 rounded-2xl bg-orange-100 border border-orange-300 text-orange-950 font-bold text-center flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-orange-600" />
              <span>आपके जवाब का विश्लेषण किया जा रहा है...</span>
            </div>
          ) : (
            <button
              onClick={hasRecorded ? handleStartAnalysis : startRecording}
              className={`w-full py-4 px-6 rounded-2xl text-white font-bold text-lg shadow-lg active:scale-[0.98] transition flex items-center justify-center gap-3 ${
                hasRecorded
                  ? 'bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 shadow-orange-600/30 hover:shadow-xl'
                  : 'bg-gradient-to-r from-stone-800 to-stone-900 shadow-stone-800/20'
              }`}
            >
              {hasRecorded ? (
                <>
                  <span>कौशल विश्लेषण देखें</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  <span>जवाब रिकॉर्ड करना शुरू करें</span>
                </>
              )}
            </button>
          )}

          <p className="text-center text-[11px] text-stone-400 mt-2">
            100% ग्रामीण-अनुकूल • स्थानीय हिंदी लहजे को समझता है
          </p>
        </div>
      </div>
    </div>
  );
}
