"use client";

import { useState } from "react";

import { faqItems } from "../data";
import { RevealSection, SectionHeader } from "../ui";

export function FaqSection() {
  const [activeFaq, setActiveFaq] = useState(0);

  return (
    <section className="bg-[#F6F7F3] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="FAQ"
          title="Questions people ask before building a resume with AI"
          description="This section is intentionally denser for SEO and helps answer the most common buying and usage questions in a clean accordion format."
        />
        <div className="mt-12 space-y-4">
          {faqItems.map((item, index) => {
            const open = activeFaq === index;
            return (
              <RevealSection key={item.question} delay={index * 30}>
                <button
                  type="button"
                  onClick={() => setActiveFaq(open ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 rounded-3xl border border-slate-900/8 bg-white px-5 py-5 text-left shadow-[0_14px_35px_rgba(15,23,42,0.04)]"
                >
                  <span className="text-base font-semibold tracking-tight text-slate-950 sm:text-lg">{item.question}</span>
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-slate-950 transition-transform duration-500 ${open ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? "max-h-112 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="px-5 pb-6 pt-4">{item.answer}</div>
                </div>
              </RevealSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}