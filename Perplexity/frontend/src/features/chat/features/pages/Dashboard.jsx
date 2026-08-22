import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { GlobeAltIcon, ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useChat } from "../hook/useChat";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import ChatWelcome from "../components/ChatWelcome";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MessageInput from "../components/MessageInput";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    sidebarCollapsed, setSidebarCollapsed, isLoading, streamingMessageId,
    messages, currentChatId, chats, handleDeleteChat, handleSelectChat,
    handleNewChat, handleSend, handleStop,
  } = useChat();

  return (
    <div className="flex h-screen w-screen bg-surface-0 text-fg-primary overflow-hidden">
      <Sidebar user={user} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)}
        chats={chats} onSelectChat={handleSelectChat} currentChatId={currentChatId}
        onNewChat={handleNewChat} onDeleteChat={handleDeleteChat} />
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <TopBar user={user} sidebarCollapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed((c) => !c)} />
        <main className="flex-1 overflow-y-auto flex flex-col min-h-0 pb-32 scrollbar-thin">
          {messages.length === 0 ? (
            <ChatWelcome user={user} onSend={handleSend} isLoading={isLoading} />
          ) : (
            <div className="flex-1 w-full max-w-chat mx-auto px-4 md:px-6 py-8 space-y-6">
              {messages.map((msg, i) => (
                <Message key={msg.id || msg._id || i} message={msg} isStreaming={msg.id === streamingMessageId} />
              ))}
              {isLoading && !streamingMessageId && <TypingIndicator />}
            </div>
          )}
        </main>
        <MessageInput onSend={handleSend} onStop={handleStop} isLoading={isLoading} />
      </div>
    </div>
  );
};

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [text]);
  return (
    <button onClick={handleCopy} className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] text-fg-muted hover:text-fg-secondary hover:bg-surface-4 transition-all duration-200 focus-ring" title="Copy code" aria-label={copied ? "Copied" : "Copy code"}>
      {copied ? (<><CheckIcon className="w-3 h-3 text-accent" /><span className="text-accent">Copied</span></>) : (<><ClipboardDocumentIcon className="w-3 h-3" /><span>Copy</span></>)}
    </button>
  );
};

const Message = ({ message, isStreaming }) => {
  const isUser = message.role === "user";
  const sources = getSources(message);
  const hasSources = sources.length > 0;

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} animate-fade-in-up`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/15 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-[10px] font-bold text-accent">P</span>
        </div>
      )}
      {isUser ? (
        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-surface-3 border border-border px-4 py-3 text-sm leading-relaxed text-fg-primary">
          {message.content}
        </div>
      ) : (
        <div className="max-w-[85%] min-w-0 pt-0.5">
          {hasSources && (
            <div className="mb-4">
              <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-fg-muted">Sources</div>
              <div className="flex flex-wrap gap-1.5">
                {sources.map((source, i) => (
                  <div key={`${source}-${i}`} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] text-fg-secondary hover:bg-surface-3 hover:border-border-hover transition-all duration-200 cursor-default">
                    <GlobeAltIcon className="w-3 h-3 text-accent shrink-0" />
                    <span className="truncate max-w-[180px]">{source}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className={`text-sm leading-7 text-[#d4d4d4] markdown-body ${isStreaming ? "streaming-cursor" : ""}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
              code(props) {
                const { children, className, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                const codeString = typeof children === "string" ? children.replace(/\n$/, "") : "";
                if (match && codeString) {
                  try {
                    const highlighted = hljs.highlight(codeString, { language: match[1] }).value;
                    return (
                      <div className="my-4 rounded-xl border border-border bg-surface-1 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-2">
                          <span className="text-[11px] font-mono font-medium text-fg-muted uppercase tracking-wider">{match[1]}</span>
                          <CopyButton text={codeString} />
                        </div>
                        <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed text-[#d4d4d4]">
                          <code className={className} dangerouslySetInnerHTML={{ __html: highlighted }} />
                        </pre>
                      </div>
                    );
                  } catch { /* Fallback for unsupported languages */ }
                }
                return <code {...rest} className="bg-surface-4 text-[#e879f9] px-1.5 py-0.5 rounded text-[13px] font-mono">{children}</code>;
              },
            }}>{message.content}</ReactMarkdown>
          </div>
        </div>
      )}
      {isUser && (
        <div className="w-7 h-7 rounded-lg bg-surface-4 border border-border flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-[10px] font-semibold text-fg-secondary">U</span>
        </div>
      )}
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex gap-3 justify-start animate-fade-in">
    <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/15 flex items-center justify-center shrink-0">
      <span className="text-[10px] font-bold text-accent">P</span>
    </div>
    <div className="rounded-2xl rounded-tl-md border border-border bg-surface-2 px-4 py-3 flex items-center gap-1.5">
      {[0, 150, 300].map((delay) => (
        <span key={delay} className="w-1.5 h-1.5 rounded-full bg-accent animate-typing-dot" style={{ animationDelay: `${delay}ms` }} />
      ))}
    </div>
  </div>
);

function getSources(message) {
  if (Array.isArray(message.sources) && message.sources.length > 0) {
    return message.sources.slice(0, 3).map((source, index) => {
      if (typeof source === "string") return source;
      return source?.title || source?.name || source?.url || `Source ${index + 1}`;
    });
  }
  return [];
}

export default Dashboard;
