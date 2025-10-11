import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllResumeVersions } from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameter for including archived versions
    const { searchParams } = new URL(request.url);
    const includeArchived = searchParams.get("includeArchived") === "true";

    // Get all resume versions
    const versions = await getAllResumeVersions(includeArchived);

    return NextResponse.json({
      success: true,
      versions,
    });
  } catch (error) {
    console.error("Error fetching resume versions:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch resume versions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
