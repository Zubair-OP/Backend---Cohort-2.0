import { ArrowRightOnRectangleIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import { logout } from "../services/api.services";
import { useNavigate } from "react-router";

const TopBar = ({ user, sidebarCollapsed, onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [dropdownOpen]);

  return (
    <header className="flex items-center justify-between px-4 md:px-6 h-14 border-b border-border bg-surface-0/80 backdrop-blur-xl sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-2">
        {sidebarCollapsed && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 -ml-1.5 rounded-lg text-fg-secondary hover:text-fg-primary hover:bg-surface-4 transition-colors duration-200 focus-ring md:hidden"
            aria-label="Open sidebar"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-accent">P</span>
          </div>
          <span className="text-sm font-semibold tracking-tight text-fg-primary hidden sm:inline">
            Perplexity
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((o) => !o)}
            className="w-8 h-8 rounded-full bg-surface-4 border border-border flex items-center justify-center text-xs font-semibold text-fg-primary hover:bg-surface-5 hover:border-border-hover transition-all duration-200 focus-ring press-active"
          aria-label="User menu"
          aria-expanded={dropdownOpen}
        >
          {user?.username?.[0]?.toUpperCase() ?? "U"}
        </button>

        {dropdownOpen && (
          <div className="absolute right-4 top-14 z-20 w-52 bg-surface-3 border border-border rounded-xl overflow-hidden shadow-glass-lg animate-scale-in">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-medium text-fg-primary truncate">
                {user?.username ?? "Guest User"}
              </p>
              <p className="text-[11px] text-fg-muted truncate mt-0.5">
                {user?.email ?? "guest@example.com"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-fg-secondary hover:text-fg-primary hover:bg-surface-4 transition-colors duration-150"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
