import { NextRequest, NextResponse } from "next/server";
import { enhanceProfile } from "@/lib/profile-enhancer";

export const runtime = "nodejs";
export const maxDuration = 30; // 30 seconds for AI processing

/**
 * Enhance profile API endpoint (no authentication required)
 * Takes parsed resume data and generates professional title, taglines, etc.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeData } = body;

    if (!resumeData) {
      return NextResponse.json(
        { error: "Resume data is required" },
        { status: 400 },
      );
    }

    // Validate resume data has minimum required fields
    if (!resumeData.personal) {
      return NextResponse.json(
        { error: "Invalid resume data: missing personal information" },
        { status: 400 },
      );
    }

    // Generate profile enhancements
    const enhancements = await enhanceProfile(resumeData);

    return NextResponse.json({
      success: true,
      data: enhancements,
    });
  } catch (error) {
    console.error("Error enhancing profile:", error);
    return NextResponse.json(
      {
        error: "Failed to enhance profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
