# Reusable Page Architecture

## Overview

This document explains the **reusable page concept** implemented in the portfolio, where the entire website is composed of modular, reusable sections that can be assembled in different contexts (live site, preview, potentially other views).

## Core Concept: Single Source of Truth

Instead of duplicating components or HTML for different purposes (live site vs preview), we have a **single set of section components** that accept optional props, making them reusable across all contexts while maintaining consistent design and behavior.

## Architecture

### Component Hierarchy

```
Page (Composition Layer)
├── Navigation (Reusable)
├── HeroSection (Reusable)
├── AboutSection (Reusable)
├── ExperienceSection (Reusable)
├── SkillsSection (Reusable)
├── ProjectsSection (Reusable)
├── AIChatSection (Reusable)
└── ContactSection (Reusable)
```

### Two Main Compositions

1. **Main Portfolio Page** (`app/page.tsx`)

   - Uses static data from `data/resume.ts`
   - Full interactivity and features
   - Production website

2. **Resume Preview** (`components/admin/resume-preview.tsx`)
   - Uses dynamic data from database
   - Same components, different data source
   - Preview modal for admin panel

## Reusable Section Components

### 1. Navigation Component

**File**: `components/navigation.tsx`

**Purpose**: Top navigation bar with links

**Props**: None (uses social links from static data)

**Features**:

- Sticky navigation
- Scroll-based visibility (mobile)
- Dark mode toggle
- Smooth scroll to sections

**Usage**:

```tsx
<Navigation />
```

---

### 2. HeroSection Component

**File**: `components/sections/hero-section.tsx`

**Purpose**: Landing hero with name, title, contact info

**Props**:

```typescript
interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
}

interface HeroSectionProps {
  personal?: PersonalInfo;
  showScrollButton?: boolean;
}
```

**Default Behavior**: Falls back to `resumeData` if no props provided

**Features**:

- Animated entrance
- Contact information with links
- Optional scroll indicator
- Gradient text effects

**Usage**:

```tsx
// Live site (static data)
<HeroSection />

// Preview (dynamic data)
<HeroSection
  personal={{
    name: "John Doe",
    title: "Software Engineer",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    location: "San Francisco, CA"
  }}
  showScrollButton={false}
/>
```

---

### 3. AboutSection Component

**File**: `components/sections/about-section.tsx`

**Purpose**: Professional summary and education

**Props**:

```typescript
interface AboutSectionProps {
  summary?: string;
  education?: Array<{
    degree: string;
    institution: string;
    period: string;
  }>;
  showHeading?: boolean;
  sectionId?: string;
}
```

**Default Behavior**: Falls back to `resumeData` if no props provided

**Features**:

- Professional summary text
- Education timeline
- Glass card design
- Optional section heading

**Usage**:

```tsx
// Live site
<AboutSection />

// Preview
<AboutSection
  summary="Senior developer with 5 years..."
  education={[...]}
  showHeading={false}
  sectionId="preview-about"
/>
```

---

### 4. ExperienceSection Component

**File**: `components/sections/experience-section.tsx`

**Purpose**: Work experience timeline

**Props**:

```typescript
interface ExperienceSectionProps {
  experience?: Array<{
    title: string;
    company: string;
    period: string;
    highlights: string[];
    stack: string[];
  }>;
  showHeading?: boolean;
  sectionId?: string;
}
```

**Default Behavior**: Falls back to `resumeData` if no props provided

**Features**:

- Timeline layout
- Expandable details
- Tech stack badges
- Smooth animations

**Usage**:

```tsx
// Live site
<ExperienceSection />

// Preview
<ExperienceSection
  experience={transformedData}
  showHeading={false}
  sectionId="preview-experience"
/>
```

---

### 5. SkillsSection Component

**File**: `components/sections/skills-section.tsx`

**Purpose**: Skills organized by category

**Props**:

```typescript
interface SkillsSectionProps {
  skills?: {
    [category: string]: string[];
  };
  showHeading?: boolean;
  sectionId?: string;
}
```

**Default Behavior**: Falls back to `resumeData` if no props provided

**Features**:

- Category-based organization
- Auto-filters empty categories
- Skill badges with hover effects
- Responsive grid layout

**Usage**:

```tsx
// Live site
<SkillsSection />

// Preview
<SkillsSection
  skills={{
    frontend: ["React", "TypeScript"],
    backend: ["Node.js", "Python"],
    ...
  }}
  showHeading={false}
/>
```

---

### 6. ProjectsSection Component

**File**: `components/sections/projects-section.tsx`

**Purpose**: Portfolio projects showcase

**Props**:

```typescript
interface ProjectsSectionProps {
  projects?: Array<{
    name: string;
    description: string;
    highlights: string[];
    stack: string[];
    url?: string;
  }>;
  showHeading?: boolean;
  sectionId?: string;
}
```

**Default Behavior**: Falls back to `resumeData` if no props provided

**Features**:

- Project cards with hover effects
- Optional project links
- Technology stack display
- Responsive grid

**Usage**:

```tsx
// Live site
<ProjectsSection />

// Preview
<ProjectsSection
  projects={transformedProjects}
  showHeading={false}
  sectionId="preview-projects"
/>
```

---

### 7. AIChatSection Component

**File**: `components/sections/ai-chat-section.tsx`

**Purpose**: Interactive AI chatbot

**Props**:

```typescript
interface AIChatSectionProps {
  showHeading?: boolean;
  sectionId?: string;
}
```

**Features**:

- Real-time chat interface
- Rate limiting display
- Suggested questions
- Message history
- Loading states

**Usage**:

```tsx
// Live site
<AIChatSection />

// Preview
<AIChatSection
  showHeading={false}
  sectionId="preview-ai-chat"
/>
```

---

### 8. ContactSection Component

**File**: `components/sections/contact-section.tsx`

**Purpose**: Contact information and social links

**Props**:

```typescript
interface ContactInfo {
  name?: string;
  email: string;
  phone: string;
  location: string;
}

interface ContactSectionProps {
  contact?: ContactInfo;
  showHeading?: boolean;
  sectionId?: string;
}
```

**Default Behavior**: Falls back to `resumeData` if no props provided

**Features**:

- Profile photo
- Contact methods (email, phone, location)
- Social links (LinkedIn)
- Resume download button

**Usage**:

```tsx
// Live site
<ContactSection />

// Preview
<ContactSection
  contact={{
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    location: "San Francisco, CA"
  }}
  showHeading={false}
/>
```

---

## Page Compositions

### Main Portfolio Page

**File**: `app/page.tsx`

```tsx
export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <SkipToContent />
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <ProjectsSection />
      <AIChatSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
```

**Characteristics**:

- All components use default props (static data)
- Full feature set enabled
- All headings visible
- All scroll indicators active

---

### Resume Preview

**File**: `components/admin/resume-preview.tsx`

```tsx
export function ResumePreview({
  data,
  showHeadings = false,
  showNavigation = true,
}: ResumePreviewProps) {
  // Transform database data to component format
  const transformedExperience = data.experience.map(...);
  const transformedEducation = data.education.map(...);
  const transformedProjects = data.projects?.map(...);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {showNavigation && <Navigation />}

      <HeroSection
        personal={data.personal}
        showScrollButton={false}
      />

      <AboutSection
        summary={data.personal.summary}
        education={transformedEducation}
        showHeading={showHeadings}
      />

      <ExperienceSection
        experience={transformedExperience}
        showHeading={showHeadings}
      />

      <SkillsSection
        skills={data.skills}
        showHeading={showHeadings}
      />

      {transformedProjects.length > 0 && (
        <ProjectsSection
          projects={transformedProjects}
          showHeading={showHeadings}
        />
      )}

      <AIChatSection showHeading={showHeadings} />

      <ContactSection
        contact={data.personal}
        showHeading={showHeadings}
      />
    </div>
  );
}
```

**Characteristics**:

- Uses dynamic data from database
- Headings hidden by default (1-to-1 preview)
- Scroll indicators disabled
- Same visual design as live site

---

## Benefits of This Architecture

### 1. **Maintainability**

- Update component once, changes reflect everywhere
- No code duplication
- Single source of truth for design

### 2. **Consistency**

- Preview matches live site exactly
- Same styles, animations, interactions
- Predictable user experience

### 3. **Flexibility**

- Easy to add new page compositions
- Can toggle features per context (headings, navigation, etc.)
- Props allow customization without forking code

### 4. **Type Safety**

- Full TypeScript interfaces
- Compile-time error checking
- Autocomplete support

### 5. **Testability**

- Test components in isolation
- Mock data for different scenarios
- Consistent behavior across contexts

### 6. **Scalability**

- Easy to add new sections
- Simple to create new page variations
- Clear separation of concerns

---

## Data Flow

### Live Site

```
Static Data (data/resume.ts)
    ↓
Section Components (default props)
    ↓
Main Page (app/page.tsx)
```

### Preview

```
Database (resume_data table)
    ↓
API Route (/api/admin/resume-data/:id)
    ↓
ResumePreview (transform data)
    ↓
Section Components (with props)
    ↓
PreviewModal
```

---

## Future Extensions

This architecture enables easy creation of additional page variations:

### Potential Use Cases

1. **PDF Generation**

   - Use same components
   - Render to PDF with different styling
   - Maintain consistency with web version

2. **Print View**

   - Simplified component rendering
   - Print-optimized layouts
   - Same data, different presentation

3. **Multiple Portfolio Versions**

   - Technical version
   - Creative version
   - Executive version
   - All using same components with different data

4. **A/B Testing**

   - Different section orders
   - Different styling variations
   - Same component library

5. **Multi-language Support**
   - Same components
   - Different text content
   - Maintained structure

---

## Implementation Checklist

- [x] Navigation component (already reusable)
- [x] HeroSection - added PersonalInfo props
- [x] AboutSection - added summary/education props
- [x] ExperienceSection - added experience array props
- [x] SkillsSection - added skills object props
- [x] ProjectsSection - added projects array props
- [x] AIChatSection - added showHeading/sectionId props
- [x] ContactSection - added ContactInfo props
- [x] ResumePreview component created
- [x] PreviewModal integration
- [x] Data transformation logic
- [x] Type definitions
- [x] Documentation

---

## Best Practices

### When Creating New Sections

1. **Accept optional props** with defaults

   ```typescript
   interface NewSectionProps {
     data?: DataType;
     showHeading?: boolean;
     sectionId?: string;
   }
   ```

2. **Fallback to static data** when no props

   ```typescript
   export function NewSection({
     data = staticData,
     showHeading = true,
     sectionId = "section-id",
   }: NewSectionProps) {
     // Implementation
   }
   ```

3. **Use TypeScript interfaces** for type safety
4. **Keep sections self-contained** (no external dependencies beyond props)
5. **Document props and usage** in this file

### When Using Sections

1. **Live site**: Use components without props (defaults)
2. **Preview**: Pass dynamic data via props
3. **Hide headings in preview**: Use `showHeading={false}`
4. **Unique section IDs**: Use `sectionId="preview-*"` to avoid conflicts

---

## Related Documentation

- `REUSABLE_COMPONENTS.md` - Technical details on each component
- `PREVIEW_ENHANCEMENTS.md` - Preview modal implementation
- `IMPLEMENTATION_SUMMARY.md` - Overall system architecture
- `AI_CHAT_FEATURES.md` - AI chat functionality

---

## Questions & Answers

**Q: Why not just duplicate the page HTML for preview?**
A: Duplication leads to maintenance nightmares. When you update a design, you'd have to update it in multiple places. Single source of truth is easier to maintain.

**Q: Does this affect performance?**
A: No. The conditional props and defaults are resolved at compile/render time. There's no performance overhead.

**Q: Can I create a completely different layout?**
A: Yes! Just create a new composition component (like `ResumePreview`) and arrange the sections in any order you want.

**Q: What if I need section-specific behavior in preview vs live?**
A: Add a prop like `isPreview` and use it to conditionally render features. But try to keep them consistent when possible.

**Q: How do I add a new section?**
A:

1. Create the component in `components/sections/`
2. Add props interface with optional data and defaults
3. Import and use in both `page.tsx` and `resume-preview.tsx`
4. Document it in this file

---

## Conclusion

The **reusable page architecture** provides a scalable, maintainable approach to building multiple views of the same content. By treating sections as composable, configurable components, we achieve consistency while maintaining flexibility for different use cases.

This pattern is especially powerful for:

- Admin preview systems (current use case)
- Multi-tenant portfolios
- Content management systems
- A/B testing frameworks
- Any scenario requiring multiple presentations of the same data
