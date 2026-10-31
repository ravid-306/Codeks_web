import React, { useState, useRef, useEffect } from 'react';
import { KodiMascot } from './KodiMascot';
import {
  X,
  Send,
  Brain,
  Search,
  Sparkles,
  ExternalLink,
  Code2,
  RefreshCw,
} from 'lucide-react';

interface KodiMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeLanguage?: string;
  activeChapter?: string;
}

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export const KodiMentorModal: React.FC<KodiMentorModalProps> = ({
  isOpen,
  onClose,
  activeLanguage = 'JavaScript',
  activeChapter = 'Basics',
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'thinking' | 'search'>('chat');

  // Multi-turn Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: `Hey there! I'm Kodi 🐾 your Codeks mentor. Ask me anything about ${activeLanguage}, debugging syntax, or mastering 10-minute concepts!`,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // High Thinking State
  const [thinkingCode, setThinkingCode] = useState(
    `function findDuplicates(arr) {\n  const seen = new Set();\n  return arr.filter(x => seen.has(x) ? true : (seen.add(x), false));\n}`
  );
  const [thinkingQuestion, setThinkingQuestion] = useState(
    'Break down the memory allocation and time complexity of this Set filter.'
  );
  const [thinkingResult, setThinkingResult] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  // Search Grounding State
  const [searchQuery, setSearchQuery] = useState(
    `latest ${activeLanguage} features and best practices for 2026`
  );
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [searchSources, setSearchSources] = useState<{ title: string; url: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  if (!isOpen) return null;

  // Send Multi-turn message
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isSending) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setInputMessage('');
    setIsSending(true);

    try {
      const res = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: newMessages,
          language: activeLanguage,
          chapterTitle: activeChapter,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'model', content: data.reply || 'Great question! Keep experimenting.' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: 'Kodi is taking a quick breather! In programming, breaking big problems into smaller functions is always a great strategy.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // High Thinking Deep Explainer
  const handleRunThinking = async () => {
    if (isThinking) return;
    setIsThinking(true);
    setThinkingResult(null);

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: thinkingCode,
          language: activeLanguage,
          question: thinkingQuestion,
        }),
      });
      const data = await res.json();
      setThinkingResult(data.analysis || 'Analysis complete.');
    } catch (err: any) {
      setThinkingResult('Failed to run high-thinking analysis. Please try again.');
    } finally {
      setIsThinking(false);
    }
  };

  // Google Search Grounding
  const handleRunSearch = async () => {
    if (isSearching) return;
    setIsSearching(true);
    setSearchResult(null);
    setSearchSources([]);

    try {
      const res = await fetch('/api/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          language: activeLanguage,
        }),
      });
      const data = await res.json();
      setSearchResult(data.result || 'No search grounding result.');
      setSearchSources(data.sources || []);
    } catch {
      setSearchResult('Search lookup encountered a temporary network glitch.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white dark:bg-[#151126] w-full max-w-3xl h-[620px] rounded-[32px] border-2 border-[#6c4cf1]/30 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-[#f9f8ff] dark:bg-[#1a162b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ffd23f]/30 flex items-center justify-center border border-[#ffd23f]">
              <KodiMascot size="sm" mood="thinking" className="scale-75" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[#1e1b4b] dark:text-white">Kodi AI Mentor</h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#6c4cf1] text-white">
                  Gemini 3.8 & 4
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Context: {activeLanguage} • {activeChapter}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 pt-3 border-b border-gray-200 dark:border-white/10 gap-2 bg-[#f9f8ff] dark:bg-[#1a162b]">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl font-bold text-xs transition-all border-b-2 ${
              activeTab === 'chat'
                ? 'bg-white dark:bg-[#151126] text-[#6c4cf1] dark:text-white border-[#6c4cf1]'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-white border-transparent'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ff7eb6]" />
            <span>Multi-turn Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('thinking')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl font-bold text-xs transition-all border-b-2 ${
              activeTab === 'thinking'
                ? 'bg-white dark:bg-[#151126] text-[#6c4cf1] dark:text-white border-[#6c4cf1]'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-white border-transparent'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-[#6c4cf1]" />
            <span>High Thinking Mode (Deep Reasoning)</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl font-bold text-xs transition-all border-b-2 ${
              activeTab === 'search'
                ? 'bg-white dark:bg-[#151126] text-[#6c4cf1] dark:text-white border-[#6c4cf1]'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-white border-transparent'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-[#00b3a4]" />
            <span>2026 Search Grounding</span>
          </button>
        </div>

        {/* Tab 1: Multi-turn Chat */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden p-6 bg-white dark:bg-[#151126]">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {m.role === 'model' && (
                    <div className="w-8 h-8 rounded-xl bg-[#6c4cf1]/10 flex items-center justify-center shrink-0">
                      <KodiMascot size="sm" mood="happy" className="scale-60" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-[#6c4cf1] text-white rounded-br-none shadow-sm'
                        : 'bg-[#f3efff] dark:bg-[#201a3d] text-[#1e1b4b] dark:text-[#f3efff] rounded-bl-none border border-[#6c4cf1]/15'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex items-center gap-2 text-xs text-gray-500 italic p-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#6c4cf1]" />
                  <span>Kodi is formulating a friendly answer...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="py-2 flex items-center gap-2 overflow-x-auto text-[11px] font-bold">
              <button
                onClick={() => handleSendMessage(`How does memory work in ${activeLanguage}?`)}
                className="px-3 py-1.5 rounded-xl bg-[#f3efff] dark:bg-[#201a3d] text-[#6c4cf1] dark:text-[#c4b5fd] whitespace-nowrap hover:bg-[#6c4cf1]/20 transition-colors"
              >
                🧠 How does memory work?
              </button>
              <button
                onClick={() => handleSendMessage(`What are the most common beginner traps in ${activeLanguage}?`)}
                className="px-3 py-1.5 rounded-xl bg-[#f3efff] dark:bg-[#201a3d] text-[#6c4cf1] dark:text-[#c4b5fd] whitespace-nowrap hover:bg-[#6c4cf1]/20 transition-colors"
              >
                ⚠️ Common beginner traps?
              </button>
              <button
                onClick={() => handleSendMessage('Give me a quick analogy for recursion!')}
                className="px-3 py-1.5 rounded-xl bg-[#f3efff] dark:bg-[#201a3d] text-[#6c4cf1] dark:text-[#c4b5fd] whitespace-nowrap hover:bg-[#6c4cf1]/20 transition-colors"
              >
                💡 Recursion analogy
              </button>
            </div>

            {/* Input Bar */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Ask Kodi anything about ${activeLanguage}...`}
                className="flex-1 bg-gray-50 dark:bg-[#201a3d] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#6c4cf1]"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isSending || !inputMessage.trim()}
                className="px-5 py-3 rounded-2xl bg-[#6c4cf1] hover:bg-[#5839e6] disabled:opacity-40 text-white font-extrabold text-xs transition-all shadow-md active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: High Thinking Deep Reasoning */}
        {activeTab === 'thinking' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white dark:bg-[#151126]">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#6c4cf1]/10 to-[#ffd23f]/10 border border-[#6c4cf1]/20 flex items-start gap-3">
              <Brain className="w-5 h-5 text-[#6c4cf1] shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-extrabold text-[#6c4cf1] uppercase tracking-wider block">
                  High-Reasoning Thinking Mode Activated
                </span>
                <p className="text-gray-600 dark:text-gray-300 mt-0.5">
                  Powered by <span className="font-mono font-bold">gemini-4-argon</span> with{' '}
                  <span className="font-mono font-bold">ThinkingLevel.HIGH</span> for architectural execution traces.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Code Snippet to Analyze:</label>
              <textarea
                value={thinkingCode}
                onChange={(e) => setThinkingCode(e.target.value)}
                rows={4}
                className="w-full bg-[#120f21] text-emerald-400 font-mono text-xs p-3.5 rounded-2xl border border-gray-800 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Question / Focus Area:</label>
              <input
                type="text"
                value={thinkingQuestion}
                onChange={(e) => setThinkingQuestion(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#201a3d] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-2.5 text-xs text-gray-900 dark:text-white"
              />
            </div>

            <button
              onClick={handleRunThinking}
              disabled={isThinking}
              className="w-full py-3 rounded-2xl bg-[#6c4cf1] hover:bg-[#5839e6] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isThinking ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Reasoning in Progress (High Thinking Level)...</span>
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  <span>Run Deep Reasoning Breakdown</span>
                </>
              )}
            </button>

            {thinkingResult && (
              <div className="p-5 rounded-2xl bg-[#f8f6ff] dark:bg-[#201a3d] border border-[#6c4cf1]/20 text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap font-sans">
                {thinkingResult}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Google Search Grounding */}
        {activeTab === 'search' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white dark:bg-[#151126]">
            <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-300 dark:border-teal-800 flex items-start gap-3">
              <Search className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-extrabold text-teal-700 dark:text-teal-300 uppercase tracking-wider block">
                  Search Grounding Enabled
                </span>
                <p className="text-gray-600 dark:text-gray-300 mt-0.5">
                  Uses <span className="font-mono font-bold">gemini-3.8-flash</span> with{' '}
                  <span className="font-mono font-bold">googleSearch</span> grounding to query verified 2026 documentation.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search language changes, releases, or docs..."
                className="flex-1 bg-gray-50 dark:bg-[#201a3d] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-xs text-gray-900 dark:text-white focus:outline-none"
              />
              <button
                onClick={handleRunSearch}
                disabled={isSearching}
                className="px-5 py-3 rounded-2xl bg-[#00b3a4] hover:bg-[#0f766e] text-white font-extrabold text-xs transition-all shadow-md"
              >
                {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Search'}
              </button>
            </div>

            {searchResult && (
              <div className="p-5 rounded-2xl bg-[#f8f6ff] dark:bg-[#201a3d] border border-[#00b3a4]/20 text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                {searchResult}
              </div>
            )}

            {searchSources.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-black uppercase text-gray-500">Grounded Source Links:</p>
                <div className="grid grid-cols-1 gap-2">
                  {searchSources.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold text-[#3a86ff] hover:underline"
                    >
                      <span className="truncate">{s.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
