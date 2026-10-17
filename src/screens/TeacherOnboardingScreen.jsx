import React, { useState } from 'react';
import { ArrowRight, Building, MapPin, Phone, School, Sparkles, User, Users, Volume2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function TeacherOnboardingScreen() {
  const { teacherData, setTeacherData, navigateTo } = useApp();

  const handleContinue = (e) => {
    e.preventDefault();
    if (!teacherData.institutionName.trim()) {
      alert('कृपया अपनी संस्था का नाम दर्ज करें');
      return;
    }
    navigateTo('teacherDashboard');
  };

  const playVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = 'शिक्षक प्रोफाइल: कृपया अपना नाम, मोबाइल, स्थान, स्कूल या संस्था का नाम और आप किन विद्यार्थियों को मार्गदर्शन देते हैं, दर्ज करें।';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between max-w-md mx-auto">
      <Header title="शिक्षक पंजीकरण" stepNumber={1} totalSteps={2} />

      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        {/* Title & Guidance */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
              शिक्षक / सुविधा प्रदाता
            </span>
            <button
              onClick={playVoice}
              className="flex items-center gap-1 text-xs text-blue-900 bg-blue-100 px-2.5 py-1 rounded-full font-medium"
            >
              <Volume2 className="w-3.5 h-3.5 text-blue-600" />
              <span>सुनें</span>
            </button>
          </div>
          <h2 className="text-2xl font-bold text-stone-900 leading-snug">
            शिक्षक / मेंटॉर का विवरण
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            छात्रों के मार्गदर्शन और डैशबोर्ड प्रबंधन के लिए जानकारी
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleContinue} className="space-y-3.5 flex-1">
          {/* नाम */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-600" />
              <span>नाम</span>
            </label>
            <input
              type="text"
              required
              value={teacherData.name}
              onChange={(e) => setTeacherData({ ...teacherData, name: e.target.value })}
              className="w-full text-sm font-semibold p-2.5 rounded-xl border border-stone-200 bg-stone-50"
            />
          </div>

          {/* मोबाइल नंबर */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>मोबाइल नंबर</span>
            </label>
            <input
              type="tel"
              required
              value={teacherData.phone}
              onChange={(e) => setTeacherData({ ...teacherData, phone: e.target.value })}
              className="w-full text-sm font-semibold p-2.5 rounded-xl border border-stone-200 bg-stone-50"
            />
          </div>

          {/* स्थान */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>स्थान (ज़िला / राज्य)</span>
            </label>
            <input
              type="text"
              required
              value={teacherData.location}
              onChange={(e) => setTeacherData({ ...teacherData, location: e.target.value })}
              className="w-full text-sm font-semibold p-2.5 rounded-xl border border-stone-200 bg-stone-50"
            />
          </div>

          {/* स्कूल / संस्था का नाम */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <School className="w-4 h-4 text-blue-600" />
              <span>स्कूल / संस्था का नाम</span>
            </label>
            <input
              type="text"
              required
              placeholder="उदा. राजकीय उच्च माध्यमिक विद्यालय"
              value={teacherData.institutionName}
              onChange={(e) => setTeacherData({ ...teacherData, institutionName: e.target.value })}
              className="w-full text-sm font-semibold p-2.5 rounded-xl border border-stone-200 bg-stone-50"
            />
          </div>

          {/* किन विद्यार्थियों को मार्गदर्शन देते हैं */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              <span>वे किन विद्यार्थियों को मार्गदर्शन देते हैं?</span>
            </label>
            <textarea
              rows={2}
              value={teacherData.mentorshipFocus}
              onChange={(e) => setTeacherData({ ...teacherData, mentorshipFocus: e.target.value })}
              placeholder="उदा. 10वीं व 12वीं के ग्रामीण विद्यार्थी, आईटीआई छात्र"
              className="w-full text-sm font-medium p-2.5 rounded-xl border border-stone-200 bg-stone-50"
            />
          </div>
        </form>
      </div>

      {/* Footer Navigation */}
      <div className="p-4 sm:p-6 bg-white border-t border-stone-200">
        <button
          onClick={handleContinue}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 active:scale-[0.98] transition flex items-center justify-center gap-3"
        >
          <span>शिक्षक डैशबोर्ड खोलें</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
