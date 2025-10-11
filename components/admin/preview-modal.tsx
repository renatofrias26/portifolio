"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { PortfolioPage, type PortfolioData } from "@/components/portfolio-page";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  versionId: number | null;
}

interface DatabaseResumeData {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    title: string;
    company: string;
    location: string;
    period: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    period: string;
    location?: string;
  }>;
  skills: {
    [category: string]: string[];
  };
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
}

export function PreviewModal({
  isOpen,
  onClose,
  versionId,
}: PreviewModalProps) {
  const [data, setData] = useState<DatabaseResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && versionId) {
      fetchResumeData();
    }
  }, [isOpen, versionId]);

  const fetchResumeData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/resume-data/${versionId}`);
      const result = await response.json();

      if (response.ok) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to load data");
      }
    } catch (err) {
      setError("Failed to fetch resume data");
    } finally {
      setIsLoading(false);
    }
  };

  // Transform database data to PortfolioData format
  const transformData = (dbData: DatabaseResumeData): PortfolioData => {
    return {
      personal: dbData.personal,
      experience: dbData.experience.map((exp) => ({
        title: exp.title,
        company: exp.company,
        period: exp.period,
        highlights: exp.achievements || [],
        stack: [], // Not in database structure
      })),
      education: dbData.education.map((edu) => ({
        degree: edu.degree,
        institution: edu.institution,
        period: edu.period,
      })),
      skills: dbData.skills,
      projects: (dbData.projects || []).map((proj) => ({
        name: proj.name,
        description: proj.description,
        highlights: [],
        stack: proj.technologies || [],
        url: proj.url,
      })),
    };
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal - Full width, almost full height */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-[95vw] max-w-7xl h-[95vh] overflow-hidden glass rounded-2xl shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <h2 className="text-xl font-bold">Resume Preview</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content - Scrollable area */}
          <div className="overflow-y-auto flex-1 relative">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : error ? (
              <div className="p-6">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                  {error}
                </div>
              </div>
            ) : data ? (
              <PortfolioPage
                data={transformData(data)}
                showNavigation={false}
                showFooter={false}
                showSkipToContent={false}
              />
            ) : null}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
