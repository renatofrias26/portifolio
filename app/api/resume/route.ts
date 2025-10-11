import { NextResponse } from "next/server";
import { getPublishedResume } from "@/lib/db/queries";

export async function GET() {
  try {
    const publishedResume = await getPublishedResume();

    console.log("📡 /api/resume - Published resume found:", !!publishedResume);

    if (!publishedResume) {
      // Return empty data structure if no published resume exists
      console.log("⚠️ /api/resume - No published resume found");
      return NextResponse.json({
        success: false,
        message: "No published resume found",
        data: null,
      });
    }

    console.log(
      "📡 /api/resume - Skills in data:",
      publishedResume.data?.skills,
    );
    console.log(
      "📡 /api/resume - Skills type:",
      typeof publishedResume.data?.skills,
      "isArray:",
      Array.isArray(publishedResume.data?.skills),
    );

    return NextResponse.json({
      success: true,
      data: publishedResume.data,
      version: publishedResume.version,
      pdfUrl: publishedResume.pdf_url,
      updatedAt: publishedResume.updated_at,
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
