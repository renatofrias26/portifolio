"use client";

import { useState } from "react";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { X, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ParsedResumeData {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  title?: string;
  experience?: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
    highlights?: string[];
    stack?: string[];
  }>;
  education?: Array<{
    degree: string;
    school: string;
    year: string;
    institution?: string;
    period?: string;
  }>;
  skills?: Array<{
    category: string;
    items: string[];
  }>;
  [key: string]: unknown;
}

interface GuestPreviewModalProps {
  parsedData: ParsedResumeData;
  onClose: () => void;
}

export function GuestPreviewModal({
  parsedData,
  onClose,
}: GuestPreviewModalProps) {
  // Transform parsed data to match portfolio format
  const portfolioData = {
    personal: {
      name: parsedData.name || "Your Name",
      title: parsedData.title || "Your Professional Title",
      email: parsedData.email || "",
      phone: parsedData.phone || "",
      location: parsedData.location || "",
      summary: parsedData.summary || "",
    },
    experience: (parsedData.experience || []).map((exp) => ({
      title: exp.title,
      company: exp.company,
      period: exp.duration,
      highlights: exp.highlights || [exp.description].filter(Boolean),
      stack: exp.stack || [],
    })),
    education: (parsedData.education || []).map((edu) => ({
      degree: edu.degree,
      institution: edu.school || edu.institution || "",
      period: edu.year || edu.period || "",
    })),
    skills: parsedData.skills || [],
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="min-h-screen"
        >
          {/* Header with close button */}
          <div className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Preview Mode
                  </h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    This is how your portfolio will look
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close preview"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Portfolio Preview */}
          <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 min-h-screen">
            <div className="max-w-7xl mx-auto">
              {/* Hero Section */}
              <HeroSection
                name={portfolioData.personal.name}
                title={portfolioData.personal.title}
                tagline="AI-Powered Portfolio"
                contactInfo={{
                  email: portfolioData.personal.email,
                  phone: portfolioData.personal.phone,
                  location: portfolioData.personal.location,
                }}
              />

              {/* About Section */}
              {portfolioData.personal.summary && (
                <AboutSection
                  summary={portfolioData.personal.summary}
                  currentFocus={[]}
                />
              )}

              {/* Experience Section */}
              {portfolioData.experience.length > 0 && (
                <ExperienceSection experience={portfolioData.experience} />
              )}

              {/* Skills Section */}
              {portfolioData.skills.length > 0 && (
                <SkillsSection skills={portfolioData.skills} />
              )}

              {/* Education Section - Simple version */}
              {portfolioData.education.length > 0 && (
                <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
                  <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Education
                    </h2>
                    <div className="space-y-6">
                      {portfolioData.education.map((edu, idx) => (
                        <div
                          key={idx}
                          className="glass rounded-2xl p-6 hover:shadow-lg transition-shadow"
                        >
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {edu.degree}
                          </h3>
                          <p className="text-purple-600 dark:text-purple-400 font-medium mb-1">
                            {edu.institution}
                          </p>
                          {edu.period && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {edu.period}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* Bottom CTA */}
            <div className="py-16 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Love what you see?
                </h3>
                <p className="text-white/90 mb-8 text-lg">
                  Create your free account to publish this portfolio and start
                  getting noticed.
                </p>
                <button
                  onClick={onClose}
                  className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-2xl"
                >
                  Close Preview & Continue
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
