"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoIcon } from "@/components/home/ui";

export function SiteHeader() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-surface sticky top-0 border-b border-surface-variant h-16 flex items-center z-50 transition-all duration-200">
      <div className="flex justify-between items-center w-full px-4 md:px-10 max-w-[1200px] mx-auto">
        {/* Brand */}
        <Link
          href="/"
          className="text-base font-semibold text-primary flex items-center gap-2 tracking-tight"
        >
          <LogoIcon className="h-5 w-5" />
          <span>Scriber Builder</span>
        </Link>

        {/* Navigation (Desktop) */}
        <nav className="hidden md:flex gap-4 items-center">
          <Link
            href="/"
            className={`text-sm font-medium px-1 py-1.5 transition-colors ${
              isActive("/")
                ? "text-primary border-b-2 border-primary pb-0.5"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Features
          </Link>
          <Link
            href="/templates"
            className={`text-sm font-medium px-1 py-1.5 transition-colors ${
              isActive("/templates")
                ? "text-primary border-b-2 border-primary pb-0.5"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Templates
          </Link>
          <Link
            href="/pricing"
            className={`text-sm font-medium px-1 py-1.5 transition-colors ${
              isActive("/pricing")
                ? "text-primary border-b-2 border-primary pb-0.5"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Pricing
          </Link>
          <Link
            href="/testimonials"
            className={`text-sm font-medium px-1 py-1.5 transition-colors ${
              isActive("/testimonials")
                ? "text-primary border-b-2 border-primary pb-0.5"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Testimonials
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden sm:inline-block text-sm font-medium text-primary hover:opacity-85 px-3 py-1.5 transition-all"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-primary-container text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary active:scale-[0.98] transition-all shadow-xs flex items-center gap-1"
          >
            Build My Resume
          </Link>
        </div>
      </div>
    </header>
  );
}