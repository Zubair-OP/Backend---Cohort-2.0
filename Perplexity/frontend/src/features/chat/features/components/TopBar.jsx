import { ChevronDownIcon, UserCircleIcon, ArrowRightOnRectangleIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { logout } from "../services/api.services";
import { useNavigate } from "react-router";

const TopBar = ({ user, sidebarCollapsed, onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    setDropdownOpen(false)
    navigate("/login")
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#0d0d0d]/80 backdrop-blur-sm sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-2">
        {sidebarCollapsed && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 -ml-1.5 rounded-lg text-[#8e8ea0] hover:text-white hover:bg-white/[0.06] transition-colors duration-200"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
        )}
        <button className="flex items-center gap-1.5 text-white font-semibold text-base hover:opacity-80 transition-opacity">
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Perplexity
          </span>
          <ChevronDownIcon className="w-4 h-4 text-[#8e8ea0]" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-medium transition-all duration-200 shadow-md shadow-violet-900/20">
          <SparklesIcon className="w-3.5 h-3.5" />
          Get Plus
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm font-semibold text-white hover:opacity-90 transition-opacity ring-2 ring-white/10"
          >
            {user?.username?.[0]?.toUpperCase() ?? "M"}
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 top-10 z-20 w-48 bg-[#1a1a2e] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.username ?? "M Zubair"}
                  </p>
                  <p className="text-xs text-[#8e8ea0] truncate">
                    {user?.email ?? "free plan"}
                  </p>
                </div>
                <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[#c5c5d2] hover:bg-white/[0.06] hover:text-white transition-colors">
                  <UserCircleIcon className="w-4 h-4" />
                  Profile settings
                </button>
                <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
