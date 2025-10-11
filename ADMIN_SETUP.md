# Admin Panel Setup Guide

## 🎯 Overview

This admin panel allows you to:

- Login securely to manage your portfolio
- Upload resume PDFs (coming soon)
- Automatically parse and update portfolio data with AI (coming soon)
- Manage multiple resume versions
- Preview changes before publishing

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **Neon Database** - Serverless Postgres database (free tier available)

## 🚀 Setup Instructions

### Step 1: Create Neon Database

1. Go to your Vercel Dashboard
2. Navigate to: [vercel.com/dashboard/stores](https://vercel.com/dashboard/stores)
3. Under **"Marketplace Database Providers"**, find **Neon**
4. Click **"Create"** next to Neon
5. Choose a name (e.g., "portfolio-db")
6. Select **Region**: Sydney or closest to you (Australia East)
7. Click **"Create"**
8. Once created, you'll see your connection details

### Step 2: Configure Environment Variables

1. After creating the Neon database, copy the connection string shown

2. Create a `.env.local` file in your project root:

   ```bash
   cp .env.example .env.local
   ```

3. Add your Neon connection string to `.env.local`:

   ```bash
   # Neon Database
   POSTGRES_URL="postgresql://neondb_owner:xxxxx@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

4. Generate a NextAuth secret:

   ```bash
   openssl rand -base64 32
   ```

5. Add NextAuth configuration to `.env.local`:

   ```bash
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="paste-your-generated-secret-here"
   ```

   Your complete `.env.local` should look like:

   ```bash
   # Neon Database
   POSTGRES_URL="postgresql://neondb_owner:xxxxx@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-generated-secret-here"

   # OpenAI (if you already have it)
   OPENAI_API_KEY="sk-xxxxx"
   ```

### Step 3: Initialize Database

Run the setup script to create tables and default admin user:

```bash
pnpm tsx scripts/setup-db.ts
```

This will create:

- Users table
- Resume data table
- Default admin account:
  - Email: `admin@portfolio.com`
  - Password: `changeme123`

**⚠️ IMPORTANT**: Change the default password immediately after first login!

### Step 4: Test the Admin Panel

1. Start your development server:

   ```bash
   pnpm dev
   ```

2. Navigate to: `http://localhost:3000/admin/login`

3. Login with default credentials:

   - Email: `admin@portfolio.com`
   - Password: `changeme123`

4. You should be redirected to the admin dashboard!

## 🔐 Security Notes

1. **Change Default Password**: The setup creates a default admin account. Change this password immediately!
2. **Environment Variables**: Never commit `.env.local` to git
3. **Production**: Make sure `NEXTAUTH_URL` is set to your production domain when deploying

## 📁 File Structure

```
app/
├── admin/
│   ├── layout.tsx          # Session provider wrapper
│   ├── login/
│   │   └── page.tsx        # Login page
│   └── dashboard/
│       └── page.tsx        # Admin dashboard
└── api/
    └── auth/
        └── [...nextauth]/
            └── route.ts     # NextAuth API route

lib/
├── auth.ts                 # NextAuth configuration
└── db/
    ├── queries.ts          # Database helper functions
    └── schema.sql          # Database schema

scripts/
└── setup-db.ts            # Database setup script
```

## 🔄 Next Steps

Phase 2 will add:

- PDF upload functionality
- AI parsing with OpenAI
- Resume version management
- Live preview before publishing

## 🐛 Troubleshooting

### Database Connection Issues

- Verify `.env.local` has the `POSTGRES_URL` variable
- Ensure the connection string includes `?sslmode=require`
- Check if Neon database is active in Vercel dashboard
- Try restarting your dev server

### Authentication Issues

- Ensure `NEXTAUTH_SECRET` is set
- Clear browser cookies and try again
- Check console for error messages

### TypeScript Errors

- Run `pnpm install` to ensure all dependencies are installed
- Restart your TypeScript server in VS Code

## 📚 Resources

- [NextAuth.js Docs](https://next-auth.js.org/)
- [Neon Docs](https://neon.tech/docs/introduction)
- [Vercel Integration Guide](https://vercel.com/docs/storage/vercel-postgres)
- [Next.js App Router](https://nextjs.org/docs/app)

## 🌟 Why Neon?

- ✅ **Generous Free Tier**: 512MB storage, unlimited queries
- ✅ **Serverless**: Scales to zero when not in use
- ✅ **Fast**: Optimized for serverless applications
- ✅ **Branching**: Create database branches like Git (great for testing)
- ✅ **Auto-suspend**: Saves resources when inactive
