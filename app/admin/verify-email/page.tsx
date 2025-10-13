"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { containerPadding, logoSizes, typography, buttons } from "@/lib/styles";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [alreadyVerified, setAlreadyVerified] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid verification link. Please check your email.");
      setIsVerifying(false);
      return;
    }

    // Verify email automatically on page load
    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to verify email");
        setIsVerifying(false);
        return;
      }

      if (data.alreadyVerified) {
        setAlreadyVerified(true);
      }

      setIsSuccess(true);
      setIsVerifying(false);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/admin/login");
      }, 3000);
    } catch {
      setError("An error occurred. Please try again.");
      setIsVerifying(false);
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
          {/* Logo */}
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
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
          </div>

          {isVerifying ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Verifying Your Email
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we verify your email address...
              </p>
            </motion.div>
          ) : isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {alreadyVerified
                  ? "Email Already Verified!"
                  : "Email Verified Successfully!"}
              </h2>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {alreadyVerified
                  ? "Your email was already verified. You can log in to access your account."
                  : "Your email has been verified. You can now access all features of Upfolio!"}
              </p>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800 dark:text-green-300">
                  ✓ <strong>Account Activated!</strong> Redirecting you to
                  login...
                </p>
              </div>

              <Link
                href="/admin/login"
                className={`${buttons.primary} w-full justify-center`}
              >
                Go to Login
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Verification Failed
              </h2>

              <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  💡 <strong>Tip:</strong> Verification links expire after 24
                  hours. You can request a new one after logging in.
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/admin/login"
                  className={`${buttons.primary} w-full justify-center`}
                >
                  Go to Login
                </Link>
                <Link
                  href="/admin/register"
                  className={`${buttons.secondary} w-full justify-center`}
                >
                  Create New Account
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
