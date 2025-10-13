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
      WHERE u.username = ${username} 
        AND u.is_active = true 
        AND u.is_public = true 
        AND r.is_published = true
      ORDER BY r.version DESC
      LIMIT 1
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching published resume by username:", error);
    return null;
  }
}

// Helper function to get published resume by username for owner (ignores is_public)
// This allows users to view their own private profiles
export async function getPublishedResumeByUsernameForOwner(username: string) {
  try {
    const result = await sql`
      SELECT r.data, r.pdf_url, r.version, r.updated_at, 
             u.id as user_id, u.name, u.username, u.profile_data, u.logo_url, u.profile_image_url, u.theme_settings
      FROM resume_data r
      JOIN users u ON r.user_id = u.id
      WHERE u.username = ${username} 
        AND u.is_active = true 
        AND r.is_published = true
      ORDER BY r.version DESC
      LIMIT 1
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error(
      "Error fetching published resume by username for owner:",
      error,
    );
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
          SELECT id, version, is_published, is_archived, created_at, updated_at, pdf_url
          FROM resume_data
          WHERE user_id = ${userId}
          ORDER BY version DESC
        `
      : await sql`
          SELECT id, version, is_published, is_archived, created_at, updated_at, pdf_url
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
  data: Record<string, unknown>,
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
  data: Record<string, unknown>,
  pdfUrl?: string,
) {
  try {
    const updateFields: string[] = [
      "data = $1",
      "updated_at = CURRENT_TIMESTAMP",
    ];
    const params: Array<string | number> = [JSON.stringify(data)];

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
      SELECT id, email, name, username, profile_data, logo_url, profile_image_url, theme_settings, is_active, is_public, created_at
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
      SELECT id, email, name, username, profile_data, logo_url, profile_image_url, theme_settings, is_active, is_public, created_at
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
    profile_data?: Record<string, unknown>;
    logo_url?: string | null;
    profile_image_url?: string | null;
    theme_settings?: Record<string, unknown>;
    is_public?: boolean;
  },
) {
  try {
    const updateFields: string[] = ["updated_at = CURRENT_TIMESTAMP"];
    const params: Array<
      string | number | Record<string, unknown> | null | boolean
    > = [];

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

    if (updates.is_public !== undefined) {
      params.push(updates.is_public);
      updateFields.push(`is_public = $${params.length}`);
    }

    params.push(userId);

    const query = `
      UPDATE users
      SET ${updateFields.join(", ")}
      WHERE id = $${params.length}
      RETURNING id, email, name, username, profile_data, logo_url, profile_image_url, theme_settings, is_public, is_active
    `;

    const result = await sql.query(query, params);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

// ============================================================================
// JOB APPLICATION ASSISTANT QUERIES
// ============================================================================

/**
 * Save a new job application
 */
export async function saveJobApplication(data: {
  userId: number;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  jobUrl?: string;
  resumeSource: "existing" | "upload";
  resumeVersion?: number;
  resumeSnapshot: Record<string, unknown>;
  tailoredResume?: string;
  coverLetter?: string;
  tailoredResumeEdited?: string;
  coverLetterEdited?: string;
  isSaved: boolean;
}) {
  try {
    const result = await sql`
      INSERT INTO job_applications (
        user_id, job_title, company_name, job_description, job_url,
        resume_source, resume_version, resume_snapshot,
        tailored_resume, cover_letter,
        tailored_resume_edited, cover_letter_edited,
        is_saved
      ) VALUES (
        ${data.userId}, ${data.jobTitle}, ${data.companyName}, 
        ${data.jobDescription}, ${data.jobUrl || null},
        ${data.resumeSource}, ${data.resumeVersion || null}, 
        ${JSON.stringify(data.resumeSnapshot)},
        ${data.tailoredResume || null}, ${data.coverLetter || null},
        ${data.tailoredResumeEdited || null}, ${data.coverLetterEdited || null},
        ${data.isSaved}
      )
      RETURNING id, created_at
    `;
    return result.rows[0];
  } catch (error) {
    console.error("Error saving job application:", error);
    throw error;
  }
}

/**
 * Get all saved job applications for a user
 */
export async function getJobApplicationHistory(
  userId: number,
  limit: number = 10,
  offset: number = 0,
) {
  try {
    const result = await sql`
      SELECT 
        id, 
        job_title as "jobTitle", 
        company_name as "companyName", 
        job_url as "jobUrl", 
        created_at as "createdAt",
        CASE WHEN tailored_resume_edited IS NOT NULL THEN true
             WHEN tailored_resume IS NOT NULL THEN true
             ELSE false END as "hasResume",
        CASE WHEN cover_letter_edited IS NOT NULL THEN true
             WHEN cover_letter IS NOT NULL THEN true
             ELSE false END as "hasCoverLetter"
      FROM job_applications
      WHERE user_id = ${userId} AND is_saved = true
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM job_applications
      WHERE user_id = ${userId} AND is_saved = true
    `;

    return {
      applications: result.rows,
      total: parseInt(countResult.rows[0].total),
    };
  } catch (error) {
    console.error("Error fetching job application history:", error);
    return { applications: [], total: 0 };
  }
}

/**
 * Get a specific job application by ID
 */
export async function getJobApplicationById(
  applicationId: number,
  userId: number,
) {
  try {
    const result = await sql`
      SELECT 
        id, job_title, company_name, job_description, job_url,
        resume_source, resume_version, resume_snapshot,
        COALESCE(tailored_resume_edited, tailored_resume) as tailored_resume,
        COALESCE(cover_letter_edited, cover_letter) as cover_letter,
        created_at, updated_at
      FROM job_applications
      WHERE id = ${applicationId} AND user_id = ${userId}
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching job application:", error);
    return null;
  }
}

/**
 * Update a job application (for edits)
 */
export async function updateJobApplication(
  applicationId: number,
  userId: number,
  updates: {
    tailoredResumeEdited?: string;
    coverLetterEdited?: string;
  },
) {
  try {
    const result = await sql`
      UPDATE job_applications
      SET 
        tailored_resume_edited = ${updates.tailoredResumeEdited || null},
        cover_letter_edited = ${updates.coverLetterEdited || null},
        updated_at = NOW()
      WHERE id = ${applicationId} AND user_id = ${userId}
      RETURNING id
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error updating job application:", error);
    throw error;
  }
}

/**
 * Delete a job application
 */
export async function deleteJobApplication(
  applicationId: number,
  userId: number,
) {
  try {
    const result = await sql`
      DELETE FROM job_applications
      WHERE id = ${applicationId} AND user_id = ${userId}
      RETURNING id
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error deleting job application:", error);
    throw error;
  }
}

/**
 * Get user's token balance
 */
export async function getUserTokenBalance(userId: number) {
  try {
    const result = await sql`
      SELECT token_credits, tokens_used
      FROM users
      WHERE id = ${userId}
    `;
    return result.rows[0] || { token_credits: 0, tokens_used: 0 };
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return { token_credits: 0, tokens_used: 0 };
  }
}

/**
 * Deduct tokens from user's balance
 */
export async function deductTokens(userId: number, amount: number) {
  try {
    const result = await sql`
      UPDATE users
      SET 
        token_credits = token_credits - ${amount},
        tokens_used = tokens_used + ${amount}
      WHERE id = ${userId} AND token_credits >= ${amount}
      RETURNING token_credits, tokens_used
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error deducting tokens:", error);
    throw error;
  }
}
