import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import { sendAccountDeletedEmail } from "@/lib/email";
import { rateLimiters, getClientIdentifier } from "@/lib/rate-limiter";

export const runtime = "nodejs";

/**
 * DELETE /api/auth/delete-account
 * Permanently delete user account and all associated data
 * Requires password confirmation for security
 */
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Rate limit: 3 attempts per hour per user
    const identifier = getClientIdentifier(request, session.user.id);
    const rateLimit = await rateLimiters.accountDeletion.check(identifier);

    if (!rateLimit.success) {
      const resetTime = new Date(rateLimit.reset).toLocaleTimeString();
      return NextResponse.json(
        {
          error: `Too many deletion attempts. Please try again after ${resetTime}.`,
        },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "Password is required to delete your account" },
        { status: 400 },
      );
    }

    // Fetch user to verify password
    const userResult = await sql`
      SELECT id, email, password_hash, name
      FROM users
      WHERE id = ${session.user.id}
    `;

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userResult.rows[0];

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid password. Account deletion cancelled." },
        { status: 401 },
      );
    }

    // Delete user (CASCADE will delete all resume_data automatically)
    await sql`
      DELETE FROM users
      WHERE id = ${session.user.id}
    `;

    // Send confirmation email (before we lose the email)
    try {
      await sendAccountDeletedEmail(user.email, user.name || "User");
    } catch (emailError) {
      console.error("Failed to send account deletion email:", emailError);
      // Don't fail the deletion if email fails
    }

    return NextResponse.json({
      message: "Account deleted successfully. We're sorry to see you go.",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 },
    );
  }
}
