"use client";

import { SectionHeading } from "../ui/section-heading";
import { GlassCard } from "../ui/glass-card";
import { resumeData } from "@/data/resume";
import { ExternalLink } from "lucide-react";

export function ProjectsSection() {
  return (
    <section id="projects" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <SectionHeading
          title="Projects"
          subtitle="Personal and professional work"
          centered
        />

        <div className="mt-16 grid md:grid-cols-2 gap-6">
          {resumeData.projects.map((project, index) => (
            <GlassCard key={index} delay={index * 0.1}>
              <div className="mb-4">
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  {project.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {project.type}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {project.description}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Key Highlights:
                </h4>
                <ul className="space-y-1">
                  {project.highlights.map((highlight, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-600 dark:text-gray-400 flex gap-2"
                    >
                      <span className="text-purple-500">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-blue-500/10 to-teal-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </GlassCard>
          ))}

          {/* Add more projects card */}
          <GlassCard
            delay={0.2}
            className="flex items-center justify-center min-h-[300px]"
          >
            <div className="text-center">
              <ExternalLink
                className="w-12 h-12 mx-auto mb-4 text-gray-400"
                aria-hidden="true"
              />
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                More Projects
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Check out my GitHub for more open-source contributions and
                personal projects
              </p>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                View GitHub
              </a>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
