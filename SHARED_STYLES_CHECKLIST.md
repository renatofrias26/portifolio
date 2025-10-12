# Shared Styles Checklist

## ⚠️ IMPORTANT: Always Use Shared Styles from `/lib/styles.ts`

When creating or editing ANY component or page, you **MUST** use the shared styling classes to maintain consistency across the application.

---

## 📋 Pre-Flight Checklist

Before creating a new component or page, ask yourself:

- [ ] Am I using hardcoded padding values? → Use `containerPadding.*`
- [ ] Am I using hardcoded button styles? → Use `buttons.*`
- [ ] Am I using hardcoded typography? → Use `typography.*`
- [ ] Am I using hardcoded spacing/gaps? → Use `spacing.*`
- [ ] Am I using hardcoded form input styles? → Use `formInput.*`
- [ ] Am I adding a logo/image? → Use `logoSizes.*`

---

## 🎯 What to Import

```typescript
import {
  containerPadding, // For page/card/form padding
  buttons, // For button styles
  typography, // For headings and text
  spacing, // For margins, gaps, spacing
  formInput, // For form fields
  logoSizes, // For logo dimensions
  layouts, // For grids and containers
  cards, // For card layouts
} from "@/lib/styles";
```

---

## 🔍 Common Mistakes to Avoid

### ❌ DON'T DO THIS:

```tsx
// Hardcoded padding
<div className="p-4 sm:p-6 md:p-8">

// Hardcoded button
<button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:shadow-lg">

// Hardcoded spacing
<div className="space-y-4 gap-3">

// Hardcoded typography
<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">

// Hardcoded form input
<input className="w-full px-4 py-3 rounded-lg border border-gray-300" />
```

### ✅ DO THIS INSTEAD:

```tsx
// Use shared padding
<div className={containerPadding.form}>

// Use shared button
<button className={`${buttons.primary} ${buttons.medium}`}>

// Use shared spacing
<div className={`${spacing.formFields} ${spacing.formGrid}`}>

// Use shared typography
<h1 className={typography.h1}>

// Use shared form input
<input className={formInput.base} />
```

---

## 📚 Complete Reference

### 1. Container Padding (`containerPadding`)

- `page` - Main page container padding
- `card` - Card component padding
- `form` - Form container padding (mobile optimized)
- `dashboard` - Dashboard specific padding

**Usage:**

```tsx
<div className={containerPadding.form}>{/* Form content */}</div>
```

---

### 2. Typography (`typography`)

- `h1` through `h5` - Responsive headings
- `bodyLarge` - Large body text
- `body` - Standard body text
- `bodySmall` - Small body text

**Usage:**

```tsx
<h1 className={typography.h1}>Page Title</h1>
<p className={typography.body}>Body text</p>
```

---

### 3. Buttons (`buttons`)

**Sizes:**

- `small` - Small button size
- `medium` - Medium button size
- `large` - Large button size

**Styles:**

- `primary` - Gradient primary button
- `secondary` - Outlined secondary button
- `tab` - Base tab button style
- `tabActive` - Active tab state (gradient background)
- `tabInactive` - Inactive tab state (subtle hover)

**Usage:**

```tsx
<button className={`${buttons.primary} ${buttons.medium}`}>Click Me</button>;

{
  /* Tab Navigation */
}
<button
  className={`${buttons.tab} ${
    isActive ? buttons.tabActive : buttons.tabInactive
  }`}
>
  Tab Name
</button>;
```

---

### 4. Spacing (`spacing`)

**Margins:**

- `section` - Large section spacing
- `subsection` - Subsection spacing
- `element` - Element spacing
- `small` - Small element spacing

**Gaps:**

- `gapSmall` - Small gap (flex/grid)
- `gapMedium` - Medium gap
- `gapLarge` - Large gap

**Form Specific:**

- `formFields` - Vertical spacing between form fields
- `formGrid` - Grid gap for form layouts
- `buttonGroup` - Button group with flex and gap

**Usage:**

```tsx
<div className={spacing.formFields}>
  <div className={`grid sm:grid-cols-2 ${spacing.formGrid}`}>
    {/* Grid items */}
  </div>
  <div className={spacing.buttonGroup}>
    <button>Save</button>
    <button>Cancel</button>
  </div>
</div>
```

---

### 5. Form Inputs (`formInput`)

- `base` - Standard input field
- `label` - Form label styling
- `error` - Error message styling

**Usage:**

```tsx
<label className={formInput.label}>Email</label>
<input type="email" className={formInput.base} />
<div className={formInput.error}>Error message</div>
```

---

### 6. Logo Sizes (`logoSizes`)

- `auth` - Authentication page logos (login/register)
- `hero` - Landing page hero section logos
- `header` - Navigation header logos

**Usage:**

```tsx
import Image from "next/image";
import { logoSizes } from "@/lib/styles";

<div className={logoSizes.auth.width}>
  <Image
    src="/logo.svg"
    alt="Logo"
    width={logoSizes.auth.imageWidth}
    height={logoSizes.auth.imageHeight}
  />
</div>;
```

---

### 7. Layouts (`layouts`)

- `centered` - Centered container with max-width
- `grid2Col` - 2-column responsive grid
- `grid3Col` - 3-column responsive grid
- `grid4Col` - 4-column responsive grid

**Usage:**

```tsx
<div className={layouts.centered}>
  <div className={layouts.grid3Col}>{/* Grid items */}</div>
</div>
```

---

### 8. Cards (`cards`)

- `base` - Base card padding
- `compact` - Compact card padding
- `spacious` - Spacious card padding

**Usage:**

```tsx
<GlassCard className={cards.base}>{/* Card content */}</GlassCard>
```

---

## 🚀 Quick Start Template

When creating a new component, start with this template:

```tsx
"use client"; // If using client-side features

import {
  containerPadding,
  buttons,
  typography,
  spacing,
  formInput,
} from "@/lib/styles";

export function MyComponent() {
  return (
    <div className={containerPadding.page}>
      <h1 className={typography.h1}>My Component</h1>

      <form className={spacing.formFields}>
        <div className={`grid sm:grid-cols-2 ${spacing.formGrid}`}>
          <div>
            <label className={formInput.label}>Field Label</label>
            <input type="text" className={formInput.base} />
          </div>
        </div>

        <div className={spacing.buttonGroup}>
          <button className={`${buttons.primary} ${buttons.medium}`}>
            Submit
          </button>
          <button className={`${buttons.secondary} ${buttons.medium}`}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
```

---

## ✨ Benefits of Using Shared Styles

1. **Consistency** - All components look and feel the same
2. **Mobile-First** - Automatically responsive across all breakpoints
3. **Maintainability** - Change once, update everywhere
4. **Type Safety** - TypeScript autocomplete for all classes
5. **Performance** - Smaller bundle size (no duplicate styles)
6. **DX** - Faster development with less decision making

---

## 🔄 Adding New Shared Styles

If you need a new style pattern that's reused across multiple components:

1. Add it to `/lib/styles.ts` in the appropriate section
2. Use `as const` for TypeScript type safety
3. Document it in this checklist
4. Update existing components to use it

**Example:**

```typescript
export const spacing = {
  // ... existing styles ...

  // New style
  cardGrid: "gap-4 sm:gap-6 md:gap-8",
} as const;
```

---

## 📝 Review Process

Before submitting a PR, verify:

1. ✅ No hardcoded `p-*`, `px-*`, `py-*` padding classes
2. ✅ No hardcoded `text-*` typography classes (except for colors)
3. ✅ No hardcoded `space-y-*` or `gap-*` spacing classes
4. ✅ All buttons use `buttons.*` classes
5. ✅ All form inputs use `formInput.*` classes
6. ✅ All logos use `logoSizes.*` dimensions
7. ✅ Component is fully responsive on mobile (375px width)

---

## 🎓 Learning Resources

- Read `/lib/styles.ts` to see all available classes
- Check `/SHARED_STYLES_GUIDE.md` for usage examples
- Look at existing pages for implementation patterns:
  - `/app/admin/register/page.tsx` - Form example
  - `/app/page.tsx` - Landing page example
  - `/app/profiles/page.tsx` - Grid layout example

---

**Remember:** Consistency is key! When in doubt, check `/lib/styles.ts` first. 🎨
