import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Sparkles,
  Volume2,
  Users,
  Share2,
  Play,
  Square,
  Check,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { DISCOVER_DOMAINS } from '../demoData';
import { FAMILY_MODE_DOMAIN_EXPLANATIONS } from '../familyModeData';

export default function DiscoverResultScreen() {
  const { navigateTo, setSelectedDomain, setHasCompletedAssessment } = useApp();

  // Family Mode Modal State
  const [activeFamilyDomain, setActiveFamilyDomain] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedShareToast, setCopiedShareToast] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  }, []);

  const playVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = 'आपकी रुचि और क्षमताओं के आधार पर हमें 3 क्षेत्र मिले हैं। पहला: आपूर्ति श्रृंखला प्रबंधन। दूसरा: व्यवसाय और उद्यमिता। तीसरा: लॉजिस्टिक्स और संचालन। कृपया अपना पसंदीदा क्षेत्र चुनें।';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectDomain = (domain) => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSelectedDomain(domain.name);
    setHasCompletedAssessment(true);
    navigateTo('domainConfirmation');
  };

  // Play/Stop unique Family Mode audio explanation (~45-60s)
  const handleToggleFamilyAudio = (explanationText) => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(explanationText);
        utterance.lang = 'hi-IN';
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    }
  };

  // Simulated WhatsApp Share
  const handleWhatsAppShare = (messageText) => {
    const encoded = encodeURI(messageText);
    const whatsappUrl = `https://wa.me/?text=${encoded}`;
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(messageText);
      }
    } catch (e) {}
    setCopiedShareToast(true);
    setTimeout(() => setCopiedShareToast(false), 3000);
    window.open(whatsappUrl, '_blank');
  };

  const closeFamilyModal = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
    setActiveFamilyDomain(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between max-w-md mx-auto">
      <Header title="शीर्ष ३ क्षेत्र" showBack={false} />

      <div className="p-4 sm:p-5 flex-1 space-y-4">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white rounded-3xl p-5 shadow-lg shadow-orange-600/25 text-center relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              मूल्यांकन परिणाम
            </span>
            <button
              onClick={playVoice}
              className="flex items-center gap-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-bold active:scale-95 transition cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>सुनें</span>
            </button>
          </div>

          <div className="w-12 h-12 bg-white text-orange-600 rounded-2xl mx-auto flex items-center justify-center mb-2 shadow-sm">
            <Sparkles className="w-6 h-6 text-amber-500 fill-amber-500" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black leading-snug">
            आपकी रुचि और क्षमताओं के आधार पर हमें 3 क्षेत्र मिले हैं
          </h2>

          <p className="text-xs text-orange-100 mt-2 font-medium max-w-xs mx-auto">
            नीचे दिए गए तीनों क्षेत्रों को देखें और वह क्षेत्र चुनें जिसमें आप आगे सीखना चाहते हैं:
          </p>
        </div>

        {/* 3 Domain Cards */}
        <div className="space-y-3.5">
          {DISCOVER_DOMAINS.map((domain, index) => {
            const familyInfo = FAMILY_MODE_DOMAIN_EXPLANATIONS[domain.id];

            return (
              <div
                key={domain.id}
                className={`bg-white rounded-3xl p-4 sm:p-5 border-2 transition-all duration-200 shadow-xs hover:shadow-md space-y-3 ${
                  index === 0
                    ? 'border-orange-400 bg-orange-50/20 ring-1 ring-orange-200'
                    : 'border-stone-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-black text-orange-800 bg-orange-100 px-2.5 py-0.5 rounded-full">
                    {domain.highlightBadge}
                  </span>
                  <span className="text-xs text-stone-400 font-bold">
                    विकल्प {index + 1}
                  </span>
                </div>

                <h3 className="text-lg font-black text-stone-900 leading-tight">
                  {domain.name}
                </h3>

                {/* 2-3 Short bullet points */}
                <div className="space-y-1.5 bg-stone-50/80 p-2.5 rounded-2xl border border-stone-100">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                    आपके उत्तरों से क्यों मेल खाता है:
                  </span>
                  {domain.reasons.map((reason, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-stone-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {domain.summary}
                </p>

                {/* 🔊 परिवार को समझाएँ Button (Family Mode) */}
                <div className="pt-1">
                  <button
                    onClick={() => setActiveFamilyDomain(domain)}
                    className="w-full py-2.5 px-3 rounded-2xl bg-amber-50 text-amber-950 border border-amber-300 font-black text-xs hover:bg-amber-100 active:scale-95 transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4 text-amber-700" />
                    <span>🔊 परिवार को समझाएँ</span>
                  </button>
                </div>

                {/* Primary Action Button: यह क्षेत्र चुनें */}
                <button
                  onClick={() => handleSelectDomain(domain)}
                  className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm shadow-md active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer ${
                    index === 0
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-orange-600/30 hover:shadow-lg'
                      : 'bg-stone-900 text-white hover:bg-stone-800'
                  }`}
                >
                  <span>यह क्षेत्र चुनें</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-stone-400 pb-2">
          चुनने के बाद आपकी व्यक्तिगत सीखने की यात्रा शुरू होगी
        </p>
      </div>

      {/* ================= FAMILY MODE MODAL FOR DOMAINS ================= */}
      {activeFamilyDomain && (() => {
        const info = FAMILY_MODE_DOMAIN_EXPLANATIONS[activeFamilyDomain.id];
        if (!info) return null;

        return (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-amber-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
              {/* Modal Top Header */}
              <div className="p-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-100" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider block text-amber-100">
                      परिवार को समझाएँ
                    </span>
                    <h4 className="text-sm font-black text-white">
                      {info.domainName}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={closeFamilyModal}
                  className="p-1 rounded-full text-white/80 hover:bg-white/20 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-5 overflow-y-auto space-y-4 text-xs text-stone-800">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                  <span className="text-[11px] font-black text-amber-950 block">
                    अभिभावक एवं परिवार के लिए स्पष्ट संदेश:
                  </span>
                  <p className="leading-relaxed text-stone-700 font-medium">
                    यह ऑडियो सरल हिंदी में माता-पिता को समझाता है कि यह क्षेत्र उनके बच्चे के लिए सुरक्षित, सम्मानजनक और भविष्य के लिए क्यों लाभदायक है।
                  </p>
                </div>

                {/* Highlights for Parents */}
                <div className="space-y-1.5">
                  <span className="font-bold text-stone-900 block text-[11px]">
                    परिवार के लिए मुख्य बिंदु:
                  </span>
                  {info.keyBenefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2 text-stone-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Audio Script Preview */}
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 mb-1">
                    <span>ऑडियो विवरण ({info.durationText}):</span>
                    <span>सरल हिंदी</span>
                  </div>
                  <p className="text-[11px] text-stone-700 leading-relaxed italic bg-white p-2.5 rounded-xl border border-stone-200">
                    "{info.audioText}"
                  </p>
                </div>

                {/* Action Buttons: ▶️ आवाज़ सुनें & 📤 WhatsApp पर साझा करें */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => handleToggleFamilyAudio(info.audioText)}
                    className={`w-full py-3 px-4 rounded-2xl font-black text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer ${
                      isPlayingAudio
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:brightness-105'
                    }`}
                  >
                    {isPlayingAudio ? (
                      <>
                        <Square className="w-4 h-4 fill-white" />
                        <span>ऑडियो रोकें</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>▶️ आवाज़ सुनें (माता-पिता को सुनाएँ)</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleWhatsAppShare(info.whatsAppMessage)}
                    className="w-full py-3 px-4 rounded-2xl bg-emerald-700 text-white font-black text-xs shadow-md hover:bg-emerald-800 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>📤 WhatsApp पर साझा करें</span>
                  </button>
                </div>

                {copiedShareToast && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-center text-[11px] font-bold flex items-center justify-center gap-1.5 animate-fadeIn">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>WhatsApp संदेश तैयार हो गया और कॉपी कर लिया गया!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
