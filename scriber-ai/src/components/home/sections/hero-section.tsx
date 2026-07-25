import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-12 md:pt-24 md:pb-16 lg:pt-28 lg:pb-20 bg-surface">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="z-10">
          <span className="inline-flex items-center px-3 py-1 mb-3 md:mb-4 bg-secondary-container/60 text-on-secondary-container font-label-sm rounded-full border border-secondary-container/20">
            New AI-Powered Builder 2.0
          </span>
          <h1 className="font-display-xl text-on-surface mb-4 md:mb-5">
            Build a Resume That <span className="text-primary">Lands Your Dream Job</span>
          </h1>
          <p className="font-body-lg text-on-surface-variant mb-6 md:mb-7 max-w-xl">
            Stand out from the crowd with professional, recruiter-approved templates. Our easy-to-use editor and AI suggestions help you create a job-winning resume in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/signup"
              className="bg-primary-container text-white px-5 py-3 rounded-full font-title-md flex items-center justify-center gap-2 hover:bg-primary active:scale-[0.98] transition-all group text-sm md:text-base"
            >
              <span>Build My Resume</span>
              <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
            <Link
              href="/templates"
              className="border border-outline/30 text-on-surface-variant px-5 py-3 rounded-full font-title-md hover:bg-surface-container active:scale-[0.98] transition-all flex items-center justify-center text-sm md:text-base"
            >
              View Templates
            </Link>
          </div>
          <div className="mt-5 md:mt-6 flex items-center gap-3 text-on-surface-variant">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full border-2 border-white bg-primary-container/20 flex items-center justify-center text-[10px] font-bold text-primary">SJ</div>
              <div className="w-7 h-7 rounded-full border-2 border-white bg-secondary-container flex items-center justify-center text-[10px] font-bold text-secondary">MR</div>
              <div className="w-7 h-7 rounded-full border-2 border-white bg-tertiary-container flex items-center justify-center text-[10px] font-bold text-tertiary">AK</div>
            </div>
            <span className="font-label-lg text-on-surface-variant">Joined by 500+ job seekers today</span>
          </div>
        </div>

        <div className="relative">
          {/* Subtle colored background glow */}
          <div className="absolute -top-12 -right-12 w-72 h-72 bg-emerald-500/10 opacity-40 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-teal-500/10 opacity-30 blur-3xl rounded-full"></div>
          
          {/* Glassmorphic Browser frame container - Double Bezel Architecture */}
          <div className="p-1.5 bg-white/40 backdrop-blur-sm rounded-[1.5rem] border border-surface-variant/40">
            <div className="bg-white rounded-[1.25rem] border border-surface-variant/60 shadow-[0_32px_64px_rgba(0,0,0,0.06)] relative overflow-hidden">
              {/* Browser Header Bar */}
              <div className="bg-surface-container-low border-b border-surface-variant/60 px-4 py-2.5 flex items-center gap-2">
                {/* Window dots */}
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
                </div>
                {/* Fake address bar */}
                <div className="bg-white border border-surface-variant/60 rounded-md py-0.5 px-3 text-[10px] text-on-surface-variant/60 font-mono flex-grow max-w-[240px] mx-auto text-center truncate">
                  scriber.ai/builder/executive
                </div>
              </div>
              
              {/* Image content inside browser */}
              <div className="p-1 bg-surface-container-lowest">
                <img
                  className="w-full h-auto rounded-b-xl border-t border-surface-variant/50 object-cover"
                  alt="Scriber Builder Resume Mockup"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCdRlCC2OzBruaSy73dDUIwSZ5IoLcfToVG4xnXWW2wMBcLoepPYUL6i5gv7xmlVPl_lpmLk2BVIDZoVYwdufvMEShxbDZdg302VNobAterCYgNK8dllGsk1w-Ul7859vL4-gk9W9z4-cOAtwIr_V_gKv_7HCvUFgnQAsdGSwG2VKGke8MktnwyElWtJEMvElVUijUu4_49kjgJtdh6A6tKNuInKvhEN7DQnbL0COyxXQ1j3qHuAGZFsSdk5PK4vn2p6Qqtpz4EFnK"
                />
              </div>
            </div>
          </div>

          {/* Floating dynamic ATS badge overlay */}
          <div className="absolute -bottom-4 -left-4 md:-bottom-5 md:-left-5 bg-slate-950 text-white border border-white/10 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 z-20">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <span className="material-symbols-outlined fill text-lg">check_circle</span>
            </div>
            <div>
              <div className="text-[9px] text-white/50 uppercase tracking-widest font-semibold">ATS Compatibility</div>
              <div className="text-xs md:text-sm font-bold text-emerald-300">98/100 Score</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}