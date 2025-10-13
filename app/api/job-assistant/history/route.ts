import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getJobApplicationHistory } from "@/lib/db/queries";

export const runtime = "nodejs";

/**
 * Get user's saved job applications
 * GET /api/job-assistant/history?limit=10&offset=0
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // Parse query params
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Validate params
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Limit must be between 1 and 100" },
        { status: 400 },
      );
    }

    if (offset < 0) {
      return NextResponse.json(
        { error: "Offset must be non-negative" },
        { status: 400 },
      );
    }

    // Fetch history
    const result = await getJobApplicationHistory(userId, limit, offset);

    return NextResponse.json({
      success: true,
      applications: result.applications,
      total: result.total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching job application history:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch history. Please try again.",
      },
      { status: 500 },
    );
  }
}
