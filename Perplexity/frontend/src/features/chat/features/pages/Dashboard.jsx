import { useSelector } from "react-redux";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { useChat } from "../hook/useChat";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import ChatWelcome from "../components/ChatWelcome";
import MessageInput from "../components/MessageInput";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { 
    sidebarCollapsed, 
    setSidebarCollapsed,
    isLoading, 
    messages, 
    currentChatId, 
    chats,
    handleDeleteChat, 
    handleSelectChat, 
    handleNewChat, 
    handleSend 
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
                <Message key={i} message={msg} />
              ))}
              {isLoading && <TypingIndicator />}
            </div>
          )}
        </main>

        <MessageInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
};

const Message = ({ message }) => {
  const isUser = message.role === "user";
  const sources = getSources(message);

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
          <div className="text-sm leading-7 text-[#f3f3f3] whitespace-pre-wrap">
            {message.content}
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

  return ["perplexity.ai", "docs.example.com", "research notes"];
}

export default Dashboard;
