import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteJobApplication } from "@/lib/db/queries";

export const runtime = "nodejs";

/**
 * Delete a job application
 * DELETE /api/job-assistant/delete/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const { id } = await params;
    const applicationId = parseInt(id);

    if (isNaN(applicationId)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 },
      );
    }

    // Delete application
    const deleted = await deleteJobApplication(applicationId, userId);

    if (!deleted) {
      return NextResponse.json(
        { error: "Application not found or already deleted" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job application:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete application. Please try again.",
      },
      { status: 500 },
    );
  }
}
