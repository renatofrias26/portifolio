# Upfolio Brand Assets

This directory contains all official Upfolio brand assets.

## 📁 Logo Files

### SVG Files (Vector - Recommended)

**Primary Logo**

- `logo.svg` - Default logo with icon
- `logo-full.svg` - Complete logo with wordmark and tagline
- `logo-icon.svg` - Icon only (U with arrow)

**Color Variants**

- `logo-light.svg` - Optimized for light backgrounds
- `logo-dark.svg` - Optimized for dark backgrounds

### Usage Guidelines

#### When to Use Each Variant

**logo-full.svg**

- Landing pages
- Marketing materials
- Email signatures
- Large displays
- Minimum width: 300px

**logo.svg / logo-icon.svg**

- App icons
- Navigation bars
- Favicons
- Small spaces
- Minimum width: 32px

**logo-light.svg**

- Light mode interfaces
- White or light backgrounds
- Print materials

**logo-dark.svg**

- Dark mode interfaces
- Dark backgrounds
- Night mode displays

## 🎨 Brand Colors

### Primary Colors

**Upfolio Blue**

```css
--upfolio-blue: #5b67f7;
--upfolio-blue-rgb: 91, 103, 247;
```

**Upfolio Purple**

```css
--upfolio-purple: #7b3ff2;
--upfolio-purple-rgb: 123, 63, 242;
```

**Upfolio Dark**

```css
--upfolio-dark: #0f172a;
--upfolio-dark-rgb: 15, 23, 42;
```

### Gradient

**Primary Gradient**

```css
background: linear-gradient(135deg, #5b67f7 0%, #7b3ff2 100%);
```

## 📐 Logo Specifications

### Clear Space

Maintain clear space equal to the height of the icon around the logo.

### Minimum Sizes

- **Digital**: 120px width (logo-full), 32px (icon)
- **Print**: 1 inch width (logo-full), 0.25 inch (icon)

### File Formats

- **SVG**: Use for web, apps, and scalable needs
- **PNG**: Use when SVG isn't supported
- **Favicons**: Generated from icon variant

## 🚫 Logo Don'ts

❌ Don't rotate or skew the logo
❌ Don't change the logo colors
❌ Don't add effects (shadows, outlines, etc.)
❌ Don't place on busy backgrounds without proper contrast
❌ Don't stretch or distort the proportions
❌ Don't separate the icon from the wordmark in logo-full
❌ Don't use low-resolution versions

## ✅ Logo Do's

✅ Use official files only
✅ Maintain proper clear space
✅ Ensure good contrast with background
✅ Use appropriate variant for context
✅ Keep proportions intact
✅ Use vector files when possible

## 📱 Implementation Examples

### HTML

```html
<!-- Full logo -->
<img
  src="/logo-full.svg"
  alt="Upfolio - Upload. Share. Get hired."
  width="300"
/>

<!-- Icon only -->
<img src="/logo-icon.svg" alt="Upfolio" width="40" />
```

### CSS

```css
.logo {
  background-image: url("/logo.svg");
  background-size: contain;
  background-repeat: no-repeat;
}
```

### React/Next.js

```jsx
import Image from "next/image";

<Image src="/logo-full.svg" alt="Upfolio" width={300} height={120} />;
```

## 🔄 Updating Assets

If you need to update brand assets:

1. Follow the brand guidelines in `BRAND_GUIDELINES.md`
2. Maintain consistent colors and proportions
3. Test at multiple sizes
4. Ensure accessibility (contrast ratios)
5. Update this README with changes

## 📞 Questions?

For brand asset questions or custom sizes, refer to `BRAND_GUIDELINES.md` or contact the brand team.

---

**Upfolio** - Upload. Share. Get hired.
