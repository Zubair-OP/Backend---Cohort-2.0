import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../hook/useChat';
import ChatMessage from './ChatMessage';

const MAX_CHARS = 500;
const QUICK_PROMPTS = [
  'What sizes are available?',
  'What is your return policy?',
  'How long does shipping take?',
];

function ChatIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 8V4m0 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5 8h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" />
      <circle cx="8.5" cy="14" r="1.2" fill="currentColor" />
      <circle cx="15.5" cy="14" r="1.2" fill="currentColor" />
      <path d="M9 17h6" />
      <path d="M2 13v3M22 13v3" />
    </svg>
  );
}

function CloseIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function SendIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function ChatWidget() {
  const { isOpen, messages, isStreaming, toggleOpen, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isStreaming]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput('');
  };

  const handleQuickPrompt = (prompt) => {
    if (isStreaming) return;
    sendMessage(prompt);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        onClick={toggleOpen}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-bg-dark text-white shadow-2xl transition-all duration-600 ease-premium hover:scale-105 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] active:scale-95"
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>

      {isOpen ? (
        <div className="fixed bottom-24 left-4 right-4 z-50 flex h-[70vh] max-h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-4xl border border-border-light bg-white shadow-[0_20px_60px_-10px_rgba(0,0,0,0.15)] sm:left-auto sm:h-[600px] sm:w-96">
          <div className="flex-none bg-bg-dark px-5 py-4 text-white">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <h2 className="text-sm font-semibold tracking-wide">Snitch Assistant</h2>
            </div>
            <p className="mt-1.5 text-[10px] leading-tight text-white/50">
              Ask about products, orders, shipping, or returns.
            </p>
          </div>

          <div className="flex-none border-b border-border-light bg-cream/50 px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleQuickPrompt(prompt)}
                  disabled={isStreaming}
                  className="rounded-full border border-border-light bg-white px-3 py-1.5 text-[11px] font-medium text-text-secondary transition-all duration-600 ease-premium hover:border-bg-dark hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-white px-4 py-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isStreaming={isStreaming}
              />
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="flex-none border-t border-border-light bg-cream/30 p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                onKeyDown={handleKeyDown}
                rows={1}
                maxLength={MAX_CHARS}
                placeholder="Ask about products, orders, returns..."
                className="max-h-24 flex-1 resize-none rounded-2xl border border-border-light bg-white px-4 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-muted transition-all duration-600 ease-premium focus:border-accent focus:ring-2 focus:ring-accent/10"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                aria-label="Send message"
                className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-bg-dark text-white transition-all duration-600 ease-premium hover:bg-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <SendIcon />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-text-muted">
              <span>Shift + Enter for a new line</span>
              <span>{input.length}/{MAX_CHARS}</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ChatWidget;
