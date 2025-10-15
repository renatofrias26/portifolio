import * as cheerio from "cheerio";
import { extractJobInfo } from "./job-assistant";

export interface ScrapedJob {
  title: string;
  company: string;
  description: string;
  location?: string;
}

/**
 * Fetch and parse a job posting from a URL
 * Supports major job boards: LinkedIn, Indeed, Greenhouse, Lever, and generic sites
 */
export async function fetchJobPosting(url: string): Promise<ScrapedJob> {
  try {
    console.log("Fetching job posting from:", url);

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Provide more helpful error messages based on status code
      const statusMessages: Record<number, string> = {
        403: "The website is blocking automated access. Please paste the job description manually below.",
        404: "Job posting not found. The URL may be incorrect or the posting has been removed.",
        401: "This job posting requires authentication. Please copy and paste the job description manually.",
        429: "Too many requests. Please wait a moment and try again, or paste the job description manually.",
        500: "The website encountered an error. Please try again or paste the job description manually.",
      };

      const message =
        statusMessages[response.status] ||
        `HTTP ${response.status}: ${response.statusText}. Please paste the job description manually.`;

      throw new Error(message);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("text/html")) {
      throw new Error(
        "URL does not return HTML content. Please ensure this is a job posting page.",
      );
    }

    const html = await response.text();

    if (html.length < 100) {
      throw new Error("Response is too short. The URL may not be accessible.");
    }

    const $ = cheerio.load(html);

    // Remove unwanted elements globally (like chat API does)
    $("script, style, nav, header, footer, iframe, noscript").remove();

    // Try platform-specific scrapers in order
    const scrapers = [
      scrapeLinkedIn,
      scrapeIndeed,
      scrapeGreenhouse,
      scrapeLever,
      scrapeWorkday,
      scrapeGeneric,
    ];

    for (const scraper of scrapers) {
      const result = scraper($, url);
      if (
        result.title &&
        result.description &&
        result.description.length > 50
      ) {
        console.log(`✓ Successfully scraped using ${scraper.name}`);
        return result;
      }
    }

    // Fallback: Extract all text and use AI to parse
    console.log("Platform-specific scrapers failed, using AI extraction...");
    const bodyText = $("body").text().replace(/\s+/g, " ").trim();

    if (bodyText.length < 100) {
      throw new Error(
        "Could not extract enough content from the page. The website may require JavaScript or be blocking access.",
      );
    }

    return await extractJobWithAI(bodyText, url);
  } catch (error) {
    console.error("Job scraping error:", error);

    // Provide detailed error message
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error(
          "Request timed out after 15 seconds. The website may be slow or unresponsive.",
        );
      }
      throw error;
    }

    throw new Error(
      "Failed to fetch job posting from URL. The website may be blocking automated access or require login.",
    );
  }
}

/**
 * LinkedIn job scraper
 */
function scrapeLinkedIn($: cheerio.CheerioAPI, url: string): ScrapedJob {
  const title =
    $(".top-card-layout__title").text().trim() ||
    $('h1[class*="job-title"]').text().trim() ||
    $(".topcard__title").text().trim();

  const company =
    $(".topcard__org-name-link").text().trim() ||
    $(".top-card-layout__company a").text().trim() ||
    $('a[class*="topcard__org-name"]').text().trim();

  const description =
    $(".show-more-less-html__markup").text().trim() ||
    $(".description__text").text().trim() ||
    $('div[class*="description"]').text().trim();

  const location = $(".topcard__flavor--bullet").text().trim();

  return { title, company, description, location };
}

/**
 * Indeed job scraper
 */
function scrapeIndeed($: cheerio.CheerioAPI, url: string): ScrapedJob {
  const title =
    $(".jobsearch-JobInfoHeader-title").text().trim() ||
    $('h1[class*="jobTitle"]').text().trim() ||
    $(".icl-u-xs-mb--xs").text().trim();

  const company =
    $('[data-company-name="true"]').text().trim() ||
    $(".jobsearch-InlineCompanyRating-companyHeader").text().trim() ||
    $('div[class*="company"]').first().text().trim();

  const description =
    $("#jobDescriptionText").text().trim() ||
    $(".jobsearch-jobDescriptionText").text().trim() ||
    $('div[id*="jobDesc"]').text().trim();

  const location = $(".jobsearch-JobInfoHeader-subtitle").text().trim();

  return { title, company, description, location };
}

/**
 * Greenhouse (common ATS) scraper
 */
function scrapeGreenhouse($: cheerio.CheerioAPI, url: string): ScrapedJob {
  const title =
    $(".app-title").text().trim() ||
    $('h1[class*="job-title"]').text().trim() ||
    $("h1").first().text().trim();

  const company =
    $(".company-name").text().trim() ||
    $('a[class*="company"]').text().trim() ||
    $("title").text().split("|")[1]?.trim() ||
    "";

  const description =
    $("#content").text().trim() ||
    $(".job-post-content").text().trim() ||
    $('div[class*="content"]').text().trim();

  const location = $(".location").text().trim();

  return { title, company, description, location };
}

/**
 * Lever (common ATS) scraper
 */
function scrapeLever($: cheerio.CheerioAPI, url: string): ScrapedJob {
  const title =
    $(".posting-headline h2").text().trim() ||
    $('h2[class*="posting-title"]').text().trim() ||
    $("h2").first().text().trim();

  const company =
    $(".main-header-text a").text().trim() ||
    $('a[class*="logo"]').attr("aria-label") ||
    $("title").text().split("|")[0]?.trim() ||
    "";

  const description =
    $(".content .section-wrapper").text().trim() ||
    $(".posting-content").text().trim() ||
    $('div[class*="description"]').text().trim();

  const location = $(".posting-categories .location").text().trim();

  return { title, company, description, location };
}

/**
 * Workday (common enterprise ATS) scraper
 */
function scrapeWorkday($: cheerio.CheerioAPI, url: string): ScrapedJob {
  const title =
    $('h2[data-automation-id="jobPostingHeader"]').text().trim() ||
    $('h1[class*="job-title"]').text().trim() ||
    $("h1").first().text().trim();

  const company =
    $('span[data-automation-id="company"]').text().trim() ||
    $(".company-name").text().trim() ||
    "";

  const description =
    $('div[data-automation-id="jobPostingDescription"]').text().trim() ||
    $(".job-description").text().trim() ||
    $('div[class*="description"]').text().trim();

  const location = $('div[data-automation-id="location"]').text().trim();

  return { title, company, description, location };
}

/**
 * Generic scraper for unknown platforms
 * Uses common HTML patterns similar to chat API approach
 */
function scrapeGeneric($: cheerio.CheerioAPI, url: string): ScrapedJob {
  // Remove unwanted elements (like chat API does)
  $("script, style, nav, header, footer, iframe, noscript").remove();

  // Try to find title
  const title =
    $("h1").first().text().trim() ||
    $('h1[class*="title"]').first().text().trim() ||
    $('h1[class*="job"]').first().text().trim() ||
    $("title").text().split("|")[0]?.trim() ||
    "";

  // Try to find company
  const company =
    $('[class*="company"]').first().text().trim() ||
    $('[class*="employer"]').first().text().trim() ||
    $("title").text().split("|")[1]?.trim() ||
    new URL(url).hostname.split(".")[0] ||
    "";

  // Try to find description - use content selectors like chat API
  const contentSelectors = [
    "main",
    "article",
    '[role="main"]',
    ".job-description",
    ".job-details",
    "#job-description",
    ".description",
    ".content",
    '[class*="description"]',
    '[class*="job-desc"]',
    '[id*="description"]',
    '[id*="job-desc"]',
  ];

  let description = "";
  for (const selector of contentSelectors) {
    const content = $(selector).text().trim();
    if (content.length > 200) {
      description = content;
      break;
    }
  }

  // Fallback to body if no specific content found
  if (!description) {
    description = $("body").text();
  }

  // Clean up whitespace (like chat API)
  description = description.replace(/\s+/g, " ").trim();

  // Try to find location
  const location =
    $('[class*="location"]').first().text().trim() ||
    $('[class*="address"]').first().text().trim() ||
    "";

  return { title, company, description, location };
}

/**
 * AI-powered fallback for unstructured job postings
 * Uses OpenAI to extract structured data from raw text
 */
async function extractJobWithAI(
  text: string,
  url: string,
): Promise<ScrapedJob> {
  try {
    // Limit text length to avoid token limits
    const truncatedText = text.substring(0, 8000);

    // Use the existing extractJobInfo function for title and company
    const { jobTitle, companyName } = await extractJobInfo(truncatedText);

    return {
      title: jobTitle,
      company: companyName,
      description: truncatedText,
    };
  } catch (error) {
    console.error("AI extraction failed:", error);
    throw new Error(
      "Could not extract job information. Please paste the job description manually.",
    );
  }
}

/**
 * Validate if a string is a valid URL
 */
export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
