import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import { sendPasswordChangedEmail } from "@/lib/email";
import { rateLimiters, getClientIdentifier } from "@/lib/rate-limiter";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 5 attempts per hour per user
    const identifier = getClientIdentifier(request, session.user.id);
    const rateLimit = await rateLimiters.passwordChange.check(identifier);

    if (!rateLimit.success) {
      const resetTime = new Date(rateLimit.reset).toLocaleTimeString();
      return NextResponse.json(
        {
          error: `Too many password change attempts. Please try again after ${resetTime}.`,
        },
        { status: 429 },
      );
    }

    const { currentPassword, newPassword } = await request.json();

    // Validate inputs
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 },
      );
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    // Check if new password is different from current
    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: "New password must be different from current password" },
        { status: 400 },
      );
    }

    const userId = parseInt(session.user.id);

    // Get current password hash
    const userResult = await sql`
      SELECT id, email, username, name, password_hash
      FROM users
      WHERE id = ${userId}
    `;

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userResult.rows[0];

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password_hash,
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 },
      );
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await sql`
      UPDATE users
      SET password_hash = ${newPasswordHash},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `;

    // Send confirmation email
    await sendPasswordChangedEmail(
      user.email,
      user.username || user.name || "User",
    );

    console.log(`Password changed successfully for user: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error in change-password:", error);
    return NextResponse.json(
      {
        error: "Failed to change password",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
