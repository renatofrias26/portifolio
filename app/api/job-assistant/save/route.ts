import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { saveJobApplication } from "@/lib/db/queries";

export const runtime = "nodejs";

/**
 * Save a job application to history
 * POST /api/job-assistant/save
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();

    // Validation
    const {
      jobTitle,
      companyName,
      jobDescription,
      jobUrl,
      resumeSource,
      resumeVersion,
      resumeSnapshot,
      tailoredResume,
      coverLetter,
      tailoredResumeEdited,
      coverLetterEdited,
    } = body;

    if (!jobTitle || !companyName || !jobDescription) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: jobTitle, companyName, jobDescription",
        },
        { status: 400 },
      );
    }

    if (!resumeSource || !resumeSnapshot) {
      return NextResponse.json(
        { error: "Missing resume information" },
        { status: 400 },
      );
    }

    if (
      !tailoredResume &&
      !coverLetter &&
      !tailoredResumeEdited &&
      !coverLetterEdited
    ) {
      return NextResponse.json(
        { error: "Nothing to save. Generate at least one document." },
        { status: 400 },
      );
    }

    // Save to database
    const result = await saveJobApplication({
      userId,
      jobTitle,
      companyName,
      jobDescription,
      jobUrl: jobUrl || undefined,
      resumeSource,
      resumeVersion: resumeVersion || undefined,
      resumeSnapshot,
      tailoredResume: tailoredResume || undefined,
      coverLetter: coverLetter || undefined,
      tailoredResumeEdited: tailoredResumeEdited || undefined,
      coverLetterEdited: coverLetterEdited || undefined,
      isSaved: true,
    });

    return NextResponse.json({
      success: true,
      applicationId: result.id,
      createdAt: result.created_at,
    });
  } catch (error) {
    console.error("Error saving job application:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save application. Please try again.",
      },
      { status: 500 },
    );
  }
}
