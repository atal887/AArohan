import React from 'react';
import { Briefcase, Building, CheckCircle2, ChevronRight, MapPin, Plus, Sparkles, UserCheck, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { EMPLOYER_DATA } from '../demoData';

export default function EmployerDashboardScreen() {
  const { employerData, navigateTo } = useApp();

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between max-w-md mx-auto">
      <Header title="नियोक्ता डैशबोर्ड" showBack={true} />

      <div className="p-4 sm:p-6 flex-1 space-y-5">
        {/* Company Header */}
        <div className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 text-white rounded-3xl p-5 shadow-lg shadow-emerald-600/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
              सत्यापित भर्तीकर्ता
            </span>
            <span className="text-xs bg-amber-400 text-amber-950 font-bold px-2 py-0.5 rounded-full">
              3 सक्रिय पद
            </span>
          </div>

          <h2 className="text-xl font-black">
            {employerData.companyName || 'ग्रामीण सेतु लॉजिस्टिक्स'}
          </h2>
          <p className="text-xs text-emerald-100 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{employerData.location || 'मुजफ्फरपुर एवं सीतामढ़ी'}</span>
          </p>
          <p className="text-[11px] text-emerald-200 mt-2">
            व्यवसाय: {employerData.businessType || 'ई-कॉमर्स डिलीवरी'} • संपर्क: {employerData.name}
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-xs font-semibold">सत्यापित उम्मीदवार</span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-stone-900">
              {EMPLOYER_DATA.stats.verifiedProfiles}+
            </div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
              कौशल स्कोर सत्यापित
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-xs font-semibold">शॉर्टलिस्टेड</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-stone-900">
              {EMPLOYER_DATA.stats.shortlistedCandidates}
            </div>
            <div className="text-[10px] text-blue-600 font-bold mt-0.5">
              साक्षात्कार के लिए तैयार
            </div>
          </div>
        </div>

        {/* Active Job Openings */}
        <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>सक्रिय रिक्तियां (Job Postings)</span>
            </h3>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-0.5">
              <Plus className="w-3.5 h-3.5" /> नई पोस्टिंग
            </span>
          </div>

          <div className="space-y-2.5">
            {EMPLOYER_DATA.openings.map((job) => (
              <div
                key={job.id}
                className="p-3 rounded-2xl border border-stone-100 bg-stone-50/70 hover:bg-emerald-50/40 transition"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-stone-900 text-sm leading-snug">
                    {job.title}
                  </h4>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                    {job.openings}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-stone-500">
                  <span>{job.location} • {job.stipend}</span>
                  <span className="text-stone-700 font-semibold">{job.applicants} आवेदन</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Matched Verified Candidates */}
        <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs">
          <h3 className="font-bold text-stone-900 text-sm mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI द्वारा अनुशंसित शीर्ष उम्मीदवार (Voice Tested)</span>
          </h3>
          <div className="divide-y divide-stone-100">
            {EMPLOYER_DATA.verifiedCandidates.map((c, i) => (
              <div key={i} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <span>{c.name}</span>
                    <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                      {c.match}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    {c.skills.join(' • ')}
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition">
                  संपर्क करें
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button to switch to student flow for demo */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-center">
          <p className="text-xs font-semibold text-amber-900 mb-2">
            हैकथॉन डेमो नोट: आप मुख्य विद्यार्थी AI डिस्कवरी प्रवाह का परीक्षण कर सकते हैं
          </p>
          <button
            onClick={() => navigateTo('discoverScenario')}
            className="w-full py-2.5 px-4 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-sm hover:bg-orange-700 active:scale-95 transition"
          >
            विद्यार्थी AI Discover स्क्रीन देखें
          </button>
        </div>
      </div>
    </div>
  );
}
