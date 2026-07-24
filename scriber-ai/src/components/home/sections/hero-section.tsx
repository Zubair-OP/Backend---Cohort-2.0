import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 bg-surface">
      <div className="max-w-[1200px] mx-auto px-4 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="z-10">
          <span className="inline-block px-3 py-1 mb-6 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm rounded-full">
            New AI-Powered Builder 2.0
          </span>
          <h1 className="font-display-lg text-display-lg md:text-[64px] md:leading-[72px] mb-6 text-on-surface">
            Build a Resume That <span className="text-primary">Lands Your Dream Job</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl">
            Stand out from the crowd with professional, recruiter-approved templates. Our easy-to-use editor and AI suggestions help you create a job-winning resume in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup"
              className="bg-primary-container text-white px-8 py-4 rounded-xl font-title-lg text-title-lg flex items-center justify-center gap-2 hover:bg-primary hover:shadow-lg transition-all"
            >
              <span>Build My Resume</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link
              href="/templates"
              className="border border-outline text-on-surface-variant px-8 py-4 rounded-xl font-title-lg text-title-lg hover:bg-surface-container transition-all flex items-center justify-center"
            >
              View Templates
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-3 text-on-surface-variant">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-container/20 flex items-center justify-center text-[10px] font-bold text-primary">SJ</div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-secondary-container flex items-center justify-center text-[10px] font-bold text-secondary">MR</div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-tertiary-container flex items-center justify-center text-[10px] font-bold text-tertiary">AK</div>
            </div>
            <span className="font-label-lg text-label-lg">Joined by 500+ job seekers today</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-secondary-container opacity-30 blur-3xl rounded-full"></div>
          <div className="bg-white p-4 md:p-8 rounded-2xl border border-surface-variant shadow-xl relative animate-float">
            <img
              className="w-full h-auto rounded-lg shadow-sm border border-surface-subtle object-cover"
              alt="CakeBuilder Resume Mockup"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCdRlCC2OzBruaSy73dDUIwSZ5IoLcfToVG4xnXWW2wMBcLoepPYUL6i5gv7xmlVPl_lpmLk2BVIDZoVYwdufvMEShxbDZdg302VNobAterCYgNK8dllGsk1w-Ul7859vL4-gk9W9z4-cOAtwIr_V_gKv_7HCvUFgnQAsdGSwG2VKGke8MktnwyElWtJEMvElVUijUu4_49kjgJtdh6A6tKNuInKvhEN7DQnbL0COyxXQ1j3qHuAGZFsSdk5PK4vn2p6Qqtpz4EFnK"
            />
          </div>
        </div>
      </div>
    </section>
  );
}