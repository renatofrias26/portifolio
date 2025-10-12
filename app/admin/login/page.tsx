"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  containerPadding,
  logoSizes,
  formInput,
  typography,
} from "@/lib/styles";

export default function AdminLogin() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/admin/dashboard");
    }
  }, [status, router]);

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (session) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-3 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className={`glass rounded-2xl ${containerPadding.form} shadow-xl`}>
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            {/* Upfolio Logo */}
            <div className="mb-3 sm:mb-4 md:mb-6 flex justify-center">
              <Image
                src="/logo-dark.svg"
                alt="Upfolio"
                width={logoSizes.auth.imageWidth}
                height={logoSizes.auth.imageHeight}
                className={`dark:hidden ${logoSizes.auth.width}`}
                priority
              />
              <Image
                src="/logo-dark.svg"
                alt="Upfolio"
                width={logoSizes.auth.imageWidth}
                height={logoSizes.auth.imageHeight}
                className={`hidden dark:block ${logoSizes.auth.width}`}
                priority
              />
            </div>
            <h1 className={`${typography.h4} text-gray-900 dark:text-white`}>
              Welcome Back
            </h1>
            <p
              className={`${typography.body} text-gray-600 dark:text-gray-400 mt-2`}
            >
              Sign in to manage your portfolio
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="email" className={formInput.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={formInput.base}
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className={formInput.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={formInput.base}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className={formInput.error}>
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-4 sm:mt-6 text-center space-y-2">
            <p
              className={`${typography.bodySmall} text-gray-600 dark:text-gray-400`}
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/admin/register"
                className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
            <Link
              href="/"
              className={`block ${typography.bodySmall} text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors`}
            >
              ← Back to Portfolio
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
