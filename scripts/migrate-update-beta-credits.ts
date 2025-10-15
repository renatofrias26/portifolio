/**
 * Migration Script: Update Beta Credits to 500
 *
 * Updates the default token credits from 100 to 500 for the beta period.
 * This script:
 * 1. Updates existing users to 500 credits if they haven't used any
 * 2. Updates the default value for new users
 */

import { sql } from "@vercel/postgres";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

async function main() {
  try {
    console.log("🚀 Starting beta credits migration (100 → 500)...\n");

    // Step 1: Update existing users who haven't used their initial 100 credits
    console.log("📊 Updating existing users with unused initial credits...");
    const updateResult = await sql`
      UPDATE users 
      SET token_credits = token_credits + 400
      WHERE token_credits <= 100 
        AND tokens_used = 0;
    `;
    console.log(`✅ Updated ${updateResult.rowCount} users to 500 credits\n`);

    // Step 2: Change the default value for new users
    console.log("🔧 Updating default value for token_credits column...");

    // Drop the old default
    await sql`
      ALTER TABLE users 
      ALTER COLUMN token_credits DROP DEFAULT;
    `;

    // Set new default
    await sql`
      ALTER TABLE users 
      ALTER COLUMN token_credits SET DEFAULT 500;
    `;
    console.log("✅ Default token_credits updated to 500\n");

    // Step 3: Verify the changes
    console.log("🔍 Verifying changes...");
    const stats = await sql`
      SELECT 
        COUNT(*) as total_users,
        AVG(token_credits)::INTEGER as avg_credits,
        MIN(token_credits) as min_credits,
        MAX(token_credits) as max_credits
      FROM users
      WHERE token_credits IS NOT NULL;
    `;

    console.log("📈 Current statistics:");
    console.log(`   Total users: ${stats.rows[0].total_users}`);
    console.log(`   Average credits: ${stats.rows[0].avg_credits}`);
    console.log(`   Min credits: ${stats.rows[0].min_credits}`);
    console.log(`   Max credits: ${stats.rows[0].max_credits}\n`);

    console.log("✨ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

main();
