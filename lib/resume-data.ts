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

  return {
    name: dbData.personal?.name || "",
    title: dbData.personal?.title || "",
    location: dbData.personal?.location || "",
    email: dbData.personal?.email || "",
    phone: dbData.personal?.phone || "",
    summary: dbData.personal?.summary || "",

    education:
      dbData.education?.map((edu: any) => ({
        degree: edu.degree,
        institution: edu.institution,
        period: edu.period,
        details: edu.details,
      })) || [],

    skills: {
      frontend:
        dbData.skills?.technical?.filter(
          (s: string) =>
            s.toLowerCase().includes("react") ||
            s.toLowerCase().includes("angular") ||
            s.toLowerCase().includes("html") ||
            s.toLowerCase().includes("css") ||
            s.toLowerCase().includes("javascript") ||
            s.toLowerCase().includes("typescript") ||
            s.toLowerCase().includes("flutter"),
        ) || [],
      backend:
        dbData.skills?.technical?.filter(
          (s: string) =>
            s.toLowerCase().includes("node") ||
            s.toLowerCase().includes("java") ||
            s.toLowerCase().includes("api") ||
            s.toLowerCase().includes(".net"),
        ) || [],
      testing:
        dbData.skills?.technical?.filter(
          (s: string) =>
            s.toLowerCase().includes("test") ||
            s.toLowerCase().includes("jest") ||
            s.toLowerCase().includes("karma"),
        ) || [],
      tools:
        dbData.skills?.technical?.filter(
          (s: string) =>
            s.toLowerCase().includes("git") ||
            s.toLowerCase().includes("aws") ||
            s.toLowerCase().includes("nx") ||
            s.toLowerCase().includes("pnpm"),
        ) || [],
      ai:
        dbData.skills?.technical?.filter(
          (s: string) =>
            s.toLowerCase().includes("ai") ||
            s.toLowerCase().includes("vertex") ||
            s.toLowerCase().includes("gemini") ||
            s.toLowerCase().includes("openai") ||
            s.toLowerCase().includes("copilot"),
        ) || [],
    },

    experience:
      dbData.experience?.map((exp: any) => ({
        title: exp.title,
        company: exp.company,
        period: exp.period,
        type: "Full Time", // Default value
        highlights: exp.achievements || [],
        stack: exp.technologies || [],
        reference: "", // Not stored in DB
      })) || [],

    projects:
      dbData.projects?.map((proj: any) => ({
        name: proj.name,
        description: proj.description,
        highlights: [], // Not in DB structure
        stack: proj.technologies || [],
        type: "Personal Project", // Default value
        url: proj.url,
      })) || [],

    uniqueBackground: [], // Not in DB structure
  };
}
