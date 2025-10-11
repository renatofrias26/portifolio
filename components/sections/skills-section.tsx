"use client";

import { SectionHeading } from "../ui/section-heading";
import { GlassCard } from "../ui/glass-card";
import { resumeData } from "@/data/resume";

interface SkillCategory {
  category: string;
  items: string[];
}

interface SkillsSectionProps {
  skills?: SkillCategory[];
  showHeading?: boolean;
  sectionId?: string;
}

export function SkillsSection({
  skills = resumeData.skills,
  showHeading = true,
  sectionId = "skills",
}: SkillsSectionProps) {
  console.log("🎨 SkillsSection - Received skills:", skills);

  // Map categories to display configuration
  const getCategoryConfig = (category: string) => {
    const categoryLower = category.toLowerCase();

    const configs: Record<string, { title: string; gradient: string }> = {
      frontend: {
        title: "Frontend",
        gradient: "from-purple-600 to-pink-500",
      },
      backend: {
        title: "Backend",
        gradient: "from-blue-600 to-cyan-500",
      },
      ai: {
        title: "AI & Innovation",
        gradient: "from-teal-600 to-green-500",
      },
      testing: {
        title: "Testing",
        gradient: "from-orange-600 to-red-500",
      },
      tools: {
        title: "Tools & DevOps",
        gradient: "from-indigo-600 to-purple-500",
      },
      technical: {
        title: "Technical Skills",
        gradient: "from-purple-600 to-blue-500",
      },
      soft: {
        title: "Soft Skills",
        gradient: "from-pink-600 to-rose-500",
      },
    };

    return (
      configs[categoryLower] || {
        title: category,
        gradient: "from-gray-600 to-gray-500",
      }
    );
  };

  const skillCategories = skills
    .filter((cat) => cat.items && cat.items.length > 0)
    .map((cat) => ({
      ...getCategoryConfig(cat.category),
      skills: cat.items,
    }));

  return (
    <section id={sectionId} className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        {showHeading && (
          <SectionHeading
            title="Skills"
            subtitle="Technologies and tools I work with"
            centered
          />
        )}

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
