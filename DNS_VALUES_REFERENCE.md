# DNS Values Reference - Vercel Deployment

## ⚠️ IMPORTANT: Always Use Values from Vercel Dashboard

Vercel provides **deployment-specific DNS values** that you must copy exactly from your dashboard.

## 📍 Where to Find Your DNS Values

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to: **Settings** → **Domains**
4. Click on a domain name (e.g., `upfolio.com.au`)
5. Click the **"DNS Records"** tab
6. Copy the values shown there

## 🔍 Current Values (From Your Screenshot)

Based on your Vercel dashboard screenshot dated October 15, 2025:

### upfolio.com.au

```
Type: A
Name: @
Value: 216.198.79.1
```

### www.upfolio.com.au

```
Type: CNAME
Name: www
Value: b0bfc53752a19587.vercel-dns-017.com
```

## 📝 General Pattern

Vercel typically provides:

### For Apex Domain (upfolio.com.au, upfolio.au, upfolio.app):

- **Type:** A
- **Name:** @ (or leave blank, depending on registrar)
- **Value:** One of these IPs (check Vercel):
  - `76.76.21.21` (older/generic)
  - `216.198.79.1` (newer/deployment-specific)

### For WWW Subdomain (www.upfolio.com.au):

- **Type:** CNAME
- **Name:** www
- **Value:** One of these (check Vercel):
  - `cname.vercel-dns.com` (generic)
  - `[hash].vercel-dns-[number].com` (deployment-specific, recommended)

## 🎯 Why DNS Values Differ

Vercel uses different DNS infrastructure based on:

- **Region:** Closer servers for better performance
- **Deployment type:** Enterprise vs. Hobby plans
- **Load balancing:** Distributes traffic across servers
- **IP range updates:** Vercel periodically updates infrastructure

## ✅ Best Practice

**DO:**

- ✅ Copy values exactly from your Vercel dashboard
- ✅ Use the "DNS Records" tab in Vercel for each domain
- ✅ Screenshot or note the values for reference
- ✅ Verify configuration shows "Valid Configuration" in Vercel

**DON'T:**

- ❌ Use generic values from tutorials
- ❌ Assume all domains use the same values
- ❌ Copy values from other projects
- ❌ Use outdated documentation

## 🔄 DNS Propagation

After adding records:

- **Propagation time:** 1-24 hours (usually faster)
- **Check status:** Vercel dashboard shows "Valid Configuration" when ready
- **Verify globally:** Use https://dnschecker.org

## 🛠️ Common Registrar Instructions

### Namecheap

1. Dashboard → Domain List → Manage
2. Advanced DNS → Add New Record
3. For @ record: Type "A Record", Host "@", Value from Vercel
4. For www: Type "CNAME", Host "www", Target from Vercel

### GoDaddy

1. My Products → DNS → Manage Zones
2. Click domain → Add → A Record
3. Name: "@", Value: from Vercel
4. Add CNAME: Name "www", Value from Vercel

### Cloudflare

1. Dashboard → Domain → DNS → Records
2. Add record → Type A, Name "@", Content from Vercel
3. **Important:** Set proxy status to "DNS only" (grey cloud)
4. Add CNAME: Type CNAME, Name "www", Target from Vercel

### Route53 (AWS)

1. Hosted Zones → Select domain
2. Create Record Set
3. Type A, Name blank or "@", Value from Vercel
4. Create CNAME: Name "www", Value from Vercel

## 📞 Troubleshooting

### DNS Not Updating?

- Wait longer (can take 24-48 hours)
- Check TTL settings (lower = faster propagation)
- Clear your DNS cache: `sudo dscacheutil -flushcache` (macOS)
- Verify with: `dig upfolio.com.au` or `nslookup upfolio.com.au`

### "Invalid Configuration" in Vercel?

- Double-check DNS values match exactly
- Ensure no extra spaces in values
- Verify record type (A vs CNAME)
- Check if old records are still present (remove them)

### SSL Certificate Not Provisioning?

- Wait for DNS to propagate first
- Vercel auto-provisions SSL after DNS validates
- Can take 10-30 minutes after DNS validates
- Check Vercel dashboard for SSL status

## 🔐 Security Note

- DNS records are public information
- The values shown above are deployment endpoints, not sensitive
- Never share your Vercel API keys or project tokens
- SSL certificates are automatically managed by Vercel

---

**Last Updated:** October 15, 2025  
**Source:** Vercel Dashboard Screenshot  
**Status:** Values confirmed from actual deployment
