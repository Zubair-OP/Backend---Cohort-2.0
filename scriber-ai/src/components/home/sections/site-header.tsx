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
    <header className="fixed top-3 left-0 right-0 z-50 flex justify-center px-4">
      <div className="bg-white/80 backdrop-blur-xl border border-surface-variant/60 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex items-center gap-1 px-2 py-1.5 w-full max-w-[800px]">
        {/* Brand */}
        <Link
          href="/"
          className="text-sm font-semibold text-primary flex items-center gap-2 tracking-tight pl-3 pr-4"
        >
          <LogoIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Scriber</span>
        </Link>

        {/* Navigation (Desktop) */}
        <nav className="hidden md:flex gap-0.5 items-center">
          <Link
            href="/"
            className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
              isActive("/")
                ? "bg-surface text-on-surface"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-subtle"
            }`}
          >
            Features
          </Link>
          <Link
            href="/templates"
            className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
              isActive("/templates")
                ? "bg-surface text-on-surface"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-subtle"
            }`}
          >
            Templates
          </Link>
          <Link
            href="/pricing"
            className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
              isActive("/pricing")
                ? "bg-surface text-on-surface"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-subtle"
            }`}
          >
            Pricing
          </Link>
          <Link
            href="/testimonials"
            className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
              isActive("/testimonials")
                ? "bg-surface text-on-surface"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-subtle"
            }`}
          >
            Testimonials
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 ml-auto">
          <Link
            href="/login"
            className="hidden sm:inline-flex text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-subtle px-3 py-1.5 rounded-full transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-primary-container text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary active:scale-[0.98] transition-all flex items-center gap-1.5"
          >
            <span>Build Resume</span>
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}