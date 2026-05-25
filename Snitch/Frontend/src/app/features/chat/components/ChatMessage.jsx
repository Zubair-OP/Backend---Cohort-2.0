import React from "react";
import Markdown from "react-markdown";

// Small robot/bot glyph shown next to assistant messages.
function BotAvatar() {
  return (
    <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-neutral-900 text-white">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <rect x="4" y="8" width="16" height="11" rx="2.5" />
        <path d="M12 8V5" />
        <circle cx="12" cy="4" r="1" />
        <path d="M9 13h.01M15 13h.01" />
      </svg>
    </div>
  );
}

// Three-dot bounce shown while the bot reply is still empty.
export function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1" aria-label="Assistant is typing">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  );
}

// Tailwind styling for the markdown nodes so bot output matches the theme.
const markdownComponents = {
  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-neutral-900">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-neutral-900 underline underline-offset-2"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-neutral-200 px-1 py-0.5 font-mono text-[11px] text-neutral-800">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mb-2 overflow-x-auto rounded bg-neutral-900 p-2 font-mono text-[11px] text-neutral-100 last:mb-0">
      {children}
    </pre>
  ),
};

function ChatMessage({ message, isStreaming }) {
  const isUser = message.role === "user";
  // Empty assistant bubble that's actively streaming -> show typing dots.
  const showTyping = !isUser && isStreaming && message.content === "";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] whitespace-pre-wrap break-words rounded-2xl rounded-br-sm bg-neutral-900 px-3.5 py-2 text-xs leading-relaxed text-white">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <BotAvatar />
      <div className="max-w-[80%] break-words rounded-2xl rounded-tl-sm bg-neutral-100 px-3.5 py-2 text-xs text-neutral-800">
        {showTyping ? (
          <TypingDots />
        ) : (
          <Markdown components={markdownComponents}>{message.content}</Markdown>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
