import { SiteHeader } from "@/components/home/sections/site-header";
import { HeroSection } from "@/components/home/sections/hero-section";
import { TrustedBySection } from "@/components/home/sections/trusted-by-section";
import { FeaturesSection } from "@/components/home/sections/features-section";
import { TestimonialsSection } from "@/components/home/sections/testimonials-section";
import { CtaSection } from "@/components/home/sections/cta-section";
import { SiteFooter } from "@/components/home/sections/site-footer";

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Scriber AI Resume Builder",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description": "Build a professional, ATS-optimized resume in minutes with AI-powered suggestions. Recruiter-approved templates that help you land your dream job.",
  "url": "https://scriber.ai",
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "0",
    "highPrice": "49",
    "priceCurrency": "USD",
    "offerCount": "3"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "2847"
  },
  "author": {
    "@type": "Organization",
    "name": "Scriber AI"
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does it take to build a resume with Scriber AI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most users create a professional, ATS-optimized resume in under 15 minutes. Our AI suggestions help you write compelling bullet points instantly, so you spend less time staring at a blank page."
      }
    },
    {
      "@type": "Question",
      "name": "Will my resume pass ATS screening software?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Every template is designed to pass Applicant Tracking Systems. Our AI scores your resume's ATS compatibility and suggests improvements to ensure recruiters actually see your application."
      }
    },
    {
      "@type": "Question",
      "name": "What makes Scriber AI different from other resume builders?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We combine AI-powered content suggestions with recruiter-approved templates. Unlike generic builders, our system analyzes your experience and suggests quantified achievements that hiring managers actually want to see."
      }
    },
    {
      "@type": "Question",
      "name": "Can I download my resume as a PDF?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Download unlimited PDFs on the Pro plan. Free users can download one resume. All downloads are print-ready and maintain perfect formatting across all devices."
      }
    },
    {
      "@type": "Question",
      "name": "How many resume templates are available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer 18+ professional templates across categories like Modern, Creative, Executive, and Minimalist. Each template is designed by recruitment experts to highlight your strengths and bypass ATS filters."
      }
    }
  ]
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <SiteHeader />
      <main className="flex-grow">
        <HeroSection />
        <TrustedBySection />
        <FeaturesSection />

        {/* Pain Point Section - Emotional Copy */}
        <section className="py-24 md:py-32 bg-surface-subtle">
          <div className="max-w-[1200px] mx-auto px-4 md:px-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-flex items-center px-3 py-1 mb-4 bg-red-50 text-red-600 font-label-sm rounded-full border border-red-100">
                Sound familiar?
              </span>
              <h2 className="font-display-lg text-on-surface mb-4">
                Tired of sending resumes that never get a response?
              </h2>
              <p className="font-body-lg text-on-surface-variant">
                You&apos;re qualified. You&apos;re experienced. But your resume gets lost in the void.
                Meanwhile, less qualified candidates are landing interviews because they know
                how to play the ATS game.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-surface-variant">
                <div className="text-3xl mb-4">😤</div>
                <h3 className="font-title-lg text-on-surface mb-2">Zero callbacks</h3>
                <p className="font-body-md text-on-surface-variant">
                  You&apos;ve sent 50+ applications and heard back from exactly zero companies.
                  The silence is deafening.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-surface-variant">
                <div className="text-3xl mb-4">😰</div>
                <h3 className="font-title-lg text-on-surface mb-2">ATS rejection</h3>
                <p className="font-body-md text-on-surface-variant">
                  Your beautifully designed resume gets auto-rejected by robots before
                  a human ever sees it.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-surface-variant">
                <div className="text-3xl mb-4">🤯</div>
                <h3 className="font-title-lg text-on-surface mb-2">Resume writer&apos;s block</h3>
                <p className="font-body-md text-on-surface-variant">
                  Staring at a blank page, struggling to describe your achievements
                  without sounding like everyone else.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section - Outcome-Focused */}
        <section className="py-24 md:py-32 bg-background">
          <div className="max-w-[1200px] mx-auto px-4 md:px-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-flex items-center px-3 py-1 mb-4 bg-emerald-50 text-emerald-600 font-label-sm rounded-full border border-emerald-100">
                The solution
              </span>
              <h2 className="font-display-lg text-on-surface mb-4">
                Land 3x more interviews with an ATS-optimized resume
              </h2>
              <p className="font-body-lg text-on-surface-variant">
                Our AI analyzes thousands of successful resumes to suggest the exact
                words, achievements, and keywords that get you noticed. Stop guessing.
                Start landing.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                  </div>
                  <div>
                    <h3 className="font-title-lg text-on-surface mb-1">AI writes your bullet points</h3>
                    <p className="font-body-md text-on-surface-variant">
                      Describe your role in plain language. Our AI transforms it into
                      quantified achievements hiring managers actually want to see.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                  </div>
                  <div>
                    <h3 className="font-title-lg text-on-surface mb-1">ATS score in real-time</h3>
                    <p className="font-body-md text-on-surface-variant">
                      See exactly how your resume performs against Applicant Tracking Systems
                      before you send it. Fix issues instantly.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                  </div>
                  <div>
                    <h3 className="font-title-lg text-on-surface mb-1">Recruiter-approved templates</h3>
                    <p className="font-body-md text-on-surface-variant">
                      18+ templates designed by people who actually hire. Not designers
                      who&apos;ve never reviewed a resume.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-950 rounded-2xl p-8 text-white">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-emerald-400 mb-2">98/100</div>
                  <div className="text-sm text-white/60">ATS Compatibility Score</div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Keywords matched</span>
                    <span className="text-emerald-400 font-semibold">42</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Formatting score</span>
                    <span className="text-emerald-400 font-semibold">100%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Readability</span>
                    <span className="text-emerald-400 font-semibold">Excellent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Numbers */}
        <section className="py-16 bg-surface-container-low border-y border-surface-variant">
          <div className="max-w-[1200px] mx-auto px-4 md:px-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="font-display-xl text-primary mb-2">5M+</div>
                <div className="font-label-lg text-on-surface-variant">Resumes Created</div>
              </div>
              <div>
                <div className="font-display-xl text-primary mb-2">73%</div>
                <div className="font-label-lg text-on-surface-variant">More Interview Callbacks</div>
              </div>
              <div>
                <div className="font-display-xl text-primary mb-2">4.9/5</div>
                <div className="font-label-lg text-on-surface-variant">User Rating</div>
              </div>
              <div>
                <div className="font-display-xl text-primary mb-2">&lt;15min</div>
                <div className="font-label-lg text-on-surface-variant">Average Build Time</div>
              </div>
            </div>
          </div>
        </section>

        <TestimonialsSection />

        {/* FAQ Section - Local Search Intent */}
        <section className="py-24 md:py-32 bg-background">
          <div className="max-w-[800px] mx-auto px-4 md:px-10">
            <div className="text-center mb-12">
              <span className="inline-flex items-center px-3 py-1 mb-4 bg-surface-container text-on-surface font-label-sm rounded-full border border-surface-variant">
                Common Questions
              </span>
              <h2 className="font-display-lg text-on-surface">
                Frequently asked questions
              </h2>
            </div>

            <div className="space-y-4">
              <details className="group border border-surface-variant rounded-xl overflow-hidden">
                <summary className="px-6 py-4 font-title-lg text-on-surface cursor-pointer hover:bg-surface-subtle transition-colors list-none flex justify-between items-center">
                  How long does it take to build a resume?
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-6 pb-4 font-body-md text-on-surface-variant">
                  Most users create a professional, ATS-optimized resume in under 15 minutes.
                  Our AI suggestions help you write compelling bullet points instantly, so you
                  spend less time staring at a blank page.
                </div>
              </details>

              <details className="group border border-surface-variant rounded-xl overflow-hidden">
                <summary className="px-6 py-4 font-title-lg text-on-surface cursor-pointer hover:bg-surface-subtle transition-colors list-none flex justify-between items-center">
                  Will my resume pass ATS screening software?
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-6 pb-4 font-body-md text-on-surface-variant">
                  Yes. Every template is designed to pass Applicant Tracking Systems. Our AI
                  scores your resume&apos;s ATS compatibility and suggests improvements to ensure
                  recruiters actually see your application.
                </div>
              </details>

              <details className="group border border-surface-variant rounded-xl overflow-hidden">
                <summary className="px-6 py-4 font-title-lg text-on-surface cursor-pointer hover:bg-surface-subtle transition-colors list-none flex justify-between items-center">
                  What makes Scriber AI different from other resume builders?
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-6 pb-4 font-body-md text-on-surface-variant">
                  We combine AI-powered content suggestions with recruiter-approved templates.
                  Unlike generic builders, our system analyzes your experience and suggests
                  quantified achievements that hiring managers actually want to see.
                </div>
              </details>

              <details className="group border border-surface-variant rounded-xl overflow-hidden">
                <summary className="px-6 py-4 font-title-lg text-on-surface cursor-pointer hover:bg-surface-subtle transition-colors list-none flex justify-between items-center">
                  Can I download my resume as a PDF?
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-6 pb-4 font-body-md text-on-surface-variant">
                  Yes. Download unlimited PDFs on the Pro plan. Free users can download one
                  resume. All downloads are print-ready and maintain perfect formatting across
                  all devices.
                </div>
              </details>

              <details className="group border border-surface-variant rounded-xl overflow-hidden">
                <summary className="px-6 py-4 font-title-lg text-on-surface cursor-pointer hover:bg-surface-subtle transition-colors list-none flex justify-between items-center">
                  How many resume templates are available?
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-6 pb-4 font-body-md text-on-surface-variant">
                  We offer 18+ professional templates across categories like Modern, Creative,
                  Executive, and Minimalist. Each template is designed by recruitment experts
                  to highlight your strengths and bypass ATS filters.
                </div>
              </details>
            </div>
          </div>
        </section>

        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
