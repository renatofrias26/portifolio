# AI Chat Features Documentation

## Overview

The AI Chat section of this portfolio uses GPT-4o-mini to answer questions about my professional experience, skills, and background. It includes advanced features like URL parsing and PDF analysis.

## Key Features

### 1. **Smart Content Parsing**

The chat can analyze content from external sources to provide contextual answers:

#### HTML/Web Pages

- Automatically extracts main content from job postings
- Uses intelligent selectors to find relevant information
- Removes navigation, scripts, and other non-essential elements
- Common job posting sites supported (LinkedIn, Indeed, company career pages, etc.)

#### PDF Documents

- Parses PDF job descriptions and requirements
- Extracts text content up to 4000 characters
- Supports both direct PDF URLs and embedded PDFs

### 2. **Caching System**

- URLs are cached for 1 hour to improve performance
- Reduces redundant fetching of the same job posting
- Improves response time for repeated queries

### 3. **Rate Limiting**

- 10 questions per session (24-hour cookie)
- Warning message after 9 questions
- Graceful limit message with contact information

## How to Use

### Basic Questions

Simply ask questions about my experience:

```
"What's your experience with React?"
"Tell me about your AI projects"
"What's your background in software development?"
```

### Job Posting Analysis

Paste a URL to a job posting and ask for analysis:

```
"Is Renato a good fit for this position? https://company.com/jobs/senior-developer"
"Compare Renato's skills to this job: https://linkedin.com/jobs/view/123456"
"Would Renato be suitable for [URL]?"
```

### PDF Job Descriptions

Paste a link to a PDF job description:

```
"Analyze this job description: https://company.com/careers/job-description.pdf"
"Is Renato qualified for this role? [PDF URL]"
```

## Technical Implementation

### Stack

- **AI Model**: GPT-4o-mini (via Vercel AI SDK)
- **HTML Parsing**: Cheerio
- **PDF Parsing**: pdf-parse
- **Rate Limiting**: HTTP-only cookies
- **Frontend**: React with Framer Motion

### URL Processing Flow

1. User sends message with URL
2. Backend extracts URLs using regex
3. Content type detection (HTML vs PDF)
4. Cache check (1-hour TTL)
5. Content fetching and parsing
6. AI analysis with combined context
7. Response generation

### Content Limits

- **HTML Content**: 3000 characters per URL
- **PDF Content**: 4000 characters per document
- **URLs per Message**: Maximum 2 URLs processed
- **Token Limit**: 500 max output tokens

## Supported URL Patterns

### Job Posting Sites

- ✅ LinkedIn Jobs
- ✅ Indeed
- ✅ Glassdoor
- ✅ Company career pages
- ✅ Greenhouse/Lever job boards
- ✅ Any HTML page with structured content

### PDF Sources

- ✅ Direct PDF links (.pdf extension)
- ✅ PDF query parameters (?format=pdf)
- ✅ Most publicly accessible PDFs

## Limitations

### What Doesn't Work

- ❌ Password-protected content
- ❌ Sites requiring JavaScript rendering
- ❌ Content behind login walls
- ❌ Very large PDFs (>10MB may timeout)
- ❌ Scanned PDFs without OCR
- ❌ Sites with aggressive bot protection

### Browser Considerations

- Some sites may block server requests
- User-Agent is set to "PortfolioBot/1.0"
- Respects robots.txt implicitly through fetch failures

## Error Handling

The system gracefully handles errors:

- Invalid URLs → Error message
- Failed fetches → Informative fallback
- PDF parsing errors → Graceful degradation
- Rate limit exceeded → Contact information provided
- No OpenAI key → Fallback response with manual info

## Privacy & Security

- **No Data Storage**: URLs and content are not permanently stored
- **Cache Only**: 1-hour in-memory cache only
- **HTTP-only Cookies**: Rate limiting uses secure cookies
- **No Tracking**: No analytics or user tracking
- **Client-Side Safe**: All fetching happens server-side

## Environment Variables

```env
OPENAI_API_KEY=sk-... # Required for AI responses
```

Without the API key, the chat provides a fallback response with basic information.

## Development

### Local Testing

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Test with URLs
# Visit http://localhost:3000 and navigate to AI Chat section
```

### Testing URLs

Good test URLs:

- Public job postings on LinkedIn
- Company career pages
- PDF job descriptions from company websites

## Future Enhancements

Potential improvements:

- [ ] Screenshot capture for visual context
- [ ] Multiple PDF support
- [ ] Job posting comparison
- [ ] Automatic requirement extraction
- [ ] Skills gap analysis
- [ ] Interview preparation tips
- [ ] Salary range insights
- [ ] Company culture fit analysis

## Troubleshooting

### "Unable to fetch content"

- Check if URL is publicly accessible
- Verify URL format (https:// required)
- Some sites block automated requests

### "No readable content found"

- Page may use heavy JavaScript
- Try direct link instead of redirects
- Some sites have complex structures

### PDF Parsing Fails

- Ensure PDF is text-based (not scanned image)
- Check file size (<10MB recommended)
- Verify URL ends with .pdf or has valid content-type

## Contact

For questions or issues with the AI chat feature:

- 📧 Email: [Your Email]
- 💼 LinkedIn: [Your LinkedIn]
- 🐙 GitHub: [Your GitHub]

---

**Note**: This AI assistant is designed to help recruiters and hiring managers quickly assess my qualifications for specific positions. It's not a replacement for direct conversation but a helpful starting point!
