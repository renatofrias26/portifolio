"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import Image from "next/image";
import Link from "next/link";
import {
  containerPadding,
  logoSizes,
  formInput,
  typography,
} from "@/lib/styles";

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
        // Check if there's guest resume data to upload
        const guestResumeData = sessionStorage.getItem("guestResumeData");

        if (guestResumeData) {
          try {
            const { parsedData, fileName, fileContent } =
              JSON.parse(guestResumeData);

            // Upload the guest resume data
            const uploadResponse = await fetch("/api/resume/upload-guest", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                parsedData,
                fileName,
                fileContent,
              }),
            });

            if (uploadResponse.ok) {
              // Clear the guest data
              sessionStorage.removeItem("guestResumeData");
              sessionStorage.removeItem("redirectAfterAuth");
            }
          } catch (uploadError) {
            console.error("Failed to upload guest resume:", uploadError);
            // Continue to dashboard anyway
          }
        }

        // Check for redirect URL
        const redirectUrl = sessionStorage.getItem("redirectAfterAuth");
        if (redirectUrl) {
          sessionStorage.removeItem("redirectAfterAuth");
          router.push(redirectUrl);
        } else {
          router.push("/admin/dashboard");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center p-3 sm:p-4">
      <GlassCard className="max-w-md w-full">
        <div className={containerPadding.form}>
          {/* Upfolio Logo */}
          <div className="mb-4 sm:mb-6 flex justify-center">
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

          <h1
            className={`${typography.h4} mb-2 text-center text-gray-900 dark:text-white`}
          >
            Join Upfolio
          </h1>
          <p
            className={`${typography.body} text-gray-600 dark:text-gray-400 text-center mb-4 sm:mb-6 md:mb-8`}
          >
            Upload. Share. Get hired.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className={formInput.error}>{error}</div>}

            <div>
              <label className={formInput.label}>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={formInput.base}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className={formInput.label}>
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
                className={formInput.base}
                placeholder="johndoe"
                pattern="[a-z0-9_-]{3,30}"
                required
              />
              <p
                className={`${typography.bodySmall} text-gray-500 dark:text-gray-400 mt-1`}
              >
                Your portfolio will be at: /{formData.username || "username"}
              </p>
            </div>

            <div>
              <label className={formInput.label}>
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={formInput.base}
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className={formInput.label}>
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={formInput.base}
                placeholder="••••••••"
                minLength={8}
                required
              />
              <p
                className={`${typography.bodySmall} text-gray-500 dark:text-gray-400 mt-1`}
              >
                At least 8 characters
              </p>
            </div>

            <div>
              <label className={formInput.label}>
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className={formInput.base}
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
                <span
                  className={`${typography.bodySmall} text-gray-700 dark:text-gray-300 leading-relaxed`}
                >
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
              className="w-full px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-4 sm:mt-6 text-center">
            <p
              className={`${typography.bodySmall} text-gray-600 dark:text-gray-400`}
            >
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
