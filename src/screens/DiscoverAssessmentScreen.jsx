import React, { useState } from 'react';
import { ArrowRight, Check, HelpCircle, Mic, MicOff, Sparkles, Volume2, Square, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { DISCOVER_TESTS } from '../demoData';

export default function DiscoverAssessmentScreen() {
  const { navigateTo } = useApp();

  // Test and question index:
  // testIdx: 0, 1, 2 (Test 1, Test 2, Test 3)
  // questionIdx: 0, 1, 2 (Question 1, Question 2, Question 3)
  const [testIdx, setTestIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);

  // Recording State:
  // 'idle' | 'recording' | 'recorded'
  const [recordingState, setRecordingState] = useState('idle');
  const [isTestCompletedModal, setIsTestCompletedModal] = useState(false);

  const currentTest = DISCOVER_TESTS[testIdx];
  const currentQuestion = currentTest.questions[questionIdx];

  const playQuestionVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `परीक्षण ${currentTest.testNumber}, प्रश्न ${currentQuestion.questionNumber}: ${currentQuestion.scenario}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // User manually starts recording
  const handleStartRecording = () => {
    setRecordingState('recording');
  };

  // User manually stops recording
  const handleStopRecording = () => {
    setRecordingState('recorded');
  };

  // Next question or test completion handler
  const handleNextQuestion = () => {
    if (questionIdx < currentTest.questions.length - 1) {
      // Move to next question in current test
      setQuestionIdx((prev) => prev + 1);
      setRecordingState('idle');
    } else {
      // Current test completed
      setIsTestCompletedModal(true);
    }
  };

  const handleNextTest = () => {
    setIsTestCompletedModal(false);
    if (testIdx < DISCOVER_TESTS.length - 1) {
      setTestIdx((prev) => prev + 1);
      setQuestionIdx(0);
      setRecordingState('idle');
    } else {
      // All 3 tests completed! Navigate to result screen
      navigateTo('discoverResult');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between max-w-md mx-auto">
      <Header
        title={`परीक्षण ${currentTest.testNumber}/3`}
        showBack={true}
        stepNumber={testIdx * 3 + questionIdx + 1}
        totalSteps={9}
      />

      <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
        {/* Progress & Domain Header */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                परीक्षण {currentTest.testNumber}/3
              </span>
              <span className="text-xs font-bold text-stone-600 bg-stone-200 px-2.5 py-1 rounded-full">
                प्रश्न {currentQuestion.questionNumber}/3
              </span>
            </div>

            <button
              onClick={playQuestionVoice}
              className="flex items-center gap-1.5 text-xs text-amber-900 bg-amber-100 px-3 py-1 rounded-full font-bold active:scale-95 transition"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-700" />
              <span>सुनें</span>
            </button>
          </div>

          <div className="mt-1">
            <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider block">
              क्षेत्र: {currentTest.domainTitle}
            </span>
            <p className="text-xs text-stone-500">{currentTest.domainDesc}</p>
          </div>
        </div>

        {/* Question Scenario Card */}
        <div className="my-3 bg-white rounded-3xl p-5 border-2 border-orange-200/90 shadow-md relative">
          <div className="flex items-center gap-2 mb-2 text-orange-700 text-xs font-bold">
            <HelpCircle className="w-4 h-4" />
            <span>परिस्थिति {testIdx * 3 + questionIdx + 1}:</span>
          </div>

          <p className="text-base sm:text-lg font-bold text-stone-900 leading-relaxed mb-3">
            "{currentQuestion.scenario}"
          </p>

          <div className="p-2.5 bg-orange-50/80 rounded-xl border border-orange-100 flex items-start gap-2">
            <span className="text-[11px] font-bold text-orange-800 shrink-0">सुझाव:</span>
            <span className="text-[11px] text-stone-600 leading-normal">
              {currentQuestion.hint}
            </span>
          </div>
        </div>

        {/* Manual Recording Section */}
        <div className="flex flex-col items-center justify-center my-2">
          {recordingState === 'idle' && (
            <div className="text-center">
              <button
                type="button"
                onClick={handleStartRecording}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white flex flex-col items-center justify-center shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all mx-auto mb-3"
              >
                <Mic className="w-9 h-9 animate-bounce" />
                <span className="text-[10px] font-bold mt-1">रिकॉर्ड करें</span>
              </button>
              <p className="text-sm font-bold text-stone-800">
                माइक दबाकर उत्तर रिकॉर्ड करें
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                आप जब चाहें तब बोलना शुरू कर सकते हैं
              </p>
            </div>
          )}

          {recordingState === 'recording' && (
            <div className="text-center">
              <div className="relative flex items-center justify-center mb-3">
                <div className="absolute w-32 h-32 rounded-full bg-red-400/30 animate-pulse-ring pointer-events-none" />
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="w-24 h-24 rounded-full bg-red-600 text-white flex flex-col items-center justify-center shadow-xl shadow-red-500/40 ring-4 ring-red-200 active:scale-95 transition-all z-10"
                >
                  <Square className="w-8 h-8 fill-white" />
                  <span className="text-[10px] font-bold mt-1">रोकें</span>
                </button>
              </div>
              <p className="text-sm font-bold text-red-600 animate-pulse">
                आपकी आवाज़ रिकॉर्ड की जा रही है...
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                बोलने के बाद 'रोकें' बटन पर क्लिक करें
              </p>
            </div>
          )}

          {recordingState === 'recorded' && (
            <div className="w-full text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-600/30">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>
              <p className="text-sm font-bold text-emerald-800">
                उत्तर रिकॉर्ड हो गया ✓
              </p>

              {/* Predefined Answer Display */}
              <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-left">
                <span className="text-[10px] font-bold text-emerald-900 block mb-0.5">
                  रिकॉर्ड किया गया उत्तर (ट्रांसक्रिप्ट):
                </span>
                <p className="text-xs text-stone-800 italic leading-relaxed">
                  "{currentQuestion.hardcodedAnswer}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="pt-2">
          {recordingState === 'recorded' ? (
            <button
              onClick={handleNextQuestion}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white font-bold text-lg shadow-lg shadow-orange-600/30 hover:shadow-xl active:scale-[0.98] transition flex items-center justify-center gap-3"
            >
              <span>अगला प्रश्न</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="p-3 text-center text-xs text-stone-500 bg-stone-100 rounded-xl">
              अगले प्रश्न पर जाने के लिए कृपया अपना उत्तर रिकॉर्ड करें
            </div>
          )}
        </div>
      </div>

      {/* Test Completed Modal */}
      {isTestCompletedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-stone-200 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Check className="w-9 h-9 stroke-[3]" />
            </div>

            <h3 className="text-xl font-black text-stone-900 mb-1">
              परीक्षण पूरा हुआ ✓
            </h3>

            <p className="text-xs text-stone-600 mb-4">
              आपने परीक्षण {currentTest.testNumber} ({currentTest.domainTitle}) के सभी 3 प्रश्न सफलतापूर्वक पूर्ण कर लिए हैं।
            </p>

            <button
              onClick={handleNextTest}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-sm shadow-md active:scale-95 transition flex items-center justify-center gap-2"
            >
              <span>{testIdx < DISCOVER_TESTS.length - 1 ? 'अगले परीक्षण पर जाएँ' : 'परिणाम देखें'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
