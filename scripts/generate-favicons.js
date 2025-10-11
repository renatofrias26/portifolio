#!/usr/bin/env node

/**
 * Favicon Generator for Upfolio
 *
 * This script generates favicon files from the logo SVGs.
 *
 * Prerequisites:
 * - Install sharp: npm install sharp
 *
 * Usage:
 * - node scripts/generate-favicons.js
 */

const fs = require("fs");
const path = require("path");

console.log("🎨 Upfolio Favicon Generator\n");

// Check if sharp is installed
let sharp;
try {
  sharp = require("sharp");
  console.log("✓ Sharp library found");
} catch (error) {
  console.log("❌ Sharp library not found");
  console.log("\nTo generate PNG favicons, install sharp:");
  console.log("  npm install sharp");
  console.log("  or");
  console.log("  pnpm add sharp\n");
  console.log("Then run this script again.\n");
  console.log("Alternatively, you can:");
  console.log("1. Open public/icon-for-fav.svg in a browser");
  console.log("2. Take a screenshot");
  console.log("3. Use an online tool like https://realfavicongenerator.net/");
  console.log("4. Or use Figma/Sketch to export PNGs\n");
  process.exit(1);
}

const publicDir = path.join(__dirname, "../public");
const iconSvgPath = path.join(publicDir, "icon-for-fav.svg");

// Check if icon-for-fav.svg exists
if (!fs.existsSync(iconSvgPath)) {
  console.log("❌ icon-for-fav.svg not found in public folder");
  process.exit(1);
}

console.log("✓ Source file found: icon-for-fav.svg\n");

// Favicon sizes to generate
const sizes = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 },
];

async function generateFavicons() {
  console.log("Generating favicons...\n");

  for (const { name, size } of sizes) {
    try {
      const outputPath = path.join(publicDir, name);

      await sharp(iconSvgPath).resize(size, size).png().toFile(outputPath);

      console.log(`✓ Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.log(`❌ Failed to generate ${name}: ${error.message}`);
    }
  }

  // Generate OG image (1200x630)
  try {
    const ogPath = path.join(publicDir, "og-image.png");
    const logoFullPath = path.join(publicDir, "logo-full.svg");

    if (fs.existsSync(logoFullPath)) {
      // Create a background and overlay the logo
      await sharp({
        create: {
          width: 1200,
          height: 630,
          channels: 4,
          background: { r: 248, g: 250, b: 252, alpha: 1 },
        },
      })
        .composite([
          {
            input: await sharp(logoFullPath)
              .resize(800, null, { fit: "inside" })
              .toBuffer(),
            gravity: "center",
          },
        ])
        .png()
        .toFile(ogPath);

      console.log(`✓ Generated og-image.png (1200x630)`);
    }
  } catch (error) {
    console.log(`❌ Failed to generate OG image: ${error.message}`);
  }

  console.log("\n✅ Favicon generation complete!");
  console.log("\nGenerated files:");
  sizes.forEach(({ name }) => console.log(`  - ${name}`));
  console.log("  - og-image.png");

  console.log("\nNext steps:");
  console.log("1. Update app/layout.tsx with new favicon references");
  console.log("2. Test favicons in different browsers");
  console.log("3. Add to git and deploy\n");
}

generateFavicons().catch((error) => {
  console.error("Error generating favicons:", error);
  process.exit(1);
});
