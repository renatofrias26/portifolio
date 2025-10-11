import { NextResponse } from "next/server";
import { getPublishedResumeByUsername } from "@/lib/db/queries";

export async function GET(request: Request) {
  try {
    // Get username from query params (for public portfolio access)
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        {
          success: false,
          message: "Username parameter is required",
          data: null,
        },
        { status: 400 },
      );
    }

    const publishedResume = await getPublishedResumeByUsername(username);

    if (!publishedResume) {
      return NextResponse.json(
        {
          success: false,
          message: "No published resume found for this user",
          data: null,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: publishedResume.data,
      version: publishedResume.version,
      pdfUrl: publishedResume.pdf_url,
      updatedAt: publishedResume.updated_at,
      user: {
        name: publishedResume.name,
        username: publishedResume.username,
        profile: publishedResume.profile_data,
      },
    });
  } catch (error) {
    console.error("Error fetching published resume:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch resume data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Enable ISR (Incremental Static Regeneration) - revalidate every 60 seconds
export const revalidate = 60;
