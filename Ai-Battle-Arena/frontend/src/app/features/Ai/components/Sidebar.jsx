import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Search, Settings, MessageSquare, Swords, X, User } from 'lucide-react';

function formatAge(date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function SidebarContent({ conversations, activeId, onSelect, onNew, onClose, showClose }) {
  const [query, setQuery] = useState('');

  const filtered = conversations.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-[14px] border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-[28px] h-[28px] bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
            <Swords size={13} className="text-zinc-300" />
          </div>
          <span className="text-[13px] font-semibold text-zinc-100 tracking-tight leading-none">
            Battle Arena
          </span>
        </div>
        {showClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* New Battle */}
      <div className="px-3 pt-3 pb-1">
        <button
          onClick={() => { onNew(); onClose?.(); }}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] text-zinc-300 hover:text-zinc-100 bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-600/80 transition-all"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>New Battle</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent border border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs text-zinc-400 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
          />
        </div>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-3 space-y-px pb-2">
        {filtered.length > 0 ? (
          <>
            <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider px-2 pb-1.5 pt-1">
              Recent
            </p>
            {filtered.map(conv => (
              <button
                key={conv.id}
                onClick={() => { onSelect(conv.id); onClose?.(); }}
                className={`w-full flex items-start gap-2.5 px-2.5 py-2.5 rounded-lg text-left transition-colors group ${
                  conv.id === activeId
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-300'
                }`}
              >
                <MessageSquare
                  size={12}
                  className="shrink-0 mt-0.5 opacity-50"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs truncate leading-snug">{conv.title}</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">{formatAge(conv.timestamp)}</p>
                </div>
              </button>
            ))}
          </>
        ) : (
          <div className="pt-6 text-center">
            <p className="text-xs text-zinc-700">No battles yet</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800/80 p-3 space-y-px">
        <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-colors">
          <Settings size={13} />
          <span className="text-xs">Settings</span>
        </button>
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg">
          <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
            <User size={11} className="text-zinc-400" />
          </div>
          <span className="text-xs text-zinc-500 truncate">User</span>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ conversations, activeId, onSelect, onNew, isOpen, onClose }) {
  const props = { conversations, activeId, onSelect, onNew, onClose };

  return (
    <>
      {/* Desktop: static flex child */}
      <aside className="hidden lg:flex lg:flex-col w-64 flex-shrink-0 bg-zinc-900 border-r border-zinc-800/80">
        <SidebarContent {...props} showClose={false} />
      </aside>

      {/* Mobile: animated overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-30 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              key="drawer"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 w-64 z-40 flex flex-col bg-zinc-900 border-r border-zinc-800/80 lg:hidden"
            >
              <SidebarContent {...props} showClose={true} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
