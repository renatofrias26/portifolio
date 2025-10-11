# Upfolio Brand Assets - Manual Creation Guide

If you need to manually create PNG versions of the logo or favicons, follow this guide.

## Option 1: Using Online Tools (Easiest)

### For Favicons

**RealFaviconGenerator (Recommended)**

1. Go to https://realfavicongenerator.net/
2. Upload `public/logo-icon.svg`
3. Customize settings if needed
4. Download the generated package
5. Replace files in `/public`

**Favicon.io**

1. Go to https://favicon.io/favicon-converter/
2. Upload `public/logo-icon.svg`
3. Download the generated files
4. Place in `/public`

### For OG Images

**Canva**

1. Create 1200x630px design
2. Add gradient background (Blue #5B67F7 to Purple #7B3FF2)
3. Import and center the logo
4. Add tagline "Upload. Share. Get hired."
5. Export as PNG → `og-image.png`

## Option 2: Using Design Tools

### Figma

1. **Import SVG**

   - Drag `logo-icon.svg` into Figma
   - Ensure it's vector (not rasterized)

2. **Export Favicons**

   - Select the icon
   - Right panel → Export
   - Add these export sizes:
     - 16x16 → `favicon-16x16.png`
     - 32x32 → `favicon-32x32.png`
     - 180x180 → `apple-touch-icon.png`
     - 192x192 → `android-chrome-192x192.png`
     - 512x512 → `android-chrome-512x512.png`
   - Export all

3. **Create OG Image**
   - Create new frame: 1200x630px
   - Add gradient background
   - Import `logo-full.svg`
   - Center and resize appropriately
   - Export as PNG

### Adobe Illustrator

1. Open SVG file
2. File → Export → Export As
3. Choose PNG format
4. Set resolution for each size
5. Export

### Sketch

1. Import SVG
2. Create artboards for each size
3. Export as PNG (@1x)

## Option 3: Using Command Line (macOS)

If you have ImageMagick installed:

```bash
# Install ImageMagick
brew install imagemagick

# Convert SVG to PNG at different sizes
convert -background none public/logo-icon.svg -resize 16x16 public/favicon-16x16.png
convert -background none public/logo-icon.svg -resize 32x32 public/favicon-32x32.png
convert -background none public/logo-icon.svg -resize 180x180 public/apple-touch-icon.png
convert -background none public/logo-icon.svg -resize 192x192 public/android-chrome-192x192.png
convert -background none public/logo-icon.svg -resize 512x512 public/android-chrome-512x512.png
```

## Option 4: Using Node.js Script

We've provided a script that uses Sharp:

```bash
# Install sharp
pnpm add -D sharp

# Run the generator
node scripts/generate-favicons.js
```

## Required Files Checklist

Make sure you have these files in `/public`:

### Favicons

- [ ] `favicon.ico` (ICO format, multiple sizes)
- [ ] `favicon-16x16.png`
- [ ] `favicon-32x32.png`
- [ ] `apple-touch-icon.png` (180x180)
- [ ] `android-chrome-192x192.png`
- [ ] `android-chrome-512x512.png`

### Logo Files (Already Created)

- [x] `logo.svg`
- [x] `logo-icon.svg`
- [x] `logo-full.svg`
- [x] `logo-light.svg`
- [x] `logo-dark.svg`

### Social/OG Images

- [ ] `og-image.png` (1200x630 for social sharing)

## After Creating Assets

### 1. Update app/layout.tsx

Add favicon references to metadata:

```typescript
export const metadata: Metadata = {
  // ... existing metadata
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    // ... existing OG data
    images: ["/og-image.png"],
  },
  twitter: {
    // ... existing Twitter data
    images: ["/og-image.png"],
  },
};
```

### 2. Create manifest.json

Add a web manifest for PWA support:

```json
{
  "name": "Upfolio",
  "short_name": "Upfolio",
  "description": "Upload. Share. Get hired.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0F172A",
  "theme_color": "#5B67F7",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 3. Test Your Favicons

**Browser Testing**

- Chrome: Check tab icon
- Firefox: Check tab icon
- Safari: Check tab and bookmark icons
- Mobile: Check home screen icon (iOS/Android)

**Validation Tools**

- https://realfavicongenerator.net/favicon_checker
- https://www.favicon-checker.com/

### 4. Optimize Images

Before deploying, optimize PNGs:

- Use https://tinypng.com/
- Or run: `pnpm add -D imagemin-cli && imagemin public/*.png --out-dir=public`

## Tips

1. **Keep SVGs as source of truth** - Always generate from SVG
2. **Test at actual size** - Favicons look different at 16x16
3. **Check contrast** - Ensure visibility on all backgrounds
4. **Optimize file size** - Keep PNGs under 50KB when possible
5. **Version control** - Commit all generated assets

## Need Help?

Refer to:

- `BRAND_GUIDELINES.md` for design standards
- `public/ASSETS_README.md` for usage guidelines
- `public/brand-preview.html` to preview logos

---

**Upfolio** - Upload. Share. Get hired.
