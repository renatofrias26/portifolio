"use client";

import { SectionHeading } from "../ui/section-heading";
import { GlassCard } from "../ui/glass-card";
import { resumeData } from "@/data/resume";
import { Briefcase, Calendar } from "lucide-react";

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="py-20 px-6 bg-gradient-to-b from-transparent via-purple-50/30 to-transparent dark:via-purple-950/10"
    >
      <div className="container mx-auto max-w-6xl">
        <SectionHeading
          title="Experience"
          subtitle="My professional journey and achievements"
          centered
        />

        <div className="mt-16 space-y-6">
          {resumeData.experience.map((job, index) => (
            <GlassCard key={index} delay={index * 0.1} hover={false}>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Briefcase
                      className="w-5 h-5 text-purple-600"
                      aria-hidden="true"
                    />
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {job.title}
                    </h3>
                  </div>
                  <p className="text-xl text-gray-600 dark:text-gray-300 font-semibold mb-1">
                    {job.company}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  <span className="text-sm">{job.period}</span>
                </div>
              </div>

              <ul className="space-y-2 mb-4">
                {job.highlights.map((highlight, idx) => (
                  <li
                    key={idx}
                    className="text-gray-700 dark:text-gray-300 flex gap-2"
                  >
                    <span className="text-purple-500">▸</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2 mt-4">
                {job.stack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-sm rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
