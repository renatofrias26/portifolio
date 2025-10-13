import { sql } from "@vercel/postgres";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

async function migrateJobApplications() {
  try {
    console.log("Starting job applications migration...");

    // Create job_applications table
    console.log("Creating job_applications table...");
    await sql`
      CREATE TABLE IF NOT EXISTS job_applications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        
        -- Job details (extracted from URL or manual entry)
        job_title VARCHAR(500),
        company_name VARCHAR(255),
        job_description TEXT NOT NULL,
        job_url VARCHAR(2000),
        
        -- Resume source tracking
        resume_source VARCHAR(20) NOT NULL CHECK (resume_source IN ('existing', 'upload')),
        resume_version INTEGER,
        resume_snapshot JSONB,
        
        -- Generated outputs (original markdown)
        tailored_resume TEXT,
        cover_letter TEXT,
        
        -- User edits (if they modify the generated content)
        tailored_resume_edited TEXT,
        cover_letter_edited TEXT,
        
        -- Metadata
        is_saved BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        
        CONSTRAINT fk_job_app_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;
    console.log("✓ job_applications table created");

    // Create indexes for better query performance
    console.log("Creating indexes...");

    await sql`
      CREATE INDEX IF NOT EXISTS idx_job_applications_user_saved 
      ON job_applications(user_id, is_saved, created_at DESC);
    `;
    console.log("✓ Index on (user_id, is_saved, created_at) created");

    await sql`
      CREATE INDEX IF NOT EXISTS idx_job_applications_created_at 
      ON job_applications(created_at DESC);
    `;
    console.log("✓ Index on created_at created");

    // Add token credit columns to users table
    console.log("Adding token credit columns to users table...");

    // Check if columns exist before adding
    const columnsCheck = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('token_credits', 'tokens_used');
    `;

    const existingColumns = columnsCheck.rows.map((row) => row.column_name);

    if (!existingColumns.includes("token_credits")) {
      await sql`
        ALTER TABLE users 
        ADD COLUMN token_credits INTEGER DEFAULT 100;
      `;
      console.log("✓ token_credits column added");
    } else {
      console.log("✓ token_credits column already exists");
    }

    if (!existingColumns.includes("tokens_used")) {
      await sql`
        ALTER TABLE users 
        ADD COLUMN tokens_used INTEGER DEFAULT 0;
      `;
      console.log("✓ tokens_used column added");
    } else {
      console.log("✓ tokens_used column already exists");
    }

    // Update existing users to have 100 credits
    await sql`
      UPDATE users 
      SET token_credits = 100, tokens_used = 0 
      WHERE token_credits IS NULL OR tokens_used IS NULL;
    `;
    console.log("✓ Existing users updated with default credits");

    console.log("\n✅ Migration completed successfully!");
    console.log("\nNew features enabled:");
    console.log(
      "  • job_applications table for storing AI-generated resumes/cover letters",
    );
    console.log("  • Token credit system (100 credits per user)");
    console.log("  • Support for both saved and disposable applications");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run the migration
migrateJobApplications()
  .then(() => {
    console.log(
      "\nMigration complete. You can now use the Job Assistant feature!",
    );
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nMigration failed:", error);
    process.exit(1);
  });
