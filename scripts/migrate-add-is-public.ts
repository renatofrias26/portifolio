import { config } from "dotenv";
import { sql } from "@vercel/postgres";

// Load environment variables from .env.local
config({ path: ".env.local" });

/**
 * Migration: Add is_public column to users table
 *
 * This allows users to control whether their profile is publicly visible
 * in the profiles directory and accessible via their username URL.
 *
 * Run this script after deploying the new code to update your database schema.
 * Usage: npx tsx scripts/migrate-add-is-public.ts
 */
async function migrate() {
  try {
    console.log("🔧 Starting migration: Add is_public to users table...");

    // Verify connection string is loaded
    if (!process.env.POSTGRES_URL) {
      throw new Error(
        "POSTGRES_URL not found in .env.local. Please add your Neon connection string.",
      );
    }

    // Add is_public column (defaults to true for backward compatibility)
    console.log("Adding is_public column...");
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true
    `;
    console.log("✅ Added is_public column");

    // Create index for better query performance
    console.log("Creating index...");
    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_public 
      ON users(is_public) 
      WHERE is_public = true
    `;
    console.log("✅ Created index on is_public");

    // Show current stats
    const stats = await sql`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE is_public = true) as public_users,
        COUNT(*) FILTER (WHERE is_public = false) as private_users
      FROM users
    `;

    console.log("\n📊 Migration Statistics:");
    console.log(`   Total users: ${stats.rows[0].total_users}`);
    console.log(`   Public profiles: ${stats.rows[0].public_users}`);
    console.log(`   Private profiles: ${stats.rows[0].private_users}`);

    console.log("\n✨ Migration completed successfully!");
    console.log("ℹ️  All existing users have been set to public by default.");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

migrate();
