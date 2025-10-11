# Renato Frias - Portfolio

A modern, iOS-inspired portfolio website built with Next.js, featuring an AI-powered chat interface and an admin panel for dynamic content management.

## 🌟 Features

- **iOS-Inspired Design**: Glassmorphism effects, smooth animations, and gradient accents
- **AI-Powered Chat**: Interactive Q&A about my experience using OpenAI's GPT
- **Admin Panel**: Secure login and dashboard for managing resume data (coming: PDF upload & AI parsing)
- **Responsive Layout**: Optimized for all devices
- **Smooth Animations**: Framer Motion for delightful user experience
- **Modern Stack**: Next.js 15, TypeScript, Tailwind CSS, Neon Database

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- OpenAI API key (optional, for AI chat feature)
- Neon Database (for admin panel - free tier available)

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
```

3. Add your OpenAI API key to `.env.local`:

```
OPENAI_API_KEY=your_api_key_here
```

Note: The AI chat will still work without an API key, but will show a fallback message.

### Admin Panel Setup (Optional)

To enable the admin panel for dynamic content management:

1. **See [NEON_SETUP.md](./NEON_SETUP.md)** for quick Neon database setup
2. **Or see [ADMIN_SETUP.md](./ADMIN_SETUP.md)** for complete setup guide

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
