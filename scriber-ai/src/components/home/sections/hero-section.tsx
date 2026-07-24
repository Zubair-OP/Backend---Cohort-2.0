import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 bg-surface">
      <div className="max-w-[1200px] mx-auto px-4 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="z-10">
          <span className="inline-block px-3 py-1 mb-6 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm rounded-full">
            New AI-Powered Builder 2.0
          </span>
          <h1 className="font-display-lg text-display-lg md:text-[64px] md:leading-[72px] mb-6 text-on-surface">
            Build a Resume That <span className="text-primary">Lands Your Dream Job</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl">
            Stand out from the crowd with professional, recruiter-approved templates. Our easy-to-use editor and AI suggestions help you create a job-winning resume in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup"
              className="bg-primary-container text-white px-8 py-4 rounded-xl font-title-lg text-title-lg flex items-center justify-center gap-2 hover:bg-primary active:scale-[0.98] transition-all hover:shadow-[0_8px_30px_rgba(19,171,103,0.3)] group"
            >
              <span>Build My Resume</span>
              <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
            </Link>
            <Link
              href="/templates"
              className="border border-outline text-on-surface-variant px-8 py-4 rounded-xl font-title-lg text-title-lg hover:bg-surface-container active:scale-[0.98] transition-all flex items-center justify-center"
            >
              View Templates
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-3 text-on-surface-variant">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-container/20 flex items-center justify-center text-[10px] font-bold text-primary">SJ</div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-secondary-container flex items-center justify-center text-[10px] font-bold text-secondary">MR</div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-tertiary-container flex items-center justify-center text-[10px] font-bold text-tertiary">AK</div>
            </div>
            <span className="font-label-lg text-label-lg">Joined by 500+ job seekers today</span>
          </div>
        </div>

        <div className="relative">
          {/* Subtle colored background glow */}
          <div className="absolute -top-12 -right-12 w-80 h-80 bg-emerald-500/10 opacity-40 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-teal-500/10 opacity-30 blur-3xl rounded-full"></div>
          
          {/* Glassmorphic Browser frame container */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-surface-variant/80 shadow-[0_32px_64px_rgba(0,0,0,0.06),_0_0_1px_rgba(0,0,0,0.1)] relative overflow-hidden">
            {/* Browser Header Bar */}
            <div className="bg-surface-container-low border-b border-surface-variant/80 px-4 py-3 flex items-center gap-2">
              {/* Window dots */}
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
              </div>
              {/* Fake address bar */}
              <div className="bg-white border border-surface-variant rounded-md py-1 px-4 text-[10px] text-on-surface-variant/60 font-mono flex-grow max-w-[240px] mx-auto text-center truncate">
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

          {/* Floating dynamic ATS badge overlay */}
          <div className="absolute -bottom-6 -left-6 bg-slate-950 text-white border border-white/10 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-20">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <span className="material-symbols-outlined fill text-xl">check_circle</span>
            </div>
            <div>
              <div className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">ATS Compatibility</div>
              <div className="text-sm font-bold text-emerald-300">98/100 Score</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}