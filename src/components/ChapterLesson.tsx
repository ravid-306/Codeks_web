import React, { useState } from 'react';
import { Chapter, Language } from '../types/curriculum';
import { KodiMascot } from './KodiMascot';
import { Check, Copy, ArrowRight, Lightbulb, Clock, CheckCircle2 } from 'lucide-react';

interface ChapterLessonProps {
  language: Language;
  chapter: Chapter;
  onProceedToQuiz: () => void;
}

export const ChapterLesson: React.FC<ChapterLessonProps> = ({
  language,
  chapter,
  onProceedToQuiz,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(chapter.lesson.codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 2-Minute Flow Indicator */}
      <div className="flex items-center justify-between bg-white dark:bg-[#1a162b] px-6 py-4 rounded-3xl border-2 border-[#6c4cf1]/15 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#ffd23f]/30 flex items-center justify-center text-[#b45309] font-black text-sm">
            1
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#1e1b4b] dark:text-white">
              Step 1: Core Concept
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Target reading time: ~2 minutes</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#6c4cf1] dark:text-[#a78bfa] bg-[#f3efff] dark:bg-[#201a3d] px-3.5 py-1.5 rounded-2xl border border-[#6c4cf1]/20">
          <Clock className="w-3.5 h-3.5" />
          <span>2 min flow</span>
        </div>
      </div>

      {/* Main Concept Card */}
      <div className="bg-white dark:bg-[#1a162b] p-6 sm:p-8 rounded-[28px] border-2 border-[#6c4cf1]/15 shadow-sm space-y-6">
        <div>
          <span
            className="inline-block text-xs uppercase font-black px-3.5 py-1 rounded-full text-white mb-3 shadow-sm"
            style={{ backgroundColor: language.badgeColor }}
          >
            {language.name} • {chapter.title}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1e1b4b] dark:text-white tracking-tight leading-snug">
            {chapter.lesson.overview}
          </h2>
        </div>

        {/* Key Takeaways */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {chapter.lesson.keyPoints.map((point, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#f3efff]/70 dark:bg-[#201a3d]/70 border border-[#6c4cf1]/15 text-xs sm:text-sm text-gray-800 dark:text-gray-200"
            >
              <CheckCircle2 className="w-4 h-4 text-[#00b3a4] shrink-0 mt-0.5" />
              <span>{point}</span>
            </div>
          ))}
        </div>

        {/* Code Example Showcase */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff7eb6]" />
              Syntax in Action
            </h4>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-[#6c4cf1] dark:hover:text-white transition-colors bg-gray-100 dark:bg-[#261f46] px-3 py-1.5 rounded-xl"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden border-2 border-gray-900 bg-[#161426] text-gray-100 p-5 font-mono text-xs sm:text-sm leading-relaxed shadow-inner">
            <pre className="overflow-x-auto">
              <code>{chapter.lesson.codeExample}</code>
            </pre>
          </div>

          {/* Explanation */}
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-[#f9f8ff] dark:bg-[#1a162b] p-4 rounded-2xl border border-gray-200 dark:border-white/5">
            {chapter.lesson.codeExplanation}
          </p>
        </div>

        {/* Kodi's Pro Tip Card */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#ffd23f]/20 via-[#ff7eb6]/15 to-[#6c4cf1]/15 border-2 border-[#ffd23f]/50">
          <KodiMascot size="sm" mood="thinking" />
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 font-black text-xs uppercase tracking-wide text-[#b45309] dark:text-[#fde047]">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Kodi's Pro Tip</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-100 mt-1">
              {chapter.lesson.proTip}
            </p>
          </div>
        </div>
      </div>

      {/* Next Step Action Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onProceedToQuiz}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#6c4cf1] hover:bg-[#5839e6] text-white font-extrabold text-base shadow-lg shadow-[#6c4cf1]/25 hover:shadow-xl transition-all active:scale-95 group"
        >
          <span>Ready for 3-Min Quiz</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
