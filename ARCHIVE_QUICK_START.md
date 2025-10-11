# Archive Feature - Quick Start

## What's New? 🎉

Added the ability to **archive old resume versions** to keep your version list clean while preserving history.

## Quick Actions

### Archive a Version

1. Go to Admin Dashboard
2. Find a draft version
3. Click the **Archive** button (🗄️)
4. Version is hidden from default view

### View Archived Versions

1. Toggle **"Show Archived Versions"** ON
2. Archived versions appear with orange border
3. Toggle OFF to hide them again

### Unarchive a Version

1. Toggle "Show Archived Versions" ON
2. Find the archived version (orange)
3. Click **Unarchive** button (📤)
4. Version returns to active state

## Installation

### Step 1: Run Migration

```bash
npx tsx scripts/migrate-add-archived.ts
```

This adds the `is_archived` column to your database.

### Step 2: Deploy

Deploy the updated code to your environment.

### Step 3: Test

Try archiving and unarchiving versions in the admin panel.

## Key Rules

✅ **Can Archive**: Draft (unpublished) versions
❌ **Cannot Archive**: Published versions (unpublish first)
✅ **Can Unarchive**: Any archived version
❌ **Cannot Publish**: Archived versions (unarchive first)

## Files to Review

- **Full Documentation**: `ARCHIVE_FEATURE.md`
- **Visual Guide**: `ARCHIVE_VISUAL_GUIDE.md`
- **Migration Script**: `scripts/migrate-add-archived.ts`
- **Schema Changes**: `lib/db/schema.sql`

## Questions?

See the detailed documentation in `ARCHIVE_FEATURE.md` for complete information about:

- API endpoints
- Database schema
- Business rules
- Error handling
- Testing checklist
