"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/home/sections/site-header";
import { SiteFooter } from "@/components/home/sections/site-footer";

interface Template {
  id: string;
  title: string;
  category: string;
}

const TEMPLATES: Template[] = [
  { id: "classic", title: "Classic", category: "Professional" },
  { id: "formal", title: "Formal", category: "Professional" },
  { id: "creative", title: "Creative", category: "Creative" },
  { id: "precision", title: "Precision", category: "Modern" },
  { id: "capability", title: "Capability", category: "Modern" },
  { id: "purity", title: "Purity", category: "Minimalist" },
];

const CATEGORIES = ["All Templates", "Professional", "Creative", "Modern", "Minimalist"];

function ResumePreview({ templateId }: { templateId: string }) {
  if (templateId === "classic") {
    return (
      <div className="absolute inset-0 bg-white p-4 text-left overflow-hidden">
        <div className="flex items-start justify-between mb-1">
          <div>
            <div className="font-bold text-[10px] text-gray-900">Kathryn Murphy</div>
            <div className="text-[7px] text-gray-500">Software Engineer</div>
          </div>
        </div>
        <div className="text-[5.5px] text-gray-600 leading-relaxed mb-2">
          24 years of experience in software development as well as in creating innovative solutions to distributed system...
        </div>
        <div className="border-t border-gray-200 pt-2 mb-2">
          <div className="text-[6px] font-bold text-gray-800 mb-1 uppercase tracking-wider">Work Experience</div>
          <div className="space-y-1.5">
            <div>
              <div className="flex justify-between items-start">
                <div className="text-[6px] font-semibold text-gray-800">Associate software Engineer <span className="text-gray-400">· Company Name</span></div>
              </div>
              <div className="text-[5px] text-gray-400">Oct 2020 - Aug 2020</div>
              <div className="mt-0.5 space-y-px">
                <div className="h-[1.5px] w-full bg-gray-100 rounded"></div>
                <div className="h-[1.5px] w-5/6 bg-gray-100 rounded"></div>
              </div>
            </div>
            <div>
              <div className="text-[6px] font-semibold text-gray-800">Solutions Engineer <span className="text-gray-400">· Company Name</span></div>
              <div className="text-[5px] text-gray-400">May 2018 - Sep 2019</div>
              <div className="mt-0.5 space-y-px">
                <div className="h-[1.5px] w-full bg-gray-100 rounded"></div>
                <div className="h-[1.5px] w-4/5 bg-gray-100 rounded"></div>
              </div>
            </div>
            <div>
              <div className="text-[6px] font-semibold text-gray-800">Full Stack Developer <span className="text-gray-400">· Company Name</span></div>
              <div className="text-[5px] text-gray-400">Nov 2017 - May 2018</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-2 mb-2">
          <div className="text-[6px] font-bold text-gray-800 mb-1 uppercase tracking-wider">Education</div>
          <div className="text-[6px] text-gray-700 font-semibold">Princeton University</div>
          <div className="text-[5px] text-gray-400">Field of study</div>
        </div>
        <div className="border-t border-gray-200 pt-2 flex gap-4">
          <div>
            <div className="text-[6px] font-bold text-gray-800 uppercase tracking-wider mb-0.5">Skills</div>
            <div className="text-[5px] text-gray-600">Competitor analysis</div>
          </div>
          <div>
            <div className="text-[6px] font-bold text-gray-800 uppercase tracking-wider mb-0.5">Language</div>
            <div className="text-[5px] text-gray-600">Chinese · Native</div>
            <div className="text-[5px] text-gray-600">English · Professional</div>
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "formal") {
    return (
      <div className="absolute inset-0 bg-white p-4 text-left overflow-hidden">
        <div className="flex gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
          </div>
          <div className="flex-1">
            <div className="font-bold text-[10px] text-gray-900">Wade Warren</div>
            <div className="text-[5.5px] text-gray-600 leading-relaxed">
              Senior Sales professional with 25 years of experience providing assistance in office environments within (field), looking for new strategies to engage and inspire new team members and customers at (company name).
            </div>
            <div className="flex gap-2 mt-1">
              <span className="text-[5px] text-gray-400">Taipei, Taiwan</span>
              <span className="text-[5px] text-gray-400">youname.com</span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-2 mb-2">
          <div className="text-[6px] font-bold text-gray-800 mb-1 uppercase tracking-wider">Work Experience</div>
          <div className="space-y-1.5">
            <div>
              <div className="text-[6px] font-semibold text-gray-800">Senior Sales <span className="text-gray-400">· Company Name</span></div>
              <div className="text-[5px] text-gray-400">Apr 2018 - Jan 2020</div>
              <div className="mt-0.5 space-y-px">
                <div className="h-[1.5px] w-full bg-gray-100 rounded"></div>
                <div className="h-[1.5px] w-5/6 bg-gray-100 rounded"></div>
              </div>
            </div>
            <div>
              <div className="text-[6px] font-semibold text-gray-800">Senior Sales <span className="text-gray-400">· Company Name</span></div>
              <div className="text-[5px] text-gray-400">Apr 2018 - Jan 2020</div>
            </div>
            <div>
              <div className="text-[6px] font-semibold text-gray-800">Sales <span className="text-gray-400">· Company Name</span></div>
              <div className="text-[5px] text-gray-400">Apr 2018 - Jan 2020</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-2 mb-2">
          <div className="text-[6px] font-bold text-gray-800 mb-1 uppercase tracking-wider">Education</div>
          <div className="flex gap-4">
            <div>
              <div className="text-[5px] text-gray-400">Sep 2018 - Jun 2020</div>
              <div className="text-[6px] text-gray-700 font-semibold">Princeton University</div>
              <div className="text-[5px] text-gray-400">Field of study</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-2 flex gap-4">
          <div>
            <div className="text-[6px] font-bold text-gray-800 uppercase tracking-wider mb-0.5">Skills</div>
            <div className="text-[5px] text-gray-600">Competitor analysis</div>
            <div className="text-[5px] text-gray-600">Business research</div>
          </div>
          <div>
            <div className="text-[6px] font-bold text-gray-800 uppercase tracking-wider mb-0.5">Language</div>
            <div className="text-[5px] text-gray-600">Chinese · Native</div>
            <div className="text-[5px] text-gray-600">English · Professional</div>
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "creative") {
    return (
      <div className="absolute inset-0 bg-white p-4 text-left overflow-hidden">
        <div className="flex gap-2.5 mb-2">
          <div className="flex-1">
            <div className="font-bold text-[10px] text-gray-900">Jenny Wilson</div>
            <div className="text-[6px] text-gray-500 mb-1">Senior Sales professional</div>
            <div className="text-[5.5px] text-gray-600 leading-relaxed">
              Senior Sales professional with 25 years of experience providing assistance in office environments within (field), looking for new strategies to engage and inspire new team members and customers at (company name).
            </div>
            <div className="flex gap-2 mt-1">
              <span className="text-[5px] text-gray-400">Taipei, Taiwan</span>
              <span className="text-[5px] text-gray-400">youname.com</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-2 mb-2">
          <div className="text-[6px] font-bold text-gray-800 mb-1 uppercase tracking-wider">Work Experience</div>
          <div className="space-y-1.5">
            <div>
              <div className="text-[6px] font-semibold text-gray-800">Senior Sales <span className="text-gray-400">· Company Name</span></div>
              <div className="text-[5px] text-gray-400">Apr 2018 - Jan 2020</div>
              <div className="mt-0.5 space-y-px">
                <div className="h-[1.5px] w-full bg-gray-100 rounded"></div>
                <div className="h-[1.5px] w-5/6 bg-gray-100 rounded"></div>
              </div>
            </div>
            <div>
              <div className="text-[6px] font-semibold text-gray-800">Senior Sales <span className="text-gray-400">· Company Name</span></div>
              <div className="text-[5px] text-gray-400">Apr 2018 - Jan 2020</div>
            </div>
            <div>
              <div className="text-[6px] font-semibold text-gray-800">Sales <span className="text-gray-400">· Company Name</span></div>
              <div className="text-[5px] text-gray-400">Apr 2018 - Jan 2020</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 rounded h-14 mt-2"></div>
      </div>
    );
  }

  if (templateId === "precision") {
    return (
      <div className="absolute inset-0 bg-white p-4 text-left overflow-hidden">
        <div className="text-center mb-2">
          <div className="font-bold text-[10px] text-gray-900">Your Name</div>
          <div className="text-[6px] text-gray-500">Job Title</div>
          <div className="text-[5px] text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</div>
        </div>
        <div className="border-t border-gray-200 pt-2 mb-2">
          <div className="text-[6px] font-bold text-gray-800 mb-1 uppercase tracking-wider">Work Experience</div>
          <div className="space-y-1.5">
            <div>
              <div className="flex justify-between items-start">
                <div className="text-[6px] font-semibold text-gray-800">Job Title <span className="text-gray-400">· Company Name</span></div>
                <div className="text-[5px] text-gray-400">Apr 2018 - Jan 2020</div>
              </div>
              <div className="text-[5px] text-gray-400">Taipei, Taiwan</div>
              <div className="mt-0.5 space-y-px">
                <div className="h-[1.5px] w-full bg-gray-100 rounded"></div>
                <div className="h-[1.5px] w-5/6 bg-gray-100 rounded"></div>
                <div className="h-[1.5px] w-4/5 bg-gray-100 rounded"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-start">
                <div className="text-[6px] font-semibold text-gray-800">Job Title <span className="text-gray-400">· Company Name</span></div>
                <div className="text-[5px] text-gray-400">Apr 2018 - Jan 2020</div>
              </div>
              <div className="text-[5px] text-gray-400">Taipei, Taiwan</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-2 mb-2">
          <div className="text-[6px] font-bold text-gray-800 mb-1 uppercase tracking-wider">Education</div>
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[6px] text-gray-700 font-semibold">University or School</div>
              <div className="text-[5px] text-gray-400">Field of study</div>
            </div>
            <div className="text-[5px] text-gray-400">Apr 2018 - Jan 2020</div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-2 flex gap-4">
          <div>
            <div className="text-[6px] font-bold text-gray-800 uppercase tracking-wider mb-0.5">Skills</div>
            <div className="text-[5px] text-gray-600">Lorem ipsum dolor</div>
          </div>
          <div>
            <div className="text-[6px] font-bold text-gray-800 uppercase tracking-wider mb-0.5">Languages</div>
            <div className="text-[5px] text-gray-600">Chinese · English</div>
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "capability") {
    return (
      <div className="absolute inset-0 bg-white p-4 text-left overflow-hidden">
        <div className="mb-2">
          <div className="font-bold text-[10px] text-gray-900">Your Name</div>
          <div className="text-[6px] text-gray-500">Job Title</div>
        </div>
        <div className="border-t border-gray-200 pt-2 mb-2">
          <div className="text-[6px] font-bold text-gray-800 mb-1 uppercase tracking-wider">Work Experience</div>
          <div className="space-y-1.5">
            <div className="flex gap-2">
              <div className="w-14 flex-shrink-0">
                <div className="text-[5px] text-gray-400">Sep 2018 - Jun 2020</div>
                <div className="text-[5px] text-gray-400">Taipei, Taiwan</div>
              </div>
              <div className="flex-1">
                <div className="text-[6px] font-semibold text-gray-800">Job Title</div>
                <div className="text-[5px] text-gray-500">Company Name</div>
                <div className="mt-0.5 space-y-px">
                  <div className="h-[1.5px] w-full bg-gray-100 rounded"></div>
                  <div className="h-[1.5px] w-5/6 bg-gray-100 rounded"></div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-14 flex-shrink-0">
                <div className="text-[5px] text-gray-400">Sep 2018 - Jun 2020</div>
                <div className="text-[5px] text-gray-400">Taipei, Taiwan</div>
              </div>
              <div className="flex-1">
                <div className="text-[6px] font-semibold text-gray-800">Job Title</div>
                <div className="text-[5px] text-gray-500">Company Name</div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-2 mb-2">
          <div className="text-[6px] font-bold text-gray-800 mb-1 uppercase tracking-wider">Education</div>
          <div className="flex gap-2">
            <div className="w-14 flex-shrink-0">
              <div className="text-[5px] text-gray-400">Sep 2018 - Jun 2020</div>
            </div>
            <div className="flex-1">
              <div className="text-[6px] text-gray-700 font-semibold">University or School</div>
              <div className="text-[5px] text-gray-400">Field of study</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-2 flex gap-4">
          <div>
            <div className="text-[6px] font-bold text-gray-800 uppercase tracking-wider mb-0.5">Skills</div>
            <div className="text-[5px] text-gray-600">Lorem ipsum dolor</div>
          </div>
          <div>
            <div className="text-[6px] font-bold text-gray-800 uppercase tracking-wider mb-0.5">Languages</div>
            <div className="text-[5px] text-gray-600">Chinese · English</div>
          </div>
        </div>
      </div>
    );
  }

  // purity
  return (
    <div className="absolute inset-0 bg-white p-4 text-left overflow-hidden">
      <div className="text-center mb-2">
        <div className="font-bold text-[10px] text-gray-900">Your Name</div>
        <div className="text-[5px] text-gray-400">Taipei, Taiwan | +886 910 123456 | yourname@youremail.com</div>
      </div>
      <div className="text-[5.5px] text-gray-500 text-center mb-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
      </div>
      <div className="border-t border-gray-200 pt-2 mb-2">
        <div className="text-[6px] font-bold text-gray-800 mb-1 uppercase tracking-wider">Work Experience</div>
        <div className="space-y-1.5">
          <div>
            <div className="text-[6px] font-semibold text-gray-800">Job Title <span className="text-gray-400">· Company Name</span></div>
            <div className="text-[5px] text-gray-400">Apr 2018 · Jan 2020 | Taipei, Taiwan</div>
            <div className="mt-0.5 space-y-px">
              <div className="h-[1.5px] w-full bg-gray-100 rounded"></div>
              <div className="h-[1.5px] w-5/6 bg-gray-100 rounded"></div>
              <div className="h-[1.5px] w-4/5 bg-gray-100 rounded"></div>
            </div>
          </div>
          <div>
            <div className="text-[6px] font-semibold text-gray-800">Job Title <span className="text-gray-400">· Company Name</span></div>
            <div className="text-[5px] text-gray-400">Apr 2018 · Jan 2020 | Taipei, Taiwan</div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-2 mb-2">
        <div className="text-[6px] font-bold text-gray-800 mb-1 uppercase tracking-wider">Education</div>
        <div className="text-[6px] text-gray-700 font-semibold">University or School</div>
        <div className="text-[5px] text-gray-400">Field of study · Apr 2018 - Jan 2020</div>
      </div>
      <div className="border-t border-gray-200 pt-2 flex gap-4">
        <div>
          <div className="text-[6px] font-bold text-gray-800 uppercase tracking-wider mb-0.5">Skills</div>
          <div className="text-[5px] text-gray-600">• Lorem ipsum dolor sit amet</div>
          <div className="text-[5px] text-gray-600">• Lorem ipsum dolor sit amet</div>
        </div>
        <div>
          <div className="text-[6px] font-bold text-gray-800 uppercase tracking-wider mb-0.5">Languages</div>
          <div className="text-[5px] text-gray-600">• Chinese</div>
          <div className="text-[5px] text-gray-600">• English</div>
        </div>
      </div>
    </div>
  );
}

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
                <div key={template.id} className="group cursor-pointer">
                  {/* Resume Preview Card */}
                  <div className="relative bg-white rounded-lg shadow-[0_2px_20px_rgba(0,0,0,0.06)] overflow-hidden mb-4 transition-shadow group-hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
                    <div className="aspect-[1/1.4] relative">
                      <ResumePreview templateId={template.id} />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Link
                          href="/signup"
                          className="bg-primary-container hover:bg-primary text-white font-title-md px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all transform translate-y-4 group-hover:translate-y-0"
                        >
                          <span>Start with this template</span>
                          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Template Label */}
                  <div className="text-center">
                    <h3 className="font-headline-md text-on-surface">{template.title}</h3>
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
