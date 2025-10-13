# Resume Preview Styling Guide

## 📝 Markdown to Professional Format

This guide shows how your markdown content is transformed into a beautiful, professional resume.

---

## Name & Contact Header

### Markdown Input:

```markdown
# John Doe

[john.doe@email.com](mailto:john.doe@email.com) | [+1 (555) 123-4567](tel:+15551234567)
[linkedin.com/in/johndoe](https://linkedin.com/in/johndoe) | [github.com/johndoe](https://github.com/johndoe)
```

### Preview Output:

- **Large bold name** (2rem, purple underline)
- **Contact info** with automatic icons:
  - 📧 Email (mailto: links)
  - 📞 Phone (tel: links)
  - 💼 LinkedIn
  - 🐙 GitHub
  - 🌐 Other websites

---

## Section Headers

### Markdown Input:

```markdown
## EXPERIENCE

## EDUCATION

## SKILLS
```

### Preview Output:

- **Uppercase text** (1.25rem, semibold)
- **Gray bottom border** (2px)
- **Extra letter spacing** (0.05em)
- Clear visual separation between sections

---

## Job Titles / Subsections

### Markdown Input:

```markdown
### Senior Software Engineer
```

### Preview Output:

- **Bold text** (1.1rem)
- **Dark color** (gray-900 / white in dark mode)
- Moderate top margin for spacing

---

## Company / Date / Location

### Markdown Input:

```markdown
#### Tech Company Inc. | January 2020 - Present
```

### Preview Output:

- **Italic text** (0.95rem)
- **Gray color** (#6b7280)
- Subtle, professional appearance

---

## Lists & Achievements

### Markdown Input:

```markdown
- Led team of 5 developers on critical projects
- Increased system performance by 40%
- Implemented CI/CD pipeline reducing deployment time by 60%
```

### Preview Output:

- **Purple bullet points** (brand color)
- **Proper indentation** (1.5rem)
- **Line spacing** (1.6 line-height)
- Clean, scannable format

---

## Bold Text (Skills, Keywords)

### Markdown Input:

```markdown
**Technical Skills:** React, TypeScript, Node.js, PostgreSQL
```

### Preview Output:

- **Semibold weight** (600)
- **Darker color** for emphasis
- Maintains readability

---

## Complete Example

### Markdown:

```markdown
# Sarah Johnson

[sarah.johnson@email.com](mailto:sarah.johnson@email.com) | [+1 (555) 987-6543](tel:+15559876543)
[linkedin.com/in/sarahjohnson](https://linkedin.com/in/sarahjohnson) | [Portfolio](https://sarahjohnson.com)

## EXPERIENCE

### Lead Product Designer

#### Design Studio Co. | March 2021 - Present

- Redesigned flagship product, increasing user engagement by 65%
- Led cross-functional team of 8 designers and developers
- Established design system used across 12 product lines
- Mentored 3 junior designers, 2 promoted within a year

### Senior UX Designer

#### Tech Startup Inc. | June 2018 - February 2021

- Conducted user research with 200+ participants
- Created wireframes and prototypes for 5 major features
- Improved conversion rate by 35% through A/B testing
- Collaborated with engineering to ensure design feasibility

## EDUCATION

### Master of Fine Arts in Design

#### Rhode Island School of Design | 2016 - 2018

- Concentration: Interaction Design
- Thesis: "Accessible Design for Aging Populations"
- GPA: 3.9/4.0

## SKILLS

**Design Tools:** Figma, Sketch, Adobe Creative Suite, Principle
**Research:** User Interviews, Usability Testing, A/B Testing, Analytics
**Technical:** HTML/CSS, JavaScript basics, Design Systems, Accessibility (WCAG 2.1)
**Soft Skills:** Team Leadership, Stakeholder Management, Workshop Facilitation
```

### Preview Appearance:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          Sarah Johnson
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 sarah.johnson@email.com | 📞 +1 (555) 987-6543
💼 linkedin.com/in/sarahjohnson | 🌐 Portfolio

EXPERIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Lead Product Designer
  Design Studio Co. | March 2021 - Present

  • Redesigned flagship product, increasing user
    engagement by 65%
  • Led cross-functional team of 8 designers and
    developers
  • Established design system used across 12
    product lines
  • Mentored 3 junior designers, 2 promoted
    within a year

  Senior UX Designer
  Tech Startup Inc. | June 2018 - February 2021

  • Conducted user research with 200+
    participants
  • Created wireframes and prototypes for 5
    major features
  • Improved conversion rate by 35% through
    A/B testing
  • Collaborated with engineering to ensure
    design feasibility

EDUCATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Master of Fine Arts in Design
  Rhode Island School of Design | 2016 - 2018

  • Concentration: Interaction Design
  • Thesis: "Accessible Design for Aging
    Populations"
  • GPA: 3.9/4.0

SKILLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design Tools: Figma, Sketch, Adobe Creative
Suite, Principle

Research: User Interviews, Usability Testing,
A/B Testing, Analytics

Technical: HTML/CSS, JavaScript basics, Design
Systems, Accessibility (WCAG 2.1)

Soft Skills: Team Leadership, Stakeholder
Management, Workshop Facilitation
```

---

## 🎨 Styling Details

### Colors (Light Mode):

- **Name (H1):** #1f2937 (gray-900)
- **Border:** #7c3aed (purple-600)
- **Section Headers (H2):** #374151 (gray-700)
- **Job Titles (H3):** #1f2937 (gray-900)
- **Details (H4):** #6b7280 (gray-500, italic)
- **Body Text:** #374151 (gray-700)
- **Bullets:** #7c3aed (purple-600)
- **Links:** #7c3aed (purple-600)

### Colors (Dark Mode):

- **Name (H1):** #f9fafb (gray-50)
- **Border:** #a78bfa (purple-400)
- **Section Headers (H2):** #e5e7eb (gray-200)
- **Job Titles (H3):** #f3f4f6 (gray-100)
- **Details (H4):** #9ca3af (gray-400, italic)
- **Body Text:** #d1d5db (gray-300)
- **Bullets:** #a78bfa (purple-400)
- **Links:** #a78bfa (purple-400)

### Typography:

- **Name:** 2rem (32px), bold, 0.5rem bottom padding
- **H2 Sections:** 1.25rem (20px), semibold, uppercase, 0.05em letter-spacing
- **H3 Titles:** 1.1rem (17.6px), semibold
- **H4 Details:** 0.95rem (15.2px), medium, italic
- **Body:** 1rem (16px), line-height 1.6

### Spacing:

- **H1 margin-bottom:** 0.5rem
- **H2 margin-top:** 1.5rem, margin-bottom: 0.75rem
- **H3 margin-top:** 1rem, margin-bottom: 0.25rem
- **H4 margin-top:** 0.5rem, margin-bottom: 0.25rem
- **Paragraph margin-bottom:** 0.75rem
- **List margin-bottom:** 1rem
- **List item margin-bottom:** 0.25rem

---

## 🖨️ Print Optimization

When printing or exporting to PDF:

- All colors convert to black and white
- Purple links remain visible (#7c3aed)
- Proper margins maintained
- Background colors removed
- High contrast for readability

---

## 💡 Best Practices

### Do's ✅

- Use H1 for your name only
- Use H2 for major sections (EXPERIENCE, EDUCATION, SKILLS)
- Use H3 for job titles, degree names
- Use H4 for company names, dates, locations
- Use bullet points for achievements
- Include links for contact info and profiles
- Use bold for skill categories or emphasis

### Don'ts ❌

- Don't use multiple H1 tags
- Don't skip heading levels (H1 → H3)
- Don't overuse bold text
- Don't write paragraphs longer than 3-4 lines
- Don't use colors or images in markdown
- Don't use tables (use lists instead)
- Don't use emoji in the markdown (icons auto-added)

---

## 🔄 Live Updates

The preview updates in real-time when you:

- Switch from Edit to Preview mode
- Make changes and toggle back to Preview
- Edit the markdown and click Preview again

**No need to regenerate** - your edits are immediately reflected!

---

## 📱 Responsive Behavior

The preview automatically adjusts for:

- **Desktop:** Full width, optimal reading experience
- **Tablet:** Maintains readability, adjusted padding
- **Mobile:** Stacked layout, touch-friendly spacing
- **Print:** Standard A4/Letter paper dimensions

---

## 🎯 ATS-Friendly Features

The preview is optimized for Applicant Tracking Systems:

- Clean, semantic HTML structure
- No complex tables or graphics
- Standard section headers
- Proper heading hierarchy
- Keyword-friendly formatting
- Text-based (no images blocking parsing)

---

**Pro Tip:** Use the Preview mode to see exactly how your resume will look to recruiters. Make edits in Edit mode, then switch to Preview to verify the formatting is perfect before downloading or saving!
