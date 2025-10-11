import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ParsedResume {
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
    location: string;
    period: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
    location?: string;
  }>;
  skills: {
    [category: string]: string[];
  };
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
}

export async function parseResume(pdfBuffer: Buffer): Promise<ParsedResume> {
  try {
    // Extract text from PDF
    console.log("📖 Extracting text from PDF...");

    // Use pdf-parse-fork which doesn't require workers
    // @ts-ignore - pdf-parse-fork doesn't have type definitions
    const pdfParse = (await import("pdf-parse-fork")).default;
    const data = await pdfParse(pdfBuffer);
    const text = data.text;

    if (!text || text.trim().length === 0) {
      throw new Error("Could not extract text from PDF");
    }

    console.log(`✅ Extracted ${text.length} characters from PDF`);

    // Use OpenAI to parse the resume
    console.log("🤖 Sending to OpenAI for parsing...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a resume parser. Extract structured information from resumes and return it as JSON.
          
The JSON should follow this exact structure:
{
  "personal": {
    "name": "Full Name",
    "title": "Professional Title",
    "email": "email@example.com",
    "phone": "phone number",
    "location": "City, Country",
    "summary": "Professional summary or bio"
  },
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, Country",
      "period": "Start Date - End Date",
      "description": "Brief description",
      "achievements": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "school": "School Name",
      "year": "Year",
      "location": "City, Country"
    }
  ],
  "skills": {
    "Category Name": ["Skill 1", "Skill 2"]
  },
  "projects": [
    {
      "name": "Project Name",
      "description": "Description",
      "technologies": ["Tech 1", "Tech 2"],
      "link": "URL (optional)"
    }
  ]
}

Important:
- Extract ALL information accurately
- Organize skills into logical categories (e.g., "Languages", "Frameworks", "Tools")
- Include ALL work experience and education
- Format dates consistently
- If a field is not found, use reasonable defaults or omit optional fields
- Return ONLY valid JSON, no markdown or explanations`,
        },
        {
          role: "user",
          content: `Parse this resume and return structured JSON:\n\n${text}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1, // Low temperature for consistency
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("No response from OpenAI");
    }

    console.log("✅ Received response from OpenAI");
    const parsedData = JSON.parse(response) as ParsedResume;

    // Validate the structure
    if (!parsedData.personal || !parsedData.experience || !parsedData.skills) {
      throw new Error("Invalid resume structure returned by AI");
    }

    console.log("✅ Resume parsed successfully");
    return parsedData;
  } catch (error) {
    console.error("Error parsing resume:", error);
    throw new Error(
      `Failed to parse resume: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

// Helper function to convert parsed data to the format used by resume.ts
export function convertToResumeFormat(parsed: ParsedResume) {
  return {
    name: parsed.personal.name,
    title: parsed.personal.title,
    contact: {
      email: parsed.personal.email,
      phone: parsed.personal.phone,
      location: parsed.personal.location,
    },
    summary: parsed.personal.summary,
    experience: parsed.experience,
    education: parsed.education,
    skills: parsed.skills,
    projects: parsed.projects || [],
  };
}
