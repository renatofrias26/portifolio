"use client";

import { Navigation } from "@/components/navigation";
import { SkipToContent } from "@/components/skip-to-content";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { AIChatSection } from "@/components/sections/ai-chat-section";
import { ContactSection } from "@/components/sections/contact-section";

// Data structure that the page expects
export interface PortfolioData {
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
    period: string;
    highlights: string[];
    stack: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    period: string;
  }>;
  skills: {
    [category: string]: string[];
  };
  projects?: Array<{
    name: string;
    description: string;
    highlights: string[];
    stack: string[];
    url?: string;
  }>;
}

export interface PortfolioPageProps {
  data?: PortfolioData;
  showNavigation?: boolean;
  showFooter?: boolean;
  showSkipToContent?: boolean;
  layout?: "default" | "compact" | "minimal"; // For future layout variations
}

/**
 * Reusable Portfolio Page Component
 *
 * This component can be used in multiple contexts:
 * 1. Live website (app/page.tsx) - uses default static data
 * 2. Admin preview - passes dynamic data from database
 * 3. Future: Different layouts based on user preferences
 *
 * @param data - Portfolio data (defaults to static data from resume.ts)
 * @param showNavigation - Show navigation bar (default: true)
 * @param showFooter - Show footer (default: true)
 * @param showSkipToContent - Show skip to content link (default: true)
 * @param layout - Layout variant (default: "default")
 */
export function PortfolioPage({
  data,
  showNavigation = true,
  showFooter = true,
  showSkipToContent = true,
  layout = "default",
}: PortfolioPageProps) {
  // When data is not provided, sections will use their default static data
  const usePropsData = !!data;

  return (
    <>
      {showSkipToContent && <SkipToContent />}
      {showNavigation && <Navigation />}

      <main id="main-content" className="min-h-screen">
        {/* Hero Section */}
        <HeroSection
          personal={usePropsData ? data.personal : undefined}
          showScrollButton={true}
        />

        {/* About Section */}
        <AboutSection
          summary={usePropsData ? data.personal.summary : undefined}
          education={usePropsData ? data.education : undefined}
        />

        {/* Experience Section */}
        <ExperienceSection
          experience={usePropsData ? data.experience : undefined}
        />

        {/* Skills Section */}
        <SkillsSection skills={usePropsData ? data.skills : undefined} />

        {/* Projects Section */}
        <ProjectsSection projects={usePropsData ? data.projects : undefined} />

        {/* AI Chat Section */}
        <AIChatSection />

        {/* Contact Section */}
        <ContactSection
          contact={
            usePropsData
              ? {
                  name: data.personal.name,
                  email: data.personal.email,
                  phone: data.personal.phone,
                  location: data.personal.location,
                }
              : undefined
          }
        />
      </main>

      {showFooter && <Footer />}
    </>
  );
}
