# Beta Program - User-Facing Locations

## 🎨 Visual Map of Changes

### 1. **EVERY PAGE - Top Banner**

```
┌──────────────────────────────────────────────────────────────┐
│ ✨ Beta Access: Upfolio is in active development. Enjoy     │
│    500 free credits to explore all features! 🚀         [X] │
└──────────────────────────────────────────────────────────────┘
```

**Features**:

- Purple → Blue → Cyan gradient background
- Animated sparkles icon
- Dismissible (X button)
- localStorage persistence

---

### 2. **DASHBOARD - Credits Card**

```
┌───────────────────────────────────────────────────────────┐
│  ✨  Beta Credits                                         │
│                                                           │
│      500 / 500 credits                                   │
│      [████████████████████████] 100%                     │
│                                                           │
│  ℹ️  Beta Offer: You started with 500 free credits!      │
│      While Upfolio is in development, explore all         │
│      features at no cost.                                 │
│                                                           │
│  Credit costs:                                            │
│  • Job Fit Analysis: 2 credits                           │
│  • Tailored Cover Letter: 10 credits                     │
│  • Optimized Resume: 20 credits                          │
└───────────────────────────────────────────────────────────┘
```

**Location**: Dashboard → Quick Actions section (first card)  
**Updates**: Real-time via API every refresh

---

### 3. **TERMS OF SERVICE - Legal Framework**

#### Section 2.1 - Beta Status

```
2. Description of Service
  2.1 Beta Status

  Upfolio is currently in active development (beta).
  During this period:

  • New users receive 500 free credits to explore all
    platform features
  • Features, functionality, and user interfaces may
    change without notice
  • The Service may experience occasional downtime,
    bugs, or performance issues
  • We actively collect feedback to improve the platform
```

#### Section 7 - Pricing and Payment (NEW)

```
7. Pricing and Payment

  7.1 Beta Credits
  During the beta period, all new users receive 500
  free credits to use AI-powered features.

  7.2 Future Pricing
  ⚠️ Upfolio reserves the right to introduce paid
  features, subscription plans, or credit pricing
  at any time.

  We will provide reasonable advance notice before
  implementing any pricing changes. Changes may include:

  • Introduction of paid subscription tiers
  • Credit packages available for purchase
  • Premium features requiring additional payment
  • Changes to credit costs for specific features
  • Limitations on free tier usage

  7.3 Grandfathering and Transitions
  While we will make reasonable efforts to grandfather
  early beta users into favorable pricing, we make no
  guarantee of ongoing free access to all features.

  Users will be notified at least 30 days before any
  pricing changes.
```

#### Section 10 - Beta Disclaimer

```
10. Disclaimer of Warranties

  BETA DISCLAIMER: As the Service is currently in
  beta development, you acknowledge and accept that:

  • Features may be incomplete, experimental, or
    subject to change
  • Data loss, service interruptions, or errors may
    occur without notice
  • AI-generated content may contain inaccuracies
  • Performance may not meet production standards
```

**Access**: Footer link on all pages → `/legal/terms`

---

## 📱 Responsive Behavior

### Desktop

- **Banner**: Full width, horizontal layout
- **Credits Card**: 1/3 width in 3-column grid
- **Terms**: Two-column readable width

### Mobile

- **Banner**: Stacks text, smaller padding
- **Credits Card**: Full width, maintains readability
- **Terms**: Single column, optimized for scrolling

---

## 🎨 Design Language

All elements use **shared Upfolio brand**:

### Colors

- Gradient: `from-purple-600 via-blue-600 to-cyan-600`
- Background: `from-purple-50 to-blue-50` (light)
- Dark mode: `from-purple-900/20 to-blue-900/20`

### Typography

- Headlines: `typography.h3` (from `lib/styles.ts`)
- Body: `typography.body`
- Small text: `text-sm`

### Icons

- Sparkles ✨ (Lucide React)
- Info ℹ️ (Lucide React)
- CheckCircle ✓ (Lucide React)

---

## 🔄 Data Flow

```
User Opens Dashboard
     ↓
useEffect triggers
     ↓
fetch('/api/user/token-balance')
     ↓
Session validated (NextAuth)
     ↓
getUserTokenBalance(userId) → Database
     ↓
Returns: { token_credits: 500, tokens_used: 0 }
     ↓
State updates → CreditsInfoCard re-renders
     ↓
User sees: "500 / 500 credits"
```

**Auto-refresh**: Every time refreshKey changes (after uploads, etc.)

---

## 🧪 User Testing Scenarios

### Scenario 1: Brand New User

1. Visit landing page → **See beta banner**
2. Click "Try It Free – No Sign Up" → Guest upload
3. Register account → Get 500 credits (DB default)
4. View dashboard → **See CreditsInfoCard with 500/500**
5. Use Job Assistant → Credits decrement
6. Check Terms → **Read pricing policy**

### Scenario 2: Existing User (Post-Migration)

1. Migration ran automatically → +400 credits
2. Login to dashboard → **See beta banner** (first time)
3. Dismiss banner → Saved to localStorage
4. View dashboard → **See updated 500 credits**
5. Use features → Normal flow

### Scenario 3: Curious User

1. See beta banner → Click to learn more
2. Navigate to `/legal/terms`
3. Read Section 7: "Pricing and Payment"
4. Understand: "They can charge later with 30 days notice"
5. Return to app → Continue using with informed consent

---

## 💡 Key User Messages

### Banner (Optimistic)

> "Beta Access: Enjoy 500 free credits while we build!"

### Dashboard (Informative)

> "You started with 500 free credits! Explore all features at no cost."

### Terms (Transparent)

> "We reserve the right to introduce paid features at any time, with 30 days notice."

---

**Tone**: Enthusiastic but honest  
**Goal**: Build trust while protecting business flexibility  
**Result**: Users feel valued (beta access) AND informed (pricing terms)
