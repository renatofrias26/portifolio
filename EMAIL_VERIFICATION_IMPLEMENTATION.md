# Email Verification Implementation - Upfolio

**Status**: ✅ Complete  
**Date**: January 2025  
**Priority**: HIGH - Prevents spam accounts and verifies user emails

## Overview

Complete email verification system implemented for Upfolio. Users must verify their email address after registration. Existing users were automatically marked as verified during migration.

---

## Database Schema Changes

### New Columns in `users` Table

```sql
-- Email verification status (boolean, default false)
email_verified BOOLEAN NOT NULL DEFAULT false

-- Verification token (hashed, 255 chars)
verification_token VARCHAR(255)

-- Token expiration timestamp
verification_token_expires TIMESTAMP WITH TIME ZONE
```

### Indexes Created

```sql
-- Fast lookup for verification tokens
CREATE INDEX idx_users_verification_token ON users(verification_token);

-- Fast lookup for expired tokens cleanup
CREATE INDEX idx_users_verification_token_expires ON users(verification_token_expires);
```

### Migration Script

Location: `scripts/migrate-add-email-verification.ts`

**Features**:

- Checks for existing columns before adding
- Creates both columns and indexes
- Safe to run multiple times
- Auto-verifies existing users in separate script

---

## API Routes

### 1. Send Verification Email

**Endpoint**: `POST /api/auth/send-verification`  
**Auth**: Required (JWT session)  
**Purpose**: Send or resend verification email to logged-in user

**Request**: None (uses session email)

**Response**:

```json
{
  "message": "Verification email sent. Please check your inbox."
}
```

**Error Responses**:

- `401` - Not authenticated
- `400` - Email already verified
- `400` - No email on account
- `500` - Server error

**Security**:

- Rate limiting ready (30-second cooldown recommended)
- Tokens expire in 24 hours
- 32-byte cryptographically secure random tokens

### 2. Verify Email

**Endpoint**: `POST /api/auth/verify-email`  
**Auth**: Not required (uses token)  
**Purpose**: Verify email address with token from email link

**Request Body**:

```json
{
  "token": "abc123..."
}
```

**Response**:

```json
{
  "message": "Email verified successfully!"
}
```

**Error Responses**:

- `400` - Missing token
- `400` - Invalid or expired token
- `500` - Server error

**Security**:

- One-time use tokens (deleted after verification)
- Time-based expiration (24 hours)
- Secure token generation with crypto.randomBytes()

---

## Email Templates

Location: `lib/email.ts`

### 1. Verification Email Template

```typescript
sendVerificationEmail(email: string, token: string)
```

**Content**:

- Professional branded design
- Clear call-to-action button
- Verification link with token
- 24-hour expiration notice
- Security warning about not requesting

**Link Format**:

```
https://upfolio.app/admin/verify-email?token={token}
```

### 2. Email Verified Confirmation

```typescript
sendEmailVerifiedConfirmation(email: string)
```

**Content**:

- Success confirmation
- Account security notice
- Contact support option

---

## User Interface

### 1. Verification Banner

**Component**: `components/admin/email-verification-banner.tsx`  
**Location**: Profile page, Dashboard  
**Purpose**: Remind unverified users to verify email

**Features**:

- Only shows if `!session.user.emailVerified`
- Framer Motion animations
- Gradient background (purple → blue)
- "Verify Email" and "Resend Email" buttons
- Success toast on send
- Uses shared styles from `lib/styles.ts`

**States**:

- Hidden for verified users
- Visible for unverified users
- Loading state during send
- Success feedback via toast

### 2. Verification Page

**Route**: `/admin/verify-email`  
**Purpose**: Landing page for email verification links

**Features**:

- Auto-extracts token from URL params
- Auto-verifies on page load
- Shows success/error states
- Redirect to profile after 3 seconds on success
- Animated transitions
- Responsive design

**Flow**:

1. User clicks email link
2. Page loads, extracts token
3. Auto-calls `/api/auth/verify-email`
4. Shows success message
5. Redirects to `/admin/profile` after 3 seconds

---

## User Flows

### New User Registration Flow

1. User registers at `/admin/register`
2. Account created with `email_verified = false`
3. Verification email sent automatically
4. User receives email with verification link
5. User clicks link → redirected to `/admin/verify-email?token=...`
6. Email verified, `email_verified` set to `true`
7. Token and expiration cleared from database
8. Success message displayed
9. Auto-redirect to profile

### Resend Verification Flow

1. User logs in, sees verification banner
2. Clicks "Resend Email" button
3. New token generated, old one replaced
4. Email sent with new link
5. Success toast displayed
6. Continues from step 4 above

### Existing Users Migration

All existing users were automatically verified via:

```bash
npx tsx scripts/verify-existing-users.ts
```

**Logic**: Users who existed before email verification feature are trusted, so marked as verified.

---

## Session Management

### NextAuth Integration

**Type Extensions** (`types/next-auth.d.ts`):

```typescript
interface User {
  emailVerified?: boolean;
}

interface Session {
  user: {
    emailVerified?: boolean;
  };
}
```

**JWT Callback** (`lib/auth.ts`):

```typescript
async jwt({ token, user }) {
  if (user) {
    token.emailVerified = typeof user.emailVerified === 'boolean'
      ? user.emailVerified
      : false;
  }
  // Refresh from DB if not in token
  if (token.id && token.emailVerified === undefined) {
    const result = await sql`
      SELECT email_verified FROM users WHERE id = ${token.id}
    `;
    token.emailVerified = result.rows[0]?.email_verified || false;
  }
}
```

**Session Callback**:

```typescript
async session({ session, token }) {
  if (session.user) {
    session.user.emailVerified = token.emailVerified as boolean;
  }
  return session;
}
```

### Real-Time Updates

- New logins get latest `emailVerified` status
- After verification, user must refresh/re-login to see banner disappear
- Future enhancement: WebSocket or polling for instant updates

---

## Security Considerations

### Token Generation

- Uses `crypto.randomBytes(32).toString('hex')` (64-char hex string)
- Cryptographically secure random generation
- 256 bits of entropy

### Token Storage

- Stored in database (consider hashing in future for extra security)
- Indexed for fast lookup
- Deleted after successful verification

### Token Expiration

- 24-hour lifetime
- Checked on verification attempt
- Expired tokens automatically rejected
- Future cleanup job recommended

### Rate Limiting

**TODO**: Implement rate limiting on:

- `/api/auth/send-verification` - 1 request per 30 seconds per user
- `/api/auth/verify-email` - 5 attempts per 10 minutes per IP

### Email Security

- Verification links only work once
- No sensitive data in email (only token)
- Warning about phishing in email template
- HTTPS-only links in production

---

## Email Service Configuration

### Resend Setup

**Environment Variable**:

```bash
RESEND_API_KEY=re_...
```

**Sender Configuration** (`lib/email.ts`):

```typescript
from: "Upfolio <noreply@upfolio.app>";
```

**Development Mode**:

- Email service gracefully degrades if `RESEND_API_KEY` missing
- Logs error to console
- Returns success to avoid blocking registration
- Tokens still generated for testing

**Production Requirements**:

1. Set `RESEND_API_KEY` in environment
2. Verify domain with Resend
3. Configure SPF/DKIM records
4. Test email deliverability

---

## Testing Checklist

### Registration Flow

- [ ] New user registers
- [ ] Verification email sent automatically
- [ ] Email contains correct link with token
- [ ] Token has 24-hour expiration
- [ ] User can't access verified-only features

### Verification Flow

- [ ] Click link from email
- [ ] Redirected to `/admin/verify-email`
- [ ] Success message displayed
- [ ] `email_verified` set to `true` in database
- [ ] Token deleted from database
- [ ] Auto-redirect to profile after 3 seconds

### Resend Flow

- [ ] Unverified user sees banner on profile
- [ ] Click "Resend Email" button
- [ ] New email sent with new token
- [ ] Old token replaced in database
- [ ] Success toast displayed
- [ ] Can verify with new link

### Error Cases

- [ ] Expired token shows error message
- [ ] Invalid token shows error message
- [ ] Already verified user sees no banner
- [ ] Missing email in account handled gracefully
- [ ] Email service failure doesn't block registration

### Session Updates

- [ ] Verified status appears in session after login
- [ ] Banner disappears after verification + re-login
- [ ] `session.user.emailVerified` accessible in components

### Existing Users

- [ ] All existing users marked as verified
- [ ] Existing users see no verification banner
- [ ] No verification emails sent to existing users

---

## File Changes Summary

### Created Files

1. `scripts/migrate-add-email-verification.ts` - Database migration
2. `scripts/verify-existing-users.ts` - Auto-verify existing users
3. `app/api/auth/send-verification/route.ts` - Send/resend email API
4. `app/api/auth/verify-email/route.ts` - Verify token API
5. `app/admin/verify-email/page.tsx` - Verification landing page
6. `components/admin/email-verification-banner.tsx` - Verification reminder UI

### Modified Files

1. `lib/auth.ts` - Added `emailVerified` to JWT/session callbacks
2. `types/next-auth.d.ts` - Added `emailVerified` type definitions
3. `lib/email.ts` - Added verification email templates
4. `app/api/auth/register/route.ts` - Send verification on registration
5. `app/admin/profile/page.tsx` - Added verification banner

---

## Future Enhancements

### Priority 1: Rate Limiting

- Implement request throttling on send verification endpoint
- Prevent abuse and spam
- Use Redis or in-memory cache

### Priority 2: Token Cleanup Job

- Cron job to delete expired tokens
- Run daily via Vercel Cron or similar
- Query: `DELETE FROM users WHERE verification_token_expires < NOW()`

### Priority 3: Real-Time Session Updates

- WebSocket or polling to update session without re-login
- Instant banner removal after verification
- Better UX

### Priority 4: Email Preferences

- Allow users to opt out of certain emails
- Required emails (verification) vs optional (marketing)
- Preference center in profile

### Priority 5: Enhanced Security

- Hash verification tokens before database storage
- Use bcrypt or similar
- Adds extra layer if database compromised

---

## Troubleshooting

### Email Not Received

1. Check spam/junk folder
2. Verify `RESEND_API_KEY` is set
3. Check Resend dashboard for delivery status
4. Verify domain DNS records (SPF, DKIM)
5. Use "Resend Email" button

### Token Expired

- Tokens expire after 24 hours
- Use "Resend Email" to get new token
- No limit on resends (until rate limiting added)

### Banner Not Disappearing

- User must log out and log back in
- Session needs to refresh from database
- Future: Real-time updates will fix this

### Database Errors

- Check Postgres connection
- Verify columns exist: `email_verified`, `verification_token`, `verification_token_expires`
- Re-run migration if needed: `npx tsx scripts/migrate-add-email-verification.ts`

---

## Related Documentation

- [Password Reset Implementation](./PASSWORD_RESET_IMPLEMENTATION.md)
- [Auth & Database Assessment](./AUTH_DATABASE_ASSESSMENT.md)
- [Multi-User Architecture](./docs/MULTI_USER_ARCHITECTURE.md)
- [User Guide](./docs/USER_GUIDE.md)

---

## Migration Commands

```bash
# Run email verification migration
npx tsx scripts/migrate-add-email-verification.ts

# Verify existing users
npx tsx scripts/verify-existing-users.ts

# Check database schema
npx tsx -e "import { sql } from '@vercel/postgres'; import { config } from 'dotenv'; config({ path: '.env.local' }); (async () => { const result = await sql\`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users' AND column_name IN ('email_verified', 'verification_token', 'verification_token_expires')\`; console.table(result.rows); })();"

# View unverified users
npx tsx -e "import { sql } from '@vercel/postgres'; import { config } from 'dotenv'; config({ path: '.env.local' }); (async () => { const result = await sql\`SELECT id, email, email_verified FROM users WHERE email_verified = false\`; console.table(result.rows); })();"
```

---

**Implementation Complete**: All code, database migrations, API routes, UI components, and documentation finished. Ready for production after rate limiting implementation.
