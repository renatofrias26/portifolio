# Debugging Skills Upload Issue

## Problem

Skills are not showing up after uploading a PDF resume.

## Possible Root Causes

### 1. AI Returns Object Instead of Array

The AI might be ignoring our prompt and returning the old object format:

```json
{
  "skills": {
    "Frontend": ["React", "Angular"],
    "Backend": ["Node.js"]
  }
}
```

Instead of the requested array format:

```json
{
  "skills": [
    { "category": "Frontend", "items": ["React", "Angular"] },
    { "category": "Backend", "items": ["Node.js"] }
  ]
}
```

**Fix Applied**: Added automatic conversion in `resume-parser.ts` to detect and convert object format to array format.

### 2. AI Returns Empty Skills

The AI might not be finding skills in your PDF.

**Fix Applied**: Added warning logging when skills array is empty.

### 3. PDF Text Extraction Issues

The PDF might not be extracting text properly.

## Debug Steps

### Step 1: Upload a PDF Resume

1. Go to the admin panel
2. Upload your resume PDF
3. Watch the console/logs

### Step 2: Check the Logs

Look for these console messages:

```
📖 Extracting text from PDF...
✅ Extracted X characters from PDF
🤖 Sending to OpenAI for parsing...
✅ Received response from OpenAI
📊 Parsed skills structure: [...]
```

**If you see object format:**

```
📊 Parsed skills structure: {
  "Frontend": [...],
  "Backend": [...]
}
```

Then you should also see:

```
🔄 Converting skills from object to array format
✅ Converted skills: [...]
```

**If you see array format:**

```
📊 Parsed skills structure: [
  { "category": "Frontend", "items": [...] }
]
```

Good! The AI is following our instructions.

**If you see empty:**

```
📊 Parsed skills structure: []
⚠️ Warning: No skills found in resume
```

The AI couldn't extract skills from your PDF.

### Step 3: Check Upload API Logs

Look for:

```
📋 Parsed data summary:
  - Personal info: Your Name
  - Experience count: X
  - Skills structure: array
  - Skills data: [...]
```

### Step 4: Check Database Data

After upload, check the preview modal. The skills should appear there.

### Step 5: Check Mapping Logs

When viewing the published resume, check for:

```
🔄 mapSkills input: [...]
🔄 mapSkills output: {...}
```

## What We've Added

### 1. Comprehensive Logging (`lib/resume-parser.ts`)

- Logs the raw skills structure from AI
- Detects if AI returned object vs array
- Warns if skills are empty

### 2. Automatic Format Conversion (`lib/resume-parser.ts`)

```typescript
// Convert skills to array format if AI returned object format
if (parsedData.skills && !Array.isArray(parsedData.skills)) {
  console.log("🔄 Converting skills from object to array format");
  const skillsArray = [];
  Object.entries(parsedData.skills).forEach(([category, items]) => {
    skillsArray.push({ category, items });
  });
  parsedData.skills = skillsArray;
}
```

### 3. Upload Summary Logging (`app/api/admin/upload-resume/route.ts`)

- Shows what data was parsed
- Shows skills structure type (array vs object)
- Shows full skills data

### 4. Mapping Debug Logs (`lib/resume-data.ts`)

- Shows input to mapSkills function
- Shows output from mapSkills function
- Warns if no skills provided

## How to Test

### Test 1: Upload Your Resume

```bash
1. Go to http://localhost:3000/admin/dashboard
2. Upload your resume PDF
3. Check browser console (F12)
4. Check terminal/server logs
```

### Test 2: Check the API Response

Open browser DevTools Network tab:

1. Upload PDF
2. Look for `/api/admin/upload-resume` request
3. Check response JSON
4. Verify `parsedData.skills` is an array

### Test 3: Check Database

```bash
# If using postgres locally
psql -d your_database
SELECT data->'skills' FROM resume_data ORDER BY created_at DESC LIMIT 1;
```

### Test 4: Check Preview

1. After upload, click "Preview" button
2. Scroll to Skills section
3. Should see your skills organized by category

## Expected Behavior

### Successful Upload Flow

```
1. PDF Upload ✓
2. Text Extraction ✓
3. AI Parsing ✓
   - Returns skills (array or object)
4. Format Conversion (if needed) ✓
   - Converts object → array
5. Database Save ✓
6. Preview Shows Skills ✓
7. Publish Version ✓
8. Live Site Shows Skills ✓
```

## If Skills Still Don't Appear

### Check 1: Is your PDF extracting text properly?

Look for the log:

```
✅ Extracted X characters from PDF
```

If X is very small (< 100), the PDF might be scanned images, not text.

### Check 2: Does your resume have a skills section?

The AI looks for skills sections. If your resume doesn't clearly label skills, the AI might miss them.

### Workaround: Add skills manually

If the AI can't extract skills, you could:

1. Upload the PDF (to get experience/education)
2. Manually edit the data in the database to add skills
3. Or create a manual entry form in the admin panel

### Check 3: Is the AI API key valid?

Make sure `OPENAI_API_KEY` is set in your environment variables.

## Next Steps

1. **Upload a PDF and check the logs** - This will tell us exactly what's happening
2. **Share the log output** - If skills still don't appear, share the console/terminal output
3. **Check the preview** - See if skills appear in the preview modal

The automatic format conversion should handle the most likely issue (AI returning object instead of array).
