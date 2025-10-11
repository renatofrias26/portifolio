# Skills Not Displaying - Debugging Checklist

## Issue

Skills still not displaying on the live page.

## Possible Causes & Solutions

### ✅ Step 1: Check if You Have a Published Version

**Problem**: The API returns `null` if no resume version is published.

**How to Check**:

1. Go to `http://localhost:3000/admin/dashboard`
2. Click on the "Versions" tab
3. Look for a version with a **green "Published" badge**

**Solution**:

- If you see only "Draft" versions (gray badge):
  1. Click the **"Publish"** button on the version you want to use
  2. Refresh the live page
  3. Skills should now appear

---

### ✅ Step 2: Verify API Response

**How to Check**:

```bash
# Open this URL in your browser:
http://localhost:3000/api/resume

# Or use curl:
curl http://localhost:3000/api/resume | jq
```

**What to Look For**:

#### ❌ Bad Response (No Published Version)

```json
{
  "success": false,
  "message": "No published resume found",
  "data": null
}
```

**Solution**: Publish a version in the admin dashboard

#### ✅ Good Response

```json
{
  "success": true,
  "data": {
    "personal": { ... },
    "experience": [ ... ],
    "skills": [ ... ] or { ... }
  }
}
```

**Check**: Does `data.skills` have content?

---

### ✅ Step 3: Check Console Logs

**Browser Console** (Open with F12):

Look for these logs when you refresh the page:

#### Expected Logs:

```
📡 /api/resume - Published resume found: true
📡 /api/resume - Skills in data: [...]
🔍 mapResumeData - Input dbData.skills: [...]
🔄 mapSkills input: [...]
🔄 mapSkills type check - isArray: true, type: object
🔄 mapSkills output (from array): {...}
🎨 SkillsSection - Received skills: {...}
```

#### Problem Indicators:

**1. No published version:**

```
📡 /api/resume - Published resume found: false
⚠️ /api/resume - No published resume found
```

→ **Solution**: Publish a version

**2. Skills are null/undefined:**

```
📡 /api/resume - Skills in data: null
🔍 mapResumeData - Input dbData.skills: null
⚠️ mapSkills: No skills provided
```

→ **Solution**: Re-upload PDF or manually add skills

**3. Skills are empty array:**

```
🔄 mapSkills input: []
⚠️ mapSkills: Empty skills array
```

→ **Solution**: AI didn't find skills. Try re-uploading or manual entry

---

### ✅ Step 4: Verify Skills in Database

**Check the database directly**:

```sql
-- Check published resume
SELECT
  id,
  version,
  is_published,
  data->'skills' as skills
FROM resume_data
WHERE is_published = true;
```

**What to Look For**:

- Is `is_published` = `true`?
- Does `skills` field have data?
- What format is it in?

---

### ✅ Step 5: Clear Cache & Rebuild

Sometimes Next.js caching can cause issues:

```bash
# Stop the dev server (Ctrl+C)

# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

Then:

1. Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
2. Check again

---

## Quick Fixes

### Fix 1: Publish a Version

```
1. Go to Admin Dashboard
2. Click "Versions" tab
3. Find your resume version
4. Click the "Publish" button
5. Refresh the live page
```

### Fix 2: Re-upload PDF

```
1. Go to Admin Dashboard
2. Click "Upload" tab
3. Upload your resume PDF again
4. Wait for processing
5. Check the preview
6. If skills appear in preview, publish it
7. Refresh live page
```

### Fix 3: Use Static Data (Temporary)

If you want to see skills immediately while debugging:

Edit `app/page.tsx`:

```typescript
import { resumeData } from "@/data/resume";

export default function Home() {
  // Use static data temporarily
  return <PortfolioPage />;
}
```

This will use the static skills from `data/resume.ts`.

---

## Diagnostic Commands

### Check Published Resume

```bash
# Make API call
curl http://localhost:3000/api/resume

# Pretty print with jq
curl -s http://localhost:3000/api/resume | jq '.data.skills'
```

### Check All Versions

```bash
curl -s http://localhost:3000/api/admin/resume-versions \
  -H "Cookie: your-session-cookie" | jq
```

### Check Server Logs

Look at your terminal where `npm run dev` is running for:

```
📡 /api/resume - Published resume found: ...
📡 /api/resume - Skills in data: ...
```

---

## Most Common Issue

**90% of the time, the issue is:**

> ⚠️ **No resume version is published**

**Solution:**

1. Admin Dashboard → Versions tab
2. Click "Publish" on a version
3. Refresh the page
4. Done! ✅

---

## Still Not Working?

If you've tried everything above and skills still don't show:

1. **Share these logs**:

   - Browser console output
   - Terminal/server logs
   - API response from `/api/resume`

2. **Check these values**:

   - Number of versions in admin
   - Which version is published
   - Skills format in database

3. **Try**:
   - Upload a fresh PDF
   - Check if other sections (experience, education) work
   - Test with the static data temporarily
