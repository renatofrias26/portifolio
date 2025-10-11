"use client";

import { SectionHeading } from "../ui/section-heading";
import { GlassCard } from "../ui/glass-card";
import { resumeData } from "@/data/resume";

interface Education {
  degree: string;
  institution: string;
  period: string;
}

interface AboutSectionProps {
  summary?: string;
  education?: Education[];
  showHeading?: boolean;
  sectionId?: string;
  subtitle?: string; // Custom subtitle
}

export function AboutSection({
  summary = resumeData.summary,
  education = resumeData.education,
  showHeading = true,
  sectionId = "about",
  subtitle = "Background and education",
}: AboutSectionProps) {
  return (
    <section id={sectionId} className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        {showHeading && (
          <SectionHeading
            title="About Me"
            subtitle={subtitle}
            centered
          />
        )}

        <div className="mt-16 space-y-6">
          <GlassCard>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              {summary}
            </p>
          </GlassCard>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <GlassCard delay={0.1}>
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                🎓 Education
              </h3>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {edu.degree}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {edu.institution}
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-xs">
                      {edu.period}
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
