import { sql } from "@vercel/postgres";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { LandingHeader } from "@/components/landing-header";
import { CollapsibleFilters } from "@/components/profiles/collapsible-filters";
import { layouts, typography, containerPadding } from "@/lib/styles";

interface SearchParams {
  search?: string;
  location?: string;
  skill?: string;
  title?: string;
}

interface ProfileCardData {
  username: string;
  name: string;
  title: string;
  location: string;
  summary: string;
  skills: string[];
  profile_image_url: string | null;
}

async function getProfiles(searchParams: SearchParams) {
  try {
    // Build dynamic query based on filters
    let query = `
      SELECT 
        u.username,
        u.name,
        u.profile_image_url,
        r.data->>'personal' as personal_data,
        r.data->>'skills' as skills_data
      FROM users u
      INNER JOIN resume_data r ON u.id = r.user_id
      WHERE u.is_active = true 
        AND r.is_published = true
    `;

    const params: string[] = [];
    let paramCount = 1;

    // Add search filter (searches in name, title, summary)
    if (searchParams.search) {
      query += ` AND (
        LOWER(u.name) LIKE LOWER($${paramCount}) OR
        LOWER(r.data->'personal'->>'title') LIKE LOWER($${paramCount}) OR
        LOWER(r.data->'personal'->>'summary') LIKE LOWER($${paramCount})
      )`;
      params.push(`%${searchParams.search}%`);
      paramCount++;
    }

    // Add location filter
    if (searchParams.location) {
      query += ` AND LOWER(r.data->'personal'->>'location') LIKE LOWER($${paramCount})`;
      params.push(`%${searchParams.location}%`);
      paramCount++;
    }

    // Add title filter
    if (searchParams.title) {
      query += ` AND LOWER(r.data->'personal'->>'title') LIKE LOWER($${paramCount})`;
      params.push(`%${searchParams.title}%`);
      paramCount++;
    }

    // Add skill filter - search in skills array
    if (searchParams.skill) {
      query += ` AND EXISTS (
        SELECT 1 FROM jsonb_array_elements(r.data->'skills') skill
        WHERE EXISTS (
          SELECT 1 FROM jsonb_array_elements_text(skill->'items') item
          WHERE LOWER(item) LIKE LOWER($${paramCount})
        )
      )`;
      params.push(`%${searchParams.skill}%`);
      paramCount++;
    }

    query += ` ORDER BY r.updated_at DESC LIMIT 50`;

    const result = await sql.query(query, params);

    return result.rows.map((row) => {
      const personal = JSON.parse(row.personal_data || "{}");
      const skills = JSON.parse(row.skills_data || "[]");

      // Extract all skill items into a flat array
      const allSkills = skills.flatMap(
        (s: { items: string[] }) => s.items || [],
      );

      return {
        username: row.username,
        name: row.name || personal.name || "Anonymous",
        title: personal.title || "Professional",
        location: personal.location || "Location not specified",
        summary: personal.summary || "",
        skills: allSkills.slice(0, 5), // Show top 5 skills
        profile_image_url: row.profile_image_url,
      } as ProfileCardData;
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return [];
  }
}

async function getFilterOptions() {
  try {
    // Get unique locations
    const locationsResult = await sql`
      SELECT DISTINCT r.data->'personal'->>'location' as location
      FROM resume_data r
      INNER JOIN users u ON r.user_id = u.id
      WHERE r.is_published = true 
        AND u.is_active = true
        AND r.data->'personal'->>'location' IS NOT NULL
      ORDER BY location
      LIMIT 100
    `;

    // Get unique job titles
    const titlesResult = await sql`
      SELECT DISTINCT r.data->'personal'->>'title' as title
      FROM resume_data r
      INNER JOIN users u ON r.user_id = u.id
      WHERE r.is_published = true 
        AND u.is_active = true
        AND r.data->'personal'->>'title' IS NOT NULL
      ORDER BY title
      LIMIT 100
    `;

    return {
      locations: locationsResult.rows
        .map((r) => r.location)
        .filter(Boolean) as string[],
      titles: titlesResult.rows.map((r) => r.title).filter(Boolean) as string[],
    };
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return { locations: [], titles: [] };
  }
}

function ProfileCard({ profile }: { profile: ProfileCardData }) {
  return (
    <Link href={`/${profile.username}`} className="block group">
      <GlassCard className="h-full">
        <div className="flex items-start gap-4">
          {/* Profile Image - Hidden on mobile */}
          <div className="hidden sm:block relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600 flex-shrink-0">
            {profile.profile_image_url ? (
              <Image
                src={profile.profile_image_url}
                alt={profile.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {profile.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
              {profile.title}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-1 mb-3">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {profile.location}
            </p>
            {profile.summary && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                {profile.summary}
              </p>
            )}
            {/* Skills */}
            {profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Arrow Icon */}
          <div className="text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}

function ProfilesLoading() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <GlassCard key={i} hover={false}>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
            <div className="flex-1">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-1/2 animate-pulse" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

async function ProfilesList({ searchParams }: { searchParams: SearchParams }) {
  const profiles = await getProfiles(searchParams);

  if (profiles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-block p-6 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
          <svg
            className="w-12 h-12 text-purple-600 dark:text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          No profiles found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((profile) => (
        <ProfileCard key={profile.username} profile={profile} />
      ))}
    </div>
  );
}

export default async function ProfilesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filterOptions = await getFilterOptions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Header with Login/Dashboard */}
      <LandingHeader />

      <div
        className={`${layouts.centered} ${containerPadding.page} py-8 sm:py-10 md:py-12`}
      >
        {/* Page Title */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h1
            className={`${typography.h1} mb-3 sm:mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent`}
          >
            Discover Talented Professionals
          </h1>
          <p
            className={`${typography.bodyLarge} text-gray-600 dark:text-gray-400`}
          >
            Browse AI-powered portfolios and find your next hire
          </p>
        </div>

        {/* Filters - Collapsible on Mobile */}
        <CollapsibleFilters
          searchParams={searchParams}
          filterOptions={filterOptions}
        />

        {/* Profiles Grid */}
        <Suspense fallback={<ProfilesLoading />}>
          <ProfilesList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

export const revalidate = 300; // Revalidate every 5 minutes
