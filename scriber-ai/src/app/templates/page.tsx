"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/home/sections/site-header";
import { SiteFooter } from "@/components/home/sections/site-footer";

interface Template {
  id: string;
  title: string;
  category: string;
  image: string;
}

const TEMPLATES: Template[] = [
  { id: "formal", title: "Formal", category: "Professional", image: "/template-formal.3d5b8a13.avif" },
  { id: "creative", title: "Creative", category: "Creative", image: "/template-creative.e656d51a.avif" },
  { id: "precision", title: "Precision", category: "Modern", image: "/template-precision.d846963e.avif" },
  { id: "capability", title: "Capability", category: "Modern", image: "/template-capability.11d18190.avif" },
  { id: "purity", title: "Purity", category: "Minimalist", image: "/template-purity.25c7c873.avif" },
];

const CATEGORIES = ["All Templates", "Professional", "Creative", "Modern", "Minimalist"];

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Templates");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((template) => {
      const matchesCategory =
        selectedCategory === "All Templates" || template.category === selectedCategory;
      const matchesSearch =
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <SiteHeader />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-28 pb-16 md:pt-36 md:pb-20 px-4 md:px-10">
          <div className="max-w-[1200px] mx-auto text-center">
            <span className="inline-flex items-center px-3 py-1 mb-4 bg-primary/5 text-primary font-label-sm rounded-full border border-primary/10">
              Templates
            </span>
            <h1 className="font-display-lg text-on-surface mb-4">
              Choose Your Resume Template
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
              Pick a template that matches your style. Each one is designed to pass ATS filters and impress recruiters.
            </p>

            {/* Search & Filters */}
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full bg-white border border-surface-variant focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 rounded-xl py-3.5 pl-12 pr-4 font-body-md shadow-sm transition-all outline-none"
                />
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full font-label-sm transition-all ${
                      selectedCategory === cat
                        ? "bg-primary-container text-white"
                        : "bg-white text-on-surface-variant border border-surface-variant hover:border-primary-container/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Template Grid Section */}
        <section className="pb-24 px-4 md:px-10">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-headline-lg text-on-surface">
                {selectedCategory === "All Templates" ? "All Templates" : `${selectedCategory} Templates`}
              </h2>
              <span className="font-label-lg text-on-surface-variant">
                {filteredTemplates.length} templates
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filteredTemplates.map((template) => (
                <Link
                  key={template.id}
                  href={`/builder?template=${template.id}`}
                  className="group cursor-pointer block"
                >
                  {/* Resume Preview Card */}
                  <div className="relative bg-white rounded-lg shadow-[0_2px_20px_rgba(0,0,0,0.06)] overflow-hidden mb-4 transition-all duration-300 group-hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] group-hover:scale-[1.02]">
                    <div className="aspect-[1/1.4] relative overflow-hidden">
                      <Image
                        src={template.image}
                        alt={`${template.title} resume template preview`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        quality={85}
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-8">
                        <span className="bg-primary-container hover:bg-primary text-white font-title-md px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all transform translate-y-4 group-hover:translate-y-0">
                          <span>Start with this template</span>
                          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Template Label */}
                  <div className="text-center">
                    <h3 className="font-headline-md text-on-surface group-hover:text-primary transition-colors">{template.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
