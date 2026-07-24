"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-surface sticky top-0 border-b border-surface-variant h-20 flex items-center z-50 transition-all duration-200">
      <div className="flex justify-between items-center w-full px-4 md:px-10 max-w-[1200px] mx-auto">
        {/* Brand */}
        <Link
          href="/"
          className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2"
        >
          <span className="material-symbols-outlined fill text-primary">cake</span>
          <span>CakeBuilder</span>
        </Link>

        {/* Navigation (Desktop) */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link
            href="/"
            className={`font-body-lg text-body-lg px-3 py-2 rounded-lg transition-colors ${
              isActive("/")
                ? "text-primary font-bold border-b-2 border-primary pb-1"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
            }`}
          >
            Features
          </Link>
          <Link
            href="/templates"
            className={`font-body-lg text-body-lg px-3 py-2 rounded-lg transition-colors ${
              isActive("/templates")
                ? "text-primary font-bold border-b-2 border-primary pb-1"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
            }`}
          >
            Templates
          </Link>
          <Link
            href="/pricing"
            className={`font-body-lg text-body-lg px-3 py-2 rounded-lg transition-colors ${
              isActive("/pricing")
                ? "text-primary font-bold border-b-2 border-primary pb-1"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
            }`}
          >
            Pricing
          </Link>
          <Link
            href="/testimonials"
            className={`font-body-lg text-body-lg px-3 py-2 rounded-lg transition-colors ${
              isActive("/testimonials")
                ? "text-primary font-bold border-b-2 border-primary pb-1"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
            }`}
          >
            Testimonials
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden sm:inline-block font-label-lg text-label-lg text-primary hover:bg-surface-container-low px-4 py-2 rounded-lg transition-all"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-primary-container text-white px-6 py-2.5 rounded-xl font-title-md text-title-md hover:bg-primary hover:brightness-95 transition-all shadow-sm flex items-center gap-1"
          >
            Build My Resume
          </Link>
        </div>
      </div>
    </header>
  );
}