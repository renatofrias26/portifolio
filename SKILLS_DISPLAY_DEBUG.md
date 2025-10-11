# Skills Display Debug Guide

## The Issue

Skills appear in the API response but not in the UI.

## Root Cause

The main page (`app/page.tsx`) was using static data from `data/resume.ts` instead of fetching from the database API.

## Solution Applied

### 1. Updated `app/page.tsx`

Changed from static to dynamic data fetching:

```typescript
// BEFORE (static)
export default function Home() {
  return <PortfolioPage />;
}

// AFTER (dynamic from database)
export default async function Home() {
  const publishedData = await getResumeData();
  const portfolioData = publishedData ? mapResumeData(publishedData) : null;
  return <PortfolioPage data={portfolioData || undefined} />;
}
```

### 2. Fixed `mapResumeData` Structure

Updated to match the expected `PortfolioData` interface:

```typescript
// BEFORE (flat structure)
return {
  name: "...",
  title: "...",
  skills: {...}
}

// AFTER (nested structure)
return {
  personal: {
    name: "...",
    title: "...",
  },
  skills: {...}
}
```

### 3. Added Debug Logging

Added console logs to trace the data flow:

- `mapResumeData` - Shows input skills and mapped output
- `SkillsSection` - Shows what the component receives

## How to Test

### Step 1: Start Development Server

```bash
npm run dev
```

### Step 2: Check Console Logs

Open browser console (F12) and look for:

```
🔍 mapResumeData - Input dbData.skills: [...]
🔄 mapSkills input: [...]
🔄 mapSkills output: {...}
🔍 mapResumeData - Mapped skills: {...}
🎨 SkillsSection - Received skills: {...}
```

### Step 3: Verify UI

1. Go to `http://localhost:3000`
2. Scroll to Skills section
3. Skills should now display from your published resume version

## Data Flow

```
Database (JSONB)
  ↓
GET /api/resume → Returns published resume
  ↓
app/page.tsx → Fetches data with getResumeData()
  ↓
mapResumeData() → Converts DB format to component format
  ↓
  ├─→ mapSkills() → Converts array to object format
  │     Input: [{ category: "Frontend", items: [...] }]
  │     Output: { frontend: [...], backend: [...] }
  ↓
PortfolioPage → Receives data prop
  ↓
SkillsSection → Receives skills prop
  ↓
UI renders skills by category
```

## Expected Console Output

### Successful Flow

```
🔍 mapResumeData - Input dbData.skills: [
  { category: "Frontend", items: ["React", "Angular"] },
  { category: "Backend", items: ["Node.js", "Java"] }
]

🔄 mapSkills input: [
  { category: "Frontend", items: ["React", "Angular"] },
  { category: "Backend", items: ["Node.js", "Java"] }
]

🔄 mapSkills output: {
  frontend: ["React", "Angular"],
  backend: ["Node.js", "Java"]
}

🔍 mapResumeData - Mapped skills: {
  frontend: ["React", "Angular"],
  backend: ["Node.js", "Java"]
}

🎨 SkillsSection - Received skills: {
  frontend: ["React", "Angular"],
  backend: ["Node.js", "Java"]
}
```

### If Skills Don't Appear

#### Check 1: No Published Version

```
🔍 mapResumeData - Input dbData.skills: undefined
⚠️ No published resume found, using static data
```

**Solution**: Publish a resume version in the admin panel.

#### Check 2: Empty Skills Array

```
🔍 mapResumeData - Input dbData.skills: []
🔄 mapSkills input: []
⚠️ mapSkills: No skills provided
🔄 mapSkills output: {}
```

**Solution**: The AI didn't extract skills. Try re-uploading the PDF.

#### Check 3: Wrong Format

```
🔍 mapResumeData - Input dbData.skills: { "Frontend": [...] }
```

**Solution**: Old format detected. The parser should convert it automatically.

## Troubleshooting

### Skills Still Not Showing

1. **Check if you have a published version**

   ```bash
   # In your database
   SELECT is_published, data->'skills' FROM resume_data
   WHERE is_published = true;
   ```

2. **Verify API response**

   - Open `http://localhost:3000/api/resume`
   - Check if `data.skills` is present and populated

3. **Clear Next.js cache**

   ```bash
   rm -rf .next
   npm run dev
   ```

4. **Check browser console**
   - Look for the console logs mentioned above
   - Check for any errors in red

### Still Having Issues?

If skills still don't appear after following these steps:

1. Share the console logs
2. Share the API response from `/api/resume`
3. Share the browser console output

## Revalidation

The page uses ISR (Incremental Static Regeneration):

```typescript
export const revalidate = 60; // Revalidate every 60 seconds
```

This means:

- Changes to published data may take up to 60 seconds to appear
- Or force refresh: Clear cache and hard reload (Cmd+Shift+R on Mac)
