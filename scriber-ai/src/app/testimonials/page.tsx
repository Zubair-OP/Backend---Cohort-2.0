import { SiteHeader } from "@/components/home/sections/site-header";
import { SiteFooter } from "@/components/home/sections/site-footer";

interface TestimonialCard {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
}

const TESTIMONIALS: TestimonialCard[] = [
  {
    quote: "I spent months applying with my old resume with no luck. After using Scriber Builder, I landed three interviews in the first week. The AI suggestions were a total game-changer.",
    name: "Sarah Jenkins",
    role: "Senior Product Designer at Apex",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5
  },
  {
    quote: "The ATS formatting check gave me confidence that my resume was actually being seen by recruiters. Got an offer at a top tech company within a month!",
    name: "Michael Chen",
    role: "Full Stack Engineer at Volt",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5
  },
  {
    quote: "The templates are clean, modern, and super easy to customize. It took me less than 20 minutes to craft a resume that looks like I hired a designer.",
    name: "Elena Rostova",
    role: "Marketing Strategist at Globe",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5
  },
  {
    quote: "Scriber Builder helped me highlight my achievements with quantified bullet points. I went from zero responses to 5 callbacks in two weeks.",
    name: "David Kim",
    role: "Data Analyst at Zeno",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    rating: 5
  },
  {
    quote: "As a career switcher, I was struggling to package my experience. The AI bullet generator suggested perfect wording tailored to software development.",
    name: "Amanda Vance",
    role: "Frontend Developer at Nexus",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    rating: 5
  },
  {
    quote: "Simple, fast, and extremely effective. The live preview allowed me to tune spacing and typography down to the exact detail.",
    name: "James Wilson",
    role: "Operations Director",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 5
  }
];

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <SiteHeader />

      <main className="flex-grow pt-28 pb-20 px-4 md:px-10">
        <div className="max-w-[1200px] mx-auto text-center mb-16">
          <span className="inline-flex items-center px-3 py-1 mb-4 bg-secondary-container/60 text-on-secondary-container font-label-sm rounded-full border border-secondary-container/20">
            Success Stories
          </span>
          <h1 className="font-display-lg text-on-surface mb-4">
            Loved by job seekers worldwide
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Discover how millions of professionals unlocked new career opportunities using Scriber Builder.
          </p>
        </div>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item, index) => (
            <div
              key={index}
              className="bg-surface border border-surface-variant p-8 rounded-2xl flex flex-col justify-between hover:border-primary-container transition-all shadow-sm"
            >
              <div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[20px] text-amber-500 fill">
                      star
                    </span>
                  ))}
                </div>
                <p className="font-body-lg text-on-surface italic mb-8">
                  &quot;{item.quote}&quot;
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-surface-variant/50 pt-4">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-title-md text-on-surface">{item.name}</p>
                  <p className="font-label-sm text-on-surface-variant">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
