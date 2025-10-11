# Archive Feature - Visual Guide

## UI Overview

### Version List with Archive Toggle

```
┌───────────────────────────────────────────────────────────────┐
│  Resume Version Management                                    │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 🗄️ Show Archived Versions              [○────]     │    │
│  │    3 active, 2 archived                              │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Version 5                        ✅ Published        │    │
│  │ Created: Dec 10, 2025                               │    │
│  │ [👁️] [✏️]                    📄 View PDF             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Version 4                        🕐 Draft            │    │
│  │ Created: Dec 9, 2025                                │    │
│  │ [👁️] [✏️] [🗄️]               [Publish] 📄 View PDF   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Version 3                        🕐 Draft            │    │
│  │ Created: Dec 8, 2025                                │    │
│  │ [👁️] [✏️] [🗄️]               [Publish] 📄 View PDF   │    │
│  └─────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────┘
```

### Version List with Archives Shown

```
┌───────────────────────────────────────────────────────────────┐
│  Resume Version Management                                    │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 🗄️ Show Archived Versions              [●────]     │    │
│  │    Showing all versions (5 total)                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Version 5                        ✅ Published        │    │
│  │ Created: Dec 10, 2025                               │    │
│  │ [👁️] [✏️]                    📄 View PDF             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Version 4                        🕐 Draft            │    │
│  │ Created: Dec 9, 2025                                │    │
│  │ [👁️] [✏️] [🗄️]               [Publish] 📄 View PDF   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Version 3                        🕐 Draft            │    │
│  │ Created: Dec 8, 2025                                │    │
│  │ [👁️] [✏️] [🗄️]               [Publish] 📄 View PDF   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Version 2                        📦 Archived         │ ← Orange
│  │ Created: Dec 7, 2025                                │    │
│  │ [👁️] [✏️] [📤]                   📄 View PDF         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Version 1                        📦 Archived         │ ← Orange
│  │ Created: Dec 6, 2025                                │    │
│  │ [👁️] [✏️] [📤]                   📄 View PDF         │    │
│  └─────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────┘
```

## Button Legend

| Icon      | Action    | Available For          |
| --------- | --------- | ---------------------- |
| 👁️        | Preview   | All versions           |
| ✏️        | Edit      | All versions           |
| 🗄️        | Archive   | Active drafts only     |
| 📤        | Unarchive | Archived versions only |
| [Publish] | Publish   | Active drafts only     |

## Status Badges

| Badge        | Color  | Meaning                     |
| ------------ | ------ | --------------------------- |
| ✅ Published | Green  | Currently live version      |
| 🕐 Draft     | Gray   | Unpublished, active version |
| 📦 Archived  | Orange | Hidden from default view    |

## Card Styling

### Published Version

- Green border (`border-green-300`)
- Light green background (`bg-green-50`)
- Full opacity
- Cannot be archived

### Active Draft

- Gray border (`border-gray-200`)
- Normal background
- Full opacity
- Can be archived or published

### Archived Version

- Orange border (`border-orange-300`)
- Light orange background (`bg-orange-50`)
- 75% opacity (`opacity-75`)
- Can be unarchived

## Workflows

### Archive Workflow

```
1. Click Archive button (🗄️) on draft version
   ↓
2. Version card turns orange
   ↓
3. Archive button changes to Unarchive (📤)
   ↓
4. Publish button disappears
   ↓
5. Version hidden when toggle is OFF
```

### Unarchive Workflow

```
1. Toggle "Show Archived" ON
   ↓
2. Find archived version (orange)
   ↓
3. Click Unarchive button (📤)
   ↓
4. Version returns to normal gray
   ↓
5. Publish button reappears
   ↓
6. Can now publish or archive again
```

### Cannot Archive Published

```
Published Version (Version 5)
├── Archive button: HIDDEN ❌
├── Reason: Published versions cannot be archived
└── Solution: Unpublish first, then archive
```

## Mobile Responsive Behavior

On smaller screens:

- Toggle remains at top
- Version cards stack vertically
- Button icons remain visible
- Text labels may be hidden on very small screens
- Badges wrap to new line if needed

## Accessibility

- Toggle uses standard checkbox with visible switch
- All buttons have descriptive `title` attributes
- Color coding supplemented with icons
- Keyboard navigation supported
- Screen reader friendly status badges

## Color Scheme

### Light Mode

- Published: Green (#10b981, #d1fae5)
- Draft: Gray (#6b7280, #f3f4f6)
- Archived: Orange (#f97316, #fed7aa)

### Dark Mode

- Published: Green (#10b981, dark tints)
- Draft: Gray (#6b7280, dark tints)
- Archived: Orange (#f97316, dark tints)

## Animation

- Versions fade in with stagger effect (0.1s delay each)
- Archive/Unarchive actions trigger smooth transitions
- Toggle switch slides smoothly
- Hover states on all interactive elements

## Example States

### All Active (Default View)

```
Toggle: OFF
Showing: 3 versions
Hidden: 2 archived versions
Message: "3 active, 2 archived"
```

### Showing Archives

```
Toggle: ON
Showing: 5 versions (3 active + 2 archived)
Hidden: None
Message: "Showing all versions (5 total)"
```

### No Archived Versions

```
Toggle: OFF
Showing: 3 versions
Hidden: None
Message: "3 active, 0 archived"
```

### All Archived (Rare)

```
Toggle: OFF
Showing: 0 versions
Message: "No resume versions yet..."
Note: Only happens if all drafts are archived
```
