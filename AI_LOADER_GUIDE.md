# AI Loader Component - Usage Guide

## 📦 Component Overview

The `AILoader` component provides an engaging, animated loading experience for AI operations. It displays rotating messages that keep users informed and entertained during longer processing times (especially for o1-mini reasoning models).

## 🎨 Features

- **Animated gradient spinner** with pulsing effects
- **Rotating contextual messages** every 2.5 seconds
- **Type-specific icons** (Resume, Cover Letter, Job Fit, General)
- **Smooth transitions** with Framer Motion
- **Dark mode support**
- **Time estimate display** (appears after 3 seconds)
- **Compact variant** for inline use

## 📖 Usage Examples

### Basic Usage

```tsx
import { AILoader } from "@/components/ui/ai-loader";

function MyComponent() {
  const [isGenerating, setIsGenerating] = useState(false);

  return <AILoader isLoading={isGenerating} type="resume" />;
}
```

### Type-Specific Messages

**Resume Generation:**

```tsx
<AILoader isLoading={isGenerating} type="resume" />
// Messages: "Analyzing job requirements...", "Optimizing for ATS systems...", etc.
```

**Cover Letter Generation:**

```tsx
<AILoader isLoading={isGenerating} type="cover-letter" />
// Messages: "Understanding company culture...", "Crafting your opening hook...", etc.
```

**Job Fit Analysis:**

```tsx
<AILoader isLoading={isAnalyzing} type="job-fit" />
// Messages: "Analyzing your background...", "Calculating fit score...", etc.
```

**General AI Operations:**

```tsx
<AILoader isLoading={isProcessing} type="general" />
// Messages: "AI is thinking...", "Processing your request...", etc.
```

### Custom Messages

```tsx
<AILoader
  isLoading={isProcessing}
  type="general"
  customMessages={[
    "Parsing your resume...",
    "Extracting key skills...",
    "Building your profile...",
    "Almost done...",
  ]}
/>
```

### Compact Variant (Inline)

For buttons, modals, or inline displays:

```tsx
import { AILoaderCompact } from "@/components/ui/ai-loader";

<AILoaderCompact message="Generating resume..." />;
```

### Full-Screen Overlay

```tsx
{
  isGenerating && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl">
        <AILoader isLoading={true} type="resume" />
      </div>
    </div>
  );
}
```

### Modal Integration

```tsx
<Dialog open={isGenerating}>
  <DialogContent className="sm:max-w-md">
    <AILoader isLoading={true} type="cover-letter" />
  </DialogContent>
</Dialog>
```

## 🎯 Integration Examples

### Job Assistant Wizard

```tsx
// In job-assistant-wizard.tsx
const [isGenerating, setIsGenerating] = useState(false);

const handleGenerate = async () => {
  setIsGenerating(true);
  try {
    const response = await fetch("/api/job-assistant/generate", {
      method: "POST",
      body: JSON.stringify(data),
    });
    // Handle response
  } finally {
    setIsGenerating(false);
  }
};

return (
  <>
    {/* Show loader during generation */}
    {isGenerating && (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <AILoader
          isLoading={true}
          type={generateResume ? "resume" : "cover-letter"}
        />
      </div>
    )}

    {/* Your wizard content */}
    <Button onClick={handleGenerate}>Generate</Button>
  </>
);
```

### Profile Enhancement

```tsx
const [isEnhancing, setIsEnhancing] = useState(false);

<AILoader
  isLoading={isEnhancing}
  type="general"
  customMessages={[
    "Analyzing your profile...",
    "Generating professional bio...",
    "Crafting compelling tagline...",
    "Optimizing SEO metadata...",
    "Finalizing enhancements...",
  ]}
/>;
```

### AI Chat

```tsx
const [isThinking, setIsThinking] = useState(false);

<AILoaderCompact message="AI is thinking..." className="my-4" />;
```

## 🎨 Message Guidelines

### Best Practices

✅ **Be specific** - Tell users exactly what's happening
✅ **Use active voice** - "Analyzing..." not "Being analyzed..."
✅ **Show progress** - Messages should indicate forward movement
✅ **Match context** - Tailor messages to the operation type
✅ **Stay professional** - Maintain brand voice

### Message Examples by Category

**Analysis Operations:**

- "Analyzing job requirements..."
- "Evaluating your experience..."
- "Comparing skills and qualifications..."
- "Calculating compatibility score..."

**Generation Operations:**

- "Crafting your tailored resume..."
- "Writing compelling introduction..."
- "Optimizing for ATS systems..."
- "Polishing the final draft..."

**Optimization Operations:**

- "Fine-tuning keyword placement..."
- "Enhancing readability..."
- "Optimizing for impact..."
- "Strengthening key points..."

**Finalization Operations:**

- "Adding finishing touches..."
- "Running quality checks..."
- "Finalizing document..."
- "Almost ready..."

## 🔧 Customization

### Styling

Add custom classes:

```tsx
<AILoader
  isLoading={true}
  type="resume"
  className="my-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl"
/>
```

### Message Timing

Default rotation is 2.5 seconds. To customize, modify the interval in the component:

```tsx
// In ai-loader.tsx
setInterval(() => {
  setMessageIndex((prev) => (prev + 1) % messages.length);
}, 3000); // Change to 3 seconds
```

### Icons

Customize icons per type in the component:

```tsx
{
  type === "resume" && <Target className="w-8 h-8 text-purple-600" />;
}
{
  type === "custom" && <YourIcon className="w-8 h-8 text-blue-600" />;
}
```

## 📊 Performance

- **Lightweight**: Minimal performance impact
- **Smooth animations**: 60fps with Framer Motion
- **Auto cleanup**: Intervals cleared on unmount
- **No layout shift**: Fixed dimensions prevent CLS

## 🌙 Dark Mode

Fully supports dark mode with automatic color switching:

- Light mode: Vibrant colors on white background
- Dark mode: Softer colors on dark background

## 🚀 Advanced Patterns

### Progress Tracking

For operations with known steps:

```tsx
const steps = [
  "Parsing resume...",
  "Analyzing job posting...",
  "Matching requirements...",
  "Generating content...",
  "Optimizing output...",
];

const [currentStep, setCurrentStep] = useState(0);

<AILoader isLoading={true} customMessages={[steps[currentStep]]} />;
```

### Error Recovery

```tsx
const [error, setError] = useState<string | null>(null);

{
  error ? (
    <ErrorMessage message={error} />
  ) : (
    <AILoader isLoading={isGenerating} type="resume" />
  );
}
```

## 📝 Accessibility

- **ARIA labels**: Add for screen readers if needed
- **Reduced motion**: Respects `prefers-reduced-motion`
- **Keyboard navigation**: No interactive elements (display only)

## 🎯 When to Use

**Use AILoader for:**

- ✅ AI generation operations (5+ seconds)
- ✅ Complex processing tasks
- ✅ Operations where user needs context
- ✅ Full-page or modal overlays

**Don't use for:**

- ❌ Quick API calls (< 2 seconds) - use spinner instead
- ❌ Background operations - use toast notifications
- ❌ Multiple simultaneous operations - use progress bars

## 🔗 Related Components

- `AILoaderCompact` - Inline variant
- Standard spinners - For quick operations
- Progress bars - For deterministic progress
- Skeleton loaders - For content loading

---

**Component Location**: `components/ui/ai-loader.tsx`  
**Dependencies**: Framer Motion, Lucide Icons  
**Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)
