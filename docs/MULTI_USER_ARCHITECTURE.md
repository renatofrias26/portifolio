# Multi-User Portfolio System

This document describes the multi-user architecture of the portfolio application.

## Overview

The system now supports multiple users, where each user can:

- Create their own account with a unique username
- Upload and manage their own resume versions
- Publish their portfolio at a custom URL (`/username`)
- Keep all data isolated from other users

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  username VARCHAR(100) UNIQUE NOT NULL,
  profile_data JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Key Fields:**

- `username`: Public username used for portfolio URL (e.g., `/johndoe`)
- `profile_data`: JSONB field for additional profile information (bio, social links, etc.)
- `is_active`: Allows soft-deletion/deactivation of user accounts

### Resume Data Table

```sql
CREATE TABLE resume_data (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  data JSONB NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, version)
);
```

**Key Changes:**

- `user_id`: Foreign key to users table (replaces `created_by`)
- `UNIQUE(user_id, version)`: Each user has their own version numbering (1, 2, 3...)
- `ON DELETE CASCADE`: When a user is deleted, all their resumes are deleted

## Migration

To migrate your existing database to support multiple users:

```bash
npx tsx scripts/migrate-multi-user.ts
```

This migration script will:

1. Add new columns to the users table (`username`, `profile_data`, `is_active`)
2. Generate usernames for existing users from their email addresses
3. Add `user_id` column to resume_data table
4. Link existing resumes to their creators
5. Reset version numbering per user
6. Create new indexes for performance
7. Add foreign key constraints

## API Routes

### Public Routes

#### `GET /api/resume?username={username}`

Fetches the published resume for a specific user.

**Response:**

```json
{
  "success": true,
  "data": {
    /* resume data */
  },
  "version": 3,
  "pdfUrl": "https://...",
  "updatedAt": "2025-10-11T...",
  "user": {
    "name": "John Doe",
    "username": "johndoe",
    "profile": {
      /* profile data */
    }
  }
}
```

### Authenticated Routes (Admin Panel)

All admin routes require authentication and automatically filter data by the logged-in user.

#### `GET /api/admin/profile`

Get current user's profile information.

#### `PUT /api/admin/profile`

Update current user's profile.

**Body:**

```json
{
  "name": "John Doe",
  "username": "johndoe",
  "profileData": {
    "bio": "...",
    "socialLinks": {}
  }
}
```

#### `GET /api/admin/resume-versions?includeArchived=false`

Get all resume versions for the current user.

#### `POST /api/admin/upload-resume`

Upload a new resume PDF (creates a new version for the current user).

#### `GET /api/admin/resume-data/{id}`

Get resume data for a specific version (verifies user ownership).

#### `PUT /api/admin/update-resume/{id}`

Update resume data for a specific version (verifies user ownership).

#### `POST /api/admin/publish-version`

Publish a specific resume version (verifies user ownership).

**Body:**

```json
{
  "versionId": 123
}
```

#### `POST /api/admin/archive-version`

Archive/unarchive a resume version (verifies user ownership).

**Body:**

```json
{
  "versionId": 123,
  "action": "archive" // or "unarchive"
}
```

## Data Isolation

Every API route that accesses resume data includes user verification:

```typescript
const userId = parseInt(session.user.id);
const resume = await getResumeDataById(versionId, userId);
```

This ensures users can only access their own data.

## Public Portfolio URLs

Each user's published portfolio is accessible at:

```
https://yourdomain.com/{username}
```

For example:

- `https://yourdomain.com/johndoe`
- `https://yourdomain.com/janedoe`

The route automatically:

- Fetches the user's published resume
- Returns 404 if user doesn't exist or has no published resume
- Generates SEO-friendly metadata
- Caches the page with ISR (Incremental Static Regeneration)

## Username Requirements

Usernames must:

- Be 3-30 characters long
- Contain only lowercase letters, numbers, hyphens, and underscores
- Be unique across all users

Regex: `/^[a-z0-9_-]{3,30}$/`

## Database Indexes

The following indexes are created for optimal performance:

```sql
CREATE INDEX idx_resume_user_id ON resume_data(user_id);
CREATE INDEX idx_resume_user_published ON resume_data(user_id, is_published) WHERE is_published = true;
CREATE INDEX idx_resume_user_archived ON resume_data(user_id, is_archived);
CREATE INDEX idx_resume_user_version ON resume_data(user_id, version DESC);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

## Next Steps

1. **User Registration**: Add a signup flow for new users
2. **Username Customization**: Allow users to change their username from the admin panel
3. **Profile Customization**: Add UI for managing `profile_data` (bio, social links, theme preferences)
4. **Custom Domains**: Allow users to connect custom domains to their portfolio
5. **Analytics**: Track views and interactions per user
6. **Themes**: Allow users to choose different portfolio themes/layouts

## Security Considerations

- All admin routes require authentication via NextAuth
- User IDs are stored in JWT tokens
- Database queries include user ID verification
- Foreign key constraints prevent orphaned data
- Soft deletion support via `is_active` flag
- SQL injection protection via parameterized queries

## Testing

After migration, test the following:

1. ✅ User can only see their own resume versions
2. ✅ User can only edit their own resumes
3. ✅ Publishing a resume only affects the user's portfolio
4. ✅ Version numbering is per-user (not global)
5. ✅ Public portfolio URLs work correctly
6. ✅ 404 pages show for non-existent usernames
7. ✅ Profile updates only affect the current user

## Rollback

If you need to rollback the migration, you can:

1. Drop the new columns and constraints
2. Restore the old index structure
3. Revert the API route changes

However, it's recommended to backup your database before migrating.
