import { sql } from "@vercel/postgres";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function addUserImages() {
  try {
    console.log("Starting user images migration...");

    // Step 1: Add logo_url column
    console.log("Adding logo_url column to users table...");
    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS logo_url TEXT;
    `;

    // Step 2: Add profile_image_url column
    console.log("Adding profile_image_url column to users table...");
    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS profile_image_url TEXT;
    `;

    // Step 3: Add theme_settings column for future customization
    console.log("Adding theme_settings column to users table...");
    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS theme_settings JSONB DEFAULT '{"primaryColor": "#3b82f6", "accentColor": "#8b5cf6"}'::jsonb;
    `;

    console.log("\n✅ User images migration completed successfully!");
    console.log("\nNew columns added:");
    console.log("- logo_url: Store user's logo/brand image URL");
    console.log("- profile_image_url: Store user's profile/headshot image URL");
    console.log("- theme_settings: Store custom theme preferences");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run migration
addUserImages()
  .then(() => {
    console.log("Migration script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration script failed:", error);
    process.exit(1);
  });
