import Link from "next/link";

export function CtaSection() {
  return (
    <section className="py-24 md:py-32 px-4 md:px-10">
      <div className="max-w-[1200px] mx-auto p-1.5 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-teal-500/10 rounded-[2rem] border border-emerald-500/20">
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-700 text-on-primary p-12 md:p-20 rounded-[1.75rem] text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white opacity-5 rotate-12 transform translate-x-1/2 pointer-events-none"></div>
          <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="font-display-lg text-white mb-6 tracking-tight">
              Ready to start your next chapter?
            </h2>
            <p className="font-body-lg mb-10 text-white/90 max-w-xl mx-auto">
              Join millions of job seekers who found success with Scriber Builder. Start building your professional resume for free today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/signup"
                className="bg-white text-emerald-800 px-8 py-3.5 rounded-full font-title-lg hover:bg-slate-50 hover:shadow-xl active:scale-[0.98] transition-all text-center group"
              >
                <span className="flex items-center justify-center gap-2">
                  Start Building for Free
                  <span className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </span>
              </Link>
              <Link
                href="/templates"
                className="bg-white/10 border border-white/30 text-white px-8 py-3.5 rounded-full font-title-lg hover:bg-white/20 active:scale-[0.98] transition-all text-center"
              >
                Explore All Templates
              </Link>
            </div>
            <p className="mt-8 font-label-sm text-white/70">
              No credit card required • Instant download • Recruiter-ready
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
