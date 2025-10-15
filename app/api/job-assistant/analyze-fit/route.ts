import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { parseResume } from "@/lib/resume-parser";
import {
  analyzeJobFit,
  extractJobInfo,
  calculateTokenCost,
} from "@/lib/job-assistant";
import { fetchJobPosting, isValidUrl } from "@/lib/job-scraper";
import {
  getPublishedResume,
  getUserTokenBalance,
  deductTokens,
} from "@/lib/db/queries";

export const runtime = "nodejs";
export const maxDuration = 30; // Analysis is faster than full generation

/**
 * Analyze job fit for a candidate
 * POST /api/job-assistant/analyze-fit
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
    const jobUrl = formData.get("jobUrl") as string | null;
    const jobDescription = formData.get("jobDescription") as string | null;
    const jobTitleOverride = formData.get("jobTitle") as string | null;
    const companyNameOverride = formData.get("companyName") as string | null;

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

    // Check token balance
    const tokenBalance = await getUserTokenBalance(userId);
    const tokenCost = calculateTokenCost(false, false, true); // Only fit analysis

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

    let scrapingFailed = false;
    let scrapingErrorMessage = "";

    if (jobUrl && isValidUrl(jobUrl)) {
      try {
        console.log("Attempting to scrape job URL:", jobUrl);
        const scrapedJob = await fetchJobPosting(jobUrl);
        console.log("Successfully scraped job:", {
          title: scrapedJob.title,
          company: scrapedJob.company,
        });

        // Merge scraped data with overrides (manual input takes precedence)
        jobInfo = {
          title: jobTitleOverride || scrapedJob.title,
          company: companyNameOverride || scrapedJob.company,
          description: scrapedJob.description || jobDescription || "",
        };
      } catch (scrapeError) {
        // Log for debugging but don't fail - we can work with manual input
        scrapingFailed = true;
        if (scrapeError instanceof Error) {
          scrapingErrorMessage = scrapeError.message;
          console.log(
            "Note: Could not auto-fetch job posting:",
            scrapeError.message,
          );
        }
        // Keep the manual data that was already set in jobInfo
        // No need to reassign - jobInfo already has jobDescription from initialization
      }
    }

    // If still missing job info, try to extract from description
    if (
      (!jobInfo.title || !jobInfo.company) &&
      (jobInfo.description || jobDescription)
    ) {
      try {
        const extracted = await extractJobInfo(
          jobInfo.description || jobDescription || "",
        );
        if (!jobInfo.title) jobInfo.title = extracted.jobTitle;
        if (!jobInfo.company) jobInfo.company = extracted.companyName;
      } catch (extractError) {
        console.error("Job info extraction failed:", extractError);
        // Use fallbacks
        if (!jobInfo.title) jobInfo.title = "Position";
        if (!jobInfo.company) jobInfo.company = "Company";
      }
    }

    // Step 3: Analyze job fit
    console.log("Analyzing job fit...");
    const analysis = await analyzeJobFit(
      resumeData,
      jobInfo.description,
      jobInfo.title,
      jobInfo.company,
    );

    // Step 4: Deduct tokens
    await deductTokens(userId, tokenCost);

    // Step 5: Return analysis
    return NextResponse.json({
      success: true,
      analysis,
      jobInfo: {
        title: jobInfo.title,
        company: jobInfo.company,
      },
      tokensUsed: tokenCost,
      remainingCredits: tokenBalance.token_credits - tokenCost,
      ...(scrapingFailed && {
        warning:
          scrapingErrorMessage ||
          "Could not auto-fetch job posting from URL. Please ensure the job description is pasted below.",
        scrapingFailed: true,
      }),
    });
  } catch (error) {
    console.error("Job fit analysis error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to analyze job fit. Please try again.",
      },
      { status: 500 },
    );
  }
}
