import React from 'react';
import {
  BookOpen,
  Users,
  Compass,
  Briefcase,
  Layers,
  Lock,
  Sparkles,
  ArrowRight,
  CheckCircle,
  MapPin,
  Clock,
  Building,
  Volume2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import LearnTabContent from '../components/LearnTabContent';
import ShadowTabContent from '../components/ShadowTabContent';
import NetworkTabContent from '../components/NetworkTabContent';
import OpportunitiesTabContent from '../components/OpportunitiesTabContent';
import { UNLOCKED_SECTIONS } from '../demoData';

export default function DashboardScreen() {
  const { activeTab, setActiveTab, selectedDomain, navigateTo, profile, studentData } = useApp();

  const isUnlocked = Boolean(selectedDomain);

  // Locked Empty State Component
  const renderLockedSection = (title, message) => (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto">
      <div className="w-16 h-16 rounded-3xl bg-stone-200/80 text-stone-500 flex items-center justify-center mb-4 shadow-inner">
        <Lock className="w-8 h-8 text-stone-600" />
      </div>

      <h3 className="text-lg font-black text-stone-900 mb-1">
        {title}
      </h3>

      <p className="text-sm font-semibold text-stone-600 max-w-xs mb-6">
        {message}
      </p>

      <button
        onClick={() => {
          setActiveTab('discover');
          navigateTo('discoverIntro');
        }}
        className="py-3 px-6 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black text-sm shadow-md shadow-orange-600/30 active:scale-95 transition flex items-center gap-2"
      >
        <Compass className="w-4 h-4" />
        <span>खोजें शुरू करें</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between max-w-md mx-auto pb-20">
      <Header
        title={
          activeTab === 'learn'
            ? 'सीखें'
            : activeTab === 'network'
            ? 'नेटवर्क'
            : activeTab === 'discover'
            ? 'खोजें'
            : activeTab === 'opportunities'
            ? 'अवसर'
            : 'शैडो अप्रेंटिसशिप'
        }
        showBack={false}
      />

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* ================= TAB 1: सीखें ================= */}
        {activeTab === 'learn' && (
          <div className="space-y-4 flex-1">
            {!isUnlocked ? (
              renderLockedSection(
                'सीखने की यात्रा अभी अनलॉक नहीं हुई है',
                'आपकी व्यक्तिगत सीखने की यात्रा Discover के बाद शुरू होगी।'
              )
            ) : (
              <LearnTabContent profile={profile} selectedDomain={selectedDomain} />
            )}
          </div>
        )}

        {/* ================= TAB 2: नेटवर्क ================= */}
        {activeTab === 'network' && (
          <div className="space-y-4 flex-1">
            {!isUnlocked ? (
              renderLockedSection(
                'नेटवर्क अभी तैयार नहीं है',
                'आपके लिए नेटवर्क Discover के बाद तैयार होगा।'
              )
            ) : (
              <NetworkTabContent
                profile={profile}
                selectedDomain={selectedDomain}
                navigateTo={navigateTo}
              />
            )}
          </div>
        )}

        {/* ================= TAB 3: 🔵 खोजें (CENTER TAB) ================= */}
        {activeTab === 'discover' && (
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Center Tab Banner */}
              <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white p-5 rounded-3xl shadow-lg shadow-orange-500/20 text-center relative overflow-hidden">
                <div className="w-16 h-16 rounded-2xl bg-white text-orange-600 mx-auto flex items-center justify-center mb-3 shadow-md">
                  <Compass className="w-8 h-8" />
                </div>

                <div className="inline-block bg-white/20 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider mb-2">
                  मुख्य केंद्र
                </div>

                <h2 className="text-2xl font-black">
                  आइए जानें आप किस चीज़ में अच्छे हैं
                </h2>

                <p className="text-xs sm:text-sm text-orange-100 mt-1 max-w-xs mx-auto font-medium">
                  यह लगभग 20 मिनट का अनुभव है। इसमें 3 भाग हैं।
                </p>

                <div className="mt-3 inline-flex items-center gap-2 bg-black/15 px-3 py-1 rounded-full text-xs font-bold">
                  <span>3 परीक्षण</span>
                  <span>•</span>
                  <span>9 परिस्थितियाँ</span>
                  <span>•</span>
                  <span>अपनी आवाज़ में जवाब दें</span>
                </div>
              </div>

              {/* Status Info */}
              <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-800">
                    परीक्षण की स्थिति:
                  </span>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                      isUnlocked
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {isUnlocked ? `चयनित: ${selectedDomain}` : 'शुरू करने के लिए तैयार'}
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {isUnlocked
                    ? `आपने 3 परीक्षण पूर्ण कर लिए हैं और '${selectedDomain}' चुना है। आपकी सीखने की यात्रा 'सीखें' टैब में सक्रिय है।`
                    : 'बिना किसी परीक्षा या लिखने के डर के — बस 9 वास्तविक परिस्थितियों को सुनें और अपनी स्वाभाविक आवाज़ में अपना जवाब बोलें।'}
                </p>
              </div>

              {/* 3 Domains Breakdown Preview */}
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-2xl border border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-800 text-xs font-bold flex items-center justify-center">
                      १
                    </span>
                    <span className="text-xs font-bold text-stone-800">समस्या समाधान (3 परिस्थितियाँ)</span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-semibold">भाग 1</span>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">
                      २
                    </span>
                    <span className="text-xs font-bold text-stone-800">संवाद एवं निर्णय (3 परिस्थितियाँ)</span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-semibold">भाग 2</span>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                      ३
                    </span>
                    <span className="text-xs font-bold text-stone-800">कार्य एवं व्यवसायिक सोच (3 परिस्थितियाँ)</span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-semibold">भाग 3</span>
                </div>
              </div>
            </div>

            {/* Launch Discover Assessment Button */}
            <div className="pt-4">
              <button
                onClick={() => navigateTo('discoverIntro')}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white font-black text-lg shadow-lg shadow-orange-600/30 hover:shadow-xl hover:shadow-orange-600/40 active:scale-[0.98] transition flex items-center justify-center gap-3"
              >
                <span>{isUnlocked ? 'खोज परिणाम पुनः देखें' : 'शुरू करें'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 4: अवसर ================= */}
        {activeTab === 'opportunities' && (
          <div className="space-y-4 flex-1">
            {!isUnlocked ? (
              renderLockedSection(
                'अवसर अभी अनलॉक नहीं हुए हैं',
                'आपके लिए अवसर Discover के बाद दिखाए जाएंगे।'
              )
            ) : (
              <OpportunitiesTabContent
                profile={profile}
                studentData={studentData}
                selectedDomain={selectedDomain}
                navigateTo={navigateTo}
              />
            )}
          </div>
        )}

        {/* ================= TAB 5: शैडो अप्रेंटिसशिप ================= */}
        {activeTab === 'shadow' && (
          <div className="space-y-4 flex-1">
            {!isUnlocked ? (
              renderLockedSection(
                'शैडो अप्रेंटिसशिप सुरक्षित है',
                'पहले Discover पूरा करें।'
              )
            ) : (
              <ShadowTabContent />
            )}
          </div>
        )}
      </div>

      {/* ================= 5 BOTTOM NAVIGATION TABS ================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200">
        <div className="max-w-md mx-auto px-1 py-1 flex items-center justify-around">
          {/* Tab 1: सीखें */}
          <button
            onClick={() => setActiveTab('learn')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              activeTab === 'learn'
                ? 'text-orange-600 font-black'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">सीखें</span>
          </button>

          {/* Tab 2: नेटवर्क */}
          <button
            onClick={() => setActiveTab('network')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              activeTab === 'network'
                ? 'text-orange-600 font-black'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">नेटवर्क</span>
          </button>

          {/* Tab 3: 🔵 खोजें (CENTER TAB) */}
          <button
            onClick={() => setActiveTab('discover')}
            className="flex flex-col items-center justify-center -mt-5 group"
          >
            <div
              className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 group-active:scale-95 ${
                activeTab === 'discover'
                  ? 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white ring-4 ring-orange-200 scale-105'
                  : 'bg-orange-500 text-white ring-2 ring-orange-100 hover:bg-orange-600'
              }`}
            >
              <Compass className="w-7 h-7" />
            </div>
            <span
              className={`text-[10px] font-black mt-1 ${
                activeTab === 'discover' ? 'text-orange-600' : 'text-stone-600'
              }`}
            >
              खोजें
            </span>
          </button>

          {/* Tab 4: अवसर */}
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              activeTab === 'opportunities'
                ? 'text-orange-600 font-black'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Briefcase className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">अवसर</span>
          </button>

          {/* Tab 5: शैडो अप्रेंटिसशिप */}
          <button
            onClick={() => setActiveTab('shadow')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === 'shadow'
                ? 'text-orange-600 font-black'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Layers className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] leading-tight truncate max-w-[65px] text-center">
              शैडो अप्रेंटिसशिप
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}
