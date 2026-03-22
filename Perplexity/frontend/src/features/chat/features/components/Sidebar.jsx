import { useState } from "react";
import {
  PlusIcon,
  ChevronDownIcon,
  Bars3Icon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  TrashIcon,
  EllipsisHorizontalIcon
} from "@heroicons/react/24/outline";

const navItems = [
  { icon: PlusIcon, label: "New chat" },
];

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
          bg-[#0d0d0d] border-r border-white/[0.06]
          transition-all duration-300 ease-in-out
          ${collapsed ? "-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden" : "translate-x-0 w-[260px]"}
        `}
      >
        <div className="flex items-center justify-between px-3 py-3 shrink-0">
          <button
            onClick={onToggle}
            className="p-2 rounded-lg text-[#8e8ea0] hover:text-white hover:bg-white/[0.06] transition-colors duration-200"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
          <button 
            onClick={onNewChat}
            className="p-2 rounded-lg text-[#8e8ea0] hover:text-white hover:bg-white/[0.06] transition-colors duration-200"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-2 flex flex-col gap-0.5 shrink-0">
          {navItems.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={label === "New chat" ? onNewChat : undefined}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#c5c5d2] hover:text-white hover:bg-white/[0.06] transition-colors duration-200 text-left w-full group"
            >
              <Icon className="w-4 h-4 shrink-0 text-[#8e8ea0] group-hover:text-white transition-colors" />
              {label}
            </button>
          ))}
        </nav>

        <div className="mx-3 my-3 h-px bg-white/[0.06] shrink-0" />

        <div className="flex-1 overflow-y-auto px-2 min-h-0 scrollbar-hide">
          <p className="px-3 py-1.5 text-xs font-medium text-[#8e8ea0] uppercase tracking-wider">
            Your chats
          </p>
          <div className="flex flex-col gap-0.5 mt-1">
            {chats.map((chat) => (
              <div key={chat._id} className="relative group w-full">
                <button
                  onClick={() => onSelectChat(chat._id)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left w-full truncate transition-colors duration-200
                    ${currentChatId === chat._id 
                      ? "bg-white/[0.08] text-white" 
                      : "text-[#c5c5d2] hover:text-white hover:bg-white/[0.06]"
                    }
                  `}
                >
                  <ChatBubbleLeftRightIcon 
                    className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                      currentChatId === chat._id ? "text-white" : "text-[#555570] group-hover:text-[#8e8ea0]"
                    }`} 
                  />
                  <span className="truncate pr-6">{chat.title || "New Chat"}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === chat._id ? null : chat._id);
                  }}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-all ${openMenuId === chat._id ? "opacity-100 text-white bg-white/[0.06]" : "text-[#555570] opacity-0 group-[.group]:hover:opacity-100 hover:text-white hover:bg-white/[0.06]"}`}
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
                    <div className="absolute right-2 top-10 z-50 w-32 bg-[#1a1a2e] border border-white/[0.08] rounded-lg shadow-xl overflow-hidden py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                          onDeleteChat?.(chat._id);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left font-medium"
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

        <div className="mx-3 mb-2 h-px bg-white/[0.06] shrink-0" />

        <div className="px-2 pb-3 shrink-0">
          <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-white/[0.06] transition-colors duration-200 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm font-semibold text-white shrink-0">
              {user?.username?.[0]?.toUpperCase() ?? "M"}
            </div>
            <div className="flex flex-col items-start min-w-0 flex-1">
              <span className="text-sm font-medium text-[#c5c5d2] group-hover:text-white transition-colors truncate w-full">
                {user?.username ?? "M Zubair"}
              </span>
              <span className="text-xs text-[#8e8ea0]">Free</span>
            </div>
            <ChevronDownIcon className="w-4 h-4 text-[#8e8ea0] shrink-0" />
          </button>

          {/* Upgrade button */}
          <button className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-violet-900/20">
            <SparklesIcon className="w-4 h-4" />
            Get Plus
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
