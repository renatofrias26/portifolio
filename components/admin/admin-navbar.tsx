"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  User,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AdminNavbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    username?: string | null;
  };
  currentPage?: "dashboard" | "profile";
}

export function AdminNavbar({
  user,
  currentPage = "dashboard",
}: AdminNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const title = currentPage === "profile" ? "Profile Settings" : "Dashboard";
  const showBackButton = currentPage === "profile";

  return (
    <nav className="glass border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={() => router.push("/admin/dashboard")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg glass hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}
            {/* Logo - Hidden on mobile for profile page */}
            <div className={currentPage === "profile" ? "hidden sm:block" : ""}>
              <Image
                src="/logo-icon.svg"
                alt="Upfolio"
                width={32}
                height={32}
                className="w-8 h-8 dark:hidden"
              />
              <Image
                src="/logo-icon-dark.svg"
                alt="Upfolio"
                width={32}
                height={32}
                className="w-8 h-8 hidden dark:block"
              />
            </div>
            {/* Title - Only show on dashboard */}
            {currentPage === "dashboard" && (
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* View Portfolio Button */}
            <a
              href={user.username ? `/${user.username}` : "/"}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 transition-all shadow-sm hover:shadow-md"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">
                View Portfolio
              </span>
            </a>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                  {user.name?.[0]?.toUpperCase() ||
                    user.email?.[0]?.toUpperCase() ||
                    "U"}
                </div>
                <span className="hidden md:inline text-sm text-gray-700 dark:text-gray-300">
                  {user.name || user.email}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isMenuOpen && (
                  <>
                    {/* Backdrop to close menu when clicking outside */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 glass rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    >
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>

                        {currentPage !== "dashboard" && (
                          <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>
                        )}

                        {currentPage !== "profile" && (
                          <Link
                            href="/admin/profile"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            Profile Settings
                          </Link>
                        )}

                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
