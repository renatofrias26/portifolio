# Upfolio - AI Coding Agent Instructions

## Project Overview

**Upfolio** is a multi-user SaaS platform that transforms PDF resumes into beautiful portfolios using AI. Each user gets `/{username}` for their public portfolio. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS 4, and PostgreSQL.

## Critical Architecture Concepts

### Multi-User Data Isolation

- **Database schema**: `users` table with `username` (unique), `is_public`, `is_active`; `resume_data` table with `user_id` FK, `is_published`, `version`
- **Key queries**: Use helpers from `lib/db/queries.ts` - `getPublishedResumeByUsername()` for public profiles, `getPublishedResumeByUsernameForOwner()` for private profiles visible to owner
- **Privacy model**: Profiles are private by default. Public profiles require `is_public=true` AND `is_published=true` on resume. Owners can always view their own private profiles via session check
- **Version management**: Each user has independent version numbering (1, 2, 3...) with UNIQUE constraint on `(user_id, version)`

### Routing & Rendering Strategy

- **Public portfolios**: `app/[username]/page.tsx` with `dynamic = "force-dynamic"` to prevent caching privacy issues
- **Admin dashboard**: `app/admin/*` - all protected routes require authentication
- **API routes**: `app/api/resume/*` for uploads, parsing, versioning; `app/api/chat/*` for AI interactions
- **Metadata**: Dynamic `generateMetadata()` in `[username]/page.tsx` for SEO per user

### Authentication Flow

- NextAuth.js v4 with credentials provider (`lib/auth.ts`)
- Session includes: `id`, `email`, `name`, `username`
- Protected routes: Check session via `getServerSession(authOptions)` in server components
- User data: Always query by `user_id` from session, never trust client input for user identification

## Styling System - ALWAYS USE THIS

**Critical**: Import from `lib/styles.ts` for ALL new components. Never hardcode responsive classes.

```typescript
import {
  containerPadding,
  spacing,
  typography,
  buttons,
  cards,
} from "@/lib/styles";
```

- **Container padding**: `containerPadding.page`, `.card`, `.form`, `.modal`
- **Spacing**: `spacing.section`, `.component`, `.tight`, `.loose`
- **Typography**: `typography.h1`, `.h2`, `.body`, `.small`
- **Components**: `buttons.primary`, `buttons.secondary`, `cards.base`, `cards.interactive`
- **Mobile-first**: All styles pre-configured for responsive breakpoints

See `SHARED_STYLES_GUIDE.md` for complete reference. **Do NOT create custom responsive classes without checking this first.**

## AI Integration Patterns

### Resume Parsing

- **Entry point**: `app/api/resume/parse/route.ts` receives PDF upload
- **Parser**: `lib/resume-parser.ts` uses `pdf-parse-fork` + GPT-4o-mini
- **Output schema**: Strictly typed `ParsedResume` interface with `personal`, `experience`, `education`, `skills`, `projects`
- **Enhancement**: `app/api/resume/enhance-profile/route.ts` with `maxDuration = 30` for AI processing

### AI Chat

- Uses Vercel AI SDK (`ai` package) with streaming responses
- Context building: Includes resume data + `aiContext` string from user's data
- Implementation: See `components/sections/ai-chat-section.tsx` for client patterns

## Development Workflows

### Database Migrations

```bash
# Initial setup
npx tsx scripts/setup-db.ts

# Multi-user migration (if upgrading)
npx tsx scripts/migrate-multi-user.ts

# Add new columns (examples in scripts/migrate-add-*.ts)
npx tsx scripts/migrate-add-is-public.ts
```

**Pattern**: All migration scripts use `@vercel/postgres` with direct SQL. Always check for column existence before ALTER TABLE.

### Local Development

```bash
pnpm dev          # Start with Turbopack
pnpm build        # Production build with ESLint checks
pnpm lint         # Run ESLint manually
```

**Build failures**: Check for Next.js-specific rules:

- Use `<Link>` from `next/link`, never `<a href>` for internal navigation
- Remove unused imports (especially React hooks)
- Server components: No `useState`, `useEffect`, or event handlers

### Quick DB Queries (Testing)

```bash
# Toggle user public status
npx tsx -e "import { sql } from '@vercel/postgres'; import { config } from 'dotenv'; config({ path: '.env.local' }); (async () => { await sql\`UPDATE users SET is_public = true WHERE username = 'johndoe'\`; })();"
```

## Component Patterns

### Server Components (Default)

- Fetch data directly: `const session = await getServerSession(authOptions)`
- Use async functions for database queries
- Pass data to client components via props

### Client Components

- Mark with `"use client"` directive
- Use for: interactivity, hooks, animations (Framer Motion), browser APIs
- Example: `components/portfolio-page.tsx` - pure presentation with animations

### Page Structure

```tsx
// app/[username]/page.tsx pattern
export const dynamic = "force-dynamic";
export const revalidate = 60; // Optional ISR

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Dynamic meta tags per user
}

export default async function Page({ params }: Props) {
  const { username } = await params;
  const session = await getServerSession(authOptions);
  // Check ownership, fetch data, render
}
```

## Common Tasks

### Adding a New Profile Field

1. Add column via migration script in `scripts/`
2. Update `users` table or `resume_data.data` JSONB
3. Modify `lib/db/queries.ts` SELECT statements
4. Update TypeScript interfaces in `components/portfolio-page.tsx`
5. Add UI in `app/admin/profile/page.tsx` and public view

### Creating New Shared Styles

1. Add to `lib/styles.ts` following existing patterns
2. Export as const object with descriptive keys
3. Document in `SHARED_STYLES_GUIDE.md`
4. Use `clsx()` or `cn()` for conditional classes

### API Route Best Practices

- Export `runtime = "nodejs"` for Node-specific features
- Set `maxDuration` for long-running AI operations
- Return `Response` with proper status codes
- Validate session for protected endpoints
- Use Zod for request validation

## Brand & Content

- **Brand colors**: Purple → Blue → Cyan gradient (see `UPFOLIO_BRAND_GUIDE.md`)
- **Tagline**: "Upload. Share. Get hired."
- **Mission**: Simplify personal branding via AI-powered resume-to-portfolio transformation
- **Fonts**: Geist Sans + Geist Mono (via `next/font/google`)
- **Dark mode**: System preference detection in `app/layout.tsx` with script tag

## Environment Variables Required

```bash
POSTGRES_URL=              # Vercel Postgres or Neon
NEXTAUTH_SECRET=           # Random string for session encryption
NEXTAUTH_URL=              # http://localhost:3000 or production URL
OPENAI_API_KEY=            # For resume parsing and chat
BLOB_READ_WRITE_TOKEN=     # Vercel Blob for PDF storage
```

## Key Files Reference

- **Auth**: `lib/auth.ts` - NextAuth configuration
- **DB queries**: `lib/db/queries.ts` - All database helpers
- **Styles**: `lib/styles.ts` - Centralized design system
- **Resume parsing**: `lib/resume-parser.ts` - AI extraction logic
- **Public profile**: `app/[username]/page.tsx` - Username-based routing
- **Admin dashboard**: `app/admin/profile/page.tsx` - User settings
- **Architecture docs**: `docs/MULTI_USER_ARCHITECTURE.md`

## Testing & Debugging

- **ESLint**: Runs on build. Fix before committing.
- **Type checking**: TypeScript strict mode enabled
- **Database**: Use `console.table()` for quick query inspection
- **API testing**: Use `curl` or test routes in browser DevTools
- **Privacy testing**: Create test users with different `is_public` states

## Anti-Patterns to Avoid

❌ Hardcoding responsive classes instead of using `lib/styles.ts`  
❌ Querying users by username from client input without session validation  
❌ Using `<a>` tags for internal Next.js navigation  
❌ Forgetting `"use client"` directive when using React hooks  
❌ Caching public profiles without considering privacy changes (always use `dynamic = "force-dynamic"`)  
❌ Creating new components without checking existing section components in `components/sections/`
