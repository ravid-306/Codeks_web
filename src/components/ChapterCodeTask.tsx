import React, { useState } from 'react';
import { Chapter, Language } from '../types/curriculum';
import { runCodeInSandbox, normalizeCode, ExecutionResult } from '../utils/codeSandbox';
import { KodiMascot } from './KodiMascot';
import { sound } from '../utils/soundEffects';
import {
  Play,
  CheckSquare,
  Sparkles,
  RotateCcw,
  Terminal,
  Eye,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChapterCodeTaskProps {
  language: Language;
  chapter: Chapter;
  onCompleteChapter: () => void;
  onOpenCertificateModal?: () => void;
}

export const ChapterCodeTask: React.FC<ChapterCodeTaskProps> = ({
  language,
  chapter,
  onCompleteChapter,
  onOpenCertificateModal,
}) => {
  const [code, setCode] = useState(chapter.codeTask.starterCode);
  const [output, setOutput] = useState<string>('');
  const [tableData, setTableData] = useState<Record<string, any>[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'console' | 'preview'>('console');
  const [testResults, setTestResults] = useState<{ desc: string; pass: boolean }[] | null>(null);
  const [allPassed, setAllPassed] = useState(false);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [isRequestingHint, setIsRequestingHint] = useState(false);

  const isHtml = language.id === 'html' || language.id === 'css';

  const handleRunCode = async () => {
    setIsRunning(true);
    const result: ExecutionResult = await runCodeInSandbox(language.id, code);
    setIsRunning(false);
    if (result.tableData) {
      setTableData(result.tableData);
    } else {
      setTableData(null);
    }
    setOutput(result.error ? result.error : result.output);
  };

  const handleCheckCode = async () => {
    setIsRunning(true);
    const result: ExecutionResult = await runCodeInSandbox(language.id, code);
    setIsRunning(false);

    if (result.tableData) setTableData(result.tableData);
    setOutput(result.error ? result.error : result.output);

    const normalizedUserCode = normalizeCode(code);
    const evalResults = chapter.codeTask.testCases.map((tc) => {
      try {
        const pass = tc.validate(code, result.output);
        return {
          desc: tc.description,
          pass: typeof pass === 'boolean' ? pass : pass.pass,
        };
      } catch {
        return { desc: tc.description, pass: false };
      }
    });

    setTestResults(evalResults);
    const passed = evalResults.every((r) => r.pass);

    if (passed) {
      setAllPassed(true);
      sound.playFanfare();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#6c4cf1', '#ff7eb6', '#ffd23f', '#00b3a4', '#3a86ff'],
        });
      } catch {}
      onCompleteChapter();
    } else {
      sound.playIncorrect();
    }
  };

  const handleRequestHint = async () => {
    if (isRequestingHint) return;
    setIsRequestingHint(true);
    setHintMessage(null);

    try {
      const res = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: language.name,
          taskDescription: chapter.codeTask.instructions,
          userCode: code,
          testFailures: testResults ? testResults.filter((t) => !t.pass).map((t) => t.desc).join(', ') : '',
        }),
      });
      const data = await res.json();
      setHintMessage(data.hint || chapter.codeTask.hints[0] || 'Check the required syntax and parameters.');
    } catch {
      setHintMessage(chapter.codeTask.hints[0] || 'Review your variable declarations and output formatting.');
    } finally {
      setIsRequestingHint(false);
    }
  };

  const handleResetCode = () => {
    setCode(chapter.codeTask.starterCode);
    setOutput('');
    setTableData(null);
    setTestResults(null);
    setAllPassed(false);
    setHintMessage(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 5-Min Task Header */}
      <div className="bg-white dark:bg-[#1a162b] p-6 rounded-3xl border-2 border-[#6c4cf1]/15 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs uppercase font-black px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: language.badgeColor }}
              >
                Task 3/3 • {language.name}
              </span>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">~5 minutes</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1e1b4b] dark:text-white">
              {chapter.codeTask.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetCode}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 text-gray-700 dark:text-gray-200 text-xs font-bold transition-all"
              title="Reset code to starter snippet"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleRequestHint}
              disabled={isRequestingHint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700 text-xs font-bold transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isRequestingHint ? 'Thinking...' : 'Get Kodi Hint'}</span>
            </button>
          </div>
        </div>

        {/* Task Instructions */}
        <div className="p-4 rounded-2xl bg-[#f8f6ff] dark:bg-[#201a3d] border border-[#6c4cf1]/20 text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
          <p className="font-bold text-[#6c4cf1] dark:text-[#c4b5fd] mb-1">Instructions:</p>
          {chapter.codeTask.instructions}
        </div>

        {/* Hint Box (if triggered) */}
        {hintMessage && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 text-amber-900 dark:text-amber-100 text-xs sm:text-sm flex items-start gap-3 animate-fadeIn">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold uppercase text-[10px] tracking-wider text-amber-700 dark:text-amber-300 block">
                Kodi's Directional Hint (No Spoiling!)
              </span>
              <p className="mt-0.5 font-medium">{hintMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* Code Editor & Output Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Area */}
        <div className="bg-[#141224] rounded-3xl border-2 border-gray-900 shadow-xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-[#0e0c1a]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
              <span className="text-xs text-gray-400 font-mono font-semibold ml-2">
                main.{language.id === 'python' ? 'py' : language.id === 'html' ? 'html' : language.id === 'sql' ? 'sql' : 'js'}
              </span>
            </div>
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
              {language.name} Sandbox
            </span>
          </div>

          <div className="relative flex-1 min-h-[300px]">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-5 font-mono text-xs sm:text-sm bg-transparent text-emerald-400 focus:outline-none resize-none leading-relaxed selection:bg-[#ff7eb6]/30"
              spellCheck={false}
              rows={14}
            />
          </div>

          {/* Action Bar */}
          <div className="p-4 bg-[#0e0c1a] border-t border-gray-800 flex items-center justify-between gap-3">
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span>Run Code</span>
            </button>

            <button
              onClick={handleCheckCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#6c4cf1] hover:bg-[#5b3ae4] text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Check & Validate</span>
            </button>
          </div>
        </div>

        {/* Console / Output & Tests Area */}
        <div className="bg-white dark:bg-[#1a162b] rounded-3xl border-2 border-[#6c4cf1]/15 shadow-sm overflow-hidden flex flex-col">
          {/* Output Tabs */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-white/10 bg-[#f9f8ff] dark:bg-[#151126]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('console')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'console'
                    ? 'bg-[#6c4cf1] text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-[#6c4cf1]'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Console Output</span>
              </button>
              {isHtml && (
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-[#6c4cf1] text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-[#6c4cf1]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Web Preview</span>
                </button>
              )}
            </div>
            <span className="text-[11px] font-bold text-gray-500 uppercase">Interactive Terminal</span>
          </div>

          <div className="p-5 flex-1 min-h-[220px] flex flex-col justify-between">
            {activeTab === 'preview' && isHtml ? (
              <div className="w-full h-full border border-gray-200 dark:border-white/10 rounded-2xl p-4 bg-white overflow-auto text-black">
                <div dangerouslySetInnerHTML={{ __html: code }} />
              </div>
            ) : (
              <div className="space-y-4 font-mono text-xs text-gray-800 dark:text-gray-200">
                {/* Table Data for SQL */}
                {tableData && tableData.length > 0 && (
                  <div className="overflow-x-auto border border-gray-200 dark:border-white/10 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f3efff] dark:bg-[#201a3d] border-b border-gray-200 dark:border-white/10">
                        <tr>
                          {Object.keys(tableData[0]).map((col) => (
                            <th key={col} className="p-2 font-bold text-[#6c4cf1] dark:text-[#c4b5fd]">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((row, idx) => (
                          <tr key={idx} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5">
                            {Object.values(row).map((val: any, cIdx) => (
                              <td key={cIdx} className="p-2">
                                {typeof val === 'boolean' ? (val ? 'TRUE' : 'FALSE') : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="p-4 bg-gray-50 dark:bg-[#120f21] rounded-2xl border border-gray-200 dark:border-white/10 min-h-[90px] whitespace-pre-wrap">
                  {output || (
                    <span className="text-gray-400 font-sans italic">
                      Click "Run Code" to inspect output or "Check & Validate" to submit.
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Test Validators Checklist */}
            {testResults && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 space-y-2">
                <p className="text-xs font-black uppercase tracking-wider text-gray-500">Validation Tests:</p>
                {testResults.map((t, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold ${
                      t.pass
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                        : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300'
                    }`}
                  >
                    {t.pass ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                    <span>{t.desc}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Celebration Bar */}
      {allPassed && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-[#6c4cf1]/15 to-emerald-500/15 border-2 border-emerald-500/40 text-center space-y-3 animate-fadeIn">
          <KodiMascot mood="cheering" size="sm" />
          <h3 className="text-xl font-black text-emerald-900 dark:text-emerald-200">
            Chapter Complete! 10-Minute Goal Achieved!
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            Your progress has been recorded. Streak retained, study time logged!
          </p>
          {chapter.isExam && (
            <div className="pt-2">
              <button
                onClick={onOpenCertificateModal}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#ffd23f] text-[#78350f] font-black text-sm shadow-md hover:bg-[#ffcd2b] transition-all"
              >
                <Award className="w-4 h-4" />
                <span>View & Print Your Official Certificate</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
