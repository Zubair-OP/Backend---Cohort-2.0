export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-[1200px] mx-auto px-4 md:px-10 text-center mb-16">
        <h2 className="font-headline-lg text-headline-lg mb-4 text-on-surface">
          Everything you need to get hired
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Our toolkit is designed to eliminate the guesswork and help you present your best professional self.
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Feature 1 */}
        <div className="bg-surface border border-surface-variant p-8 rounded-2xl hover:border-primary transition-all group shadow-sm">
          <div className="w-14 h-14 bg-secondary-container rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-4xl">description</span>
          </div>
          <h3 className="font-title-lg text-title-lg mb-3 text-on-surface">Expert-Approved Templates</h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Handcrafted layouts designed by recruitment experts to bypass ATS filters and catch human eyes.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-surface border border-surface-variant p-8 rounded-2xl hover:border-primary transition-all group shadow-sm">
          <div className="w-14 h-14 bg-secondary-container rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-4xl">psychology</span>
          </div>
          <h3 className="font-title-lg text-title-lg mb-3 text-on-surface">AI-Powered Suggestions</h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Smart writing tips and keyword optimization to help you describe your achievements with impact.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-surface border border-surface-variant p-8 rounded-2xl hover:border-primary transition-all group shadow-sm">
          <div className="w-14 h-14 bg-secondary-container rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-4xl">tune</span>
          </div>
          <h3 className="font-title-lg text-title-lg mb-3 text-on-surface">Easy Customization</h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Drag-and-drop interface that makes adjusting margins, colors, and layouts feel like magic.
          </p>
        </div>
      </div>
    </section>
  );
}