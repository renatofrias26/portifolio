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
}

export function AboutSection({
  summary = resumeData.summary,
  education = resumeData.education,
  showHeading = true,
  sectionId = "about",
}: AboutSectionProps) {
  return (
    <section id={sectionId} className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        {showHeading && (
          <SectionHeading
            title="About Me"
            subtitle="A unique journey from engineering to code"
            centered
          />
        )}

        <div className="mt-16 space-y-6">
          <GlassCard>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              {summary}
            </p>
          </GlassCard>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
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

            <GlassCard delay={0.2}>
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                🚀 Current Focus
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• AI Development & Integration</li>
                <li>• Enterprise Solutions</li>
                <li>• Flutter Mobile Development</li>
                <li>• Microservices Architecture</li>
                <li>• Team Leadership & Mentoring</li>
              </ul>
            </GlassCard>

            <GlassCard delay={0.3}>
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-teal-600 to-green-500 bg-clip-text text-transparent">
                💡 Unique Background
              </h3>
              <div className="space-y-3 text-sm">
                {resumeData.uniqueBackground.map((item, index) => (
                  <div key={index}>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {item.title}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">
                      {item.company}
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
