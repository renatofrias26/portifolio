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
  skills: Array<{
    category: string;
    items: string[];
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  [key: string]: unknown;
}

export async function parseResume(pdfBuffer: Buffer): Promise<ParsedResume> {
  try {
    // Extract text from PDF
    // Use pdf-parse-fork which doesn't require workers
    const pdfParse = (await import("pdf-parse-fork")).default;
    const data = await pdfParse(pdfBuffer);
    const text = data.text;

    if (!text || text.trim().length === 0) {
      throw new Error("Could not extract text from PDF");
    }

    // Use OpenAI to parse the resume
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
  "skills": [
    {
      "category": "Frontend",
      "items": ["React", "Angular", "HTML/CSS", "JavaScript", "TypeScript"]
    },
    {
      "category": "Backend",
      "items": ["Node.js", "Java", "Python", ".NET"]
    },
    {
      "category": "Testing",
      "items": ["Jest", "Karma", "Cypress"]
    },
    {
      "category": "Tools",
      "items": ["Git", "Docker", "AWS", "Jenkins"]
    },
    {
      "category": "AI",
      "items": ["OpenAI", "Vertex AI", "TensorFlow"]
    }
  ],
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
- Return skills as an array of objects with "category" and "items" fields
- Use these category names: "Frontend", "Backend", "Testing", "Tools", "AI" (you can add others if needed)
- Frontend includes: UI frameworks, JavaScript libraries, HTML, CSS, and frontend technologies
- Backend includes: Server-side languages, frameworks, databases, and APIs
- Testing includes: Testing frameworks and methodologies
- Tools includes: Development tools, version control, CI/CD, cloud platforms, DevOps tools
- AI includes: AI/ML frameworks, services, and related technologies
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

    const parsedData = JSON.parse(response) as ParsedResume;

    // Convert skills to array format if AI returned object format
    if (parsedData.skills && !Array.isArray(parsedData.skills)) {
      const skillsArray: Array<{ category: string; items: string[] }> = [];
      Object.entries(parsedData.skills).forEach(([category, items]) => {
        skillsArray.push({ category, items: items as string[] });
      });
      parsedData.skills = skillsArray as Array<{
        category: string;
        items: string[];
      }>;
    }

    // Validate the structure
    if (!parsedData.personal || !parsedData.experience) {
      throw new Error("Invalid resume structure returned by AI");
    }

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
