import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@vercel/postgres";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const versionId = parseInt(params.id);

    if (isNaN(versionId)) {
      return NextResponse.json(
        { error: "Invalid version ID" },
        { status: 400 },
      );
    }

    // Get resume data for this version
    const result = await sql`
      SELECT data, pdf_url, version, is_published, created_at, updated_at
      FROM resume_data
      WHERE id = ${versionId}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Resume version not found" },
        { status: 404 },
      );
    }

    const resume = result.rows[0];

    return NextResponse.json({
      success: true,
      data: resume.data,
      meta: {
        version: resume.version,
        isPublished: resume.is_published,
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
