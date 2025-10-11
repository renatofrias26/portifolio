# 🧪 Testing Guide: Version Management

## Prerequisites

Make sure you have:

- ✅ Neon database set up and running
- ✅ Vercel Blob storage configured
- ✅ OpenAI API key in `.env.local`
- ✅ `pnpm dev` running

## Test Scenario: Complete Workflow

### Test 1: First Upload

1. **Login**:

   - Go to: http://localhost:3000/admin/login
   - Email: `admin@portfolio.com`
   - Password: `changeme123`

2. **Upload First Resume**:

   - Should land on "Upload Resume" tab
   - Drag & drop a PDF resume (or click to browse)
   - Click "Upload & Parse with AI"
   - Wait ~10-30 seconds

3. **Verify Auto-Switch**:

   - ✅ Should automatically switch to "Manage Versions" tab
   - ✅ Should see "Version 1" card
   - ✅ Badge should say "Draft" (gray with clock icon)
   - ✅ Should show creation timestamp
   - ✅ Should show "View PDF" link
   - ✅ Should see Preview, Edit, and Publish buttons

4. **Verify PDF Link**:
   - Click "View PDF"
   - ✅ Should open PDF in new tab
   - ✅ Should be the correct file you uploaded

### Test 2: Publish Version

1. **Publish Version 1**:

   - Click "Publish" button on Version 1
   - Wait for request to complete

2. **Verify Published Status**:
   - ✅ Badge changes to "Published" (green with check icon)
   - ✅ "Publish" button disappears
   - ✅ Card has green border/background

### Test 3: Upload Second Version

1. **Switch to Upload Tab**:

   - Click "Upload Resume" tab

2. **Upload Different Resume**:

   - Upload a different PDF file
   - Wait for AI processing

3. **Verify New Version**:
   - ✅ Should auto-switch to Versions tab
   - ✅ Should see both Version 1 and Version 2
   - ✅ Version 1 should still show "Published"
   - ✅ Version 2 should show "Draft"
   - ✅ Versions should be in descending order (2, then 1)

### Test 4: Switch Published Version

1. **Publish Version 2**:

   - Click "Publish" on Version 2
   - Wait for request

2. **Verify Version Switch**:
   - ✅ Version 2 badge → "Published" (green)
   - ✅ Version 1 badge → "Draft" (gray)
   - ✅ Only Version 2 has green border
   - ✅ Only ONE version is published at a time

### Test 5: Multiple Versions

1. **Upload More Resumes**:

   - Upload 2-3 more different PDFs
   - Each should create a new version

2. **Verify Version Numbering**:
   - ✅ Version 3, 4, 5... (incremental)
   - ✅ All show up in the list
   - ✅ Only one can be published at a time

## Expected Behavior Checklist

### Upload Tab

- [ ] Drag & drop works
- [ ] Click to browse works
- [ ] Shows file name and size after selection
- [ ] Upload button appears
- [ ] Loading spinner shows during processing
- [ ] Success message appears
- [ ] Auto-switches to Versions tab

### Versions Tab

- [ ] Shows all uploaded versions
- [ ] Most recent version appears first
- [ ] Status badges are correct
- [ ] Timestamps display properly
- [ ] PDF links work
- [ ] Publish button only on draft versions
- [ ] Only one version is published at a time

### Publishing

- [ ] Publish button works
- [ ] Status updates immediately
- [ ] Previous published version unpublishes
- [ ] UI reflects changes without page refresh

### Edge Cases

- [ ] Empty state shows when no versions
- [ ] Loading spinner shows while fetching
- [ ] Error messages display if API fails
- [ ] Can't publish same version twice

## Common Issues & Solutions

### Versions Don't Show

**Problem**: Versions tab is empty after upload

**Check**:

```bash
# Verify database has data
# In your Neon dashboard, run:
SELECT * FROM resume_data ORDER BY version DESC;
```

**Solution**: Make sure upload was successful and database saved the data

### Publish Doesn't Work

**Problem**: Clicking publish does nothing

**Check Console**: F12 → Console tab for errors

**Common Fix**: Make sure you're authenticated (session active)

### Auto-Switch Doesn't Work

**Problem**: Stays on Upload tab after upload

**Solution**: This is likely due to callback not firing - check browser console

### PDF Link Doesn't Work

**Problem**: "View PDF" link is broken

**Check**: Verify Blob storage token is correct in `.env.local`

## Database Verification

Check your data directly in Neon:

```sql
-- See all versions
SELECT id, version, is_published, created_at, updated_at
FROM resume_data
ORDER BY version DESC;

-- See only published
SELECT * FROM resume_data WHERE is_published = true;

-- Count versions
SELECT COUNT(*) as total_versions FROM resume_data;
```

## API Testing (Optional)

Test the APIs directly:

```bash
# Get versions (need auth cookie)
curl http://localhost:3000/api/admin/resume-versions

# Publish version (need auth cookie)
curl -X POST http://localhost:3000/api/admin/publish-version \
  -H "Content-Type: application/json" \
  -d '{"versionId": 1}'
```

## Success Criteria

You've successfully tested when:

- ✅ Can upload multiple resumes
- ✅ Each gets a unique version number
- ✅ Can publish any draft version
- ✅ Publishing unpublishes previous version
- ✅ UI updates automatically
- ✅ PDF links work
- ✅ Timestamps are accurate
- ✅ No console errors

## What's Working

After all tests pass, you have:

1. ✨ Full PDF upload with AI parsing
2. 🗂️ Version management system
3. 📊 Publish/draft status tracking
4. 🎨 Beautiful, responsive UI
5. 🔄 Automatic workflow transitions

---

**Ready for Phase 3?** See [PHASE2.5_COMPLETE.md](./PHASE2.5_COMPLETE.md) for next steps!
