import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Renato Frias | Software Developer & AI Specialist",
  description:
    "Software Developer with 5+ years of experience specializing in Angular, React, and AI development. Building innovative solutions from Brisbane, Australia.",
  keywords: [
    "Software Developer",
    "AI Development",
    "Angular",
    "React",
    "Flutter",
    "Brisbane",
    "Full Stack Developer",
  ],
  authors: [{ name: "Renato Frias" }],
  openGraph: {
    title: "Renato Frias | Software Developer & AI Specialist",
    description:
      "Software Developer specializing in AI, Angular, and React development",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
