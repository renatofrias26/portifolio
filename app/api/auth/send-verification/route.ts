import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";
import { rateLimiters, getClientIdentifier } from "@/lib/rate-limiter";

/**
 * Send or resend email verification link
 * Can be called by authenticated users to resend verification
 */
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // Rate limit: 1 request per 30 seconds per user
    const identifier = getClientIdentifier(request, userId.toString());
    const rateLimit = await rateLimiters.emailVerificationSend.check(
      identifier,
    );

    if (!rateLimit.success) {
      const resetTime = new Date(rateLimit.reset).toLocaleTimeString();
      return NextResponse.json(
        {
          error: `Please wait before requesting another verification email. Try again after ${resetTime}.`,
        },
        { status: 429 },
      );
    }

    // Get user details
    const userResult = await sql`
      SELECT id, email, username, name, email_verified
      FROM users
      WHERE id = ${userId} AND is_active = true
    `;

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userResult.rows[0];

    // Check if already verified
    if (user.email_verified) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is already verified",
        },
        { status: 400 },
      );
    }

    // Generate secure verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Set expiration to 24 hours from now
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store verification token in database
    await sql`
      UPDATE users
      SET verification_token = ${verificationToken},
          verification_token_expires = ${expiresAt.toISOString()}
      WHERE id = ${user.id}
    `;

    // Send verification email
    const emailResult = await sendVerificationEmail(
      user.email,
      verificationToken,
      user.username || user.name || "User",
    );

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
      return NextResponse.json(
        {
          error: "Failed to send verification email. Please try again later.",
          details: emailResult.error,
        },
        { status: 500 },
      );
    }

    console.log(`Verification email sent to: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (error) {
    console.error("Error in send-verification:", error);
    return NextResponse.json(
      {
        error: "An error occurred. Please try again later.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
