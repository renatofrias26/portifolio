import { sql } from "@vercel/postgres";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function addPasswordResetFields() {
  try {
    console.log("🔧 Adding password reset fields to users table...");

    // Verify connection string is loaded
    if (!process.env.POSTGRES_URL) {
      throw new Error(
        "POSTGRES_URL not found in .env.local. Please add your database connection string.",
      );
    }
    console.log("✅ Database connection string loaded");

    // Add reset_token column
    console.log("Adding reset_token column...");
    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);
    `;

    // Add reset_token_expires column
    console.log("Adding reset_token_expires column...");
    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP;
    `;

    // Create index on reset_token for faster lookups
    console.log("Creating index on reset_token...");
    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_reset_token 
      ON users(reset_token) 
      WHERE reset_token IS NOT NULL;
    `;

    console.log("\n✅ Password reset fields migration completed successfully!");
    console.log("\nAdded columns:");
    console.log("  - reset_token (VARCHAR 255)");
    console.log("  - reset_token_expires (TIMESTAMP)");
    console.log("  - idx_users_reset_token (INDEX)");

    // Verify the migration
    const result = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('reset_token', 'reset_token_expires')
      ORDER BY column_name;
    `;

    console.log("\nVerification:");
    console.table(result.rows);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run migration
addPasswordResetFields()
  .then(() => {
    console.log("\n✨ Migration script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Migration script failed:", error);
    process.exit(1);
  });
