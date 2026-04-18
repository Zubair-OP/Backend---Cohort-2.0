import { useState } from "react";
import {
  PlusIcon,
  Bars3Icon,
  ChatBubbleLeftRightIcon,
  TrashIcon,
  EllipsisHorizontalIcon
} from "@heroicons/react/24/outline";

const Sidebar = ({ user, collapsed, onToggle, chats = [], onSelectChat, currentChatId, onNewChat , onDeleteChat }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  return (
    <>
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onToggle}
        />
      )}

      <aside 
        className={`
          fixed md:relative top-0 left-0 h-full z-30 md:z-auto
          flex flex-col
          bg-[#111111] border-r border-[#2a2a2a]
          transition-all duration-150 ease-in-out
          ${collapsed ? "-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden" : "translate-x-0 w-[240px]"}
        `}
      >
        <div className="flex items-center justify-between px-4 py-4 shrink-0 border-b border-[#2a2a2a]">
          <button
            onClick={onToggle}
            className="p-2 rounded-lg text-[#888888] hover:text-white hover:bg-[#1f1f1f]"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
          <div className="text-sm font-medium tracking-[0.12em] uppercase text-[#888888]">Chats</div>
        </div>

        <div className="px-4 pt-4 shrink-0">
          <button
            onClick={onNewChat}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 text-sm font-medium text-white hover:bg-[#1f1f1f]"
          >
            <PlusIcon className="w-4 h-4" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pt-5 min-h-0 scrollbar-hide">
          <p className="px-2 pb-2 text-[11px] font-medium text-[#888888] uppercase tracking-[0.18em]">
            Your chats
          </p>
          <div className="flex flex-col gap-1">
            {chats.map((chat) => (
              <div key={chat._id} className="relative group w-full">
                <button
                  onClick={() => onSelectChat(chat._id)}
                  className={`
                    flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm text-left w-full truncate
                    ${currentChatId === chat._id 
                      ? "bg-[#1a1a1a] text-white border border-[#2a2a2a]" 
                      : "text-[#b5b5b5] border border-transparent hover:text-white hover:bg-[#1f1f1f]"
                    }
                  `}
                >
                  <ChatBubbleLeftRightIcon 
                    className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                      currentChatId === chat._id ? "text-[#20b2aa]" : "text-[#666666] group-hover:text-[#a0a0a0]"
                    }`} 
                  />
                  <span className="truncate pr-6">{chat.title || "New Chat"}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === chat._id ? null : chat._id);
                  }}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-all ${openMenuId === chat._id ? "opacity-100 text-white bg-[#1f1f1f]" : "text-[#666666] opacity-0 group-hover:opacity-100 hover:text-white hover:bg-[#1f1f1f]"}`}
                >
                  <EllipsisHorizontalIcon className="w-4 h-4" />
                </button>

                {openMenuId === chat._id && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(null);
                      }} 
                    />
                    <div className="absolute right-2 top-10 z-50 w-32 bg-[#161616] border border-[#2a2a2a] rounded-xl overflow-hidden py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                          onDeleteChat?.(chat._id);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-[#1f1f1f] text-left font-medium"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-4 mb-3 h-px bg-[#2a2a2a] shrink-0" />

        <div className="px-4 pb-4 shrink-0">
          <div className="flex items-center gap-3 w-full rounded-xl border border-[#2a2a2a] bg-[#161616] px-3 py-3">
            <div className="w-9 h-9 rounded-full border border-[#2a2a2a] bg-[#1f1f1f] flex items-center justify-center text-sm font-semibold text-white shrink-0">
              {user?.username?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm text-white">{user?.username ?? "Guest User"}</p>
              <p className="truncate text-xs text-[#888888]">{user?.email ?? "Research mode"}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
