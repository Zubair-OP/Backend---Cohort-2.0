import Link from "next/link";

export function CtaSection() {
  return (
    <section className="py-20 px-4 md:px-10">
      <div className="max-w-[1200px] mx-auto bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-700 text-on-primary p-12 md:p-20 rounded-[2rem] text-center relative overflow-hidden shadow-2xl border border-emerald-500/30">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white opacity-5 rotate-12 transform translate-x-1/2 pointer-events-none"></div>
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="font-display-lg text-display-lg mb-6 text-white tracking-tight">
            Ready to start your next chapter?
          </h2>
          <p className="font-body-lg text-body-lg mb-10 text-white/90 max-w-xl mx-auto">
            Join millions of job seekers who found success with Scriber Builder. Start building your professional resume for free today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/signup"
              className="bg-white text-emerald-800 px-10 py-5 rounded-xl font-title-lg text-title-lg hover:bg-slate-50 hover:shadow-xl active:scale-[0.98] transition-all text-center"
            >
              Start Building for Free
            </Link>
            <Link
              href="/templates"
              className="bg-white/10 border border-white/30 text-white px-10 py-5 rounded-xl font-title-lg text-title-lg hover:bg-white/20 active:scale-[0.98] transition-all text-center"
            >
              Explore All Templates
            </Link>
          </div>
          <p className="mt-8 font-label-sm text-label-sm text-white/70">
            No credit card required • Instant download • Recruiter-ready
          </p>
        </div>
      </div>
    </section>
  );
}
