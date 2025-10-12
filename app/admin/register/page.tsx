"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    username: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  // Don't render registration form if already authenticated
  if (session) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate terms agreement
    if (!agreedToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      setLoading(false);
      return;
    }

    try {
      // Register user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          username: formData.username,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Auto-login after successful registration
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError(
          "Registration successful, but auto-login failed. Please login manually.",
        );
        router.push("/admin/login");
      } else {
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center p-4">
      <GlassCard className="max-w-md w-full">
        <div className="p-8">
          {/* Upfolio Logo */}
          <div className="mb-6 flex justify-center">
            <Image
              src="/logo-dark.svg"
              alt="Upfolio"
              width={160}
              height={64}
              className="dark:hidden"
              priority
            />
            <Image
              src="/logo-dark.svg"
              alt="Upfolio"
              width={160}
              height={64}
              className="hidden dark:block"
              priority
            />
          </div>

          <h1 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">
            Join Upfolio
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
            Upload. Share. Get hired.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    username: e.target.value.toLowerCase(),
                  })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none"
                placeholder="johndoe"
                pattern="[a-z0-9_-]{3,30}"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Your portfolio will be at: /{formData.username || "username"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none"
                placeholder="••••••••"
                minLength={8}
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                At least 8 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none"
                placeholder="••••••••"
                minLength={8}
                required
              />
            </div>

            {/* Terms and Privacy Agreement */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  required
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  I agree to the{" "}
                  <Link
                    href="/legal/terms"
                    target="_blank"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/legal/privacy"
                    target="_blank"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Privacy Policy
                  </Link>
                  <span className="text-red-500 ml-1">*</span>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/admin/login"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
