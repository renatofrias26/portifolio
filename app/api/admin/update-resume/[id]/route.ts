import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateResumeData } from "@/lib/db/queries";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const { id } = await params;
    const versionId = parseInt(id);

    if (isNaN(versionId)) {
      return NextResponse.json(
        { error: "Invalid version ID" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { data, pdfUrl } = body;

    if (!data) {
      return NextResponse.json(
        { error: "Resume data is required" },
        { status: 400 },
      );
    }

    // Update the resume data (with user verification)
    const result = await updateResumeData(versionId, userId, data, pdfUrl);

    if (!result) {
      return NextResponse.json(
        { error: "Resume not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Resume updated successfully",
    });
  } catch (error) {
    console.error("Error updating resume data:", error);
    return NextResponse.json(
      {
        error: "Failed to update resume data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
