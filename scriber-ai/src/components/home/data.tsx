export type Template = {
  name: string;
  description: string;
  tier: "free" | "pro";
};

export type FaqItem = {
  question: string;
  answer: React.ReactNode;
};

export const navSections = ["Jobs", "Companies", "Tools", "Resources", "Hire"];

export const logoWall = [
  "Google",
  "Stripe",
  "Notion",
  "Airbnb",
  "Figma",
  "OpenAI",
  "Linear",
  "Ramp",
  "Vercel",
  "GitHub",
  "Shopify",
  "Datadog",
  "Zendesk",
  "Attio",
  "Miro",
  "Lattice",
];

export const featureCards = [
  {
    title: "AI-Powered Editing",
    description:
      "Rewrite bullets, summaries, and achievements with a recruiter-grade assistant that keeps your voice intact while making every line sharper.",
  },
  {
    title: "Beat ATS Screening",
    description:
      "Score against common ATS patterns, identify weak keywords, and fix gaps before a recruiter ever sees your resume.",
  },
  {
    title: "Skip Hours of Formatting",
    description:
      "Move from blank page to polished PDF in minutes with structure, spacing, and typography handled automatically.",
  },
  {
    title: "Resume Analytics",
    description:
      "Track edits, compare versions, and see where your resume is improving so you can ship with confidence.",
  },
  {
    title: "Your Data Stays Safe",
    description:
      "Keep private career data under your control with secure auth, protected storage, and no unnecessary sharing.",
  },
  {
    title: "Free Download & Easy Sharing",
    description:
      "Export instantly, share a clean link, and send one resume to multiple opportunities without reformatting anything.",
  },
  {
    title: "Impress on Every Screen",
    description:
      "Responsive templates stay crisp on desktop, tablet, and mobile so your story looks professional everywhere it appears.",
  },
];

export const templates: Template[] = [
  { name: "Precision", description: "A sharp editorial layout with disciplined spacing for high-signal résumés.", tier: "free" },
  { name: "Capability", description: "Balanced and modern with a strong headline area and concise proof points.", tier: "free" },
  { name: "Purity", description: "Minimal and airy for candidates who want maximum readability and calm structure.", tier: "free" },
  { name: "Classic", description: "A timeless format that feels familiar to recruiters and easy to scan at a glance.", tier: "free" },
  { name: "Formal", description: "Designed for traditional industries where clarity, hierarchy, and trust matter most.", tier: "free" },
  { name: "Creative", description: "A refined visual system with enough personality to stand out without hurting ATS readability.", tier: "free" },
  { name: "Modern", description: "A confident contemporary layout built for product, design, and operations roles.", tier: "free" },
  { name: "Minimalist", description: "Quiet, focused, and stripped down to the essentials for maximum impact.", tier: "free" },
  { name: "Infographic", description: "Adds structured data visual cues while keeping the experience professional and scannable.", tier: "free" },
  { name: "Unique", description: "A subtle asymmetric composition for candidates who want memorable presentation without clutter.", tier: "free" },
  { name: "International", description: "Built for multi-market applications with a clean, globally legible hierarchy.", tier: "free" },
  { name: "Experienced", description: "Highlights long careers with stronger section separation and deeper evidence blocks.", tier: "free" },
  { name: "Academic", description: "Ideal for research, teaching, and graduate profiles with publication-friendly spacing.", tier: "free" },
  { name: "Entry-Level", description: "Optimized for internships and first roles with more emphasis on projects and skills.", tier: "free" },
  { name: "Successful", description: "A confident layout that foregrounds outcomes, wins, and measurable achievements.", tier: "free" },
  { name: "Steadfast", description: "A premium, highly structured format with broader spacing and stronger visual weight.", tier: "pro" },
  { name: "Neat", description: "A polished premium design with precise alignment and elevated editorial spacing.", tier: "pro" },
  { name: "Outstanding", description: "The most polished tier, with extra refinement for executive-level presentation.", tier: "pro" },
];

export const exampleCategories = [
  "Bio/Medical",
  "Construction",
  "Customer Service",
  "Design",
  "Education",
  "Engineering",
  "Finance",
  "Catering/F&B",
  "HR",
  "IT",
  "Law",
  "Logistics/Trade",
  "Management/Business",
  "Manufacturing",
  "Marketing/Advertising",
  "Media/Communication",
  "Public Social Work",
  "Sales",
];

export const exampleLibrary = exampleCategories.flatMap((category, categoryIndex) =>
  Array.from({ length: 4 }, (_, exampleIndex) => ({
    category,
    title: `${category} Resume ${exampleIndex + 1}`,
    description:
      exampleIndex % 2 === 0
        ? "A tailored example that balances clarity, domain language, and recruiter-friendly hierarchy."
        : "Designed to show how the same core story changes shape when the role changes.",
    variant: `${categoryIndex}-${exampleIndex}`,
  }))
);

export const testimonials = [
  {
    quote:
      "I went from rewriting the same resume for hours to shipping clean versions in one sitting. The ATS feedback actually made the edits obvious.",
    name: "Maya Chen",
    title: "Product Manager",
  },
  {
    quote:
      "The layout felt premium immediately, and the AI suggestions were surprisingly practical instead of generic filler.",
    name: "Jaden Brooks",
    title: "Software Engineer",
  },
  {
    quote:
      "I liked that it kept the resume readable while still pushing the language much closer to recruiter expectations.",
    name: "Sofia Patel",
    title: "Marketing Lead",
  },
  {
    quote:
      "The templates and checker together removed the usual guesswork. I could build, test, and export without bouncing between tools.",
    name: "Ethan Rivera",
    title: "Operations Director",
  },
];

export const comparisonRows = [
  ["AI-powered editing", "✓", "Limited"],
  ["Extensive templates & snippets library", "✓", "✓"],
  ["Cross-device compatibility", "✓", "Limited"],
  ["Intuitive drag-and-drop visual editor", "✓", "Limited"],
  ["Shareable link", "✓", "Limited"],
  ["Auto-formatting resume", "✓", "Limited"],
  ["AI Resume Checker", "✓", "Limited"],
  ["Free to use", "✓", "Limited"],
  ["Analytics & tracking tools", "✓", ""],
  ["Multimedia support", "✓", "Limited"],
];

export const faqItems: FaqItem[] = [
  {
    question: "How does the AI resume builder help me get more interviews?",
    answer: (
      <div className="space-y-3 text-sm leading-7 text-slate-600">
        <p>
          It rewrites your content with stronger phrasing, tighter hierarchy, and more role-relevant keywords so your resume reads like a better match.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Cleaner structure:</strong> recruiters can scan the page faster.</li>
          <li><strong>Better keyword fit:</strong> ATS systems find more of the language they expect.</li>
          <li><strong>Sharper proof:</strong> accomplishments are framed in a more persuasive way.</li>
        </ul>
      </div>
    ),
  },
  {
    question: "Can I use it for free?",
    answer: (
      <div className="space-y-3 text-sm leading-7 text-slate-600">
        <p>
          Yes. You can start with the core builder, choose from the free template set, and export without paying.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Free tools:</strong> builder, templates, and basic resume checker.</li>
          <li><strong>Upgrade path:</strong> premium templates and advanced presentation options.</li>
          <li><strong>No friction:</strong> you can test the product before committing.</li>
        </ul>
      </div>
    ),
  },
  {
    question: "Will my resume still pass ATS filters?",
    answer: (
      <div className="space-y-3 text-sm leading-7 text-slate-600">
        <p>
          The system keeps the layout clean and uses structured content patterns that ATS parsers can read reliably.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>No hidden clutter:</strong> important content stays in the text layer.</li>
          <li><strong>Stable hierarchy:</strong> headings, bullets, and sections stay predictable.</li>
          <li><strong>Keyword support:</strong> you can improve relevance without stuffing.</li>
        </ul>
      </div>
    ),
  },
  {
    question: "What makes Cake different from other resume builders?",
    answer: (
      <div className="space-y-3 text-sm leading-7 text-slate-600">
        <p>
          Cake combines editing, scoring, template selection, and sharing into one workflow instead of making you jump across separate tools.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Single workflow:</strong> edit, check, and export from the same place.</li>
          <li><strong>Premium templates:</strong> more polished options without extra design work.</li>
          <li><strong>Career context:</strong> the product is tuned around resume outcomes, not generic documents.</li>
        </ul>
      </div>
    ),
  },
  {
    question: "Can I keep my data private?",
    answer: (
      <div className="space-y-3 text-sm leading-7 text-slate-600">
        <p>
          Yes. Private profile information is meant to stay under your control, and the product avoids unnecessary exposure of sensitive data.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Protected sessions:</strong> only authenticated users can access personal records.</li>
          <li><strong>Minimal sharing:</strong> sharing is intentional and user-driven.</li>
          <li><strong>Career-first design:</strong> the system is built around private job search workflows.</li>
        </ul>
      </div>
    ),
  },
  {
    question: "Does the AI change my voice?",
    answer: (
      <div className="space-y-3 text-sm leading-7 text-slate-600">
        <p>
          It aims to strengthen your existing content rather than flatten it into generic corporate language.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Preserves meaning:</strong> the core facts stay intact.</li>
          <li><strong>Tightens phrasing:</strong> filler is removed and weak language is replaced.</li>
          <li><strong>Role-aware:</strong> summaries, projects, and experience get treated differently.</li>
        </ul>
      </div>
    ),
  },
  {
    question: "Can I build resumes for different roles?",
    answer: (
      <div className="space-y-3 text-sm leading-7 text-slate-600">
        <p>
          Yes. The template library and example gallery are intended to help you shift between industries, levels, and role families quickly.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Role-based examples:</strong> use the gallery for faster tailoring.</li>
          <li><strong>Template variety:</strong> pick a layout that matches the job level.</li>
          <li><strong>Reusable content:</strong> you can keep your base profile and swap the positioning.</li>
        </ul>
      </div>
    ),
  },
  {
    question: "How do I choose the right template?",
    answer: (
      <div className="space-y-3 text-sm leading-7 text-slate-600">
        <p>
          Choose based on the role, seniority, and how much content you need to show.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Entry-level:</strong> use a cleaner layout with more room for projects.</li>
          <li><strong>Experienced:</strong> select a format that supports deeper work history.</li>
          <li><strong>Creative roles:</strong> a more distinctive visual system can help without becoming noisy.</li>
        </ul>
      </div>
    ),
  },
  {
    question: "Can I share my resume as a link?",
    answer: (
      <div className="space-y-3 text-sm leading-7 text-slate-600">
        <p>
          Yes. You can share a versioned resume link instead of sending a fresh file every time you apply.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Easy review:</strong> others can view the latest version without downloading.</li>
          <li><strong>Less friction:</strong> no need to attach repeated documents.</li>
          <li><strong>Better iteration:</strong> update once and share again instantly.</li>
        </ul>
      </div>
    ),
  },
  {
    question: "What does the AI Resume Checker do?",
    answer: (
      <div className="space-y-3 text-sm leading-7 text-slate-600">
        <p>
          It inspects your resume for likely weaknesses before you send it out and gives you targeted improvement points.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Personalized report:</strong> see where your content is weak.</li>
          <li><strong>One-click edits:</strong> turn insights into revisions quickly.</li>
          <li><strong>ATS-minded review:</strong> the checker focuses on job-search relevance.</li>
        </ul>
      </div>
    ),
  },
  {
    question: "Can I use it on mobile?",
    answer: (
      <div className="space-y-3 text-sm leading-7 text-slate-600">
        <p>
          The layout is fully responsive, so you can review, edit, and export from smaller screens without breaking the experience.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Mobile-safe layouts:</strong> sections stack cleanly.</li>
          <li><strong>Readable cards:</strong> content stays legible on narrow viewports.</li>
          <li><strong>Fast access:</strong> resume updates are still available on the go.</li>
        </ul>
      </div>
    ),
  },
  {
    question: "Do I need design experience to make a good resume?",
    answer: (
      <div className="space-y-3 text-sm leading-7 text-slate-600">
        <p>
          No. The builder handles layout and spacing for you, so the focus stays on the story rather than formatting details.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Guided structure:</strong> section ordering is easy to understand.</li>
          <li><strong>Template support:</strong> you do not have to design the page from scratch.</li>
          <li><strong>Fast polish:</strong> the system handles most of the visual work.</li>
        </ul>
      </div>
    ),
  },
];

export const heroStats = [
  { label: "resumes improved monthly", target: 12400, suffix: "+" },
  { label: "average ATS lift", target: 98, suffix: "%" },
];
