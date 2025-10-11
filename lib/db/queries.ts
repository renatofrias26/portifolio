import { sql } from "@vercel/postgres";

export { sql };

// Helper function to get published resume data by user ID
export async function getPublishedResume(userId: number) {
  try {
    const result = await sql`
      SELECT data, pdf_url, version, updated_at
      FROM resume_data
      WHERE user_id = ${userId} AND is_published = true
      ORDER BY version DESC
      LIMIT 1
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching published resume:", error);
    return null;
  }
}

// Helper function to get published resume data by username (for public portfolios)
export async function getPublishedResumeByUsername(username: string) {
  try {
    const result = await sql`
      SELECT r.data, r.pdf_url, r.version, r.updated_at, 
             u.name, u.username, u.profile_data, u.logo_url, u.profile_image_url, u.theme_settings
      FROM resume_data r
      JOIN users u ON r.user_id = u.id
      WHERE u.username = ${username} AND u.is_active = true AND r.is_published = true
      ORDER BY r.version DESC
      LIMIT 1
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching published resume by username:", error);
    return null;
  }
}

// Helper function to get all resume versions for a specific user
export async function getAllResumeVersions(
  userId: number,
  includeArchived: boolean = false,
) {
  try {
    const result = includeArchived
      ? await sql`
          SELECT id, version, is_published, is_archived, created_at, updated_at
          FROM resume_data
          WHERE user_id = ${userId}
          ORDER BY version DESC
        `
      : await sql`
          SELECT id, version, is_published, is_archived, created_at, updated_at
          FROM resume_data
          WHERE user_id = ${userId} AND is_archived = false
          ORDER BY version DESC
        `;
    return result.rows;
  } catch (error) {
    console.error("Error fetching resume versions:", error);
    return [];
  }
}

// Helper function to save resume data for a specific user
export async function saveResumeData(
  data: any,
  pdfUrl: string,
  userId: number,
  isPublished: boolean = false,
) {
  try {
    // Get the latest version number for this user
    const versionResult = await sql`
      SELECT COALESCE(MAX(version), 0) + 1 as next_version
      FROM resume_data
      WHERE user_id = ${userId}
    `;
    const nextVersion = versionResult.rows[0].next_version;

    // If publishing, unpublish all other versions for this user
    if (isPublished) {
      await sql`
        UPDATE resume_data
        SET is_published = false
        WHERE user_id = ${userId} AND is_published = true
      `;
    }

    // Insert new resume data
    const result = await sql`
      INSERT INTO resume_data (user_id, version, data, pdf_url, is_published)
      VALUES (${userId}, ${nextVersion}, ${JSON.stringify(
      data,
    )}, ${pdfUrl}, ${isPublished})
      RETURNING id, version
    `;

    return result.rows[0];
  } catch (error) {
    console.error("Error saving resume data:", error);
    throw error;
  }
}

// Helper function to publish a specific version for a user
export async function publishResumeVersion(versionId: number, userId: number) {
  try {
    // Unpublish all versions for this user
    await sql`
      UPDATE resume_data
      SET is_published = false
      WHERE user_id = ${userId} AND is_published = true
    `;

    // Publish the selected version (with user verification)
    await sql`
      UPDATE resume_data
      SET is_published = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${versionId} AND user_id = ${userId}
    `;

    return true;
  } catch (error) {
    console.error("Error publishing resume version:", error);
    throw error;
  }
}

// Helper function to archive a specific version for a user
export async function archiveResumeVersion(versionId: number, userId: number) {
  try {
    // Check if version is published and belongs to user
    const versionCheck = await sql`
      SELECT is_published FROM resume_data 
      WHERE id = ${versionId} AND user_id = ${userId}
    `;

    if (!versionCheck.rows[0]) {
      throw new Error("Version not found or unauthorized");
    }

    if (versionCheck.rows[0]?.is_published) {
      throw new Error("Cannot archive a published version");
    }

    // Archive the version
    await sql`
      UPDATE resume_data
      SET is_archived = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${versionId} AND user_id = ${userId}
    `;

    return true;
  } catch (error) {
    console.error("Error archiving resume version:", error);
    throw error;
  }
}

// Helper function to unarchive a specific version for a user
export async function unarchiveResumeVersion(
  versionId: number,
  userId: number,
) {
  try {
    await sql`
      UPDATE resume_data
      SET is_archived = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${versionId} AND user_id = ${userId}
    `;

    return true;
  } catch (error) {
    console.error("Error unarchiving resume version:", error);
    throw error;
  }
}

// Helper function to get resume data by ID (with user verification)
export async function getResumeDataById(versionId: number, userId: number) {
  try {
    const result = await sql`
      SELECT id, version, data, pdf_url, is_published, is_archived, created_at, updated_at
      FROM resume_data
      WHERE id = ${versionId} AND user_id = ${userId}
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching resume data by ID:", error);
    return null;
  }
}

// Helper function to update resume data
export async function updateResumeData(
  versionId: number,
  userId: number,
  data: any,
  pdfUrl?: string,
) {
  try {
    const updateFields: string[] = [
      "data = $1",
      "updated_at = CURRENT_TIMESTAMP",
    ];
    const params: any[] = [JSON.stringify(data)];

    if (pdfUrl) {
      updateFields.push(`pdf_url = $${params.length + 1}`);
      params.push(pdfUrl);
    }

    params.push(versionId);
    params.push(userId);

    const query = `
      UPDATE resume_data
      SET ${updateFields.join(", ")}
      WHERE id = $${params.length - 1} AND user_id = $${params.length}
      RETURNING id, version
    `;

    const result = await sql.query(query, params);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error updating resume data:", error);
    throw error;
  }
}

// User management functions

// Get user by ID
export async function getUserById(userId: number) {
  try {
    const result = await sql`
      SELECT id, email, name, username, profile_data, logo_url, profile_image_url, theme_settings, is_active, created_at
      FROM users
      WHERE id = ${userId}
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
}

// Get user by username
export async function getUserByUsername(username: string) {
  try {
    const result = await sql`
      SELECT id, email, name, username, profile_data, logo_url, profile_image_url, theme_settings, is_active, created_at
      FROM users
      WHERE username = ${username} AND is_active = true
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return null;
  }
}

// Update user profile
export async function updateUserProfile(
  userId: number,
  updates: {
    name?: string;
    username?: string;
    profile_data?: any;
    logo_url?: string | null;
    profile_image_url?: string | null;
    theme_settings?: any;
  },
) {
  try {
    const updateFields: string[] = ["updated_at = CURRENT_TIMESTAMP"];
    const params: any[] = [];

    if (updates.name !== undefined) {
      params.push(updates.name);
      updateFields.push(`name = $${params.length}`);
    }

    if (updates.username !== undefined) {
      params.push(updates.username);
      updateFields.push(`username = $${params.length}`);
    }

    if (updates.profile_data !== undefined) {
      params.push(JSON.stringify(updates.profile_data));
      updateFields.push(`profile_data = $${params.length}`);
    }

    if (updates.logo_url !== undefined) {
      params.push(updates.logo_url);
      updateFields.push(`logo_url = $${params.length}`);
    }

    if (updates.profile_image_url !== undefined) {
      params.push(updates.profile_image_url);
      updateFields.push(`profile_image_url = $${params.length}`);
    }

    if (updates.theme_settings !== undefined) {
      params.push(JSON.stringify(updates.theme_settings));
      updateFields.push(`theme_settings = $${params.length}`);
    }

    params.push(userId);

    const query = `
      UPDATE users
      SET ${updateFields.join(", ")}
      WHERE id = $${params.length}
      RETURNING id, email, name, username, profile_data, logo_url, profile_image_url, theme_settings
    `;

    const result = await sql.query(query, params);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}
