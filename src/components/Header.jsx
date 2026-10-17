import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Volume2, User, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header({ title, showBack = true, stepNumber, totalSteps }) {
  const { goBack, resetDemo, currentScreen, profile, studentData, isDiscoverCompleted, navigateTo } = useApp();


  // Audio prompt simulator in pure Hindi for low literacy users
  const playScreenVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(title || 'AAROHAN में आपका स्वागत है');
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-xs">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showBack && currentScreen !== 'language' && currentScreen !== 'welcome' && currentScreen !== 'dashboard' && (
              <button
                onClick={goBack}
                aria-label="पीछे जाएं"
                className="p-2 -ml-2 rounded-xl text-stone-700 hover:bg-orange-50 active:scale-95 transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-stone-800" />
              </button>
            )}

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-orange-600 text-lg tracking-tight flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                  AAROHAN
                </span>
                <span className="text-[10px] font-semibold bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-full">
                  डेमो
                </span>
              </div>
              {title && (
                <h1 className="text-sm font-semibold text-stone-800 truncate max-w-[180px]">
                  {title}
                </h1>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Read aloud button in pure Hindi */}
            <button
              onClick={playScreenVoice}
              title="बोलकर सुनें"
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold hover:bg-amber-100 active:scale-95 transition"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">सुनें</span>
            </button>

            {/* Profile icon (👤) in TOP-RIGHT - navigates to dedicated "मेरी प्रोफ़ाइल" screen */}
            <button
              onClick={() => navigateTo('learnerProfile')}
              title="मेरी प्रोफ़ाइल"
              aria-label="मेरी प्रोफ़ाइल"
              className="w-9 h-9 rounded-xl bg-orange-50 text-stone-700 border border-orange-200/80 hover:bg-orange-100 hover:text-orange-900 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-2xs"
            >
              <User className="w-4 h-4 text-stone-700 hover:text-orange-800" />
            </button>

            {/* Reset button for hackathon judges demo */}
            <button
              onClick={resetDemo}
              title="प्रारंभ से शुरू करें"
              className="p-2 rounded-xl text-stone-500 hover:bg-stone-100 active:rotate-180 transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4 text-stone-600" />
            </button>
          </div>
        </div>

        {/* Progress bar if step is provided */}
        {stepNumber && totalSteps && (
          <div className="w-full bg-orange-100 h-1">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-1 transition-all duration-500 ease-out"
              style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
            />
          </div>
        )}
      </header>
    </>
  );
}
