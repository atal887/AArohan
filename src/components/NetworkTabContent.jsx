import React, { useState } from 'react';
import {
  Volume2,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Users,
  Compass,
  Search,
  Plus,
  Mic,
  Square,
  Globe2,
  Languages,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  Flag,
  Share2,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_NETWORK_EXPERIENCES, SAATHI_POD_DATA } from '../networkData';

export default function NetworkTabContent({ profile, selectedDomain, navigateTo }) {
  // Experiences list state (can be prepended with new user shares)
  const [experiences, setExperiences] = useState(INITIAL_NETWORK_EXPERIENCES);

  // Active filter category: 'सभी' | 'मैंने सीखा' | 'मैंने आज़माया' | 'मैंने कमाया' | 'मैं सुझाता/सुझाती हूँ'
  const [selectedFilter, setSelectedFilter] = useState('सभी');

  // Search keyword state
  const [searchKeyword, setSearchKeyword] = useState('');

  // Local saved list of experience IDs
  const [savedExpIds, setSavedExpIds] = useState(['exp-1']);

  // Local "मैं भी आज़माऊँगा/आज़माऊँगी" tried list of IDs
  const [triedExpIds, setTriedExpIds] = useState([]);

  // Audio speech player state
  const [playingAudioId, setPlayingAudioId] = useState(null);

  // Translation toggles map { [id]: boolean }
  const [translatedMap, setTranslatedMap] = useState({});

  // Share Experience Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('मैंने सीखा');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [recordingVoiceState, setRecordingVoiceState] = useState('idle');

  // Saathi Pod modal state
  const [isPodModalOpen, setIsPodModalOpen] = useState(false);
  const [podActivityCompleted, setPodActivityCompleted] = useState(false);
  const [newPodVoiceRecorded, setNewPodVoiceRecorded] = useState(false);

  const domainName = selectedDomain || 'आपूर्ति श्रृंखला प्रबंधन';

  const filterOptions = [
    'सभी',
    'मैंने सीखा',
    'मैंने आज़माया',
    'मैंने कमाया',
    'मैं सुझाता/सुझाती हूँ'
  ];

  const popularTopics = ['गोदाम', 'परिवहन', 'डिलीवरी', 'सूची प्रबंधन', 'कमाई'];

  // Audio Playback
  const handlePlayVoice = (exp) => {
    if ('speechSynthesis' in window) {
      if (playingAudioId === exp.id) {
        window.speechSynthesis.cancel();
        setPlayingAudioId(null);
      } else {
        window.speechSynthesis.cancel();
        const text = `${exp.authorName}, ${exp.location} से बताते हैं: ${exp.title}। ${exp.fullVoiceText || exp.shortDescription}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';
        utterance.rate = 0.9;
        utterance.onend = () => setPlayingAudioId(null);
        utterance.onerror = () => setPlayingAudioId(null);
        window.speechSynthesis.speak(utterance);
        setPlayingAudioId(exp.id);
      }
    }
  };

  // Toggle Save
  const handleToggleSave = (expId) => {
    if (savedExpIds.includes(expId)) {
      setSavedExpIds(savedExpIds.filter((id) => id !== expId));
    } else {
      setSavedExpIds([...savedExpIds, expId]);
      try {
        confetti({
          particleCount: 25,
          spread: 40,
          origin: { y: 0.8 },
        });
      } catch (e) {}
    }
  };

  // Toggle "मैं भी आज़माऊँगा/आज़माऊँगी"
  const handleToggleTry = (expId) => {
    if (triedExpIds.includes(expId)) {
      setTriedExpIds(triedExpIds.filter((id) => id !== expId));
    } else {
      setTriedExpIds([...triedExpIds, expId]);
      try {
        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.8 },
        });
      } catch (e) {}
    }
  };

  // Toggle Translation
  const handleToggleTranslate = (expId) => {
    setTranslatedMap((prev) => ({
      ...prev,
      [expId]: !prev[expId],
    }));
  };

  // Filter experiences by category and search keyword
  const filteredExperiences = experiences.filter((exp) => {
    const matchesFilter =
      selectedFilter === 'सभी' ||
      exp.category === selectedFilter ||
      (selectedFilter === 'मैं सुझाता/सुझाती हूँ' && (exp.category === 'मैं सुझाता हूँ' || exp.category === 'मैं सुझाती हूँ'));

    const matchesSearch =
      !searchKeyword.trim() ||
      exp.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      exp.shortDescription.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (exp.tags && exp.tags.some((t) => t.toLowerCase().includes(searchKeyword.toLowerCase())));

    return matchesFilter && matchesSearch;
  });

  // Saved experiences for "मेरी सहेजी गई सीख" section
  const savedExperiencesList = experiences.filter((exp) => savedExpIds.includes(exp.id));

  // Submit New Experience
  const handleSubmitNewExperience = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('कृपया अनुभव का शीर्षक दर्ज करें');
      return;
    }

    const createdExp = {
      id: `user-exp-${Date.now()}`,
      authorName: profile?.name || 'दीपक',
      location: profile?.location || 'East Delhi, Delhi',
      state: 'दिल्ली',
      category: newCategory,
      title: newTitle,
      shortDescription:
        newDescription.trim() ||
        'मैंने आपूर्ति श्रृंखला के तहत स्थानीय वितरण केंद्र में व्यावहारिक काम का अनुभव किया और नए तरीके सीखे।',
      fullVoiceText:
        newDescription.trim() ||
        'मैंने आपूर्ति श्रृंखला के तहत स्थानीय वितरण केंद्र में व्यावहारिक काम का अनुभव किया और नए तरीके सीखे।',
      domain: domainName,
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      tags: ['मेरा अनुभव', 'स्थानीय', 'सीख'],
      originalLanguage: 'हिंदी',
      isTranslated: false,
    };

    setExperiences([createdExp, ...experiences]);
    setIsShareModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setRecordingVoiceState('idle');

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {}
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* ================= 1. NETWORK HOME HEADER ================= */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-5 rounded-3xl shadow-lg shadow-blue-700/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            सीख एवं अनुभव साझा मंच
          </span>
          <span className="text-xs text-blue-200 font-bold flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5" />
            <span>अखिल भारतीय</span>
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black leading-tight">
          राष्ट्रीय सीख एवं अनुभव नेटवर्क
        </h2>

        <p className="text-xs text-blue-100 mt-1 font-medium leading-relaxed">
          दूसरे विद्यार्थियों के अनुभवों से सीखें
        </p>

        {/* Personalized Domain Tag */}
        <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
          <div className="text-xs">
            <span className="text-blue-200 text-[11px] block">आपके क्षेत्र से जुड़े अनुभव:</span>
            <span className="font-black text-white text-sm">{domainName}</span>
          </div>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-3.5 py-2 rounded-2xl bg-white text-blue-900 font-black text-xs shadow-md hover:bg-blue-50 active:scale-95 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>अपना अनुभव साझा करें</span>
          </button>
        </div>
      </div>

      {/* ================= 2. SAATHI PODS HIGHLIGHT (साथी समूह) ================= */}
      <div className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 rounded-3xl p-5 border-2 border-purple-200/90 shadow-md">
        <div className="flex items-start justify-between mb-2">
          <div>
            <span className="text-[10px] font-black text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              साथी समूह
            </span>
            <h3 className="text-base font-black text-stone-900 mt-1">
              आपके जैसे लक्ष्य वाले साथी
            </h3>
            <p className="text-xs text-purple-800 font-semibold">
              {SAATHI_POD_DATA.podTitle} • {SAATHI_POD_DATA.totalLearners} सुरक्षित साथी
            </p>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black shadow-xs">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <p className="text-xs text-stone-600 mb-3 leading-relaxed font-medium">
          {SAATHI_POD_DATA.matchReason}
        </p>

        {/* 4 Learner Avatars / Location Badges */}
        <div className="grid grid-cols-4 gap-2 my-3 text-center">
          {SAATHI_POD_DATA.members.map((m) => (
            <div key={m.id} className="p-2 bg-white rounded-2xl border border-purple-100 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 mx-auto flex items-center justify-center font-black text-xs mb-1">
                {m.name.charAt(0)}
              </div>
              <div className="font-bold text-[11px] text-stone-900 truncate">{m.name}</div>
              <div className="text-[10px] text-stone-500 truncate">{m.location}</div>
            </div>
          ))}
        </div>

        {/* Pod Action Button */}
        <button
          onClick={() => setIsPodModalOpen(true)}
          className="w-full py-3 px-4 rounded-2xl bg-purple-700 text-white font-black text-xs shadow-md shadow-purple-700/20 hover:bg-purple-800 active:scale-95 transition flex items-center justify-center gap-2"
        >
          <span>साथी समूह देखें एवं साझा लक्ष्य पूरा करें</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ================= 3. TOP NAVIGATION / FILTERS & SEARCH ================= */}
      <div className="space-y-3">
        {/* Search Bar & Popular Topics */}
        <div className="bg-white p-3.5 rounded-3xl border border-stone-200 shadow-xs space-y-2.5">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-stone-400 absolute left-3" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="क्या खोज रहे हैं? (उदा. गोदाम, डिलीवरी, परिवहन)"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-stone-800 focus:outline-none focus:border-blue-500"
            />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword('')}
                className="absolute right-3 text-xs text-stone-400 font-bold hover:text-stone-700"
              >
                हटाएँ
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-bold text-stone-500 shrink-0">लोकप्रिय विषय:</span>
            {popularTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => setSearchKeyword(topic === searchKeyword ? '' : topic)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold shrink-0 transition ${
                  searchKeyword === topic
                    ? 'bg-blue-600 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* 5 Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black shrink-0 transition-all ${
                selectedFilter === f
                  ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                  : 'bg-white text-stone-700 border border-stone-200 hover:border-blue-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ================= 4. EXPERIENCE CARDS LIST ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-black text-stone-900">
            {selectedFilter === 'सभी' ? 'आपके लिए चुने गए अनुभव' : selectedFilter}
          </h3>
          <span className="text-xs font-bold text-stone-500">
            {filteredExperiences.length} अनुभव
          </span>
        </div>

        {filteredExperiences.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-stone-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-500 flex items-center justify-center mx-auto">
              <Compass className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-stone-900">
              अभी इस विषय पर कोई अनुभव नहीं मिला।
            </h4>
            <button
              onClick={() => {
                setSelectedFilter('सभी');
                setSearchKeyword('');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
            >
              दूसरे विषय देखें
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredExperiences.map((exp) => {
              const isSaved = savedExpIds.includes(exp.id);
              const isTried = triedExpIds.includes(exp.id);
              const isPlaying = playingAudioId === exp.id;
              const isTranslated = Boolean(translatedMap[exp.id]);

              return (
                <div
                  key={exp.id}
                  className="bg-white rounded-3xl p-5 border-2 border-stone-200/90 shadow-xs hover:border-blue-300 transition-all duration-200 space-y-3"
                >
                  {/* Author, Location Badge & State Exposure */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
                        {exp.authorName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-sm text-stone-900">
                            {exp.authorName}
                          </h4>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-900">
                            {exp.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 font-medium flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span>{exp.location}</span>
                        </p>
                      </div>
                    </div>

                    {/* Report action for safety */}
                    <button
                      onClick={() => alert('यह अनुभव समीक्षा के लिए चिह्नित कर दिया गया है।')}
                      title="रिपोर्ट करें"
                      className="text-stone-400 hover:text-red-600 p-1 rounded-lg"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title & Domain */}
                  <div>
                    <h4 className="text-base font-black text-stone-900 leading-snug">
                      "{exp.title}"
                    </h4>
                    <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md inline-block mt-1">
                      क्षेत्र: {exp.domain}
                    </span>
                  </div>

                  {/* Photograph if available */}
                  {exp.imageUrl && (
                    <div className="rounded-2xl overflow-hidden border border-stone-100 max-h-44">
                      <img
                        src={exp.imageUrl}
                        alt={exp.title}
                        className="w-full h-44 object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Description (Original or Translated) */}
                  <p className="text-xs text-stone-700 leading-relaxed font-medium">
                    {isTranslated && exp.translatedText
                      ? exp.translatedText
                      : exp.shortDescription}
                  </p>

                  {/* Translation notice if applicable */}
                  {exp.originalLanguage && exp.originalLanguage !== 'हिंदी' && (
                    <div className="flex items-center justify-between text-[11px] bg-stone-50 p-2 rounded-xl border border-stone-200/70">
                      <span className="text-stone-500 font-semibold flex items-center gap-1">
                        <Languages className="w-3 h-3 text-blue-600" />
                        <span>मूल भाषा: <strong>{exp.originalLanguage}</strong></span>
                      </span>
                      <button
                        onClick={() => handleToggleTranslate(exp.id)}
                        className="text-blue-700 font-black hover:underline"
                      >
                        {isTranslated ? 'मूल भाषा में देखें' : 'हिंदी में अनुवाद करें'}
                      </button>
                    </div>
                  )}

                  {/* Voice Button */}
                  <div className="pt-1">
                    <button
                      onClick={() => handlePlayVoice(exp)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition ${
                        isPlaying
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{isPlaying ? 'ऑडियो रोकें' : '🔊 सुनें (बोलकर सुनें)'}</span>
                    </button>
                  </div>

                  {/* Action Buttons: सहेजें + मैं भी आज़माऊँगा/आज़माऊँगी */}
                  <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                    <button
                      onClick={() => handleToggleSave(exp.id)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                        isSaved
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <BookmarkCheck className="w-3.5 h-3.5 text-emerald-700" />
                          <span>सहेजा गया ✓</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5 text-stone-600" />
                          <span>सहेजें</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleToggleTry(exp.id)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                        isTried
                          ? 'bg-orange-100 text-orange-950 border border-orange-300'
                          : 'bg-orange-600 text-white hover:bg-orange-700 shadow-xs'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isTried ? 'सूची में जोड़ा गया ✓' : 'मैं भी आज़माऊँगा/आज़माऊँगी'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= 5. "मेरी सहेजी गई सीख" (SAVED EXPERIENCES SECTION) ================= */}
      {savedExperiencesList.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <h3 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-emerald-600" />
              <span>मेरी सहेजी गई सीख ({savedExperiencesList.length})</span>
            </h3>
            <span className="text-[11px] text-stone-500 font-bold">त्वरित पहुंच</span>
          </div>

          <div className="space-y-2">
            {savedExperiencesList.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-2"
              >
                <div>
                  <h5 className="font-bold text-xs text-stone-900 leading-snug">{item.title}</h5>
                  <p className="text-[10px] text-stone-500">{item.authorName} • {item.location}</p>
                </div>
                <button
                  onClick={() => handlePlayVoice(item)}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-100 text-amber-900 font-bold text-[11px] shrink-0 flex items-center gap-1"
                >
                  <Volume2 className="w-3 h-3 text-amber-700" />
                  <span>सुनें</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 6. SAFETY NOTICE FOOTER ================= */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-medium">
          <strong>सुरक्षा निर्देश:</strong> यह केवल एक शैक्षणिक सीख मंच है। अपना मोबाइल नंबर, घर का पता या निजी जानकारी कभी भी साझा न करें।
        </p>
      </div>

      {/* ================= 7. MODAL: अपना अनुभव साझा करें ================= */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 animate-fadeIn space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-base font-black text-stone-900">
                अपना अनुभव साझा करें
              </h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewExperience} className="space-y-3.5">
              {/* Category Options */}
              <div>
                <label className="block text-xs font-black text-stone-800 mb-1.5">
                  आप क्या साझा करना चाहते हैं?
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['मैंने सीखा', 'मैंने आज़माया', 'मैंने कमाया', 'मैं सुझाता/सुझाती हूँ'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewCategory(cat)}
                      className={`p-2.5 rounded-xl border text-center font-bold transition ${
                        newCategory === cat
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-black text-stone-800 mb-1">
                  अनुभव का शीर्षक
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. डिपो में पहली बार बारकोड स्कैन किया"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-bold text-stone-900"
                />
              </div>

              {/* Voice Recording / Description */}
              <div>
                <label className="block text-xs font-black text-stone-800 mb-1">
                  आपने क्या किया?
                </label>

                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center mb-2">
                  {recordingVoiceState === 'idle' && (
                    <button
                      type="button"
                      onClick={() => setRecordingVoiceState('recording')}
                      className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 mx-auto"
                    >
                      <Mic className="w-4 h-4" />
                      <span>🎙️ आवाज़ में बताएं</span>
                    </button>
                  )}

                  {recordingVoiceState === 'recording' && (
                    <button
                      type="button"
                      onClick={() => {
                        setRecordingVoiceState('recorded');
                        setNewDescription('मैंने स्थानीय वेयरहाउस में इन्वेंटरी ऑडिट में हिस्सा लिया और सीखा कि खराब सामान को तुरंत अलग करके रिपोर्ट कैसे दर्ज करते हैं।');
                      }}
                      className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 mx-auto animate-pulse"
                    >
                      <Square className="w-4 h-4 fill-white" />
                      <span>रिकॉर्ड रोकें</span>
                    </button>
                  )}

                  {recordingVoiceState === 'recorded' && (
                    <div className="text-left text-xs text-stone-800 bg-white p-2.5 rounded-xl border border-emerald-200">
                      <span className="font-bold text-emerald-800 block text-[10px]">आपकी बात:</span>
                      "{newDescription}"
                    </div>
                  )}
                </div>

                <textarea
                  rows={2}
                  placeholder="या यहाँ लिखकर बताएं..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-800"
                />
              </div>

              {/* Safety notice in modal */}
              <p className="text-[10px] text-stone-500">
                ⚠️ अपना मोबाइल नंबर या निजी जानकारी साझा न करें।
              </p>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 text-white font-black text-xs shadow-md active:scale-95 transition"
              >
                अपना अनुभव साझा करें
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= 8. MODAL: साथी समूह स्क्रीन (SAATHI POD SCREEN) ================= */}
      {isPodModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 animate-fadeIn space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div>
                <span className="text-[10px] font-bold text-purple-700 uppercase">सुरक्षित साथी नेटवर्क</span>
                <h3 className="text-base font-black text-stone-900">
                  आपका साथी समूह
                </h3>
              </div>
              <button
                onClick={() => setIsPodModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* 4 Verified Learners */}
            <div className="space-y-2">
              <span className="text-xs font-black text-stone-700 block">
                समूह के 4 साथी:
              </span>
              {SAATHI_POD_DATA.members.map((member) => (
                <div
                  key={member.id}
                  className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-black text-xs flex items-center justify-center">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">{member.name}</div>
                      <div className="text-[10px] text-stone-500">{member.focusDomain} • {member.location}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {member.verifiedBadge}
                  </span>
                </div>
              ))}
            </div>

            {/* Shared Goal & Weekly Goal */}
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 space-y-1.5 text-xs">
              <div>
                <span className="text-[10px] text-purple-800 font-bold uppercase block">साझा लक्ष्य:</span>
                <span className="font-bold text-stone-900">{SAATHI_POD_DATA.sharedGoal}</span>
              </div>
              <div className="pt-1 border-t border-purple-100">
                <span className="text-[10px] text-purple-800 font-bold uppercase block">इस सप्ताह का लक्ष्य:</span>
                <span className="font-black text-purple-950">{SAATHI_POD_DATA.weeklyGoal}</span>
              </div>
            </div>

            {/* Weekly Pod Activity */}
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 text-xs">
              <div className="font-bold text-amber-950">
                {SAATHI_POD_DATA.weeklyActivity.title}
              </div>
              <p className="text-stone-700">
                "{SAATHI_POD_DATA.weeklyActivity.description}"
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setPodActivityCompleted(true);
                    try {
                      confetti({ particleCount: 30, spread: 50 });
                    } catch (e) {}
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-xl font-bold text-[11px] ${
                    podActivityCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 text-white hover:bg-amber-700'
                  }`}
                >
                  {podActivityCompleted ? 'मैंने पूरा किया ✓' : 'मैंने पूरा किया'}
                </button>

                <button
                  type="button"
                  onClick={() => setNewPodVoiceRecorded(true)}
                  className={`flex-1 py-1.5 px-3 rounded-xl font-bold text-[11px] ${
                    newPodVoiceRecorded
                      ? 'bg-purple-600 text-white'
                      : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                  }`}
                >
                  {newPodVoiceRecorded ? 'आवाज़ साझा की ✓' : 'आवाज़ में साझा करें'}
                </button>
              </div>
            </div>

            {/* Child Safety Constraint */}
            <div className="p-2.5 bg-stone-100 rounded-xl text-[10px] text-stone-600 leading-normal">
              <strong>सुरक्षित संवाद:</strong> {SAATHI_POD_DATA.safetyNotice}
            </div>

            <button
              onClick={() => setIsPodModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs"
            >
              बंद करें
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
