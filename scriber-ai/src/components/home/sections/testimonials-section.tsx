export function TestimonialsSection() {
  return (
    <section className="py-24 bg-surface-container-low overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <svg height="100%" width="100%">
          <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect fill="url(#grid)" height="100%" width="100%" />
        </svg>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-10 relative">
        <div className="max-w-4xl mx-auto text-center">
          <span className="material-symbols-outlined text-primary-container text-6xl mb-8 fill">
            format_quote
          </span>
          <blockquote className="font-headline-lg md:text-[40px] md:leading-[48px] text-on-surface italic mb-8">
            &quot;I spent months applying with my old resume with no luck. After using Scriber Builder, I landed three interviews in the first week. The AI suggestions were a total game-changer for my bullet points.&quot;
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Sarah Jenkins"
              className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover"
            />
            <div className="text-left">
              <p className="font-title-lg text-on-surface">Sarah Jenkins</p>
              <p className="font-label-lg text-primary">Senior Product Designer at Apex Solutions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}