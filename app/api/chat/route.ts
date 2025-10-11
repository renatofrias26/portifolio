import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { resumeData, aiContext } from "@/data/resume";
import { socialLinks } from "@/data/social-links";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as cheerio from "cheerio";

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
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

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
      return NextResponse.json({
        message: `You've reached the maximum of ${MAX_QUESTIONS} questions per session. I'd love to continue our conversation!\n\nPlease reach out directly:\n📧 Email: ${resumeData.email}\n💼 LinkedIn: ${socialLinks.linkedin}\n\nLooking forward to connecting with you!`,
        questionCount: currentCount,
        maxQuestions: MAX_QUESTIONS,
        limitReached: true,
      });
    }

    const newCount = currentCount + 1;

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Return a fallback response if no API key is configured
      return NextResponse.json({
        message: `Thank you for your question! To enable AI-powered responses, please configure the OPENAI_API_KEY environment variable. 

In the meantime, here's some quick info:
- 5+ years of software development experience
- Specializing in Angular, React, and AI development
- Currently at Auto & General, working on enterprise AI solutions
- Unique background: Mechatronics Engineering → Boat Repair → Software Development

Feel free to check out my experience section below or contact me directly at ${resumeData.email}!`,
      });
    }

    // Create a detailed context from resume data
    const resumeContext = `
Resume Data:
Name: ${resumeData.name}
Title: ${resumeData.title}
Location: ${resumeData.location}
Email: ${resumeData.email}

Summary: ${resumeData.summary}

Current Focus:
${resumeData.experience[0].highlights.join("\n")}

Skills:
${resumeData.skills
  .map((s) => `- ${s.category}: ${s.items.join(", ")}`)
  .join("\n")}

Recent Experience:
${resumeData.experience
  .map(
    (exp) => `
${exp.title} at ${exp.company} (${exp.period})
Key achievements: ${exp.highlights.slice(0, 3).join("; ")}
Stack: ${exp.stack.join(", ")}
`,
  )
  .join("\n")}

Projects:
${resumeData.projects
  .map(
    (proj) => `
${proj.name}: ${proj.description}
Stack: ${proj.stack.join(", ")}
`,
  )
  .join("\n")}

Unique Background:
${resumeData.uniqueBackground
  .map((bg) => `${bg.title} at ${bg.company} (${bg.period})`)
  .join("\n")}
    `;

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content: `${aiContext}\n\n${resumeContext}${urlContext}\n\nProvide helpful, accurate, and concise responses about Renato. Keep responses friendly and professional, typically 2-4 sentences unless more detail is specifically requested. If job posting or position details are provided, analyze Renato's qualifications against the specific requirements mentioned.`,
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
      responseMessage += `\n\n⚠️ Note: You have 1 question remaining in this session. For extended conversations, please contact me directly at ${resumeData.email} or via LinkedIn!`;
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
