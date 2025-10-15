# Sentry Implementation Checklist

## ✅ Completed

- [x] Install `@sentry/nextjs` package
- [x] Run Sentry setup wizard
- [x] Create Sentry project (upfolio-1x)
- [x] Configure server-side tracking (`sentry.server.config.ts`)
- [x] Configure edge tracking (`sentry.edge.config.ts`)
- [x] Configure client-side tracking (`instrumentation.ts`, `instrumentation-client.ts`)
- [x] Add global error handler (`app/global-error.tsx`)
- [x] Create test page (`/sentry-example-page`)
- [x] Create custom logger utility (`lib/logger.ts`)
- [x] Add example implementation (registration route)
- [x] Add auth token to `.env.sentry-build-plugin` (gitignored)

## 🔄 Next Steps

### 1. Test Your Setup (5 min)

```bash
# Start dev server
pnpm dev

# Visit test page
open http://localhost:3000/sentry-example-page

# Click the error buttons to test
# Check Sentry dashboard: https://upfolio-1x.sentry.io/
```

### 2. Add Logging to Key Routes (30 min)

#### Priority Routes to Update:

- [ ] **Resume Upload** - `app/api/resume/upload/route.ts`

  ```typescript
  logger.event(EventType.RESUME_UPLOAD, { userId, metadata: { filename } });
  ```

- [ ] **Resume Parsing** - `lib/resume-parser.ts`

  ```typescript
  logger.event(EventType.RESUME_PARSE_START, { userId });
  // ... on success
  logger.event(EventType.RESUME_PARSE_SUCCESS, { userId });
  ```

- [ ] **Profile Enhancement** - `app/api/resume/enhance-profile/route.ts`

  ```typescript
  logger.measurePerformance("Profile Enhancement", async () => { ... }, { userId });
  ```

- [ ] **Profile Publish** - `app/api/resume/publish/route.ts`

  ```typescript
  logger.event(EventType.PROFILE_PUBLISH, { userId, username });
  ```

- [ ] **Job Search** - `app/api/jobs/search/route.ts`

  ```typescript
  logger.event(EventType.JOB_SEARCH, { userId, metadata: { query } });
  ```

- [ ] **Email Verification** - `app/api/auth/verify-email/route.ts`
  ```typescript
  logger.event(EventType.EMAIL_VERIFIED, { userId, email });
  ```

### 3. Configure Production Environment (10 min)

#### Vercel Setup

1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add new variable:
   ```
   Name: SENTRY_AUTH_TOKEN
   Value: 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
   Environment: Production, Preview, Development
   ```
4. Redeploy

### 4. Set Up Alerts (15 min)

1. Go to Sentry dashboard → **Alerts**
2. Create these alerts:

   **High Error Rate**

   - Condition: More than 10 errors in 1 hour
   - Action: Email notification

   **New Issue**

   - Condition: New unique error appears
   - Action: Email notification

   **Performance Degradation**

   - Condition: P95 response time > 3 seconds
   - Action: Email notification

### 5. Review Dashboard Setup (5 min)

- [ ] Bookmark dashboard: https://upfolio-1x.sentry.io/
- [ ] Enable email notifications
- [ ] Install Sentry mobile app (optional)
- [ ] Set up Slack integration (optional)

### 6. Clean Up Test Page (Optional)

After verifying everything works:

```bash
# Remove test pages
rm app/sentry-example-page/page.tsx
rm app/api/sentry-example-api/route.ts
```

## Key Files Created

1. **Logger Utility**: `lib/logger.ts`

   - Centralized logging with Sentry integration
   - Event tracking for user actions
   - Performance monitoring

2. **Documentation**: `SENTRY_LOGGING_GUIDE.md`

   - Complete usage guide
   - Event types reference
   - Implementation examples

3. **Sentry Config Files** (auto-generated):

   - `sentry.server.config.ts`
   - `sentry.edge.config.ts`
   - `instrumentation.ts`
   - `instrumentation-client.ts`
   - `app/global-error.tsx`

4. **Example Implementation**: `app/api/auth/register/route.ts`
   - Shows logger usage in real route
   - Tracks user signups
   - Logs errors to Sentry

## Environment Variables

### Local (Already Configured)

```bash
# .env.sentry-build-plugin (GITIGNORED)
SENTRY_AUTH_TOKEN=sntrys_... # Auto-generated
```

### Production (Need to Add)

```bash
# Add to Vercel/deployment platform
SENTRY_AUTH_TOKEN=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
```

## Usage Examples

### Track User Signup

```typescript
logger.event(EventType.USER_SIGNUP, {
  userId: user.id,
  email: user.email,
  username: user.username,
});
```

### Log Error

```typescript
try {
  // ... operation
} catch (error) {
  logger.error("Operation failed", {
    userId,
    error,
    metadata: { context: "specific operation" },
  });
}
```

### Measure Performance

```typescript
const result = await logger.measurePerformance(
  "AI Resume Enhancement",
  async () => await enhanceResume(data),
  { userId },
);
```

## Benefits You're Getting

✅ **Error Tracking**

- Real-time alerts when errors occur
- Stack traces with source maps
- Know which users are affected

✅ **User Analytics**

- Track signups, logins, profile publishes
- See user journey before errors
- Session replay for debugging

✅ **Performance Monitoring**

- Track slow API routes
- Monitor AI operation times
- Database query performance

✅ **Production Debugging**

- Know when things break
- Full context for debugging
- No more "it works on my machine"

## Quick Reference

**Sentry Dashboard**: https://upfolio-1x.sentry.io/  
**Documentation**: See `SENTRY_LOGGING_GUIDE.md`  
**Logger Import**: `import { logger, EventType } from "@/lib/logger"`

## Notes

- Free tier: 5K errors/month (should be plenty for beta)
- Events are breadcrumbs (don't count against limit)
- Source maps uploaded automatically on build
- Session replay enabled (video-like error reproduction)
- Logs enabled (application logs sent to Sentry)

---

**Next**: Test the setup, then gradually add logging to your routes!
