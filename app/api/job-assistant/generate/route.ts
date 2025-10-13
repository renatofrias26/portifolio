import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { parseResume } from "@/lib/resume-parser";
import {
  generateTailoredResume,
  generateCoverLetter,
  calculateTokenCost,
  extractJobInfo,
} from "@/lib/job-assistant";
import { fetchJobPosting, isValidUrl } from "@/lib/job-scraper";
import {
  getPublishedResume,
  getUserTokenBalance,
  deductTokens,
} from "@/lib/db/queries";

export const runtime = "nodejs";
export const maxDuration = 60; // AI generation can take time

/**
 * Generate tailored resume and/or cover letter
 * POST /api/job-assistant/generate
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // Parse request body
    const formData = await request.formData();
    const resumeSource = formData.get("resumeSource") as string;
    const resumeFile = formData.get("resumeFile") as File | null;
    const resumeVersion = formData.get("resumeVersion") as string | null;
    const jobUrl = formData.get("jobUrl") as string | null;
    const jobDescription = formData.get("jobDescription") as string | null;
    const jobTitleOverride = formData.get("jobTitle") as string | null;
    const companyNameOverride = formData.get("companyName") as string | null;
    const generateResume = formData.get("generateResume") === "true";
    const generateCL = formData.get("generateCoverLetter") === "true";

    // Validation
    if (
      !resumeSource ||
      (resumeSource !== "existing" && resumeSource !== "upload")
    ) {
      return NextResponse.json(
        { error: "Invalid resume source" },
        { status: 400 },
      );
    }

    if (!jobUrl && !jobDescription) {
      return NextResponse.json(
        { error: "Either job URL or job description is required" },
        { status: 400 },
      );
    }

    if (!generateResume && !generateCL) {
      return NextResponse.json(
        { error: "Select at least one document to generate" },
        { status: 400 },
      );
    }

    // Check token balance
    const tokenBalance = await getUserTokenBalance(userId);
    const tokenCost = calculateTokenCost(generateResume, generateCL);

    if (tokenBalance.token_credits < tokenCost) {
      return NextResponse.json(
        {
          error: `Insufficient credits. You need ${tokenCost} credits but only have ${tokenBalance.token_credits}.`,
          required: tokenCost,
          available: tokenBalance.token_credits,
        },
        { status: 402 },
      );
    }

    // Step 1: Get resume data
    let resumeData;
    let resumeVersionUsed = null;

    if (resumeSource === "existing") {
      const publishedResume = await getPublishedResume(userId);
      if (!publishedResume) {
        return NextResponse.json(
          {
            error:
              "No published resume found. Please upload your resume first.",
          },
          { status: 404 },
        );
      }
      resumeData = publishedResume.data;
      resumeVersionUsed = publishedResume.version;
    } else {
      // Upload case
      if (!resumeFile) {
        return NextResponse.json(
          { error: "Resume file is required" },
          { status: 400 },
        );
      }

      // Validate file
      if (resumeFile.type !== "application/pdf") {
        return NextResponse.json(
          { error: "Only PDF files are allowed" },
          { status: 400 },
        );
      }

      if (resumeFile.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File size must be less than 10MB" },
          { status: 400 },
        );
      }

      // Parse uploaded resume
      const arrayBuffer = await resumeFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      resumeData = await parseResume(buffer);
    }

    // Step 2: Get job information
    let jobInfo = {
      title: jobTitleOverride || "",
      company: companyNameOverride || "",
      description: jobDescription || "",
    };

    if (jobUrl && isValidUrl(jobUrl)) {
      try {
        console.log("Attempting to scrape job URL:", jobUrl);
        const scrapedJob = await fetchJobPosting(jobUrl);
        console.log("Successfully scraped job:", {
          title: scrapedJob.title,
          company: scrapedJob.company,
          descriptionLength: scrapedJob.description.length,
        });

        jobInfo = {
          title: jobTitleOverride || scrapedJob.title,
          company: companyNameOverride || scrapedJob.company,
          description: scrapedJob.description,
        };
      } catch (error) {
        console.error("URL scraping failed:", error);

        // If we have manual job description, continue with that
        if (jobDescription && jobDescription.trim()) {
          console.log("Falling back to manual job description");
          jobInfo.description = jobDescription;
        } else {
          // No fallback available - return error with helpful message
          return NextResponse.json(
            {
              error:
                "Failed to fetch job posting from URL. The website may be blocking automated access. Please paste the job description manually instead.",
              details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 400 },
          );
        }
      }
    } else if (jobUrl && !isValidUrl(jobUrl)) {
      // Invalid URL format
      return NextResponse.json(
        {
          error:
            "Invalid URL format. Please enter a valid job posting URL or paste the job description manually.",
        },
        { status: 400 },
      );
    }

    // Extract job info from description if not provided
    if (
      (!jobInfo.title || jobInfo.title === "Not specified") &&
      jobInfo.description
    ) {
      const extracted = await extractJobInfo(jobInfo.description);
      jobInfo.title = jobTitleOverride || extracted.jobTitle;
      jobInfo.company = companyNameOverride || extracted.companyName;
    }

    // Step 3: Generate documents with AI
    const results: {
      tailoredResume?: string;
      coverLetter?: string;
    } = {};

    if (generateResume) {
      results.tailoredResume = await generateTailoredResume(
        resumeData,
        jobInfo.description,
        jobInfo.title,
        jobInfo.company,
      );
    }

    if (generateCL) {
      results.coverLetter = await generateCoverLetter(
        resumeData,
        jobInfo.description,
        jobInfo.title,
        jobInfo.company,
      );
    }

    // Step 4: Deduct tokens
    const updatedBalance = await deductTokens(userId, tokenCost);
    if (!updatedBalance) {
      return NextResponse.json(
        { error: "Failed to deduct tokens. Please try again." },
        { status: 500 },
      );
    }

    // Step 5: Return results (NOT saved to DB yet)
    return NextResponse.json({
      success: true,
      data: {
        jobTitle: jobInfo.title,
        companyName: jobInfo.company,
        jobDescription: jobInfo.description,
        jobUrl: jobUrl || undefined,
        resumeSource,
        resumeVersion: resumeVersionUsed,
        resumeSnapshot: resumeData,
        tailoredResume: results.tailoredResume,
        coverLetter: results.coverLetter,
        tokensUsed: tokenCost,
        remainingCredits: updatedBalance.token_credits,
      },
    });
  } catch (error) {
    console.error("Error generating documents:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate documents. Please try again.",
      },
      { status: 500 },
    );
  }
}
