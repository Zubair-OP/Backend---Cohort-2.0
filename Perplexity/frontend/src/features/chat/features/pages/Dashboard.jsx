import { useSelector } from "react-redux";
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
    <div className="flex h-screen w-screen bg-[#0d0d0d] text-white overflow-hidden">
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

        <main className="flex-1 overflow-y-auto flex flex-col min-h-0">
          {messages.length === 0 ? (
            <ChatWelcome user={user} />
          ) : (
            <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 space-y-6">
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
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
          AI
        </div>
      )}
      <div
        className={`
          max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed
          ${isUser
            ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-sm"
            : "bg-[#1a1a2e] border border-white/[0.06] text-[#e5e5e5] rounded-bl-sm"
          }
        `}
      >
        {message.content}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
          U
        </div>
      )}
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex gap-3 justify-start">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
      AI
    </div>
    <div className="bg-[#1a1a2e] border border-white/[0.06] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-2 h-2 rounded-full bg-[#555570] animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  </div>
);

export default Dashboard;
