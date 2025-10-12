"use client";

import { Navigation } from "../navigation";
import { HeroSection } from "../sections/hero-section";
import { AboutSection } from "../sections/about-section";
import { ExperienceSection } from "../sections/experience-section";
import { SkillsSection } from "../sections/skills-section";
import { ProjectsSection } from "../sections/projects-section";
import { AIChatSection } from "../sections/ai-chat-section";
import { ContactSection } from "../sections/contact-section";

interface ResumeData {
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
  skills: Array<{
    category: string;
    items: string[];
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
}

interface ResumePreviewProps {
  data: ResumeData;
  showHeadings?: boolean;
  showNavigation?: boolean;
}

export function ResumePreview({
  data,
  showHeadings = false,
  showNavigation = true,
}: ResumePreviewProps) {
  // Transform database structure to component props
  const transformedExperience = data.experience.map((exp) => ({
    title: exp.title,
    company: exp.company,
    period: exp.period,
    highlights: exp.achievements || [],
    stack: [], // Not in database structure
  }));

  const transformedEducation = data.education.map((edu) => ({
    degree: edu.degree,
    institution: edu.institution,
    period: edu.period,
  }));

  const transformedProjects = (data.projects || []).map((proj) => ({
    name: proj.name,
    description: proj.description,
    highlights: [],
    stack: proj.technologies || [],
    url: proj.url,
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      {showNavigation && <Navigation />}

      {/* Hero Section */}
      <HeroSection
        name={data.personal.name}
        title={data.personal.title}
        showScrollButton={false}
        contactInfo={{
          email: data.personal.email,
          phone: data.personal.phone,
          location: data.personal.location,
        }}
      />

      {/* About / Summary */}
      <AboutSection
        summary={data.personal.summary}
        education={transformedEducation}
        showHeading={showHeadings}
        sectionId="preview-about"
      />

      {/* Experience */}
      <ExperienceSection
        experience={transformedExperience}
        showHeading={showHeadings}
        sectionId="preview-experience"
      />

      {/* Skills */}
      <SkillsSection
        skills={data.skills}
        showHeading={showHeadings}
        sectionId="preview-skills"
      />

      {/* Projects */}
      {transformedProjects.length > 0 && (
        <ProjectsSection
          projects={transformedProjects}
          showHeading={showHeadings}
          sectionId="preview-projects"
        />
      )}

      {/* AI Chat */}
      <AIChatSection showHeading={showHeadings} sectionId="preview-ai-chat" />

      {/* Contact */}
      <ContactSection
        contact={{
          name: data.personal.name,
          email: data.personal.email,
          phone: data.personal.phone,
          location: data.personal.location,
        }}
        showHeading={showHeadings}
        sectionId="preview-contact"
      />
    </div>
  );
}
