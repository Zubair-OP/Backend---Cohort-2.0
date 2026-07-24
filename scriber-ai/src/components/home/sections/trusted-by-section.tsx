export function TrustedBySection() {
  return (
    <section className="py-12 bg-surface-subtle border-y border-surface-variant">
      <div className="max-w-[1200px] mx-auto px-4 md:px-10">
        <p className="text-center font-label-lg text-label-lg text-on-surface-variant mb-10 tracking-wider">
          TRUSTED BY OVER 5 MILLION JOB SEEKERS AT COMPANIES LIKE
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="font-bold text-2xl tracking-tighter text-on-surface">VOLT</span>
          <span className="font-extrabold text-2xl tracking-tight text-on-surface">GLOBE</span>
          <span className="font-medium text-2xl italic tracking-wide text-on-surface">Nexus</span>
          <span className="font-bold text-2xl underline decoration-primary underline-offset-4 text-on-surface">Apex</span>
          <span className="font-light text-3xl tracking-widest uppercase text-on-surface">Zeno</span>
        </div>
      </div>
    </section>
  );
}