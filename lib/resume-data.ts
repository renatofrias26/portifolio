import { getPublishedResume, getPublishedResumeByUsername } from "./db/queries";

// Helper function to fetch published resume data by user ID
export async function getResumeData(userId: number) {
  try {
    const publishedResume = await getPublishedResume(userId);
    return publishedResume?.data || null;
  } catch (error) {
    console.error("Error fetching resume:", error);
    return null;
  }
}

// Helper function to fetch published resume data by username (for public access)
export async function getResumeDataByUsername(username: string) {
  try {
    const publishedResume = await getPublishedResumeByUsername(username);
    return publishedResume?.data || null;
  } catch (error) {
    console.error("Error fetching resume:", error);
    return null;
  }
}

// Map database resume structure to the format expected by portfolio components
export function mapResumeData(dbData: Record<string, unknown> | null) {
  if (!dbData) return null;

  // Skills should already be in array format from the database
  // No need for complex mapping - just use as-is!
  const skills =
    (dbData.skills as Array<{ category: string; items: string[] }>) || [];

  return {
    personal: {
      name:
        ((dbData.personal as Record<string, unknown>)?.name as string) || "",
      title:
        ((dbData.personal as Record<string, unknown>)?.title as string) || "",
      location:
        ((dbData.personal as Record<string, unknown>)?.location as string) ||
        "",
      email:
        ((dbData.personal as Record<string, unknown>)?.email as string) || "",
      phone:
        ((dbData.personal as Record<string, unknown>)?.phone as string) || "",
      summary:
        ((dbData.personal as Record<string, unknown>)?.summary as string) || "",
    },

    education:
      (dbData.education as Array<Record<string, unknown>>)?.map((edu) => ({
        degree: edu.degree as string,
        institution: (edu.school || edu.institution) as string,
        period: (edu.year || edu.period) as string,
      })) || [],

    skills: skills,

    experience:
      (dbData.experience as Array<Record<string, unknown>>)?.map((exp) => ({
        title: exp.title as string,
        company: exp.company as string,
        period: exp.period as string,
        highlights: (exp.achievements || []) as string[],
        stack: (exp.technologies || []) as string[],
      })) || [],

    projects:
      (dbData.projects as Array<Record<string, unknown>>)?.map((proj) => ({
        name: proj.name as string,
        description: proj.description as string,
        highlights: [] as string[], // Not in DB structure
        stack: (proj.technologies || []) as string[],
        url: (proj.link || proj.url) as string,
      })) || [],
  };
}
