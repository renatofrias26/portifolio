import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getJobApplicationById } from "@/lib/db/queries";

export const runtime = "nodejs";

/**
 * Get a specific job application by ID
 * GET /api/job-assistant/history/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const { id } = await params;
    const applicationId = parseInt(id);

    if (isNaN(applicationId)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 },
      );
    }

    // Fetch application
    const application = await getJobApplicationById(applicationId, userId);

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Error fetching job application:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch application. Please try again.",
      },
      { status: 500 },
    );
  }
}
