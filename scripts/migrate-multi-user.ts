import { sql } from "@vercel/postgres";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function migrateToMultiUser() {
  try {
    console.log("Starting multi-user migration...");

    // Step 1: Add username column to users table if it doesn't exist
    console.log("Adding username column to users table...");
    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE;
    `;

    // Step 2: Add profile_data column to users table if it doesn't exist
    console.log("Adding profile_data column to users table...");
    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS profile_data JSONB;
    `;

    // Step 3: Add is_active column to users table if it doesn't exist
    console.log("Adding is_active column to users table...");
    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    `;

    // Step 4: Update existing users to have a username based on their email
    console.log("Updating existing users with usernames...");
    const existingUsers = await sql`
      SELECT id, email, username FROM users WHERE username IS NULL;
    `;

    for (const user of existingUsers.rows) {
      const username = user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
      console.log(`Setting username for ${user.email}: ${username}`);
      await sql`
        UPDATE users
        SET username = ${username}
        WHERE id = ${user.id};
      `;
    }

    // Step 5: Make username NOT NULL after populating
    console.log("Making username column NOT NULL...");
    await sql`
      ALTER TABLE users
      ALTER COLUMN username SET NOT NULL;
    `;

    // Step 6: Add user_id column to resume_data if it doesn't exist
    console.log("Adding user_id column to resume_data...");
    await sql`
      ALTER TABLE resume_data
      ADD COLUMN IF NOT EXISTS user_id INTEGER;
    `;

    // Step 7: Update existing resume_data to link to users
    console.log("Linking existing resumes to users...");
    const resumesWithoutUser = await sql`
      SELECT id, created_by FROM resume_data WHERE user_id IS NULL;
    `;

    for (const resume of resumesWithoutUser.rows) {
      if (resume.created_by) {
        await sql`
          UPDATE resume_data
          SET user_id = ${resume.created_by}
          WHERE id = ${resume.id};
        `;
      } else {
        // If no created_by, assign to first user
        const firstUser = await sql`SELECT id FROM users ORDER BY id LIMIT 1;`;
        if (firstUser.rows.length > 0) {
          await sql`
            UPDATE resume_data
            SET user_id = ${firstUser.rows[0].id}
            WHERE id = ${resume.id};
          `;
        }
      }
    }

    // Step 8: Make user_id NOT NULL and add foreign key
    console.log("Making user_id NOT NULL and adding foreign key...");
    await sql`
      ALTER TABLE resume_data
      ALTER COLUMN user_id SET NOT NULL;
    `;

    // Step 9: Add foreign key constraint if it doesn't exist
    console.log("Adding foreign key constraint...");
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'resume_data_user_id_fkey'
        ) THEN
          ALTER TABLE resume_data
          ADD CONSTRAINT resume_data_user_id_fkey
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
        END IF;
      END $$;
    `;

    // Step 10: Recreate version numbers per user (reset version numbering for each user)
    console.log("Resetting version numbers per user...");
    await sql`
      WITH ranked_resumes AS (
        SELECT 
          id,
          user_id,
          ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) as new_version
        FROM resume_data
      )
      UPDATE resume_data
      SET version = ranked_resumes.new_version
      FROM ranked_resumes
      WHERE resume_data.id = ranked_resumes.id;
    `;

    // Step 11: Add unique constraint on (user_id, version)
    console.log("Adding unique constraint on (user_id, version)...");
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'resume_data_user_id_version_key'
        ) THEN
          ALTER TABLE resume_data
          ADD CONSTRAINT resume_data_user_id_version_key
          UNIQUE (user_id, version);
        END IF;
      END $$;
    `;

    // Step 12: Drop old indexes and create new ones
    console.log("Updating indexes...");
    await sql`DROP INDEX IF EXISTS idx_resume_published;`;
    await sql`DROP INDEX IF EXISTS idx_resume_archived;`;
    await sql`DROP INDEX IF EXISTS idx_resume_version;`;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_resume_user_id ON resume_data(user_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_resume_user_published 
      ON resume_data(user_id, is_published) WHERE is_published = true;
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_resume_user_archived 
      ON resume_data(user_id, is_archived);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_resume_user_version 
      ON resume_data(user_id, version DESC);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `;

    console.log("\n✅ Multi-user migration completed successfully!");
    console.log("\nNext steps:");
    console.log("1. Update your application code to use user-specific queries");
    console.log("2. Test the authentication and data isolation");
    console.log("3. Create public portfolio routes using usernames");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run migration
migrateToMultiUser()
  .then(() => {
    console.log("Migration script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration script failed:", error);
    process.exit(1);
  });
