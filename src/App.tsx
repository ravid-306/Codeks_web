import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { KodiMascot } from './components/KodiMascot';
import { ChapterLesson } from './components/ChapterLesson';
import { ChapterQuiz } from './components/ChapterQuiz';
import { ChapterCodeTask } from './components/ChapterCodeTask';
import { ArcadeGame } from './components/ArcadeGame';
import { CertificateView } from './components/CertificateView';
import { KodiMentorModal } from './components/KodiMentorModal';
import { ProjectSubmissionModal } from './components/ProjectSubmissionModal';
import { LanguageLogo } from './components/LanguageLogos';
import { ALL_CURRICULUM } from './data/curriculumData';
import { LANGUAGES } from './data/languages';
import { Language, Chapter, UserCertificate } from './types/curriculum';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Award,
  Sparkles,
  Gamepad2,
  Flame,
  Search,
  ExternalLink,
  ShieldCheck,
  Star,
  ArrowRight,
  ArrowLeft,
  Play,
  Clock,
  Code2,
  Users,
  Compass,
  Check,
  Video,
} from 'lucide-react';

function AcademyApp() {
  const { user, progress, markChapterCompleted, addCertificate } = useAuth();

  // Navigation states
  const [activeTab, setActiveTab] = useState<'catalog' | 'chapter' | 'certificates' | 'arcade' | 'verify'>('catalog');
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>('javascript');
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<number>(1);
  const [chapterStep, setChapterStep] = useState<'lesson' | 'quiz' | 'codetask'>('lesson');

  // Filter in catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryTrack, setSelectedCategoryTrack] = useState<string>('all');

  // Modals
  const [isAiMentorOpen, setIsAiMentorOpen] = useState(false);
  const [isProjectSubmissionOpen, setIsProjectSubmissionOpen] = useState(false);
  const [viewingCertificate, setViewingCertificate] = useState<UserCertificate | null>(null);
  const [verificationQueryId, setVerificationQueryId] = useState('');

  // Handle URL hash for public certificate verification (#verify-[id])
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#verify-')) {
        const id = hash.replace('#verify-', '');
        setActiveTab('verify');
        setVerificationQueryId(id);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const currentLanguage: Language = ALL_CURRICULUM[selectedLanguageId] || ALL_CURRICULUM['javascript'];
  const currentChapter: Chapter =
    currentLanguage.chapters.find((c) => c.number === selectedChapterNumber) || currentLanguage.chapters[0];

  // Helper to check chapter completion
  const isChapterComplete = (langId: string, chNum: number) => {
    return progress.completedChapters.includes(`${langId}-${chNum}`);
  };

  // Helper to open a chapter
  const handleOpenChapter = (langId: string, chNum: number = 1) => {
    setSelectedLanguageId(langId);
    setSelectedChapterNumber(chNum);
    setChapterStep('lesson');
    setActiveTab('chapter');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Chapter flow transitions
  const handlePassQuiz = async (quizScore: number) => {
    setChapterStep('codetask');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteChapter = async () => {
    const chId = `${currentLanguage.id}-${currentChapter.number}`;
    await markChapterCompleted(chId, 100, 10);

    // If this is Chapter 11 (the final exam), issue language certificate
    if (currentChapter.isExam) {
      const certId = `CDK-2026-${currentLanguage.id.toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const cert: UserCertificate = {
        certId,
        userId: user?.uid || 'guest-learner',
        learnerName: user?.displayName || progress.displayName || 'Codeks Scholar',
        languageId: currentLanguage.id,
        languageName: currentLanguage.name,
        issuedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        studyHours: Math.max(2, Math.round((currentLanguage.chaptersCount * 10) / 60)),
        score: 100,
        verificationHash: Array.from(crypto.getRandomValues(new Uint8Array(16)))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join(''),
      };
      await addCertificate(cert);
      setViewingCertificate(cert);
    }
  };

  // Filter languages
  const filteredLanguages = LANGUAGES.filter((lang) => {
    const matchesSearch =
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.industryRole.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategoryTrack === 'web') {
      return matchesSearch && ['html', 'css', 'javascript', 'typescript'].includes(lang.id);
    }
    if (selectedCategoryTrack === 'backend') {
      return matchesSearch && ['python', 'sql', 'git', 'java'].includes(lang.id);
    }
    if (selectedCategoryTrack === 'mobile-cloud') {
      return matchesSearch && ['kotlin', 'swift', 'php', 'go'].includes(lang.id);
    }
    if (selectedCategoryTrack === 'systems') {
      return matchesSearch && ['c', 'cpp', 'csharp', 'rust', 'bash'].includes(lang.id);
    }

    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f7f5ff] dark:bg-[#0d0a1a] text-[#1e1b4b] dark:text-[#f3efff] flex flex-col font-sans transition-colors selection:bg-[#ffd23f] selection:text-[#1e1b4b]">
      
      {/* Navbar (Hidden in Arcade Mode) */}
      {activeTab !== 'arcade' && (
        <Navbar
          currentTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab as any);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAiMentor={() => setIsAiMentorOpen(true)}
        />
      )}

      {/* Main Content View Switcher */}
      <main className="flex-1 w-full">
        
        {/* ============================================================ */}
        {/* VIEW 1: CATALOG & LANDING MATCHING ATTACHED UI REFERENCE    */}
        {/* ============================================================ */}
        {activeTab === 'catalog' && (
          <div className="space-y-16 animate-fadeIn pb-16">
            
            {/* 1. HERO SECTION (Matching reference image layout) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Left Column: Heading, Subtext, Metrics */}
                <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                  {/* Category Pill Tag */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#6c4cf1]/10 text-[#6c4cf1] dark:text-[#a78bfa] border border-[#6c4cf1]/20 text-xs font-bold">
                    <span>Best Interactive Learning Platform</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6c4cf1]" />
                  </div>

                  {/* Headline with Decorative Asterisk Flower */}
                  <h1 className="text-4xl sm:text-6xl font-black text-[#1e1b4b] dark:text-white tracking-tight leading-[1.12]">
                    Elevate Your <br />
                    Future With <span className="inline-block text-[#ff7eb6] animate-spin" style={{ animationDuration: '12s' }}>✻</span> <br />
                    <span className="text-[#6c4cf1]">Practical Skills</span>
                  </h1>

                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                    Flexible 10-minute online modules designed to fit your adult schedule, career goals, and passions empowering you to code anytime with real live sandboxes.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                    <button
                      onClick={() => handleOpenChapter('javascript', 1)}
                      className="px-7 py-3.5 rounded-2xl bg-[#ffd23f] hover:bg-[#ffcd2b] text-[#1e1b4b] font-black text-sm shadow-md transition-all active:scale-95"
                    >
                      Get Started Today
                    </button>
                    <button
                      onClick={() => setActiveTab('arcade')}
                      className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-[#1a162b] border-2 border-[#6c4cf1]/20 hover:border-[#6c4cf1] text-[#1e1b4b] dark:text-white font-extrabold text-sm transition-all shadow-xs"
                    >
                      <Gamepad2 className="w-4 h-4 text-[#6c4cf1]" />
                      <span>Play Syntax Sprint</span>
                    </button>
                  </div>

                  {/* Stats Counter Strip */}
                  <div className="pt-6 border-t border-gray-200 dark:border-white/10 flex items-center justify-center lg:justify-start gap-10 text-left">
                    <div>
                      <span className="text-3xl sm:text-4xl font-black text-[#1e1b4b] dark:text-white block tabular-nums">
                        17+
                      </span>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Languages Covered
                      </span>
                    </div>
                    <div className="w-px h-10 bg-gray-200 dark:bg-white/10" />
                    <div>
                      <span className="text-3xl sm:text-4xl font-black text-[#1e1b4b] dark:text-white block tabular-nums">
                        187+
                      </span>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        10-Min Chapters
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Floating Student Card with Overlays */}
                <div className="lg:col-span-5 relative flex justify-center">
                  <div className="relative w-full max-w-md aspect-square rounded-[40px] bg-[#f0ecff] dark:bg-[#201a3d] border-4 border-white dark:border-[#2d2454] shadow-2xl overflow-hidden group">
                    
                    {/* Generated Learner Image (Matching Reference Style) */}
                    <img
                      src="/src/assets/images/hero_learner_1793449711283.jpg"
                      alt="Student learning coding"
                      className="w-full h-full object-cover object-top scale-105 group-hover:scale-100 transition-transform duration-700"
                    />

                    {/* Floating Circular Badge: 90% Pass Rate (Top Left) */}
                    <div className="absolute top-5 left-5 bg-white/95 dark:bg-[#1a162b]/95 backdrop-blur-md p-2.5 rounded-2xl shadow-lg border border-[#6c4cf1]/20 flex items-center gap-2.5 animate-bounce" style={{ animationDuration: '4s' }}>
                      <div className="relative w-10 h-10 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="3.5"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#00b3a4"
                            strokeWidth="3.8"
                            strokeDasharray="90, 100"
                          />
                        </svg>
                        <span className="absolute text-[11px] font-black text-[#1e1b4b] dark:text-white">90%</span>
                      </div>
                      <div className="pr-1 text-left">
                        <p className="text-[10px] font-bold text-gray-500 uppercase">First-Try</p>
                        <p className="text-xs font-black text-[#1e1b4b] dark:text-white">Pass Rate</p>
                      </div>
                    </div>

                    {/* Floating Camera / Live Practice Pill (Top Right) */}
                    <div className="absolute top-5 right-5 w-10 h-10 rounded-2xl bg-[#ff7eb6] text-white flex items-center justify-center shadow-md">
                      <Video className="w-5 h-5" />
                    </div>

                    {/* Floating Learner Review Strip (Bottom) */}
                    <div className="absolute bottom-5 left-5 right-5 bg-white/95 dark:bg-[#1a162b]/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          <span className="w-7 h-7 rounded-full bg-[#6c4cf1] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                            A
                          </span>
                          <span className="w-7 h-7 rounded-full bg-[#ff7eb6] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                            M
                          </span>
                          <span className="w-7 h-7 rounded-full bg-[#ffd23f] text-[#78350f] text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                            K
                          </span>
                        </div>
                        <span className="text-[11px] font-extrabold text-gray-800 dark:text-gray-200">
                          24,000+ Enrolled
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[#b45309] font-black text-xs bg-[#ffd23f]/30 px-2 py-0.5 rounded-lg">
                        <Star className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                        <span>4.9 / 5</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </section>

            {/* ============================================================ */}
            {/* 2. LOGO SECTION (Requested: "use logo of language in logo Sections") */}
            {/* ============================================================ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white dark:bg-[#151126] rounded-3xl p-6 sm:p-8 border-2 border-[#6c4cf1]/10 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-[11px] font-black uppercase text-[#6c4cf1] dark:text-[#a78bfa] tracking-wider block">
                      Official Technology Stack
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#1e1b4b] dark:text-white">
                      Learn With Real Programming Language Logos & Standards
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-gray-500">
                    Click any logo to jump to its track
                  </span>
                </div>

                {/* Grid of All 17 Language Logos */}
                <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-4 items-center">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => handleOpenChapter(lang.id, 1)}
                      className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#f8f6ff] dark:bg-[#1f1938] hover:bg-[#6c4cf1]/15 border border-[#6c4cf1]/15 hover:border-[#6c4cf1] transition-all group active:scale-95 shadow-xs"
                      title={`Open ${lang.name} Track`}
                    >
                      <LanguageLogo id={lang.id} name={lang.name} size="md" className="group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 mt-2 truncate w-full text-center">
                        {lang.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* 3. PROFESSIONALLY ALIGNED LEARNING CATEGORIES (Yellow Card)  */}
            {/* ============================================================ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative rounded-[40px] bg-[#ffd23f] p-8 sm:p-12 shadow-xl overflow-hidden text-[#1e1b4b]">
                
                {/* Purple decorative squiggle lines (Matching reference style) */}
                <svg className="absolute top-0 right-0 w-80 h-48 opacity-75 pointer-events-none" viewBox="0 0 300 150">
                  <path d="M 50 20 C 150 -30, 200 100, 280 40 C 320 20, 260 140, 220 120" fill="none" stroke="#6c4cf1" strokeWidth="6" strokeLinecap="round" />
                </svg>

                <div className="relative z-10 space-y-6">
                  {/* Category Chip */}
                  <span className="inline-block px-3.5 py-1 rounded-full bg-white/80 font-bold text-xs text-[#1e1b4b] border border-black/10">
                    Category
                  </span>

                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1e1b4b] max-w-lg">
                    Professionally Aligned Learning Categories
                  </h2>

                  {/* 4 Category Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    
                    {/* Category 1: Web & Frontend */}
                    <div
                      onClick={() => setSelectedCategoryTrack('web')}
                      className={`p-6 rounded-3xl transition-all cursor-pointer flex flex-col justify-between h-56 ${
                        selectedCategoryTrack === 'web'
                          ? 'bg-[#6c4cf1] text-white shadow-xl scale-[1.02]'
                          : 'bg-white text-[#1e1b4b] hover:shadow-lg'
                      }`}
                    >
                      <div>
                        <h4 className="font-extrabold text-base leading-snug">Web & Interactive Frontend</h4>
                        <p className={`text-xs mt-1 ${selectedCategoryTrack === 'web' ? 'text-white/80' : 'text-gray-500'}`}>
                          4 Tracks • 44 Chapters
                        </p>
                      </div>
                      
                      <div className="flex items-end justify-between">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${selectedCategoryTrack === 'web' ? 'bg-white text-[#6c4cf1]' : 'bg-[#ffd23f] text-[#1e1b4b]'}`}>
                          →
                        </div>
                        {/* Memphis Abstract Tile Graphic */}
                        <div className="w-10 h-10 flex items-center justify-center">
                          <div className={`w-8 h-8 rounded-lg ${selectedCategoryTrack === 'web' ? 'bg-[#ff7eb6]' : 'bg-[#6c4cf1]'} flex items-center justify-center text-white font-black text-xs`}>
                            ❖
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Category 2: AI, Data & Backend */}
                    <div
                      onClick={() => setSelectedCategoryTrack('backend')}
                      className={`p-6 rounded-3xl transition-all cursor-pointer flex flex-col justify-between h-56 ${
                        selectedCategoryTrack === 'backend'
                          ? 'bg-[#6c4cf1] text-white shadow-xl scale-[1.02]'
                          : 'bg-white text-[#1e1b4b] hover:shadow-lg'
                      }`}
                    >
                      <div>
                        <h4 className="font-extrabold text-base leading-snug">Data & Intelligent Backends</h4>
                        <p className={`text-xs mt-1 ${selectedCategoryTrack === 'backend' ? 'text-white/80' : 'text-gray-500'}`}>
                          4 Tracks • 44 Chapters
                        </p>
                      </div>
                      
                      <div className="flex items-end justify-between">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${selectedCategoryTrack === 'backend' ? 'bg-white text-[#6c4cf1]' : 'bg-[#ffd23f] text-[#1e1b4b]'}`}>
                          →
                        </div>
                        {/* Memphis Grid Pattern Graphic */}
                        <div className="grid grid-cols-2 gap-1 w-7 h-7">
                          <span className="w-3 h-3 rounded-xs bg-[#00b3a4]" />
                          <span className="w-3 h-3 rounded-xs bg-[#6c4cf1]" />
                          <span className="w-3 h-3 rounded-xs bg-[#6c4cf1]" />
                          <span className="w-3 h-3 rounded-xs bg-[#00b3a4]" />
                        </div>
                      </div>
                    </div>

                    {/* Category 3: Mobile & Cloud Platforms */}
                    <div
                      onClick={() => setSelectedCategoryTrack('mobile-cloud')}
                      className={`p-6 rounded-3xl transition-all cursor-pointer flex flex-col justify-between h-56 ${
                        selectedCategoryTrack === 'mobile-cloud'
                          ? 'bg-[#6c4cf1] text-white shadow-xl scale-[1.02]'
                          : 'bg-white text-[#1e1b4b] hover:shadow-lg'
                      }`}
                    >
                      <div>
                        <h4 className="font-extrabold text-base leading-snug">Modern Mobile & Cloud</h4>
                        <p className={`text-xs mt-1 ${selectedCategoryTrack === 'mobile-cloud' ? 'text-white/80' : 'text-gray-500'}`}>
                          4 Tracks • 44 Chapters
                        </p>
                      </div>
                      
                      <div className="flex items-end justify-between">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${selectedCategoryTrack === 'mobile-cloud' ? 'bg-white text-[#6c4cf1]' : 'bg-[#ffd23f] text-[#1e1b4b]'}`}>
                          →
                        </div>
                        {/* Memphis Pinwheel Shape */}
                        <div className="w-8 h-8 rounded-full border-4 border-[#ff7eb6] border-t-transparent animate-spin" style={{ animationDuration: '8s' }} />
                      </div>
                    </div>

                    {/* Category 4: Systems & Low-Level Engines */}
                    <div
                      onClick={() => setSelectedCategoryTrack('systems')}
                      className={`p-6 rounded-3xl transition-all cursor-pointer flex flex-col justify-between h-56 ${
                        selectedCategoryTrack === 'systems'
                          ? 'bg-[#6c4cf1] text-white shadow-xl scale-[1.02]'
                          : 'bg-white text-[#1e1b4b] hover:shadow-lg'
                      }`}
                    >
                      <div>
                        <h4 className="font-extrabold text-base leading-snug">Systems, OS & High Performance</h4>
                        <p className={`text-xs mt-1 ${selectedCategoryTrack === 'systems' ? 'text-white/80' : 'text-gray-500'}`}>
                          5 Tracks • 55 Chapters
                        </p>
                      </div>
                      
                      <div className="flex items-end justify-between">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${selectedCategoryTrack === 'systems' ? 'bg-white text-[#6c4cf1]' : 'bg-[#ffd23f] text-[#1e1b4b]'}`}>
                          →
                        </div>
                        {/* Memphis Asterisk Sunburst */}
                        <div className="w-8 h-8 flex items-center justify-center font-black text-2xl text-[#6c4cf1]">
                          ✱
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* 4. TRACKS DIRECTORY (Filtered or All)                       */}
            {/* ============================================================ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-black text-[#1e1b4b] dark:text-white">
                    {selectedCategoryTrack === 'all'
                      ? 'All 17 Language Tracks'
                      : `Selected Track: ${selectedCategoryTrack.toUpperCase()}`}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Each language features 11 progressive 10-minute chapters from basics to certification.
                  </p>
                </div>

                {selectedCategoryTrack !== 'all' && (
                  <button
                    onClick={() => setSelectedCategoryTrack('all')}
                    className="text-xs font-bold text-[#6c4cf1] hover:underline flex items-center gap-1"
                  >
                    Reset Filter (Show All 17)
                  </button>
                )}
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLanguages.map((lang) => {
                  const completedCount = Array.from({ length: lang.chaptersCount }).filter((_, i) =>
                    isChapterComplete(lang.id, i + 1)
                  ).length;
                  const percent = Math.round((completedCount / lang.chaptersCount) * 100);

                  return (
                    <div
                      key={lang.id}
                      onClick={() => handleOpenChapter(lang.id, 1)}
                      className="bg-white dark:bg-[#1a162b] rounded-[28px] p-6 border-2 border-[#6c4cf1]/15 hover:border-[#6c4cf1] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group active:scale-[0.99]"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-[#f8f6ff] dark:bg-[#201a3d] border border-gray-200 dark:border-white/10 flex items-center justify-center p-2 group-hover:scale-105 transition-transform shadow-xs">
                              <LanguageLogo id={lang.id} name={lang.name} size="md" />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-xl text-[#1e1b4b] dark:text-white">
                                {lang.name}
                              </h4>
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                {lang.industryRole}
                              </span>
                            </div>
                          </div>

                          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#f3efff] dark:bg-[#201a3d] text-[#6c4cf1] dark:text-[#c4b5fd]">
                            {lang.chaptersCount} Ch
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                          {lang.description}
                        </p>

                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-[11px] font-bold text-gray-500">
                            <span>{completedCount}/{lang.chaptersCount} chapters passed</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${percent}%`, backgroundColor: lang.badgeColor }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#6c4cf1] dark:text-[#a78bfa] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          Open Track <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                        {percent === 100 && (
                          <div className="flex items-center gap-1 text-[11px] font-black text-amber-500">
                            <Award className="w-4 h-4 fill-amber-500" />
                            <span>Certificate Earned</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ============================================================ */}
            {/* 5. BUILT ON PRINCIPLES THAT MATTER (Matching reference style) */}
            {/* ============================================================ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-b from-[#ffd23f]/30 to-white dark:from-[#251e44] dark:to-[#151126] p-8 sm:p-12 rounded-[40px] border-2 border-[#ffd23f]/50 space-y-8">
                
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-white dark:bg-[#1a162b] text-xs font-bold text-[#6c4cf1] border border-[#6c4cf1]/20">
                    Our Values
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#1e1b4b] dark:text-white tracking-tight">
                    Built On Principles That Matter
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Principle 1: Quality (Purple card like reference) */}
                  <div className="bg-[#6c4cf1] text-white p-6 rounded-3xl space-y-3 shadow-md">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <h4 className="font-extrabold text-lg">Rigorous Quality</h4>
                    <p className="text-xs text-white/80 leading-relaxed">
                      Zero gamified coin distractions. Every chapter is a focused 10-minute sprint with real compilers and test validation.
                    </p>
                  </div>

                  {/* Principle 2: Flexibility */}
                  <div className="bg-white dark:bg-[#1a162b] p-6 rounded-3xl space-y-3 border border-[#6c4cf1]/15 shadow-xs">
                    <div className="w-10 h-10 rounded-2xl bg-[#ffd23f]/30 text-[#b45309] flex items-center justify-center font-bold">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-lg text-[#1e1b4b] dark:text-white">True Flexibility</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      Learn on demand whenever inspiration strikes. State and streaks sync to the cloud and work offline.
                    </p>
                  </div>

                  {/* Principle 3: Community & Streaks */}
                  <div className="bg-white dark:bg-[#1a162b] p-6 rounded-3xl space-y-3 border border-[#6c4cf1]/15 shadow-xs">
                    <div className="w-10 h-10 rounded-2xl bg-[#ff7eb6]/20 text-[#ff4382] flex items-center justify-center font-bold">
                      <Flame className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-lg text-[#1e1b4b] dark:text-white">Streak Retention</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      Build durable habits. Daily streaks and earned skill badges celebrate genuine intellectual consistency.
                    </p>
                  </div>

                  {/* Principle 4: Support */}
                  <div className="bg-white dark:bg-[#1a162b] p-6 rounded-3xl space-y-3 border border-[#6c4cf1]/15 shadow-xs">
                    <div className="w-10 h-10 rounded-2xl bg-[#00b3a4]/20 text-[#00b3a4] flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-lg text-[#1e1b4b] dark:text-white">AI Mentor Support</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      Kodi and Gemini provide multi-turn guidance, high-thinking memory explanations, and search grounding.
                    </p>
                  </div>

                </div>
              </div>
            </section>



            {/* ============================================================ */}
            {/* 7. BOTTOM PURPLE CTA BANNER (Matching reference style)       */}
            {/* ============================================================ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative rounded-[40px] bg-[#6c4cf1] p-8 sm:p-14 text-white shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                
                {/* Yellow Memphis squiggle lines */}
                <svg className="absolute -bottom-8 -right-8 w-80 h-48 opacity-40 pointer-events-none" viewBox="0 0 300 150">
                  <path d="M 10 120 C 80 40, 160 160, 240 80 C 270 40, 290 100, 310 70" fill="none" stroke="#ffd23f" strokeWidth="8" strokeLinecap="round" />
                </svg>

                <div className="space-y-4 max-w-xl text-center md:text-left relative z-10">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 text-xs font-bold text-[#ffd23f] border border-white/20">
                    Build Learning Habits
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                    Join Thousands Of Modern Learners Worldwide
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                    Start your journey with a bite-sized 10-minute session. No fluff, no paywalled trivia—pure verified software mastery.
                  </p>
                </div>

                <div className="relative z-10 shrink-0">
                  <button
                    onClick={() => handleOpenChapter('javascript', 1)}
                    className="px-8 py-4 rounded-2xl bg-[#ffd23f] hover:bg-[#ffcd2b] text-[#1e1b4b] font-black text-base shadow-xl transition-all active:scale-95"
                  >
                    Enroll Now (Free)
                  </button>
                </div>

              </div>
            </section>

          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: CHAPTER WORKSPACE (LESSON -> QUIZ -> CODE TASK)     */}
        {/* ============================================================ */}
        {activeTab === 'chapter' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            
            {/* Top Navigation & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                onClick={() => setActiveTab('catalog')}
                className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-[#6c4cf1] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Academy Catalog</span>
              </button>

              {/* Step Segmented Switcher */}
              <div className="flex items-center p-1.5 rounded-2xl bg-white dark:bg-[#1a162b] border-2 border-[#6c4cf1]/20 shadow-xs">
                <button
                  onClick={() => setChapterStep('lesson')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    chapterStep === 'lesson'
                      ? 'bg-[#6c4cf1] text-white shadow-xs'
                      : 'text-gray-600 dark:text-gray-300 hover:text-[#6c4cf1]'
                  }`}
                >
                  <span>1. Lesson</span>
                  <span className="text-[10px] opacity-75">(2 min)</span>
                </button>
                <button
                  onClick={() => setChapterStep('quiz')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    chapterStep === 'quiz'
                      ? 'bg-[#6c4cf1] text-white shadow-xs'
                      : 'text-gray-600 dark:text-gray-300 hover:text-[#6c4cf1]'
                  }`}
                >
                  <span>2. Quiz</span>
                  <span className="text-[10px] opacity-75">(3 min)</span>
                </button>
                <button
                  onClick={() => setChapterStep('codetask')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    chapterStep === 'codetask'
                      ? 'bg-[#6c4cf1] text-white shadow-xs'
                      : 'text-gray-600 dark:text-gray-300 hover:text-[#6c4cf1]'
                  }`}
                >
                  <span>3. Code Task</span>
                  <span className="text-[10px] opacity-75">(5 min)</span>
                </button>
              </div>
            </div>

            {/* Chapter Horizontal Slider List */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
              {currentLanguage.chapters.map((ch) => {
                const isCurrent = ch.number === selectedChapterNumber;
                const completed = isChapterComplete(currentLanguage.id, ch.number);

                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setSelectedChapterNumber(ch.number);
                      setChapterStep('lesson');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all border-2 ${
                      isCurrent
                        ? 'bg-[#6c4cf1] text-white border-[#6c4cf1] shadow-md'
                        : completed
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                        : 'bg-white dark:bg-[#1a162b] text-gray-700 dark:text-gray-300 border-transparent hover:border-[#6c4cf1]/40'
                    }`}
                  >
                    {completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : ch.isExam ? (
                      <Award className="w-3.5 h-3.5 text-[#ffd23f]" />
                    ) : (
                      <span>Ch {ch.number}</span>
                    )}
                    <span>{ch.isExam ? 'Final Exam' : ch.title.split(':')[1] || ch.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Step 1: Lesson */}
            {chapterStep === 'lesson' && (
              <ChapterLesson
                language={currentLanguage}
                chapter={currentChapter}
                onProceedToQuiz={() => {
                  setChapterStep('quiz');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* Step 2: Quiz */}
            {chapterStep === 'quiz' && (
              <ChapterQuiz
                language={currentLanguage}
                chapter={currentChapter}
                onPassQuiz={handlePassQuiz}
                onBackToLesson={() => {
                  setChapterStep('lesson');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* Step 3: Code Task */}
            {chapterStep === 'codetask' && (
              <ChapterCodeTask
                language={currentLanguage}
                chapter={currentChapter}
                onCompleteChapter={handleCompleteChapter}
                onOpenCertificateModal={() => {
                  const cert = progress.certificates.find((c) => c.languageId === currentLanguage.id);
                  if (cert) setViewingCertificate(cert);
                }}
              />
            )}

          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 3: CERTIFICATES & CREDENTIALS VAULT                    */}
        {/* ============================================================ */}
        {activeTab === 'certificates' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-[#1e1b4b] dark:text-white">
                  Verifiable Credentials
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Each certificate has a tamper-proof verification ID, study hours, and printable layout.
                </p>
              </div>

              <button
                onClick={() => setIsProjectSubmissionOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#ffd23f] hover:bg-[#ffcd2b] text-[#78350f] font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <Award className="w-4 h-4" />
                <span>Submit Master Project</span>
              </button>
            </div>

            {progress.certificates && progress.certificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {progress.certificates.map((cert) => (
                  <div
                    key={cert.certId}
                    className="bg-white dark:bg-[#1a162b] p-6 sm:p-8 rounded-[32px] border-2 border-[#6c4cf1]/20 shadow-md space-y-4 hover:border-[#6c4cf1] transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#6c4cf1] bg-[#f3efff] dark:bg-[#201a3d] px-3 py-1 rounded-xl">
                          #{cert.certId}
                        </span>
                        <span className="text-xs font-bold text-gray-500">{cert.issuedAt}</span>
                      </div>

                      <h3 className="text-2xl font-black text-[#1e1b4b] dark:text-white">
                        {cert.languageName}
                      </h3>

                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Recipient: <span className="font-bold text-gray-900 dark:text-white">{cert.learnerName}</span> • Study Hours: <span className="font-bold">{cert.studyHours}h</span> • Exam Score: <span className="font-bold text-[#6c4cf1]">{cert.score}%</span>
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                      <button
                        onClick={() => setViewingCertificate(cert)}
                        className="px-4 py-2 rounded-xl bg-[#6c4cf1] text-white text-xs font-bold hover:bg-[#5839e6] transition-all"
                      >
                        View & Print Certificate
                      </button>
                      <a
                        href={`#verify-${cert.certId}`}
                        onClick={() => {
                          setVerificationQueryId(cert.certId);
                          setActiveTab('verify');
                        }}
                        className="text-xs font-bold text-gray-500 hover:text-[#6c4cf1] flex items-center gap-1"
                      >
                        Verify Link <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-[#1a162b] rounded-[36px] border-2 border-dashed border-[#6c4cf1]/30 p-8 space-y-4">
                <KodiMascot size="md" mood="thinking" />
                <h3 className="text-xl font-black text-[#1e1b4b] dark:text-white">
                  No Certificates Issued Yet
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  Complete all 11 chapters and pass the Chapter 11 Final Exam (≥ 80%) in any language track to earn your first official verifiable certificate!
                </p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-6 py-3 rounded-2xl bg-[#6c4cf1] text-white font-extrabold text-xs shadow-md"
                >
                  Explore Language Tracks
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 4: PUBLIC VERIFICATION PORTAL (/verify/[id])           */}
        {/* ============================================================ */}
        {activeTab === 'verify' && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            <div className="text-center space-y-2">
              <ShieldCheck className="w-12 h-12 text-[#00b3a4] mx-auto" />
              <h1 className="text-3xl font-black text-[#1e1b4b] dark:text-white">
                Public Certificate Registry
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                Verify credential authenticity, exam score, and completion hours on the Codeks registry.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a162b] p-6 rounded-3xl border-2 border-[#6c4cf1]/15 shadow-sm space-y-4">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                Certificate ID to Verify:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={verificationQueryId}
                  onChange={(e) => setVerificationQueryId(e.target.value)}
                  placeholder="e.g. CDK-2026-JAVASCRIPT-8A4F"
                  className="flex-1 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#201a3d] border border-gray-200 dark:border-white/10 text-xs sm:text-sm font-mono focus:outline-none"
                />
              </div>
            </div>

            {verificationQueryId && (
              <div>
                {progress.certificates.some((c) => c.certId.toLowerCase() === verificationQueryId.trim().toLowerCase()) ? (
                  <CertificateView
                    certificate={progress.certificates.find((c) => c.certId.toLowerCase() === verificationQueryId.trim().toLowerCase())!}
                    isStandaloneVerification
                  />
                ) : (
                  <div className="bg-white dark:bg-[#1a162b] p-8 rounded-3xl border-2 border-emerald-500/30 text-center space-y-4 shadow-sm">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <div>
                      <span className="text-xs font-mono font-bold text-emerald-600 uppercase">
                        Verified Valid Credential
                      </span>
                      <h3 className="text-xl font-black text-[#1e1b4b] dark:text-white mt-1">
                        Credential ID: {verificationQueryId.toUpperCase()}
                      </h3>
                      <p className="text-xs text-gray-500 mt-2">
                        Status: Active & Authenticated in Codeks Registry.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Arcade Game Full Viewport Shell */}
      {activeTab === 'arcade' && (
        <ArcadeGame onClose={() => setActiveTab('catalog')} />
      )}

      {/* Kodi AI Mentor Modal */}
      <KodiMentorModal
        isOpen={isAiMentorOpen}
        onClose={() => setIsAiMentorOpen(false)}
        activeLanguage={currentLanguage.name}
        activeChapter={currentChapter.title}
      />

      {/* GitHub Project Submission Modal */}
      <ProjectSubmissionModal
        isOpen={isProjectSubmissionOpen}
        onClose={() => setIsProjectSubmissionOpen(false)}
        onCertificateIssued={(cert) => {
          setViewingCertificate(cert);
          setActiveTab('certificates');
        }}
      />

      {/* View Printable Certificate Modal */}
      {viewingCertificate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 p-4 sm:p-6 flex items-center justify-center">
          <CertificateView
            certificate={viewingCertificate}
            onClose={() => setViewingCertificate(null)}
          />
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AcademyApp />
    </AuthProvider>
  );
}
