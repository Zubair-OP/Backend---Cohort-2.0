import { comparisonRows } from "../data";
import { RevealSection, SectionHeader } from "../ui";

export function ComparisonSection() {
  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Comparison"
          title="Cake vs Other Resume Builders"
          description="A clear side-by-side view of the features most job seekers care about when they want something beyond a basic document editor."
        />
        <RevealSection className="mt-12">
          <div className="overflow-hidden rounded-4xl border border-slate-900/8 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <div className="grid grid-cols-[2fr_1fr_1fr] bg-slate-950 px-5 py-4 text-sm font-semibold text-white">
              <div>Feature</div>
              <div>Cake</div>
              <div>Other Resume Builders</div>
            </div>
            <div className="divide-y divide-slate-900/8">
              {comparisonRows.map(([feature, cake, other]) => (
                <div key={feature} className="grid grid-cols-[2fr_1fr_1fr] items-center px-5 py-4 text-sm">
                  <div className="font-medium text-slate-950">{feature}</div>
                  <div className="font-semibold text-emerald-700">{cake}</div>
                  <div className="text-slate-600">{other || ""}</div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}