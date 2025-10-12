import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Check if user exists
    const userResult = await sql`
      SELECT id, email, username, name
      FROM users
      WHERE email = ${email} AND is_active = true
    `;

    // Always return success to prevent email enumeration attacks
    // (Don't reveal if email exists or not)
    if (userResult.rows.length === 0) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return NextResponse.json({
        success: true,
        message:
          "If an account exists with this email, you will receive a password reset link.",
      });
    }

    const user = userResult.rows[0];

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Set expiration to 1 hour from now
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token in database
    await sql`
      UPDATE users
      SET reset_token = ${resetToken},
          reset_token_expires = ${expiresAt.toISOString()}
      WHERE id = ${user.id}
    `;

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(
      user.email,
      resetToken,
      user.username || user.name || "User",
    );

    if (!emailResult.success) {
      console.error("Failed to send password reset email:", emailResult.error);
      // In production, you might want to log this to a monitoring service
      // but still return success to the user to prevent info disclosure
    }

    console.log(`Password reset email sent to: ${email}`);

    return NextResponse.json({
      success: true,
      message:
        "If an account exists with this email, you will receive a password reset link.",
    });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    return NextResponse.json(
      {
        error: "An error occurred. Please try again later.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
