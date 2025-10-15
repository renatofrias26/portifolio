# Quick Start: Domain Deployment

## 🎯 What's Been Done

✅ **upfolio.com.au** configured as primary domain  
✅ Automatic redirects from upfolio.au and upfolio.app  
✅ Centralized URL configuration  
✅ Email templates updated with correct domain  
✅ SEO metadata enhanced  
✅ Code ready for deployment

## 🚀 Deploy Now (3 Steps)

### Step 1: Add Domains in Vercel (2 minutes)

1. Go to: https://vercel.com/dashboard → Your Project → Settings → Domains
2. Click **"Add Domain"** and add these 4 domains:
   - `upfolio.com.au` ← Click "Set as Primary"
   - `upfolio.au`
   - `upfolio.app`
   - `www.upfolio.com.au`

### Step 2: Configure DNS (5 minutes)

For each domain registrar, add these records **exactly as shown in your Vercel dashboard**:

**upfolio.com.au:**

```
Type: A       Name: @     Value: 76.76.21.21
```

**www.upfolio.com.au:**

```
Type: CNAME   Name: www   Value: cname.vercel-dns.com
```

Or use the new recommended values from Vercel (as shown in your screenshot):

```
Type: A       Name: @     Value: 216.198.79.1
Type: CNAME   Name: www   Value: b0bfc53752a19587.vercel-dns-017.com
```

**upfolio.au:**

```
Type: A       Name: @     Value: 76.76.21.21
```

(Or use the new A record value from Vercel if shown: `216.198.79.1`)

**upfolio.app:**

```
Type: A       Name: @     Value: 76.76.21.21
```

(Or use the new A record value from Vercel if shown: `216.198.79.1`)

**⚠️ Important:** Always use the exact values shown in your Vercel dashboard, as they may change based on Vercel's infrastructure.

### Step 3: Update Environment Variable (1 minute)

In Vercel → Settings → Environment Variables:

```bash
NEXTAUTH_URL=https://upfolio.com.au
```

Set for: ✅ Production

## ✅ Verify Deployment

After DNS propagates (can take 1-24 hours):

1. Visit: https://upfolio.com.au
2. Test redirect: https://upfolio.au (should go to upfolio.com.au)
3. Test redirect: https://upfolio.app (should go to upfolio.com.au)
4. Check SSL: 🔒 Should show secure on all domains

## 📧 Optional: Custom Email Domain

If you want emails from @upfolio.com.au (instead of @resend.dev):

### Add DNS Records to upfolio.com.au:

```
Type: TXT     Name: @                      Value: v=spf1 include:_spf.resend.com ~all
Type: CNAME   Name: resend._domainkey      Value: resend._domainkey.resend.com
Type: CNAME   Name: resend2._domainkey     Value: resend2._domainkey.resend.com
```

### In Resend Dashboard:

1. Go to: https://resend.com/domains
2. Click "Add Domain"
3. Enter: `upfolio.com.au`
4. Wait for verification (usually instant)

## 📚 Full Documentation

- **Complete Guide**: [`DOMAIN_SETUP_GUIDE.md`](./DOMAIN_SETUP_GUIDE.md)
- **Deployment Checklist**: [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md)
- **Full Summary**: [`DOMAIN_CONFIGURATION_SUMMARY.md`](./DOMAIN_CONFIGURATION_SUMMARY.md)

## 🔧 Code Changes Made

| File                       | What Changed                            |
| -------------------------- | --------------------------------------- |
| `lib/site-config.ts`       | ✨ NEW: Centralized domain config       |
| `next.config.ts`           | ➕ Added automatic domain redirects     |
| `app/layout.tsx`           | ✏️ Updated metadata with upfolio.com.au |
| `lib/email.ts`             | ✏️ Dynamic URLs for all email links     |
| `app/legal/terms/page.tsx` | ✏️ Updated contact email                |

## ⚡ Current Status

```
✅ Code updated and tested
✅ No build errors
✅ Redirects configured
✅ SEO metadata set
🟡 Waiting for domain DNS setup
🟡 Waiting for deployment
```

## 🆘 Need Help?

**DNS not working?**

- Wait 24-48 hours for propagation
- Check with: `dig upfolio.com.au` or `nslookup upfolio.com.au`

**SSL not working?**

- Vercel auto-provisions SSL (can take 10-30 mins)
- Check in Vercel dashboard: Domains → SSL Status

**Emails not sending?**

- Verify `RESEND_API_KEY` is set in Vercel
- Check Resend dashboard for domain verification

---

**Ready to deploy?** Just follow the 3 steps above! 🚀
