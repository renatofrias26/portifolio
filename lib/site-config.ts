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
    // Temporarily using Resend's default domain
    // TODO: Switch to custom domain after migrating to Cloudflare DNS
    support: "Upfolio Support <onboarding@resend.dev>",
    legal: "Upfolio Legal <onboarding@resend.dev>",
    noreply: "Upfolio <onboarding@resend.dev>",
    
    // Custom domain versions (use after Cloudflare setup):
    // support: "support@upfolio.com.au",
    // legal: "legal@upfolio.com.au",
    // noreply: "noreply@upfolio.com.au",
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
