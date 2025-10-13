# 🚀 Quick Start with Neon Database

## What is Neon?

Neon is a serverless Postgres database that:

- ✅ Scales to zero when not in use (free!)
- ✅ Has a generous free tier (512MB storage)
- ✅ Works seamlessly with Vercel
- ✅ Supports database branching (like Git for your database)

## Setup Steps

### 1. Create Neon Database via Vercel

1. Open: [vercel.com/dashboard/stores](https://vercel.com/dashboard/stores)
2. Find **Neon** under "Marketplace Database Providers"
3. Click **"Create"**
4. Fill in:
   - **Database Name**: `upfolio-db` (or your preference)
   - **Region**: Sydney (closest to Australia) or your preferred region
5. Click **"Create"**

### 2. Get Your Connection String

After creation, you'll see a connection string like:

```
postgresql://neondb_owner:ABC123xyz@ep-cool-grass-12345.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Copy this entire string!**

### 3. Add to Your Project

1. Create `.env.local` in your project root:

   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and add:

   ```bash
   POSTGRES_URL="postgresql://neondb_owner:ABC123xyz@ep-cool-grass-12345.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

3. Generate NextAuth secret:

   ```bash
   openssl rand -base64 32
   ```

4. Add to `.env.local`:
   ```bash
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-generated-secret-here"
   ```

### 4. Initialize Database

Run the setup script:

```bash
pnpm setup:db
```

This creates:

- Users table
- Resume data table
- Default admin user (email: `admin@portfolio.com`, password: `changeme123`)

### 5. Start Development

```bash
pnpm dev
```

Visit: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## ✅ You're Done!

Your admin panel is now connected to Neon database!

## 🔍 Verify Connection

You can verify your Neon database at:

- Vercel Dashboard → Storage → Your Database
- Or directly at [neon.tech](https://neon.tech) if you signed up there

## 💡 Tips

- **Free tier**: 512MB storage, unlimited queries
- **Auto-suspend**: Database pauses when inactive (saves resources)
- **Branching**: Create test branches without affecting production
- **Monitoring**: View queries and performance in Neon dashboard

## 🆘 Troubleshooting

### Connection Error?

- Make sure the connection string includes `?sslmode=require`
- Check that you copied the full string (no spaces or line breaks)
- Verify the database is active in Vercel dashboard

### Can't Run Setup Script?

```bash
# Make sure tsx is installed
pnpm add -D tsx

# Run setup again
pnpm setup:db
```

### Still Having Issues?

Check the full documentation: [ADMIN_SETUP.md](./ADMIN_SETUP.md)

---

**Next**: Once logged in, you're ready for Phase 2 (PDF upload & AI processing)! 🎉
