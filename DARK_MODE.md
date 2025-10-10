# Dark Mode Implementation

This portfolio now supports automatic light and dark mode based on the user's browser/system preferences.

## How It Works

### 1. System Preference Detection
The app automatically detects the user's system color scheme preference using the `prefers-color-scheme` media query.

### 2. Implementation Details

#### Layout (app/layout.tsx)
- Added `suppressHydrationWarning` to the `<html>` tag to prevent hydration warnings
- Included an inline script in the `<head>` that:
  - Checks the system preference immediately on page load (before React hydrates)
  - Adds/removes the `dark` class on the `<html>` element
  - Listens for system preference changes and updates automatically

#### CSS Variables (app/globals.css)
- Defined light mode variables in `:root`
- Defined dark mode variables in `.dark` class
- Variables include:
  - `--background`: Page background color
  - `--foreground`: Primary text color
  - `--card-background`: Glass morphism card backgrounds
  - `--card-border`: Card border colors
  - `--text-secondary`: Secondary text color
  - `--accent`: Primary accent color
  - `--accent-hover`: Accent hover state

#### Tailwind Dark Mode
All components use Tailwind's `dark:` variant for dark mode styles:
- `dark:text-gray-300` for text colors
- `dark:bg-gray-800` for backgrounds
- `dark:border-gray-700` for borders
- `dark:hover:text-purple-400` for interactive states

## Testing Dark Mode

### On macOS:
1. Open System Preferences → General → Appearance
2. Toggle between "Light" and "Dark"
3. The portfolio will automatically switch themes

### On Windows:
1. Open Settings → Personalization → Colors
2. Choose "Light" or "Dark" under "Choose your mode"
3. The portfolio will automatically switch themes

### In Browser DevTools:
1. Open Chrome DevTools (F12)
2. Click the three dots menu → More tools → Rendering
3. Find "Emulate CSS media feature prefers-color-scheme"
4. Select "prefers-color-scheme: dark" or "light"

## Components with Dark Mode Support

All components support dark mode:
- ✅ Navigation
- ✅ Hero Section
- ✅ About Section
- ✅ Experience Section
- ✅ Skills Section
- ✅ Projects Section
- ✅ AI Chat Section
- ✅ Contact Section
- ✅ Footer

## Color Scheme

### Light Mode
- Background: `#f5f5f7` (soft gray)
- Foreground: `#1d1d1f` (dark text)
- Card Background: `rgba(255, 255, 255, 0.7)` (white with transparency)
- Accent: `#007aff` (iOS blue)

### Dark Mode
- Background: `#000000` (pure black)
- Foreground: `#f5f5f7` (light text)
- Card Background: `rgba(28, 28, 30, 0.7)` (dark gray with transparency)
- Accent: `#0a84ff` (brighter blue for dark mode)

## Accessibility
- Focus states work in both light and dark modes
- Color contrast ratios meet WCAG AA standards
- All interactive elements have appropriate hover states
