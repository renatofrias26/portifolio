# Beta Program & Credits Implementation Guide

## Overview

Upfolio is currently in **active beta development**. This document outlines how we communicate beta status, free credits, and future pricing to users.

---

## 🎯 Key Messages to Users

### 1. **Beta Status Communication**

- **What**: Upfolio is actively being developed and improved
- **Where**: Beta banner (dismissible), dashboard, Terms of Service
- **Benefit**: 500 free credits to explore all features

### 2. **Credit System**

- **Starting Credits**: 500 (beta users only)
- **Credit Costs**:
  - Job Fit Analysis: 2 credits
  - Tailored Cover Letter: 10 credits
  - Optimized Resume: 20 credits
- **Purpose**: Familiarize users with the value proposition before monetization

### 3. **Future Pricing Transparency**

- **Legal Framework**: Terms of Service Section 7 ("Pricing and Payment")
- **Notice Period**: 30 days minimum before pricing changes
- **Right Reserved**: Can introduce paid features at any time
- **Grandfathering**: Reasonable efforts for early users (not guaranteed)

---

## 📁 Files Created/Modified

### New Components

#### 1. `components/ui/beta-banner.tsx`

**Purpose**: Site-wide dismissible banner announcing beta status

**Features**:

- Gradient purple → blue → cyan design
- Sparkles icon with animation
- Shows "500 free credits" prominently
- Persists dismissal in `localStorage`
- Auto-hides after user dismisses

**Usage**:

```tsx
import { BetaBanner } from "@/components/ui/beta-banner";
// Added to app/layout.tsx - shows on all pages
```

#### 2. `components/ui/credits-info-card.tsx`

**Purpose**: Dashboard card showing credit balance with beta context

**Features**:

- Real-time credit balance display
- Visual progress bar (500 total)
- Beta notice explaining free credits
- Credit cost breakdown
- Gradient styling matching brand

**Usage**:

```tsx
import { CreditsInfoCard } from "@/components/ui/credits-info-card";

<CreditsInfoCard
  remainingCredits={tokenBalance.token_credits}
  tokensUsed={tokenBalance.tokens_used}
/>;
```

### Updated Components

#### 3. `app/layout.tsx`

**Change**: Added `<BetaBanner />` at top of body

- Shows on all pages (landing, portfolios, admin)
- Above all other content
- Dismissible per user

#### 4. `app/admin/dashboard/dashboard-client.tsx`

**Changes**:

- Added `CreditsInfoCard` to Quick Actions section
- Fetches token balance from new API endpoint
- Shows credits alongside Job Assistant and View Portfolio cards
- 3-column grid on desktop (credits + 2 actions)

**New State**:

```tsx
const [tokenBalance, setTokenBalance] = useState<{
  token_credits: number;
  tokens_used: number;
} | null>(null);
```

#### 5. `app/legal/terms/page.tsx`

**Major Updates**:

**Section 2.1 - Beta Status** (NEW):

- Explains 500 free credits
- Notes features may change
- Acknowledges potential bugs/downtime
- Encourages feedback

**Section 7 - Pricing and Payment** (NEW):

- **7.1 Beta Credits**: Current free credit offer
- **7.2 Future Pricing**: **Critical legal protection**
  - "Upfolio reserves the right to introduce paid features... at any time"
  - Lists potential changes (subscriptions, credit packages, etc.)
  - 30-day notice requirement
- **7.3 Grandfathering**: Makes no guarantees but notes reasonable efforts

**Section 10 - Beta Disclaimer** (UPDATED):

- Added explicit beta-related disclaimers
- Covers data loss, interruptions, AI accuracy
- Sets realistic expectations

---

## 🔌 API Endpoints

### New: `app/api/user/token-balance/route.ts`

**Endpoint**: `GET /api/user/token-balance`

**Auth**: Requires session (NextAuth)

**Response**:

```json
{
  "token_credits": 500,
  "tokens_used": 0
}
```

**Error Cases**:

- 401 if not authenticated
- 500 on database error

**Usage**: Called by dashboard on mount and refresh

---

## 🗄️ Database Migration

### Script: `scripts/migrate-update-beta-credits.ts`

**Purpose**: Update from 100 → 500 default credits

**Steps**:

1. ✅ Gives existing users with ≤100 credits and 0 usage an extra 400 credits
2. ✅ Updates `token_credits` column default from 100 → 500
3. ✅ Verifies changes with statistics query

**Run Command**:

```bash
npx tsx scripts/migrate-update-beta-credits.ts
```

**Safety**: Only updates users who haven't used their initial credits (avoids double-crediting)

---

## 📊 User Experience Flow

### First-Time User

1. **Landing Page**: Sees beta banner → "500 free credits"
2. **Registration**: Creates account
3. **Database**: Receives 500 credits automatically (new default)
4. **Dashboard**: Sees `CreditsInfoCard` with 500/500 credits and beta notice
5. **Usage**: Uses Job Assistant features, sees credits decrement
6. **Legal**: Can review Terms at any time to see pricing policy

### Existing User (Post-Migration)

1. **Auto-Update**: Migration script adds 400 credits (100 → 500)
2. **Dashboard**: Next login shows updated balance
3. **Beta Banner**: Sees announcement (can dismiss)
4. **Awareness**: Understands beta status and future pricing potential

---

## 🎨 Design Consistency

All beta-related UI follows **shared styles** from `lib/styles.ts`:

- **Colors**: Purple → Blue → Cyan gradient (brand identity)
- **Cards**: `cards.base` with gradient backgrounds
- **Typography**: `typography.h3` for headings, `typography.body` for descriptions
- **Spacing**: `spacing` utilities for consistent gaps
- **Icons**: Lucide React (Sparkles, Info, etc.)

---

## ⚖️ Legal Protection Summary

### What We Can Do (Per Updated Terms)

✅ Introduce subscription plans at any time  
✅ Charge for credits or features  
✅ Change credit costs  
✅ Limit free tier usage  
✅ Create premium-only features

### What We Must Do

⚠️ Provide 30 days notice before pricing changes  
⚠️ Notify users via email or in-app  
⚠️ Make "reasonable efforts" to grandfather early users (not binding)

### What Users Agreed To

📜 "Upfolio reserves the right to introduce paid features... at any time"  
📜 Continued use after notice = acceptance of new terms  
📜 Beta = no guarantees of service level or feature stability

---

## 🧪 Testing Checklist

- [ ] Beta banner appears on landing page
- [ ] Beta banner can be dismissed (persists in localStorage)
- [ ] Credits card shows on dashboard with correct balance
- [ ] Token balance API returns correct data
- [ ] Migration script runs without errors
- [ ] New users get 500 credits on registration
- [ ] Terms of Service displays all new sections
- [ ] Legal language about pricing is clear and prominent
- [ ] Mobile responsive (banner, credits card, Terms page)
- [ ] Dark mode works for all new components

---

## 🚀 Future Monetization Path

When ready to monetize:

1. **Pre-Launch** (30 days before):

   - Email all users about upcoming pricing
   - Update banner to show countdown
   - Announce on dashboard

2. **Pricing Tiers** (Example):

   ```
   Free: 50 credits/month
   Pro: 500 credits ($9.99/month)
   Unlimited: ∞ credits ($29.99/month)
   ```

3. **Grandfather Beta Users**:

   - Option: Give beta users permanent 500/month free
   - Option: 50% discount for first year
   - Option: One-time credit bonus (e.g., 2000 credits)

4. **Implementation**:
   - Add Stripe integration
   - Create pricing page
   - Update dashboard with upgrade prompts
   - Add credit purchase flow

---

## 📝 Summary

**For Users**: "We're in beta! You get 500 free credits. Pricing may come later, we'll give you notice."

**For Legal**: "We can charge at any time, with 30 days notice, and make no guarantees about free features continuing."

**For Developers**: Modular components, clear API, migration script ready, Terms cover all bases.

---

**Last Updated**: October 15, 2025  
**Status**: ✅ Implemented and Ready for Production
