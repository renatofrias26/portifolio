/**
 * Shared Style Classes and Utilities
 *
 * Centralized styling configuration to maintain consistency across the application.
 * Use these classes instead of hardcoding values to ensure mobile-responsive design.
 */

/**
 * Container Padding Classes
 * Responsive padding that scales from mobile to desktop
 */
export const containerPadding = {
  // Page containers
  page: "px-3 sm:px-4 md:px-6 lg:px-8",

  // Section containers
  section: "py-8 sm:py-12 md:py-16 lg:py-20",
  sectionX: "px-4 sm:px-6 lg:px-8",

  // Card/Modal padding
  card: "p-4 sm:p-6 md:p-8",
  cardSmall: "p-3 sm:p-4 md:p-6",
  cardLarge: "p-6 sm:p-8 md:p-10 lg:p-12",

  // Form containers
  form: "p-4 sm:p-6 md:p-8",

  // Admin dashboard specific
  dashboard: "px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 lg:py-12",
} as const;

/**
 * Spacing Classes
 * Consistent spacing for margins and gaps
 */
export const spacing = {
  // Vertical spacing between elements
  section: "mb-6 sm:mb-8 md:mb-12",
  subsection: "mb-4 sm:mb-6 md:mb-8",
  element: "mb-3 sm:mb-4",
  small: "mb-2 sm:mb-3",

  // Gaps for flex/grid
  gapSmall: "gap-2 sm:gap-3",
  gapMedium: "gap-3 sm:gap-4 md:gap-6",
  gapLarge: "gap-4 sm:gap-6 md:gap-8",

  // Form-specific spacing
  formFields: "space-y-3 sm:space-y-4", // Vertical spacing between form fields
  formGrid: "gap-3 sm:gap-4", // Grid gap for form layouts
  buttonGroup: "flex gap-2 sm:gap-3", // Button group spacing

  // Component spacing
  component: "space-y-4 sm:space-y-6", // Internal spacing for components
  tight: "space-y-2 sm:space-y-3", // Tight spacing for compact lists
} as const;

/**
 * Typography Classes
 * Responsive font sizes
 */
export const typography = {
  // Headings
  h1: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold",
  h2: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold",
  h3: "text-xl sm:text-2xl md:text-3xl font-bold",
  h4: "text-lg sm:text-xl md:text-2xl font-bold",
  h5: "text-base sm:text-lg md:text-xl font-bold",

  // Body text
  body: "text-sm sm:text-base",
  bodyLarge: "text-base sm:text-lg md:text-xl",
  bodySmall: "text-xs sm:text-sm",

  // Special text
  lead: "text-lg sm:text-xl md:text-2xl",
  caption: "text-xs sm:text-sm",
} as const;

/**
 * Logo Sizes
 * Consistent logo sizing across pages
 * Note: Only width is set to maintain aspect ratio
 */
export const logoSizes = {
  // Registration/Login pages
  auth: {
    width: "w-[80px]",
    imageWidth: 80,
    imageHeight: 48,
    imageWidthSm: 160,
    imageHeightSm: 64,
  },

  // Landing page hero
  hero: {
    width: "w-[200px] sm:w-[280px] md:w-[350px]",
    imageWidth: 200,
    imageHeight: 52,
    imageWidthSm: 350,
    imageHeightSm: 90,
  },

  // Header/Navigation
  header: {
    width: "w-[100px] sm:w-[120px] md:w-[140px]",
    imageWidth: 100,
    imageHeight: 40,
    imageWidthSm: 140,
    imageHeightSm: 56,
  },
} as const;
/**
 * Button Classes
 * Consistent button sizing and padding
 */
export const buttons = {
  // Sizes
  small: "px-3 py-1.5 sm:px-4 sm:py-2 text-sm",
  medium: "px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base",
  large: "px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg",

  // Primary button (gradient)
  primary:
    "px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg",

  // Secondary button (outlined)
  secondary:
    "px-4 py-2 sm:px-6 sm:py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-purple-200 dark:border-purple-700 rounded-xl font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300",

  // Tab button (for tab navigation)
  tab: "px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-all",
  tabActive:
    "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg",
  tabInactive:
    "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
} as const;

/**
 * Hero Section Classes
 */
export const hero = {
  container: "py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32",
  title: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold",
  subtitle: "text-lg sm:text-xl md:text-2xl",
  description: "text-base sm:text-lg md:text-xl",
} as const;

/**
 * Card Classes
 */
export const cards = {
  // Feature cards
  feature:
    "group p-4 sm:p-6 md:p-8 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300",

  // Profile cards
  profile: "p-4 sm:p-5 md:p-6",

  // Glass effect cards
  glass: "glass rounded-2xl",

  // Base card (for panels and containers)
  base: "glass rounded-2xl p-4 sm:p-6",

  // Interactive card (for clickable items)
  interactive:
    "glass rounded-xl p-3 sm:p-4 hover:shadow-lg transition-all duration-200",
} as const;

/**
 * Form Input Classes
 */
export const formInput = {
  base: "w-full px-3 py-2 sm:px-4 sm:py-2.5 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base",
  label:
    "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2",
  error:
    "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm",
} as const;

/**
 * Helper function to combine class strings
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Helper to get full container classes
 */
export function getContainerClasses(
  type: keyof typeof containerPadding,
): string {
  return containerPadding[type];
}

/**
 * Helper to get full spacing classes
 */
export function getSpacingClasses(type: keyof typeof spacing): string {
  return spacing[type];
}

/**
 * Maximum widths for containers
 */
export const maxWidths = {
  content: "max-w-7xl",
  prose: "max-w-4xl",
  form: "max-w-md",
  card: "max-w-2xl",
} as const;

/**
 * Common Layout Patterns
 */
export const layouts = {
  // Centered content with max width
  centered: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  centeredNarrow: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
  centeredForm: "max-w-md mx-auto px-3 sm:px-4",

  // Full width sections
  section: "py-8 sm:py-12 md:py-16 lg:py-20",

  // Grid layouts
  grid2: "grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8",
  grid3: "grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8",
  grid4: "grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8",
} as const;
