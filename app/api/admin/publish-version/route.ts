import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { publishResumeVersion } from "@/lib/db/queries";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // Get version ID from request
    const { versionId } = await request.json();

    if (!versionId) {
      return NextResponse.json(
        { error: "Version ID is required" },
        { status: 400 },
      );
    }

    // Publish the version (with user verification)
    await publishResumeVersion(versionId, userId);

    return NextResponse.json({
      success: true,
      message: "Resume version published successfully",
    });
  } catch (error) {
    console.error("Error publishing resume version:", error);
    return NextResponse.json(
      {
        error: "Failed to publish resume version",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
