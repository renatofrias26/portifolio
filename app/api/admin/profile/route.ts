import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById, updateUserProfile } from "@/lib/db/queries";

// GET - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        profileData: user.profile_data,
        logoUrl: user.logo_url,
        profileImageUrl: user.profile_image_url,
        themeSettings: user.theme_settings,
        isActive: user.is_active,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch user profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();

    const { name, username, profileData } = body;

    // Validate username format if provided
    if (username) {
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
    }

    const updates: {
      name?: string;
      username?: string;
      profile_data?: any;
    } = {};

    if (name !== undefined) updates.name = name;
    if (username !== undefined) updates.username = username;
    if (profileData !== undefined) updates.profile_data = profileData;

    const updatedUser = await updateUserProfile(userId, updates);

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        username: updatedUser.username,
        profileData: updatedUser.profile_data,
        logoUrl: updatedUser.logo_url,
        profileImageUrl: updatedUser.profile_image_url,
        themeSettings: updatedUser.theme_settings,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);

    // Check for unique constraint violation on username
    if (error instanceof Error && error.message.includes("unique")) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to update user profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
