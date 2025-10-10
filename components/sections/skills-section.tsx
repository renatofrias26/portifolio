"use client";

import { SectionHeading } from "../ui/section-heading";
import { GlassCard } from "../ui/glass-card";
import { resumeData } from "@/data/resume";

export function SkillsSection() {
  const skillCategories = [
    {
      title: "Frontend",
      skills: resumeData.skills.frontend,
      gradient: "from-purple-600 to-pink-500",
    },
    {
      title: "Backend",
      skills: resumeData.skills.backend,
      gradient: "from-blue-600 to-cyan-500",
    },
    {
      title: "AI & Innovation",
      skills: resumeData.skills.ai,
      gradient: "from-teal-600 to-green-500",
    },
    {
      title: "Testing",
      skills: resumeData.skills.testing,
      gradient: "from-orange-600 to-red-500",
    },
    {
      title: "Tools & DevOps",
      skills: resumeData.skills.tools,
      gradient: "from-indigo-600 to-purple-500",
    },
  ];

  return (
    <section id="skills" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <SectionHeading
          title="Skills"
          subtitle="Technologies and tools I work with"
          centered
        />

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <GlassCard key={index} delay={index * 0.1}>
              <h3
                className={`text-xl font-bold mb-4 bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}
              >
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-sm rounded-full bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                  >
                    {skill}
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
