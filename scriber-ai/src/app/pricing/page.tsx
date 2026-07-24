import Link from "next/link";
import { SiteHeader } from "@/components/home/sections/site-header";
import { SiteFooter } from "@/components/home/sections/site-footer";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <SiteHeader />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-4 md:px-10 max-w-[1200px] mx-auto text-center">
          <h1 className="font-display-lg text-display-lg md:text-[56px] font-bold text-on-surface mb-4">
            Invest in your career growth
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12">
            Choose the perfect plan to build a standout resume, get AI-driven insights, and land your dream job faster. No hidden fees.
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="px-4 md:px-10 max-w-[1200px] mx-auto pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Free Tier */}
            <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-8 flex flex-col h-full hover:shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-shadow">
              <div className="mb-6">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Free</h2>
                <p className="font-body-md text-body-md text-on-surface-variant h-10">
                  Essential tools for getting started.
                </p>
              </div>
              <div className="mb-8">
                <span className="font-display-lg text-display-lg font-bold text-on-surface">$0</span>
                <span className="font-body-md text-body-md text-on-surface-variant">/month</span>
              </div>
              <Link
                href="/signup"
                className="w-full text-center bg-surface-variant text-on-surface font-title-md text-title-md py-3 rounded-lg hover:bg-surface-dim transition-colors mb-8"
              >
                Get Started
              </Link>
              <ul className="space-y-4 flex-grow font-body-md text-body-md text-on-surface">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary-container text-[20px] fill">check</span>
                  <span>1 Resume Template</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary-container text-[20px] fill">check</span>
                  <span>Basic PDF Download</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary-container text-[20px] fill">check</span>
                  <span>Standard Support</span>
                </li>
              </ul>
            </div>

            {/* Pro Tier (Highlighted) */}
            <div className="bg-surface-container-lowest border-2 border-primary-container rounded-xl p-8 flex flex-col h-full relative shadow-lg transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-container text-white font-label-sm text-label-sm px-4 py-1 rounded-full uppercase tracking-wider font-bold">
                Most Popular
              </div>
              <div className="mb-6">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Pro</h2>
                <p className="font-body-md text-body-md text-on-surface-variant h-10">
                  Advanced features to stand out.
                </p>
              </div>
              <div className="mb-8">
                <span className="font-display-lg text-display-lg font-bold text-on-surface">$12</span>
                <span className="font-body-md text-body-md text-on-surface-variant">/month</span>
              </div>
              <Link
                href="/signup"
                className="w-full text-center bg-primary-container text-white font-title-md text-title-md py-3 rounded-lg hover:bg-primary transition-colors mb-8"
              >
                Start Free Trial
              </Link>
              <ul className="space-y-4 flex-grow font-body-md text-body-md text-on-surface">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary-container text-[20px] fill">check</span>
                  <span className="font-bold">AI Resume Suggestions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary-container text-[20px] fill">check</span>
                  <span>Unlimited Downloads (PDF, Word)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary-container text-[20px] fill">check</span>
                  <span>Access to all Premium Templates</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary-container text-[20px] fill">check</span>
                  <span>Cover Letter Builder</span>
                </li>
              </ul>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-8 flex flex-col h-full hover:shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-shadow">
              <div className="mb-6">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Enterprise</h2>
                <p className="font-body-md text-body-md text-on-surface-variant h-10">
                  For agencies and coaching teams.
                </p>
              </div>
              <div className="mb-8">
                <span className="font-display-lg text-display-lg font-bold text-on-surface">$49</span>
                <span className="font-body-md text-body-md text-on-surface-variant">/month</span>
              </div>
              <a
                href="mailto:sales@cakebuilder.com"
                className="w-full text-center bg-surface-variant text-on-surface font-title-md text-title-md py-3 rounded-lg hover:bg-surface-dim transition-colors mb-8"
              >
                Contact Sales
              </a>
              <ul className="space-y-4 flex-grow font-body-md text-body-md text-on-surface">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary-container text-[20px] fill">check</span>
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary-container text-[20px] fill">check</span>
                  <span>Custom Domains</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary-container text-[20px] fill">check</span>
                  <span>Team Collaboration Tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary-container text-[20px] fill">check</span>
                  <span>Priority 24/7 Support</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
