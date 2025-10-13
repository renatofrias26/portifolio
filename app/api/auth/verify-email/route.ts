import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { sendEmailVerifiedConfirmation } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    // Validate token
    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 },
      );
    }

    // Find user with valid verification token
    const userResult = await sql`
      SELECT id, email, username, name, email_verified, verification_token_expires
      FROM users
      WHERE verification_token = ${token} 
        AND verification_token_expires > NOW()
        AND is_active = true
    `;

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 },
      );
    }

    const user = userResult.rows[0];

    // Check if already verified
    if (user.email_verified) {
      return NextResponse.json({
        success: true,
        message: "Email is already verified",
        alreadyVerified: true,
      });
    }

    // Verify email and clear token
    await sql`
      UPDATE users
      SET email_verified = true,
          verification_token = NULL,
          verification_token_expires = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${user.id}
    `;

    // Send confirmation email
    await sendEmailVerifiedConfirmation(
      user.email,
      user.username || user.name || "User",
    );

    console.log(`Email verified for user: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now access all features.",
    });
  } catch (error) {
    console.error("Error in verify-email:", error);
    return NextResponse.json(
      {
        error: "Failed to verify email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
