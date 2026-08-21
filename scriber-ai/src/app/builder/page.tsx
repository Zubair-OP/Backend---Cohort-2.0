"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/home/sections/site-header";
import { pdf } from "@react-pdf/renderer";
import { ResumePDF } from "@/components/builder/pdf/ResumePDF";
import { optimizeResumeApi } from "@/apis/ai.api";

/* ── Types (inline, no mongoose dependency) ── */
interface IPersonalInfo {
  fullname: string;
  email: string;
  mobile: string;
  location: string;
  github: string;
  linkedIn: string;
  portfolio: string;
}
interface IWorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}
interface IProject {
  title: string;
  description: string;
  githubUrl: string;
  liveUrl: string;
  techStack: string[];
}
interface IEducation {
  institute: string;
  degree: string;
  startDate: string;
  endDate: string;
}
interface IResumeData {
  title: string;
  summary: string;
  personalInfo: IPersonalInfo;
  workExperience: IWorkExperience[];
  projects: IProject[];
  skills: string[];
  education: IEducation[];
  certifications: string[];
}

/* ── Template thumbnail map ── */
const TEMPLATE_THUMBS: Record<string, { name: string; image: string }> = {
  formal: { name: "Formal", image: "/template-formal.3d5b8a13.avif" },
  creative: { name: "Creative", image: "/template-creative.e656d51a.avif" },
  precision: { name: "Precision", image: "/template-precision.d846963e.avif" },
  capability: { name: "Capability", image: "/template-capability.11d18190.avif" },
  purity: { name: "Purity", image: "/template-purity.25c7c873.avif" },
};

const STEPS = [
  { id: 1, label: "Personal Info", icon: "person" },
  { id: 2, label: "Education", icon: "school" },
  { id: 3, label: "Experience", icon: "work" },
  { id: 4, label: "Projects", icon: "code" },
  { id: 5, label: "Skills", icon: "psychology" },
  { id: 6, label: "Review & Generate", icon: "download" },
];

const EMPTY_RESUME: IResumeData = {
  title: "My Resume",
  summary: "",
  personalInfo: { fullname: "", email: "", mobile: "", location: "", github: "", linkedIn: "", portfolio: "" },
  workExperience: [],
  projects: [],
  skills: [],
  education: [],
  certifications: [],
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Builder Page
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function BuilderPage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template") || "formal";
  const tmpl = TEMPLATE_THUMBS[templateId] || TEMPLATE_THUMBS.formal;

  const [step, setStep] = useState(1);
  const [resume, setResume] = useState<IResumeData>(EMPTY_RESUME);
  const [newSkill, setNewSkill] = useState("");
  const [newTech, setNewTech] = useState("");

  // Generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState<"idle" | "optimizing" | "rendering" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  /* ── Helpers ── */
  const updatePersonal = (key: keyof IPersonalInfo, value: string) => {
    setResume((prev) => ({ ...prev, personalInfo: { ...prev.personalInfo, [key]: value } }));
  };

  /* ── Generate & Download ── */
  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setGenerationPhase("optimizing");
    setErrorMsg("");

    try {
      // Step 1: AI optimize
      const response = await optimizeResumeApi({
        userData: resume as unknown as Record<string, unknown>,
        templateId,
      });

      let optimized: IResumeData;
      if (response.success && response.data) {
        optimized = response.data as IResumeData;
      } else {
        // Fallback: use raw data if AI fails
        optimized = resume;
      }

      // Step 2: Render PDF
      setGenerationPhase("rendering");
      const blob = await pdf(
        <ResumePDF resume={optimized as never} templateId={templateId} />
      ).toBlob();

      // Step 3: Download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${optimized.title?.replace(/\s+/g, "_") || "resume"}_ATS.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setGenerationPhase("done");
    } catch (err) {
      console.error("Generation failed:", err);
      setGenerationPhase("error");
      setErrorMsg("Resume generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [resume, templateId]);

  /* ━━ Render ━━ */
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />

      <main className="flex-grow pt-20">
        <div className="max-w-[860px] mx-auto px-4 py-10">

          {/* ── Top: Template Badge + Progress ── */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/templates"
              className="flex items-center gap-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Templates
            </Link>

            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2">
              <div className="w-8 h-10 relative rounded overflow-hidden border border-gray-100">
                <Image src={tmpl.image} alt={tmpl.name} fill className="object-cover object-top" sizes="32px" />
              </div>
              <span className="text-sm font-medium text-gray-700">{tmpl.name}</span>
            </div>
          </div>

          {/* ── Step Progress Bar ── */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              {/* Background line */}
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" />
              <div
                className="absolute top-4 left-0 h-0.5 bg-emerald-500 transition-all duration-500"
                style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
              />
              {STEPS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { if (s.id < step) setStep(s.id); }}
                  className="relative z-10 flex flex-col items-center gap-1.5"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      s.id < step
                        ? "bg-emerald-500 text-white"
                        : s.id === step
                        ? "bg-emerald-500 text-white ring-4 ring-emerald-100"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {s.id < step ? (
                      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                        <path d="M4 8L7 11L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      s.id
                    )}
                  </div>
                  <span className={`text-[11px] font-medium hidden sm:block ${s.id === step ? "text-emerald-600" : "text-gray-400"}`}>
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Step Content Card ── */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">

            {/* ─── Step 1: Personal Info ─── */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
                <p className="text-sm text-gray-500">Basic details that appear at the top of your resume.</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input type="text" value={resume.personalInfo.fullname} onChange={(e) => updatePersonal("fullname", e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" placeholder="John Doe" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" value={resume.personalInfo.email} onChange={(e) => updatePersonal("email", e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" value={resume.personalInfo.mobile} onChange={(e) => updatePersonal("mobile", e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" placeholder="+92 300 1234567" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input type="text" value={resume.personalInfo.location} onChange={(e) => updatePersonal("location", e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" placeholder="Karachi, Pakistan" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                    <input type="url" value={resume.personalInfo.linkedIn} onChange={(e) => updatePersonal("linkedIn", e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" placeholder="linkedin.com/in/johndoe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                    <input type="url" value={resume.personalInfo.github} onChange={(e) => updatePersonal("github", e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" placeholder="github.com/johndoe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio Website</label>
                  <input type="url" value={resume.personalInfo.portfolio} onChange={(e) => updatePersonal("portfolio", e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" placeholder="johndoe.dev" />
                </div>
              </div>
            )}

            {/* ─── Step 2: Education ─── */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Education</h2>
                    <p className="text-sm text-gray-500">Add your academic qualifications.</p>
                  </div>
                  <button
                    onClick={() => setResume((prev) => ({ ...prev, education: [...prev.education, { institute: "", degree: "", startDate: "", endDate: "" }] }))}
                    className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add Education
                  </button>
                </div>

                {resume.education.length === 0 && (
                  <div className="text-center py-10 text-gray-400">
                    <span className="material-symbols-outlined text-4xl mb-2">school</span>
                    <p>No education added yet. Click &quot;Add Education&quot; to start.</p>
                  </div>
                )}

                {resume.education.map((edu, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3 relative">
                    <button
                      onClick={() => setResume((prev) => ({ ...prev, education: prev.education.filter((_, idx) => idx !== i) }))}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Institute</label>
                      <input type="text" value={edu.institute} onChange={(e) => { const updated = [...resume.education]; updated[i] = { ...updated[i], institute: e.target.value }; setResume((prev) => ({ ...prev, education: updated })); }} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" placeholder="University of Karachi" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                      <input type="text" value={edu.degree} onChange={(e) => { const updated = [...resume.education]; updated[i] = { ...updated[i], degree: e.target.value }; setResume((prev) => ({ ...prev, education: updated })); }} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" placeholder="BS Computer Science" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input type="text" value={edu.startDate} onChange={(e) => { const updated = [...resume.education]; updated[i] = { ...updated[i], startDate: e.target.value }; setResume((prev) => ({ ...prev, education: updated })); }} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" placeholder="Sep 2020" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input type="text" value={edu.endDate} onChange={(e) => { const updated = [...resume.education]; updated[i] = { ...updated[i], endDate: e.target.value }; setResume((prev) => ({ ...prev, education: updated })); }} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" placeholder="Jun 2024" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ─── Step 3: Work Experience ─── */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Work Experience</h2>
                    <p className="text-sm text-gray-500">Add your professional experience. AI will optimize the bullet points.</p>
                  </div>
                  <button
                    onClick={() => setResume((prev) => ({ ...prev, workExperience: [...prev.workExperience, { company: "", position: "", startDate: "", endDate: "", description: "" }] }))}
                    className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add Experience
                  </button>
                </div>

                {resume.workExperience.length === 0 && (
                  <div className="text-center py-10 text-gray-400">
                    <span className="material-symbols-outlined text-4xl mb-2">work</span>
                    <p>No experience added yet. Click &quot;Add Experience&quot; to start.</p>
                  </div>
                )}

                {resume.workExperience.map((exp, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3 relative">
                    <button
                      onClick={() => setResume((prev) => ({ ...prev, workExperience: prev.workExperience.filter((_, idx) => idx !== i) }))}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                        <input type="text" value={exp.position} onChange={(e) => { const updated = [...resume.workExperience]; updated[i] = { ...updated[i], position: e.target.value }; setResume((prev) => ({ ...prev, workExperience: updated })); }} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" placeholder="Software Engineer" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <input type="text" value={exp.company} onChange={(e) => { const updated = [...resume.workExperience]; updated[i] = { ...updated[i], company: e.target.value }; setResume((prev) => ({ ...prev, workExperience: updated })); }} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" placeholder="Google" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input type="text" value={exp.startDate} onChange={(e) => { const updated = [...resume.workExperience]; updated[i] = { ...updated[i], startDate: e.target.value }; setResume((prev) => ({ ...prev, workExperience: updated })); }} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" placeholder="Jan 2023" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input type="text" value={exp.endDate} onChange={(e) => { const updated = [...resume.workExperience]; updated[i] = { ...updated[i], endDate: e.target.value }; setResume((prev) => ({ ...prev, workExperience: updated })); }} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" placeholder="Present" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea value={exp.description} onChange={(e) => { const updated = [...resume.workExperience]; updated[i] = { ...updated[i], description: e.target.value }; setResume((prev) => ({ ...prev, workExperience: updated })); }} rows={3} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm resize-none" placeholder="Briefly describe your role and responsibilities. AI will optimize this into ATS-friendly bullet points." />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ─── Step 4: Projects ─── */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
                    <p className="text-sm text-gray-500">Showcase your key projects. AI will enhance the descriptions.</p>
                  </div>
                  <button
                    onClick={() => setResume((prev) => ({ ...prev, projects: [...prev.projects, { title: "", description: "", githubUrl: "", liveUrl: "", techStack: [] }] }))}
                    className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add Project
                  </button>
                </div>

                {resume.projects.length === 0 && (
                  <div className="text-center py-10 text-gray-400">
                    <span className="material-symbols-outlined text-4xl mb-2">code</span>
                    <p>No projects added yet. Click &quot;Add Project&quot; to start.</p>
                  </div>
                )}

                {resume.projects.map((proj, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3 relative">
                    <button
                      onClick={() => setResume((prev) => ({ ...prev, projects: prev.projects.filter((_, idx) => idx !== i) }))}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                      <input type="text" value={proj.title} onChange={(e) => { const updated = [...resume.projects]; updated[i] = { ...updated[i], title: e.target.value }; setResume((prev) => ({ ...prev, projects: updated })); }} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" placeholder="E-Commerce Platform" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea value={proj.description} onChange={(e) => { const updated = [...resume.projects]; updated[i] = { ...updated[i], description: e.target.value }; setResume((prev) => ({ ...prev, projects: updated })); }} rows={2} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm resize-none" placeholder="Describe the project briefly..." />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                        <input type="url" value={proj.githubUrl} onChange={(e) => { const updated = [...resume.projects]; updated[i] = { ...updated[i], githubUrl: e.target.value }; setResume((prev) => ({ ...prev, projects: updated })); }} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" placeholder="github.com/..." />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Live URL</label>
                        <input type="url" value={proj.liveUrl} onChange={(e) => { const updated = [...resume.projects]; updated[i] = { ...updated[i], liveUrl: e.target.value }; setResume((prev) => ({ ...prev, projects: updated })); }} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" placeholder="myproject.com" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {proj.techStack.map((tech, ti) => (
                          <span key={ti} className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                            {tech}
                            <button onClick={() => { const updated = [...resume.projects]; updated[i] = { ...updated[i], techStack: updated[i].techStack.filter((_, tIdx) => tIdx !== ti) }; setResume((prev) => ({ ...prev, projects: updated })); }} className="text-gray-400 hover:text-red-500">×</button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input type="text" value={newTech} onChange={(e) => setNewTech(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && newTech.trim()) { const updated = [...resume.projects]; updated[i] = { ...updated[i], techStack: [...updated[i].techStack, newTech.trim()] }; setResume((prev) => ({ ...prev, projects: updated })); setNewTech(""); } }} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" placeholder="Type & press Enter" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ─── Step 5: Skills ─── */}
            {step === 5 && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-800">Skills</h2>
                <p className="text-sm text-gray-500">Add your technical and soft skills. AI will enhance and add ATS keywords.</p>

                <div className="flex flex-wrap gap-2 min-h-[48px]">
                  {resume.skills.map((skill, i) => (
                    <span key={i} className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium px-3 py-1.5 rounded-full border border-emerald-200">
                      {skill}
                      <button onClick={() => setResume((prev) => ({ ...prev, skills: prev.skills.filter((_, idx) => idx !== i) }))} className="text-emerald-400 hover:text-red-500 transition-colors">×</button>
                    </span>
                  ))}
                  {resume.skills.length === 0 && (
                    <span className="text-sm text-gray-400">No skills added yet.</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newSkill.trim()) {
                        setResume((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
                        setNewSkill("");
                      }
                    }}
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                    placeholder="Type a skill and press Enter"
                  />
                  <button
                    onClick={() => {
                      if (newSkill.trim()) {
                        setResume((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
                        setNewSkill("");
                      }
                    }}
                    className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* ─── Step 6: Review & Generate ─── */}
            {step === 6 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800">Review & Generate</h2>
                <p className="text-sm text-gray-500">Review your details below. AI will optimize everything for ATS compatibility before generating your PDF.</p>

                {/* Summary Cards */}
                <div className="space-y-4">
                  {/* Personal */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-700">Personal Info</h3>
                      <button onClick={() => setStep(1)} className="text-xs text-emerald-600 hover:underline">Edit</button>
                    </div>
                    <p className="text-sm text-gray-600">{resume.personalInfo.fullname || "—"}</p>
                    <p className="text-xs text-gray-400">{[resume.personalInfo.email, resume.personalInfo.mobile, resume.personalInfo.location].filter(Boolean).join(" · ") || "No contact info"}</p>
                  </div>

                  {/* Education */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-700">Education ({resume.education.length})</h3>
                      <button onClick={() => setStep(2)} className="text-xs text-emerald-600 hover:underline">Edit</button>
                    </div>
                    {resume.education.length > 0 ? resume.education.map((edu, i) => (
                      <p key={i} className="text-sm text-gray-600">{edu.degree} — {edu.institute}</p>
                    )) : <p className="text-xs text-gray-400">None added</p>}
                  </div>

                  {/* Experience */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-700">Experience ({resume.workExperience.length})</h3>
                      <button onClick={() => setStep(3)} className="text-xs text-emerald-600 hover:underline">Edit</button>
                    </div>
                    {resume.workExperience.length > 0 ? resume.workExperience.map((exp, i) => (
                      <p key={i} className="text-sm text-gray-600">{exp.position} at {exp.company}</p>
                    )) : <p className="text-xs text-gray-400">None added</p>}
                  </div>

                  {/* Projects */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-700">Projects ({resume.projects.length})</h3>
                      <button onClick={() => setStep(4)} className="text-xs text-emerald-600 hover:underline">Edit</button>
                    </div>
                    {resume.projects.length > 0 ? resume.projects.map((proj, i) => (
                      <p key={i} className="text-sm text-gray-600">{proj.title}</p>
                    )) : <p className="text-xs text-gray-400">None added</p>}
                  </div>

                  {/* Skills */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-700">Skills ({resume.skills.length})</h3>
                      <button onClick={() => setStep(5)} className="text-xs text-emerald-600 hover:underline">Edit</button>
                    </div>
                    {resume.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {resume.skills.map((skill, i) => (
                          <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{skill}</span>
                        ))}
                      </div>
                    ) : <p className="text-xs text-gray-400">None added</p>}
                  </div>
                </div>

                {/* Generate Button */}
                <div className="pt-4 border-t border-gray-200">
                  {generationPhase === "done" ? (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-emerald-600">check_circle</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Resume Downloaded!</h3>
                      <p className="text-sm text-gray-500">Your ATS-optimized resume has been downloaded as PDF.</p>
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={handleGenerate}
                          className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                        >
                          Download Again
                        </button>
                        <Link
                          href="/templates"
                          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          Try Another Template
                        </Link>
                      </div>
                    </div>
                  ) : generationPhase === "error" ? (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-red-500">error</span>
                      </div>
                      <p className="text-sm text-red-500">{errorMsg}</p>
                      <button
                        onClick={handleGenerate}
                        className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating || !resume.personalInfo.fullname}
                      className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {generationPhase === "optimizing" ? "AI is optimizing your resume..." : "Rendering PDF..."}
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-lg">auto_awesome</span>
                          Generate ATS Resume & Download PDF
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Navigation Buttons ── */}
          {step < 6 && (
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
              </button>
              <button
                onClick={() => setStep((s) => Math.min(6, s + 1))}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                Continue
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
          {step === 6 && generationPhase === "idle" && (
            <div className="flex items-center justify-start">
              <button
                onClick={() => setStep(5)}
                className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
