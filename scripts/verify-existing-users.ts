import { sql } from "@vercel/postgres";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function verifyExistingUsers() {
  try {
    console.log("🔧 Verifying existing users...");

    // Verify connection string is loaded
    if (!process.env.POSTGRES_URL) {
      throw new Error(
        "POSTGRES_URL not found in .env.local. Please add your database connection string.",
      );
    }

    // Get all unverified users
    const unverifiedUsers = await sql`
      SELECT id, email, username, created_at
      FROM users
      WHERE email_verified = false OR email_verified IS NULL
      ORDER BY created_at;
    `;

    console.log(`\nFound ${unverifiedUsers.rows.length} unverified users.`);

    if (unverifiedUsers.rows.length === 0) {
      console.log("✅ All users are already verified!");
      return;
    }

    console.log("\nUnverified users:");
    console.table(
      unverifiedUsers.rows.map((u) => ({
        id: u.id,
        email: u.email,
        username: u.username,
        created: new Date(u.created_at).toLocaleDateString(),
      })),
    );

    // Ask for confirmation (in a real script, you'd use readline or similar)
    console.log(
      "\n⚠️  This will mark ALL existing users as verified without requiring email confirmation.",
    );
    console.log(
      "This is typically done for existing users when adding email verification to an existing app.",
    );

    // Update all existing users to verified
    const result = await sql`
      UPDATE users
      SET email_verified = true,
          updated_at = CURRENT_TIMESTAMP
      WHERE email_verified = false OR email_verified IS NULL;
    `;

    console.log(
      `\n✅ Successfully verified ${result.rowCount} existing users!`,
    );

    // Show updated counts
    const userCount = await sql`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE email_verified = true) as verified_users,
        COUNT(*) FILTER (WHERE email_verified = false) as unverified_users
      FROM users;
    `;

    console.log("\nUpdated User Status:");
    console.table(userCount.rows);
  } catch (error) {
    console.error("❌ Verification failed:", error);
    throw error;
  }
}

// Run verification
verifyExistingUsers()
  .then(() => {
    console.log("\n✨ Verification script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Verification script failed:", error);
    process.exit(1);
  });
