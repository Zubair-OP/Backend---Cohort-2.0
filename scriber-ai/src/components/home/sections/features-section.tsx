export function FeaturesSection() {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-10 text-center mb-16 relative z-10">
        <span className="inline-flex items-center px-3 py-1 mb-4 bg-primary/5 text-primary font-label-sm rounded-full border border-primary/10">
          Features
        </span>
        <h2 className="font-display-lg text-on-surface mb-4">
          Everything you need to get hired
        </h2>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Our toolkit is designed to eliminate the guesswork and help you present your best professional self.
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {/* Feature 1 - Double Bezel Architecture */}
        <div className="p-1.5 bg-white/50 backdrop-blur-sm rounded-[1.25rem] border border-surface-variant/40 hover:border-primary-container/40 transition-all group">
          <div className="bg-white rounded-[1rem] p-8 border border-surface-variant/20">
            <div className="w-12 h-12 bg-secondary-container/60 rounded-xl flex items-center justify-center mb-5 text-primary">
              <span className="material-symbols-outlined text-[28px]">description</span>
            </div>
            <h3 className="font-title-lg text-on-surface mb-3">Expert-Approved Templates</h3>
            <p className="font-body-md text-on-surface-variant">
              Handcrafted layouts designed by recruitment experts to bypass ATS filters and catch human eyes.
            </p>
          </div>
        </div>

        {/* Feature 2 - Double Bezel Architecture */}
        <div className="p-1.5 bg-white/50 backdrop-blur-sm rounded-[1.25rem] border border-surface-variant/40 hover:border-primary-container/40 transition-all group">
          <div className="bg-white rounded-[1rem] p-8 border border-surface-variant/20">
            <div className="w-12 h-12 bg-secondary-container/60 rounded-xl flex items-center justify-center mb-5 text-primary">
              <span className="material-symbols-outlined text-[28px]">psychology</span>
            </div>
            <h3 className="font-title-lg text-on-surface mb-3">AI-Powered Suggestions</h3>
            <p className="font-body-md text-on-surface-variant">
              Smart writing tips and keyword optimization to help you describe your achievements with impact.
            </p>
          </div>
        </div>

        {/* Feature 3 - Double Bezel Architecture */}
        <div className="p-1.5 bg-white/50 backdrop-blur-sm rounded-[1.25rem] border border-surface-variant/40 hover:border-primary-container/40 transition-all group">
          <div className="bg-white rounded-[1rem] p-8 border border-surface-variant/20">
            <div className="w-12 h-12 bg-secondary-container/60 rounded-xl flex items-center justify-center mb-5 text-primary">
              <span className="material-symbols-outlined text-[28px]">tune</span>
            </div>
            <h3 className="font-title-lg text-on-surface mb-3">Easy Customization</h3>
            <p className="font-body-md text-on-surface-variant">
              Drag-and-drop interface that makes adjusting margins, colors, and layouts feel like magic.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}