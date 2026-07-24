"use client";

import { useMemo, useState } from "react";

import { exampleCategories, exampleLibrary } from "../data";
import { ExampleThumbnail, RevealSection, SectionHeader } from "../ui";

export function ExampleGallerySection() {
  const [activeCategory, setActiveCategory] = useState(exampleCategories[0]);

  const activeExamples = useMemo(
    () =>
      exampleLibrary
        .filter((item) => item.category === activeCategory)
        .map((item, index) => ({ ...item, index })),
    [activeCategory]
  );

  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Example Gallery"
          title="See how the same builder adapts to different industries and career paths."
          description="Use the filter tabs to switch between role categories and preview how the same resume system changes tone and emphasis."
        />
        <div className="mt-12 flex flex-wrap gap-2">
          {exampleCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-500 ${activeCategory === category ? "bg-emerald-500 text-slate-950" : "border border-slate-900/8 bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activeExamples.map((item, index) => (
            <RevealSection key={`${item.category}-${index}`} delay={index * 70}>
              <ExampleThumbnail title={item.title} />
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}