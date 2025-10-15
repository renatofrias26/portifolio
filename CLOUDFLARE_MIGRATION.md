# Cloudflare DNS Migration Guide

## 🎯 Goal
Migrate DNS management from your current registrar to Cloudflare to enable:
- ✅ TXT records for custom email domain
- ✅ Better DNS performance
- ✅ Free CDN and DDoS protection
- ✅ SSL/TLS management
- ✅ Analytics

## 📋 Prerequisites

- [ ] Cloudflare account (free): https://dash.cloudflare.com/sign-up
- [ ] Access to your domain registrar (where you bought upfolio.com.au)
- [ ] Current DNS records documented (save screenshots before migration)

## 🚀 Step-by-Step Migration

### Step 1: Sign Up for Cloudflare (2 minutes)

1. Go to: https://dash.cloudflare.com/sign-up
2. Create a free account
3. Verify your email

### Step 2: Add Your Domain (3 minutes)

1. Click **"Add a Site"**
2. Enter: `upfolio.com.au`
3. Click **"Add site"**
4. Select **"Free"** plan
5. Click **"Continue"**

### Step 3: Review DNS Records (2 minutes)

Cloudflare will automatically scan your current DNS records.

**Verify these records are detected:**
- A record: `@` → `216.198.79.1` (for upfolio.com.au)
- CNAME: `www` → `b0bfc53752a19587.vercel-dns-017.com`

If any are missing, click **"Add record"** and add them manually.

### Step 4: Add Missing DNS Records (5 minutes)

Add any records that weren't auto-detected:

#### For Vercel (if not already there):
```
Type: A
Name: @
Content: 216.198.79.1
Proxy status: DNS only (grey cloud icon)
```

```
Type: CNAME
Name: www
Content: b0bfc53752a19587.vercel-dns-017.com
Proxy status: DNS only (grey cloud icon)
```

#### For Resend (Email - Add these new):
```
Type: TXT
Name: @
Content: v=spf1 include:_spf.resend.com ~all
```

```
Type: CNAME
Name: resend._domainkey
Content: resend._domainkey.resend.com
```

```
Type: CNAME
Name: resend2._domainkey
Content: resend2._domainkey.resend.com
```

### Step 5: Update Nameservers (5 minutes)

Cloudflare will show you 2 nameservers (example):

```
dana.ns.cloudflare.com
neville.ns.cloudflare.com
```

**Action required:**
1. Copy these nameserver addresses
2. Go to your domain registrar's control panel
3. Find "Nameservers" or "DNS Settings"
4. Change from current nameservers to Cloudflare's
5. Save changes

**Common registrars:**

<details>
<summary>Namecheap</summary>

1. Dashboard → Domain List → Manage
2. Nameservers section → Custom DNS
3. Paste Cloudflare nameservers
4. Save
</details>

<details>
<summary>GoDaddy</summary>

1. My Products → Domains → upfolio.com.au
2. DNS → Nameservers → Change
3. Enter custom nameservers
4. Save
</details>

<details>
<summary>Crazy Domains</summary>

1. Domain Manager → upfolio.com.au
2. DNS Settings → Nameservers
3. Use custom nameservers
4. Paste Cloudflare nameservers
5. Update
</details>

### Step 6: Verify in Cloudflare (Wait 1-24 hours)

1. In Cloudflare dashboard, click **"Done, check nameservers"**
2. Wait for confirmation email
3. Status will change to **"Active"** when complete

**Note:** DNS propagation can take 1-24 hours, but usually completes in 1-2 hours.

### Step 7: Verify Domain in Resend (After Cloudflare Active)

1. Go to Resend: https://resend.com/domains
2. Click **"Add Domain"**
3. Enter: `upfolio.com.au`
4. Click **"Verify"**
5. Should show ✅ **Verified**

### Step 8: Update Email Configuration

Once verified, update `/lib/site-config.ts`:

```typescript
// Change from:
email: {
  support: "Upfolio Support <onboarding@resend.dev>",
  legal: "Upfolio Legal <onboarding@resend.dev>",
  noreply: "Upfolio <onboarding@resend.dev>",
}

// To:
email: {
  support: "support@upfolio.com.au",
  legal: "legal@upfolio.com.au",
  noreply: "noreply@upfolio.com.au",
}
```

### Step 9: Test Email Sending

1. Commit and push changes
2. Vercel auto-deploys
3. Test password reset or registration
4. Check Resend dashboard for delivery status

## ✅ Verification Checklist

- [ ] Cloudflare account created
- [ ] upfolio.com.au added to Cloudflare
- [ ] All DNS records added in Cloudflare
- [ ] Nameservers updated at registrar
- [ ] Cloudflare status shows "Active"
- [ ] Domain verified in Resend
- [ ] Email config updated in code
- [ ] Test email sent successfully

## 🎯 Benefits After Migration

**DNS Performance:**
- ✅ Faster DNS resolution globally
- ✅ 100% uptime SLA

**Email:**
- ✅ Send from @upfolio.com.au
- ✅ Professional branding
- ✅ Better deliverability

**Security:**
- ✅ DDoS protection
- ✅ SSL/TLS management
- ✅ Web Application Firewall (optional)

**Analytics:**
- ✅ Traffic insights
- ✅ Security events
- ✅ Performance metrics

## ⚠️ Important Notes

### Cloudflare Proxy (Orange Cloud)

For Vercel domains, keep **"Proxy status" as "DNS only"** (grey cloud):
- DNS records for Vercel should NOT be proxied
- This ensures Vercel's infrastructure handles your traffic
- Only proxy if you're using Cloudflare's CDN

### Downtime

- DNS changes cause NO downtime
- Your site stays online during migration
- Email sending continues with @resend.dev until fully migrated

### Rollback

If something goes wrong:
1. Change nameservers back to original registrar
2. Wait for DNS propagation
3. Site returns to previous state

## 📞 Support Resources

- **Cloudflare Docs:** https://developers.cloudflare.com/dns/
- **Resend Docs:** https://resend.com/docs
- **Vercel DNS:** https://vercel.com/docs/concepts/projects/domains

---

**Estimated Time:** 30 minutes active work + 1-24 hours DNS propagation  
**Cost:** Free (Cloudflare Free plan + Resend Free tier)  
**Difficulty:** Beginner-friendly with this guide
