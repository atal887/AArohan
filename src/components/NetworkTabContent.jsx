import React, { useState, useRef, useEffect } from 'react';
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
  MapPin,
  Send,
  Calendar,
  Shield,
  BellOff,
  LogOut,
  Target,
  MessageSquare,
  Info,
  Pause,
  Play
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

  // Saathi Pod modal state & interactive features
  const [isPodModalOpen, setIsPodModalOpen] = useState(false);
  const [podSubTab, setPodSubTab] = useState('chat'); // 'chat' | 'members' | 'coordination'
  const [podMessages, setPodMessages] = useState(SAATHI_POD_DATA.initialMessages);
  const [newPodInputText, setNewPodInputText] = useState('');
  const [isPodVoiceRecording, setIsPodVoiceRecording] = useState(false);
  const [podVoiceDuration, setPodVoiceDuration] = useState(0);
  const [playingPodVoiceId, setPlayingPodVoiceId] = useState(null);
  const [isCoordinatedJoined, setIsCoordinatedJoined] = useState(false);
  const [podNoticeToast, setPodNoticeToast] = useState('');
  const [isPodMuted, setIsPodMuted] = useState(false);
  const [isPodReported, setIsPodReported] = useState(false);
  const [isPodLeft, setIsPodLeft] = useState(false);

  const voiceRecordIntervalRef = useRef(null);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (isPodModalOpen && podSubTab === 'chat' && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isPodModalOpen, podSubTab, podMessages.length]);

  const showPodToast = (msg) => {
    setPodNoticeToast(msg);
    setTimeout(() => setPodNoticeToast(''), 3000);
  };

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

  // Pod Chat Handlers
  const handleSendPodTextMessage = (e) => {
    e?.preventDefault();
    if (!newPodInputText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: 'self',
      senderName: profile?.name || 'आप (शिक्षार्थी)',
      senderLocation: profile?.location || 'पूर्वी दिल्ली',
      timeText: 'अभी',
      type: 'text',
      text: newPodInputText.trim(),
      isSelf: true
    };

    setPodMessages((prev) => [...prev, newMsg]);
    setNewPodInputText('');

    // Simulate an encouraging supportive peer reply after 2.5 seconds
    setTimeout(() => {
      const responses = [
        "बहुत बढ़िया! मिलकर अभ्यास करेंगे तो आसानी से समझ आएगा।",
        "शाबाश! मैंने भी इस बिंदु को नोट कर लिया है।",
        "हाँ, यह सवाल बहुत सही है। हम सब शनिवार को भी इस पर बात कर सकते हैं।"
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      setPodMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          senderId: 'm-2',
          senderName: 'पूजा कुमारी',
          senderLocation: 'पूर्वी दिल्ली',
          timeText: 'अभी',
          type: 'text',
          text: randomReply,
          isSelf: false
        }
      ]);
    }, 2500);
  };

  const handleStartPodVoiceRecording = () => {
    setIsPodVoiceRecording(true);
    setPodVoiceDuration(0);
    voiceRecordIntervalRef.current = setInterval(() => {
      setPodVoiceDuration((prev) => prev + 1);
    }, 1000);
  };

  const handleStopPodVoiceRecording = () => {
    setIsPodVoiceRecording(false);
    if (voiceRecordIntervalRef.current) {
      clearInterval(voiceRecordIntervalRef.current);
      voiceRecordIntervalRef.current = null;
    }

    const durationSec = Math.max(1, podVoiceDuration);
    const simulatedScript = "नमस्ते साथियों! मैंने आज का पाठ सुना और मुझे यह विषय बहुत स्पष्ट लगा। शनिवार के केंद्र भ्रमण के लिए भी मैं तैयार हूँ।";

    const voiceMsg = {
      id: `msg-${Date.now()}`,
      senderId: 'self',
      senderName: profile?.name || 'आप (शिक्षार्थी)',
      senderLocation: profile?.location || 'पूर्वी दिल्ली',
      timeText: 'अभी',
      type: 'voice',
      durationText: `0:${durationSec < 10 ? '0' + durationSec : durationSec}`,
      voiceScript: simulatedScript,
      text: `🔊 वॉयस संदेश (${durationSec} सेकंड): अभ्यास और भ्रमण के संबंध में।`,
      isSelf: true
    };

    setPodMessages((prev) => [...prev, voiceMsg]);
    setPodVoiceDuration(0);
    showPodToast('आपका वॉयस संदेश साथी समूह में साझा किया गया ✓');
  };

  const handlePlayPodVoice = (msg) => {
    if (!('speechSynthesis' in window)) return;

    if (playingPodVoiceId === msg.id) {
      window.speechSynthesis.cancel();
      setPlayingPodVoiceId(null);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak = msg.voiceScript || msg.text;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setPlayingPodVoiceId(null);
      utterance.onerror = () => setPlayingPodVoiceId(null);
      window.speechSynthesis.speak(utterance);
      setPlayingPodVoiceId(msg.id);
    }
  };

  const handleToggleJoinCoordination = () => {
    setIsCoordinatedJoined((prev) => {
      const next = !prev;
      if (next) {
        showPodToast('आप शनिवार के आनंद विहार केंद्र भ्रमण में शामिल हो गए हैं! 🎉');
        try {
          confetti({ particleCount: 40, spread: 60 });
        } catch (e) {}
      } else {
        showPodToast('भ्रमण से नाम वापस लिया गया।');
      }
      return next;
    });
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
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* ================= 1. NETWORK HOME HEADER - CALM & WELCOMING ================= */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
          <span className="font-semibold text-stone-700">सीख एवं अनुभव नेटवर्क</span>
          <span className="text-[11px] text-stone-400">अखिल भारतीय सहकर्मी</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug tracking-tight">
          राष्ट्रीय सीख एवं अनुभव नेटवर्क
        </h2>

        <p className="text-xs text-stone-500 mt-1 font-normal">
          दूसरे विद्यार्थियों के वास्तविक अनुभवों से सीखें और आगे बढ़ें
        </p>

        {/* Action & Domain Bar */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="text-xs">
            <span className="text-[11px] text-stone-400 block font-normal">चयनित क्षेत्र:</span>
            <span className="font-bold text-stone-800 text-xs">{domainName}</span>
          </div>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-black active:scale-95 transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>अनुभव साझा करें</span>
          </button>
        </div>
      </div>

      {/* ================= 2. SAATHI PODS HIGHLIGHT - WARM & CLUTTER-FREE ================= */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                आपका साथी समूह (Peer Pod)
              </span>
            </div>
            <h3 className="text-sm font-bold text-stone-900">
              {SAATHI_POD_DATA.podTitle}
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5 font-normal">
              4 सत्यापित साथी • {SAATHI_POD_DATA.weeklyGoal}
            </p>
          </div>

          <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
        </div>

        {/* 4 Learner Avatars - Simple Single-Line Pills */}
        <div className="grid grid-cols-4 gap-2 pt-1 text-center">
          {SAATHI_POD_DATA.members.map((m) => (
            <div key={m.id} className="py-2 px-1 bg-stone-50 rounded-2xl border border-stone-100">
              <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-800 mx-auto flex items-center justify-center font-bold text-xs mb-1">
                {m.name.charAt(0)}
              </div>
              <div className="font-bold text-[11px] text-stone-800 truncate">{m.name}</div>
              <div className="text-[10px] text-stone-400 truncate">{m.location}</div>
            </div>
          ))}
        </div>

        {/* Pod Action Button */}
        <button
          onClick={() => setIsPodModalOpen(true)}
          className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs active:scale-95 transition flex items-center justify-center gap-1.5"
        >
          <span>साथी समूह खोलें (संवाद, भ्रमण व लक्ष्य)</span>
          <ArrowRight className="w-3.5 h-3.5 text-stone-500" />
        </button>
      </div>

      {/* ================= 3. SEARCH & CLEAN FILTER CHIPS ================= */}
      <div className="space-y-3">
        {/* Search Bar - Clean & Borderless Feel */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="अनुभव खोजें (उदा. गोदाम, डिलीवरी, सप्लायर)..."
            className="w-full pl-10 pr-12 py-2.5 rounded-2xl border border-stone-200/90 bg-white text-xs font-medium text-stone-800 focus:outline-none focus:border-stone-400 shadow-2xs"
          />
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword('')}
              className="absolute right-3.5 text-xs text-stone-400 font-medium hover:text-stone-700"
            >
              हटाएँ
            </button>
          )}
        </div>

        {/* Minimal Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {filterOptions.map((f) => {
            const isSelected = selectedFilter === f;
            return (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  isSelected
                    ? 'bg-stone-900 text-white font-bold'
                    : 'bg-white text-stone-600 border border-stone-200/80 hover:bg-stone-50'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 4. EXPERIENCE FEED (SINGLE-COLUMN FEED ITEMS) ================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-500 px-1">
          <span className="font-semibold text-stone-800">
            {selectedFilter === 'सभी' ? 'विद्यार्थी अनुभव' : selectedFilter}
          </span>
          <span className="text-stone-400 font-normal">
            {filteredExperiences.length} सीख
          </span>
        </div>

        {filteredExperiences.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-stone-200/80 space-y-2.5">
            <h4 className="text-xs font-bold text-stone-700">
              इस विषय पर अभी कोई अनुभव नहीं मिला।
            </h4>
            <button
              onClick={() => {
                setSelectedFilter('सभी');
                setSearchKeyword('');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-bold"
            >
              सभी अनुभव देखें
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredExperiences.map((exp) => {
              const isSaved = savedExpIds.includes(exp.id);
              const isTried = triedExpIds.includes(exp.id);
              const isPlaying = playingAudioId === exp.id;
              const isTranslated = Boolean(translatedMap[exp.id]);

              return (
                <div
                  key={exp.id}
                  className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/80 shadow-xs space-y-2.5 transition"
                >
                  {/* Feed Header: Author, Category & Location */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {exp.authorName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-stone-900">
                            {exp.authorName}
                          </span>
                          <span className="text-[10px] text-stone-500 font-medium bg-stone-100 px-2 py-0.5 rounded-full">
                            {exp.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-400 font-normal">
                          {exp.location} • {exp.domain}
                        </p>
                      </div>
                    </div>

                    {/* Report action for safety */}
                    <button
                      onClick={() => alert('यह अनुभव समीक्षा के लिए चिह्नित कर दिया गया है।')}
                      title="रिपोर्ट करें"
                      className="text-stone-300 hover:text-stone-600 p-1 rounded-lg"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-bold text-stone-900 leading-snug">
                    {exp.title}
                  </h4>

                  {/* Clean Visual Photograph if Available */}
                  {exp.imageUrl && (
                    <div className="rounded-2xl overflow-hidden bg-stone-100 aspect-16/9 max-h-48 border border-stone-100">
                      <img
                        src={exp.imageUrl}
                        alt={exp.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Short Experience Description */}
                  <p className="text-xs text-stone-600 leading-relaxed font-normal">
                    {isTranslated && exp.translatedText
                      ? exp.translatedText
                      : exp.shortDescription}
                  </p>

                  {/* Translation Link if Multi-Language */}
                  {exp.originalLanguage && exp.originalLanguage !== 'हिंदी' && (
                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-0.5">
                      <span>मूल भाषा: {exp.originalLanguage}</span>
                      <button
                        onClick={() => handleToggleTranslate(exp.id)}
                        className="text-stone-700 font-semibold underline text-[11px]"
                      >
                        {isTranslated ? 'मूल भाषा' : 'हिंदी अनुवाद'}
                      </button>
                    </div>
                  )}

                  {/* Action Bar: Voice Listen, Save, Try */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handlePlayVoice(exp)}
                      className={`py-1.5 px-3 rounded-xl text-xs font-medium flex items-center gap-1.5 transition ${
                        isPlaying
                          ? 'bg-stone-900 text-white animate-pulse'
                          : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isPlaying ? 'रोकें' : 'सुनें'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleSave(exp.id)}
                        className={`p-2 rounded-xl text-xs transition flex items-center gap-1 ${
                          isSaved
                            ? 'text-emerald-700 bg-emerald-50'
                            : 'text-stone-400 hover:text-stone-700'
                        }`}
                        title={isSaved ? 'सहेजा गया' : 'सहेजें'}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => handleToggleTry(exp.id)}
                        className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                          isTried
                            ? 'bg-stone-800 text-white'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isTried ? 'सक्रिय लक्ष्य ✓' : 'मैं भी आज़माऊँगा'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= 5. SAVED EXPERIENCES - COMPACT & CLEAN ================= */}
      {savedExperiencesList.length > 0 && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/80 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-stone-600" />
              <span>सहेजी गई सीख ({savedExperiencesList.length})</span>
            </span>
            <span className="text-[10px] text-stone-400 font-normal">त्वरित सूची</span>
          </div>

          <div className="space-y-2">
            {savedExperiencesList.map((item) => (
              <div
                key={item.id}
                className="p-2.5 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between gap-2"
              >
                <div>
                  <h5 className="font-semibold text-xs text-stone-900 leading-snug">{item.title}</h5>
                  <p className="text-[10px] text-stone-400">{item.authorName} • {item.location}</p>
                </div>
                <button
                  onClick={() => handlePlayVoice(item)}
                  className="px-2.5 py-1 rounded-lg bg-stone-200 text-stone-800 font-medium text-[11px] shrink-0 flex items-center gap-1"
                >
                  <Volume2 className="w-3 h-3 text-stone-600" />
                  <span>सुनें</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 6. MINIMAL SAFETY NOTICE ================= */}
      <div className="p-3 bg-stone-100 rounded-2xl text-[11px] text-stone-500 leading-normal flex items-start gap-2">
        <ShieldAlert className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
        <p>
          सुरक्षा: यह केवल सहकर्मी अध्ययन नेटवर्क है। निजी संपर्क विवरण कभी साझा न करें।
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

      {/* ================= 8. MODAL: साथी समूह स्क्रीन (INTERACTIVE SAATHI POD) ================= */}
      {isPodModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 animate-fadeIn flex flex-col h-[92vh] max-h-[700px] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white shrink-0">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-200">
                    निजी सहकर्मी समूह • 4 साथी
                  </span>
                </div>
                <button
                  onClick={() => {
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                    setPlayingPodVoiceId(null);
                    setIsPodModalOpen(false);
                  }}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-sm transition"
                  title="बंद करें"
                >
                  ✕
                </button>
              </div>

              <h3 className="text-base font-black leading-tight text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-200" />
                <span>{SAATHI_POD_DATA.podTitle}</span>
              </h3>

              <p className="text-[11px] text-purple-100 mt-0.5 line-clamp-1 font-medium">
                🎯 {SAATHI_POD_DATA.weeklyGoal}
              </p>

              {/* Sub-Tabs Navigation inside Pod */}
              <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-white/20 text-center">
                <button
                  onClick={() => setPodSubTab('chat')}
                  className={`py-1.5 px-2 rounded-xl font-black text-xs transition flex items-center justify-center gap-1 ${
                    podSubTab === 'chat'
                      ? 'bg-white text-purple-900 shadow-xs'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>समूह संवाद</span>
                </button>

                <button
                  onClick={() => setPodSubTab('coordination')}
                  className={`py-1.5 px-2 rounded-xl font-black text-xs transition flex items-center justify-center gap-1 ${
                    podSubTab === 'coordination'
                      ? 'bg-white text-purple-900 shadow-xs'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>साथ चलें</span>
                </button>

                <button
                  onClick={() => setPodSubTab('members')}
                  className={`py-1.5 px-2 rounded-xl font-black text-xs transition flex items-center justify-center gap-1 ${
                    podSubTab === 'members'
                      ? 'bg-white text-purple-900 shadow-xs'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>साथी व लक्ष्य</span>
                </button>
              </div>
            </div>

            {/* Notification Toast */}
            {podNoticeToast && (
              <div className="bg-emerald-600 text-white text-xs font-bold px-3 py-2 text-center animate-fadeIn shrink-0">
                {podNoticeToast}
              </div>
            )}

            {/* If Student Has Left Pod */}
            {isPodLeft ? (
              <div className="p-6 text-center space-y-4 my-auto">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-500 mx-auto flex items-center justify-center">
                  <LogOut className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-stone-900">
                  आप इस साथी समूह से बाहर निकल चुके हैं
                </h4>
                <p className="text-xs text-stone-600">
                  आप किसी भी समय अपने क्षेत्र के नए अध्ययन समूह से पुनः जुड़ सकते हैं।
                </p>
                <button
                  onClick={() => {
                    setIsPodLeft(false);
                    showPodToast('आप पुनः साथी समूह में शामिल हो गए हैं!');
                  }}
                  className="py-2.5 px-4 rounded-xl bg-purple-700 text-white font-bold text-xs"
                >
                  समूह में वापस जुड़ें
                </button>
              </div>
            ) : (
              <>
                {/* ================= TAB 1: GROUP CHAT & VOICE MESSAGES ================= */}
                {podSubTab === 'chat' && (
                  <div className="flex-1 flex flex-col min-h-0 bg-stone-50">
                    {/* Safe Chat Notice Header */}
                    <div className="px-3.5 py-2 bg-purple-50/80 border-b border-purple-100 flex items-center justify-between text-[11px] text-purple-900 font-semibold shrink-0">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-purple-700" />
                        <span>सुरक्षित अध्ययन संवाद • नंबर/पता सुरक्षित</span>
                      </div>
                      <span className="text-[10px] bg-purple-200/70 text-purple-950 font-bold px-2 py-0.5 rounded-full">
                        4 सदस्य
                      </span>
                    </div>

                    {/* Chat Messages Container */}
                    <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
                      {podMessages.map((msg) => {
                        const isSelf = msg.isSelf;
                        const isPlayingThis = playingPodVoiceId === msg.id;

                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                          >
                            {/* Sender Info (Only for peers) */}
                            {!isSelf && (
                              <div className="flex items-center gap-1.5 mb-1 px-1">
                                <div className="w-5 h-5 rounded-full bg-purple-200 text-purple-900 text-[10px] font-black flex items-center justify-center">
                                  {msg.senderName.charAt(0)}
                                </div>
                                <span className="text-[11px] font-bold text-stone-800">
                                  {msg.senderName}
                                </span>
                                <span className="text-[10px] text-stone-400">
                                  • {msg.senderLocation}
                                </span>
                              </div>
                            )}

                            {/* Message Bubble */}
                            <div
                              className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-2xs ${
                                isSelf
                                  ? 'bg-purple-700 text-white rounded-br-xs'
                                  : msg.isCoordination
                                  ? 'bg-amber-50 text-stone-900 border-2 border-amber-300 rounded-bl-xs'
                                  : 'bg-white text-stone-900 border border-stone-200 rounded-bl-xs'
                              }`}
                            >
                              {msg.isCoordination && (
                                <div className="flex items-center gap-1 text-[10px] font-black text-amber-800 uppercase mb-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>समूह भ्रमण समन्वय प्रस्ताव</span>
                                </div>
                              )}

                              {msg.type === 'voice' ? (
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handlePlayPodVoice(msg)}
                                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-xs transition active:scale-95 ${
                                        isSelf
                                          ? 'bg-white text-purple-800'
                                          : 'bg-purple-600 text-white'
                                      }`}
                                    >
                                      {isPlayingThis ? (
                                        <Pause className="w-4 h-4 fill-current" />
                                      ) : (
                                        <Play className="w-4 h-4 fill-current ml-0.5" />
                                      )}
                                    </button>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between text-[10px] font-bold opacity-80 mb-0.5">
                                        <span>वॉयस संदेश</span>
                                        <span>{msg.durationText || '0:15'}</span>
                                      </div>
                                      <div className={`h-1.5 rounded-full overflow-hidden ${isSelf ? 'bg-purple-900/40' : 'bg-stone-200'}`}>
                                        <div
                                          className={`h-full ${isSelf ? 'bg-white' : 'bg-purple-600'} ${
                                            isPlayingThis ? 'w-full animate-pulse' : 'w-1/3'
                                          }`}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <p className={`text-[11px] leading-tight font-medium pt-1 border-t ${isSelf ? 'border-purple-600/60 text-purple-100' : 'border-stone-100 text-stone-600'}`}>
                                    "{msg.voiceScript || msg.text}"
                                  </p>
                                </div>
                              ) : (
                                <p className="leading-relaxed font-medium">{msg.text}</p>
                              )}

                              <div
                                className={`text-[9px] mt-1 text-right font-medium ${
                                  isSelf ? 'text-purple-200' : 'text-stone-400'
                                }`}
                              >
                                {msg.timeText}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={chatBottomRef} />
                    </div>

                    {/* Chat Input & Voice Message Recorder Bar */}
                    <div className="p-3 bg-white border-t border-stone-200 shrink-0">
                      {isPodVoiceRecording ? (
                        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-red-50 border border-red-200 animate-pulse">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
                            <span className="text-xs font-black text-red-700">
                              वॉयस रिकॉर्ड हो रही है... ({podVoiceDuration}s)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleStopPodVoiceRecording}
                            className="py-1 px-3 rounded-xl bg-red-600 text-white font-bold text-xs active:scale-95 transition"
                          >
                            भेजें (Send)
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleSendPodTextMessage} className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleStartPodVoiceRecording}
                            className="p-2.5 rounded-2xl bg-purple-100 text-purple-800 hover:bg-purple-200 active:scale-95 transition shrink-0"
                            title="वॉयस संदेश रिकॉर्ड करें"
                          >
                            <Mic className="w-4 h-4" />
                          </button>

                          <input
                            type="text"
                            value={newPodInputText}
                            onChange={(e) => setNewPodInputText(e.target.value)}
                            placeholder="साथियों से पूछें या सुझाव दें..."
                            className="flex-1 py-2.5 px-3.5 rounded-2xl border border-stone-200 bg-stone-50 text-xs font-semibold text-stone-900 focus:outline-none focus:border-purple-500"
                          />

                          <button
                            type="submit"
                            disabled={!newPodInputText.trim()}
                            className={`p-2.5 rounded-2xl font-black text-white transition active:scale-95 shrink-0 ${
                              newPodInputText.trim()
                                ? 'bg-purple-700 hover:bg-purple-800 shadow-xs'
                                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                            }`}
                            title="संदेश भेजें"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )}

                {/* ================= TAB 2: PRACTICAL COORDINATION (साथ चलें) ================= */}
                {podSubTab === 'coordination' && (
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
                    <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200/90 shadow-sm space-y-3">
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-black text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          नियोजित समूह भ्रमण
                        </span>
                        <span className="text-xs font-extrabold text-amber-900 bg-white px-2 py-0.5 rounded-full border border-amber-200">
                          3 साथी तैयार
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-stone-900 leading-snug">
                        {SAATHI_POD_DATA.coordinatedEvent.title}
                      </h4>

                      <div className="space-y-1.5 text-xs text-stone-700 font-medium">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span>{SAATHI_POD_DATA.coordinatedEvent.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span className="font-bold text-stone-900">
                            {SAATHI_POD_DATA.coordinatedEvent.dateText}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-white/90 rounded-xl border border-amber-100 text-[11px] text-stone-600 leading-relaxed">
                        <strong>उद्देश्य:</strong> {SAATHI_POD_DATA.coordinatedEvent.purpose}
                      </div>

                      {/* Members Going Together */}
                      <div>
                        <span className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">
                          साथ जाने वाले साथी:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {SAATHI_POD_DATA.coordinatedEvent.attendees.map((name, i) => (
                            <span
                              key={i}
                              className="text-xs font-bold text-purple-900 bg-purple-100 px-2.5 py-1 rounded-full border border-purple-200"
                            >
                              ✓ {name}
                            </span>
                          ))}
                          {isCoordinatedJoined && (
                            <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200 animate-pulse">
                              ✓ आप ({profile?.name || 'शिक्षार्थी'})
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={handleToggleJoinCoordination}
                        className={`w-full py-3 px-4 rounded-xl font-black text-xs transition active:scale-95 shadow-xs ${
                          isCoordinatedJoined
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-amber-600 hover:bg-amber-700 text-white'
                        }`}
                      >
                        {isCoordinatedJoined
                          ? '✓ आप इस भ्रमण में शामिल हैं (हटना चाहते हैं?)'
                          : '🤝 मैं भी साथ चलूँगा/चलूँगी (Join Trip)'}
                      </button>
                    </div>

                    {/* How It Helps Rural Students */}
                    <div className="p-3.5 bg-white rounded-2xl border border-stone-200 space-y-2 text-xs">
                      <h5 className="font-black text-stone-900 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-purple-700" />
                        <span>साथ जाने के लाभ:</span>
                      </h5>
                      <ul className="space-y-1.5 text-stone-600 font-medium list-disc list-inside text-[11px] leading-relaxed">
                        <li>अकेले जाने की हिचक और रास्ते का डर खत्म होता है।</li>
                        <li>मेट्रो या बस का सफर साथी विद्यार्थियों के साथ सुरक्षित रहता है।</li>
                        <li>प्रशिक्षकों से मिलकर सवाल पूछने में आपसी सहयोग मिलता है।</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* ================= TAB 3: MEMBERS & SHARED GOAL ================= */}
                {podSubTab === 'members' && (
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
                    {/* Shared & Weekly Goals Card */}
                    <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2.5">
                      <div className="flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-purple-700" />
                        <span className="text-xs font-black text-purple-900 uppercase tracking-wider">
                          समूह का साझा लक्ष्य
                        </span>
                      </div>
                      <p className="text-xs font-bold text-stone-900 leading-snug">
                        {SAATHI_POD_DATA.sharedGoal}
                      </p>

                      <div className="pt-2 border-t border-purple-200 text-xs">
                        <span className="text-[10px] text-purple-800 font-bold block uppercase">
                          इस सप्ताह का लक्ष्य:
                        </span>
                        <span className="font-black text-purple-950 block mt-0.5">
                          {SAATHI_POD_DATA.weeklyGoal}
                        </span>
                      </div>
                    </div>

                    {/* Group Learning Progress Card */}
                    <div className="p-3.5 bg-white rounded-2xl border border-stone-200 space-y-2">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                        समूह सीखने की प्रगति:
                      </span>
                      <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                        <span>औसत पाठ पूर्णता:</span>
                        <span className="text-purple-700">{SAATHI_POD_DATA.groupProgress.completedLessonsAvg}</span>
                      </div>
                      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-600 h-full w-3/4 rounded-full" />
                      </div>
                      <p className="text-[11px] text-stone-500 font-medium">
                        {SAATHI_POD_DATA.groupProgress.weeklyTargetStatus}
                      </p>
                    </div>

                    {/* 4 Matched Members List */}
                    <div className="space-y-2">
                      <span className="text-xs font-black text-stone-900 block">
                        समूह के 4 साथी सदस्य:
                      </span>
                      {SAATHI_POD_DATA.members.map((member) => (
                        <div
                          key={member.id}
                          className="p-3 bg-white rounded-2xl border border-stone-200 flex items-center justify-between shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-800 font-black text-xs flex items-center justify-center">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                                <span>{member.name}</span>
                                <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                                  {member.verifiedBadge}
                                </span>
                              </div>
                              <div className="text-[10px] text-stone-500 mt-0.5">
                                {member.focusDomain} • {member.location}
                              </div>
                              <div className="text-[10px] text-purple-700 font-semibold mt-0.5">
                                📚 {member.progress}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Safety Notice Card */}
                    <div className="p-3 bg-stone-100 rounded-2xl border border-stone-200 text-[10px] text-stone-600 leading-relaxed space-y-1">
                      <div className="font-bold text-stone-900 flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-stone-700" />
                        <span>गोपनीयता सुरक्षा गारंटी:</span>
                      </div>
                      <p>{SAATHI_POD_DATA.safetyNotice}</p>
                    </div>

                    {/* Basic Safety Options: Report, Mute, Leave Pod */}
                    <div className="pt-2 border-t border-stone-200 space-y-2">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                        समूह सुरक्षा नियंत्रण:
                      </span>
                      <div className="grid grid-cols-3 gap-2 text-[11px] font-bold">
                        <button
                          type="button"
                          onClick={() => {
                            setIsPodMuted(!isPodMuted);
                            showPodToast(isPodMuted ? 'सूचनाएँ पुनः चालू की गईं।' : 'समूह सूचनाएँ म्यूट की गईं (Muted)।');
                          }}
                          className={`py-2 px-2 rounded-xl border flex items-center justify-center gap-1 transition ${
                            isPodMuted
                              ? 'bg-amber-100 border-amber-300 text-amber-900'
                              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          <BellOff className="w-3.5 h-3.5" />
                          <span>{isPodMuted ? 'अनम्यूट' : 'म्यूट करें'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsPodReported(true);
                            showPodToast('समूह सुरक्षा रिपोर्ट दर्ज की गई। समीक्षा 24 घंटे में होगी।');
                          }}
                          className={`py-2 px-2 rounded-xl border flex items-center justify-center gap-1 transition ${
                            isPodReported
                              ? 'bg-red-100 border-red-300 text-red-900'
                              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          <Flag className="w-3.5 h-3.5" />
                          <span>{isPodReported ? 'रिपोर्ट दर्ज' : 'रिपोर्ट करें'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('क्या आप सचमुच इस साथी समूह से बाहर निकलना चाहते हैं?')) {
                              setIsPodLeft(true);
                              showPodToast('आप साथी समूह से बाहर निकल गए हैं।');
                            }
                          }}
                          className="py-2 px-2 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 flex items-center justify-center gap-1 transition"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>समूह छोड़ें</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Modal Footer Close Button */}
            <div className="p-3 bg-white border-t border-stone-100 shrink-0">
              <button
                onClick={() => {
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  setPlayingPodVoiceId(null);
                  setIsPodModalOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition active:scale-95"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

