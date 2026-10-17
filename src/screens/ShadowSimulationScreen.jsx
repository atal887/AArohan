import React, { useState, useEffect } from 'react';
import {
  Clock,
  Briefcase,
  AlertCircle,
  Mic,
  Square,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Volume2,
  HelpCircle,
  Building2,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { SHADOW_SCENARIOS } from '../shadowData';

export default function ShadowSimulationScreen() {
  const { navigateTo, recordShadowTestCompletion } = useApp();

  // Scenarios state (exactly 2 scenarios)
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);

  // Selected Option: 'A' | 'B' | null
  const [selectedOption, setSelectedOption] = useState(null);

  // Voice Recording state: 'idle' | 'recording' | 'recorded'
  const [recordingState, setRecordingState] = useState('idle');

  // 15-minute countdown timer (starts at 900 seconds: 15:00)
  const [secondsLeft, setSecondsLeft] = useState(872); // e.g. 14:32 as illustrated

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentScenario = SHADOW_SCENARIOS[currentScenarioIdx];

  const playVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `${currentScenario.title}। ${currentScenario.situation}। कृपया अपना निर्णय चुनें और कारण बताएं।`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartRecording = () => {
    setRecordingState('recording');
  };

  const handleStopRecording = () => {
    setRecordingState('recorded');
  };

  const handleNextScenarioOrComplete = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    if (currentScenarioIdx < SHADOW_SCENARIOS.length - 1) {
      // Move to Scenario 2
      setCurrentScenarioIdx((prev) => prev + 1);
      setSelectedOption(null);
      setRecordingState('idle');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Completed both scenarios! Record the test and show Evaluation Report
      recordShadowTestCompletion();
      navigateTo('shadowEvaluationReport');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between max-w-md mx-auto pb-10">
      <Header
        title="शैडो अप्रेंटिसशिप"
        showBack={true}
        stepNumber={currentScenarioIdx + 1}
        totalSteps={2}
      />

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        {/* ================= WORKPLACE HEADER & TIMER ================= */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-purple-900 bg-purple-100 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-purple-700" />
              <span>कार्यस्थल सिमुलेशन</span>
            </span>

            {/* 15 Minute Countdown Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 text-white font-mono text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>समय शेष: {formatTime(secondsLeft)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1 mb-3">
            <div>
              <span className="text-xs font-bold text-stone-500">
                शैडो अप्रेंटिसशिप • परीक्षण 1/1
              </span>
              <h2 className="text-xl font-black text-stone-900">
                परिस्थिति {currentScenario.scenarioNumber} / {currentScenario.totalScenarios}
              </h2>
            </div>

            <button
              onClick={playVoice}
              className="flex items-center gap-1 text-xs text-amber-900 bg-amber-100 px-2.5 py-1.5 rounded-full font-bold active:scale-95 transition"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-700" />
              <span>सुनें</span>
            </button>
          </div>

          {/* ================= SCENARIO CARD ================= */}
          <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-md">
            <div className="flex items-center gap-2 mb-2 text-stone-600 text-xs font-bold">
              <Building2 className="w-4 h-4 text-purple-600" />
              <span>कार्यक्षेत्र: {currentScenario.workplace}</span>
            </div>

            <h3 className="text-base font-black text-stone-900 mb-2 leading-snug">
              {currentScenario.title}
            </h3>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium mb-4">
              {currentScenario.situation}
            </p>

            {/* Options Selection */}
            <div className="space-y-2.5 mb-4">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                आप क्या निर्णय लेंगे?
              </span>

              {currentScenario.options.map((opt) => {
                const isSelected = selectedOption === opt.id;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedOption(opt.id)}
                    className={`w-full p-3.5 rounded-2xl border-2 text-left text-xs font-bold transition-all active:scale-[0.99] flex items-start gap-3 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/70 text-orange-950 shadow-xs'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-orange-200'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black ${
                        isSelected
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-stone-300 text-stone-500'
                      }`}
                    >
                      {opt.id}
                    </div>
                    <span className="leading-relaxed">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Voice Reason Recording */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center">
              <span className="text-xs font-black text-stone-900 block mb-1">
                अपने निर्णय का कारण बताइए:
              </span>
              <p className="text-[11px] text-stone-500 mb-3">
                लागत, ग्राहक और समय को ध्यान में रखते हुए बोलकर समझाएं
              </p>

              {recordingState === 'idle' && (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black text-xs shadow-md shadow-orange-600/20 active:scale-95 transition flex items-center gap-2 mx-auto"
                >
                  <Mic className="w-4 h-4" />
                  <span>🎙️ आवाज़ में बताएं (रिकॉर्ड शुरू करें)</span>
                </button>
              )}

              {recordingState === 'recording' && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleStopRecording}
                    className="px-4 py-2.5 rounded-2xl bg-red-600 text-white font-black text-xs shadow-md shadow-red-600/40 active:scale-95 transition flex items-center gap-2 mx-auto ring-4 ring-red-200 animate-pulse"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>रिकॉर्ड रोकें</span>
                  </button>
                  <p className="text-[11px] text-red-600 font-bold mt-1.5">
                    आपकी आवाज़ सुनी जा रही है...
                  </p>
                </div>
              )}

              {recordingState === 'recorded' && (
                <div className="text-left bg-white p-3 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>कारण दर्ज हो गया:</span>
                  </div>
                  <p className="text-xs text-stone-700 italic leading-relaxed">
                    "{currentScenario.defaultVoiceReason}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= BOTTOM CTA ================= */}
        <div className="pt-4">
          <button
            onClick={handleNextScenarioOrComplete}
            disabled={selectedOption === null}
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm shadow-lg active:scale-[0.98] transition flex items-center justify-center gap-2 ${
              selectedOption === null
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white shadow-orange-600/30 hover:shadow-xl'
            }`}
          >
            <span>
              {currentScenarioIdx < SHADOW_SCENARIOS.length - 1
                ? 'अगली परिस्थिति पर जाएँ'
                : 'अपना निर्णय सबमिट करें'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
