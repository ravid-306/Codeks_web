import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { KodiMascot } from './KodiMascot';
import { sound } from '../utils/soundEffects';
import {
  Flame,
  Clock,
  Award,
  Sparkles,
  Gamepad2,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  BookOpen,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAiMentor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAiMentor,
}) => {
  const { progress } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.isMuted);

  useEffect(() => {
    // Check initial dark mode from system or html
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isRootDark = document.documentElement.classList.contains('dark');
    if (isRootDark || prefersDark) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const studyHours = (progress.studyMinutes / 60).toFixed(1);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#151126]/90 backdrop-blur-md border-b-2 border-[#6c4cf1]/15 dark:border-white/10 transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div
          onClick={() => onSelectTab('catalog')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-[#f3efff] dark:bg-[#201a3d] border-2 border-[#6c4cf1] flex items-center justify-center p-0.5 shadow-sm group-hover:scale-105 transition-transform">
              <KodiMascot size="sm" mood="happy" className="scale-75" />
            </div>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#ffd23f] border-2 border-white dark:border-[#151126] rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-2xl tracking-tight text-[#1e1b4b] dark:text-white">
                Code<span className="text-[#6c4cf1]">ks</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#ff7eb6]/20 text-[#ff4382] border border-[#ff7eb6]/40">
                Academy
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">10-Minute Interactive Coding</p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#f3efff] dark:bg-[#1f1938] p-1.5 rounded-2xl border border-[#6c4cf1]/20">
          <button
            onClick={() => onSelectTab('catalog')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              currentTab === 'catalog'
                ? 'bg-[#6c4cf1] text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:text-[#6c4cf1] dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Languages
          </button>

          <button
            onClick={() => onSelectTab('arcade')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              currentTab === 'arcade'
                ? 'bg-[#3a86ff] text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:text-[#3a86ff] dark:hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-[#ffd23f]" />
            Syntax Sprint
          </button>

          <button
            onClick={() => onSelectTab('certificates')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              currentTab === 'certificates'
                ? 'bg-[#ff7eb6] text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:text-[#ff7eb6] dark:hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            Certificates
            {progress.certificates?.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-[#ff4382] text-xs font-black flex items-center justify-center">
                {progress.certificates.length}
              </span>
            )}
          </button>
        </nav>

        {/* Right Action Clusters */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Kodi AI Mentor Button */}
          <button
            onClick={onOpenAiMentor}
            className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-gradient-to-r from-[#6c4cf1]/15 to-[#ff7eb6]/15 hover:from-[#6c4cf1]/25 hover:to-[#ff7eb6]/25 border-2 border-[#6c4cf1]/40 text-[#6c4cf1] dark:text-[#c4b5fd] text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95"
            title="Chat with Kodi AI Mentor & Gemini"
          >
            <Sparkles className="w-4 h-4 text-[#ff7eb6] animate-spin" style={{ animationDuration: '6s' }} />
            <span className="hidden sm:inline">Ask Kodi</span>
          </button>

          {/* Streak Badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#ffd23f]/20 border border-[#ffd23f]/60 text-[#b45309] dark:text-[#ffd23f] text-xs sm:text-sm font-extrabold select-none shadow-sm"
            title={`${progress.streak} Day Learning Streak!`}
          >
            <Flame className="w-4 h-4 text-[#f59e0b] fill-[#f59e0b] animate-bounce" style={{ animationDuration: '2s' }} />
            <span>{progress.streak}d</span>
          </div>

          {/* Study Hours */}
          <div
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#00b3a4]/15 border border-[#00b3a4]/40 text-[#0f766e] dark:text-[#5eead4] text-xs sm:text-sm font-extrabold select-none"
            title="Total Study Hours"
          >
            <Clock className="w-4 h-4 text-[#00b3a4]" />
            <span>{studyHours}h</span>
          </div>

          {/* Mute Toggle */}
          <button
            onClick={toggleSound}
            className="w-10 h-10 rounded-2xl bg-[#f3efff] dark:bg-[#1f1938] border border-[#6c4cf1]/20 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-[#6c4cf1] transition-all"
            title={isMuted ? 'Unmute procedural sound fx' : 'Mute sound fx'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-[#6c4cf1]" />}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 rounded-2xl bg-[#f3efff] dark:bg-[#1f1938] border border-[#6c4cf1]/20 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-[#ffd23f] transition-all"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-[#ffd23f]" /> : <Moon className="w-4 h-4 text-[#6c4cf1]" />}
          </button>



        </div>
      </div>
    </header>
  );
};
