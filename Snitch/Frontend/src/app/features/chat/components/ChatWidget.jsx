import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../hook/useChat";
import ChatMessage from "./ChatMessage";

const MAX_CHARS = 500;

function ChatIcon({ className = "h-5 w-5" }) {
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

function CloseIcon({ className = "h-5 w-5" }) {
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

function SendIcon({ className = "h-4 w-4" }) {
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
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // Auto-scroll to the latest message as content arrives.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isStreaming]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    // Enter sends; Shift+Enter inserts a newline.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating toggle button (bottom-right, above the sticky header). */}
      <button
        onClick={toggleOpen}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 left-4 z-50 flex h-[70vh] max-h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-2xl sm:left-auto sm:h-[600px] sm:w-96">
          {/* Header + recording disclaimer */}
          <div className="flex-none bg-neutral-900 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <h2 className="text-sm font-semibold tracking-wide">Snitch Assistant</h2>
            </div>
            <p className="mt-1 text-[10px] leading-tight text-white/60">
              Conversations are recorded to improve our service.
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-white px-3.5 py-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isStreaming={isStreaming}
              />
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex-none border-t border-neutral-100 bg-white p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                onKeyDown={handleKeyDown}
                rows={1}
                maxLength={MAX_CHARS}
                placeholder="Ask about products, orders, returns…"
                className="max-h-24 flex-1 resize-none rounded-lg border border-neutral-200 px-3 py-2 text-xs text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-900"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                aria-label="Send message"
                className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-neutral-900 text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <SendIcon />
              </button>
            </div>
            <p className="mt-1.5 text-right text-[10px] text-neutral-400">
              {input.length}/{MAX_CHARS}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatWidget;
