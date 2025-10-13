# AI Loader Messages - Quick Reference

## 🎯 Pre-Built Message Sets

### Resume Generation (8 messages)

Perfect for: ATS-optimized resume tailoring, keyword optimization

```tsx
<AILoader isLoading={true} type="resume" />
```

1. "Analyzing job requirements..."
2. "Matching your experience to role needs..."
3. "Optimizing for ATS systems..."
4. "Crafting compelling bullet points..."
5. "Highlighting your key achievements..."
6. "Fine-tuning keyword placement..."
7. "Structuring for maximum impact..."
8. "Polishing the final touches..."

---

### Cover Letter Generation (8 messages)

Perfect for: Personalized cover letters, persuasive writing

```tsx
<AILoader isLoading={true} type="cover-letter" />
```

1. "Understanding company culture..."
2. "Identifying your unique value..."
3. "Crafting your opening hook..."
4. "Building persuasive arguments..."
5. "Aligning with job requirements..."
6. "Personalizing the narrative..."
7. "Strengthening your call-to-action..."
8. "Perfecting the tone..."

---

### Job Fit Analysis (8 messages)

Perfect for: Skill matching, compatibility scoring

```tsx
<AILoader isLoading={true} type="job-fit" />
```

1. "Analyzing your background..."
2. "Evaluating job requirements..."
3. "Comparing skills and experience..."
4. "Identifying your strengths..."
5. "Spotting potential gaps..."
6. "Calculating fit score..."
7. "Generating recommendations..."
8. "Finalizing analysis..."

---

### General AI Operations (6 messages)

Perfect for: Generic AI tasks, fallback option

```tsx
<AILoader isLoading={true} type="general" />
```

1. "AI is thinking..."
2. "Processing your request..."
3. "Analyzing data patterns..."
4. "Optimizing results..."
5. "Almost there..."
6. "Finalizing output..."

---

## 🎨 Custom Message Examples

### Profile Enhancement

```tsx
<AILoader
  isLoading={true}
  type="general"
  customMessages={[
    "Analyzing your resume...",
    "Generating professional title...",
    "Crafting compelling taglines...",
    "Identifying your key strengths...",
    "Creating your professional bio...",
    "Optimizing your profile...",
    "Adding finishing touches...",
  ]}
/>
```

### Resume Parsing

```tsx
<AILoader
  customMessages={[
    "Reading PDF document...",
    "Extracting text content...",
    "Identifying sections...",
    "Parsing work experience...",
    "Extracting education details...",
    "Organizing skills...",
    "Structuring data...",
  ]}
/>
```

### AI Chat Response

```tsx
<AILoader
  customMessages={[
    "Understanding your question...",
    "Searching knowledge base...",
    "Analyzing context...",
    "Formulating response...",
    "Checking accuracy...",
    "Generating answer...",
  ]}
/>
```

### Batch Processing

```tsx
<AILoader
  customMessages={[
    "Processing document 1 of 5...",
    "Processing document 2 of 5...",
    "Processing document 3 of 5...",
    "Processing document 4 of 5...",
    "Processing document 5 of 5...",
    "Finalizing results...",
  ]}
/>
```

### SEO Optimization

```tsx
<AILoader
  customMessages={[
    "Analyzing page content...",
    "Generating meta tags...",
    "Optimizing descriptions...",
    "Creating title variations...",
    "Checking keyword density...",
    "Finalizing SEO data...",
  ]}
/>
```

### Image Generation

```tsx
<AILoader
  customMessages={[
    "Understanding your prompt...",
    "Composing the scene...",
    "Rendering details...",
    "Applying style...",
    "Enhancing quality...",
    "Finalizing image...",
  ]}
/>
```

---

## 📝 Message Writing Guidelines

### ✅ DO:

- **Be specific**: "Optimizing for ATS systems" ✓
- **Use active voice**: "Analyzing requirements" ✓
- **Show progress**: "Fine-tuning keywords" ✓
- **Stay professional**: Match brand voice ✓
- **Keep it concise**: 2-6 words ideal ✓

### ❌ DON'T:

- Generic: "Processing..." ✗
- Passive: "Being analyzed..." ✗
- Static: "Please wait..." ✗
- Unprofessional: "Working hard..." ✗
- Too long: Full sentences ✗

---

## 🎯 Message Flow Patterns

### Linear Progress (Good for known steps)

```
1. "Starting analysis..."
2. "Processing data..."
3. "Generating results..."
4. "Finalizing output..."
```

### Deepening Analysis (Good for AI reasoning)

```
1. "Reading job requirements..."
2. "Understanding key skills..."
3. "Matching your experience..."
4. "Optimizing alignment..."
5. "Polishing final output..."
```

### Iterative Refinement (Good for generation)

```
1. "Drafting initial content..."
2. "Refining structure..."
3. "Enhancing clarity..."
4. "Optimizing impact..."
5. "Adding final touches..."
```

---

## 🔧 Advanced Customization

### Dynamic Messages Based on State

```tsx
const getMessages = () => {
  if (isParsingResume) {
    return ["Parsing resume...", "Extracting data..."];
  } else if (isGenerating) {
    return ["Generating content...", "Optimizing output..."];
  }
  return ["Processing..."];
};

<AILoader customMessages={getMessages()} />;
```

### Time-Based Messages

```tsx
const messages = [
  "Starting up...", // 0-3s
  "Making progress...", // 3-6s
  "Almost there...", // 6-9s
  "Final steps...", // 9s+
];
```

### Humorous Messages (Use sparingly)

```tsx
const funMessages = [
  "Teaching AI to be creative...",
  "Consulting with digital neurons...",
  "Brewing some binary magic...",
  "Convincing the algorithm...",
  "Almost done! (We promise)",
];
```

---

## 📊 Message Timing

**Default**: 2.5 seconds per message

**Why 2.5 seconds?**

- Long enough to read comfortably
- Short enough to show progress
- Sweet spot for engagement

**Recommended Minimum Messages**: 4-8

- Covers 10-20 second operations
- Avoids repetition
- Maintains variety

---

## 🎨 Context-Specific Examples

### E-commerce

```
"Finding best matches...",
"Comparing prices...",
"Checking availability...",
"Calculating savings...",
```

### Content Writing

```
"Understanding topic...",
"Researching context...",
"Drafting outline...",
"Writing content...",
"Editing for clarity...",
```

### Data Analysis

```
"Loading dataset...",
"Detecting patterns...",
"Running calculations...",
"Generating insights...",
"Creating visualizations...",
```

### Translation

```
"Analyzing source text...",
"Understanding context...",
"Translating content...",
"Preserving meaning...",
"Polishing grammar...",
```

---

## 🚀 Quick Copy-Paste Templates

### Standard AI Generation

```tsx
<AILoader
  isLoading={isProcessing}
  customMessages={[
    "Analyzing your input...",
    "Processing with AI...",
    "Optimizing output...",
    "Finalizing results...",
  ]}
/>
```

### Multi-Step Process

```tsx
<AILoader
  isLoading={isProcessing}
  customMessages={[
    "Step 1: Preparation...",
    "Step 2: Analysis...",
    "Step 3: Generation...",
    "Step 4: Optimization...",
    "Step 5: Finalization...",
  ]}
/>
```

### Quick Operation (< 5 seconds)

```tsx
<AILoader
  isLoading={isProcessing}
  customMessages={["Processing...", "Almost done..."]}
/>
```

### Long Operation (> 15 seconds)

```tsx
<AILoader
  isLoading={isProcessing}
  customMessages={[
    "Starting analysis...",
    "Deep processing underway...",
    "This may take a moment...",
    "Ensuring quality results...",
    "Performing final checks...",
    "Optimizing output...",
    "Adding finishing touches...",
    "Almost ready...",
    "Final steps...",
    "Wrapping up...",
  ]}
/>
```

---

**Remember**: Messages should inform, engage, and reassure users that progress is being made!
