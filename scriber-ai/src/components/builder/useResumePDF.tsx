"use client";

import { useCallback, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { IResume } from "@/types/resume.types";
import { generateFinalResumeApi } from "@/apis/resume.api";
import { ResumePDF } from "./pdf/ResumePDF";

interface UseResumePDFReturn {
  isOptimizing: boolean;
  isDownloading: boolean;
  optimizedResume: IResume | null;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  optimizeWithAI: (resumeId: string) => Promise<IResume | null>;
  downloadPDF: (resume: IResume, templateId: string) => Promise<void>;
}

export function useResumePDF(): UseResumePDFReturn {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [optimizedResume, setOptimizedResume] = useState<IResume | null>(null);
  const [showModal, setShowModal] = useState(false);

  const optimizeWithAI = useCallback(async (resumeId: string): Promise<IResume | null> => {
    setIsOptimizing(true);
    try {
      const response = await generateFinalResumeApi(resumeId);
      if (response.success) {
        const data = response.data as IResume;
        setOptimizedResume(data);
        return data;
      }
      return null;
    } catch (error) {
      console.error("AI optimization failed:", error);
      return null;
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  const downloadPDF = useCallback(async (resume: IResume, templateId: string) => {
    setIsDownloading(true);
    try {
      const blob = await pdf(
        <ResumePDF resume={resume} templateId={templateId} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resume.title?.replace(/\s+/g, "_") || "resume"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return { isOptimizing, isDownloading, optimizedResume, showModal, setShowModal, optimizeWithAI, downloadPDF };
}
