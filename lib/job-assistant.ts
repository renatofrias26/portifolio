import OpenAI from "openai";
import { ParsedResume } from "./resume-parser";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a tailored resume optimized for a specific job posting
 */
export async function generateTailoredResume(
  resumeData: ParsedResume,
  jobDescription: string,
  jobTitle: string,
  companyName: string,
): Promise<string> {
  const prompt = `You are an expert resume writer and ATS (Applicant Tracking System) optimization specialist.

TASK: Transform this resume to be highly tailored for this specific job posting. Make it ATS-friendly and keyword-optimized.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

JOB POSTING:
Position: ${jobTitle} at ${companyName}
${jobDescription}

REQUIREMENTS:
1. Analyze the job requirements and extract key skills/qualifications
2. Re-order and emphasize resume sections to match job priorities
3. Rewrite bullet points to highlight relevant achievements and use action verbs
4. Use keywords from the job description naturally throughout the resume
5. Maintain truthfulness - don't fabricate experience, only reframe existing content
6. Keep it concise and impactful (max 2 pages worth of content)
7. Include quantifiable metrics and results where available
8. Output in clean, professional markdown format

OUTPUT FORMAT:
# [Full Name]
**[Professional Title - aligned with target job]**

📧 [email] | 📱 [phone] | 📍 [location] | 🔗 [LinkedIn/GitHub/Portfolio if available]

## Professional Summary
[2-3 powerful sentences highlighting the most relevant experience for THIS specific job. Focus on value proposition and key achievements that match job requirements.]

## Core Competencies
[List skills matching job requirements, organized by relevance. Include both hard and soft skills mentioned in the job posting.]

**Technical Skills:** [List relevant technical skills]  
**[Other relevant category]:** [List skills]

## Professional Experience

### [Most Relevant Job Title]
**[Company Name]** | [Location] | [Month Year - Month Year]

- [Achievement-focused bullet using job posting keywords and quantified results]
- [Impact statement showing how you solved problems similar to job requirements]
- [Technical accomplishment relevant to the position]
- [Leadership or collaboration example if applicable]

[Repeat for other relevant positions, ordered by relevance to target job]

## Education

**[Degree]** | [School Name] | [Year]  
[Relevant coursework, honors, or GPA if strong and recent]

## Projects & Achievements
[Only include if highly relevant to the job. Show technical skills and problem-solving abilities.]

**[Project Name]**  
- [Brief description highlighting technologies and outcomes relevant to target role]

---

IMPORTANT: 
- Use strong action verbs (Led, Architected, Optimized, Delivered, etc.)
- Focus on achievements and impact, not just responsibilities
- Mirror the language and terminology used in the job posting
- Keep formatting clean and ATS-friendly (no tables, columns, or complex formatting)
- Ensure all contact information is preserved exactly as provided

Generate the tailored resume now:`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 3000,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating tailored resume:", error);
    throw new Error("Failed to generate tailored resume. Please try again.");
  }
}

/**
 * Generate a personalized cover letter for a specific job application
 */
export async function generateCoverLetter(
  resumeData: ParsedResume,
  jobDescription: string,
  jobTitle: string,
  companyName: string,
): Promise<string> {
  const prompt = `You are an expert career coach specializing in writing compelling, personalized cover letters that get interviews.

TASK: Write a professional cover letter for this job application.

CANDIDATE RESUME:
${JSON.stringify(resumeData, null, 2)}

JOB POSTING:
Position: ${jobTitle} at ${companyName}
${jobDescription}

REQUIREMENTS:
1. Professional yet personable and enthusiastic tone
2. Show genuine interest in the role and company
3. Highlight 2-3 most relevant achievements from the resume that match job requirements
4. Explain why this role is a perfect fit for the candidate's career goals
5. Demonstrate understanding of the company and role (based on job description context)
6. Keep to 3-4 concise paragraphs
7. Include a strong call to action
8. Output in markdown format

OUTPUT FORMAT:
# Cover Letter

**${jobTitle} Position**  
${companyName}  
[Current Date]

Dear Hiring Manager,

[OPENING PARAGRAPH - 2-3 sentences]
Hook the reader by expressing genuine enthusiasm for the role and company. Briefly mention how you learned about the position and why it excites you. Connect your background to the role in one compelling sentence.

[BODY PARAGRAPH 1 - 3-4 sentences]
Highlight your most relevant experience and achievement that directly relates to the job requirements. Use specific examples with quantifiable results. Show how your skills match what they're looking for.

[BODY PARAGRAPH 2 - 3-4 sentences]
Discuss additional qualifications and demonstrate cultural fit. Show you understand the company's mission/values (if mentioned in job description). Explain what unique value you bring to the role and team.

[CLOSING PARAGRAPH - 2-3 sentences]
Express enthusiasm for the opportunity to discuss how you can contribute to the team. Mention availability for an interview. Thank them for their consideration.

Best regards,  
[Full Name]  
[Email]  
[Phone]

---

IMPORTANT:
- Keep tone professional but avoid being overly formal or stiff
- Show personality while remaining appropriate for the industry
- Avoid clichés like "I'm a hard worker" - show, don't tell
- Every sentence should add value and be relevant to the job
- Length should be concise enough to read in under 2 minutes
- Use the candidate's actual name and contact information

Generate the cover letter now:`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 1800,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating cover letter:", error);
    throw new Error("Failed to generate cover letter. Please try again.");
  }
}

/**
 * Calculate token cost for generation
 */
export function calculateTokenCost(
  generateResume: boolean,
  generateCoverLetter: boolean,
): number {
  // Token pricing (adjustable for future monetization)
  const RESUME_COST = 10;
  const COVER_LETTER_COST = 5;

  let cost = 0;
  if (generateResume) cost += RESUME_COST;
  if (generateCoverLetter) cost += COVER_LETTER_COST;

  return cost;
}

/**
 * Extract job title and company name from job description using AI
 * Fallback when URL scraping fails or manual paste is used
 */
export async function extractJobInfo(
  jobDescription: string,
): Promise<{ jobTitle: string; companyName: string }> {
  const prompt = `Extract the job title and company name from this job posting.

JOB POSTING:
${jobDescription}

Return ONLY a JSON object in this exact format (no markdown, no explanation):
{"jobTitle": "exact job title", "companyName": "exact company name"}

If you cannot find the information, use "Not specified" for missing fields.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 100,
    });

    const content = response.choices[0].message.content || "{}";
    const parsed = JSON.parse(content);

    return {
      jobTitle: parsed.jobTitle || "Not specified",
      companyName: parsed.companyName || "Not specified",
    };
  } catch (error) {
    console.error("Error extracting job info:", error);
    return {
      jobTitle: "Not specified",
      companyName: "Not specified",
    };
  }
}
