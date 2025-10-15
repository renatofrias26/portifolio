# Domain Setup Guide - Upfolio

## 🎯 Primary Domain: `upfolio.com.au`

Your main production domain is **upfolio.com.au** - targeting the Australian market.

## 📋 Domain Configuration Overview

### Domains Owned

1. **upfolio.com.au** (Primary - Australian market)
2. **upfolio.au** (Redirect to primary)
3. **upfolio.app** (Redirect to primary, reserved for future use)

### Redirect Strategy

All alternative domains redirect to the primary domain with 301 (permanent) redirects:

- `upfolio.au` → `upfolio.com.au`
- `upfolio.app` → `upfolio.com.au`
- `www.upfolio.com.au` → `upfolio.com.au`

## 🚀 Vercel Deployment Steps

### 1. Add All Domains to Vercel Project

In your Vercel project dashboard:

1. Go to **Settings** → **Domains**
2. Add each domain:
   - `upfolio.com.au` (mark as **Primary**)
   - `upfolio.au`
   - `upfolio.app`
   - `www.upfolio.com.au`

### 2. Configure DNS Records

**⚠️ IMPORTANT:** Always use the exact DNS values shown in your Vercel project dashboard (Settings → Domains → click domain name → DNS Records tab). Vercel provides specific values for your deployment.

For each domain registrar, configure the DNS records **exactly as shown in Vercel**:

#### upfolio.com.au (Primary Domain)

**Current Vercel recommendations (as of your deployment):**

```
Type: A
Name: @
Value: 216.198.79.1
TTL: Auto

Type: CNAME
Name: www
Value: b0bfc53752a19587.vercel-dns-017.com
TTL: Auto
```

**Alternative (older) values:**

```
Type: A
Name: @
Value: 76.76.21.21
TTL: Auto

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto
```

#### upfolio.au (Redirect Domain)

```
Type: A
Name: @
Value: 216.198.79.1  (or 76.76.21.21 if Vercel shows this)
TTL: Auto
```

#### upfolio.app (Redirect Domain)

```
Type: A
Name: @
Value: 216.198.79.1  (or 76.76.21.21 if Vercel shows this)
TTL: Auto
```

**⚠️ Critical Note**: Vercel's DNS values are deployment-specific. The values above are based on your screenshot but may differ for each domain. Always copy the exact values from your Vercel dashboard → Domains → [domain name] → DNS Records tab.

### 3. Update Environment Variables

In Vercel project settings → **Environment Variables**, update:

```bash
NEXTAUTH_URL=https://upfolio.com.au
```

Make sure this is set for:

- ✅ Production
- ✅ Preview (optional, can use Vercel's preview URLs)
- ✅ Development (use `http://localhost:3000`)

### 4. Email Configuration (Resend)

If using custom email domain, configure these DNS records for `upfolio.com.au`:

```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

Type: CNAME
Name: resend._domainkey
Value: resend._domainkey.resend.com

Type: CNAME
Name: resend2._domainkey
Value: resend2._domainkey.resend.com
```

Update email sender addresses in Resend dashboard:

- `noreply@upfolio.com.au`
- `support@upfolio.com.au`
- `legal@upfolio.com.au`

## 📝 Code Configuration

### Centralized Site Config

All site URLs are managed in `/lib/site-config.ts`:

```typescript
export const siteConfig = {
  domain: "upfolio.com.au",
  url: "https://upfolio.com.au",
  name: "Upfolio",
  tagline: "Upload. Share. Get hired.",
  // ... more config
};
```

### Automatic Redirects

Redirects are configured in `next.config.ts` to handle:

- Alternative domain redirects
- WWW subdomain redirect
- Preserves all paths and query parameters

## ✅ Verification Checklist

After deployment, verify:

- [ ] `upfolio.com.au` loads correctly
- [ ] `www.upfolio.com.au` redirects to `upfolio.com.au`
- [ ] `upfolio.au` redirects to `upfolio.com.au`
- [ ] `upfolio.app` redirects to `upfolio.com.au`
- [ ] SSL certificates are active for all domains
- [ ] OG tags show correct domain in social shares
- [ ] Email links use correct domain
- [ ] Password reset emails work
- [ ] Email verification works
- [ ] User portfolio URLs work: `upfolio.com.au/{username}`

## 🔧 Testing Redirects Locally

You can test redirects in development by modifying your `/etc/hosts` file:

```bash
# Add to /etc/hosts for local testing
127.0.0.1 upfolio.com.au
127.0.0.1 upfolio.au
127.0.0.1 upfolio.app
```

Then start your dev server and test:

- `http://upfolio.com.au:3000`
- `http://upfolio.au:3000` (should redirect)
- `http://upfolio.app:3000` (should redirect)

## 🌐 Future Expansion Options

### Option: Dedicated PWA/App Domain (upfolio.app)

If you want to use `upfolio.app` for a dedicated progressive web app experience:

1. Remove the redirect in `next.config.ts`
2. Create a separate deployment or subdirectory
3. Configure as PWA-optimized experience
4. Use for mobile app installation flow

### Option: API Subdomain

Consider using `api.upfolio.com.au` for:

- Public API endpoints
- Webhooks
- Third-party integrations

## 🚨 Important Notes

1. **DNS Propagation**: DNS changes can take 24-48 hours to propagate globally
2. **SSL Certificates**: Vercel automatically provisions SSL certificates for all domains
3. **Redirects are Permanent (301)**: Search engines will update their indexes
4. **Test Before Going Live**: Use preview deployments to test domain configuration

## 📞 Support

If you encounter issues:

- Check Vercel deployment logs
- Verify DNS settings with `dig upfolio.com.au` or `nslookup upfolio.com.au`
- Check Vercel's domain configuration documentation
- Test email deliverability with Resend's dashboard

## 🎨 Branding Consistency

All domains point to the same brand:

- Logo assets use "Upfolio" branding
- Color scheme: Purple → Blue → Cyan gradient
- Tagline: "Upload. Share. Get hired."
- Consistent across all user touchpoints

---

**Last Updated**: October 15, 2025  
**Primary Domain**: upfolio.com.au  
**Status**: Ready for production deployment
