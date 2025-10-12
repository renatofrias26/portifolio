import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put } from "@vercel/blob";
import { saveResumeData } from "@/lib/db/queries";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Upload pre-parsed resume data from guest session
 * This is called after a user registers to save their previously parsed resume
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { parsedData, fileContent, fileName } = body;

    if (!parsedData || !fileContent || !fileName) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 },
      );
    }

    // Convert base64 back to file
    const base64Data = fileContent.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");
    const file = new File([buffer], fileName, { type: "application/pdf" });

    // Upload to Vercel Blob
    const blob = await put(fileName, file, {
      access: "public",
      addRandomSuffix: true,
    });

    // Save to database (draft mode - not published yet)
    const result = await saveResumeData(
      parsedData,
      blob.url,
      parseInt(session.user.id),
      false, // Not published yet
    );

    return NextResponse.json({
      success: true,
      message: "Resume uploaded successfully",
      data: {
        id: result.id,
        version: result.version,
        pdfUrl: blob.url,
      },
    });
  } catch (error) {
    console.error("Error uploading guest resume:", error);
    return NextResponse.json(
      {
        error: "Failed to upload resume",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
