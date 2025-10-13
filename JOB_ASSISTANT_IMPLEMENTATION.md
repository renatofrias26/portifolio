# Job Application Assistant - Implementation Plan

## Overview

AI-powered tool to generate tailored resumes and cover letters for specific job applications.

## Features

- ✅ Use existing resume or upload new PDF (temporary)
- ✅ Parse job postings from URL or manual paste
- ✅ Generate tailored markdown resume
- ✅ Generate personalized cover letter
- ✅ Inline markdown editor with live preview
- ✅ Export to styled PDF
- ✅ Optional save to history (with confirmation)
- ✅ Token credit system (future pricing model)

---

## UI/UX Design

### Layout: Split-Screen with History Panel

```
┌─────────────────────────────────────────────────────────────────────┐
│  Admin Navbar - Job Application Assistant                           │
├─────────────────────┬───────────────────────────────────────────────┤
│                     │                                               │
│  HISTORY PANEL      │  MAIN WIZARD AREA                            │
│  (collapsible)      │                                               │
│                     │  ┌─ Step 1: Resume Source ─────────────┐    │
│  [+ New Application]│  │ ○ Use published resume v3           │    │
│                     │  │ ○ Upload new PDF (temporary)        │    │
│  ┌────────────────┐ │  └─────────────────────────────────────┘    │
│  │ Software Eng   │ │                                               │
│  │ @ Google       │ │  ┌─ Step 2: Job Details ──────────────┐    │
│  │ 2 days ago     │ │  │ Job URL: _____________________     │    │
│  │ [Edit][Delete] │ │  │          OR                        │    │
│  └────────────────┘ │  │ Job Description:                   │    │
│                     │  │ ┌──────────────────────────────┐   │    │
│  ┌────────────────┐ │  │ │ Paste full job posting...    │   │    │
│  │ Product Mgr    │ │  │ └──────────────────────────────┘   │    │
│  │ @ Meta         │ │  │ Detected: Title, Company          │    │
│  │ 5 days ago     │ │  └─────────────────────────────────────┘    │
│  └────────────────┘ │                                               │
│                     │  ┌─ Step 3: What to Generate ────────┐    │
│  [Load More]        │  │ ☑ Tailored Resume                 │    │
│                     │  │ ☑ Cover Letter                    │    │
│                     │  │                                    │    │
│                     │  │ [Generate Documents] [Clear]      │    │
│                     │  └─────────────────────────────────────┘    │
│                     │                                               │
│                     │  ─── RESULTS (after generation) ───          │
│                     │                                               │
│                     │  ┌─ Tabs: [Resume] [Cover Letter] ─┐       │
│                     │  │                                   │       │
│                     │  │  [Edit] [Preview] mode toggle    │       │
│                     │  │                                   │       │
│                     │  │  ┌─────────────────────────────┐ │       │
│                     │  │  │ # John Doe                  │ │       │
│                     │  │  │ Senior Software Engineer    │ │       │
│                     │  │  │                             │ │       │
│                     │  │  │ ## Experience               │ │       │
│                     │  │  │ ...                         │ │       │
│                     │  │  └─────────────────────────────┘ │       │
│                     │  │                                   │       │
│                     │  │  [Copy Markdown] [Download PDF]  │       │
│                     │  │  [Save to History]               │       │
│                     │  └───────────────────────────────────┘       │
│                     │                                               │
└─────────────────────┴───────────────────────────────────────────────┘
```

### Mobile Layout (< 768px)

- History panel becomes dropdown/modal
- Wizard takes full width
- Sticky action buttons at bottom

---

## Database Schema

### New Table: `job_applications`

```sql
CREATE TABLE job_applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Job details
  job_title VARCHAR(500),
  company_name VARCHAR(255),
  job_description TEXT NOT NULL,
  job_url VARCHAR(2000),

  -- Resume tracking
  resume_source VARCHAR(20) NOT NULL, -- 'existing' or 'upload'
  resume_version INTEGER,
  resume_snapshot JSONB,  -- Store resume at generation time

  -- Generated content (original)
  tailored_resume TEXT,
  cover_letter TEXT,

  -- User edits (if modified)
  tailored_resume_edited TEXT,
  cover_letter_edited TEXT,

  -- Metadata
  is_saved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_job_applications_user_saved
  ON job_applications(user_id, is_saved, created_at DESC);
```

### User Table Extension

```sql
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS token_credits INTEGER DEFAULT 100,
  ADD COLUMN IF NOT EXISTS tokens_used INTEGER DEFAULT 0;
```

---

## File Structure

```
app/admin/job-assistant/
├── page.tsx                      # Main page (server component)
└── layout.tsx                    # Optional breadcrumb

app/api/job-assistant/
├── generate/
│   └── route.ts                  # POST - Generate docs
├── save/
│   └── route.ts                  # POST - Save to history
├── history/
│   └── route.ts                  # GET - Fetch saved applications
├── delete/
│   └── route.ts                  # DELETE - Remove application
└── export-pdf/
    └── route.ts                  # POST - Generate styled PDF

lib/
├── job-assistant.ts              # AI generation logic
├── job-scraper.ts                # URL content extraction
└── pdf-generator.ts              # Markdown to styled PDF

components/admin/job-assistant/
├── job-assistant-wizard.tsx      # Main form (client)
├── job-history-panel.tsx         # Saved applications list
├── job-details-form.tsx          # URL/description input
├── markdown-editor.tsx           # Editable markdown with preview
├── document-tabs.tsx             # Resume/CL tab switcher
└── pdf-export-button.tsx         # Download as PDF

scripts/
└── migrate-add-job-applications.ts
```

---

## API Endpoints

### 1. `POST /api/job-assistant/generate`

**Request:**

```typescript
{
  resumeSource: "existing" | "upload",
  resumeFile?: File,
  resumeVersion?: number,
  jobUrl?: string,
  jobDescription?: string,
  jobTitle?: string,      // Optional override
  companyName?: string,   // Optional override
  generateResume: boolean,
  generateCoverLetter: boolean
}
```

**Response:**

```typescript
{
  success: true,
  data: {
    jobTitle: string,
    companyName: string,
    tailoredResume?: string,      // Markdown
    coverLetter?: string,          // Markdown
    tokensUsed: number,
    remainingCredits: number
  }
}
```

**Flow:**

1. Validate session & check token credits
2. Get resume data (existing or parse uploaded)
3. Fetch job content (URL scrape or use description)
4. Extract job title/company if not provided
5. Generate requested documents with AI
6. Deduct tokens from user balance
7. Return markdown (NOT saved yet)

---

### 2. `POST /api/job-assistant/save`

**Request:**

```typescript
{
  jobTitle: string,
  companyName: string,
  jobDescription: string,
  jobUrl?: string,
  resumeSource: string,
  resumeVersion?: number,
  resumeSnapshot: object,
  tailoredResume?: string,      // Edited version
  coverLetter?: string           // Edited version
}
```

**Response:**

```typescript
{
  success: true,
  applicationId: number
}
```

**Flow:**

1. Validate session
2. Insert into `job_applications` with `is_saved = true`
3. Return application ID

---

### 3. `GET /api/job-assistant/history`

**Query params:** `?limit=10&offset=0`

**Response:**

```typescript
{
  applications: [
    {
      id: number,
      jobTitle: string,
      companyName: string,
      createdAt: string,
      hasResume: boolean,
      hasCoverLetter: boolean
    }
  ],
  total: number
}
```

---

### 4. `GET /api/job-assistant/history/[id]`

**Response:**

```typescript
{
  application: {
    id: number,
    jobTitle: string,
    companyName: string,
    jobDescription: string,
    jobUrl?: string,
    tailoredResume?: string,     // Use edited if exists
    coverLetter?: string,
    createdAt: string
  }
}
```

---

### 5. `DELETE /api/job-assistant/history/[id]`

**Response:**

```typescript
{
  success: true;
}
```

---

### 6. `POST /api/job-assistant/export-pdf`

**Request:**

```typescript
{
  markdown: string,
  type: "resume" | "cover_letter",
  jobTitle: string,
  companyName: string
}
```

**Response:**

```typescript
Binary PDF file
```

**Implementation:**

- Convert markdown to HTML
- Apply beautiful CSS styling
- Generate PDF with proper formatting
- Return as downloadable file

---

## AI Implementation

### File: `lib/job-assistant.ts`

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateTailoredResume(
  resumeData: ParsedResume,
  jobDescription: string,
  jobTitle: string,
  companyName: string,
): Promise<string> {
  const prompt = `You are an expert resume writer and ATS optimization specialist.

TASK: Transform this resume to be highly tailored for this specific job posting.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

JOB POSTING:
Position: ${jobTitle} at ${companyName}
${jobDescription}

REQUIREMENTS:
1. Analyze the job requirements and extract key skills/qualifications
2. Re-order and emphasize resume sections to match job priorities
3. Rewrite bullet points to highlight relevant achievements
4. Use keywords from the job description naturally
5. Maintain truthfulness - don't fabricate experience
6. Keep it concise (max 2 pages worth of content)
7. Output in clean, professional markdown format

OUTPUT FORMAT:
# [Name]
**[Professional Title aligned with job]**

📧 [email] | 📱 [phone] | 📍 [location] | 🔗 [LinkedIn/GitHub if available]

## Professional Summary
[2-3 sentences highlighting most relevant experience for THIS job]

## Core Competencies
[Skills matching job requirements, organized in relevant categories]

## Professional Experience
### [Most relevant job first]
**[Title]** | [Company] | [Location] | [Dates]
- [Achievement-focused bullets using job posting keywords]
- [Quantified results where possible]

[Continue with other relevant experiences]

## Education
[Standard format]

## Projects
[Only include if relevant to the job]

Generate the tailored resume now:`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 2500,
  });

  return response.choices[0].message.content || "";
}

export async function generateCoverLetter(
  resumeData: ParsedResume,
  jobDescription: string,
  jobTitle: string,
  companyName: string,
): Promise<string> {
  const prompt = `You are an expert career coach writing compelling cover letters.

TASK: Write a personalized cover letter for this job application.

CANDIDATE RESUME:
${JSON.stringify(resumeData, null, 2)}

JOB POSTING:
Position: ${jobTitle} at ${companyName}
${jobDescription}

REQUIREMENTS:
1. Professional yet personable tone
2. Show genuine enthusiasm for the role and company
3. Highlight 2-3 most relevant achievements from resume
4. Explain why this role is a perfect fit
5. Demonstrate company research (if company mentioned in job desc)
6. Keep to 3-4 paragraphs
7. Output in markdown format

OUTPUT FORMAT:
# Cover Letter
**${jobTitle} Position**  
${companyName}

Dear Hiring Manager,

[Opening paragraph: Hook + why you're excited about this role]

[Body paragraph 1: Highlight most relevant experience/achievement]

[Body paragraph 2: Additional qualifications + cultural fit]

[Closing paragraph: Call to action + availability]

Best regards,  
[Name]

Generate the cover letter now:`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    max_tokens: 1500,
  });

  return response.choices[0].message.content || "";
}

export function calculateTokenCost(
  generateResume: boolean,
  generateCoverLetter: boolean,
): number {
  // Token pricing (adjustable)
  const RESUME_COST = 10;
  const COVER_LETTER_COST = 5;

  let cost = 0;
  if (generateResume) cost += RESUME_COST;
  if (generateCoverLetter) cost += COVER_LETTER_COST;

  return cost;
}
```

---

### File: `lib/job-scraper.ts`

```typescript
import * as cheerio from "cheerio";

interface ScrapedJob {
  title: string;
  company: string;
  description: string;
  location?: string;
}

export async function fetchJobPosting(url: string): Promise<ScrapedJob> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; UpfolioBot/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Try common job board selectors
    const scrapers = [
      scrapeLinkedIn,
      scrapeIndeed,
      scrapeGreenhouse,
      scrapeLever,
      scrapeGeneric,
    ];

    for (const scraper of scrapers) {
      const result = scraper($);
      if (result.title && result.description) {
        return result;
      }
    }

    // Fallback: extract all text and use AI
    const bodyText = $("body").text().replace(/\s+/g, " ").trim();
    return await extractJobWithAI(bodyText, url);
  } catch (error) {
    console.error("Job scraping error:", error);
    throw new Error(
      "Failed to fetch job posting. Please paste the description manually.",
    );
  }
}

function scrapeLinkedIn($: cheerio.CheerioAPI): ScrapedJob {
  // LinkedIn specific selectors
  const title = $(".top-card-layout__title").text().trim();
  const company = $(".topcard__org-name-link").text().trim();
  const description = $(".show-more-less-html__markup").text().trim();

  return { title, company, description };
}

function scrapeIndeed($: cheerio.CheerioAPI): ScrapedJob {
  const title = $(".jobsearch-JobInfoHeader-title").text().trim();
  const company = $("[data-company-name]").text().trim();
  const description = $("#jobDescriptionText").text().trim();

  return { title, company, description };
}

function scrapeGreenhouse($: cheerio.CheerioAPI): ScrapedJob {
  const title = $(".app-title").text().trim();
  const company = $(".company-name").text().trim();
  const description = $("#content").text().trim();

  return { title, company, description };
}

function scrapeLever($: cheerio.CheerioAPI): ScrapedJob {
  const title = $(".posting-headline h2").text().trim();
  const company = $(".main-header-text a").text().trim();
  const description = $(".content .section-wrapper").text().trim();

  return { title, company, description };
}

function scrapeGeneric($: cheerio.CheerioAPI): ScrapedJob {
  // Try common HTML patterns
  const title =
    $("h1").first().text().trim() ||
    $('[class*="title"]').first().text().trim();

  const company =
    $('[class*="company"]').first().text().trim() ||
    $("title").text().split("|")[1]?.trim() ||
    "";

  const description =
    $('[class*="description"]').text().trim() ||
    $("main").text().trim() ||
    $("article").text().trim();

  return { title, company, description };
}

async function extractJobWithAI(
  text: string,
  url: string,
): Promise<ScrapedJob> {
  // Use OpenAI to extract structured data from unstructured text
  // Implementation similar to resume parser
  // Return extracted title, company, description
  throw new Error("Not implemented - AI extraction fallback");
}
```

---

### File: `lib/pdf-generator.ts`

```typescript
import { marked } from "marked";

export async function generateStyledPDF(
  markdown: string,
  type: "resume" | "cover_letter",
  metadata: { jobTitle: string; companyName: string },
): Promise<Buffer> {
  // Convert markdown to HTML
  const html = await marked.parse(markdown);

  // Apply beautiful CSS styling
  const styledHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page {
          size: A4;
          margin: 2cm;
        }
        body {
          font-family: 'Georgia', serif;
          font-size: 11pt;
          line-height: 1.6;
          color: #333;
        }
        h1 {
          font-size: 24pt;
          font-weight: bold;
          margin-bottom: 0.5em;
          color: #1a1a1a;
          border-bottom: 2px solid #4F46E5;
          padding-bottom: 0.3em;
        }
        h2 {
          font-size: 14pt;
          font-weight: bold;
          margin-top: 1.2em;
          margin-bottom: 0.6em;
          color: #4F46E5;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        h3 {
          font-size: 12pt;
          font-weight: bold;
          margin-top: 0.8em;
          margin-bottom: 0.4em;
        }
        p {
          margin: 0.5em 0;
        }
        ul {
          margin: 0.5em 0;
          padding-left: 1.5em;
        }
        li {
          margin: 0.3em 0;
        }
        strong {
          color: #1a1a1a;
        }
        a {
          color: #4F46E5;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `;

  // Use Puppeteer or similar to generate PDF
  // For now, return placeholder
  // In production: Use @react-pdf/renderer or puppeteer

  return Buffer.from(styledHtml);
}
```

---

## Component Architecture

### Main Page: `app/admin/job-assistant/page.tsx`

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { JobAssistantClient } from "@/components/admin/job-assistant/job-assistant-client";

export const metadata = {
  title: "Job Application Assistant | Upfolio",
  description: "Generate tailored resumes and cover letters with AI",
};

export default async function JobAssistantPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return <JobAssistantClient user={session.user} />;
}
```

---

### Main Client Component: `components/admin/job-assistant/job-assistant-client.tsx`

```typescript
"use client";

import { useState } from "react";
import { JobAssistantWizard } from "./job-assistant-wizard";
import { JobHistoryPanel } from "./job-history-panel";
import { AdminNavbar } from "@/components/admin/admin-navbar";

export function JobAssistantClient({ user }) {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [refreshHistory, setRefreshHistory] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <AdminNavbar user={user} currentPage="job-assistant" />

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* History Panel - Left Side */}
          <div className="lg:col-span-1">
            <JobHistoryPanel
              selectedId={selectedApplication?.id}
              onSelect={setSelectedApplication}
              refreshTrigger={refreshHistory}
            />
          </div>

          {/* Main Wizard - Right Side */}
          <div className="lg:col-span-2">
            <JobAssistantWizard
              initialData={selectedApplication}
              onSaved={() => setRefreshHistory((prev) => prev + 1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Token Credit System

### User Balance Display

Show in admin navbar or dashboard:

```tsx
<div className="flex items-center gap-2">
  <Zap className="w-4 h-4 text-yellow-500" />
  <span className="text-sm">{tokenCredits} credits</span>
</div>
```

### Deduction Logic

```typescript
// In generate API route
const cost = calculateTokenCost(generateResume, generateCoverLetter);

// Check balance
if (user.token_credits < cost) {
  return NextResponse.json(
    { error: "Insufficient credits. Please contact support." },
    { status: 402 },
  );
}

// Deduct tokens
await sql`
  UPDATE users 
  SET token_credits = token_credits - ${cost},
      tokens_used = tokens_used + ${cost}
  WHERE id = ${user.id}
`;
```

### Future: Token Purchase Flow

```typescript
// Pricing tiers (for future)
const PRICING = {
  starter: { credits: 50, price: 0 }, // Free tier
  pro: { credits: 500, price: 999 }, // $9.99
  unlimited: { credits: -1, price: 2999 }, // $29.99/month
};
```

---

## Implementation Phases

### Phase 1: Core Infrastructure (Day 1)

- [ ] Database migration script
- [ ] `lib/job-assistant.ts` - AI generation
- [ ] `lib/job-scraper.ts` - URL parsing
- [ ] API route: `generate`
- [ ] API route: `save`
- [ ] API route: `history`

### Phase 2: UI Components (Day 2)

- [ ] `job-assistant-wizard.tsx` - Main form
- [ ] `job-details-form.tsx` - URL/description input
- [ ] `markdown-editor.tsx` - Edit + preview
- [ ] `document-tabs.tsx` - Resume/CL switcher

### Phase 3: History & PDF (Day 2)

- [ ] `job-history-panel.tsx` - Saved list
- [ ] `lib/pdf-generator.ts` - PDF export
- [ ] API route: `export-pdf`
- [ ] Download functionality

### Phase 4: Polish (Day 3)

- [ ] Token credit UI
- [ ] Error handling & loading states
- [ ] Mobile responsive design
- [ ] Testing & bug fixes

---

## Success Metrics

- Time to generate tailored resume: < 30 seconds
- User satisfaction with AI quality: Manual review
- Save rate: % of generations that get saved
- Token usage per user: Track for pricing model

---

## Future Enhancements

1. **V2 Features:**

   - Multiple output formats (DOCX, LaTeX)
   - Template selection (minimalist, creative, corporate)
   - Interview prep questions generation
   - Skills gap analysis
   - LinkedIn profile optimization

2. **Premium Features:**
   - Unlimited generations
   - Priority AI processing
   - Custom branding on exports
   - Application tracking dashboard
   - Email reminders for follow-ups

---

## Notes

- All AI calls use GPT-4o for better quality
- Markdown editor should have autosave to localStorage
- PDF styling should match modern resume aesthetics
- Consider adding "Copy to LinkedIn" feature
- Token system ready for future monetization
