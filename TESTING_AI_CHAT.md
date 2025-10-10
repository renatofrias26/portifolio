# Testing the AI Chat URL & PDF Features

## Quick Test Guide

### Prerequisites

1. Ensure `OPENAI_API_KEY` is set in `.env.local`
2. Run the development server: `pnpm dev`
3. Navigate to http://localhost:3000 and scroll to the AI Chat section

## Test Cases

### Test 1: Basic Question (Baseline)

**Input:**

```
What's your experience with React?
```

**Expected:** Short response about React experience based on resume data.

---

### Test 2: Job Posting URL (HTML)

**Input:**

```
Is Renato a good fit for this position? https://www.linkedin.com/jobs/view/123456789
```

**Expected:**

- System fetches and parses the LinkedIn job posting
- AI analyzes requirements against resume
- Response includes specific skill matches

**Note:** Use any public LinkedIn job URL

---

### Test 3: PDF Job Description

**Input:**

```
Analyze this job description: https://example.com/job-description.pdf
```

**Expected:**

- System detects PDF format
- Parses PDF content
- AI provides detailed fit analysis

**Note:** Use any publicly accessible PDF job description

---

### Test 4: Multiple URLs

**Input:**

```
Compare Renato's qualifications to these positions:
https://example.com/job1.pdf
https://example.com/job2-posting
```

**Expected:**

- Both URLs fetched (max 2)
- Combined context analysis
- Comparison response

---

### Test 5: Cache Test

**Input 1:**

```
Is Renato suitable for https://example.com/job-posting
```

**Input 2 (immediately after):**

```
What are the key requirements for https://example.com/job-posting
```

**Expected:**

- Second request uses cached content (check console for "Using cached content" log)
- Faster response time
- Same accurate analysis

---

### Test 6: Rate Limiting

**Action:** Ask 10 questions consecutively

**Expected:**

- After 9th question: Warning message "⚠️ Note: You have 1 question remaining..."
- After 10th question: Limit reached message with contact info
- Further questions blocked

---

### Test 7: Invalid/Protected URL

**Input:**

```
Check this job: https://protected-site.com/jobs/private
```

**Expected:**

- Error message: "[Unable to fetch content from URL]" or "[Error fetching content from URL]"
- AI still responds based on available context
- No crash or failure

---

### Test 8: PDF Error Handling

**Input:**

```
Analyze this PDF: https://example.com/scanned-document.pdf
```

**Expected (if scanned/image-based PDF):**

- Error message in context
- Graceful handling
- AI mentions inability to read the specific document

---

## Console Monitoring

Check browser/server console for:

### Success Indicators:

```
✓ Fetching URL: https://...
✓ Using cached content for https://...
✓ PDF parsed successfully
```

### Error Indicators:

```
✗ Error fetching URL: ...
✗ Error parsing PDF: ...
```

## Manual Testing Checklist

- [ ] Basic chat functionality works
- [ ] URL detection works
- [ ] HTML parsing extracts job content
- [ ] PDF parsing works
- [ ] Caching reduces fetch time
- [ ] Rate limiting enforces 10-question limit
- [ ] Error handling is graceful
- [ ] UI shows proper loading states
- [ ] Mobile responsive
- [ ] Accessibility features work (keyboard navigation, ARIA labels)

## Example Public URLs for Testing

### HTML Job Postings:

- LinkedIn Jobs: https://www.linkedin.com/jobs/view/[any-job-id]
- Indeed: https://www.indeed.com/viewjob?jk=[job-key]
- Stack Overflow Jobs: https://stackoverflow.com/jobs/[job-id]

### PDF Examples:

- Sample Job Description PDFs (search Google for "job description PDF filetype:pdf")
- Company career pages often have downloadable PDFs

## Performance Benchmarks

| Scenario                | Expected Response Time |
| ----------------------- | ---------------------- |
| Basic question (no URL) | 1-3 seconds            |
| HTML URL (first fetch)  | 3-6 seconds            |
| PDF URL (first fetch)   | 4-8 seconds            |
| Cached URL              | 1-3 seconds            |

## Troubleshooting

### "Unable to fetch content"

- Check if URL is publicly accessible in browser
- Verify no authentication required
- Try different User-Agent if site blocks bots

### PDF parsing fails

- Ensure PDF is text-based, not scanned images
- Check file size (<10MB recommended)
- Verify URL returns proper PDF content-type

### Rate limit not working

- Clear browser cookies
- Check cookie setting in API response
- Verify 24-hour expiration

### AI responses are generic

- Verify OpenAI API key is set
- Check API key has sufficient credits
- Review server logs for API errors

## Success Criteria

✅ **Feature Working** if:

1. Can ask basic questions and get relevant answers
2. URLs are detected and content extracted
3. PDFs are parsed successfully
4. Cache improves performance on repeated URLs
5. Rate limiting enforces 10-question limit
6. Error handling prevents crashes
7. UI provides clear feedback

---

**Happy Testing!** 🚀

If you find any issues, check:

1. Server logs for fetch/parsing errors
2. Browser console for client-side errors
3. Network tab for API request/response details
