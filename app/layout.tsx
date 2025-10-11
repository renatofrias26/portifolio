import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Upfolio - Upload. Share. Get hired.",
  description:
    "Create your professional portfolio in minutes with AI-powered resume parsing. Upload your resume, get a beautiful portfolio. Simple, powerful, effective.",
  keywords: [
    "AI portfolio",
    "Resume to portfolio",
    "Professional portfolio",
    "Online resume",
    "Portfolio builder",
    "Career portfolio",
    "AI resume parser",
    "Portfolio platform",
  ],
  authors: [{ name: "Upfolio" }],
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Upfolio - Upload. Share. Get hired.",
    description:
      "Create your professional portfolio in minutes with AI-powered resume parsing.",
    type: "website",
    siteName: "Upfolio",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Upfolio - Upload. Share. Get hired.",
    description:
      "Create your professional portfolio in minutes with AI-powered resume parsing.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                const applyTheme = (e) => {
                  if (e.matches) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                };
                applyTheme(mediaQuery);
                mediaQuery.addEventListener('change', applyTheme);
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
