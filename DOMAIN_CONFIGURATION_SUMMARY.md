# Domain Configuration Complete - upfolio.com.au

## 🎯 Summary

Successfully configured **upfolio.com.au** as the primary domain for Upfolio, with automatic redirects from alternative domains.

## ✅ What Was Done

### 1. Domain Strategy Established

**Primary Domain**: `upfolio.com.au`

- ✅ Australian market focus (.com.au TLD)
- ✅ SEO advantage for local search
- ✅ Professional credibility
- ✅ Clear geographic targeting

**Alternative Domains**: Redirect to primary

- `upfolio.au` → `upfolio.com.au` (301 permanent redirect)
- `upfolio.app` → `upfolio.com.au` (301 permanent redirect)
- `www.upfolio.com.au` → `upfolio.com.au` (301 permanent redirect)

### 2. Code Changes

#### New File: `lib/site-config.ts`

Centralized configuration for all site URLs and metadata:

```typescript
export const siteConfig = {
  domain: "upfolio.com.au",
  url: "https://upfolio.com.au", // auto-adjusts for dev
  name: "Upfolio",
  tagline: "Upload. Share. Get hired.",
  email: {
    support: "support@upfolio.com.au",
    legal: "legal@upfolio.com.au",
    noreply: "noreply@upfolio.com.au",
  },
  // ... more config
};
```

Helper functions:

- `getBaseUrl()` - Returns correct URL for environment
- `getAbsoluteUrl(path)` - Generates absolute URLs

#### Updated: `next.config.ts`

Added automatic redirects for all alternative domains:

- Preserves all paths and query parameters
- Uses 301 permanent redirects
- Works in production and preview deployments

#### Updated: `app/layout.tsx`

- Added `metadataBase` for proper canonical URLs
- Uses `siteConfig` for consistent branding
- Added Australian-specific keywords
- Enhanced Open Graph tags with domain URL

#### Updated: `lib/email.ts`

- Replaced hardcoded URLs with `getBaseUrl()`
- All email links now use correct domain
- Works in dev (localhost) and prod (upfolio.com.au)

#### Updated: `app/legal/terms/page.tsx`

- Changed contact email to `legal@upfolio.com.au`

### 3. Documentation Created

#### `DOMAIN_SETUP_GUIDE.md`

Complete guide covering:

- DNS configuration for all domains
- Vercel project setup
- Email configuration (Resend)
- SSL certificate verification
- Testing procedures
- Future expansion options (PWA, API subdomain)

#### `DEPLOYMENT_CHECKLIST.md`

Production deployment checklist with:

- Environment variable setup
- Domain configuration steps
- Email DNS records
- Testing procedures
- Monitoring setup
- Rollback plan

#### `.env.example`

Template for environment variables

### 4. Dependencies

Installed: `resend@6.1.3` for email functionality

## 🚀 Next Steps - Deployment

### Immediate Actions

1. **Add domains in Vercel**:

   - Go to Vercel Project → Settings → Domains
   - Add all four domains (mark upfolio.com.au as primary)

2. **Configure DNS** (refer to `DOMAIN_SETUP_GUIDE.md`):

   - upfolio.com.au: A record + CNAME for www
   - upfolio.au: A record only
   - upfolio.app: A record only

3. **Set environment variable**:

   ```bash
   NEXTAUTH_URL=https://upfolio.com.au
   ```

4. **Setup email domain** (if using custom email):
   - Add Resend DNS records to upfolio.com.au
   - Verify domain in Resend dashboard

### Verification

After deployment, check:

- [ ] All domains resolve correctly
- [ ] Redirects work (upfolio.au → upfolio.com.au)
- [ ] SSL certificates active
- [ ] Email links use upfolio.com.au
- [ ] OG tags show correct domain
- [ ] Build completes without errors

## 📝 Configuration Files Reference

| File                      | Purpose                            |
| ------------------------- | ---------------------------------- |
| `lib/site-config.ts`      | Central domain & URL configuration |
| `next.config.ts`          | Domain redirects                   |
| `app/layout.tsx`          | Metadata & SEO                     |
| `lib/email.ts`            | Email templates with correct URLs  |
| `DOMAIN_SETUP_GUIDE.md`   | Deployment instructions            |
| `DEPLOYMENT_CHECKLIST.md` | Production launch checklist        |

## 🔧 Testing Locally

The configuration automatically uses `localhost:3000` in development:

```bash
# Start dev server
pnpm dev

# Test at:
# http://localhost:3000
```

To test redirects locally, modify `/etc/hosts`:

```
127.0.0.1 upfolio.com.au
127.0.0.1 upfolio.au
127.0.0.1 upfolio.app
```

## 🌍 SEO Benefits

With upfolio.com.au:

- ✅ Google prioritizes .au for Australian searches
- ✅ Trust signals for local users
- ✅ Better conversion rates
- ✅ Compliance with Australian regulations
- ✅ Proper canonical URLs prevent duplicate content

## 📧 Email Configuration

Update sender addresses in Resend:

- `noreply@upfolio.com.au` - Automated emails
- `support@upfolio.com.au` - Support responses
- `legal@upfolio.com.au` - Legal notices

All email templates now use dynamic `getBaseUrl()`:

- Password reset links
- Email verification links
- Welcome emails
- Dashboard links

## 🎨 Brand Consistency

All references now use:

- Domain: `upfolio.com.au`
- Name: `Upfolio`
- Tagline: `Upload. Share. Get hired.`
- Colors: Purple → Blue → Cyan gradient

## ⚠️ Important Notes

1. **DNS Propagation**: Can take 24-48 hours globally
2. **SSL Certificates**: Vercel auto-provisions for all domains
3. **Redirects**: 301 permanent - search engines will update
4. **Testing**: Use preview deployments before production

## 📚 Additional Resources

- [DOMAIN_SETUP_GUIDE.md](./DOMAIN_SETUP_GUIDE.md) - Full deployment guide
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Launch checklist
- [Vercel Domains Docs](https://vercel.com/docs/concepts/projects/domains)
- [Next.js Redirects](https://nextjs.org/docs/app/api-reference/next-config-js/redirects)

## 🎉 Benefits of This Setup

1. **Centralized Config**: All URLs in one place (`lib/site-config.ts`)
2. **Environment-Aware**: Auto-switches between dev/prod
3. **SEO-Optimized**: Proper canonical URLs and OG tags
4. **Redirect Strategy**: Captures traffic from all domains
5. **Email Integration**: Correct links in all emails
6. **Future-Proof**: Easy to add new features or domains

---

**Status**: ✅ Configuration Complete - Ready for Deployment  
**Primary Domain**: upfolio.com.au  
**Date**: October 15, 2025
