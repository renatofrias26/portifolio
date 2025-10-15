# Sentry Error Tracking & Logging Guide

## Overview

Upfolio now uses **Sentry** for comprehensive error tracking, performance monitoring, and event logging. This gives you:

- ✅ Real-time error tracking with stack traces
- ✅ User context (know which user encountered an error)
- ✅ Performance monitoring
- ✅ Session replay (video-like reproduction of user sessions)
- ✅ Centralized logging utility

## Quick Start

### Testing Your Setup

1. **Start dev server**: `pnpm dev`
2. **Visit test page**: http://localhost:3000/sentry-example-page
3. **Click buttons** to trigger test errors
4. **Check Sentry dashboard**: https://upfolio-1x.sentry.io/

### Environment Variables

Already configured in `.env.sentry-build-plugin` (gitignored):

```bash
SENTRY_AUTH_TOKEN=sntrys_... # Auto-generated, DO NOT commit
```

For CI/CD, add this to your deployment platform (Vercel/GitHub Actions):

```bash
SENTRY_AUTH_TOKEN=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
```

## Using the Logger

### Import

```typescript
import { logger, EventType } from "@/lib/logger";
```

### Basic Logging

```typescript
// Information
logger.info("User profile updated successfully", {
  userId: user.id,
  username: user.username,
});

// Warning
logger.warn("Rate limit approaching", {
  userId: user.id,
  metadata: { requests: 95, limit: 100 },
});

// Error (automatically sent to Sentry)
logger.error("Failed to parse resume", {
  userId: user.id,
  error: error,
  metadata: { filename: file.name },
});

// Debug (only in development)
logger.debug("Processing resume data", {
  metadata: { step: "extraction" },
});
```

### Event Tracking

Track key user actions:

```typescript
// User signup
logger.event(EventType.USER_SIGNUP, {
  userId: user.id,
  email: user.email,
  username: user.username,
});

// Resume upload
logger.event(EventType.RESUME_UPLOAD, {
  userId: user.id,
  metadata: {
    filename: file.name,
    fileSize: file.size,
  },
});

// Profile publish
logger.event(EventType.PROFILE_PUBLISH, {
  userId: user.id,
  username: user.username,
  metadata: {
    version: resume.version,
  },
});

// Job search
logger.event(EventType.JOB_SEARCH, {
  userId: user.id,
  metadata: {
    query: searchParams.query,
    location: searchParams.location,
  },
});
```

### Performance Monitoring

Measure how long operations take:

```typescript
const result = await logger.measurePerformance(
  "Resume AI Enhancement",
  async () => {
    return await enhanceResumeWithAI(resumeData);
  },
  {
    userId: user.id,
    metadata: { resumeId: resume.id },
  },
);
```

## Implementation Examples

### API Route with Error Tracking

```typescript
// app/api/resume/upload/route.ts
import { logger, EventType } from "@/lib/logger";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  try {
    logger.event(EventType.RESUME_UPLOAD, {
      userId: session.user.id,
      username: session.user.username,
    });

    const formData = await req.formData();
    const file = formData.get("file") as File;

    // Process upload...

    logger.info("Resume uploaded successfully", {
      userId: session.user.id,
      metadata: { filename: file.name },
    });

    return Response.json({ success: true });
  } catch (error) {
    logger.error("Resume upload failed", {
      userId: session.user.id,
      error,
      metadata: { filename: file?.name },
    });

    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
```

### Server Component with User Context

```typescript
// app/admin/profile/page.tsx
import { logger, EventType } from "@/lib/logger";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  logger.event(EventType.PROFILE_VIEW, {
    userId: session.user.id,
    username: session.user.username,
  });

  // Rest of component...
}
```

### AI Operations with Performance Tracking

```typescript
// lib/resume-parser.ts
import { logger, EventType } from "@/lib/logger";

export async function parseResume(file: File, userId: string) {
  logger.event(EventType.RESUME_PARSE_START, {
    userId,
    metadata: { filename: file.name },
  });

  try {
    const result = await logger.measurePerformance(
      "Resume parsing",
      async () => {
        // PDF parsing + AI extraction
        return await performParsing(file);
      },
      { userId },
    );

    logger.event(EventType.RESUME_PARSE_SUCCESS, {
      userId,
      metadata: {
        filename: file.name,
        sectionsFound: Object.keys(result).length,
      },
    });

    return result;
  } catch (error) {
    logger.event(EventType.RESUME_PARSE_ERROR, {
      userId,
      error,
      metadata: { filename: file.name },
    });
    throw error;
  }
}
```

## Event Types Available

### User Events

- `USER_SIGNUP` - New user registration
- `USER_LOGIN` - User login
- `USER_LOGOUT` - User logout
- `USER_DELETE` - Account deletion
- `EMAIL_VERIFIED` - Email verification completed
- `PASSWORD_RESET` - Password reset

### Resume Events

- `RESUME_UPLOAD` - PDF upload
- `RESUME_PARSE_START/SUCCESS/ERROR` - AI parsing lifecycle
- `RESUME_ENHANCE_START/SUCCESS/ERROR` - Profile enhancement

### Profile Events

- `PROFILE_PUBLISH` - Resume version published
- `PROFILE_UNPUBLISH` - Resume unpublished
- `PROFILE_VIEW` - Profile page viewed
- `PROFILE_MADE_PUBLIC/PRIVATE` - Privacy changes

### Job Assistant Events

- `JOB_SEARCH` - Job search performed
- `JOB_SAVE` - Job saved
- `JOB_APPLY` - Job application tracked
- `JOB_FIT_ANALYSIS` - AI job fit analysis

### AI Events

- `AI_CHAT_MESSAGE` - Chat interaction
- `AI_ERROR` - AI service error

### System Events

- `DATABASE_ERROR` - Database failures
- `API_ERROR` - API failures
- `RATE_LIMIT_EXCEEDED` - Rate limiting

## Sentry Dashboard

### Accessing Your Dashboard

URL: **https://upfolio-1x.sentry.io/**

### Key Features

1. **Issues**: View all errors grouped by type
2. **Performance**: Monitor API response times, slow queries
3. **Session Replay**: Watch user sessions leading to errors
4. **Releases**: Track which version introduced bugs
5. **Alerts**: Set up notifications for critical errors

### Setting Up Alerts

1. Go to **Alerts** → **Create Alert**
2. Choose conditions:
   - New issue created
   - Error count exceeds X in Y minutes
   - Performance degradation
3. Set notification channel (email, Slack, etc.)

## Best Practices

### ✅ DO

- Log all user signups and important events
- Track errors with full context (userId, metadata)
- Use `measurePerformance()` for AI operations
- Add user context to errors
- Log API failures with request details

### ❌ DON'T

- Log sensitive data (passwords, tokens)
- Log PII without user consent
- Over-log in tight loops (causes noise)
- Ignore error handling to "see it in Sentry"

## Production Deployment

### Vercel Setup

1. **Add environment variable**:

   ```
   Settings → Environment Variables → Add
   SENTRY_AUTH_TOKEN=sntrys_...
   ```

2. **Redeploy** to enable source maps upload

### Source Maps

Source maps are automatically uploaded on build, allowing you to see:

- Original TypeScript file names
- Exact line numbers
- Readable stack traces

## Monitoring Checklist

- [ ] Check Sentry dashboard daily for new errors
- [ ] Set up alerts for critical errors (>10 errors/hour)
- [ ] Review performance metrics weekly
- [ ] Watch session replays for UX issues
- [ ] Track user signup trends
- [ ] Monitor AI parsing success rates

## Troubleshooting

### Errors Not Appearing in Sentry

1. Check `.env.sentry-build-plugin` exists
2. Verify `SENTRY_AUTH_TOKEN` in production
3. Check Sentry DSN in config files
4. Restart dev server

### Too Many Events

Sentry free tier: **5K errors/month**

To stay within limits:

- Filter out non-critical errors
- Use sampling in `sentry.server.config.ts`
- Focus on production environments

## Example: Track All User Signups

```typescript
// app/api/auth/signup/route.ts
import { logger, EventType } from "@/lib/logger";

// After successful signup
logger.event(EventType.USER_SIGNUP, {
  userId: newUser.id,
  email: newUser.email,
  username: newUser.username,
  metadata: {
    signupMethod: "credentials",
    timestamp: new Date().toISOString(),
  },
});
```

Now in Sentry:

1. Go to **Performance** → **User Misery**
2. See which users had errors during signup
3. Watch their session replay to debug

## Next Steps

1. ✅ Test error tracking: Visit `/sentry-example-page`
2. ⬜ Add logging to existing API routes
3. ⬜ Set up Slack/email alerts in Sentry
4. ⬜ Review dashboard weekly
5. ⬜ Consider adding PostHog for product analytics

---

**Questions?** Check Sentry docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/
