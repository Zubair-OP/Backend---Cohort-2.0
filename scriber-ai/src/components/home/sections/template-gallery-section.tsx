import { templates } from "../data";
import { RevealSection, SectionHeader, TemplateThumbnail } from "../ui";

export function TemplateGallerySection() {
  return (
    <section className="bg-[#F6F7F3] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Template Gallery"
          title="Choose a resume layout that matches the role without sacrificing clarity."
          description="Browse a premium template row with free and Pro options. Hover any card to reveal the action, then start with a single click."
        />
        <div className="mt-14 overflow-x-auto pb-4">
          <div className="grid min-w-max grid-flow-col gap-4">
            {templates.map((template, index) => (
              <RevealSection key={template.name} delay={index * 40} className="w-74">
                <div className="group relative h-full rounded-4xl border border-slate-900/8 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition-all duration-700 hover:-translate-y-1">
                  {template.tier === "pro" ? (
                    <div className="absolute right-4 top-4 rounded-full bg-emerald-500 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-950">
                      Pro
                    </div>
                  ) : null}
                  <TemplateThumbnail name={template.name} pro={template.tier === "pro"} />
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-950">{template.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{template.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center opacity-0 transition-all duration-500 group-hover:opacity-100">
                    <button className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${template.tier === "pro" ? "bg-slate-950 text-white" : "bg-emerald-500 text-slate-950"}`}>
                      {template.tier === "pro" ? "Upgrade to Use" : "Choose Template"}
                    </button>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <button className="group inline-flex items-center rounded-full bg-emerald-500 pl-6 pr-3 py-3 text-sm font-semibold text-slate-950 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(72,227,106,0.28)]">
            Choose a Template to Start
            <span className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/35 transition-transform duration-700 group-hover:translate-x-1 group-hover:-translate-y-px">
              ↗
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}