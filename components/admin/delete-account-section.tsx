"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { containerPadding, spacing } from "@/lib/styles";

export default function DeleteAccountSection() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleDeleteAccount = async () => {
    setError("");

    if (confirmText !== "DELETE") {
      setError('Please type "DELETE" to confirm');
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account");
      }

      // Show success and redirect
      alert(
        "Account deleted successfully. You will be redirected to the home page.",
      );

      // Sign out and redirect to home page
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete account",
      );
      setIsDeleting(false);
    }
  };

  return (
    <div className={containerPadding.card}>
      <div className={spacing.element}>
        <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">
          Danger Zone
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
      </div>

      {!showConfirmation ? (
        <button
          onClick={() => setShowConfirmation(true)}
          className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-medium text-sm"
        >
          Delete Account
        </button>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 p-6 bg-red-50 dark:bg-red-950/30 rounded-lg border-2 border-red-200 dark:border-red-900"
          >
            <div>
              <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                ⚠️ Are you absolutely sure?
              </h4>
              <p className="text-sm text-red-700 dark:text-red-400 mb-3">
                This action cannot be undone. This will permanently delete your
                account and remove all your data from our servers.
              </p>
              <ul className="text-sm text-red-700 dark:text-red-400 space-y-1 list-disc list-inside mb-4">
                <li>Your portfolio page will be deleted</li>
                <li>All resume versions and data will be lost</li>
                <li>Your username will be released</li>
                <li>All uploaded files will be removed</li>
              </ul>
            </div>

            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-800 rounded-lg text-sm text-red-800 dark:text-red-300">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label
                  htmlFor="confirm-text"
                  className="block text-sm font-medium text-red-800 dark:text-red-300 mb-1"
                >
                  Type <strong>DELETE</strong> to confirm
                </label>
                <input
                  id="confirm-text"
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-3 py-2 border border-red-300 dark:border-red-800 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  disabled={isDeleting}
                />
              </div>

              <div>
                <label
                  htmlFor="delete-password"
                  className="block text-sm font-medium text-red-800 dark:text-red-300 mb-1"
                >
                  Enter your password to confirm
                </label>
                <input
                  id="delete-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full px-3 py-2 border border-red-300 dark:border-red-800 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  disabled={isDeleting}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || confirmText !== "DELETE" || !password}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors"
              >
                {isDeleting ? "Deleting..." : "I understand, delete my account"}
              </button>
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setPassword("");
                  setConfirmText("");
                  setError("");
                }}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-gray-200 rounded-lg font-medium text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
