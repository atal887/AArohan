import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lock,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Award,
  HelpCircle,
  Mic,
  Square,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SUPPLY_CHAIN_MODULES, DOMAIN_DOUBTS } from '../curriculumData';
import { LESSON_SLIDECASTS } from '../slidecastData';

export default function LearnTabContent({ profile, selectedDomain }) {
  // State: unlocked modules up to highest completed (1 is open initially)
  const [unlockedModules, setUnlockedModules] = useState([1]);
  const [activeModuleId, setActiveModuleId] = useState(1);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);

  // Lesson view mode: 'list' (modules view) | 'slidecast' (immersive lesson player)
  const [viewMode, setViewMode] = useState('list');

  // Synchronized Slidecast State
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0); // 0 to 100%

  // Knowledge check state: null or selected option index
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // Voice doubt states
  const [doubtRecordingState, setDoubtRecordingState] = useState('idle');
  const [selectedDoubt, setSelectedDoubt] = useState(DOMAIN_DOUBTS[0]);
  const [expandedDoubtId, setExpandedDoubtId] = useState(1);

  const activeModule = SUPPLY_CHAIN_MODULES.find((m) => m.moduleId === activeModuleId) || SUPPLY_CHAIN_MODULES[0];
  const activeLesson = activeModule.lessons[activeLessonIdx] || activeModule.lessons[0];

  // Get synchronized slidecast data for active lesson
  const slidecastData = LESSON_SLIDECASTS[activeLesson.lessonId] || {
    lessonTitle: activeLesson.title,
    totalDuration: 24,
    slides: [
      {
        slideNumber: 1,
        tag: "अवधारणा परिचय",
        heading: activeLesson.title,
        text: activeLesson.subtitle,
        imageUrl: activeLesson.imageUrl,
        imageCaption: activeLesson.imageCaption,
        audioScript: activeLesson.teacherScript,
        durationSeconds: 8
      },
      {
        slideNumber: 2,
        tag: "वास्तविक उदाहरण",
        heading: activeLesson.title + " का वास्तविक उदाहरण",
        text: activeLesson.keyPoints?.[0] || activeLesson.subtitle,
        imageUrl: activeLesson.imageUrl,
        imageCaption: activeLesson.imageCaption,
        audioScript: activeLesson.teacherScript,
        durationSeconds: 8
      },
      {
        slideNumber: 3,
        tag: "व्यावहारिक अनुप्रयोग",
        heading: "उद्योग में व्यावहारिक अनुप्रयोग",
        text: activeLesson.keyPoints?.[1] || activeLesson.subtitle,
        imageUrl: activeLesson.imageUrl,
        imageCaption: activeLesson.imageCaption,
        audioScript: activeLesson.teacherScript,
        durationSeconds: 8
      }
    ]
  };

  const currentSlide = slidecastData.slides[currentSlideIdx] || slidecastData.slides[0];

  // Calculate overall course progress (out of 24 lessons across 8 modules)
  const totalLessonsInCourse = SUPPLY_CHAIN_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessonsCount = (unlockedModules.length - 1) * 3 + activeLessonIdx;
  const overallProgressPercent = Math.min(100, Math.round((completedLessonsCount / totalLessonsInCourse) * 100));

  // Refs for tracking audio playback intervals and slide synchronization
  const playbackTimerRef = useRef(null);
  const currentSlideRef = useRef(0);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    currentSlideRef.current = currentSlideIdx;
  }, [currentSlideIdx]);

  useEffect(() => {
    isPlayingRef.current = isPlayingAudio;
  }, [isPlayingAudio]);

  // Clean up speech synthesis & timers when switching lesson, module, or leaving slidecast
  useEffect(() => {
    return () => {
      stopSlidecastAudio();
    };
  }, [activeLesson.lessonId, viewMode]);

  // Stop slidecast audio & reset interval
  const stopSlidecastAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
    setIsPlayingAudio(false);
  };

  // Play slide audio segment
  const speakCurrentSlide = (slideIdx) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const slide = slidecastData.slides[slideIdx];
    if (!slide) return;

    const utterance = new SpeechSynthesisUtterance(slide.audioScript);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;

    utterance.onend = () => {
      // Audio for this slide finished. If not on last slide, auto-advance to next slide
      if (slideIdx < slidecastData.slides.length - 1 && isPlayingRef.current) {
        const nextSlide = slideIdx + 1;
        setCurrentSlideIdx(nextSlide);
        speakCurrentSlide(nextSlide);
      } else {
        // Last slide finished
        stopSlidecastAudio();
        setAudioProgress(100);
      }
    };

    utterance.onerror = () => {
      stopSlidecastAudio();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Toggle Play / Pause synchronized slidecast
  const handleToggleSlidecast = () => {
    if (isPlayingAudio) {
      stopSlidecastAudio();
    } else {
      setIsPlayingAudio(true);
      // Start or resume from current slide
      speakCurrentSlide(currentSlideIdx);

      // Start progress simulation timer
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            return 100;
          }
          return Math.min(100, prev + 1.2);
        });
      }, 300);
    }
  };

  // Manual Slide Navigation (Previous Slide)
  const handlePrevSlide = () => {
    if (currentSlideIdx > 0) {
      const prevIdx = currentSlideIdx - 1;
      setCurrentSlideIdx(prevIdx);
      setAudioProgress(Math.round((prevIdx / slidecastData.slides.length) * 100));
      if (isPlayingAudio) {
        speakCurrentSlide(prevIdx);
      }
    }
  };

  // Manual Slide Navigation (Next Slide)
  const handleNextSlide = () => {
    if (currentSlideIdx < slidecastData.slides.length - 1) {
      const nextIdx = currentSlideIdx + 1;
      setCurrentSlideIdx(nextIdx);
      setAudioProgress(Math.round((nextIdx / slidecastData.slides.length) * 100));
      if (isPlayingAudio) {
        speakCurrentSlide(nextIdx);
      }
    }
  };

  // Jump to specific slide index
  const handleSelectSlide = (idx) => {
    setCurrentSlideIdx(idx);
    setAudioProgress(Math.round((idx / slidecastData.slides.length) * 100));
    if (isPlayingAudio) {
      speakCurrentSlide(idx);
    }
  };

  // Restart Slidecast from beginning
  const handleRestartSlidecast = () => {
    stopSlidecastAudio();
    setCurrentSlideIdx(0);
    setAudioProgress(0);
    setTimeout(() => {
      setIsPlayingAudio(true);
      speakCurrentSlide(0);
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = setInterval(() => {
        setAudioProgress((prev) => Math.min(100, prev + 1.2));
      }, 300);
    }, 150);
  };

  const handleOpenModule = (modId) => {
    if (unlockedModules.includes(modId)) {
      stopSlidecastAudio();
      setActiveModuleId(modId);
      setActiveLessonIdx(0);
      setCurrentSlideIdx(0);
      setAudioProgress(0);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setViewMode('slidecast');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Next Lesson / Next Module logic
  const handleNextLesson = () => {
    stopSlidecastAudio();
    setCurrentSlideIdx(0);
    setAudioProgress(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);

    if (activeLessonIdx < activeModule.lessons.length - 1) {
      setActiveLessonIdx((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Completed last lesson of this module! Unlock next module if available
      const nextModId = activeModuleId + 1;
      if (nextModId <= SUPPLY_CHAIN_MODULES.length && !unlockedModules.includes(nextModId)) {
        setUnlockedModules((prev) => [...prev, nextModId]);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch (e) {}
      }
      setViewMode('list');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevLesson = () => {
    stopSlidecastAudio();
    setCurrentSlideIdx(0);
    setAudioProgress(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);

    if (activeLessonIdx > 0) {
      setActiveLessonIdx((prev) => prev - 1);
    }
  };

  // Knowledge check option click
  const handleSelectOption = (idx) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(idx);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer !== null) {
      setIsAnswerSubmitted(true);
      if (selectedAnswer === activeLesson.knowledgeCheck.correctIndex) {
        try {
          confetti({
            particleCount: 30,
            spread: 40,
            origin: { y: 0.8 },
          });
        } catch (e) {}
      }
    }
  };

  // Voice doubts start / stop
  const handleStartDoubtRecording = () => {
    setDoubtRecordingState('recording');
  };

  const handleStopDoubtRecording = () => {
    setDoubtRecordingState('recorded');
    setSelectedDoubt(DOMAIN_DOUBTS[0]);
    setExpandedDoubtId(1);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-6">
      {/* ================= COURSE HEADER ================= */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-5 rounded-3xl shadow-lg shadow-orange-600/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            संरचित शिक्षण पाठ्यक्रम
          </span>
          <span className="text-xs font-bold text-amber-200">
            {unlockedModules.length} / 8 मॉड्यूल खुले
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black leading-tight">
          आपकी सीखने की यात्रा
        </h2>

        <p className="text-xs text-orange-100 mt-1 font-medium">
          चयनित क्षेत्र: <strong>{selectedDomain || 'आपूर्ति श्रृंखला प्रबंधन'}</strong> • शिक्षार्थी: {profile?.name}
        </p>

        {/* Overall Course Progress */}
        <div className="mt-4 pt-3 border-t border-white/20">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span>संपूर्ण पाठ्यक्रम प्रगति</span>
            <span>{overallProgressPercent}% पूर्ण</span>
          </div>
          <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-500 rounded-full"
              style={{ width: `${Math.max(5, overallProgressPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ================= VIEW MODE 1: MODULES LIST ================= */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-600" />
              <span>पाठ्यक्रम मॉड्यूल (8 चरण)</span>
            </h3>
            <span className="text-xs text-stone-500 font-bold">कुल 23 पाठ</span>
          </div>

          <div className="space-y-3.5">
            {SUPPLY_CHAIN_MODULES.map((mod) => {
              const isUnlocked = unlockedModules.includes(mod.moduleId);
              const isCurrent = unlockedModules[unlockedModules.length - 1] === mod.moduleId;
              const isCompleted = unlockedModules.includes(mod.moduleId + 1);

              return (
                <div
                  key={mod.moduleId}
                  className={`rounded-3xl p-4 sm:p-5 border-2 transition-all duration-200 ${
                    isUnlocked
                      ? 'bg-white border-orange-200 shadow-xs hover:border-orange-400'
                      : 'bg-stone-100 border-stone-200 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                          isUnlocked
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        मॉड्यूल {mod.moduleNumber}
                      </span>
                      <span className="text-xs font-bold text-stone-500">
                        {mod.totalLessons} पाठ
                      </span>
                    </div>

                    {isCompleted ? (
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> पूर्ण
                      </span>
                    ) : isCurrent ? (
                      <span className="text-xs font-extrabold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full animate-pulse">
                        सक्रिय
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-stone-400 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> लॉक
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-black text-stone-900 leading-snug">
                    {mod.title}
                  </h4>

                  <p className="text-xs text-stone-600 mt-1 mb-3.5 leading-relaxed font-medium">
                    {mod.shortDesc}
                  </p>

                  {isUnlocked ? (
                    <button
                      onClick={() => handleOpenModule(mod.moduleId)}
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black text-xs shadow-md shadow-orange-600/20 hover:shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>{isCompleted ? 'पुनः देखें' : 'शुरू करें'}</span>
                    </button>
                  ) : (
                    <div className="py-2.5 px-4 rounded-2xl bg-stone-200 text-stone-500 font-bold text-xs text-center flex items-center justify-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>पिछले मॉड्यूल को पूरा करने पर खुलेगा</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= VIEW MODE 2: SLIDE-CAST LESSON PLAYER ================= */}
      {viewMode === 'slidecast' && (
        <div className="space-y-4">
          {/* Back to Modules Navigation */}
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              setIsPlayingAudio(false);
              setViewMode('list');
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 py-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>सभी मॉड्यूल पर वापस जाएं</span>
          </button>

          {/* Module & Lesson Tracker */}
          <div className="bg-white rounded-3xl p-5 border-2 border-orange-200 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-orange-800 bg-orange-100 px-3 py-1 rounded-full">
                मॉड्यूल {activeModule.moduleNumber}: {activeModule.title}
              </span>
              <span className="text-xs font-bold text-stone-500">
                पाठ {activeLesson.lessonNumber} / {activeModule.lessons.length}
              </span>
            </div>

            {/* Lesson Progress Bar in current module */}
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mb-4">
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-full transition-all duration-300"
                style={{
                  width: `${((activeLessonIdx + 1) / activeModule.lessons.length) * 100}%`,
                }}
              />
            </div>

            {/* Lesson Title */}
            <h3 className="text-lg font-black text-stone-900 leading-snug">
              {activeLesson.title}
            </h3>
            <p className="text-xs text-orange-700 font-semibold mt-0.5 mb-3">
              {activeLesson.subtitle}
            </p>

            {/* ================= SYNCHRONIZED SLIDECAST REEL PLAYER ================= */}
            <div className="bg-stone-900 rounded-3xl p-4 sm:p-5 text-white shadow-xl border border-stone-800 mb-5">
              {/* Slidecast Header & Mode Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    {isPlayingAudio && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isPlayingAudio ? 'bg-orange-500' : 'bg-stone-500'}`}></span>
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider text-orange-400 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>सक्रिय स्लाइडकास्ट</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-300 bg-stone-800 px-2.5 py-1 rounded-full border border-stone-700">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>स्लाइड {currentSlideIdx + 1} / {slidecastData.slides.length}</span>
                </div>
              </div>

              {/* Instagram/Reel-style Progress Segments for Slides */}
              <div className="grid grid-cols-3 gap-1.5 mb-3.5">
                {slidecastData.slides.map((s, idx) => {
                  const isCompleted = idx < currentSlideIdx;
                  const isCurrent = idx === currentSlideIdx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSlide(idx)}
                      className="group relative h-1.5 rounded-full bg-stone-700/80 overflow-hidden cursor-pointer"
                      title={`स्लाइड ${idx + 1}: ${s.heading}`}
                    >
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          isCompleted
                            ? 'bg-orange-500 w-full'
                            : isCurrent
                            ? isPlayingAudio
                              ? 'bg-gradient-to-r from-orange-400 to-amber-300 w-full animate-pulse'
                              : 'bg-orange-400 w-full'
                            : 'w-0'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Synchronized Photographic Slide Display */}
              <div className="relative rounded-2xl overflow-hidden border border-stone-700 shadow-inner bg-black aspect-video sm:aspect-auto sm:h-56 mb-3 group">
                <img
                  key={currentSlide.imageUrl}
                  src={currentSlide.imageUrl}
                  alt={currentSlide.heading}
                  className="w-full h-full object-cover transition-all duration-700 ease-out transform group-hover:scale-105"
                  loading="eager"
                />

                {/* Slide Tag Badge Overlay */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="bg-orange-600/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                    {currentSlide.tag}
                  </span>
                </div>

                {/* Bottom Gradient Overlay with Slide Heading & Narration Excerpt */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/75 to-transparent p-3 sm:p-4 text-white">
                  <p className="text-xs sm:text-sm font-black leading-snug drop-shadow-sm text-stone-100">
                    {currentSlide.heading}
                  </p>
                  <p className="text-[11px] sm:text-xs text-stone-300 line-clamp-2 mt-0.5 font-medium leading-relaxed">
                    {currentSlide.text}
                  </p>
                </div>
              </div>

              {/* Active Slide Teacher Script Preview */}
              <div className="bg-stone-800/90 rounded-2xl p-3 border border-stone-700/80 mb-3.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>शिक्षक की बोलती आवाज (हिंदी विवरण):</span>
                  </span>
                  <span className="text-[10px] text-stone-400 font-medium">
                    {currentSlide.durationSeconds} सेकंड
                  </span>
                </div>
                <p className="text-xs text-stone-200 font-medium leading-relaxed">
                  "{currentSlide.audioScript}"
                </p>
              </div>

              {/* Playback & Slidecast Navigation Controls */}
              <div className="space-y-3">
                {/* Audio Progress Bar */}
                <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-amber-400 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${Math.max(5, audioProgress)}%` }}
                  />
                </div>

                {/* Primary Control Buttons */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevSlide}
                      disabled={currentSlideIdx === 0}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center ${
                        currentSlideIdx === 0
                          ? 'border-stone-800 text-stone-600 cursor-not-allowed'
                          : 'border-stone-700 text-stone-200 hover:bg-stone-800 active:scale-95'
                      }`}
                      title="पिछली स्लाइड"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleRestartSlidecast}
                      className="p-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 active:scale-95 transition"
                      title="शुरू से पुनः चलाएँ"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Main Play/Pause Button */}
                  <button
                    onClick={handleToggleSlidecast}
                    className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-md ${
                      isPlayingAudio
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30 animate-pulse'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/25'
                    }`}
                  >
                    {isPlayingAudio ? (
                      <>
                        <Pause className="w-4 h-4 fill-white" />
                        <span>आवाज़ रोकें (Pause)</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>▶️ पाठ सुनें और सीखें (Play Slidecast)</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleNextSlide}
                    disabled={currentSlideIdx === slidecastData.slides.length - 1}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center ${
                      currentSlideIdx === slidecastData.slides.length - 1
                        ? 'border-stone-800 text-stone-600 cursor-not-allowed'
                        : 'border-stone-700 text-stone-200 hover:bg-stone-800 active:scale-95'
                    }`}
                    title="अगली स्लाइड"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-400 px-1 pt-1">
                  <span>
                    {isPlayingAudio
                      ? `स्लाइड ${currentSlideIdx + 1} चल रही है... (${currentSlide.tag})`
                      : 'ऑडियो के साथ 3 स्लाइड स्वतः बदलेंगी'}
                  </span>
                  <span className="font-bold text-amber-400">
                    अवधारणा → उदाहरण → अनुप्रयोग
                  </span>
                </div>
              </div>
            </div>

            {/* 2-4 Short Bullet Points on Screen */}
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-2 mb-4">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                पाठ की मुख्य बातें:
              </span>
              {activeLesson.keyPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-2 text-xs font-bold text-stone-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* Quick Knowledge Check ("मैंने समझा") */}
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/90 mb-4">
              <div className="flex items-center gap-1.5 mb-2">
                <GraduationCap className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-black text-amber-900 uppercase tracking-wider">
                  त्वरित समझ जाँच (मैंने समझा)
                </span>
              </div>

              <p className="text-xs font-bold text-stone-900 mb-3">
                {activeLesson.knowledgeCheck.question}
              </p>

              <div className="space-y-2 mb-3">
                {activeLesson.knowledgeCheck.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === activeLesson.knowledgeCheck.correctIndex;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                        isAnswerSubmitted
                          ? isCorrect
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                            : isSelected
                            ? 'bg-red-100 border-red-300 text-red-900'
                            : 'bg-white border-stone-200 text-stone-600'
                          : isSelected
                          ? 'bg-orange-100 border-orange-400 text-orange-950'
                          : 'bg-white border-stone-200 text-stone-800 hover:border-orange-200'
                      }`}
                    >
                      <span>{opt}</span>
                      {isAnswerSubmitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className={`w-full py-2.5 rounded-xl font-black text-xs transition ${
                    selectedAnswer === null
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : 'bg-amber-600 text-white shadow-xs hover:bg-amber-700 active:scale-95'
                  }`}
                >
                  उत्तर जाँचें
                </button>
              ) : (
                <div className="p-2.5 bg-white rounded-xl border border-amber-200 text-xs font-medium text-stone-700">
                  <span className="font-bold text-stone-900 block mb-0.5">व्याख्या:</span>
                  {activeLesson.knowledgeCheck.explanation}
                </div>
              )}
            </div>

            {/* Previous / Next Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <button
                onClick={handlePrevLesson}
                disabled={activeLessonIdx === 0}
                className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                  activeLessonIdx === 0
                    ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                    : 'bg-stone-200 text-stone-800 hover:bg-stone-300 active:scale-95'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>पिछला पाठ</span>
              </button>

              <button
                onClick={handleNextLesson}
                className="px-4 py-2.5 rounded-xl bg-orange-600 text-white font-black text-xs hover:bg-orange-700 shadow-md shadow-orange-600/25 active:scale-95 transition flex items-center gap-1.5"
              >
                <span>
                  {activeLessonIdx < activeModule.lessons.length - 1
                    ? 'अगला पाठ'
                    : 'मॉड्यूल पूर्ण करें'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION: अपना सवाल पूछें (VOICE DOUBTS) ================= */}
      <div className="bg-white rounded-3xl p-5 border-2 border-stone-200/90 shadow-md">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <h3 className="text-base font-black text-stone-900">
              कुछ समझ नहीं आया?
            </h3>
          </div>
          <p className="text-xs text-stone-600 font-medium">
            अपनी आवाज़ में सवाल पूछें — नीचे दिए माइक बटन का उपयोग करें।
          </p>
        </div>

        {/* Manual Recording Start / Stop */}
        <div className="p-4 bg-orange-50/70 rounded-3xl border border-orange-200 text-center mb-5">
          {doubtRecordingState === 'idle' && (
            <div>
              <button
                type="button"
                onClick={handleStartDoubtRecording}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-600 to-amber-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-orange-600/30 active:scale-95 transition hover:scale-105 mb-2"
              >
                <Mic className="w-7 h-7" />
              </button>
              <div className="font-black text-xs text-stone-900">
                🎙️ सवाल रिकॉर्ड करें
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                माइक दबाकर बोलना शुरू करें
              </p>
            </div>
          )}

          {doubtRecordingState === 'recording' && (
            <div className="relative">
              <button
                type="button"
                onClick={handleStopDoubtRecording}
                className="w-16 h-16 rounded-full bg-red-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-red-600/40 ring-4 ring-red-200 active:scale-95 transition mb-2"
              >
                <Square className="w-6 h-6 fill-white" />
              </button>
              <div className="font-black text-xs text-red-600 animate-pulse">
                आपकी आवाज़ सुनी जा रही है...
              </div>
              <p className="text-[11px] text-stone-600 mt-0.5">
                बोलने के बाद 'रोकें' दबाएं
              </p>
            </div>
          )}

          {doubtRecordingState === 'recorded' && (
            <div>
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center mb-1.5 shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="font-black text-xs text-emerald-800">
                सवाल दर्ज हो गया ✓
              </div>

              {/* Recorded Query Match Response */}
              <div className="mt-3 p-3.5 bg-white rounded-2xl border border-emerald-200 text-left">
                <span className="text-[10px] font-bold text-stone-500 uppercase block mb-0.5">
                  पहचाना गया सवाल:
                </span>
                <p className="text-xs font-bold text-stone-900 mb-1.5">
                  "{selectedDoubt.question}"
                </p>
                <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-0.5">
                  उत्तर:
                </span>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  {selectedDoubt.answer}
                </p>
              </div>

              <button
                onClick={() => setDoubtRecordingState('idle')}
                className="mt-3 text-[11px] font-bold text-orange-700 hover:text-orange-900"
              >
                नया सवाल पूछें
              </button>
            </div>
          )}
        </div>

        {/* 5 Common Doubts Compact Cards */}
        <div>
          <h4 className="text-xs font-black text-stone-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
            <span>सामान्य सवाल</span>
          </h4>

          <div className="space-y-2">
            {DOMAIN_DOUBTS.map((doubt) => {
              const isExpanded = expandedDoubtId === doubt.id;

              return (
                <div
                  key={doubt.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'bg-orange-50/70 border-orange-300 shadow-xs'
                      : 'bg-stone-50 border-stone-200 hover:border-orange-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedDoubtId(isExpanded ? null : doubt.id)}
                    className="w-full p-3 text-left flex items-center justify-between gap-2"
                  >
                    <span className="text-xs font-bold text-stone-900 leading-snug">
                      {doubt.id}. {doubt.question}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-orange-700 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-3 pb-3 pt-1 text-xs text-stone-700 leading-relaxed border-t border-orange-100/80 font-medium">
                      <span className="font-bold text-orange-900 block mb-0.5">
                        उत्तर:
                      </span>
                      {doubt.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
