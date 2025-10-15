import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@vercel/postgres";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";
import { rateLimiters, getClientIdentifier } from "@/lib/rate-limiter";
import { logger, EventType } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 registrations per hour per IP
    const identifier = getClientIdentifier(request);
    const rateLimit = await rateLimiters.registration.check(identifier);

    if (!rateLimit.success) {
      const resetTime = new Date(rateLimit.reset).toLocaleTimeString();
      return NextResponse.json(
        {
          error: `Too many registration attempts. Please try again after ${resetTime}.`,
        },
        { status: 429 },
      );
    }

    const { email, password, name, username, isPublic, profileEnhancements } =
      await request.json();

    // Validate required fields
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Email, password, and username are required" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate username format
    const usernameRegex = /^[a-z0-9_-]{3,30}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        {
          error:
            "Username must be 3-30 characters and contain only lowercase letters, numbers, hyphens, and underscores",
        },
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

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email} OR username = ${username}
    `;

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 409 },
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Prepare profile data if enhancements are provided
    const profileData = profileEnhancements
      ? JSON.stringify({
          tagline: profileEnhancements.selectedTagline,
          title: profileEnhancements.professionalTitle, // Changed from professionalTitle to title
          currentFocus: profileEnhancements.currentFocus,
          bio: profileEnhancements.bio,
        })
      : null;

    console.log("Registering user with profile enhancements:", {
      hasEnhancements: !!profileEnhancements,
      profileData: profileData,
      isPublic: isPublic ?? true, // Default to true if not provided
    });

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user (email_verified defaults to false)
    const result = await sql`
      INSERT INTO users (
        email, 
        password_hash, 
        name, 
        username, 
        profile_data, 
        is_public,
        email_verified,
        verification_token,
        verification_token_expires
      )
      VALUES (
        ${email}, 
        ${passwordHash}, 
        ${name || null}, 
        ${username}, 
        ${profileData}, 
        ${isPublic ?? true},
        false,
        ${verificationToken},
        ${verificationExpires.toISOString()}
      )
      RETURNING id, email, name, username, created_at
    `;

    const newUser = result.rows[0];

    // Log successful user signup
    logger.event(EventType.USER_SIGNUP, {
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
      metadata: {
        hasProfileEnhancements: !!profileEnhancements,
        isPublic: isPublic ?? true,
        timestamp: new Date().toISOString(),
      },
    });

    // Send verification email
    const emailResult = await sendVerificationEmail(
      email,
      verificationToken,
      username,
    );

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
      // Don't fail registration if email fails, user can resend later
    } else {
      console.log(`Verification email sent to: ${email}`);
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "User registered successfully. Please check your email to verify your account.",
        emailSent: emailResult.success,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          username: newUser.username,
          createdAt: newUser.created_at,
          emailVerified: false,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error registering user:", error);

    // Log registration error to Sentry
    logger.error("User registration failed", {
      error,
      metadata: {
        email: (await request.json()).email,
      },
    });

    return NextResponse.json(
      {
        error: "Failed to register user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
