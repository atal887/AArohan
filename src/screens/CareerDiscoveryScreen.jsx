import React, { useState } from 'react';
import { ArrowRight, Award, BookmarkCheck, CheckCircle2, ChevronRight, Compass, Headphones, PackageCheck, Sparkles, Sprout, Store, TrendingUp, Volume2, Wrench, Building2, SunMedium, Cpu, ShoppingBag, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { CAREER_PATHS } from '../demoData';

export default function CareerDiscoveryScreen() {
  const { studentData, setSelectedCareer, navigateTo } = useApp();

  // Active category tab: 'safe' | 'growth' | 'emerging'
  const [activeTab, setActiveTab] = useState('safe');

  // Choose recommendations dataset based on user's relocation preference
  const isRelocateYes = studentData.canRelocate === 'हाँ, मैं बाहर जा सकता/सकती हूँ';
  const dataset = isRelocateYes ? CAREER_PATHS.relocateYes : CAREER_PATHS.relocateNo;

  const categories = [
    {
      id: 'safe',
      label: 'सुरक्षित विकल्प',
      badge: 'त्वरित रोजगार',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      activeColor: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20',
      desc: 'तुरंत मिलने वाली नौकरियाँ और स्थिर आय',
    },
    {
      id: 'growth',
      label: 'आगे बढ़ने वाले विकल्प',
      badge: 'उच्च वेतन',
      badgeColor: 'bg-blue-100 text-blue-800',
      activeColor: 'bg-blue-600 text-white shadow-md shadow-blue-600/20',
      desc: 'कौशल विकास के साथ तेज़ी से पदोन्नति',
    },
    {
      id: 'emerging',
      label: 'नए/उभरते विकल्प',
      badge: 'भविष्य की तकनीक',
      badgeColor: 'bg-purple-100 text-purple-800',
      activeColor: 'bg-purple-600 text-white shadow-md shadow-purple-600/20',
      desc: 'AI, ड्रोन और नई तकनीक आधारित अवसर',
    },
  ];

  const currentList = dataset[activeTab] || [];

  const handleSelectCareer = (career) => {
    setSelectedCareer(career);
    navigateTo('learningPath');
  };

  const playVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = 'आपके लिए उपयुक्त करियर: सुरक्षित विकल्प, आगे बढ़ने वाले विकल्प, और नए व उभरते विकल्प। अपनी पसंद का करियर चुनें और सीखने का रास्ता देखें।';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between max-w-md mx-auto">
      <Header title="उपयुक्त करियर" showBack={true} />

      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        {/* Header Title */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>आपके लिए अनुशंसित</span>
            </span>

            <button
              onClick={playVoice}
              className="flex items-center gap-1 text-xs text-amber-900 bg-amber-100 px-3 py-1 rounded-full font-bold active:scale-95 transition"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-700" />
              <span>सुनें</span>
            </button>
          </div>

          <h2 className="text-2xl font-black text-stone-900 leading-snug">
            आपके लिए उपयुक्त करियर
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            पसंद: <strong className="text-stone-800">{studentData.canRelocate}</strong>
          </p>
        </div>

        {/* 3 Main Category Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-200/70 rounded-2xl mb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`py-2 px-1 rounded-xl text-xs font-bold text-center transition-all ${
                activeTab === cat.id
                  ? cat.activeColor
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              <div>{cat.label}</div>
            </button>
          ))}
        </div>

        {/* Active Category Sub-description */}
        <div className="text-xs text-stone-500 font-medium px-1 mb-3 flex items-center justify-between">
          <span>{categories.find((c) => c.id === activeTab)?.desc}</span>
          <span className="text-stone-400 font-semibold">{currentList.length} विकल्प</span>
        </div>

        {/* Career Cards List */}
        <div className="space-y-3.5 flex-1">
          {currentList.map((career) => (
            <div
              key={career.id}
              className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-stone-200/90 shadow-xs hover:border-orange-400 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span
                  className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${career.tagColor}`}
                >
                  {career.category}
                </span>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {career.salary}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-tight mb-1">
                {career.title}
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed mb-3">
                {career.desc}
              </p>

              {/* Match Reason Box */}
              <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-200 text-xs text-orange-950 font-medium mb-3 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <span>{career.matchReason}</span>
              </div>

              {/* Skills required pills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {career.skillsRequired.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-lg"
                  >
                    • {s}
                  </span>
                ))}
              </div>

              {/* Action Button: Personalized Learning Path */}
              <button
                onClick={() => handleSelectCareer(career)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-sm shadow-md shadow-orange-600/20 hover:shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
              >
                <span>सीखने का मार्ग देखें (Learning Path)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
