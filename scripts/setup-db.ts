import { config } from "dotenv";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";

// Load environment variables from .env.local
config({ path: ".env.local" });

async function setupDatabase() {
  try {
    console.log("🔧 Setting up Upfolio database...");

    // Verify connection string is loaded
    if (!process.env.POSTGRES_URL) {
      throw new Error(
        "POSTGRES_URL not found in .env.local. Please add your Neon connection string.",
      );
    }
    console.log("✅ Database connection string loaded");

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ Users table created");

    // Create resume_data table
    await sql`
      CREATE TABLE IF NOT EXISTS resume_data (
        id SERIAL PRIMARY KEY,
        version INTEGER NOT NULL DEFAULT 1,
        data JSONB NOT NULL,
        is_published BOOLEAN DEFAULT FALSE,
        pdf_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id)
      )
    `;
    console.log("✅ Resume data table created");

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_resume_published ON resume_data(is_published)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_resume_version ON resume_data(version DESC)`;
    console.log("✅ Indexes created");

    // Create default admin user (you should change this password!)
    const defaultEmail = "admin@upfolio.app";
    const defaultPassword = "changeme123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Check if admin already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${defaultEmail}
    `;

    if (existingUser.rows.length === 0) {
      await sql`
        INSERT INTO users (email, password_hash, name)
        VALUES (${defaultEmail}, ${hashedPassword}, 'Admin')
      `;
      console.log("✅ Default admin user created");
      console.log("📧 Email:", defaultEmail);
      console.log("🔑 Password:", defaultPassword);
      console.log(
        "⚠️  IMPORTANT: Change this password immediately after first login!",
      );
    } else {
      console.log("ℹ️  Admin user already exists");
    }

    console.log("\n✨ Upfolio database setup complete!");
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    throw error;
  }
}

setupDatabase();
