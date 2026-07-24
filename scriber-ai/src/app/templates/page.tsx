"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/home/sections/site-header";
import { SiteFooter } from "@/components/home/sections/site-footer";

interface Template {
  id: string;
  title: string;
  category: string;
  style: string;
  rating: number;
  image: string;
}

const TEMPLATES: Template[] = [
  {
    id: "executive",
    title: "The Executive",
    category: "Professional",
    style: "Clean & Professional",
    rating: 4.9,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC24vzcBOkKCvW3okjrXeWJJiqgbu7zdaTTeE88Rh4QJ41FILmNdTMnHpt2Qk72mlPaaFPZQAfCX7xIVnMNONZCdu78tB_MfVmyYnSVGoSmnNQlMZcwQUgDg47306qTzeovvwsRWnqIUONq0r-e7Fb9B6G5Lda_4UnAb--v_aodQbhCrk12TNzUclC3_VKkGoQ-es12FlU3tkAY67JOQJl6lwWmFkRe_L8pW8dtJ2yNfs6WpqhhMUA3e8gxIz22Z6HBUPvDC_ZZXB86"
  },
  {
    id: "creative-director",
    title: "Creative Director",
    category: "Creative",
    style: "Bold & Visual",
    rating: 4.8,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1BuF4MTUWSAlL6hC58H5eO9vqSj8qf3NwP4Sja18Qi-SOovBhWEF-jq-CtygfMDDNhKs9ABFiHIkokKjmA1jzCI0luUY8bN9fVYZwS3B4-2XJjVuPwfVR3YlMtj8O-2Rtu96HZXp3HSJmtziVScx-jo_NpZ_edOMoNySA464ZhHhAMP80eAuQc0bCWfUEYIze4IQg3r_Mz3T6yAISUuidy3dNeTDXbjRVCXPEgJmDacCFFzN0VBWtRF1BGiQvRYuPM_1HL-T75vJa"
  },
  {
    id: "tech-innovator",
    title: "Tech Innovator",
    category: "Modern",
    style: "Structured & Data-driven",
    rating: 4.7,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdOmZh3DVX8ZMcwEOD2sDtG7Mgu7IEP150-I3_SPl2AWASvB6ZVRK6HxOmHJ4SS1D5BVYVEAR1SMek-Oe_zQhiurHXljxUzJfTJ5BjKqoPudAOrKyu6t6ZTTtZg2aRRSCnV8E-Ot88UNdazPLUh2LJ1KM-uOe0Q-1JP6ApinL4GWjnmpltyYBxJeNfMQG4yRl-As194zp_r--jNbPGVOufVkaGxnSyE9g84DgYBxmfVCQLNGdYlZaySPb6Oxs2vDW-I8ZiwhFLotAg"
  },
  {
    id: "minimalist-pro",
    title: "Minimalist Pro",
    category: "Minimalist",
    style: "Sleek & Elegant",
    rating: 4.9,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCdRlCC2OzBruaSy73dDUIwSZ5IoLcfToVG4xnXWW2wMBcLoepPYUL6i5gv7xmlVPl_lpmLk2BVIDZoVYwdufvMEShxbDZdg302VNobAterCYgNK8dllGsk1w-Ul7859vL4-gk9W9z4-cOAtwIr_V_gKv_7HCvUFgnQAsdGSwG2VKGke8MktnwyElWtJEMvElVUijUu4_49kjgJtdh6A6tKNuInKvhEN7DQnbL0COyxXQ1j3qHuAGZFsSdk5PK4vn2p6Qqtpz4EFnK"
  },
  {
    id: "academic-scholar",
    title: "Academic Scholar",
    category: "Academic",
    style: "Comprehensive & Classic",
    rating: 4.6,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC24vzcBOkKCvW3okjrXeWJJiqgbu7zdaTTeE88Rh4QJ41FILmNdTMnHpt2Qk72mlPaaFPZQAfCX7xIVnMNONZCdu78tB_MfVmyYnSVGoSmnNQlMZcwQUgDg47306qTzeovvwsRWnqIUONq0r-e7Fb9B6G5Lda_4UnAb--v_aodQbhCrk12TNzUclC3_VKkGoQ-es12FlU3tkAY67JOQJl6lwWmFkRe_L8pW8dtJ2yNfs6WpqhhMUA3e8gxIz22Z6HBUPvDC_ZZXB86"
  },
  {
    id: "modern-corporate",
    title: "Modern Corporate",
    category: "Professional",
    style: "ATS-Optimized & Polished",
    rating: 4.9,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdOmZh3DVX8ZMcwEOD2sDtG7Mgu7IEP150-I3_SPl2AWASvB6ZVRK6HxOmHJ4SS1D5BVYVEAR1SMek-Oe_zQhiurHXljxUzJfTJ5BjKqoPudAOrKyu6t6ZTTtZg2aRRSCnV8E-Ot88UNdazPLUh2LJ1KM-uOe0Q-1JP6ApinL4GWjnmpltyYBxJeNfMQG4yRl-As194zp_r--jNbPGVOufVkaGxnSyE9g84DgYBxmfVCQLNGdYlZaySPb6Oxs2vDW-I8ZiwhFLotAg"
  }
];

const CATEGORIES = ["All Templates", "Professional", "Creative", "Modern", "Minimalist", "Academic"];

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Templates");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((template) => {
      const matchesCategory =
        selectedCategory === "All Templates" || template.category === selectedCategory;
      const matchesSearch =
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.style.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <SiteHeader />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-surface-subtle py-16 md:py-24 px-4 md:px-10 border-b border-surface-variant">
          <div className="max-w-[1200px] mx-auto text-center">
            <h1 className="font-display-lg text-display-lg text-on-surface mb-6">
              Stand Out with Professional Resume Templates
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
              Choose from our curated collection of ATS-friendly templates designed to highlight your strengths and land you that dream job.
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
                  placeholder="Search templates by industry or style..."
                  className="w-full bg-white border border-surface-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container rounded-lg py-3.5 pl-12 pr-4 font-body-md text-body-md shadow-sm transition-all outline-none"
                />
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full font-label-sm text-label-sm transition-colors border ${
                      selectedCategory === cat
                        ? "bg-primary-container text-white border-primary-container"
                        : "bg-white text-on-surface-variant border-surface-variant hover:border-primary-container"
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
        <section className="py-16 px-4 md:px-10 bg-background">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">
                {selectedCategory === "All Templates" ? "Trending Templates" : `${selectedCategory} Templates`}
              </h2>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Sort by:</span>
                <select className="bg-white border border-surface-variant rounded-lg py-1.5 px-3 font-body-md text-body-md text-on-surface focus:border-primary-container outline-none">
                  <option>Popularity</option>
                  <option>Newest</option>
                  <option>A-Z</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="template-card group bg-white rounded-xl border border-surface-variant overflow-hidden flex flex-col relative"
                >
                  <div className="aspect-[1/1.4] relative bg-surface-container-low p-4">
                    <img
                      src={template.image}
                      alt={template.title}
                      className="w-full h-full object-cover rounded shadow-sm border border-surface-variant"
                    />
                    <div className="template-overlay absolute inset-0 bg-on-surface/80 opacity-0 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <Link
                        href="/signup"
                        className="bg-primary-container hover:bg-primary text-white font-title-md text-title-md px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit_document</span>
                        <span>Use Template</span>
                      </Link>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-title-lg text-title-lg text-on-surface">{template.title}</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant">{template.style}</p>
                      </div>
                      <span className="bg-[#e6f4ea] text-[#264433] px-2.5 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] fill">star</span>
                        {template.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
