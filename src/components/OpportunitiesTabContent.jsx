import React, { useState } from 'react';
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Building,
  Coins,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  FileText,
  TrendingUp,
  Volume2,
  Mic,
  Square,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  HARDCODED_JOBS,
  HARDCODED_SCHOLARSHIPS,
  SCHOLARSHIP_APPLICATION_STEPS
} from '../opportunitiesData';

export default function OpportunitiesTabContent({
  profile,
  studentData,
  selectedDomain,
  navigateTo
}) {
  // Main Sub-tabs: 'jobs' (नौकरियाँ) | 'scholarships' (छात्रवृत्तियाँ)
  const [subTab, setSubTab] = useState('jobs');

  // Active view: 'list' | 'jobDetail' | 'scholarshipDetail' | 'savedList' | 'applicationsList'
  const [viewState, setViewState] = useState('list');
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  // Saved items: set of IDs
  const [savedJobIds, setSavedJobIds] = useState(['job-1']);
  const [savedScholarshipIds, setSavedScholarshipIds] = useState(['sch-1']);

  // Applied items state
  // job applications: [ { id: 'app-job-1', jobId: 'job-1', title: '...', company: '...', date: 'आज', status: 'आवेदन जमा हो गया', method: 'सामान्य' } ]
  const [jobApplications, setJobApplications] = useState([
    {
      id: 'app-job-demo',
      jobId: 'job-1',
      title: 'लॉजिस्टिक्स सहायक',
      company: 'पूर्वी दिल्ली लॉजिस्टिक्स हब',
      date: 'कल',
      status: 'आवेदन जमा हो गया',
      method: 'ऑनलाइन'
    }
  ]);

  // scholarship applications: [ { id: 'app-sch-1', scholarshipId: 'sch-1', title: '...', currentStepIndex: 2 } ]
  const [scholarshipApplications, setScholarshipApplications] = useState({
    'sch-1': {
      statusIndex: 2, // 'आवेदन जमा'
      statusLabel: 'आवेदन जमा',
      appliedDate: '3 दिन पहले'
    }
  });

  // Voice application in job detail modal
  const [voiceApplyState, setVoiceApplyState] = useState('idle'); // 'idle' | 'recording' | 'recorded'
  const [voiceTranscript, setVoiceTranscript] = useState('');

  // Audio speech player
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Current domain & mobility preferences from props / state
  const currentDomain = selectedDomain || 'आपूर्ति श्रृंखला प्रबंधन';
  const mobility = studentData?.canRelocate || 'हाँ, मैं बाहर जा सकता/सकती हूँ';
  const wantsNearbyOnly = mobility.includes('आस-पास') || mobility.includes('केवल') || mobility.includes('नहीं');

  // Filter and sort jobs based on student mobility preference
  // If student wants nearby: prioritize East Delhi / nearby locations
  const filteredJobs = [...HARDCODED_JOBS].sort((a, b) => {
    if (wantsNearbyOnly) {
      if (a.isNearbyEastDelhi && !b.isNearbyEastDelhi) return -1;
      if (!a.isNearbyEastDelhi && b.isNearbyEastDelhi) return 1;
    }
    return 0;
  });

  // Play audio speech
  const handlePlayVoice = (text) => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    }
  };

  // Toggle Save Job
  const handleToggleSaveJob = (jobId) => {
    if (savedJobIds.includes(jobId)) {
      setSavedJobIds(savedJobIds.filter((id) => id !== jobId));
    } else {
      setSavedJobIds([...savedJobIds, jobId]);
      try {
        confetti({ particleCount: 20, spread: 40 });
      } catch (e) {}
    }
  };

  // Toggle Save Scholarship
  const handleToggleSaveScholarship = (schId) => {
    if (savedScholarshipIds.includes(schId)) {
      setSavedScholarshipIds(savedScholarshipIds.filter((id) => id !== schId));
    } else {
      setSavedScholarshipIds([...savedScholarshipIds, schId]);
      try {
        confetti({ particleCount: 20, spread: 40 });
      } catch (e) {}
    }
  };

  // Apply to Job
  const handleApplyJob = (job, method = 'सामान्य') => {
    const existing = jobApplications.find((app) => app.jobId === job.id);
    if (!existing) {
      setJobApplications([
        {
          id: `app-${Date.now()}`,
          jobId: job.id,
          title: job.title,
          company: job.company,
          date: 'आज',
          status: 'आवेदन जमा हो गया',
          method: method
        },
        ...jobApplications
      ]);
    }
    try {
      confetti({ particleCount: 40, spread: 60 });
    } catch (e) {}
  };

  // Scholarship step progression
  const handleStartScholarshipApplication = (schId) => {
    setScholarshipApplications((prev) => ({
      ...prev,
      [schId]: {
        statusIndex: 1, // 'आवेदन शुरू'
        statusLabel: 'आवेदन शुरू',
        appliedDate: 'आज'
      }
    }));
  };

  const handleSubmitScholarshipApplication = (schId) => {
    setScholarshipApplications((prev) => ({
      ...prev,
      [schId]: {
        statusIndex: 2, // 'आवेदन जमा'
        statusLabel: 'आवेदन जमा',
        appliedDate: 'आज'
      }
    }));
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}
  };

  // Check if student applied to a specific job
  const getJobApplicationStatus = (jobId) => {
    return jobApplications.find((app) => app.jobId === jobId);
  };

  // Get scholarship application status
  const getScholarshipStatus = (schId) => {
    return scholarshipApplications[schId] || { statusIndex: 0, statusLabel: 'पात्रता जाँच' };
  };

  // ================= VIEW: JOB DETAIL =================
  if (viewState === 'jobDetail' && selectedJob) {
    const appStatus = getJobApplicationStatus(selectedJob.id);
    const isSaved = savedJobIds.includes(selectedJob.id);

    return (
      <div className="space-y-4 animate-fadeIn pb-12">
        {/* Back Button */}
        <button
          onClick={() => {
            setViewState('list');
            if (window.speechSynthesis) window.speechSynthesis.cancel();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-600 bg-white border border-stone-200 px-3 py-1.5 rounded-xl shadow-2xs hover:bg-stone-50 active:scale-95 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← वापस अवसरों पर जाएँ</span>
        </button>

        {/* Job Header Card */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-5 rounded-3xl shadow-lg shadow-emerald-900/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              सत्यापित रोजगार
            </span>
            <span className="text-[11px] font-bold text-emerald-200 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{selectedJob.location}</span>
            </span>
          </div>

          <h2 className="text-xl font-black">{selectedJob.title}</h2>
          <p className="text-xs text-emerald-100 font-semibold">{selectedJob.company}</p>

          <div className="pt-2 border-t border-white/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-200 block">अनुमानित मासिक वेतन:</span>
              <span className="text-base font-black text-amber-300">{selectedJob.salary}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-emerald-200 block">आवश्यक योग्यता:</span>
              <span className="text-xs font-bold text-white">{selectedJob.educationReq}</span>
            </div>
          </div>
        </div>

        {/* Why Fit for Student */}
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
          <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md inline-block uppercase">
            आपके लिए उपयुक्त
          </span>
          <p className="text-xs text-emerald-950 font-bold leading-relaxed">
            "{selectedJob.fitReason}"
          </p>
        </div>

        {/* Job Responsibilities */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs space-y-3">
          <h3 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>इस काम में आपको क्या करना होगा?</span>
          </h3>

          <div className="space-y-2">
            {selectedJob.workPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed font-medium">{point}</span>
              </div>
            ))}
          </div>

          {/* Voice Listen Button */}
          <button
            onClick={() =>
              handlePlayVoice(
                `${selectedJob.title}, ${selectedJob.company} में। ${selectedJob.workPoints.join('। ')}`
              )
            }
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
              isPlayingAudio
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlayingAudio ? 'ऑडियो रोकें' : '🔊 काम का विवरण बोलकर सुनें'}</span>
          </button>
        </div>

        {/* Financial Calculation / Savings Estimate */}
        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <div>
              <h3 className="text-sm font-black text-stone-900">वास्तविक नौकरी का अनुमान</h3>
              <p className="text-[11px] text-stone-500 font-medium">खर्च काटकर हाथ में आने वाली बचत</p>
            </div>
            <Coins className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-stone-100">
              <span className="text-stone-600 font-medium">औसत मासिक वेतन:</span>
              <span className="font-bold text-stone-900">
                ₹{selectedJob.financialEstimate.estimatedSavings +
                  selectedJob.financialEstimate.travelCost +
                  selectedJob.financialEstimate.foodCost +
                  selectedJob.financialEstimate.rentCost}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-stone-100 text-red-600">
              <span className="font-medium">(-) अनुमानित यात्रा खर्च:</span>
              <span className="font-bold">₹{selectedJob.financialEstimate.travelCost}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-stone-100 text-red-600">
              <span className="font-medium">(-) अनुमानित भोजन खर्च:</span>
              <span className="font-bold">₹{selectedJob.financialEstimate.foodCost}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-stone-100 text-red-600">
              <span className="font-medium">(-) अनुमानित कमरा किराया:</span>
              <span className="font-bold">
                {selectedJob.financialEstimate.rentCost > 0
                  ? `₹${selectedJob.financialEstimate.rentCost}`
                  : '₹0 (घर से आवागमन)'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 bg-emerald-50 px-3 rounded-xl border border-emerald-200 mt-2">
              <span className="font-black text-emerald-900 text-sm">अनुमानित मासिक बचत:</span>
              <span className="font-black text-emerald-700 text-base">
                ₹{selectedJob.financialEstimate.estimatedSavings} / माह
              </span>
            </div>

            <p className="text-[11px] text-stone-500 leading-normal pt-1">
              💡 {selectedJob.financialEstimate.savingsNote}
            </p>
          </div>
        </div>

        {/* Voice Application Demo Area */}
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
          <span className="text-[11px] font-bold text-stone-700 block">
            आवाज़ से आवेदन (Voice Application):
          </span>

          {voiceApplyState === 'idle' && (
            <button
              onClick={() => {
                setVoiceApplyState('recording');
                setTimeout(() => {
                  setVoiceApplyState('recorded');
                  setVoiceTranscript(
                    'नमस्ते, मेरा नाम दीपक कुमार है। मैंने 12वीं की पढ़ाई की है और AAROHAN पर आपूर्ति श्रृंखला प्रबंधन सीखा है। मैं इस काम के लिए पूरी निष्ठा से मेहनत करूँगा।'
                  );
                }, 2000);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-orange-700 active:scale-95 transition"
            >
              <Mic className="w-4 h-4" />
              <span>🎙️ आवाज़ से आवेदन करें (बोलकर अपना परिचय दें)</span>
            </button>
          )}

          {voiceApplyState === 'recording' && (
            <div className="py-2 text-center text-xs text-red-600 font-bold flex items-center justify-center gap-2 animate-pulse">
              <Square className="w-4 h-4 fill-red-600" />
              <span>आपकी आवाज़ सुनी जा रही है... बोलिए</span>
            </div>
          )}

          {voiceApplyState === 'recorded' && (
            <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-2 text-xs">
              <span className="text-emerald-800 font-bold block text-[10px]">
                आपकी रिकॉर्डिंग दर्ज हो गई:
              </span>
              <p className="text-stone-700 italic">"{voiceTranscript}"</p>
              <button
                onClick={() => {
                  handleApplyJob(selectedJob, 'आवाज़ द्वारा');
                  alert('आपकी आवाज़ के साथ आवेदन जमा हो गया!');
                }}
                className="w-full py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
              >
                इस आवाज़ के साथ आवेदन जमा करें
              </button>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => handleToggleSaveJob(selectedJob.id)}
            className={`py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              isSaved
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-emerald-700" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? 'सहेजा गया' : 'सहेजें'}</span>
          </button>

          <button
            onClick={() => handleApplyJob(selectedJob, 'सामान्य')}
            disabled={Boolean(appStatus)}
            className={`flex-1 py-3 px-4 rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition ${
              appStatus
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white hover:from-emerald-800 hover:to-teal-800 active:scale-95'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{appStatus ? 'आवेदन जमा हो गया ✓' : 'आवेदन करें'}</span>
          </button>
        </div>
      </div>
    );
  }

  // ================= VIEW: SCHOLARSHIP DETAIL =================
  if (viewState === 'scholarshipDetail' && selectedScholarship) {
    const schStatus = getScholarshipStatus(selectedScholarship.id);
    const isSaved = savedScholarshipIds.includes(selectedScholarship.id);

    return (
      <div className="space-y-4 animate-fadeIn pb-12">
        {/* Back Button */}
        <button
          onClick={() => {
            setViewState('list');
            if (window.speechSynthesis) window.speechSynthesis.cancel();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-600 bg-white border border-stone-200 px-3 py-1.5 rounded-xl shadow-2xs hover:bg-stone-50 active:scale-95 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← वापस छात्रवृत्तियों पर जाएँ</span>
        </button>

        {/* Scholarship Header */}
        <div className="bg-gradient-to-r from-indigo-800 via-blue-800 to-indigo-900 text-white p-5 rounded-3xl shadow-lg shadow-indigo-900/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {selectedScholarship.category}
            </span>
            <span className="text-[11px] font-bold text-indigo-200">
              {selectedScholarship.targetAudience}
            </span>
          </div>

          <h2 className="text-xl font-black">{selectedScholarship.title}</h2>

          <div className="pt-2 border-t border-white/20">
            <span className="text-[10px] text-indigo-200 block">मुख्य लाभ:</span>
            <span className="text-base font-black text-amber-300">
              {selectedScholarship.mainBenefit}
            </span>
          </div>
        </div>

        {/* Why Shown to Student */}
        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 space-y-1">
          <span className="text-[10px] font-black text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-md inline-block uppercase">
            आपके लिए क्यों दिखाई जा रही है?
          </span>
          <p className="text-xs text-indigo-950 font-bold leading-relaxed">
            "{selectedScholarship.whyShown}"
          </p>
        </div>

        {/* Benefits List */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs space-y-3">
          <h3 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>मुख्य लाभ</span>
          </h3>
          <div className="space-y-2">
            {selectedScholarship.benefitsList.map((benefit, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                <span className="text-indigo-600 font-bold">•</span>
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Eligibility Details */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs space-y-3">
          <h3 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>पात्रता की शर्तें</span>
          </h3>
          <div className="space-y-2">
            {selectedScholarship.eligibilityDetails.map((el, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="font-medium">{el}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Required Documents */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs space-y-3">
          <h3 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>आवश्यक दस्तावेज़</span>
          </h3>
          <div className="space-y-2">
            {selectedScholarship.requiredDocuments.map((doc, i) => (
              <div key={i} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-800 flex items-center justify-between">
                <span>{doc}</span>
                <span className="text-[10px] text-stone-500 font-semibold">तैयार रखें</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Tracker: 5 steps */}
        <div className="bg-white rounded-3xl p-5 border-2 border-indigo-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <h3 className="text-sm font-black text-stone-900">आवेदन की स्थिति</h3>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              {SCHOLARSHIP_APPLICATION_STEPS[schStatus.statusIndex]?.label}
            </span>
          </div>

          <div className="space-y-2">
            {SCHOLARSHIP_APPLICATION_STEPS.map((step, idx) => {
              const isPassed = idx < schStatus.statusIndex;
              const isCurrent = idx === schStatus.statusIndex;

              return (
                <div
                  key={step.id}
                  className={`p-2.5 rounded-xl border flex items-center gap-3 transition ${
                    isCurrent
                      ? 'bg-indigo-50 border-indigo-300'
                      : isPassed
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-stone-50 border-stone-200 opacity-60'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                      isPassed
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-indigo-600 text-white'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {isPassed ? '✓' : idx + 1}
                  </div>
                  <div>
                    <div className="text-xs font-black">{step.label}</div>
                    <div className="text-[10px] text-stone-500 font-medium">{step.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons inside tracker */}
          <div className="pt-2">
            {schStatus.statusIndex === 0 && (
              <button
                onClick={() => handleStartScholarshipApplication(selectedScholarship.id)}
                className="w-full py-3 rounded-2xl bg-indigo-700 text-white font-black text-xs shadow-md hover:bg-indigo-800 active:scale-95 transition"
              >
                आवेदन शुरू करें
              </button>
            )}

            {schStatus.statusIndex === 1 && (
              <button
                onClick={() => handleSubmitScholarshipApplication(selectedScholarship.id)}
                className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-black text-xs shadow-md hover:bg-emerald-700 active:scale-95 transition"
              >
                दस्तावेज़ की पुष्टि करें एवं आवेदन जमा करें
              </button>
            )}

            {schStatus.statusIndex >= 2 && (
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-center text-xs font-bold">
                आपका आवेदन सफलतापूर्वक जमा हो चुका है और सत्यापन प्रक्रिया में है।
              </div>
            )}
          </div>
        </div>

        {/* Save button */}
        <div className="pt-2">
          <button
            onClick={() => handleToggleSaveScholarship(selectedScholarship.id)}
            className={`w-full py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
              isSaved
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-emerald-700" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? 'यह छात्रवृत्ति सहेजी गई है' : 'छात्रवृत्ति सहेजें'}</span>
          </button>
        </div>
      </div>
    );
  }

  // ================= VIEW: MAIN OPPORTUNITIES SCREEN =================
  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-5 rounded-3xl shadow-lg shadow-emerald-900/20">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-black bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            करियर एवं शिक्षा सहयोग
          </span>
          <span className="text-xs text-emerald-200 font-bold flex items-center gap-1">
            <Building className="w-3.5 h-3.5" />
            <span>सत्यापित अवसर</span>
          </span>
        </div>

        <h2 className="text-2xl font-black">अवसर</h2>
        <p className="text-xs text-emerald-100 font-medium mt-0.5">
          आपके लिए चुने गए अवसर
        </p>

        {/* Profile State Info Bar */}
        <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
          <div>
            <span className="text-emerald-200 text-[10px] block">आपका क्षेत्र:</span>
            <span className="font-black text-white text-sm">{currentDomain}</span>
          </div>
          <div className="text-right">
            <span className="text-emerald-200 text-[10px] block">स्थान प्राथमिकता:</span>
            <span className="font-bold text-white text-xs">
              {wantsNearbyOnly ? 'आस-पास (पूर्वी दिल्ली)' : 'दिल्ली एवं बाहर'}
            </span>
          </div>
        </div>
      </div>

      {/* EXACTLY TWO TABS: [ नौकरियाँ ] [ छात्रवृत्तियाँ ] */}
      <div className="grid grid-cols-2 gap-2 bg-stone-200/80 p-1.5 rounded-2xl">
        <button
          onClick={() => setSubTab('jobs')}
          className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            subTab === 'jobs'
              ? 'bg-white text-emerald-900 shadow-md shadow-stone-300'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>नौकरियाँ</span>
        </button>

        <button
          onClick={() => setSubTab('scholarships')}
          className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            subTab === 'scholarships'
              ? 'bg-white text-indigo-900 shadow-md shadow-stone-300'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>छात्रवृत्तियाँ</span>
        </button>
      </div>

      {/* Quick shortcuts for "मेरे सहेजे अवसर" and "मेरे आवेदन" */}
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => {
            const firstSavedJob = HARDCODED_JOBS.find((j) => savedJobIds.includes(j.id));
            if (firstSavedJob) {
              setSelectedJob(firstSavedJob);
              setViewState('jobDetail');
            } else {
              alert('आपने अभी कोई अवसर सहेजा नहीं है। कार्ड पर "सहेजें" बटन दबाएँ।');
            }
          }}
          className="flex-1 p-2.5 rounded-2xl bg-white border border-stone-200 shadow-2xs font-bold text-stone-700 flex items-center justify-center gap-1.5 hover:bg-stone-50"
        >
          <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
          <span>मेरे सहेजे अवसर ({savedJobIds.length + savedScholarshipIds.length})</span>
        </button>

        <button
          onClick={() => {
            const firstAppliedJob = HARDCODED_JOBS.find((j) =>
              jobApplications.some((app) => app.jobId === j.id)
            );
            if (firstAppliedJob) {
              setSelectedJob(firstAppliedJob);
              setViewState('jobDetail');
            } else {
              alert('आपने अभी किसी नौकरी में आवेदन नहीं किया है।');
            }
          }}
          className="flex-1 p-2.5 rounded-2xl bg-white border border-stone-200 shadow-2xs font-bold text-stone-700 flex items-center justify-center gap-1.5 hover:bg-stone-50"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
          <span>मेरे आवेदन ({jobApplications.length + Object.keys(scholarshipApplications).length})</span>
        </button>
      </div>

      {/* ================= TAB 1: नौकरियाँ ================= */}
      {subTab === 'jobs' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-black text-stone-900">
              आपके लिए नौकरी के अवसर
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              आपकी शिक्षा, कौशल, क्षेत्र और स्थान के आधार पर
            </p>
          </div>

          <div className="space-y-3.5">
            {filteredJobs.map((job) => {
              const isSaved = savedJobIds.includes(job.id);
              const appStatus = getJobApplicationStatus(job.id);

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-3xl p-5 border-2 border-stone-200/90 shadow-xs hover:border-emerald-300 transition-all space-y-3"
                >
                  {/* Job Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md inline-block mb-1">
                        आपके लिए उपयुक्त
                      </span>
                      <h4 className="font-black text-base text-stone-900 leading-snug">
                        {job.title}
                      </h4>
                      <p className="text-xs text-stone-600 font-semibold">{job.company}</p>
                    </div>

                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full shrink-0">
                      {job.salary}
                    </span>
                  </div>

                  {/* Location & Eligibility */}
                  <div className="flex items-center gap-3 text-xs text-stone-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{job.location}</span>
                    </span>
                    <span>•</span>
                    <span className="truncate">योग्यता: {job.educationReq}</span>
                  </div>

                  {/* Fit reason */}
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/70 text-xs text-stone-700 font-medium">
                    <span className="font-bold text-stone-900 block text-[10px]">आपके लिए क्यों उपयुक्त?</span>
                    "{job.fitReason}"
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleSaveJob(job.id)}
                      className="p-2 rounded-xl text-stone-500 hover:text-emerald-700 hover:bg-stone-100 transition"
                      title="सहेजें"
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setViewState('jobDetail');
                      }}
                      className="flex-1 py-2 px-4 rounded-xl bg-emerald-700 text-white font-black text-xs shadow-xs hover:bg-emerald-800 active:scale-95 transition flex items-center justify-center gap-1.5"
                    >
                      <span>विवरण देखें</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 2: छात्रवृत्तियाँ ================= */}
      {subTab === 'scholarships' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-black text-stone-900">
              आपके लिए छात्रवृत्तियाँ
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              आपकी शिक्षा और प्रोफ़ाइल के आधार पर चुनी गई छात्रवृत्तियाँ
            </p>
          </div>

          <div className="space-y-3.5">
            {HARDCODED_SCHOLARSHIPS.map((sch) => {
              const isSaved = savedScholarshipIds.includes(sch.id);
              const schStatus = getScholarshipStatus(sch.id);

              return (
                <div
                  key={sch.id}
                  className="bg-white rounded-3xl p-5 border-2 border-stone-200/90 shadow-xs hover:border-indigo-300 transition-all space-y-3"
                >
                  {/* Badge & Title */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md inline-block mb-1">
                        संभावित रूप से उपयुक्त
                      </span>
                      <h4 className="font-black text-base text-stone-900 leading-snug">
                        {sch.title}
                      </h4>
                      <p className="text-xs text-stone-500 font-semibold">{sch.targetAudience}</p>
                    </div>

                    <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full shrink-0">
                      {sch.mainBenefit}
                    </span>
                  </div>

                  {/* Eligibility Summary */}
                  <p className="text-xs text-stone-700 font-medium leading-relaxed">
                    <strong>पात्रता सार:</strong> {sch.eligibilitySummary}
                  </p>

                  {/* Application Status Badge */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-stone-500">आवेदन की स्थिति:</span>
                    <span
                      className={`font-black px-2.5 py-0.5 rounded-full text-[11px] ${
                        schStatus.statusIndex >= 2
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {SCHOLARSHIP_APPLICATION_STEPS[schStatus.statusIndex]?.label}
                    </span>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleSaveScholarship(sch.id)}
                      className="p-2 rounded-xl text-stone-500 hover:text-indigo-700 hover:bg-stone-100 transition"
                      title="सहेजें"
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedScholarship(sch);
                        setViewState('scholarshipDetail');
                      }}
                      className="flex-1 py-2 px-4 rounded-xl bg-indigo-700 text-white font-black text-xs shadow-xs hover:bg-indigo-800 active:scale-95 transition flex items-center justify-center gap-1.5"
                    >
                      <span>विवरण देखें</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= SECTION: मेरे आवेदन ================= */}
      <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs space-y-3 mt-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <h3 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>मेरे आवेदन</span>
          </h3>
          <span className="text-[11px] text-stone-500 font-bold">सक्रिय ट्रैकिंग</span>
        </div>

        {/* Jobs Applications */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-stone-700 block">नौकरी आवेदन:</span>
          {jobApplications.map((app) => (
            <div
              key={app.id}
              className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs"
            >
              <div>
                <h5 className="font-bold text-stone-900">{app.title}</h5>
                <p className="text-[10px] text-stone-500">{app.company} • {app.date}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px]">
                {app.status}
              </span>
            </div>
          ))}
        </div>

        {/* Scholarship Applications */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <span className="text-xs font-bold text-stone-700 block">छात्रवृत्ति आवेदन:</span>
          {Object.entries(scholarshipApplications).map(([schId, app]) => {
            const schObj = HARDCODED_SCHOLARSHIPS.find((s) => s.id === schId);
            return (
              <div
                key={schId}
                className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs"
              >
                <div>
                  <h5 className="font-bold text-stone-900">{schObj?.title || 'छात्रवृत्ति'}</h5>
                  <p className="text-[10px] text-stone-500">स्थिति: {app.statusLabel}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 font-black text-[10px]">
                  {app.statusLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
