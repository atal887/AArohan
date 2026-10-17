import React from 'react';
import { ArrowRight, Briefcase, Building, CheckCircle2, MapPin, Phone, Sparkles, User, Users, Volume2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function EmployerOnboardingScreen() {
  const { employerData, setEmployerData, navigateTo } = useApp();

  const handleContinue = (e) => {
    e.preventDefault();
    if (!employerData.companyName.trim()) {
      alert('कृपया कंपनी या व्यवसाय का नाम दर्ज करें');
      return;
    }
    navigateTo('employerDashboard');
  };

  const playVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = 'नियोक्ता प्रोफाइल: नाम, मोबाइल नंबर, कंपनी या व्यवसाय का नाम, स्थान और व्यवसाय का प्रकार दर्ज करें।';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between max-w-md mx-auto">
      <Header title="नियोक्ता पंजीकरण" stepNumber={1} totalSteps={2} />

      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        {/* Title & Guidance */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              नियोक्ता / कंपनी
            </span>
            <button
              onClick={playVoice}
              className="flex items-center gap-1 text-xs text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-full font-medium"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>सुनें</span>
            </button>
          </div>
          <h2 className="text-2xl font-bold text-stone-900 leading-snug">
            कंपनी / व्यवसाय का विवरण
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            स्थानीय युवाओं को सीधे नौकरी पर रखने के लिए विवरण भरें
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleContinue} className="space-y-3.5 flex-1">
          {/* नाम */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-600" />
              <span>संपर्क व्यक्ति का नाम</span>
            </label>
            <input
              type="text"
              required
              value={employerData.name}
              onChange={(e) => setEmployerData({ ...employerData, name: e.target.value })}
              className="w-full text-sm font-semibold p-2.5 rounded-xl border border-stone-200 bg-stone-50"
            />
          </div>

          {/* मोबाइल नंबर */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>मोबाइल नंबर</span>
            </label>
            <input
              type="tel"
              required
              value={employerData.phone}
              onChange={(e) => setEmployerData({ ...employerData, phone: e.target.value })}
              className="w-full text-sm font-semibold p-2.5 rounded-xl border border-stone-200 bg-stone-50"
            />
          </div>

          {/* कंपनी / व्यवसाय का नाम */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-emerald-600" />
              <span>कंपनी / व्यवसाय का नाम</span>
            </label>
            <input
              type="text"
              required
              placeholder="उदा. ग्रामीण सेतु लॉजिस्टिक्स प्रा. लि."
              value={employerData.companyName}
              onChange={(e) => setEmployerData({ ...employerData, companyName: e.target.value })}
              className="w-full text-sm font-semibold p-2.5 rounded-xl border border-stone-200 bg-stone-50"
            />
          </div>

          {/* स्थान */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>स्थान (ज़िला / कार्यक्षेत्र)</span>
            </label>
            <input
              type="text"
              required
              value={employerData.location}
              onChange={(e) => setEmployerData({ ...employerData, location: e.target.value })}
              className="w-full text-sm font-semibold p-2.5 rounded-xl border border-stone-200 bg-stone-50"
            />
          </div>

          {/* व्यवसाय का प्रकार */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>व्यवसाय का प्रकार</span>
            </label>
            <select
              value={employerData.businessType}
              onChange={(e) => setEmployerData({ ...employerData, businessType: e.target.value })}
              className="w-full text-sm font-semibold p-2.5 rounded-xl border border-stone-200 bg-stone-50"
            >
              <option value="ई-कॉमर्स डिलीवरी एवं वेयरहाउसिंग">ई-कॉमर्स डिलीवरी एवं वेयरहाउसिंग</option>
              <option value="रिटेल एवं ग्राहक सेवा">रिटेल एवं ग्राहक सेवा</option>
              <option value="डिजिटल एवं CSC सेवाएं">डिजिटल एवं CSC सेवाएं</option>
              <option value="कृषि व्यापार एवं एग्रीटेक">कृषि व्यापार एवं एग्रीटेक</option>
              <option value="अन्य स्थानीय व्यापार">अन्य स्थानीय व्यापार</option>
            </select>
          </div>
        </form>
      </div>

      {/* Footer Navigation */}
      <div className="p-4 sm:p-6 bg-white border-t border-stone-200">
        <button
          onClick={handleContinue}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 active:scale-[0.98] transition flex items-center justify-center gap-3"
        >
          <span>नियोक्ता डैशबोर्ड खोलें</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
