import { useSelector } from "react-redux";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { useChat } from "../hook/useChat";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import ChatWelcome from "../components/ChatWelcome";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MessageInput from "../components/MessageInput";
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { 
    sidebarCollapsed, 
    setSidebarCollapsed,
    isLoading, 
    streamingMessageId,
    messages, 
    currentChatId, 
    chats,
    handleDeleteChat, 
    handleSelectChat, 
    handleNewChat, 
    handleSend,
    handleStop,
  } = useChat();

  return (
    <div className="flex h-screen w-screen bg-[#0f0f0f] text-white overflow-hidden">
      <Sidebar
        user={user}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        chats={chats}
        onSelectChat={handleSelectChat}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />

      <div className="flex flex-col flex-1 min-w-0 h-full">
        <TopBar
          user={user}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((c) => !c)}
        />

        <main className="flex-1 overflow-y-auto flex flex-col min-h-0 pb-28">
          {messages.length === 0 ? (
            <ChatWelcome user={user} onSend={handleSend} isLoading={isLoading} />
          ) : (
            <div className="flex-1 w-full max-w-[760px] mx-auto px-4 md:px-6 py-8 space-y-8">
              {messages.map((msg, i) => (
                <Message key={msg.id || msg._id || i} message={msg} />
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

const Message = ({ message }) => {
  const isUser = message.role === "user";
  const sources = getSources(message);
  const hasSources = sources.length > 0;

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full border border-[#2a2a2a] bg-[#161616] flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
          AI
        </div>
      )}
      {isUser ? (
        <div className="max-w-[80%] rounded-2xl rounded-br-md border border-[#2a2a2a] bg-[#1e1e1e] px-4 py-3 text-sm leading-relaxed text-white">
          {message.content}
        </div>
      ) : (
        <div className="max-w-[85%] pt-0.5">
          {hasSources && (
            <div className="mb-3">
              <div className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-[#888888]">Sources</div>
              <div className="flex flex-wrap gap-2">
                {sources.map((source) => (
                  <div
                    key={source}
                    className="inline-flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#161616] px-3 py-1.5 text-xs text-[#d6d6d6]"
                  >
                    <GlobeAltIcon className="w-3.5 h-3.5 text-[#20b2aa]" />
                    <span>{source}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="text-sm leading-7 text-[#f3f3f3] markdown-body">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                code(props) {
                  const { children, className, node, ...rest } = props;
                  const match = /language-(\w+)/.exec(className || '');
                  if (match && typeof children === 'string') {
                    try {
                      const highlighted = hljs.highlight(children.replace(/\n$/, ''), { language: match[1] }).value;
                      return (
                        <div className="my-4 rounded-xl border border-[#2a2a2a] bg-[#121212] overflow-hidden">
                          <div className="flex items-center justify-between px-4 py-2 border-b border-[#2a2a2a] bg-[#1a1a1a]">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{match[1]}</span>
                          </div>
                          <pre className="p-4 overflow-x-auto text-sm leading-tight text-[#e0e0e0]">
                            <code className={className} dangerouslySetInnerHTML={{ __html: highlighted }} />
                          </pre>
                        </div>
                      );
                    } catch (e) {
                      // Fallback if language is not supported
                    }
                  }
                  return (
                    <code {...rest} className="bg-[#2a2a2a] text-[#ff79c6] px-1.5 py-0.5 rounded text-[13px] font-mono">
                      {children}
                    </code>
                  );
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      )}
      {isUser && (
        <div className="w-8 h-8 rounded-full border border-[#2a2a2a] bg-[#161616] flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
          U
        </div>
      )}
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex gap-3 justify-start">
    <div className="w-8 h-8 rounded-full border border-[#2a2a2a] bg-[#161616] flex items-center justify-center text-xs font-semibold shrink-0">
      AI
    </div>
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#161616] px-4 py-3 flex items-center gap-1.5">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-2 h-2 rounded-full bg-[#20b2aa] animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
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
