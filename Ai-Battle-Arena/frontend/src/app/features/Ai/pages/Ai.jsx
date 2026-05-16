import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { ChatInput } from '../components/ChatInput';
import { ResponseCard } from '../components/ResponseCard';
import { JudgePanel } from '../components/JudgePanel';
import { EmptyState } from '../components/EmptyState';
import { useBattle } from '../hooks/useBattle';

let idSeq = 1;

export default function Ai() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    status,
    model1Text,
    model2Text,
    model1Done,
    model2Done,
    judgeData,
    currentResponse,
    triggerBattle,
    reset,
  } = useBattle();

  const bottomRef = useRef(null);

  

  useEffect(() => {
    if (judgeData) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [judgeData]);

  const handleSubmit = useCallback((query) => {
    const id = idSeq++;
    const title = query.length > 48 ? query.slice(0, 48) + '…' : query;
    setConversations(prev => [{ id, title, query, timestamp: new Date() }, ...prev]);
    setActiveId(id);
    setCurrentQuery(query);
    triggerBattle(query);
  }, [triggerBattle]);

  const handleNew = useCallback(() => {
    reset();
    setActiveId(null);
    setCurrentQuery('');
    setSidebarOpen(false);
  }, [reset]);

  const handleSelect = useCallback((id) => {
    const conv = conversations.find(c => c.id === id);
    if (!conv) return;
    setActiveId(id);
    setCurrentQuery(conv.query);
    setSidebarOpen(false);
    triggerBattle(conv.query);
  }, [conversations, triggerBattle]);

  const isLoading = status === 'loading';
  const isTyping = status === 'typing';
  const showContent = status !== 'idle';

  const model1Typing = isTyping && !model1Done;
  const model2Typing = isTyping && !model2Done;

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelect}
        onNew={handleNew}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main column */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-zinc-800/70 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <Menu size={18} />
          </button>
          <span className="text-[13px] font-semibold text-zinc-300">AI Battle Arena</span>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {!showContent ? (
            <div className="flex flex-col min-h-full">
              <EmptyState onQuery={handleSubmit} />
            </div>
          ) : (
            <div className="max-w-5xl mx-auto w-full px-4 py-8 space-y-5">
              {/* User query bubble */}
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="flex justify-end"
              >
                <div className="max-w-[65%] bg-zinc-800 rounded-2xl rounded-tr-md px-4 py-3">
                  <p className="text-[13.5px] text-zinc-200 leading-relaxed">{currentQuery}</p>
                </div>
              </motion.div>

              {/* Status indicator */}
              {(isLoading || isTyping) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 px-1"
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-[12px] text-zinc-600">
                    {isLoading ? 'Generating responses…' : 'Streaming responses…'}
                  </span>
                </motion.div>
              )}

              {/* Response grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ResponseCard
                  model={currentResponse?.model1}
                  text={model1Text}
                  isLoading={isLoading}
                  isTyping={model1Typing}
                />
                <ResponseCard
                  model={currentResponse?.model2}
                  text={model2Text}
                  isLoading={isLoading}
                  isTyping={model2Typing}
                />
              </div>

              {/* Judge panel */}
              <AnimatePresence>
                {judgeData && (
                  <JudgePanel
                    data={judgeData}
                    model1Name={currentResponse?.model1?.name}
                    model2Name={currentResponse?.model2?.name}
                  />
                )}
              </AnimatePresence>

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Sticky input */}
        <ChatInput
          onSubmit={handleSubmit}
          disabled={isLoading || isTyping}
        />
      </div>
    </div>
  );
}
