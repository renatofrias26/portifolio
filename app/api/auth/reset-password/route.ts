import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import { sendPasswordChangedEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    // Validate inputs
    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 },
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    // Find user with valid reset token
    const userResult = await sql`
      SELECT id, email, username, name, reset_token_expires
      FROM users
      WHERE reset_token = ${token} 
        AND reset_token_expires > NOW()
        AND is_active = true
    `;

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 },
      );
    }

    const user = userResult.rows[0];

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await sql`
      UPDATE users
      SET password_hash = ${passwordHash},
          reset_token = NULL,
          reset_token_expires = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${user.id}
    `;

    // Send confirmation email
    await sendPasswordChangedEmail(
      user.email,
      user.username || user.name || "User",
    );

    console.log(`Password reset successful for user: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Error in reset-password:", error);
    return NextResponse.json(
      {
        error: "Failed to reset password",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
