"use client";

import { IResume } from "@/types/resume.types";

interface AIImprovementsModalProps {
  original: IResume;
  optimized: IResume;
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  isDownloading: boolean;
}

interface DiffItem {
  section: string;
  original: string;
  optimized: string;
  improved: boolean;
}

function buildDiffItems(original: IResume, optimized: IResume): DiffItem[] {
  const items: DiffItem[] = [];

  if (original.summary !== optimized.summary) {
    items.push({
      section: "Professional Summary",
      original: original.summary || "(empty)",
      optimized: optimized.summary || "",
      improved: true,
    });
  }

  if (original.skills?.join(",") !== optimized.skills?.join(",")) {
    items.push({
      section: "Skills",
      original: original.skills?.join(", ") || "(empty)",
      optimized: optimized.skills?.join(", ") || "",
      improved: true,
    });
  }

  (original.workExperience || []).forEach((exp, i) => {
    const optExp = optimized.workExperience?.[i];
    if (optExp && exp.description !== optExp.description) {
      items.push({
        section: `Work Experience: ${exp.position || `#${i + 1}`}`,
        original: exp.description || "(empty)",
        optimized: optExp.description || "",
        improved: true,
      });
    }
  });

  (original.projects || []).forEach((proj, i) => {
    const optProj = optimized.projects?.[i];
    if (optProj && proj.description !== optProj.description) {
      items.push({
        section: `Project: ${proj.title || `#${i + 1}`}`,
        original: proj.description || "(empty)",
        optimized: optProj.description || "",
        improved: true,
      });
    }
  });

  return items;
}

export function AIImprovementsModal({
  original,
  optimized,
  isOpen,
  onClose,
  onDownload,
  isDownloading,
}: AIImprovementsModalProps) {
  if (!isOpen) return null;

  const diffs = buildDiffItems(original, optimized);
  const hasImprovements = diffs.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h2 className="text-xl font-bold text-gray-900">AI Resume Optimization Complete</h2>
              </div>
              <p className="text-sm text-gray-500">
                Gemini AI has optimized your resume content. Review the improvements below.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!hasImprovements ? (
            <div className="text-center py-10">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-500 font-medium">Your resume is already well-optimized!</p>
              <p className="text-sm text-gray-400 mt-1">No significant changes were needed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {diffs.length} section{diffs.length !== 1 ? "s" : ""} improved
              </div>

              {diffs.map((diff, i) => (
                <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <span className="text-sm font-semibold text-gray-700">{diff.section}</span>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-gray-200">
                    <div className="p-3">
                      <span className="text-xs font-medium text-red-500 mb-1 block">Before</span>
                      <p className="text-sm text-gray-600 whitespace-pre-line">{diff.original}</p>
                    </div>
                    <div className="p-3 bg-emerald-50/50">
                      <span className="text-xs font-medium text-emerald-600 mb-1 block">After (AI Optimized)</span>
                      <p className="text-sm text-gray-800 whitespace-pre-line">{diff.optimized}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2V10M8 10L5 7M8 10L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 11V12C2 13.1046 2.89543 14 4 14H12C13.1046 14 14 13.1046 14 12V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Download AI-Optimized PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
