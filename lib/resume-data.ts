// Helper function to fetch published resume data
export async function getResumeData() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/resume`,
      {
        next: { revalidate: 60 }, // Cache for 60 seconds
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch resume data");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching resume:", error);
    // Fallback to static data if API fails
    return null;
  }
}

// Map database resume structure to the format expected by portfolio components
export function mapResumeData(dbData: any) {
  if (!dbData) return null;

  console.log("🔍 mapResumeData - Input dbData.skills:", dbData.skills);

  // Skills should already be in array format from the database
  // No need for complex mapping - just use as-is!
  const skills = dbData.skills || [];

  console.log("🔍 mapResumeData - Using skills directly:", skills);

  return {
    personal: {
      name: dbData.personal?.name || "",
      title: dbData.personal?.title || "",
      location: dbData.personal?.location || "",
      email: dbData.personal?.email || "",
      phone: dbData.personal?.phone || "",
      summary: dbData.personal?.summary || "",
    },

    education:
      dbData.education?.map((edu: any) => ({
        degree: edu.degree,
        institution: edu.school || edu.institution,
        period: edu.year || edu.period,
      })) || [],

    skills: skills,

    experience:
      dbData.experience?.map((exp: any) => ({
        title: exp.title,
        company: exp.company,
        period: exp.period,
        highlights: exp.achievements || [],
        stack: exp.technologies || [],
      })) || [],

    projects:
      dbData.projects?.map((proj: any) => ({
        name: proj.name,
        description: proj.description,
        highlights: [], // Not in DB structure
        stack: proj.technologies || [],
        url: proj.link || proj.url,
      })) || [],
  };
}
