# Shared Styles Guide

## Overview

This project uses a centralized styling system defined in `/lib/styles.ts` to ensure consistency across all pages and components, especially for mobile responsiveness.

## Why Use Shared Styles?

1. **Consistency**: All pages use the same spacing, sizing, and responsive breakpoints
2. **Maintainability**: Change once, update everywhere
3. **Mobile-First**: Pre-configured responsive classes that work across all screen sizes
4. **Developer Experience**: No need to remember specific values - just import and use

## Import

```typescript
import {
  containerPadding,
  spacing,
  typography,
  logoSizes,
  buttons,
  formInput,
  layouts,
  cards,
  hero,
} from "@/lib/styles";
```

## Usage Examples

### Container Padding

Use these for consistent padding across different container types:

```tsx
// Page container
<div className={containerPadding.page}>
  {/* Content */}
</div>

// Card/Modal
<div className={containerPadding.card}>
  {/* Card content */}
</div>

// Form container
<div className={containerPadding.form}>
  {/* Form */}
</div>

// Dashboard page
<div className={containerPadding.dashboard}>
  {/* Dashboard content */}
</div>
```

**Available Options:**

- `containerPadding.page` - For page-level containers
- `containerPadding.section` - For section vertical padding
- `containerPadding.sectionX` - For section horizontal padding
- `containerPadding.card` - Standard card padding
- `containerPadding.cardSmall` - Smaller cards
- `containerPadding.cardLarge` - Large cards
- `containerPadding.form` - Form containers
- `containerPadding.dashboard` - Admin dashboard pages

### Typography

Use these for consistent, responsive font sizes:

```tsx
// Headings
<h1 className={typography.h1}>Main Title</h1>
<h2 className={typography.h2}>Section Title</h2>
<h3 className={typography.h3}>Subsection</h3>

// Body text
<p className={typography.body}>Regular text</p>
<p className={typography.bodyLarge}>Larger text</p>
<p className={typography.bodySmall}>Small text</p>

// Combining with other classes
<h1 className={`${typography.h1} text-gray-900 dark:text-white`}>
  Responsive Title
</h1>
```

**Available Options:**

- `typography.h1` through `typography.h5` - Heading sizes
- `typography.body`, `bodyLarge`, `bodySmall` - Body text
- `typography.lead` - Lead paragraph
- `typography.caption` - Caption text

### Logo Sizes

Consistent logo sizing across different contexts:

```tsx
// Auth pages (login/register)
<Image
  src="/logo-dark.svg"
  alt="Logo"
  width={logoSizes.auth.imageWidth}
  height={logoSizes.auth.imageHeight}
  className={`${logoSizes.auth.width} ${logoSizes.auth.height}`}
/>

// Landing page hero
<Image
  src="/logo-full.svg"
  alt="Logo"
  width={logoSizes.hero.imageWidth}
  height={logoSizes.hero.imageHeight}
  className={`${logoSizes.hero.width} ${logoSizes.hero.height}`}
/>
```

**Available Options:**

- `logoSizes.auth` - Registration/Login pages
- `logoSizes.hero` - Landing page hero section
- `logoSizes.header` - Header/Navigation

### Form Inputs

Consistent form styling:

```tsx
<div>
  <label className={formInput.label}>Email</label>
  <input type="email" className={formInput.base} placeholder="your@email.com" />
</div>;

{
  /* Error message */
}
{
  error && <div className={formInput.error}>{error}</div>;
}
```

**Available Options:**

- `formInput.base` - Standard input field
- `formInput.label` - Input label
- `formInput.error` - Error message box

### Buttons

Pre-styled button variants:

```tsx
// Primary gradient button
<button className={buttons.primary}>
  Create Account
</button>

// Secondary outlined button
<button className={buttons.secondary}>
  Learn More
</button>

// Custom size
<button className={buttons.large}>
  Get Started
</button>
```

**Available Options:**

- `buttons.primary` - Gradient primary button
- `buttons.secondary` - Outlined secondary button
- `buttons.small`, `medium`, `large` - Size variants

### Layouts

Common layout patterns:

```tsx
// Centered content
<div className={layouts.centered}>
  {/* Max-width centered content */}
</div>

// Grid layouts
<div className={layouts.grid3}>
  <Card />
  <Card />
  <Card />
</div>
```

**Available Options:**

- `layouts.centered` - Max-width centered (wide)
- `layouts.centeredNarrow` - Max-width centered (prose)
- `layouts.centeredForm` - Max-width for forms
- `layouts.section` - Section vertical padding
- `layouts.grid2`, `grid3`, `grid4` - Responsive grids

### Spacing

Consistent spacing between elements:

```tsx
<div>
  <section className={spacing.section}>
    <h2 className={spacing.element}>Title</h2>
    <p className={spacing.small}>Subtitle</p>
  </section>
</div>

// Gaps for flex/grid
<div className={`flex ${spacing.gapMedium}`}>
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

**Available Options:**

- `spacing.section`, `subsection`, `element`, `small` - Bottom margins
- `spacing.gapSmall`, `gapMedium`, `gapLarge` - Flex/grid gaps

### Cards

Card component styles:

```tsx
<div className={cards.feature}>
  {/* Feature card with hover effects */}
</div>

<div className={cards.profile}>
  {/* Profile card */}
</div>
```

**Available Options:**

- `cards.feature` - Feature cards with hover effects
- `cards.profile` - Profile cards
- `cards.glass` - Glass effect cards

## Mobile Responsive Breakpoints

All shared styles use Tailwind's default breakpoints:

- `sm`: 640px (small tablets)
- `md`: 768px (tablets)
- `lg`: 1024px (laptops)
- `xl`: 1280px (desktops)
- `2xl`: 1536px (large desktops)

Classes automatically scale from mobile → desktop.

## Best Practices

### ✅ DO

```tsx
// Use shared styles
<div className={containerPadding.card}>
  <h1 className={typography.h1}>Title</h1>
</div>

// Combine with custom classes
<h1 className={`${typography.h1} text-purple-600`}>
  Colored Title
</h1>
```

### ❌ DON'T

```tsx
// Don't hardcode values
<div className="p-8 md:p-12">
  <h1 className="text-2xl md:text-4xl">Title</h1>
</div>

// Don't use random spacing values
<div className="px-7 py-9">
  {/* Inconsistent */}
</div>
```

## Adding New Shared Styles

To add new shared styles, edit `/lib/styles.ts`:

```typescript
export const myNewCategory = {
  variant1: "class-names-here",
  variant2: "more-classes",
} as const;
```

Then update this guide with usage examples!

## Migration Checklist

When updating an existing component:

1. Import the styles: `import { containerPadding, typography } from "@/lib/styles"`
2. Replace hardcoded padding with `containerPadding.*`
3. Replace hardcoded font sizes with `typography.*`
4. Replace hardcoded form inputs with `formInput.*`
5. Test on mobile, tablet, and desktop
6. Commit changes

## Examples in Codebase

See these files for reference:

- `/app/admin/register/page.tsx` - Registration page
- `/app/admin/login/page.tsx` - Login page
- `/app/admin/dashboard/page.tsx` - Dashboard

## Questions?

If you're unsure which style to use, check:

1. This guide for examples
2. `/lib/styles.ts` for all available options
3. Existing pages that use the shared styles
