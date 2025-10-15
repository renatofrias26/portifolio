/**
 * Site Configuration
 * Central configuration for domain, URLs, and site metadata
 */

export const siteConfig = {
  // Production domain
  domain: "upfolio.com.au",

  // Full site URL (used for canonical URLs, OG tags, etc.)
  url:
    process.env.NODE_ENV === "production"
      ? "https://upfolio.com.au"
      : process.env.NEXTAUTH_URL || "http://localhost:3000",

  // Brand information
  name: "Upfolio",
  tagline: "Upload. Share. Get hired.",
  description:
    "Create your professional portfolio in minutes with AI-powered resume parsing. Upload your resume, get a beautiful portfolio. Simple, powerful, effective.",

  // Contact information
  email: {
    support: "support@upfolio.com.au",
    legal: "legal@upfolio.com.au",
    noreply: "noreply@upfolio.com.au",
  },

  // Social links (to be added when ready)
  social: {
    twitter: "",
    linkedin: "",
    github: "",
  },

  // Alternative domains (for reference)
  alternativeDomains: ["upfolio.au", "upfolio.app"],
} as const;

/**
 * Get the base URL for the current environment
 */
export function getBaseUrl(): string {
  return siteConfig.url;
}

/**
 * Get absolute URL for a path
 */
export function getAbsoluteUrl(path: string): string {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
