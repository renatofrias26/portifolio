# Shared Portfolio Page Component

## Overview

This document explains the **shared page component architecture** where the entire portfolio page is a single reusable component that can be used in multiple contexts with different data sources.

## The Problem We Solved

**Before**: Each context (live site, preview, etc.) would have its own layout, leading to:

- Code duplication
- Inconsistent designs
- Maintenance nightmare (update in multiple places)
- Preview not matching live site

**After**: Single `PortfolioPage` component used everywhere:

- ✅ Single source of truth for layout
- ✅ Update once, changes reflect everywhere
- ✅ Perfect consistency between contexts
- ✅ Easy to add new layouts in the future

## Architecture

### Core Component: `PortfolioPage`

**File**: `components/portfolio-page.tsx`

This is the **master page component** that contains the entire portfolio layout.

```tsx
<PortfolioPage
  data={...}           // Optional: Portfolio data
  showNavigation={...} // Optional: Show nav bar
  showFooter={...}     // Optional: Show footer
  showSkipToContent={...} // Optional: Accessibility link
  layout={...}         // Optional: Layout variant
/>
```

### Usage Contexts

#### 1. Live Website (`app/page.tsx`)

```tsx
import { PortfolioPage } from "@/components/portfolio-page";

export default function Home() {
  return <PortfolioPage />;
}
```

**Characteristics**:

- No props = uses default static data from `data/resume.ts`
- Shows navigation, footer, skip-to-content
- Full interactive features
- This is what users see at your website URL

#### 2. Admin Preview (`components/admin/preview-modal.tsx`)

```tsx
<PortfolioPage
  data={transformData(databaseData)}
  showNavigation={true}
  showFooter={false}
  showSkipToContent={false}
/>
```

**Characteristics**:

- Passes dynamic data from database
- Shows navigation (for realistic preview)
- Hides footer (not needed in modal)
- Hides skip-to-content (not needed in modal)
- Exact replica of live site with database data

#### 3. Future: User Preferences

```tsx
<PortfolioPage
  data={userData}
  layout={userPreferences.layout} // "default" | "compact" | "minimal"
/>
```

**Potential uses**:

- User selects preferred layout
- Different layouts for different audiences
- A/B testing different designs
- Seasonal/themed variations

## Data Flow

### Static Data (Live Site)

```
data/resume.ts (static data)
    ↓
PortfolioPage (no data prop)
    ↓
Sections use default static data
    ↓
Live Website
```

### Dynamic Data (Preview)

```
Database (resume_data table)
    ↓
API (/api/admin/resume-data/:id)
    ↓
PreviewModal fetches data
    ↓
Transform database format → PortfolioData
    ↓
PortfolioPage (with data prop)
    ↓
Sections receive data via props
    ↓
Preview Modal
```

## PortfolioPage Props

### `data?: PortfolioData`

Portfolio content data. When provided, all sections use this data. When omitted, sections fall back to static data from `data/resume.ts`.

**Type**:

```typescript
interface PortfolioData {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    title: string;
    company: string;
    period: string;
    highlights: string[];
    stack: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    period: string;
  }>;
  skills: {
    [category: string]: string[];
  };
  projects?: Array<{
    name: string;
    description: string;
    highlights: string[];
    stack: string[];
    url?: string;
  }>;
}
```

### `showNavigation?: boolean`

Default: `true`

Show/hide the navigation bar.

**Use cases**:

- `true`: Live site, preview (shows realistic navigation)
- `false`: Embedded contexts, print view

### `showFooter?: boolean`

Default: `true`

Show/hide the footer.

**Use cases**:

- `true`: Live site (shows full page)
- `false`: Preview modal (footer not needed)

### `showSkipToContent?: boolean`

Default: `true`

Show/hide the "Skip to Content" accessibility link.

**Use cases**:

- `true`: Live site (accessibility feature)
- `false`: Preview modal (not needed in modal)

### `layout?: "default" | "compact" | "minimal"`

Default: `"default"`

**Future feature** for different layout variations.

**Potential layouts**:

- `"default"`: Current full-featured layout
- `"compact"`: Condensed sections, less spacing
- `"minimal"`: Simplified design, essential info only

## How It Works

### 1. PortfolioPage Receives Props

```tsx
export function PortfolioPage({
  data,
  showNavigation = true,
  showFooter = true,
  showSkipToContent = true,
  layout = "default",
}: PortfolioPageProps) {
  const usePropsData = !!data;
  // ...
}
```

### 2. Conditionally Passes Data to Sections

```tsx
<HeroSection
  personal={usePropsData ? data.personal : undefined}
/>

<AboutSection
  summary={usePropsData ? data.personal.summary : undefined}
  education={usePropsData ? data.education : undefined}
/>

<ExperienceSection
  experience={usePropsData ? data.experience : undefined}
/>
```

**Logic**:

- If `data` prop exists → pass data to sections
- If `data` prop doesn't exist (undefined) → sections use their defaults

### 3. Sections Handle Props or Defaults

Each section component has this pattern:

```tsx
export function SomeSection({
  data = staticData, // Falls back to static
  ...otherProps
}: SomeSectionProps) {
  // Uses 'data' whether from props or default
}
```

## Data Transformation

Since the database structure differs slightly from the component structure, we transform it:

```typescript
const transformData = (dbData: DatabaseResumeData): PortfolioData => {
  return {
    personal: dbData.personal,
    experience: dbData.experience.map((exp) => ({
      title: exp.title,
      company: exp.company,
      period: exp.period,
      highlights: exp.achievements || [], // Transform achievements → highlights
      stack: [], // Not in database structure
    })),
    education: dbData.education.map((edu) => ({
      degree: edu.degree,
      institution: edu.institution,
      period: edu.period,
    })),
    skills: dbData.skills,
    projects: (dbData.projects || []).map((proj) => ({
      name: proj.name,
      description: proj.description,
      highlights: [],
      stack: proj.technologies || [], // Transform technologies → stack
      url: proj.url,
    })),
  };
};
```

## Benefits

### 1. Single Source of Truth

- The portfolio layout exists in **one place**: `PortfolioPage`
- Change the layout once, it updates everywhere
- No risk of preview diverging from live site

### 2. Perfect Consistency

- Live site and preview use **identical component**
- Same HTML structure, same CSS classes, same behavior
- What you see in preview **is** what you get on live site

### 3. Easy Maintenance

- Update section order: Change once in `PortfolioPage`
- Add new section: Add once in `PortfolioPage`
- Modify layout: Change once in `PortfolioPage`

### 4. Flexible

- Different data sources (static, database, API)
- Toggle features (navigation, footer)
- Future: Multiple layout variants
- Future: User preferences

### 5. Type-Safe

- Full TypeScript support
- `PortfolioData` interface ensures data consistency
- Compile-time error checking

### 6. Scalable

- Easy to add new contexts (print view, PDF export, etc.)
- Simple to implement layout variations
- Clear separation of concerns

## Example: Adding a New Layout

To add a new "compact" layout variant:

### 1. Update PortfolioPage

```tsx
export function PortfolioPage({
  data,
  layout = "default",
  ...
}: PortfolioPageProps) {
  const spacing = layout === "compact" ? "py-10" : "py-20";

  return (
    <main className={spacing}>
      {/* Sections */}
    </main>
  );
}
```

### 2. Use It

```tsx
// Live site with compact layout
<PortfolioPage layout="compact" />

// Preview with compact layout
<PortfolioPage
  data={dbData}
  layout="compact"
/>
```

That's it! Both contexts get the new layout.

## Example: Adding a Print View

```tsx
// app/print/page.tsx
import { PortfolioPage } from "@/components/portfolio-page";

export default function PrintView() {
  return (
    <PortfolioPage
      showNavigation={false}
      showFooter={false}
      showSkipToContent={false}
      layout="minimal"
    />
  );
}
```

## File Structure

```
portfolio/
├── app/
│   └── page.tsx                    # Live site (uses PortfolioPage)
├── components/
│   ├── portfolio-page.tsx          # THE SHARED COMPONENT ⭐
│   ├── navigation.tsx              # Used by PortfolioPage
│   ├── footer.tsx                  # Used by PortfolioPage
│   ├── skip-to-content.tsx         # Used by PortfolioPage
│   ├── sections/                   # All section components
│   │   ├── hero-section.tsx
│   │   ├── about-section.tsx
│   │   ├── experience-section.tsx
│   │   ├── skills-section.tsx
│   │   ├── projects-section.tsx
│   │   ├── ai-chat-section.tsx
│   │   └── contact-section.tsx
│   └── admin/
│       └── preview-modal.tsx       # Uses PortfolioPage with DB data
└── data/
    └── resume.ts                   # Static data (fallback)
```

## Comparison: Before vs After

### Before (Multiple Layouts)

```tsx
// app/page.tsx
<main>
  <Navigation />
  <HeroSection />
  <AboutSection />
  // ... all sections
  <Footer />
</main>

// components/admin/resume-preview.tsx
<div>
  <Navigation />
  <HeroSection personal={data.personal} />
  <AboutSection summary={data.summary} />
  // ... all sections again (DUPLICATION!)
</div>
```

**Problems**:

- ❌ Code duplicated in 2+ places
- ❌ Easy to forget updating one place
- ❌ Preview can diverge from live site
- ❌ Hard to maintain consistency

### After (Shared Component)

```tsx
// app/page.tsx
<PortfolioPage />

// components/admin/preview-modal.tsx
<PortfolioPage data={dbData} showFooter={false} />
```

**Benefits**:

- ✅ Single source of truth
- ✅ Update once, changes everywhere
- ✅ Perfect consistency guaranteed
- ✅ Easy to maintain

## Future Possibilities

### 1. User Layout Preferences

```tsx
// User selects layout in settings
const userPreferences = {
  layout: "compact", // or "default", "minimal"
  theme: "dark",
};

<PortfolioPage layout={userPreferences.layout} />;
```

### 2. Multiple Portfolio Versions

```tsx
// Technical portfolio
<PortfolioPage data={technicalData} />

// Creative portfolio
<PortfolioPage data={creativeData} layout="minimal" />

// Executive portfolio
<PortfolioPage data={executiveData} layout="compact" />
```

### 3. PDF Export

```tsx
// Generate PDF from same component
import { PortfolioPage } from "@/components/portfolio-page";
import { renderToPDF } from "@/lib/pdf";

const pdf = await renderToPDF(
  <PortfolioPage data={userData} showNavigation={false} showFooter={false} />,
);
```

### 4. Embedded Portfolio Widget

```tsx
// Embed portfolio in another site
<iframe>
  <PortfolioPage showNavigation={false} showFooter={false} layout="minimal" />
</iframe>
```

### 5. Multi-language Support

```tsx
<PortfolioPage data={translatedData[language]} />
```

## Testing

### Test Live Site

```bash
npm run dev
# Visit http://localhost:3000
```

Should show full portfolio with static data.

### Test Preview

1. Go to admin panel
2. Upload and parse a resume
3. Click "Preview" on a version
4. Should show exact same layout with database data

### Verify Consistency

Both should have:

- ✅ Same section order
- ✅ Same styling
- ✅ Same animations
- ✅ Same interactions
- ✅ Same layout

Only difference: **data source**

## Conclusion

The **shared `PortfolioPage` component** is the cornerstone of a maintainable, consistent portfolio architecture. By centralizing the layout in one component and making it data-agnostic, we achieve:

1. **Single source of truth** for the portfolio layout
2. **Perfect consistency** between live site and preview
3. **Easy maintenance** (update once, reflect everywhere)
4. **Flexibility** for future enhancements (layouts, themes, preferences)
5. **Scalability** for new contexts (print, PDF, embedded)

This is the **reusable page concept** you asked for - one component, multiple contexts, infinite possibilities! 🚀
