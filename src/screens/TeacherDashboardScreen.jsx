import React from 'react';
import { Award, BookOpen, CheckCircle, ChevronRight, School, Sparkles, TrendingUp, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { TEACHER_DATA } from '../demoData';

export default function TeacherDashboardScreen() {
  const { teacherData, navigateTo } = useApp();

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between max-w-md mx-auto">
      <Header title="शिक्षक डैशबोर्ड" showBack={true} />

      <div className="p-4 sm:p-6 flex-1 space-y-5">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white rounded-3xl p-5 shadow-lg shadow-blue-600/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
              सत्यापित शिक्षक / मेंटॉर
            </span>
            <span className="text-xs bg-emerald-400 text-emerald-950 font-bold px-2 py-0.5 rounded-full">
              सक्रिय
            </span>
          </div>

          <h2 className="text-xl font-black">{teacherData.name || 'रमेश चंद्र जी'}</h2>
          <p className="text-xs text-blue-100 flex items-center gap-1 mt-0.5">
            <School className="w-3.5 h-3.5" />
            <span>{teacherData.institutionName || 'राजकीय उच्च माध्यमिक विद्यालय'}</span>
          </p>
          <p className="text-[11px] text-blue-200 mt-2">
            लक्ष्य: {teacherData.mentorshipFocus || '10वीं-12वीं के ग्रामीण युवा'}
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-xs font-semibold">कुल छात्र</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-stone-900">
              {TEACHER_DATA.stats.totalStudents}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
              +6 इस महीने जुड़े
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-xs font-semibold">कौशल परीक्षण पूर्ण</span>
              <Award className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl font-black text-stone-900">
              {TEACHER_DATA.stats.assessmentsCompleted}
            </div>
            <div className="text-[10px] text-blue-600 font-bold mt-0.5">
              Voice AI आधारित
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-xs font-semibold">सक्रिय शिक्षार्थी</span>
              <BookOpen className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-stone-900">
              {TEACHER_DATA.stats.activeLearners}
            </div>
            <div className="text-[10px] text-stone-500 font-medium mt-0.5">
              दैनिक अभ्यास जारी
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-xs font-semibold">जॉब में चयनित</span>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-stone-900">
              {TEACHER_DATA.stats.placedStudents}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
              सत्यापित नियुक्तियां
            </div>
          </div>
        </div>

        {/* Student Progress List */}
        <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <span>छात्रों की प्रगति रिपोर्ट</span>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                लाइव
              </span>
            </h3>
            <span className="text-xs text-blue-600 font-semibold">सभी देखें</span>
          </div>

          <div className="divide-y divide-stone-100">
            {TEACHER_DATA.recentStudents.map((st, idx) => (
              <div key={idx} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{st.name}</h4>
                    <p className="text-[11px] text-stone-500">
                      {st.class} • {st.location}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold bg-orange-100 text-orange-900 px-2 py-0.5 rounded-md">
                    {st.topSkill}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs">
                  <span className="text-stone-600">सुझाया गया: <strong className="text-stone-800">{st.recommended}</strong></span>
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {st.status}
                  </span>
                </div>
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
