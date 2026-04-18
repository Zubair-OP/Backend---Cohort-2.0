import { ArrowRightOnRectangleIcon, Bars3Icon } from "@heroicons/react/24/outline";
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
    <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-[#2a2a2a] bg-[#0f0f0f]/95 backdrop-blur-sm sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-2">
        {sidebarCollapsed && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 -ml-1.5 rounded-lg text-[#888888] hover:text-white hover:bg-[#1f1f1f]"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
        )}
        <div className="text-base font-medium tracking-tight text-white">Perplexity AI</div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="w-9 h-9 rounded-full border border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-center text-sm font-semibold text-white hover:bg-[#1f1f1f]"
          >
            {user?.username?.[0]?.toUpperCase() ?? "U"}
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 top-12 z-20 w-48 bg-[#161616] border border-[#2a2a2a] rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#2a2a2a]">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.username ?? "Guest User"}
                  </p>
                  <p className="text-xs text-[#888888] truncate">
                    {user?.email ?? "guest@example.com"}
                  </p>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-3 text-sm text-[#d6d6d6] hover:bg-[#1f1f1f]">
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
