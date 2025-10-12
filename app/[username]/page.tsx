import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PortfolioPage } from "@/components/portfolio-page";
import {
  getPublishedResumeByUsername,
  getPublishedResumeByUsernameForOwner,
  getUserByUsername,
} from "@/lib/db/queries";
import { mapResumeData } from "@/lib/resume-data";

type Props = {
  params: Promise<{ username: string }>;
};

// Force dynamic rendering to respect privacy settings in real-time
export const dynamic = "force-dynamic";

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

  // Check if user is logged in
  const session = await getServerSession(authOptions);

  // First, try to get the user data to check ownership
  const ownerData = await getUserByUsername(username);

  // Check if the logged-in user is the owner
  const isOwner =
    session?.user?.id && ownerData?.id === parseInt(session.user.id);

  // Fetch user's published resume
  // If owner, use the owner query (ignores is_public, allows viewing private profiles)
  // If not owner, use the public query (only shows public profiles)
  const data = isOwner
    ? await getPublishedResumeByUsernameForOwner(username)
    : await getPublishedResumeByUsername(username);

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

  // Check if this is a private profile being viewed by owner
  const isPrivateView = isOwner && ownerData?.is_public === false;

  return (
    <>
      <PortfolioPage
        data={portfolioData}
        userCustomization={userCustomization}
        username={username}
      />
      {isPrivateView && (
        <div className="bg-yellow-100 fixed w-full bottom-0 dark:bg-yellow-900/30 border-b border-yellow-300 dark:border-yellow-700 px-4 py-3 text-center">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            🔒 <strong>Private Profile</strong> - Only you can see this page.
            Others will see a 404 error.{" "}
            <a
              href="/admin/profile"
              className="underline hover:no-underline font-medium"
            >
              Make it public
            </a>
          </p>
        </div>
      )}
    </>
  );
}

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;
