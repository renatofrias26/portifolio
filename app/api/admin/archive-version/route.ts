import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { archiveResumeVersion, unarchiveResumeVersion } from "@/lib/db/queries";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { versionId, action } = await request.json();

    if (!versionId) {
      return NextResponse.json(
        { error: "Version ID is required" },
        { status: 400 },
      );
    }

    if (action === "archive") {
      await archiveResumeVersion(versionId);
      return NextResponse.json({
        success: true,
        message: "Version archived successfully",
      });
    } else if (action === "unarchive") {
      await unarchiveResumeVersion(versionId);
      return NextResponse.json({
        success: true,
        message: "Version unarchived successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'archive' or 'unarchive'" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error archiving/unarchiving version:", error);
    return NextResponse.json(
      {
        error: "Failed to archive/unarchive version",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
