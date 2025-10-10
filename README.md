# Renato Frias - Portfolio

A modern, iOS-inspired portfolio website built with Next.js, featuring an AI-powered chat interface where visitors can ask questions about my experience and skills.

## 🌟 Features

- **iOS-Inspired Design**: Glassmorphism effects, smooth animations, and gradient accents
- **AI-Powered Chat**: Interactive Q&A about my experience using OpenAI's GPT
- **Responsive Layout**: Optimized for all devices
- **Smooth Animations**: Framer Motion for delightful user experience
- **Modern Stack**: Next.js 15, TypeScript, Tailwind CSS

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- OpenAI API key (optional, for AI chat feature)

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
- **Icons**: Lucide React
- **Package Manager**: pnpm

## 📂 Project Structure

```
portifolio/
├── app/
│   ├── api/chat/          # AI chat API endpoint
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
└── lib/
    └── utils.ts           # Utility functions
```

## 🎯 Sections

1. **Hero**: Eye-catching introduction with animated gradients
2. **About**: Personal summary and education
3. **Experience**: Professional journey timeline
4. **Skills**: Technical skills organized by category
5. **Projects**: Featured projects and work
6. **AI Chat**: Interactive Q&A powered by AI
7. **Contact**: Get in touch information

## 🚢 Deployment

This project is optimized for deployment on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Remember to add your `OPENAI_API_KEY` environment variable in your Vercel project settings.

## 📝 Customization

To customize this portfolio for your own use:

1. Update `data/resume.ts` with your information
2. Modify color schemes in `app/globals.css`
3. Replace social media links in contact section
4. Update metadata in `app/layout.tsx`

## 📧 Contact

- Email: renatofrias@outlook.com
- Phone: 0474033253
- Location: Brisbane, QLD - Australia

---

Built with ❤️ using Next.js and AI
