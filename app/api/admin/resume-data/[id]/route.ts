import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getResumeDataById } from "@/lib/db/queries";

export async function GET(
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

    // Get resume data for this version (with user verification)
    const resume = await getResumeDataById(versionId, userId);

    if (!resume) {
      return NextResponse.json(
        { error: "Resume version not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: resume.data,
      meta: {
        version: resume.version,
        isPublished: resume.is_published,
        isArchived: resume.is_archived,
        pdfUrl: resume.pdf_url,
        createdAt: resume.created_at,
        updatedAt: resume.updated_at,
      },
    });
  } catch (error) {
    console.error("Error fetching resume data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch resume data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
