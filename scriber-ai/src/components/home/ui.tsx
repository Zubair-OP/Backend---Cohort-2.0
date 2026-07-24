"use client";

import { useEffect, useRef, useState } from "react";

import { navSections } from "./data";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

type CountUpProps = {
  target: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  visible: boolean;
};

export function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

export function RevealSection({ children, className = "", delay = 0 }: RevealProps) {
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${visible ? "translate-y-0 opacity-100 blur-0" : "translate-y-10 opacity-0 blur-md"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function CountUp({ target, suffix = "", prefix = "", decimals = 0, visible }: CountUpProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!visible) {
      return;
    }

    let frame = 0;
    const start = performance.now();
    const duration = 1500;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);
  }, [target, visible]);

  return (
    <span>
      {prefix}
      {value.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

export function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
        {eyebrow}
      </div>
      <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-7 text-slate-600 sm:text-lg">
        {description}
      </p>
    </div>
  );
}

export function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M12 2v4M12 18v4M4 12H2M22 12h-2M5.5 5.5 4 4M19 19l-1.5-1.5M18.5 5.5 20 4M5 19l1.5-1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12 8l1.8 2.9L17 12l-3.2 1.1L12 16l-1.8-2.9L7 12l3.2-1.1L12 8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M12 3.5 19 6v5.1c0 4.6-3 8.7-7 9.9-4-1.2-7-5.3-7-9.9V6l7-2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="m9.8 12.4 1.5 1.5 3.6-3.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M4 19.5h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M6.5 16V9.5M12 16V6.5M17.5 16V11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M7 3.75h7L18.25 8v12.25H7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M14 3.75V8h4.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12h6M9 15.5h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M12 4.5v8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="m8.5 10 3.5 3.5L15.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19.25h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function DeviceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <rect x="5" y="4" width="14" height="16" rx="2.8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 18.25h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 shadow-[0_12px_32px_rgba(72,227,106,0.3)]">
        <span className="text-sm font-black tracking-tight">C</span>
      </div>
      <div>
        <div className="text-sm font-semibold uppercase tracking-[0.28em] text-white/70">Cake</div>
        <div className="text-sm text-white/60">AI Resume Builder</div>
      </div>
    </div>
  );
}

export function NavDropdown({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) {
  return (
    <div className="relative hidden lg:block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/10"
      >
        Explore
        <span className={`text-xs transition-transform duration-500 ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>
      <div
        className={`absolute left-1/2 top-full z-30 mt-3 w-104 -translate-x-1/2 rounded-4xl border border-white/10 bg-[#081424]/95 p-3 shadow-[0_32px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"}`}
      >
        <div className="grid grid-cols-2 gap-2 text-sm text-white/75">
          {navSections.map((item) => (
            <button
              key={item}
              type="button"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition-all duration-500 hover:bg-white/10"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MockResumeScreen() {
  return (
    <div className="rounded-4xl border border-white/10 bg-white p-3 shadow-[0_30px_80px_rgba(1,8,20,0.45)]">
      <div className="rounded-[34px] bg-slate-950 p-4 text-white">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-white/40">Cake AI Editor</div>
            <div className="mt-1 text-lg font-semibold">Senior Product Designer Resume</div>
          </div>
          <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
            ATS Score 98
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>Summary</span>
              <span className="text-emerald-300">Improved</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/78">
              Product designer with a track record of shipping accessible systems, improving conversion flows, and collaborating across design and engineering.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/35">Keywords matched</div>
              <div className="mt-3 text-2xl font-semibold text-emerald-300">42</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/35">Clarity gain</div>
              <div className="mt-3 text-2xl font-semibold text-emerald-300">+34%</div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-white/35">Top suggestions</div>
            <ul className="mt-3 space-y-2 text-sm text-white/75">
              <li>• Add measurable outcomes to the top work experience bullet.</li>
              <li>• Move “Figma, Framer, analytics” into the first skills cluster.</li>
              <li>• Tighten the summary to match the target product role.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TemplateThumbnail({ name, pro = false }: { name: string; pro?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-900/10 bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 p-4 text-white">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-2.5 w-18 rounded-full bg-white/20" />
          <div className="h-2.5 w-28 rounded-full bg-white/12" />
        </div>
        {pro ? (
          <div className="rounded-full bg-emerald-500 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-950">
            Pro
          </div>
        ) : null}
      </div>
      <div className="mt-7 grid grid-cols-3 gap-2">
        <div className="col-span-2 space-y-2 rounded-2xl bg-white/10 p-3">
          <div className="h-2 w-14 rounded-full bg-emerald-400/90" />
          <div className="h-2.5 w-full rounded-full bg-white/14" />
          <div className="h-2.5 w-3/4 rounded-full bg-white/12" />
          <div className="h-2.5 w-2/3 rounded-full bg-white/10" />
        </div>
        <div className="space-y-2 rounded-2xl bg-white/10 p-3">
          <div className="h-10 rounded-xl border border-white/12 bg-emerald-400/15" />
          <div className="h-10 rounded-xl border border-white/12 bg-white/8" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-white/45">
        <span>{name}</span>
        <span>{pro ? "Upgrade" : "Free"}</span>
      </div>
    </div>
  );
}

export function ExampleThumbnail({ title }: { title: string }) {
  return (
    <div className="rounded-3xl border border-slate-900/10 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div className="rounded-[22px] bg-slate-950 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-2.5 w-12 rounded-full bg-white/20" />
            <div className="h-2.5 w-28 rounded-full bg-white/12" />
          </div>
          <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
            View
          </div>
        </div>
        <div className="mt-5 grid gap-2">
          <div className="h-2.5 w-4/5 rounded-full bg-white/13" />
          <div className="h-2.5 w-2/3 rounded-full bg-white/11" />
          <div className="h-24 rounded-2xl border border-white/10 bg-linear-to-br from-emerald-500/20 to-transparent" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-950">{title}</div>
          <div className="mt-1 text-xs leading-5 text-slate-500">Tailored to a real role scenario with focused achievements and clean hierarchy.</div>
        </div>
        <button className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(72,227,106,0.28)]">
          View This Example
        </button>
      </div>
    </div>
  );
}