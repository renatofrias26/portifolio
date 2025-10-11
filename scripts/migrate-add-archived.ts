/**
 * Migration Script: Add is_archived column to resume_data table
 *
 * This script adds the is_archived boolean column to the resume_data table
 * and creates an index for better query performance.
 *
 * Run this script after deploying the new code to update your database schema.
 */

import { config } from "dotenv";
import { resolve } from "path";
import { sql } from "@vercel/postgres";

// Load environment variables from .env.local
config({ path: resolve(__dirname, "../.env.local") });

async function migrate() {
  try {
    console.log("🚀 Starting migration: Add is_archived column...");

    // Add is_archived column if it doesn't exist
    await sql`
      ALTER TABLE resume_data
      ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;
    `;
    console.log("✅ Added is_archived column");

    // Create index for faster queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_resume_archived ON resume_data(is_archived);
    `;
    console.log("✅ Created index on is_archived column");

    // Update any existing NULL values to false (just in case)
    await sql`
      UPDATE resume_data
      SET is_archived = FALSE
      WHERE is_archived IS NULL;
    `;
    console.log("✅ Updated NULL values to FALSE");

    console.log("🎉 Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run the migration
migrate()
  .then(() => {
    console.log("✅ All done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
