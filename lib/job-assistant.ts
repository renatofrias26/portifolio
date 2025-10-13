import OpenAI from "openai";
import { ParsedResume } from "./resume-parser";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Clean AI response content by removing markdown code blocks if present
 */
function cleanAIJsonResponse(content: string): string {
  let cleaned = content.trim();

  // Remove markdown code blocks (```json or ```)
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*\n?/, "").replace(/\n?```\s*$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*\n?/, "").replace(/\n?```\s*$/, "");
  }

  return cleaned.trim();
}

// ============================================================================
// STRUCTURED OUTPUT INTERFACES
// ============================================================================

/**
 * Job fit analysis result with scoring and recommendations
 */
export interface JobFitAnalysis {
  overallScore: number; // 0-100 score
  fitLevel: "excellent" | "good" | "moderate" | "poor";
  strengths: string[]; // Key matching strengths
  gaps: string[]; // Missing or weak areas
  recommendations: string[]; // How to improve application
  keyInsights: string; // Summary paragraph
}

/**
 * Resume generation result with structured output
 */
export interface ResumeGenerationResult {
  resume: string; // The actual markdown resume
  recommendations: string[]; // AI recommendations as array
  keyChanges: string[]; // List of major changes made
}

/**
 * Cover letter generation result with structured output
 */
export interface CoverLetterGenerationResult {
  coverLetter: string; // The actual markdown cover letter
  recommendations: string[]; // AI recommendations as array
  keyPoints: string[]; // Main selling points emphasized
}

/**
 * Generate a tailored resume optimized for a specific job posting
 * Uses gpt-5-nano for superior reasoning and strategic optimization
 */
export async function generateTailoredResume(
  resumeData: ParsedResume,
  jobDescription: string,
  jobTitle: string,
  companyName: string,
): Promise<ResumeGenerationResult> {
  const prompt = `You are an expert resume writer and ATS optimization specialist with deep strategic thinking capabilities.

TASK: Analyze and transform this resume to be perfectly tailored for this specific job posting.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

JOB POSTING:
Position: ${jobTitle} at ${companyName}
${jobDescription}

STRATEGIC ANALYSIS REQUIRED:
1. Deep analysis: Extract ALL key requirements, skills, and qualifications from job posting
2. Skills mapping: Match candidate's experience to each job requirement (explicit and implicit)
3. Priority ranking: Determine which achievements are most relevant and impactful
4. Keyword optimization: Identify critical ATS keywords and incorporate naturally
5. Content restructuring: Re-order all sections to highlight most relevant experience first
6. Achievement enhancement: Rewrite bullets to emphasize results matching job needs
7. Gap mitigation: Address any gaps by highlighting transferable skills
8. Quality check: Ensure truthfulness while maximizing relevance

OUTPUT AS JSON with this EXACT structure:
{
  "resume": "# [Full Name]\\n**[Professional Title]**\\n\\n📧 [email] | 📱 [phone] | 📍 [location] | 🔗 [links]\\n\\n## Professional Summary\\n[2-3 powerful sentences]\\n\\n## Core Competencies\\n**[Category]:** [skills]\\n\\n## Professional Experience\\n### [Position]\\n**[Company]** | [Location] | [Dates]\\n- [Achievement bullet]\\n\\n## Education\\n**[Degree]** | [School] | [Year]",
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "keyChanges": ["Major change 1", "Major change 2", "Major change 3"]
}

CRITICAL RULES for the resume markdown:
- Use EXACT action verbs that match job posting language
- Every bullet must connect to a job requirement
- Quantify everything (percentages, numbers, scale)
- Mirror terminology from job description
- Keep ATS-friendly: no tables or complex formatting
- Maximum 2 pages worth of content
- Be truthful - reframe only, never fabricate

Think step-by-step, then generate the JSON response.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0].message.content || "{}";
    const parsed = JSON.parse(cleanAIJsonResponse(content));

    return {
      resume: parsed.resume || "",
      recommendations: parsed.recommendations || [],
      keyChanges: parsed.keyChanges || [],
    };
  } catch (error) {
    console.error("Error generating tailored resume:", error);
    throw new Error("Failed to generate tailored resume. Please try again.");
  }
}

/**
 * Generate a personalized cover letter for a specific job posting
 * Uses gpt-5-nano for superior reasoning about candidate fit and persuasive writing
 */
export async function generateCoverLetter(
  resumeData: ParsedResume,
  jobDescription: string,
  jobTitle: string,
  companyName: string,
): Promise<CoverLetterGenerationResult> {
  const prompt = `You are an expert cover letter writer with deep strategic thinking capabilities who creates compelling, interview-winning cover letters.

TASK: Analyze the candidate's background against the job requirements and craft a highly persuasive cover letter.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

JOB POSTING:
Position: ${jobTitle} at ${companyName}
${jobDescription}

STRATEGIC ANALYSIS REQUIRED:
1. Deep match analysis: Identify 2-3 strongest connections between candidate and job
2. Value proposition: Determine unique value vs. typical applicants
3. Company research: Extract insights about culture/mission from job posting
4. Tone calibration: Assess appropriate formality based on industry
5. Storytelling strategy: Select experiences to highlight for maximum impact
6. Gap addressing: Plan how to address skill gaps with transferable skills
7. Call-to-action: Craft confident, specific next step request

OUTPUT AS JSON with this EXACT structure:
{
  "coverLetter": "# Cover Letter\\n\\n**${jobTitle} Position**\\n${companyName}\\n${new Date().toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  )}\\n\\nDear Hiring Manager,\\n\\n[Opening paragraph]\\n\\n[Body paragraph 1]\\n\\n[Body paragraph 2]\\n\\n[Closing paragraph]\\n\\nBest regards,\\n[Name]\\n[Email]\\n[Phone]",
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "keyPoints": ["Main selling point 1", "Main selling point 2", "Main selling point 3"]
}

CRITICAL RULES for the cover letter markdown:
- Every sentence must serve a strategic purpose
- Show, don't tell: Use concrete examples vs. self-praise
- Match tone and energy of the job posting
- Avoid ALL clichés ("passionate team player", etc.)
- Keep to 250-350 words (under 2 minutes to read)
- Use specific numbers, technologies, achievements
- Make them excited to interview you
- Be authentic while staying professional

Think step-by-step through what makes this candidate perfect for THIS role, then generate the JSON response.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0].message.content || "{}";
    const parsed = JSON.parse(cleanAIJsonResponse(content));

    return {
      coverLetter: parsed.coverLetter || "",
      recommendations: parsed.recommendations || [],
      keyPoints: parsed.keyPoints || [],
    };
  } catch (error) {
    console.error("Error generating cover letter:", error);
    throw new Error("Failed to generate cover letter. Please try again.");
  }
}

/**
 * Calculate token cost for generation
 * Note: gpt-5-nano pricing is higher than gpt-4o due to superior reasoning capabilities
 */
export function calculateTokenCost(
  generateResume: boolean,
  generateCoverLetter: boolean,
  analyzeJobFit?: boolean, // Optional job fit analysis
): number {
  // Token pricing adjusted for gpt-5-nano model (3-5x more expensive than gpt-4o)
  const RESUME_COST = 20; // Increased from 10 (more complex reasoning task)
  const COVER_LETTER_COST = 10; // Increased from 5 (shorter but still strategic)
  const JOB_FIT_COST = 2; // Fast analysis with gpt-4o-mini

  let cost = 0;
  if (generateResume) cost += RESUME_COST;
  if (generateCoverLetter) cost += COVER_LETTER_COST;
  if (analyzeJobFit) cost += JOB_FIT_COST;

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
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content || "{}";
    const parsed = JSON.parse(cleanAIJsonResponse(content));

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

/**
 * Analyze how well a candidate's resume matches a job posting
 * Returns detailed fit analysis with scoring and recommendations
 */
export async function analyzeJobFit(
  resumeData: ParsedResume,
  jobDescription: string,
  jobTitle: string,
  companyName: string,
): Promise<JobFitAnalysis> {
  const prompt = `You are an expert recruiter and career advisor. Analyze how well this candidate matches this job posting.

CANDIDATE RESUME:
${JSON.stringify(resumeData, null, 2)}

JOB POSTING:
Position: ${jobTitle} at ${companyName}
${jobDescription}

Provide a comprehensive fit analysis in this EXACT JSON format:
{
  "overallScore": <number 0-100>,
  "fitLevel": "<excellent|good|moderate|poor>",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "gaps": ["gap 1", "gap 2"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "keyInsights": "Brief paragraph summarizing the overall fit and main considerations"
}

SCORING GUIDE:
- 90-100: Excellent fit - candidate meets all/most requirements with strong relevant experience
- 75-89: Good fit - candidate meets most requirements, minor gaps can be addressed
- 60-74: Moderate fit - candidate has transferable skills but notable gaps exist
- 0-59: Poor fit - significant gaps in required qualifications

Focus on:
1. Technical skills match
2. Experience level alignment
3. Industry/domain knowledge
4. Soft skills and cultural fit indicators
5. Career trajectory relevance`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content || "{}";

    // Clean the response - remove markdown code blocks if present
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent
        .replace(/^```json\s*\n?/, "")
        .replace(/\n?```\s*$/, "");
    } else if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent
        .replace(/^```\s*\n?/, "")
        .replace(/\n?```\s*$/, "");
    }

    const parsed = JSON.parse(cleanedContent);

    return {
      overallScore: parsed.overallScore || 0,
      fitLevel: parsed.fitLevel || "poor",
      strengths: parsed.strengths || [],
      gaps: parsed.gaps || [],
      recommendations: parsed.recommendations || [],
      keyInsights: parsed.keyInsights || "Unable to analyze fit.",
    };
  } catch (error) {
    console.error("Error analyzing job fit:", error);
    throw new Error("Failed to analyze job fit. Please try again.");
  }
}
