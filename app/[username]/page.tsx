import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioPage } from "@/components/portfolio-page";
import { getPublishedResumeByUsername } from "@/lib/db/queries";
import { mapResumeData } from "@/lib/resume-data";

type Props = {
  params: Promise<{ username: string }>;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const data = await getPublishedResumeByUsername(username);

  if (!data) {
    return {
      title: "User Not Found",
    };
  }

  const resumeData = data.data;
  const userName = data.name || resumeData?.personal?.name || username;
  const userTitle = resumeData?.personal?.title || "Portfolio";

  return {
    title: `${userName} - ${userTitle}`,
    description:
      resumeData?.personal?.summary || `${userName}'s professional portfolio`,
    openGraph: {
      title: `${userName} - ${userTitle}`,
      description:
        resumeData?.personal?.summary || `${userName}'s professional portfolio`,
    },
  };
}

export default async function UserPortfolioPage({ params }: Props) {
  const { username } = await params;

  // Fetch user's published resume
  const data = await getPublishedResumeByUsername(username);

  // If no data found, show 404
  if (!data) {
    notFound();
  }

  // Map the database structure to portfolio format
  const portfolioData = mapResumeData(data.data);

  if (!portfolioData) {
    notFound();
  }

  // Extract user customization data
  const userCustomization = {
    logoUrl: data.logo_url,
    profileImageUrl: data.profile_image_url,
    themeSettings: data.theme_settings,
    profileData: data.profile_data,
    pdfUrl: data.pdf_url,
    userName: data.name, // Add user's name for initials fallback
  };

  return (
    <PortfolioPage 
      data={portfolioData} 
      userCustomization={userCustomization}
      username={username}
    />
  );
}

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;
