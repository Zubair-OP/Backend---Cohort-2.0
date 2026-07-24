import { ChartIcon, FileIcon, MockResumeScreen, RevealSection, ShieldIcon, SparkIcon } from "../ui";

export function CheckerSection() {
  return (
    <section className="bg-[#F6F7F3] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <RevealSection>
            <div className="max-w-xl">
              <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
                Cross-sell
              </div>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                AI Resume Checker
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
                Get a focused report that highlights what is working, what is missing, and how to make each section recruiter-ready.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  [ChartIcon, "Personalized Resume Report"],
                  [SparkIcon, "One-Click AI Enhancements"],
                  [ShieldIcon, "ATS-Optimized Scanning"],
                  [FileIcon, "Tailored Cover Letter"],
                ].map(([Icon, label]) => (
                  <div key={label as string} className="flex items-center gap-4 rounded-3xl border border-slate-900/8 bg-white px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/12 text-emerald-700">
                      <Icon />
                    </div>
                    <div className="text-sm font-medium text-slate-900">{label as string}</div>
                  </div>
                ))}
              </div>
              <button className="mt-8 group inline-flex items-center rounded-full bg-emerald-500 pl-6 pr-3 py-3 text-sm font-semibold text-slate-950 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(72,227,106,0.28)]">
                Open Resume Checker
                <span className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/35 transition-transform duration-700 group-hover:translate-x-1 group-hover:-translate-y-px">
                  ↗
                </span>
              </button>
            </div>
          </RevealSection>
          <RevealSection delay={120}>
            <MockResumeScreen />
          </RevealSection>
        </div>
      </div>
    </section>
  );
}