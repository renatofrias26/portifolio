"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buttons } from "@/lib/styles";

interface EmailVerificationBannerProps {
  isVerified: boolean;
  userEmail: string;
}

export default function EmailVerificationBanner({
  isVerified,
  userEmail,
}: EmailVerificationBannerProps) {
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if email is verified or user dismissed
  if (isVerified || isDismissed) {
    return null;
  }

  const handleResendEmail = async () => {
    setIsResending(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send verification email");
        setIsResending(false);
        return;
      }

      setMessage("Verification email sent! Please check your inbox.");
      setIsResending(false);
    } catch {
      setError("An error occurred. Please try again.");
      setIsResending(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 mb-6"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
              Email Verification Required
            </h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
              <p>
                Please verify your email address (<strong>{userEmail}</strong>)
                to access all features. Check your inbox for the verification
                link.
              </p>
            </div>

            {message && (
              <div className="mt-3 text-sm text-green-700 dark:text-green-400">
                ✓ {message}
              </div>
            )}

            {error && (
              <div className="mt-3 text-sm text-red-700 dark:text-red-400">
                ✗ {error}
              </div>
            )}

            <div className="mt-4 flex gap-3">
              <button
                onClick={handleResendEmail}
                disabled={isResending}
                className="text-sm font-medium text-yellow-800 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-200 disabled:opacity-50"
              >
                {isResending ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
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
                    Sending...
                  </span>
                ) : (
                  "Resend Verification Email →"
                )}
              </button>
              <button
                onClick={() => setIsDismissed(true)}
                className="text-sm font-medium text-yellow-600 dark:text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
