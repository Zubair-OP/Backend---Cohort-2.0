export function TrustedBySection() {
  return (
    <section className="py-12 bg-surface-subtle border-y border-surface-variant">
      <div className="max-w-[1200px] mx-auto px-4 md:px-10">
        <p className="text-center font-label-lg text-label-lg text-on-surface-variant mb-10 tracking-wider">
          TRUSTED BY OVER 5 MILLION JOB SEEKERS AT COMPANIES LIKE
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-45 hover:opacity-75 transition-all duration-500">
          {/* VOLT */}
          <div className="flex items-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            <svg className="h-6 md:h-7" viewBox="0 0 100 24" fill="currentColor">
              <path d="M10 2L2 14h7v8l8-12h-7z" />
              <text x="24" y="17" className="font-sans font-bold text-lg tracking-tight">VOLT</text>
            </svg>
          </div>

          {/* GLOBE */}
          <div className="flex items-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            <svg className="h-6 md:h-7" viewBox="0 0 110 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              <path d="M2 12h20" />
              <text x="28" y="17" stroke="none" fill="currentColor" className="font-sans font-extrabold text-lg tracking-wide">GLOBE</text>
            </svg>
          </div>

          {/* NEXUS */}
          <div className="flex items-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            <svg className="h-6 md:h-7" viewBox="0 0 115 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="12" r="5" />
              <circle cx="16" cy="12" r="5" />
              <path d="M12 7c1 1 2 2 2 5s-1 4-2 5" />
              <text x="28" y="17" stroke="none" fill="currentColor" className="font-sans font-semibold text-lg tracking-tight">nexus</text>
            </svg>
          </div>

          {/* APEX */}
          <div className="flex items-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            <svg className="h-6 md:h-7" viewBox="0 0 110 24" fill="currentColor">
              <path d="M10 3l8 16H2L10 3zm0 4.5L5.5 16h9L10 7.5z" />
              <text x="24" y="17" className="font-sans font-black text-lg tracking-tight uppercase">APEX</text>
            </svg>
          </div>

          {/* ZENO */}
          <div className="flex items-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            <svg className="h-6 md:h-7" viewBox="0 0 100 24" fill="currentColor">
              <path d="M2 4h12l-8 8 8 8H2l8-8-8-8z" />
              <text x="24" y="17" className="font-sans font-light text-xl tracking-widest uppercase">ZENO</text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}