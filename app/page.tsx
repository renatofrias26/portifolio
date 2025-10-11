import { PortfolioPage } from "@/components/portfolio-page";
import { getResumeData, mapResumeData } from "@/lib/resume-data";
import { resumeData } from "@/data/resume";

/**
 * Main Portfolio Page
 *
 * Fetches published resume data from the database.
 * Falls back to static data from data/resume.ts if no published version exists.
 */
export default async function Home() {
  console.log("🏠 Home page - Fetching published resume data...");

  // Fetch published resume data from API
  const publishedData = await getResumeData();

  console.log("🏠 Home page - Published data received:", !!publishedData);
  console.log("🏠 Home page - Published data skills:", publishedData?.skills);

  // Map database format to component format, or use static fallback
  const portfolioData = publishedData ? mapResumeData(publishedData) : null;

  console.log("🏠 Home page - Portfolio data created:", !!portfolioData);
  console.log("🏠 Home page - Portfolio skills:", portfolioData?.skills);

  return <PortfolioPage data={portfolioData || undefined} />;
}

export const revalidate = 60; // Revalidate every 60 seconds
