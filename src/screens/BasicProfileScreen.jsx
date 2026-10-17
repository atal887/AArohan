import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, LocateFixed, MapPin, Phone, User, Volume2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function BasicProfileScreen() {
  const { profile, setProfile, navigateTo } = useApp();
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Set hardcoded East Delhi, Delhi as requested
  const requestLocation = () => {
    setIsDetectingLocation(true);
    setTimeout(() => {
      setIsDetectingLocation(false);
      setProfile((prev) => ({
        ...prev,
        location: 'East Delhi, Delhi',
        isLiveLocation: true,
      }));
    }, 400);
  };

  const playVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = 'कृपया अपनी बुनियादी जानकारी दर्ज करें: नाम, मोबाइल नंबर और आपका स्थान। स्थान स्वतः पहचान लिया गया है।';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      alert('कृपया अपना नाम दर्ज करें');
      return;
    }
    navigateTo('userType');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between max-w-md mx-auto">
      <Header title="बुनियादी जानकारी" stepNumber={2} totalSteps={5} />

      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        {/* Title & Instructions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full">
              चरण 2 / पहचान
            </span>
            <button
              onClick={playVoice}
              className="flex items-center gap-1 text-xs text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full font-medium"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
              <span>सुनें</span>
            </button>
          </div>
          <h2 className="text-2xl font-bold text-stone-900">
            आपकी सामान्य जानकारी
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            सटीक अवसर और स्थानीय सहायता के लिए विवरण भरें
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleContinue} className="space-y-4 flex-1">
          {/* नाम */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs">
            <label className="block text-sm font-bold text-stone-800 mb-1.5 flex items-center gap-2">
              <User className="w-4 h-4 text-orange-600" />
              <span>आपका पूरा नाम</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="उदा. दीपक कुमार"
              className="w-full text-base font-semibold px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-stone-50/60"
            />
          </div>

          {/* मोबाइल नंबर */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs">
            <label className="block text-sm font-bold text-stone-800 mb-1.5 flex items-center gap-2">
              <Phone className="w-4 h-4 text-orange-600" />
              <span>मोबाइल नंबर</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-stone-500 font-bold text-sm">
                +91
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="9876543210"
                className="w-full text-base font-semibold pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-stone-50/60 tracking-wider"
              />
            </div>
            <p className="text-[11px] text-stone-500 mt-1.5">
              इस नंबर पर आपको सीधे अवसर व मार्गदर्शन के संदेश मिलेंगे
            </p>
          </div>

          {/* स्थान (Location with Auto-detection - East Delhi, Delhi) */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-bold text-stone-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                <span>आपका स्थान (जिला / राज्य)</span>
              </label>
              <button
                type="button"
                onClick={requestLocation}
                disabled={isDetectingLocation}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 active:scale-95 transition"
              >
                <LocateFixed className="w-3.5 h-3.5" />
                <span>{isDetectingLocation ? 'पहचान रहे हैं...' : 'पुनः पहचानें'}</span>
              </button>
            </div>

            <div className="p-3.5 bg-orange-50/70 border border-orange-200 rounded-xl flex items-start gap-3">
              <div className="p-2 rounded-lg bg-orange-100 text-orange-700 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium text-orange-900">
                  पहचाना गया स्थान:
                </div>
                <div className="text-sm font-bold text-stone-900 mt-0.5">
                  East Delhi, Delhi
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>स्थानीय अवसर इसी क्षेत्र के अनुसार दिखाए जाएँगे</span>
                </div>
              </div>
            </div>

            {/* Editable input */}
            <div className="mt-3">
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                placeholder="स्थान (उदा. East Delhi, Delhi)"
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-700"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Footer Navigation */}
      <div className="p-4 sm:p-6 bg-white border-t border-stone-200">
        <button
          onClick={handleContinue}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white font-bold text-lg shadow-lg shadow-orange-600/30 hover:shadow-xl hover:shadow-orange-600/40 active:scale-[0.98] transition flex items-center justify-center gap-3"
        >
          <span>आगे बढ़ें</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
