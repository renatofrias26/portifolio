# Portfolio Platform - Multi-User Edition

A modern, AI-powered portfolio platform built with Next.js that supports multiple users. Each user can create their own account, upload resumes, and publish their portfolio at a custom URL.

## 🌟 Features

### For Users
- **Personal Portfolio URL**: Each user gets `yourdomain.com/{username}`
- **AI Resume Parsing**: Upload PDF, AI extracts all data automatically
- **Version Management**: Keep multiple resume versions, publish the best one
- **Profile Customization**: Manage username, name, and profile settings
- **Glassmorphism Design**: Beautiful iOS-inspired UI with smooth animations
- **AI Chat**: Visitors can ask questions about your experience
- **Responsive**: Looks great on all devices

### For Platform Owners
- **Multi-User Support**: Unlimited users, each with isolated data
- **Secure Authentication**: NextAuth.js with password hashing
- **Database-Driven**: PostgreSQL with Neon/Vercel
- **Admin Dashboard**: Full-featured management interface
- **Version Control**: Track all resume versions per user
- **Analytics Ready**: Built to add usage tracking

## 🏗️ Architecture

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: PostgreSQL (Vercel Postgres / Neon)
- **Authentication**: NextAuth.js v4
- **AI**: OpenAI GPT-4 for resume parsing and chat
- **File Storage**: Vercel Blob for PDF uploads
- **Deployment**: Vercel (optimized with ISR)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL database (Vercel Postgres or Neon)
- OpenAI API key
- Vercel Blob storage

### Installation

1. **Clone and install dependencies:**

```bash
pnpm install
```

2. **Set up environment variables:**

Create `.env.local` with:

```bash
# Database
POSTGRES_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI
OPENAI_API_KEY="sk-..."

# Vercel Blob (for PDF uploads)
BLOB_READ_WRITE_TOKEN="vercel_blob_..."
```

3. **Run database migration:**

```bash
# Set up initial schema
npx tsx scripts/setup-db.ts

# Migrate to multi-user (if upgrading)
npx tsx scripts/migrate-multi-user.ts
```

4. **Create your first user:**

```bash
# Start dev server
pnpm dev

# Visit http://localhost:3000/admin/register
# Create your account with username
```

5. **Upload your resume:**

```bash
# Login at /admin/dashboard
# Upload PDF → AI parses → Edit → Publish
# View at /{your-username}
```

The admin panel allows you to:

- Login securely to manage your portfolio
- Upload resume PDFs and auto-update content with AI (coming soon)
- Manage multiple resume versions
- Preview changes before publishing

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

Build for production:

```bash
pnpm build
pnpm start
```

## 🎨 Design Features

- **Glassmorphism Cards**: Frosted glass effect with backdrop blur
- **Gradient Accents**: Purple, blue, and teal color scheme
- **Smooth Scrolling**: Enhanced navigation experience
- **Hover Effects**: Interactive elements with scale and shadow transitions
- **Dark Mode**: Automatic theme switching based on system preferences

## 🤖 AI Chat Feature

The AI chat section allows visitors to ask questions about:

- My technical experience and skills
- Whether I'm a good fit for specific roles
- My unique background and journey
- Recent projects and achievements

The AI is trained on my resume data and provides contextual, accurate responses.

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI**: Vercel AI SDK + OpenAI
- **Database**: Neon (Serverless Postgres)
- **Auth**: NextAuth.js
- **Icons**: Lucide React
- **Package Manager**: pnpm

## 📂 Project Structure

```
portifolio/
├── app/
│   ├── admin/             # Admin panel (login, dashboard)
│   ├── api/
│   │   ├── auth/          # NextAuth authentication
│   │   └── chat/          # AI chat API endpoint
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── sections/          # Page sections (Hero, About, etc.)
│   ├── ui/                # Reusable UI components
│   ├── navigation.tsx     # Navigation bar
│   └── footer.tsx         # Footer
├── data/
│   └── resume.ts          # Resume data and AI context
├── lib/
│   ├── auth.ts            # NextAuth configuration
│   ├── db/                # Database queries and schema
│   └── utils.ts           # Utility functions
└── scripts/
    └── setup-db.ts        # Database initialization
```

## 🎯 Sections

1. **Hero**: Eye-catching introduction with animated gradients
2. **About**: Personal summary and education
3. **Experience**: Professional journey timeline
4. **Skills**: Technical skills organized by category
5. **Projects**: Featured projects and work
6. **AI Chat**: Interactive Q&A powered by AI
7. **Contact**: Get in touch information
8. **Admin Panel** (`/admin`): Secure content management (login required)

## 🚢 Deployment

This project is optimized for deployment on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Remember to add environment variables in your Vercel project settings:

- `OPENAI_API_KEY` - For AI chat feature
- `POSTGRES_URL` - For admin panel (Neon connection string)
- `NEXTAUTH_URL` - Your production URL
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`

## 📝 Customization

To customize this portfolio for your own use:

1. Update `data/resume.ts` with your information
2. Modify color schemes in `app/globals.css`
3. Replace social media links in contact section
4. Update metadata in `app/layout.tsx`
5. Set up admin panel to dynamically manage content (see [ADMIN_SETUP.md](./ADMIN_SETUP.md))

## 📚 Documentation

- **[NEON_SETUP.md](./NEON_SETUP.md)** - Quick start guide for Neon database setup
- **[ADMIN_SETUP.md](./ADMIN_SETUP.md)** - Complete admin panel setup guide
- **[ADMIN_FOUNDATION.md](./ADMIN_FOUNDATION.md)** - Technical overview of admin features
- **[NEON_MIGRATION.md](./NEON_MIGRATION.md)** - Why we use Neon and migration info

## 📧 Contact

- Email: renatofrias@outlook.com
- Phone: 0474033253
- Location: Brisbane, QLD - Australia

---

Built with ❤️ using Next.js and AI
