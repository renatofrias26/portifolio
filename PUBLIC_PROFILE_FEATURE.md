# Public Profile Feature

## Overview

Added a public/private profile toggle feature that allows users to control whether their portfolio is visible in the profiles directory and accessible to the public.

## Changes Made

### 1. Database Migration

**File:** `scripts/migrate-add-is-public.ts`

- Added `is_public` boolean column to the `users` table
- Defaults to `true` for backward compatibility
- Created an index on `is_public` for better query performance
- All existing users are automatically set to public

**Run migration:**

```bash
npx tsx scripts/migrate-add-is-public.ts
```

### 2. Registration Flow

**File:** `app/admin/register/page.tsx`

- Added `isPublic` field to the registration form (defaults to `true`)
- Included a checkbox with clear explanation:
  - What making profile public means
  - Where the profile will appear
  - Ability to change later in settings
- Link to the Profiles Directory for context

**File:** `app/api/auth/register/route.ts`

- Updated to accept and save the `isPublic` preference during registration
- Stores the preference in the database when creating new users

### 3. Profile Settings

**File:** `app/admin/profile/page.tsx`

Added a new "Privacy Settings" section with:

- Checkbox to toggle public/private status
- Clear description of what the setting does
- Located after Social Links section for easy access
- Updates are saved when user clicks "Save Changes"

**File:** `app/api/admin/profile/route.ts`

- GET endpoint now returns `isPublic` status
- PUT endpoint accepts and updates `isPublic` field
- Profile updates include privacy setting changes

### 4. Public Profile Filtering

**File:** `lib/db/queries.ts`

Updated `getPublishedResumeByUsername()` to filter by:

- `is_active = true`
- `is_public = true` (NEW)
- `is_published = true`

**File:** `app/profiles/page.tsx`

Updated profile listing query to only show public profiles:

- Added `u.is_public = true` to WHERE clause
- Only public, active, published profiles appear in directory

**File:** `app/[username]/page.tsx`

- Uses `getPublishedResumeByUsername()` which automatically filters by public status
- Private profiles will show 404 page when accessed via username URL

## User Experience

### For New Users (Registration)

1. User fills out registration form
2. Sees checkbox: "Make my profile public" (checked by default)
3. Clear explanation of what this means
4. Can uncheck to create a private profile from the start

### For Existing Users (Settings)

1. Navigate to Admin → Profile
2. Scroll to "Privacy Settings" section (after Social Links)
3. Toggle "Public Profile" checkbox
4. Read description of what happens when enabled/disabled
5. Click "Save Changes" to update

### Privacy Behavior

**When Profile is Public (`is_public = true`):**

- ✅ Appears in the Profiles Directory (`/profiles`)
- ✅ Accessible via username URL (`/username`)
- ✅ Searchable and discoverable by anyone
- ✅ Visible to the public when resume is published

**When Profile is Private (`is_public = false`):**

- ❌ Does NOT appear in Profiles Directory
- ❌ Username URL shows 404 (Not Found)
- ❌ Not searchable or discoverable
- ✅ Only visible when logged in as the owner

## Database Schema

```sql
ALTER TABLE users
ADD COLUMN is_public BOOLEAN DEFAULT true;

CREATE INDEX idx_users_public
ON users(is_public)
WHERE is_public = true;
```

## API Updates

### GET /api/admin/profile

Response now includes:

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "username": "johndoe",
    "isPublic": true,
    ...
  }
}
```

### PUT /api/admin/profile

Accepts `isPublic` in request body:

```json
{
  "name": "John Doe",
  "username": "johndoe",
  "isPublic": false,
  "profileData": { ... }
}
```

### POST /api/auth/register

Accepts `isPublic` in request body:

```json
{
  "email": "user@example.com",
  "password": "password",
  "username": "johndoe",
  "isPublic": true,
  ...
}
```

## Security Considerations

1. **Default to Public:** New users are public by default to encourage discovery, but can opt-out
2. **Explicit Consent:** Users must actively choose their privacy setting during registration
3. **Easy Toggle:** Can change at any time in profile settings
4. **Proper Filtering:** All queries properly filter by `is_public` status
5. **404 for Private:** Private profiles return 404 instead of revealing they exist

## Testing Checklist

- [ ] New user registration with public profile (default)
- [ ] New user registration with private profile (unchecked)
- [ ] Toggle public/private in profile settings
- [ ] Public profile appears in `/profiles` directory
- [ ] Private profile does NOT appear in `/profiles` directory
- [ ] Public profile accessible via `/username` URL
- [ ] Private profile shows 404 via `/username` URL
- [ ] Profile search filters work correctly
- [ ] Migration runs successfully on existing database

## Future Enhancements

Potential improvements for later:

1. **Partial Privacy:** Allow hiding from directory but keeping direct link accessible
2. **Analytics:** Show users how many profile views they're getting
3. **Profile Visibility Badges:** Show "Public" or "Private" badge in admin panel
4. **Bulk Operations:** Admin tools to manage public/private status of multiple users
5. **Privacy Stats:** Dashboard showing public vs private profile statistics

## Migration Notes

- ✅ Migration completed successfully
- ✅ All existing users set to public by default
- ✅ No breaking changes
- ✅ Backward compatible
- ✅ Zero downtime migration

## Files Modified

1. `scripts/migrate-add-is-public.ts` (NEW)
2. `app/admin/register/page.tsx`
3. `app/api/auth/register/route.ts`
4. `app/admin/profile/page.tsx`
5. `app/api/admin/profile/route.ts`
6. `lib/db/queries.ts`
7. `app/profiles/page.tsx`

## Related Documentation

- See `MULTI_USER_COMPLETE.md` for multi-user architecture
- See `PROFILE_ENHANCEMENT_DEBUG.md` for profile data structure
- See `PROFILES_PAGE_SUMMARY.md` for profiles directory features
