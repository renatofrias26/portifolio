import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@vercel/postgres";

export async function PUT(
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

    const body = await request.json();
    const { data } = body;

    if (!data) {
      return NextResponse.json(
        { error: "Resume data is required" },
        { status: 400 },
      );
    }

    // Update the resume data
    await sql`
      UPDATE resume_data
      SET 
        data = ${JSON.stringify(data)},
        updated_at = NOW()
      WHERE id = ${versionId}
    `;

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
