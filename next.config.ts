import type { NextConfig } from "next";

// @ts-ignore - process.env is available in Next.js config
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isProd ? '/portifolio' : '',
  assetPrefix: isProd ? '/portifolio/' : '',
};

export default nextConfig;
