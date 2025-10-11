# Hardcoded Elements Audit - Multi-User Fix Required

This document lists all hardcoded elements that need to be updated to support multiple users.

## 🔴 Critical Issues - Breaks Multi-User Functionality

### 1. AI Chat API (`app/api/chat/route.ts`)
**Lines: 157, 176-248**

**Issues:**
- Hardcoded references to "Renato" in AI responses
- Using static `resumeData` and `socialLinks` imports instead of user-specific data
- AI context always references Renato Frias specifically

**Current Code:**
```typescript
// Line 3-4: Static imports
import { resumeData, aiContext } from "@/data/resume";
import { socialLinks } from "@/data/social-links";

// Line 157: Hardcoded contact info
message: `You've reached the maximum of ${MAX_QUESTIONS} questions per session. I'd love to continue our conversation!\n\nPlease reach out directly:\n📧 Email: ${resumeData.email}\n💼 LinkedIn: ${socialLinks.linkedin}\n\nLooking forward to connecting with you!`,

// Line 176: Hardcoded reference to "Renato"
- Unique background: Mechatronics Engineering → Boat Repair → Software Development

// Line 185-225: Using static resumeData
Name: ${resumeData.name}
Title: ${resumeData.title}
Location: ${resumeData.location}
Email: ${resumeData.email}
Summary: ${resumeData.summary}
...

// Line 232: Hardcoded "Renato" in AI system prompt
content: `${aiContext}\n\n${resumeData}${urlContext}\n\nProvide helpful, accurate, and concise responses about Renato. Keep responses friendly and professional...`

// Line 248: Hardcoded email reference
responseMessage += `\n\n⚠️ Note: You have 1 question remaining in this session. For extended conversations, please contact me directly at ${resumeData.email} or via LinkedIn!`;
```

**Fix Required:**
- Accept `username` parameter in the API request
- Fetch user data from database using `getPublishedResumeByUsername(username)`
- Generate dynamic AI context based on user's actual data
- Replace hardcoded "Renato" with dynamic user name
- Use user's actual contact info from database

---

### 2. AI Chat Section Component (`components/sections/ai-chat-section.tsx`)
**Lines: 129, 283**

**Issues:**
- Hardcoded "Renato" in placeholder text and descriptions

**Current Code:**
```typescript
// Line 129
Ask me anything about Renato's experience and skills

// Line 283
placeholder="Ask about my experience, skills, or anything else..."
```

**Fix Required:**
- Accept `userName` prop
- Replace "Renato" with dynamic `{userName}` or generic text "this candidate"
- Update placeholder to be generic or use user's name

---

### 3. Hero Section (`components/sections/hero-section.tsx`)
**Line: 83-95**

**Issues:**
- Hardcoded career journey text specific to Renato

**Current Code:**
```typescript
From{" "}
<span className="font-semibold text-purple-600 dark:text-purple-400">
  Mechatronics Engineering
</span>{" "}
to{" "}
<span className="font-semibold text-blue-600 dark:text-blue-400">
  Software Development
</span>
, now specializing in{" "}
<span className="font-semibold text-teal-600 dark:text-teal-400">
  AI Solutions
</span>
. Building the future, one line of code at a time.
```

**Fix Required:**
- Option 1: Remove this hardcoded intro entirely, use generic tagline from user's data
- Option 2: Make it dynamic from user profile data (`profileData.tagline`)
- Option 3: Use first 2-3 sentences of user's summary

---

### 4. About Section (`components/sections/about-section.tsx`)
**Lines: 32, 84**

**Issues:**
- Hardcoded subtitle specific to one person's journey
- Hardcoded "Unique Background" section using static `resumeData.uniqueBackground`

**Current Code:**
```typescript
// Line 32
subtitle="A unique journey from engineering to code"

// Line 84
{resumeData.uniqueBackground.map((item, index) => (
```

**Fix Required:**
- Make subtitle generic or pull from user's profile data
- `uniqueBackground` should come from props/user data, not static import
- Consider making the "Unique Background" card optional if user doesn't have that data

---

### 5. Static Data Files (`data/resume.ts` and `data/social-links.ts`)

**Issues:**
- These files contain hardcoded data for Renato Frias
- Multiple components import from these files as fallback defaults

**Files Affected:**
- `data/resume.ts` - Contains all of Renato's personal info, experience, skills
- `data/social-links.ts` - Contains Renato's LinkedIn

**Components Using These:**
- `components/sections/hero-section.tsx` (defaults)
- `components/sections/about-section.tsx` (defaults)
- `components/sections/experience-section.tsx` (defaults)
- `components/sections/skills-section.tsx` (defaults)
- `components/sections/projects-section.tsx` (defaults)
- `components/sections/contact-section.tsx` (defaults)
- `app/api/chat/route.ts` (CRITICAL - always uses static data)

**Fix Required:**
- Remove static imports from API route (critical)
- Keep static data files only as fallback/demo for components
- Ensure all user pages get data from database, not static files

---

## 🟡 Medium Priority - User Experience Issues

### 6. Contact Section Social Links
**File: `components/sections/contact-section.tsx`**
**Line: 141**

**Issue:**
```typescript
href={socialLinks.linkedin}
```

**Fix Required:**
- Get LinkedIn URL from user's `profileData.socialLinks.linkedin`
- Make all social links dynamic based on user data

---

### 7. Navigation Share Functionality
**File: `components/navigation.tsx`**
**Lines: 80-92**

**Issue:**
- Share text uses userName prop (good!), but falls back to generic Upfolio text
- Could be more personalized

**Current Code:**
```typescript
const shareData = {
  title: userName
    ? `${userName} - Upfolio`
    : "Upfolio - Upload. Share. Get hired.",
  text: userName
    ? `Check out ${userName}'s portfolio on Upfolio!`
    : "Create your professional portfolio with Upfolio",
  url: window.location.href,
};
```

**Status:** ✅ Mostly correct, but verify userName is being passed correctly

---

## 🟢 Low Priority - Nice to Have

### 8. README.md and Documentation
**Files:**
- `README.md` (lines 246-248)
- Various documentation files

**Issues:**
- Contains example data using Renato's information
- Should have generic examples or placeholders

**Fix Required:**
- Update documentation with generic examples
- Use placeholder names like "John Doe" or "Jane Smith"

---

## Summary of Required Changes

### API Routes (CRITICAL)
1. ✅ `app/api/resume/route.ts` - Already user-specific
2. ❌ `app/api/chat/route.ts` - **NEEDS URGENT FIX**
   - Must accept username parameter
   - Must fetch user data from database
   - Must generate dynamic AI context

### Components (HIGH PRIORITY)
3. ❌ `components/sections/ai-chat-section.tsx` - Update hardcoded text
4. ❌ `components/sections/hero-section.tsx` - Remove/make dynamic intro text
5. ❌ `components/sections/about-section.tsx` - Make subtitle and uniqueBackground dynamic
6. ❌ `components/sections/contact-section.tsx` - Use user's social links

### Data (MEDIUM PRIORITY)
7. ⚠️ `data/resume.ts` - Should only be used as demo/fallback
8. ⚠️ `data/social-links.ts` - Should only be used as demo/fallback
9. ✅ `app/[username]/page.tsx` - Already fetching from database correctly

### Testing Checklist
- [ ] Create a second user account
- [ ] Upload different resume
- [ ] Verify AI chat uses correct user data
- [ ] Verify no references to "Renato" appear
- [ ] Verify contact links are user-specific
- [ ] Verify hero section doesn't show hardcoded journey

---

## Recommended Fix Order

1. **First:** Fix `app/api/chat/route.ts` - This is the most critical issue
2. **Second:** Update `components/sections/ai-chat-section.tsx` - Remove "Renato" references
3. **Third:** Fix `components/sections/hero-section.tsx` - Make intro dynamic
4. **Fourth:** Update `components/sections/about-section.tsx` - Make subtitle generic
5. **Fifth:** Verify all social links use user data
6. **Last:** Clean up documentation

---

## Notes

The main issue is that the AI chat functionality is completely hardcoded to Renato's data. When a visitor goes to a different user's portfolio and uses the AI chat, they will get information about Renato instead of the actual portfolio owner. This breaks the core multi-user functionality.

Most components are already set up correctly to accept props and have good defaults, but the AI chat API route needs a complete refactor to be user-aware.
