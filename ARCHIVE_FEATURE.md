# Archive Feature Implementation

## Overview

Added archive functionality to manage resume versions. This allows you to hide old versions from the main list while preserving them in the database.

## Features

### 1. Archive/Unarchive Versions

- Archive draft versions to declutter your version list
- Cannot archive published versions (must unpublish first)
- Easily unarchive when needed

### 2. Toggle View

- Default: Shows only active (non-archived) versions
- Toggle ON: Shows all versions including archived ones
- Counter shows active vs archived counts

### 3. Visual Indicators

- **Published**: Green border with checkmark badge
- **Draft**: Gray border with clock badge
- **Archived**: Orange border with archive badge, slightly transparent

## User Interface

### Archive Toggle

Located at the top of the versions list:

```
┌─────────────────────────────────────────────────┐
│ 🗄️ Show Archived Versions        [Toggle]     │
│    5 active, 3 archived                         │
└─────────────────────────────────────────────────┘
```

### Version Card Actions

Each version card now has:

- **Preview** (👁️) - View the version
- **Edit** (✏️) - Edit the version
- **Archive** (🗄️) - Archive the version (drafts only)
- **Unarchive** (📤) - Restore archived version
- **Publish** (button) - Publish the version (active drafts only)

## Business Rules

1. **Cannot archive published versions**

   - Must unpublish first, then archive
   - This prevents accidentally hiding the live version

2. **Cannot publish archived versions**

   - Must unarchive first, then publish
   - Ensures intentional publishing workflow

3. **Archived versions are hidden by default**
   - Keeps the main list clean
   - Toggle to view when needed

## Database Schema

### New Column

```sql
ALTER TABLE resume_data
ADD COLUMN is_archived BOOLEAN DEFAULT FALSE;
```

### New Index

```sql
CREATE INDEX idx_resume_archived ON resume_data(is_archived);
```

## API Endpoints

### GET `/api/admin/resume-versions`

Query parameters:

- `includeArchived`: boolean (default: false)

```typescript
// Fetch only active versions
GET /api/admin/resume-versions

// Fetch all versions including archived
GET /api/admin/resume-versions?includeArchived=true
```

### POST `/api/admin/archive-version`

Request body:

```json
{
  "versionId": 123,
  "action": "archive" | "unarchive"
}
```

Responses:

- **Success**: `{ success: true, message: "..." }`
- **Error**: Cannot archive published version
- **Error**: Unauthorized

## Files Modified

### Database

1. `lib/db/schema.sql` - Added `is_archived` column and index
2. `lib/db/queries.ts` - Added archive functions:
   - `getAllResumeVersions(includeArchived)` - Updated to filter by archived status
   - `archiveResumeVersion(versionId)` - Archive a version
   - `unarchiveResumeVersion(versionId)` - Unarchive a version

### API Routes

3. `app/api/admin/resume-versions/route.ts` - Added `includeArchived` query param
4. `app/api/admin/archive-version/route.ts` - New endpoint for archive/unarchive

### Components

5. `components/admin/resume-versions-list.tsx` - Added:
   - Archive toggle UI
   - Archive/unarchive buttons
   - Archived version styling
   - Counter for active vs archived

### Scripts

6. `scripts/migrate-add-archived.ts` - Migration script

## Migration Guide

### Step 1: Run Migration

```bash
# Add the is_archived column to your database
npx tsx scripts/migrate-add-archived.ts
```

### Step 2: Deploy Code

Deploy the updated code to your production environment.

### Step 3: Verify

1. Go to admin dashboard
2. Check that existing versions appear as active
3. Try archiving a draft version
4. Toggle to view archived versions

## Usage Examples

### Archive Old Versions

1. Go to Admin Dashboard
2. Find old draft versions you want to hide
3. Click the Archive button (🗄️)
4. Version moves to archived state

### View Archived Versions

1. Toggle "Show Archived Versions" ON
2. Archived versions appear with orange border
3. Can preview, edit, or unarchive them

### Unarchive a Version

1. Toggle "Show Archived Versions" ON
2. Find the archived version
3. Click the Unarchive button (📤)
4. Version returns to active state

### Workflow Example

```
Upload PDF → Draft (v1)
↓
Review → Archive old draft (v1)
↓
Upload new PDF → Draft (v2)
↓
Review → Publish (v2) ✅
↓
Upload another PDF → Draft (v3)
↓
Review → Archive (v3)
↓
Keep only published (v2) visible
```

## Benefits

### 1. Clean Version List

- Hide experimental or outdated versions
- Focus on relevant versions only
- Reduce clutter in admin panel

### 2. Preserve History

- Don't delete old versions
- Can always unarchive if needed
- Maintain complete audit trail

### 3. Better Organization

- Clear separation of active vs archived
- Easy to find current working versions
- Professional version management

### 4. Flexible Workflow

- Archive unsuccessful attempts
- Unarchive to reuse old content
- Iterate without losing history

## Error Handling

### Cannot Archive Published Version

```
Error: "Cannot archive a published version"
Solution: Unpublish the version first
```

### Cannot Publish Archived Version

```
Button disabled: Publish button only shows for active drafts
Solution: Unarchive the version first
```

## Future Enhancements

Potential improvements:

1. **Bulk Actions** - Archive multiple versions at once
2. **Auto-Archive** - Automatically archive versions older than X days
3. **Archive Reasons** - Add notes when archiving
4. **Restore Points** - Mark specific versions as important
5. **Soft Delete** - Add delete functionality with archive as intermediate step

## Testing Checklist

- [ ] Upload a PDF and create draft version
- [ ] Archive the draft version
- [ ] Verify it disappears from default view
- [ ] Toggle "Show Archived" ON
- [ ] Verify archived version appears with orange border
- [ ] Unarchive the version
- [ ] Verify it returns to normal draft state
- [ ] Try to archive a published version (should fail)
- [ ] Check that counter shows correct active/archived counts
- [ ] Test preview/edit on archived versions

## Technical Notes

### Performance

- Index on `is_archived` ensures fast filtering
- Default query only fetches active versions
- Minimal overhead for archive feature

### Data Integrity

- Archived flag is independent of published status
- Cannot accidentally lose published version
- All versions remain in database

### Backward Compatibility

- Migration adds column with default FALSE
- Existing versions treated as active
- No breaking changes to existing functionality
