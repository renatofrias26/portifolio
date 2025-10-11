# Upfolio Brand Guidelines

**Version 1.0** | Last Updated: October 12, 2025

---

## 🎯 Brand Overview

**Name:** Upfolio  
**Tagline:** Upload. Share. Get hired.  
**Mission:** Empowering professionals to showcase their expertise and connect with opportunities through AI-powered portfolio creation.

**Brand Personality:**

- **Professional** yet approachable
- **Innovative** with cutting-edge AI technology
- **Empowering** - putting control in users' hands
- **Modern** with clean, contemporary design
- **Trustworthy** and reliable

---

## 🎨 Visual Identity

### Logo

The Upfolio logo features an upward arrow integrated into a "U" shape, symbolizing:

- **Upward momentum** - Career growth and advancement
- **Upload action** - Core functionality
- **Unity** - Bringing professionals and opportunities together

**Logo Variants:**

- Primary: Full color with wordmark
- Icon only: For app icons, favicons, and small spaces
- Monochrome: For single-color applications

**Clear Space:**
Maintain a minimum clear space equal to the height of the "U" icon around all sides of the logo.

**Minimum Size:**

- Digital: 120px width
- Print: 1 inch width

**Logo Don'ts:**

- ❌ Don't rotate or skew the logo
- ❌ Don't change the logo colors
- ❌ Don't add effects (shadows, outlines, etc.)
- ❌ Don't place on busy backgrounds without proper contrast

---

## 🎨 Color Palette

### Primary Colors

**Upfolio Blue**

- Hex: `#5B67F7`
- RGB: `91, 103, 247`
- Usage: Primary CTAs, links, interactive elements

**Upfolio Purple**

- Hex: `#7B3FF2`
- RGB: `123, 63, 242`
- Usage: Accents, gradients, highlights

**Upfolio Dark**

- Hex: `#0F172A`
- RGB: `15, 23, 42`
- Usage: Primary text, dark backgrounds

### Secondary Colors

**Success Green**

- Hex: `#10B981`
- RGB: `16, 185, 129`
- Usage: Success messages, positive actions

**Warning Orange**

- Hex: `#F59E0B`
- RGB: `245, 158, 11`
- Usage: Warnings, pending states

**Error Red**

- Hex: `#EF4444`
- RGB: `239, 68, 68`
- Usage: Errors, destructive actions

### Neutral Colors

**Gray Scale**

- Gray 50: `#F8FAFC` - Light backgrounds
- Gray 100: `#F1F5F9` - Subtle backgrounds
- Gray 200: `#E2E8F0` - Borders
- Gray 400: `#94A3B8` - Placeholder text
- Gray 600: `#475569` - Secondary text
- Gray 800: `#1E293B` - Dark text
- Gray 900: `#0F172A` - Primary text

### Gradient Usage

**Primary Gradient (Hero, CTAs)**

```css
background: linear-gradient(135deg, #5b67f7 0%, #7b3ff2 100%);
```

**Subtle Gradient (Backgrounds)**

```css
background: linear-gradient(
  to bottom right,
  rgb(248, 250, 252) 0%,
  rgb(239, 246, 255) 50%,
  rgb(243, 232, 255) 100%
);
```

**Dark Mode Gradient**

```css
background: linear-gradient(
  to bottom right,
  rgb(15, 23, 42) 0%,
  rgb(30, 58, 138) 50%,
  rgb(88, 28, 135) 100%
);
```

---

## 📝 Typography

### Font Family

**Primary: Geist Sans**

- Modern, clean sans-serif
- Excellent readability
- Usage: Body text, UI elements, headings

**Monospace: Geist Mono**

- Technical, professional feel
- Usage: Code snippets, data displays

### Type Scale

**Headings**

- H1: 3.5rem (56px) - Bold - Hero titles
- H2: 2.25rem (36px) - Bold - Section headings
- H3: 1.875rem (30px) - Semibold - Subsection headings
- H4: 1.5rem (24px) - Semibold - Card titles
- H5: 1.25rem (20px) - Medium - Small headings
- H6: 1rem (16px) - Medium - Labels

**Body Text**

- Large: 1.125rem (18px) - Regular - Intro paragraphs
- Base: 1rem (16px) - Regular - Standard body text
- Small: 0.875rem (14px) - Regular - Captions, labels
- XSmall: 0.75rem (12px) - Regular - Fine print

**Line Height**

- Headings: 1.2
- Body text: 1.6
- Compact UI: 1.4

**Letter Spacing**

- Headings: -0.02em (tight)
- Body: 0em (normal)
- Uppercase UI: 0.05em (loose)

---

## 💬 Voice & Tone

### Brand Voice

**Clear & Direct**

- Use simple, jargon-free language
- Get to the point quickly
- Example: "Upload your resume. We'll handle the rest."

**Empowering**

- Focus on user success and achievement
- Highlight user control and ownership
- Example: "Your portfolio, your way"

**Professional with Personality**

- Maintain professionalism without being stuffy
- Friendly but not overly casual
- Example: "Let's get you hired" vs "Let's totes get u a job!!"

**Confident**

- Speak with authority about our capabilities
- Be honest about limitations
- Example: "AI-powered parsing that actually works"

### Tone Variations

**Marketing Copy:** Exciting, aspirational

- "Transform your resume into a stunning portfolio in minutes"

**UI/UX Copy:** Helpful, instructional

- "Upload a PDF to automatically extract your information"

**Error Messages:** Apologetic, solution-focused

- "We couldn't process that file. Try a different PDF format."

**Success Messages:** Celebratory, encouraging

- "Portfolio published! Share your URL and get noticed."

---

## 📣 Messaging Framework

### Tagline

**"Upload. Share. Get hired."**

Each word represents a core value:

- **Upload** - Simplicity and ease of use
- **Share** - Connection and visibility
- **Get hired** - Tangible career outcomes

### Key Messages

**For Job Seekers:**

- "Your professional story, beautifully told"
- "From resume to portfolio in minutes"
- "Stand out with AI-powered portfolios"
- "Make your expertise impossible to ignore"

**For Recruiters/Visitors:**

- "Discover talent at their best"
- "More than a resume - a complete professional picture"

### Feature Messaging

**AI Resume Parsing:**

- Before: "Upload your resume and manually enter all your information"
- After: "Upload your PDF, AI extracts everything automatically"

**Version Management:**

- "Manage multiple resume versions, publish the perfect one"

**Custom URLs:**

- "Your personal URL: yourdomain.com/yourname"

**Glassmorphism UI:**

- "Beautiful, modern design that makes you look good"

---

## 🎭 Design Principles

### 1. Clarity Over Cleverness

Every design choice should serve user understanding first.

### 2. Consistency Creates Trust

Use established patterns, maintain visual hierarchy.

### 3. Progressive Disclosure

Show users what they need, when they need it.

### 4. Delight in Details

Smooth animations, thoughtful micro-interactions.

### 5. Accessible by Default

Design works for everyone, regardless of ability.

---

## 🖼️ UI Patterns

### Glassmorphism Elements

**Standard Glass Card:**

```css
background: rgba(255, 255, 255, 0.7);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.18);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
```

**Usage:**

- Feature cards
- Modal overlays
- Navigation bars (when scrolled)
- Content containers

**Don'ts:**

- Don't overuse - reserve for key UI elements
- Don't stack too many glass elements
- Don't use on complex backgrounds where blur reduces readability

### Button Styles

**Primary CTA:**

- Gradient background (Blue to Purple)
- White text
- Medium font weight
- Generous padding
- Smooth hover scale effect

**Secondary:**

- White/transparent background
- Colored border
- Colored text
- Hover: filled background

**Ghost:**

- Transparent background
- Colored text on hover
- Minimal visual weight

### Animation Guidelines

**Timing:**

- Micro-interactions: 150-200ms
- Content transitions: 300-400ms
- Page transitions: 500-600ms

**Easing:**

- Default: cubic-bezier(0.4, 0.0, 0.2, 1)
- Bounce effects: cubic-bezier(0.68, -0.55, 0.265, 1.55)

**Motion Principles:**

- Respect prefers-reduced-motion
- Keep animations subtle and purposeful
- Use motion to guide attention

---

## 🌐 Web & Digital

### Meta Information

**Title Format:**

```
[Page Name] | Upfolio - Upload. Share. Get hired.
```

**Description Template:**

```
Create your professional portfolio in minutes with AI-powered resume parsing. Upload your resume, get a beautiful portfolio. Simple, powerful, effective.
```

**Keywords:**

- AI portfolio
- Resume to portfolio
- Professional portfolio
- Online resume
- Portfolio builder
- Career portfolio

### Social Media

**Profile Bio:**
"Upload your resume. Share your portfolio. Get hired. AI-powered professional portfolios made simple. 🚀"

**Hashtags:**

- Primary: #Upfolio
- Secondary: #CareerGrowth #ProfessionalPortfolio #TechCareers

**Voice:**

- Educational: Share tips for portfolio creation
- Inspirational: Success stories
- Helpful: Career advice and resources

---

## ✅ Brand Checklist

### Every Touchpoint Should:

- [ ] Use approved colors from the palette
- [ ] Follow typography guidelines
- [ ] Maintain consistent voice and tone
- [ ] Reinforce key brand messages
- [ ] Be accessible (WCAG AA minimum)
- [ ] Work in both light and dark modes
- [ ] Feel modern and professional
- [ ] Empower the user

### Before Launch:

- [ ] Logo displays correctly at all sizes
- [ ] Colors are consistent across all pages
- [ ] Typography is legible and hierarchical
- [ ] Copy reflects brand voice
- [ ] Animations are smooth and purposeful
- [ ] Mobile experience is excellent
- [ ] Dark mode works perfectly
- [ ] Accessibility is validated

---

## 📞 Questions?

For brand guideline questions or approval requests, contact the brand team.

**Remember:** These guidelines exist to create a cohesive, professional experience. When in doubt, prioritize clarity, consistency, and user value.

---

**Upfolio** - Upload. Share. Get hired.
