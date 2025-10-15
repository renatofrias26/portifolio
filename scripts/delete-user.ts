import { config } from "dotenv";
import { sql } from "@vercel/postgres";
import { del } from "@vercel/blob";

// Load environment variables from .env.local
config({ path: ".env.local" });

async function deleteUser(username: string) {
  try {
    console.log(`🗑️  Starting deletion process for user: ${username}`);

    // Verify connection string is loaded
    if (!process.env.POSTGRES_URL) {
      throw new Error(
        "POSTGRES_URL not found in .env.local. Please add your Neon connection string.",
      );
    }

    // First, get the user ID and check if user exists
    const userResult = await sql`
      SELECT id, email, name 
      FROM users 
      WHERE username = ${username}
    `;

    if (userResult.rows.length === 0) {
      console.log(`❌ User "${username}" not found.`);
      return;
    }

    const user = userResult.rows[0];
    console.log(`\n📋 User found:`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Username: ${username}`);

    // Get counts of associated resources
    const resumeCount = await sql`
      SELECT COUNT(*) as count 
      FROM resume_data 
      WHERE user_id = ${user.id}
    `;

    const jobAppCount = await sql`
      SELECT COUNT(*) as count 
      FROM job_applications 
      WHERE user_id = ${user.id}
    `;

    console.log(`\n📊 Resources to delete:`);
    console.log(`   Resume versions: ${resumeCount.rows[0].count}`);
    console.log(`   Job applications: ${jobAppCount.rows[0].count}`);

    // Get PDF URLs to delete from blob storage
    const pdfUrls = await sql`
      SELECT pdf_url 
      FROM resume_data 
      WHERE user_id = ${user.id} 
      AND pdf_url IS NOT NULL
    `;

    if (pdfUrls.rows.length > 0) {
      console.log(
        `\n🗂️  Deleting ${pdfUrls.rows.length} PDF files from blob storage...`,
      );
      for (const row of pdfUrls.rows) {
        try {
          await del(row.pdf_url);
          console.log(`   ✓ Deleted: ${row.pdf_url}`);
        } catch (error) {
          console.log(`   ⚠️  Could not delete blob: ${row.pdf_url}`);
          console.log(`      Error: ${error}`);
        }
      }
    }

    // Delete job applications (will cascade due to FK constraint, but being explicit)
    console.log(`\n🗑️  Deleting job applications...`);
    const deletedJobApps = await sql`
      DELETE FROM job_applications 
      WHERE user_id = ${user.id}
    `;
    console.log(`   ✓ Deleted ${deletedJobApps.rowCount} job applications`);

    // Delete resume data (will cascade due to FK constraint, but being explicit)
    console.log(`\n🗑️  Deleting resume data...`);
    const deletedResumes = await sql`
      DELETE FROM resume_data 
      WHERE user_id = ${user.id}
    `;
    console.log(`   ✓ Deleted ${deletedResumes.rowCount} resume versions`);

    // Finally, delete the user
    console.log(`\n🗑️  Deleting user account...`);
    const deletedUser = await sql`
      DELETE FROM users 
      WHERE id = ${user.id}
    `;
    console.log(`   ✓ User account deleted`);

    console.log(
      `\n✨ User "${username}" and all associated resources have been successfully deleted!`,
    );
    console.log(`\n📊 Summary:`);
    console.log(`   • User account: deleted`);
    console.log(`   • Resume versions: ${deletedResumes.rowCount} deleted`);
    console.log(`   • Job applications: ${deletedJobApps.rowCount} deleted`);
    console.log(
      `   • PDF files: ${pdfUrls.rows.length} deleted from blob storage`,
    );
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    throw error;
  } finally {
    // Close the connection
    await sql.end();
  }
}

// Get username from command line argument
const username = process.argv[2];

if (!username) {
  console.error("❌ Please provide a username as an argument");
  console.log("Usage: npx tsx scripts/delete-user.ts <username>");
  process.exit(1);
}

// Confirm deletion
console.log(
  `⚠️  WARNING: This will permanently delete user "${username}" and ALL associated data!`,
);
console.log("This action CANNOT be undone.\n");

deleteUser(username);
