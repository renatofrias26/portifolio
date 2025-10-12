# AI Profile Enhancement Feature

## Overview

This feature enhances the guest onboarding experience by using AI to generate professional branding elements (taglines, professional title, and current focus areas) from uploaded resumes.

## User Flow

### 1. Guest Upload & Parse (Landing Page)

- User uploads PDF resume without registering
- System parses resume using OpenAI GPT-4o-mini
- Extracts structured data: experience, skills, education, contact info

### 2. AI Profile Enhancement (Automatic)

- System calls `/api/resume/enhance-profile` with parsed resume data
- AI generates:
  - **5 creative tagline options** (user selects favorite)
  - **Professional title** (based on experience)
  - **Current focus areas** (array of 3-5 items)
  - **Bio suggestion** (professional summary)

### 3. Tagline Selection

- User sees 5 AI-generated tagline options as clickable cards
- Each card displays the tagline with hover effects
- Selected tagline gets highlighted with purple border
- Professional title and current focus areas displayed below

### 4. Preview Portfolio

- User clicks "Preview Your Portfolio" to see full-page preview
- Shows actual portfolio layout with their data
- Includes hero section, about, experience, skills, and education

### 5. Registration with Auto-Save

- User clicks "Publish Your Portfolio"
- Profile enhancements saved to sessionStorage:
  ```json
  {
    "selectedTagline": "Build. Ship. Repeat.",
    "professionalTitle": "Full-Stack Developer",
    "currentFocus": ["Next.js", "AI Integration", "Web Performance"],
    "bio": "..."
  }
  ```
- Redirected to registration page
- Upon successful registration:
  - Profile enhancements saved to `users.profile_data` column
  - Resume data uploaded and saved
  - User redirected to dashboard with welcome banner

## Technical Implementation

### API Endpoints

#### `/api/resume/enhance-profile` (Public)

```typescript
POST /api/resume/enhance-profile
Body: { resumeData: ParsedResumeData }
Response: {
  professionalTitle: string
  taglines: string[]  // 5 options
  currentFocus: string[]
  bio: string
}
```

#### `/api/auth/register` (Updated)

```typescript
POST /api/auth/register
Body: {
  email: string
  password: string
  username: string
  name?: string
  profileEnhancements?: {
    selectedTagline: string
    professionalTitle: string
    currentFocus: string[]
    bio: string
  }
}
```

### Components

#### `GuestResumeUploader` (Enhanced)

- **New State:**

  - `isEnhancing: boolean` - Loading state for AI enhancement
  - `profileEnhancements` - Stores AI-generated options
  - `selectedTagline: string` - User's chosen tagline

- **New UI Elements:**

  - Tagline selection cards (5 options)
  - Professional title display
  - Current focus chips
  - "Generating AI suggestions..." loading state

- **Updated Functions:**
  - `handleProcess()` - Now calls both parse and enhance APIs
  - `handlePublish()` - Stores selected enhancements in sessionStorage

#### `RegisterPage` (Enhanced)

- Retrieves `guestProfileEnhancements` from sessionStorage
- Passes to registration API
- Clears sessionStorage after successful upload

### Database Schema

```sql
-- users.profile_data column stores:
{
  "tagline": "Build. Ship. Repeat.",
  "professionalTitle": "Full-Stack Developer",
  "currentFocus": ["Next.js", "AI Integration", "Web Performance"],
  "bio": "Experienced developer..."
}
```

## AI Prompt Engineering

### Profile Enhancement Prompt

Located in `/lib/profile-enhancer.ts`:

```typescript
const prompt = `Based on this resume data, generate professional profile enhancements:

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Generate:
1. A professional title (e.g., "Senior Full-Stack Developer", "AI Engineer", "Product Designer")
2. 5 creative, punchy taglines (8-12 words each, inspirational and professional)
3. 3-5 current focus areas (technologies, methodologies, or domains they're working with)
4. A professional bio (2-3 sentences)

Return as JSON: { professionalTitle, taglines, currentFocus, bio }`;
```

**Key Parameters:**

- Model: `gpt-4o-mini`
- Temperature: `0.8` (creative but controlled)
- Response Format: JSON object

## SessionStorage Keys

| Key                        | Value                                                       | Lifecycle                  |
| -------------------------- | ----------------------------------------------------------- | -------------------------- |
| `guestResumeData`          | `{ parsedData, fileName, fileContent }`                     | Cleared after upload       |
| `guestProfileEnhancements` | `{ selectedTagline, professionalTitle, currentFocus, bio }` | Cleared after registration |
| `redirectAfterAuth`        | URL string                                                  | Cleared after redirect     |

## User Experience Benefits

1. **Instant Branding**: Users get professional branding suggestions immediately
2. **Creative Control**: 5 tagline options let users express their personality
3. **Time Saving**: No need to manually craft tagline and professional summary
4. **Guided Onboarding**: Focus areas and title help users complete their profile
5. **Seamless Flow**: Profile enhancements auto-saved during registration

## Future Enhancements

- [ ] Allow users to edit AI-generated suggestions inline
- [ ] Add "Generate More" button for additional tagline options
- [ ] Save alternative taglines for later use
- [ ] Extract and suggest social links from resume
- [ ] Generate project descriptions from resume experience
- [ ] AI-powered bio editor in dashboard settings

## Testing Checklist

- [ ] Upload PDF resume on landing page
- [ ] Verify AI generates 5 unique taglines
- [ ] Select different tagline options (visual feedback)
- [ ] Preview portfolio with selected tagline
- [ ] Complete registration
- [ ] Verify profile_data saved in database
- [ ] Check dashboard shows tagline and professional title
- [ ] Test with different resume formats/experience levels
- [ ] Error handling: AI API failures, network issues
- [ ] SessionStorage persistence across page refreshes

## Performance Considerations

- **Parallel Processing**: Parse and enhance APIs can be called sequentially without blocking UI
- **Caching**: SessionStorage prevents re-generation on page refresh
- **Lazy Loading**: Enhancement only triggered after successful parse
- **Progressive Enhancement**: Works without JavaScript (falls back to manual entry)

## Error Handling

1. **Parse API Failure**: Show error, allow re-upload
2. **Enhancement API Failure**: Fall back to default tagline, still allow preview
3. **Registration Failure**: Profile enhancements persist in sessionStorage for retry
4. **Upload Failure**: Resume data persists, show retry option

## Accessibility

- Tagline cards keyboard navigable (Enter/Space to select)
- ARIA labels for loading states
- Screen reader announcements for selection
- Focus management during state transitions
