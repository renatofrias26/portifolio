import { config } from "dotenv";
import { sql } from "@vercel/postgres";

config({ path: ".env.local" });

async function setUserPublic() {
  try {
    await sql`UPDATE users SET is_public = true WHERE username = 'johndoe'`;
    console.log("✅ Updated johndoe to PUBLIC");

    const result =
      await sql`SELECT username, is_public FROM users ORDER BY username`;
    console.table(result.rows);
  } catch (error) {
    console.error("Error:", error);
  }
}

setUserPublic();
