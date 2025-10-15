# Beta Communication & Pricing - Testing Checklist

## ✅ Pre-Deployment Verification

### Code Quality

- [x] All new components compile without errors
- [x] TypeScript types are correct
- [x] ESLint passes (new files only)
- [x] Migration script runs successfully
- [x] API endpoint returns correct data structure

### Database

- [x] Migration executed: 2 users updated to 500 credits
- [x] Default value changed: 100 → 500
- [x] Verification query shows min 500, avg 616

### Files Created (5)

- [x] `components/ui/beta-banner.tsx`
- [x] `components/ui/credits-info-card.tsx`
- [x] `app/api/user/token-balance/route.ts`
- [x] `scripts/migrate-update-beta-credits.ts`
- [x] `BETA_CREDITS_IMPLEMENTATION.md`

### Files Modified (3)

- [x] `app/layout.tsx` - Added BetaBanner
- [x] `app/admin/dashboard/dashboard-client.tsx` - Added CreditsInfoCard + API
- [x] `app/legal/terms/page.tsx` - 4 new/updated sections

---

## 🧪 Manual Testing Required

### 1. Beta Banner

- [ ] Visit homepage → Banner appears at top
- [ ] Click X button → Banner dismisses
- [ ] Refresh page → Banner stays hidden (localStorage)
- [ ] Clear localStorage → Banner reappears
- [ ] Test on mobile → Responsive layout
- [ ] Test dark mode → Proper colors

### 2. Dashboard Credits Card

- [ ] Login to dashboard → CreditsInfoCard visible
- [ ] Shows correct credit count (500 for new users)
- [ ] Progress bar renders correctly
- [ ] Beta notice text readable
- [ ] Credit costs list displays
- [ ] Responsive on mobile (full width)
- [ ] Dark mode styling correct

### 3. API Endpoint

- [ ] Open DevTools → Network tab
- [ ] Dashboard loads → Check `/api/user/token-balance` request
- [ ] Response: `{ token_credits: 500, tokens_used: 0 }` (or similar)
- [ ] Status: 200 OK
- [ ] Unauthenticated request → 401 Unauthorized

### 4. Terms of Service

- [ ] Navigate to `/legal/terms`
- [ ] Section 2.1 "Beta Status" visible
- [ ] Section 7 "Pricing and Payment" with subsections
- [ ] Section 7.2 has **bold text** about pricing rights
- [ ] Section 10 includes beta disclaimer
- [ ] All sections numbered correctly (1-16)
- [ ] Mobile scrolling smooth
- [ ] Dark mode readable

### 5. New User Flow

- [ ] Register new account
- [ ] Database query: `SELECT token_credits FROM users WHERE id = X`
- [ ] Result: 500 (not 100)
- [ ] Dashboard shows 500/500 credits
- [ ] Beta banner appears
- [ ] Use Job Assistant → Credits decrement properly

### 6. Existing User Flow (Post-Migration)

- [ ] Check user who had 100 credits, 0 used
- [ ] Now has 500 credits
- [ ] Dashboard reflects update
- [ ] Can still use features normally

---

## 🎨 Visual Regression Testing

### Desktop (1920x1080)

- [ ] Beta banner doesn't break layout
- [ ] Credits card fits in 3-column grid
- [ ] Terms page readable width
- [ ] Gradients render smoothly

### Tablet (768px)

- [ ] Banner text doesn't overflow
- [ ] Credits card stacks properly
- [ ] Dashboard grid responsive

### Mobile (375px)

- [ ] Banner dismissible on small screens
- [ ] Credits card readable
- [ ] Terms sections don't clip
- [ ] Touch targets adequate (44px min)

### Dark Mode

- [ ] Banner gradient visible
- [ ] Credits card contrast good
- [ ] Terms text readable
- [ ] No white-on-white or black-on-black

---

## 🔒 Legal Verification

### Terms of Service Review

- [ ] Section 7.2 clearly states pricing rights
- [ ] 30-day notice requirement mentioned
- [ ] No promises of 永久 free service
- [ ] Beta disclaimer comprehensive
- [ ] Language reviewed by legal (if available)
- [ ] Last Updated date current

---

## 📊 Analytics Setup (Optional)

### Track Beta Engagement

- [ ] Banner dismiss rate (how many users hide it)
- [ ] Credits usage patterns (which features most popular)
- [ ] Terms page visits (users reading legal)
- [ ] Conversion: Beta users → Paid users (future)

---

## 🚀 Deployment Steps

### 1. Pre-Deploy

- [x] All code committed to git
- [ ] Create feature branch or merge to main
- [ ] Push to GitHub

### 2. Deploy

- [ ] Vercel auto-deploys on push (or manual deploy)
- [ ] Verify build succeeds
- [ ] Check deployment logs for errors

### 3. Post-Deploy

- [ ] Visit production URL
- [ ] Test beta banner on live site
- [ ] Login to production dashboard
- [ ] Verify credits display correctly
- [ ] Check Terms page loads

### 4. Database Production

- [ ] Run migration on production DB
  ```bash
  npx tsx scripts/migrate-update-beta-credits.ts
  ```
- [ ] Verify: `SELECT COUNT(*), AVG(token_credits) FROM users`
- [ ] All users have ≥500 credits

---

## 🔔 User Communication (Optional)

### In-App

- [x] Beta banner (automatic)
- [x] Dashboard credits card (automatic)

### Email (If Desired)

- [ ] Send announcement: "We've upgraded you to 500 free credits!"
- [ ] Include link to Terms for transparency
- [ ] Mention features to try

### Social Media

- [ ] Tweet: "Upfolio beta users now get 500 free credits! 🎉"
- [ ] LinkedIn: Professional announcement
- [ ] Include screenshot of credits card

---

## 🐛 Known Issues / Limitations

### Current

- Existing error in `job-assistant-wizard.tsx` (unrelated to this PR)
  - `Cannot find module './markdown-editor'`
  - Pre-existing, not introduced by beta changes

### Future Considerations

- [ ] Add admin panel to manually adjust user credits
- [ ] Create audit log for credit transactions
- [ ] Build credit purchase flow (Stripe)
- [ ] Design pricing page UI
- [ ] Implement subscription management

---

## ✅ Sign-Off

### Developer

- [x] Code complete
- [x] Self-tested locally
- [x] Documentation written
- [ ] Peer review requested (optional)

### QA (If Applicable)

- [ ] Manual testing complete
- [ ] Edge cases covered
- [ ] Performance acceptable
- [ ] Accessibility checked

### Legal (If Applicable)

- [ ] Terms reviewed
- [ ] Pricing language approved
- [ ] Disclaimers sufficient

### Product Owner

- [ ] Meets requirements
- [ ] User messaging approved
- [ ] Ready for production

---

## 📝 Rollback Plan

If issues arise after deployment:

1. **Revert Code**:

   ```bash
   git revert <commit-hash>
   git push
   ```

2. **Database Rollback** (if needed):

   ```sql
   -- Reset default to 100
   ALTER TABLE users ALTER COLUMN token_credits SET DEFAULT 100;

   -- Remove excess credits (optional)
   UPDATE users SET token_credits = 100 WHERE token_credits = 500 AND tokens_used = 0;
   ```

3. **Communication**:
   - In-app notice: "Experiencing issues, will re-enable soon"
   - Email if credits affected

---

**Checklist Last Updated**: October 15, 2025  
**Ready for Deployment**: ✅ Pending manual QA
