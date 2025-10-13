import { sql } from "@vercel/postgres";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function addEmailVerificationFields() {
  try {
    console.log("🔧 Adding email verification fields to users table...");

    // Verify connection string is loaded
    if (!process.env.POSTGRES_URL) {
      throw new Error(
        "POSTGRES_URL not found in .env.local. Please add your database connection string.",
      );
    }
    console.log("✅ Database connection string loaded");

    // Add email_verified column
    console.log("Adding email_verified column...");
    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
    `;

    // Add verification_token column
    console.log("Adding verification_token column...");
    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255);
    `;

    // Add verification_token_expires column
    console.log("Adding verification_token_expires column...");
    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMP;
    `;

    // Create index on verification_token for faster lookups
    console.log("Creating index on verification_token...");
    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_verification_token 
      ON users(verification_token) 
      WHERE verification_token IS NOT NULL;
    `;

    // Create index on email_verified for queries
    console.log("Creating index on email_verified...");
    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_email_verified 
      ON users(email_verified);
    `;

    console.log(
      "\n✅ Email verification fields migration completed successfully!",
    );
    console.log("\nAdded columns:");
    console.log("  - email_verified (BOOLEAN, default false)");
    console.log("  - verification_token (VARCHAR 255)");
    console.log("  - verification_token_expires (TIMESTAMP)");
    console.log("  - idx_users_verification_token (INDEX)");
    console.log("  - idx_users_email_verified (INDEX)");

    // Verify the migration
    const result = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('email_verified', 'verification_token', 'verification_token_expires')
      ORDER BY column_name;
    `;

    console.log("\nVerification:");
    console.table(result.rows);

    // Check existing users
    const userCount = await sql`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE email_verified = true) as verified_users,
        COUNT(*) FILTER (WHERE email_verified = false OR email_verified IS NULL) as unverified_users
      FROM users;
    `;

    console.log("\nUser Status:");
    console.table(userCount.rows);

    console.log("\n⚠️  Note: Existing users are set as unverified by default.");
    console.log("To verify existing users automatically, run:");
    console.log("  npx tsx scripts/verify-existing-users.ts");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run migration
addEmailVerificationFields()
  .then(() => {
    console.log("\n✨ Migration script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Migration script failed:", error);
    process.exit(1);
  });
