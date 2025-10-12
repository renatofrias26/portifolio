"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { User, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";

export function LandingHeader() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering auth-dependent UI after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-200/20 dark:border-purple-700/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo-icon.svg"
              alt="Upfolio"
              width={32}
              height={32}
              className="dark:hidden"
            />
            <Image
              src="/logo-icon-dark.svg"
              alt="Upfolio"
              width={32}
              height={32}
              className="hidden dark:block"
            />
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Upfolio
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Link
              href="/profiles"
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
            >
              Browse Portfolios
            </Link>

            {!mounted ? (
              // Placeholder during SSR to prevent hydration mismatch
              <div className="flex items-center gap-3">
                <div className="w-16 h-9 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="w-20 h-9 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
              </div>
            ) : status === "loading" ? (
              <div className="w-8 h-8 rounded-full border-2 border-purple-200 dark:border-purple-700 animate-pulse" />
            ) : session ? (
              // Authenticated user - show dashboard link
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            ) : (
              // Unauthenticated user - show login and register
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/login"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
                <Link
                  href="/admin/register"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
