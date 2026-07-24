import { RevealSection } from "../ui";

export function PortfolioSection() {
  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <RevealSection>
            <div className="rounded-4xl border border-slate-900/8 bg-slate-950 p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/65">
                Portfolio Cross-sell
              </div>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Show Your Work, Not Just Your Words.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
                Use a cleaner portfolio-ready resume layout when you want the work itself to do the selling.
              </p>
              <button className="mt-8 group inline-flex items-center rounded-full bg-emerald-500 pl-6 pr-3 py-3 text-sm font-semibold text-slate-950 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(72,227,106,0.28)]">
                Build a Portfolio Resume
                <span className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/35 transition-transform duration-700 group-hover:translate-x-1 group-hover:-translate-y-px">
                  ↗
                </span>
              </button>
            </div>
          </RevealSection>
          <RevealSection delay={120}>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Case study framing",
                "Project proof blocks",
                "Visual hierarchy",
                "Shareable presentation",
              ].map((item) => (
                <div key={item} className="rounded-4xl border border-slate-900/8 bg-slate-50 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Portfolio ready</div>
                  <div className="mt-6 h-24 rounded-3xl bg-linear-to-br from-slate-950 to-slate-800" />
                  <div className="mt-5 text-lg font-semibold text-slate-950">{item}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">Designed to help employers understand the outcome behind the work.</div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}