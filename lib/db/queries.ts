import { sql } from "@vercel/postgres";

export { sql };

// Helper function to get published resume data
export async function getPublishedResume() {
  try {
    const result = await sql`
      SELECT data, pdf_url, version, updated_at
      FROM resume_data
      WHERE is_published = true
      ORDER BY version DESC
      LIMIT 1
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching published resume:", error);
    return null;
  }
}

// Helper function to get all resume versions
export async function getAllResumeVersions(includeArchived: boolean = false) {
  try {
    const result = includeArchived
      ? await sql`
          SELECT id, version, is_published, is_archived, created_at, updated_at
          FROM resume_data
          ORDER BY version DESC
        `
      : await sql`
          SELECT id, version, is_published, is_archived, created_at, updated_at
          FROM resume_data
          WHERE is_archived = false
          ORDER BY version DESC
        `;
    return result.rows;
  } catch (error) {
    console.error("Error fetching resume versions:", error);
    return [];
  }
}

// Helper function to save resume data
export async function saveResumeData(
  data: any,
  pdfUrl: string,
  userId: number,
  isPublished: boolean = false,
) {
  try {
    // Get the latest version number
    const versionResult = await sql`
      SELECT COALESCE(MAX(version), 0) + 1 as next_version
      FROM resume_data
    `;
    const nextVersion = versionResult.rows[0].next_version;

    // If publishing, unpublish all other versions
    if (isPublished) {
      await sql`
        UPDATE resume_data
        SET is_published = false
        WHERE is_published = true
      `;
    }

    // Insert new resume data
    const result = await sql`
      INSERT INTO resume_data (version, data, pdf_url, is_published, created_by)
      VALUES (${nextVersion}, ${JSON.stringify(
      data,
    )}, ${pdfUrl}, ${isPublished}, ${userId})
      RETURNING id, version
    `;

    return result.rows[0];
  } catch (error) {
    console.error("Error saving resume data:", error);
    throw error;
  }
}

// Helper function to publish a specific version
export async function publishResumeVersion(versionId: number) {
  try {
    // Unpublish all versions
    await sql`
      UPDATE resume_data
      SET is_published = false
      WHERE is_published = true
    `;

    // Publish the selected version
    await sql`
      UPDATE resume_data
      SET is_published = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${versionId}
    `;

    return true;
  } catch (error) {
    console.error("Error publishing resume version:", error);
    throw error;
  }
}

// Helper function to archive a specific version
export async function archiveResumeVersion(versionId: number) {
  try {
    // Check if version is published
    const versionCheck = await sql`
      SELECT is_published FROM resume_data WHERE id = ${versionId}
    `;

    if (versionCheck.rows[0]?.is_published) {
      throw new Error("Cannot archive a published version");
    }

    // Archive the version
    await sql`
      UPDATE resume_data
      SET is_archived = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${versionId}
    `;

    return true;
  } catch (error) {
    console.error("Error archiving resume version:", error);
    throw error;
  }
}

// Helper function to unarchive a specific version
export async function unarchiveResumeVersion(versionId: number) {
  try {
    await sql`
      UPDATE resume_data
      SET is_archived = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${versionId}
    `;

    return true;
  } catch (error) {
    console.error("Error unarchiving resume version:", error);
    throw error;
  }
}
