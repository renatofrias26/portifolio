"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LandingHeader() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent hydration mismatch by only rendering auth-dependent UI after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle mobile menu body scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-purple-200/20 dark:border-purple-700/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
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

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              <Link
                href="/profiles"
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
              >
                Browse Portfolios
              </Link>
              <Link
                href="/try-now"
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
              >
                Try It Now
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
                  <span>Dashboard</span>
                </Link>
              ) : (
                // Unauthenticated user - show login and register
                <div className="flex items-center gap-3">
                  <Link
                    href="/admin/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
                  >
                    Login
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <nav className="absolute right-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-xl p-6 pt-20">
              <div className="flex flex-col gap-6">
                <Link
                  href="/profiles"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors py-2"
                >
                  Browse Portfolios
                </Link>
                <Link
                  href="/try-now"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors py-2"
                >
                  Try It Now
                </Link>

                {mounted && status !== "loading" && (
                  <>
                    {session ? (
                      // Authenticated user
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Dashboard</span>
                      </Link>
                    ) : (
                      // Unauthenticated user
                      <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Link
                          href="/admin/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors py-2"
                        >
                          Login
                        </Link>
                        <Link
                          href="/admin/register"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="px-4 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition-all text-center"
                        >
                          Sign Up
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
