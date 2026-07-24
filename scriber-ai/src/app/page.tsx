import { SiteHeader } from "@/components/home/sections/site-header";
import { HeroSection } from "@/components/home/sections/hero-section";
import { TrustedBySection } from "@/components/home/sections/trusted-by-section";
import { FeaturesSection } from "@/components/home/sections/features-section";
import { TestimonialsSection } from "@/components/home/sections/testimonials-section";
import { CtaSection } from "@/components/home/sections/cta-section";
import { SiteFooter } from "@/components/home/sections/site-footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <SiteHeader />
      <main className="flex-grow">
        <HeroSection />
        <TrustedBySection />
        <FeaturesSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
