# Rate Limiting Implementation

## Overview

Implemented a session-based rate limiting system for the AI chat feature that limits users to 10 questions per session.

## Features

### 1. Session Tracking

- Uses HTTP-only cookies to track question count per session
- Cookie expires after 24 hours
- Secure with `sameSite: strict` and `httpOnly: true`

### 2. User Experience Flow

#### Questions 1-9

- Users can ask freely
- Question counter displayed in chat header (e.g., "3/10 questions")

#### Question 9 (Warning)

After the 9th question is answered, users see:

```
⚠️ Note: You have 1 question remaining in this session. For extended conversations, please contact me directly at renatofrias@outlook.com or via LinkedIn!
```

#### Question 10 (Final)

User can ask their 10th question and receives a normal response.

#### After Question 10 (Limit Reached)

- Input field is disabled and replaced with a message
- Any attempt to send returns:

```
You've reached the maximum of 10 questions per session. I'd love to continue our conversation!

Please reach out directly:
📧 Email: renatofrias@outlook.com
💼 LinkedIn: [Your LinkedIn URL]

Looking forward to connecting with you!
```

### 3. Visual Indicators

- Question counter in chat header (top-right)
- Warning message appended to 9th response
- Input field disabled after limit
- Suggested questions disabled when limit reached

## Files Modified

1. **`app/api/chat/route.ts`**

   - Added cookie-based session tracking
   - Implemented question counting logic
   - Added warning message for 9th question
   - Added limit reached response for 10+ questions

2. **`components/sections/ai-chat-section.tsx`**

   - Added state for `questionCount`, `maxQuestions`, `limitReached`
   - Updated UI to show question counter
   - Disabled input when limit reached
   - Added conditional rendering for limit reached state

3. **`data/social-links.ts`** (new file)
   - Centralized social media links
   - Makes it easy to update LinkedIn/GitHub URLs

## Configuration

To adjust the question limit, modify `MAX_QUESTIONS` in `app/api/chat/route.ts`:

```typescript
const MAX_QUESTIONS = 10; // Change this value as needed
```

## Benefits

1. **Prevents Spam**: Stops automated or excessive usage
2. **Encourages Direct Contact**: Converts interested visitors into direct connections
3. **Controls API Costs**: Limits API usage per session
4. **Professional**: Provides clear communication about limits
5. **User-Friendly**: Gives warning before final question

## TODO

- Update LinkedIn URL in `data/social-links.ts`
- Update GitHub URL in `data/social-links.ts`
