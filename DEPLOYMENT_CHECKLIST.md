# Production Deployment Checklist - upfolio.com.au

Use this checklist when deploying Upfolio to production with the new domain configuration.

## 🔐 Pre-Deployment: Environment Variables

### Required in Vercel Project Settings

- [ ] `POSTGRES_URL` - Your production database connection string
- [ ] `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- [ ] `NEXTAUTH_URL` - Set to `https://upfolio.com.au`
- [ ] `OPENAI_API_KEY` - Your OpenAI API key for resume parsing
- [ ] `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token
- [ ] `RESEND_API_KEY` - Your Resend API key for emails
- [ ] `SENTRY_AUTH_TOKEN` - (Optional) For error tracking
- [ ] `NEXT_PUBLIC_SENTRY_DSN` - (Optional) Public Sentry DSN

## 🌐 Domain Configuration

### 1. Add Domains to Vercel

- [ ] Go to Vercel Project → Settings → Domains
- [ ] Add `upfolio.com.au` and mark as **Primary Domain**
- [ ] Add `upfolio.au` (will auto-redirect)
- [ ] Add `upfolio.app` (will auto-redirect)
- [ ] Add `www.upfolio.com.au` (will auto-redirect)

### 2. Configure DNS Records

For each domain, configure DNS according to `DOMAIN_SETUP_GUIDE.md`:

#### upfolio.com.au

- [ ] A record: `@` → `76.76.21.21`
- [ ] CNAME: `www` → `cname.vercel-dns.com`

#### upfolio.au

- [ ] A record: `@` → `76.76.21.21`

#### upfolio.app

- [ ] A record: `@` → `76.76.21.21`

### 3. SSL Certificates

- [ ] Verify SSL certificates are auto-provisioned by Vercel
- [ ] Wait for all domains to show "Valid Configuration" in Vercel dashboard

## 📧 Email Configuration (Resend)

### DNS Records for upfolio.com.au

- [ ] TXT: `@` → `v=spf1 include:_spf.resend.com ~all`
- [ ] CNAME: `resend._domainkey` → `resend._domainkey.resend.com`
- [ ] CNAME: `resend2._domainkey` → `resend2._domainkey.resend.com`

### Resend Dashboard

- [ ] Verify domain `upfolio.com.au` in Resend
- [ ] Update "From" email addresses:
  - `noreply@upfolio.com.au`
  - `support@upfolio.com.au`
  - `legal@upfolio.com.au`

## 🗄️ Database Setup

### Production Database

- [ ] Database is created and accessible
- [ ] Run migration script: `npx tsx scripts/setup-db.ts`
- [ ] Verify all tables exist:
  - `users`
  - `resume_data`
  - `password_reset_tokens`
  - `email_verification_tokens`
  - `job_applications`
- [ ] Test database connection from Vercel environment

### Test Queries

```bash
# Test database connectivity
npx tsx -e "import { sql } from '@vercel/postgres'; (async () => { const result = await sql\`SELECT COUNT(*) FROM users\`; console.log(result); })();"
```

## 🔍 Pre-Launch Testing

### Authentication Flow

- [ ] Test registration: `/admin/register`
- [ ] Test login: `/admin/login`
- [ ] Test password reset flow
- [ ] Test email verification
- [ ] Verify session persistence

### Core Features

- [ ] Upload resume PDF
- [ ] Resume parsing works
- [ ] Profile enhancement works
- [ ] Public profile displays: `/{username}`
- [ ] Private profiles require login
- [ ] Public/private toggle works
- [ ] PDF download works

### Job Assistant

- [ ] Job URL scraping works
- [ ] Fit analysis generates
- [ ] Application saves correctly
- [ ] Saved applications load

### Email Testing

- [ ] Welcome emails send
- [ ] Password reset emails send with correct links
- [ ] Email verification works
- [ ] All links use `upfolio.com.au` domain

## 🎨 Content & SEO

### Metadata

- [ ] Open Graph tags use correct domain
- [ ] `metadataBase` set to `https://upfolio.com.au`
- [ ] Twitter cards display correctly
- [ ] Favicon loads on all pages
- [ ] Sitemap generated (if applicable)

### Social Sharing

- [ ] Share on Twitter shows correct preview
- [ ] Share on LinkedIn shows correct preview
- [ ] Share on Facebook shows correct preview
- [ ] User portfolios have correct OG tags

## 🚀 Deployment

### Build & Deploy

- [ ] Push code to `main` branch
- [ ] Vercel auto-deploys
- [ ] Build completes without errors
- [ ] ESLint passes
- [ ] TypeScript compiles

### Verification

- [ ] Visit `https://upfolio.com.au`
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Login/register work
- [ ] Test create a portfolio
- [ ] Test public profile view

## 🔄 Redirect Testing

Test all redirect scenarios:

- [ ] `upfolio.au` → `upfolio.com.au` (301)
- [ ] `upfolio.app` → `upfolio.com.au` (301)
- [ ] `www.upfolio.com.au` → `upfolio.com.au` (301)
- [ ] Redirects preserve paths: `upfolio.au/test` → `upfolio.com.au/test`
- [ ] Redirects preserve query params

## 📊 Monitoring & Analytics

### Sentry Setup

- [ ] Sentry project configured
- [ ] Error tracking works
- [ ] Source maps uploaded
- [ ] Test error reporting

### Performance

- [ ] Vercel Speed Insights active
- [ ] Core Web Vitals acceptable
- [ ] Lighthouse score > 90
- [ ] Mobile performance optimized

## 🔒 Security

### Authentication

- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] Session cookies are secure
- [ ] HTTPS enforced on all pages
- [ ] CORS configured correctly

### Rate Limiting

- [ ] API routes have rate limiting (if implemented)
- [ ] File upload size limits set
- [ ] Database query limits appropriate

## 📱 Mobile Testing

- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] Forms work on mobile

## 🎯 Post-Launch

### Immediate (First Hour)

- [ ] Monitor Vercel deployment logs
- [ ] Monitor Sentry for errors
- [ ] Check email deliverability
- [ ] Test critical user flows
- [ ] Monitor database performance

### First 24 Hours

- [ ] Monitor user registrations
- [ ] Check for any error patterns
- [ ] Verify DNS propagation globally
- [ ] Monitor email bounces/complaints
- [ ] Check SSL certificate validity

### First Week

- [ ] Gather user feedback
- [ ] Monitor performance metrics
- [ ] Review database usage
- [ ] Check API rate limits
- [ ] Review error logs

## 📝 Documentation Updates

- [ ] Update README.md with production URLs
- [ ] Update API documentation
- [ ] Create user guide (if needed)
- [ ] Update support documentation

## 🆘 Rollback Plan

If critical issues arise:

1. **Quick Fix**: Revert to previous Vercel deployment
2. **Database**: Have backup of production database
3. **DNS**: Keep DNS records documented
4. **Communication**: Notify users if downtime occurs

### Emergency Contacts

- Vercel Support: [Vercel Dashboard](https://vercel.com/support)
- Database Support: (Neon/Vercel Postgres support)
- Email Provider: [Resend Support](https://resend.com/support)

## ✅ Sign-Off

- [ ] All tests pass
- [ ] All required features work
- [ ] No critical errors in logs
- [ ] Performance acceptable
- [ ] Team approval received

---

**Deployment Date**: ******\_\_\_\_******  
**Deployed By**: ******\_\_\_\_******  
**Production URL**: https://upfolio.com.au  
**Status**: ☐ Not Started ☐ In Progress ☐ Complete
