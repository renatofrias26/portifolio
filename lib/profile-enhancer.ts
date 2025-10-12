import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ProfileEnhancement {
  professionalTitle: string;
  taglines: string[];
  currentFocus: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  bio?: string;
}

/**
 * Enhance profile data using AI
 * Generates professional title, taglines, and current focus based on resume data
 */
export async function enhanceProfile(resumeData: {
  personal: {
    name?: string;
    title?: string;
    summary?: string;
  };
  experience?: Array<{
    title: string;
    company: string;
    description?: string;
    achievements?: string[];
  }>;
  skills?: Array<{
    category: string;
    items: string[];
  }>;
}): Promise<ProfileEnhancement> {
  try {
    // Prepare context for AI
    const context = {
      name: resumeData.personal.name || "Professional",
      currentTitle: resumeData.personal.title || "",
      summary: resumeData.personal.summary || "",
      recentExperience: resumeData.experience?.slice(0, 2) || [],
      topSkills: resumeData.skills?.slice(0, 3) || [],
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert career coach and personal branding specialist. 
Your job is to create compelling professional profiles that help people stand out.

Based on the resume data provided, generate:
1. A professional title (concise, impactful, 2-5 words)
2. Five creative taglines (each 50-80 characters, engaging and memorable)
3. Three current focus areas (what they're working on/interested in now)
4. A short bio (2-3 sentences, professional yet personable)

Make it:
- Authentic and based on their actual experience
- Engaging and memorable
- Professional but not corporate-stuffy
- Action-oriented and results-focused
- Modern and relevant

Return ONLY valid JSON with this structure:
{
  "professionalTitle": "string",
  "taglines": ["tagline1", "tagline2", "tagline3", "tagline4", "tagline5"],
  "currentFocus": ["focus1", "focus2", "focus3"],
  "bio": "string"
}`,
        },
        {
          role: "user",
          content: `Create a professional profile for:

Name: ${context.name}
Current Title: ${context.currentTitle}
Summary: ${context.summary}

Recent Experience:
${context.recentExperience
  .map((exp, idx) => `${idx + 1}. ${exp.title} at ${exp.company}`)
  .join("\n")}

Top Skills:
${context.topSkills
  .map((skill) => `- ${skill.category}: ${skill.items.slice(0, 5).join(", ")}`)
  .join("\n")}

Generate an compelling professional profile.`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8, // More creative for taglines
    });

    const result = completion.choices[0].message.content;
    if (!result) {
      throw new Error("No response from AI");
    }

    const parsed = JSON.parse(result);

    return {
      professionalTitle:
        parsed.professionalTitle || context.currentTitle || "Professional",
      taglines: parsed.taglines || [],
      currentFocus: parsed.currentFocus || [],
      bio: parsed.bio,
      socialLinks: {}, // Will be enhanced in future with link detection
    };
  } catch (error) {
    console.error("Error enhancing profile:", error);

    // Return fallback data
    return {
      professionalTitle: resumeData.personal.title || "Professional",
      taglines: [
        "Building innovative solutions",
        "Passionate about technology",
        "Creating impact through code",
      ],
      currentFocus: [
        "Professional Development",
        "Innovation",
        "Problem Solving",
      ],
      bio: resumeData.personal.summary || "",
    };
  }
}
