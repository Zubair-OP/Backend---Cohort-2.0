import { useState, useRef, useEffect } from "react";
import {
  PlusIcon,
  Bars3Icon,
  ChatBubbleLeftRightIcon,
  TrashIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({
  user,
  collapsed,
  onToggle,
  chats = [],
  onSelectChat,
  currentChatId,
  onNewChat,
  onDeleteChat,
}) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openMenuId]);

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden transition-opacity duration-300"
          onClick={onToggle}
        />
      )}

      <aside
        className={`
          fixed md:relative top-0 left-0 h-full z-30 md:z-auto
          flex flex-col
          bg-surface-1 border-r border-border
          transition-all duration-350 ease-out-expo
          ${collapsed
            ? "-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden md:border-0"
            : "translate-x-0 w-[260px]"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 shrink-0 border-b border-border">
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-fg-secondary hover:text-fg-primary hover:bg-surface-4 transition-colors duration-200 focus-ring"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="w-[18px] h-[18px]" />
          </button>
          <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-fg-muted select-none">
            History
          </span>
        </div>

        {/* New Chat */}
        <div className="px-3 pt-3 shrink-0">
          <button
            onClick={onNewChat}
            className="group flex items-center justify-center gap-2 w-full rounded-xl border border-border bg-surface-3 px-4 py-2.5 text-sm font-medium text-fg-primary hover:bg-surface-4 hover:border-border-hover transition-all duration-200 focus-ring"
          >
            <PlusIcon className="w-4 h-4 text-fg-secondary group-hover:text-accent transition-colors duration-200" />
            New thread
          </button>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto px-2 pt-4 min-h-0 scrollbar-thin">
          <div className="px-2 pb-2">
            <span className="text-[10px] font-medium text-fg-muted uppercase tracking-[0.16em]">
              Recent
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            {chats.length === 0 && (
              <div className="px-3 py-8 text-center">
                <p className="text-xs text-fg-muted">No conversations yet</p>
              </div>
            )}
            {chats.map((chat) => {
              const isActive = currentChatId === chat._id;
              return (
                <div
                  key={chat._id}
                  className="relative group"
                  onMouseEnter={() => setHoveredId(chat._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  ref={openMenuId === chat._id ? menuRef : undefined}
                >
                  <button
                    onClick={() => onSelectChat(chat._id)}
                    className={`
                      flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-left truncate
                      transition-all duration-200
                      ${isActive
                        ? "bg-surface-4 text-fg-primary"
                        : "text-fg-secondary hover:text-fg-primary hover:bg-surface-3"
                      }
                    `}
                  >
                    <ChatBubbleLeftRightIcon
                      className={`w-3.5 h-3.5 shrink-0 transition-colors duration-200 ${
                        isActive ? "text-accent" : "text-fg-muted"
                      }`}
                    />
                    <span className="truncate text-[13px] leading-tight pr-4">
                      {chat.title || "New Chat"}
                    </span>
                  </button>

                  {/* Context menu trigger */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === chat._id ? null : chat._id);
                    }}
                    className={`
                      absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-md
                      transition-all duration-150
                      ${openMenuId === chat._id || hoveredId === chat._id
                        ? "opacity-100 text-fg-secondary hover:text-fg-primary hover:bg-surface-5"
                        : "opacity-0"
                      }
                    `}
                    aria-label="Chat options"
                  >
                    <EllipsisHorizontalIcon className="w-3.5 h-3.5" />
                  </button>

                  {/* Context menu */}
                  {openMenuId === chat._id && (
                    <div className="absolute right-2 top-full mt-1 z-50 w-36 bg-surface-3 border border-border rounded-xl overflow-hidden shadow-glass animate-scale-in">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                          onDeleteChat?.(chat._id);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-state-error hover:bg-state-error-soft transition-colors duration-150 font-medium"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-border shrink-0" />

        {/* User section */}
        <div className="px-3 py-3 shrink-0">
          <div className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 hover:bg-surface-3 transition-colors duration-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center text-xs font-semibold text-accent shrink-0">
              {user?.username?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-fg-primary leading-tight">
                {user?.username ?? "Guest"}
              </p>
              <p className="truncate text-[11px] text-fg-muted leading-tight mt-0.5">
                {user?.email ?? "research@mode"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
