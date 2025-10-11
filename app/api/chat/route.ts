import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as cheerio from "cheerio";
import { getPublishedResumeByUsername } from "@/lib/db/queries";

const MAX_QUESTIONS = 10;
const URL_CACHE = new Map<string, { content: string; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Helper function to extract URLs from text
function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}

// Helper function to fetch and parse PDF content
async function fetchPdfContent(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return `[Unable to fetch PDF from ${url}]`;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Dynamic import for pdf-parse-fork to avoid build issues
    const pdfParse = (await import("pdf-parse-fork")).default;
    const data = await pdfParse(buffer);

    return data.text.substring(0, 4000); // Limit to 4000 chars for PDFs
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return `[Error parsing PDF from ${url}]`;
  }
}

// Helper function to fetch and extract text from HTML URL
async function fetchHtmlContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)",
      },
    });

    if (!response.ok) {
      return `[Unable to fetch content from ${url}]`;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $("script, style, nav, header, footer, iframe, noscript").remove();

    // Try to find main content areas (common job posting selectors)
    let text = "";
    const contentSelectors = [
      "main",
      "article",
      '[role="main"]',
      ".job-description",
      ".job-details",
      "#job-description",
      ".description",
      ".content",
    ];

    for (const selector of contentSelectors) {
      const content = $(selector).text().trim();
      if (content.length > 200) {
        text = content;
        break;
      }
    }

    // Fallback to body if no specific content found
    if (!text) {
      text = $("body").text();
    }

    // Clean up whitespace
    text = text.replace(/\s+/g, " ").trim().substring(0, 3000);

    return text || "[No readable content found]";
  } catch (error) {
    console.error("Error fetching HTML:", error);
    return `[Error fetching content from ${url}]`;
  }
}

// Helper function to fetch and extract text from URL (auto-detect type)
async function fetchUrlContent(url: string): Promise<string> {
  try {
    // Check cache first
    const cached = URL_CACHE.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.content;
    }

    let content: string;

    // Check if URL is likely a PDF
    if (url.toLowerCase().endsWith(".pdf") || url.includes(".pdf?")) {
      content = await fetchPdfContent(url);
    } else {
      // Otherwise treat as HTML
      content = await fetchHtmlContent(url);
    }

    // Store in cache
    URL_CACHE.set(url, { content, timestamp: Date.now() });

    return content;
  } catch (error) {
    console.error("Error fetching URL:", error);
    return `[Error fetching content from ${url}]`;
  }
}

export async function POST(req: Request) {
  try {
    const { message, username } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 },
      );
    }

    // Fetch user's published resume data
    const userData = await getPublishedResumeByUsername(username);

    if (!userData || !userData.data) {
      return NextResponse.json(
        { error: "User data not found" },
        { status: 404 },
      );
    }

    const resumeData = userData.data;
    const userName = userData.name || resumeData.personal?.name || username;
    const userEmail = resumeData.personal?.email || "";
    const userLinkedIn = userData.profile_data?.socialLinks?.linkedin || "";

    // Extract URLs from the message
    const urls = extractUrls(message);
    let urlContext = "";

    if (urls.length > 0) {
      const urlContents = await Promise.all(
        urls.slice(0, 2).map(async (url) => {
          const content = await fetchUrlContent(url);
          return `\nContent from ${url}:\n${content}\n`;
        }),
      );
      urlContext = "\n\nAdditional Context from URLs:" + urlContents.join("\n");
    }

    // Get or initialize question count from cookies
    const cookieStore = await cookies();
    const currentCount = parseInt(cookieStore.get("chat_count")?.value || "0");

    // Check if user has exceeded the limit
    if (currentCount >= MAX_QUESTIONS) {
      const contactInfo = [];
      if (userEmail) contactInfo.push(`📧 Email: ${userEmail}`);
      if (userLinkedIn) contactInfo.push(`💼 LinkedIn: ${userLinkedIn}`);
      
      const contactText = contactInfo.length > 0 
        ? `\n\nPlease reach out directly:\n${contactInfo.join("\n")}\n\nLooking forward to connecting with you!`
        : "\n\nPlease check the contact section below for ways to get in touch!";

      return NextResponse.json({
        message: `You've reached the maximum of ${MAX_QUESTIONS} questions per session. I'd love to continue our conversation!${contactText}`,
        questionCount: currentCount,
        maxQuestions: MAX_QUESTIONS,
        limitReached: true,
      });
    }

    const newCount = currentCount + 1;

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Return a fallback response if no API key is configured
      const summary = resumeData.personal?.summary || "";
      const title = resumeData.personal?.title || "Professional";
      const experience = resumeData.experience?.[0];
      
      let fallbackInfo = `Thank you for your question! AI-powered chat is currently being configured.\n\n`;
      fallbackInfo += `About ${userName}:\n`;
      if (title) fallbackInfo += `- Title: ${title}\n`;
      if (summary) fallbackInfo += `\n${summary.substring(0, 200)}...\n`;
      if (experience) fallbackInfo += `\nCurrently: ${experience.title} at ${experience.company}\n`;
      if (userEmail) fallbackInfo += `\nFeel free to reach out directly at ${userEmail}!`;
      
      return NextResponse.json({
        message: fallbackInfo,
      });
    }

    // Create a detailed context from resume data
    const personal = resumeData.personal || {};
    const experience = resumeData.experience || [];
    const skills = resumeData.skills || [];
    const projects = resumeData.projects || [];
    const education = resumeData.education || [];

    let resumeContext = `
Resume Data:
Name: ${personal.name || userName}
Title: ${personal.title || "Professional"}
Location: ${personal.location || "Not specified"}
Email: ${personal.email || userEmail}

Summary: ${personal.summary || "No summary provided"}
`;

    if (experience.length > 0) {
      resumeContext += `\nCurrent Focus:\n${experience[0].highlights?.join("\n") || "Current role information"}\n`;
    }

    if (skills.length > 0) {
      resumeContext += `\nSkills:\n${skills
        .map((s: { category: string; items?: string[] }) => `- ${s.category}: ${s.items?.join(", ") || ""}`)
        .join("\n")}\n`;
    }

    if (experience.length > 0) {
      resumeContext += `\nRecent Experience:\n${experience
        .slice(0, 3)
        .map(
          (exp: { title: string; company: string; period: string; highlights?: string[]; stack?: string[] }) => `
${exp.title} at ${exp.company} (${exp.period})
Key achievements: ${exp.highlights?.slice(0, 3).join("; ") || ""}
Stack: ${exp.stack?.join(", ") || ""}
`,
        )
        .join("\n")}\n`;
    }

    if (projects && projects.length > 0) {
      resumeContext += `\nProjects:\n${projects
        .map(
          (proj: { name: string; description: string; stack?: string[] }) => `
${proj.name}: ${proj.description}
Stack: ${proj.stack?.join(", ") || ""}
`,
        )
        .join("\n")}\n`;
    }

    if (education.length > 0) {
      resumeContext += `\nEducation:\n${education
        .map((edu: { degree: string; institution: string; period: string }) => `${edu.degree} - ${edu.institution} (${edu.period})`)
        .join("\n")}\n`;
    }

    // Generate dynamic AI context
    const aiContext = `You are an AI assistant helping visitors learn about ${userName}, a ${personal.title || "professional"}.

When answering questions:
- Be friendly and professional
- Provide accurate information based on the resume data provided
- Highlight relevant experience and skills
- For role-fit questions, analyze the technical stack and relevant experience
- Keep responses concise but informative (typically 2-4 sentences unless more detail is requested)
- If job posting or position details are provided, analyze qualifications against specific requirements

Answer questions about their experience, skills, projects, and whether they'd be a good fit for positions.`;

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content: `${aiContext}\n\n${resumeContext}${urlContext}\n\nProvide helpful, accurate, and concise responses about ${userName}. Keep responses friendly and professional.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      maxOutputTokens: 500,
    });

    // Prepare the response message
    let responseMessage = text;

    // Add warning message after 9th question (one question remaining)
    if (newCount === MAX_QUESTIONS - 1) {
      const contactMethods = [];
      if (userEmail) contactMethods.push(`email at ${userEmail}`);
      if (userLinkedIn) contactMethods.push("LinkedIn");
      
      const contactText = contactMethods.length > 0
        ? ` For extended conversations, please contact me directly via ${contactMethods.join(" or ")}!`
        : " For extended conversations, please check the contact section below!";
      
      responseMessage += `\n\n⚠️ Note: You have 1 question remaining in this session.${contactText}`;
    }

    // Set the updated count in cookies (expires in 24 hours)
    const response = NextResponse.json({
      message: responseMessage,
      questionCount: newCount,
      maxQuestions: MAX_QUESTIONS,
    });

    response.cookies.set("chat_count", newCount.toString(), {
      maxAge: 60 * 60 * 24, // 24 hours
      httpOnly: true,
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 },
    );
  }
}
