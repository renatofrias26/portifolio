import { redirect } from "next/navigation";
import { sql } from "@vercel/postgres";

/**
 * Main Landing Page
 *
 * Redirects to the first active user's portfolio,
 * or shows a landing page if no users exist.
 */
export default async function Home() {
  try {
    // Get the first active user (you can change this logic as needed)
    const result = await sql`
      SELECT username FROM users 
      WHERE is_active = true 
      ORDER BY created_at ASC 
      LIMIT 1
    `;

    if (result.rows.length > 0) {
      const username = result.rows[0].username;
      // Redirect to the first user's portfolio
      redirect(`/${username}`);
    }
  } catch (error) {
    console.error("Error fetching default user:", error);
  }

  // If no users exist or there's an error, show a simple landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Portfolio Platform
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Create and share your professional portfolio
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/admin/register"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started
          </a>
          <a
            href="/admin/login"
            className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}

export const revalidate = 60; // Revalidate every 60 seconds
