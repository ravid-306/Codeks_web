import React, { useState, useEffect, useRef } from 'react';
import { Chapter, Language } from '../types/curriculum';
import { generateRandomQuizRound, PreparedQuestion } from '../utils/quizRandomizer';
import { KodiMascot, KodiMood } from './KodiMascot';
import { sound } from '../utils/soundEffects';
import {
  Timer,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Flame,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChapterQuizProps {
  language: Language;
  chapter: Chapter;
  onPassQuiz: (score: number) => void;
  onBackToLesson: () => void;
}

export const ChapterQuiz: React.FC<ChapterQuizProps> = ({
  language,
  chapter,
  onPassQuiz,
  onBackToLesson,
}) => {
  const [questions, setQuestions] = useState<PreparedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [previousQuestionIds, setPreviousQuestionIds] = useState<string[]>([]);
  const [kodiMood, setKodiMood] = useState<KodiMood>('thinking');
  const [kodiSpeech, setKodiSpeech] = useState<string | undefined>('You’ve got this! Read carefully.');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize a new randomized round
  const startNewRound = (avoidIds: string[] = []) => {
    const round = generateRandomQuizRound(chapter.questionBank, avoidIds);
    setQuestions(round);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setTimeLeft(20);
    setIsQuizComplete(false);
    setKodiMood('thinking');
    setKodiSpeech('5 questions, 20s each. Let’s go!');
    setPreviousQuestionIds((prev) => [...prev, ...round.map((q) => q.id)]);
  };

  useEffect(() => {
    startNewRound([]);
  }, [chapter.id]);

  // 20-Second Question Timer
  useEffect(() => {
    if (isQuizComplete || isAnswered || questions.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        if (prev <= 5) {
          sound.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isAnswered, isQuizComplete, questions]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setSelectedOption('__TIMEOUT__');
    sound.playIncorrect();
    setKodiMood('oops');
    setKodiSpeech('Time ran out! Keep your rhythm on the next one.');
  };

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedOption(option);
    setIsAnswered(true);

    const currentQ = questions[currentIndex];
    const isCorrect = option === currentQ.correctAnswer;

    if (isCorrect) {
      sound.playCorrect();
      setScore((prev) => prev + 1);
      setKodiMood('cheering');
      setKodiSpeech('Spot on! Excellent logic!');
    } else {
      sound.playIncorrect();
      setKodiMood('oops');
      setKodiSpeech(currentQ.explanation);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(20);
      setKodiMood('thinking');
      setKodiSpeech('Focus and take your time.');
    } else {
      // Quiz finished
      const finalScore = score + (selectedOption === questions[currentIndex]?.correctAnswer ? 0 : 0);
      setIsQuizComplete(true);
      if (finalScore >= 4) {
        sound.playFanfare();
        setKodiMood('happy');
        setKodiSpeech('4+ out of 5! Chapter Quiz Passed with flying colors!');
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#6c4cf1', '#ff7eb6', '#ffd23f', '#00b3a4'],
          });
        } catch {
          // confetti fallback
        }
      } else {
        setKodiMood('oops');
        setKodiSpeech('You need 4/5 to pass. Kodi believes in you—try again with new questions!');
      }
    }
  };

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-[#1a162b] rounded-3xl border border-gray-200 dark:border-white/10">
        <KodiMascot mood="thinking" />
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">Shuffling fresh question bank...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const passed = score >= 4;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Quiz Progress & Timer Header */}
      <div className="bg-white dark:bg-[#1a162b] p-5 rounded-3xl border-2 border-[#6c4cf1]/15 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-black uppercase px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: language.badgeColor }}
            >
              Quiz • {chapter.title}
            </span>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              Question {currentIndex + 1} of 5
            </span>
          </div>

          {!isQuizComplete && (
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-black transition-colors ${
                timeLeft <= 5
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-[#f3efff] dark:bg-[#201a3d] text-[#6c4cf1] dark:text-[#c4b5fd]'
              }`}
            >
              <Timer className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>
          )}
        </div>

        {/* 20-second visual countdown bar */}
        {!isQuizComplete && (
          <div className="w-full bg-gray-100 dark:bg-white/10 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 5 ? 'bg-red-500' : 'bg-[#6c4cf1]'
              }`}
              style={{ width: `${(timeLeft / 20) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Kodi Mascot Reaction Bar */}
      <div className="flex items-center justify-center py-2">
        <KodiMascot mood={kodiMood} size="sm" message={kodiSpeech} />
      </div>

      {!isQuizComplete ? (
        /* Question Card */
        <div className="bg-white dark:bg-[#1a162b] p-6 sm:p-8 rounded-[28px] border-2 border-[#6c4cf1]/15 shadow-sm space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-[#6c4cf1] dark:text-[#c4b5fd]">
                {currentQ.type.replace('-', ' ')}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#1e1b4b] dark:text-white pt-2 leading-relaxed">
                {currentQ.prompt}
              </h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 uppercase">
              {currentQ.difficulty}
            </span>
          </div>

          {/* Optional Code Snippet */}
          {currentQ.codeSnippet && (
            <div className="rounded-2xl overflow-hidden border-2 border-gray-900 bg-[#161426] text-gray-100 p-4 font-mono text-xs sm:text-sm">
              <pre className="overflow-x-auto">
                <code>{currentQ.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === currentQ.correctAnswer;

              let btnStyle =
                'bg-[#f8f6ff] dark:bg-[#201a3d] border-2 border-transparent text-[#1e1b4b] dark:text-white hover:border-[#6c4cf1]/40';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle =
                    'bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-extrabold shadow-sm';
                } else if (isSelected) {
                  btnStyle =
                    'bg-red-50 dark:bg-red-950/40 border-2 border-red-500 text-red-900 dark:text-red-100 font-bold';
                } else {
                  btnStyle = 'opacity-40 border-transparent';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-between group active:scale-[0.99] ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-white dark:bg-[#2a2250] flex items-center justify-center font-black text-xs text-[#6c4cf1] dark:text-white shadow-xs">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </div>
                  {isAnswered && (
                    <div>
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* One-Line Explanation on Answered */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-[#f3efff] dark:bg-[#201a3d] border border-[#6c4cf1]/30 flex items-start gap-3 text-xs sm:text-sm">
              <HelpCircle className="w-4 h-4 text-[#6c4cf1] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#6c4cf1] dark:text-[#c4b5fd]">Explanation:</p>
                <p className="text-gray-700 dark:text-gray-200 mt-0.5">{currentQ.explanation}</p>
              </div>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#6c4cf1] hover:bg-[#5939e6] text-white font-extrabold text-sm shadow-md transition-all active:scale-95"
              >
                <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'See Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Complete / Results Screen */
        <div className="bg-white dark:bg-[#1a162b] p-8 rounded-[32px] border-2 border-[#6c4cf1]/20 shadow-xl text-center space-y-6">
          <div className="inline-block p-4 rounded-3xl bg-[#f3efff] dark:bg-[#201a3d]">
            <KodiMascot mood={passed ? 'happy' : 'oops'} size="md" />
          </div>

          <div>
            <h2 className="text-3xl font-black text-[#1e1b4b] dark:text-white">
              {passed ? 'Quiz Passed!' : 'Almost There!'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              You scored <span className="font-extrabold text-[#6c4cf1] text-lg">{score}</span> out of 5
              ({(score / 5) * 100}%). Pass criteria: 4/5 (80%).
            </p>
          </div>

          {passed ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm font-semibold max-w-md mx-auto">
                🎉 Great work! You’ve unlocked the interactive Code Task sandbox!
              </div>
              <button
                onClick={() => onPassQuiz(score)}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#6c4cf1] hover:bg-[#5839e6] text-white font-black text-base shadow-lg shadow-[#6c4cf1]/30 transition-all active:scale-95"
              >
                <span>Proceed to Step 3: Code Task (5 min)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm max-w-md mx-auto">
                Review the core lesson and try a brand new 5-question round! Repeats from this round will be skipped.
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={onBackToLesson}
                  className="px-6 py-3 rounded-2xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 text-gray-800 dark:text-gray-200 font-bold text-sm transition-all"
                >
                  Review Lesson
                </button>
                <button
                  onClick={() => startNewRound(previousQuestionIds)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#6c4cf1] hover:bg-[#5839e6] text-white font-black text-sm shadow-md transition-all active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try New Random Round</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
