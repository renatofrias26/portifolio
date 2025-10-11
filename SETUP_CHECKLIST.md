# 🎯 Neon Setup Checklist

Use this checklist to set up your admin panel with Neon database.

## ✅ Step-by-Step Checklist

### 1. Create Neon Database

- [ ] Go to [vercel.com/dashboard/stores](https://vercel.com/dashboard/stores)
- [ ] Find **Neon** under "Marketplace Database Providers"
- [ ] Click **"Create"**
- [ ] Name: `portfolio-db` (or your choice)
- [ ] Region: Sydney/Australia (or closest to you)
- [ ] Click **"Create"**
- [ ] Copy the connection string that appears

### 2. Environment Setup

- [ ] Create `.env.local` file:
  ```bash
  cp .env.example .env.local
  ```
- [ ] Add Neon connection string to `.env.local`
  ```
  POSTGRES_URL="postgresql://neondb_owner:xxxxx@ep-xxxxx.aws.neon.tech/neondb?sslmode=require"
  ```
- [ ] Generate NextAuth secret:
  ```bash
  openssl rand -base64 32
  ```
- [ ] Add to `.env.local`:
  ```
  NEXTAUTH_URL="http://localhost:3000"
  NEXTAUTH_SECRET="your-generated-secret-here"
  ```

### 3. Initialize Database

- [ ] Run setup script:
  ```bash
  pnpm setup:db
  ```
- [ ] Verify output shows:
  - ✅ Users table created
  - ✅ Resume data table created
  - ✅ Indexes created
  - ✅ Default admin user created

### 4. Test the Admin Panel

- [ ] Start development server:
  ```bash
  pnpm dev
  ```
- [ ] Open browser: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- [ ] Login with:
  - Email: `admin@portfolio.com`
  - Password: `changeme123`
- [ ] Successfully redirected to `/admin/dashboard`

### 5. Security Setup

- [ ] Change the default admin password (coming in Phase 2)
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Never commit `.env.local` to git

## 🎉 Success Criteria

You're done when:

- ✅ Login page loads without errors
- ✅ Can login successfully
- ✅ Dashboard displays properly
- ✅ No console errors

## ❌ Troubleshooting

If something doesn't work:

1. **Can't connect to database**

   - Check `POSTGRES_URL` is correct in `.env.local`
   - Ensure connection string includes `?sslmode=require`
   - Verify database is active in Vercel dashboard

2. **Setup script fails**

   - Run `pnpm install` to ensure all deps are installed
   - Check that `tsx` is installed: `pnpm add -D tsx`
   - Verify database connection string is correct

3. **Login doesn't work**

   - Make sure setup script ran successfully
   - Check `NEXTAUTH_SECRET` is set
   - Clear browser cookies and try again

4. **TypeScript errors**
   - Run `pnpm install`
   - Restart VS Code TypeScript server

## 📚 Need Help?

- **Quick Guide**: [NEON_SETUP.md](./NEON_SETUP.md)
- **Full Guide**: [ADMIN_SETUP.md](./ADMIN_SETUP.md)
- **Technical Details**: [ADMIN_FOUNDATION.md](./ADMIN_FOUNDATION.md)

## 🚀 What's Next?

Once everything is working:

- [ ] Read [NEON_MIGRATION.md](./NEON_MIGRATION.md) to understand why Neon
- [ ] Explore the admin dashboard
- [ ] Ready for Phase 2: PDF upload & AI processing!

---

**Estimated Time**: 10-15 minutes ⏱️
