# Deployment Notes

## Current Deployment: GitHub Pages
- **Status**: Active
- **URL**: https://renatofrias26.github.io/portifolio
- **Limitation**: AI Chat feature is disabled (API routes not supported on GitHub Pages)

## TODO: Migrate to Vercel
- **Priority**: Tomorrow
- **Reason**: Enable AI Chat feature with API route support
- **Benefits**:
  - Full Next.js API routes support
  - AI chat feature will work
  - Better performance with SSR/ISR
  - Automatic deployments on git push
  - Free tier available

## Setup Instructions for Vercel (Tomorrow)
1. Go to https://vercel.com
2. Sign in with GitHub
3. Import the `portifolio` repository
4. Deploy automatically
5. Update `next.config.ts` to remove basePath/assetPrefix (Vercel handles this automatically)
6. AI chat will work immediately

## Notes
- GitHub Pages deployment created on: October 10, 2025
- Vercel migration planned for: October 11, 2025
