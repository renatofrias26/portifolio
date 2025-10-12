import { NextRequest, NextResponse } from "next/server";
import { parseResume } from "@/lib/resume-parser";

export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds for AI processing

/**
 * Parse resume API endpoint (no authentication required)
 * Allows guests to parse their resume before registering
 */
export async function POST(request: NextRequest) {
  try {
    // Get form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 },
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 },
      );
    }

    // Parse the PDF with AI (but don't store it yet)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parsedData = await parseResume(buffer);

    return NextResponse.json({
      success: true,
      message: "Resume parsed successfully",
      data: parsedData,
    });
  } catch (error) {
    console.error("Error parsing resume:", error);
    return NextResponse.json(
      {
        error: "Failed to parse resume",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
