import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put } from "@vercel/blob";
import { parseResume } from "@/lib/resume-parser";
import { saveResumeData } from "@/lib/db/queries";

export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds for AI processing

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });

    console.log("📄 PDF uploaded to Blob:", blob.url);

    // Parse the PDF with AI
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("🤖 Parsing resume with AI...");
    const parsedData = await parseResume(buffer);

    console.log("💾 Saving resume data to database...");
    // Save to database (draft mode - not published yet)
    const result = await saveResumeData(
      parsedData,
      blob.url,
      parseInt(session.user.id),
      false, // Not published yet
    );

    return NextResponse.json({
      success: true,
      message: "Resume uploaded and parsed successfully",
      data: {
        id: result.id,
        version: result.version,
        pdfUrl: blob.url,
        parsedData,
      },
    });
  } catch (error) {
    console.error("Error uploading resume:", error);
    return NextResponse.json(
      {
        error: "Failed to upload and parse resume",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
