import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { resumeData, aiContext } from "@/data/resume";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

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
- Frontend: ${resumeData.skills.frontend.join(", ")}
- Backend: ${resumeData.skills.backend.join(", ")}
- AI: ${resumeData.skills.ai.join(", ")}
- Testing: ${resumeData.skills.testing.join(", ")}
- Tools: ${resumeData.skills.tools.join(", ")}

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
          content: `${aiContext}\n\n${resumeContext}\n\nProvide helpful, accurate, and concise responses about Renato. Keep responses friendly and professional, typically 2-4 sentences unless more detail is specifically requested.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      maxTokens: 500,
    });

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 },
    );
  }
}
