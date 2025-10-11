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
  skills: Array<{
    category: string;
    items: string[];
  }>;
  projects?: Array<{
    name: string;
    description: string;
    highlights: string[];
    stack: string[];
    url?: string;
  }>;
}

export interface UserCustomization {
  logoUrl?: string;
  profileImageUrl?: string;
  userName?: string;
  themeSettings?: {
    primaryColor?: string;
    accentColor?: string;
  };
  profileData?: {
    socialLinks?: {
      github?: string;
      linkedin?: string;
      twitter?: string;
      website?: string;
    };
    tagline?: string;
    bio?: string;
  };
  pdfUrl?: string;
}

export interface PortfolioPageProps {
  data?: PortfolioData;
  userCustomization?: UserCustomization;
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
 * 3. User portfolios - uses database data with customization
 * 4. Future: Different layouts based on user preferences
 *
 * @param data - Portfolio data (defaults to static data from resume.ts)
 * @param userCustomization - User branding and customization (logo, profile image, theme)
 * @param showNavigation - Show navigation bar (default: true)
 * @param showFooter - Show footer (default: true)
 * @param showSkipToContent - Show skip to content link (default: true)
 * @param layout - Layout variant (default: "default")
 */
export function PortfolioPage({
  data,
  userCustomization,
  showNavigation = true,
  showFooter = true,
  showSkipToContent = true,
}: PortfolioPageProps) {
  // When data is not provided, sections will use their default static data
  const usePropsData = !!data;

  return (
    <>
      {showSkipToContent && <SkipToContent />}
      {showNavigation && (
        <Navigation
          logoUrl={userCustomization?.logoUrl}
          pdfUrl={userCustomization?.pdfUrl}
          userName={
            userCustomization?.userName ||
            (usePropsData ? data.personal?.name : undefined)
          }
        />
      )}

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
          socialLinks={userCustomization?.profileData?.socialLinks}
          profileImageUrl={userCustomization?.profileImageUrl}
        />
      </main>

      {showFooter && <Footer />}
    </>
  );
}
