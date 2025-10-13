"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, User, Edit } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { ImageUploader } from "@/components/admin/image-uploader";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import ChangePasswordSection from "@/components/admin/change-password-section";
import EmailVerificationBanner from "@/components/admin/email-verification-banner";

interface UserProfile {
  id: number;
  email: string;
  name: string;
  username: string;
  logoUrl?: string;
  profileImageUrl?: string;
  profileData?: {
    title?: string; // Professional title
    tagline?: string;
    currentFocus?: string[]; // Array of focus items
    contactInfo?: {
      email?: string;
      phone?: string;
      location?: string;
    };
    socialLinks?: {
      github?: string;
      linkedin?: string;
      twitter?: string;
      website?: string;
      instagram?: string;
      youtube?: string;
    };
    bio?: string;
    [key: string]: unknown;
  };
  isActive: boolean;
  isPublic: boolean; // Add public profile setting
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    title: "", // Professional title
    tagline: "", // Hero section tagline
    currentFocus: [""],
    // Contact Information
    contactEmail: "",
    contactPhone: "",
    contactLocation: "",
    // Social Links
    github: "",
    linkedin: "",
    twitter: "",
    website: "",
    instagram: "",
    youtube: "",
    // Privacy setting
    isPublic: true,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/admin/profile");
      const data = await response.json();

      if (response.ok && data.user) {
        setProfile(data.user);
        const focusArray = data.user.profileData?.currentFocus || [];
        // Ensure we always have 5 slots
        const paddedFocus = [...focusArray].slice(0, 5);
        setFormData({
          name: data.user.name || "",
          username: data.user.username || "",
          title: data.user.profileData?.title || "",
          tagline: data.user.profileData?.tagline || "",
          currentFocus: paddedFocus,
          // Contact Information
          contactEmail: data.user.profileData?.contactInfo?.email || "",
          contactPhone: data.user.profileData?.contactInfo?.phone || "",
          contactLocation: data.user.profileData?.contactInfo?.location || "",
          // Social Links
          github: data.user.profileData?.socialLinks?.github || "",
          linkedin: data.user.profileData?.socialLinks?.linkedin || "",
          twitter: data.user.profileData?.socialLinks?.twitter || "",
          website: data.user.profileData?.socialLinks?.website || "",
          instagram: data.user.profileData?.socialLinks?.instagram || "",
          youtube: data.user.profileData?.socialLinks?.youtube || "",
          // Privacy setting
          isPublic: data.user.isPublic ?? true,
        });
      } else {
        setError("Failed to load profile");
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Filter out empty focus items before saving
      const currentFocus = formData.currentFocus.filter(
        (item) => item.trim() !== "",
      );

      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          isPublic: formData.isPublic,
          profileData: {
            ...profile?.profileData,
            title: formData.title,
            tagline: formData.tagline,
            currentFocus: currentFocus.length > 0 ? currentFocus : undefined,
            contactInfo: {
              email: formData.contactEmail || undefined,
              phone: formData.contactPhone || undefined,
              location: formData.contactLocation || undefined,
            },
            socialLinks: {
              github: formData.github || undefined,
              linkedin: formData.linkedin || undefined,
              twitter: formData.twitter || undefined,
              website: formData.website || undefined,
              instagram: formData.instagram || undefined,
              youtube: formData.youtube || undefined,
            },
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
      setProfile(data.user);
      setEditing(false);

      // Refresh after 2 seconds to update the URL if username changed
      setTimeout(() => {
        fetchProfile();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  const handleImageUpload = async (type: "logo" | "profile", url: string) => {
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            ...(type === "logo"
              ? { logoUrl: url || undefined }
              : { profileImageUrl: url || undefined }),
          }
        : null,
    );
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <AdminNavbar
        user={{
          ...session.user,
          username: profile?.username || session.user.username,
        }}
        currentPage="profile"
      />

      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Page Title */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your Upfolio account and portfolio preferences
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-600 dark:text-green-400">
                {success}
              </p>
            </div>
          )}

          {/* Email Verification Banner */}
          {session.user.email && (
            <EmailVerificationBanner
              isVerified={session.user.emailVerified || false}
              userEmail={session.user.email}
            />
          )}

          {/* Account Information */}
          <GlassCard className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account Information
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Basic account details
                </p>
              </div>
              {!editing && profile && (
                <button
                  onClick={() => setEditing(true)}
                  className="p-2 rounded-lg glass hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors flex-shrink-0"
                  title="Edit Account Information"
                >
                  <Edit className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </button>
              )}
            </div>

            {profile && (
              <div className="space-y-6">
                {editing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Username
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
                        pattern="[a-z0-9_-]{3,30}"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Your portfolio will be at: /{formData.username}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(false);
                          setFormData({
                            name: profile.name || "",
                            username: profile.username || "",
                            title: profile.profileData?.title || "",
                            tagline: profile.profileData?.tagline || "",
                            currentFocus: [
                              ...(profile.profileData?.currentFocus || []),
                              "",
                              "",
                              "",
                              "",
                              "",
                            ].slice(0, 5),
                            contactEmail:
                              profile.profileData?.contactInfo?.email || "",
                            contactPhone:
                              profile.profileData?.contactInfo?.phone || "",
                            contactLocation:
                              profile.profileData?.contactInfo?.location || "",
                            github:
                              profile.profileData?.socialLinks?.github || "",
                            linkedin:
                              profile.profileData?.socialLinks?.linkedin || "",
                            twitter:
                              profile.profileData?.socialLinks?.twitter || "",
                            website:
                              profile.profileData?.socialLinks?.website || "",
                            instagram:
                              profile.profileData?.socialLinks?.instagram || "",
                            youtube:
                              profile.profileData?.socialLinks?.youtube || "",
                            isPublic: profile.isPublic ?? true,
                          });
                          setError("");
                          setSuccess("");
                        }}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Name
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {profile.name || "Not set"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Email
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {profile.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Username
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {profile.username}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Portfolio URL
                      </p>
                      <a
                        href={`/${profile.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        /{profile.username}
                      </a>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Member Since
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {new Date(profile.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Account Status
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {profile.isActive ? (
                          <span className="text-green-600 dark:text-green-400">
                            Active
                          </span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400">
                            Inactive
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </GlassCard>

          {/* Portfolio Settings */}
          {profile && (
            <GlassCard className="mb-6">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="text-purple-600 dark:text-purple-400">
                        ✨
                      </span>
                      Portfolio Settings
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Customize how your portfolio appears to visitors
                    </p>
                  </div>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="p-2 rounded-lg glass hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors flex-shrink-0"
                      title="Edit Portfolio Settings"
                    >
                      <Edit className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </button>
                  )}
                </div>

                {editing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Professional Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Professional Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="e.g., Senior Software Engineer | AI Solutions Architect"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        This appears below your name on your portfolio
                      </p>
                    </div>

                    {/* Hero Tagline */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Hero Tagline (Optional)
                      </label>
                      <textarea
                        value={formData.tagline}
                        onChange={(e) =>
                          setFormData({ ...formData, tagline: e.target.value })
                        }
                        rows={3}
                        placeholder="From ##Mechatronics Engineering## to ##Software Development##, now specializing in ##AI Solutions##"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      />
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-y-1">
                        <p>This appears below your title on the hero section</p>
                        <p className="font-medium">
                          Add highlights with ##text## - colors auto-rotate!
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600">
                            ##highlight##
                          </code>
                          <span className="text-xs">→</span>
                          <div className="flex gap-1">
                            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                            <span className="w-3 h-3 rounded-full bg-teal-500"></span>
                            <span className="text-xs text-gray-400">...</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Current Focus */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Focus (Optional)
                      </label>
                      <div className="space-y-2">
                        {formData.currentFocus.map((focus, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={focus}
                              onChange={(e) => {
                                const newFocus = [...formData.currentFocus];
                                newFocus[index] = e.target.value;
                                setFormData({
                                  ...formData,
                                  currentFocus: newFocus,
                                });
                              }}
                              placeholder="e.g., AI Development & Integration"
                              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newFocus = formData.currentFocus.filter(
                                  (_, i) => i !== index,
                                );
                                setFormData({
                                  ...formData,
                                  currentFocus: newFocus,
                                });
                              }}
                              className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                              aria-label="Remove item"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            currentFocus: [...formData.currentFocus, ""],
                          });
                        }}
                        className="mt-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm transition-colors"
                      >
                        + Add Focus Item
                      </button>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        What you&apos;re currently focusing on or interested in
                      </p>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="text-teal-600 dark:text-teal-400">
                          📧
                        </span>
                        Contact Information
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Display Email
                          </label>
                          <input
                            type="email"
                            value={formData.contactEmail}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                contactEmail: e.target.value,
                              })
                            }
                            placeholder="contact@example.com"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Public email shown on your portfolio (can be
                            different from login email)
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={formData.contactPhone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                contactPhone: e.target.value,
                              })
                            }
                            placeholder="+1 (555) 123-4567"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            value={formData.contactLocation}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                contactLocation: e.target.value,
                              })
                            }
                            placeholder="San Francisco, CA"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="text-blue-600 dark:text-blue-400">
                          🔗
                        </span>
                        Social Links
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            GitHub
                          </label>
                          <input
                            type="url"
                            value={formData.github}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                github: e.target.value,
                              })
                            }
                            placeholder="https://github.com/username"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            LinkedIn
                          </label>
                          <input
                            type="url"
                            value={formData.linkedin}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                linkedin: e.target.value,
                              })
                            }
                            placeholder="https://linkedin.com/in/username"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Twitter / X
                          </label>
                          <input
                            type="url"
                            value={formData.twitter}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                twitter: e.target.value,
                              })
                            }
                            placeholder="https://twitter.com/username"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Website
                          </label>
                          <input
                            type="url"
                            value={formData.website}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                website: e.target.value,
                              })
                            }
                            placeholder="https://yourwebsite.com"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Instagram
                          </label>
                          <input
                            type="url"
                            value={formData.instagram}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                instagram: e.target.value,
                              })
                            }
                            placeholder="https://instagram.com/username"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            YouTube
                          </label>
                          <input
                            type="url"
                            value={formData.youtube}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                youtube: e.target.value,
                              })
                            }
                            placeholder="https://youtube.com/@username"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Privacy Settings */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="text-purple-600 dark:text-purple-400">
                          🔒
                        </span>
                        Privacy Settings
                        <span
                          className={`ml-auto text-xs px-3 py-1 rounded-full font-medium ${
                            formData.isPublic
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700"
                              : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700"
                          }`}
                        >
                          {formData.isPublic ? "✓ Public" : "🔒 Private"}
                        </span>
                      </h4>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={formData.isPublic}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                isPublic: e.target.checked,
                              })
                            }
                            className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                          />
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-white block">
                              Public Profile
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                              When enabled, your portfolio will be visible in
                              the Profiles Directory and accessible to anyone
                              with your link. Disable to make it private (only
                              you can access it when logged in).
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(false);
                          const focusArray =
                            profile.profileData?.currentFocus || [];
                          const paddedFocus = [
                            ...focusArray,
                            "",
                            "",
                            "",
                            "",
                            "",
                          ].slice(0, 5);
                          setFormData({
                            name: profile.name || "",
                            username: profile.username || "",
                            title: profile.profileData?.title || "",
                            tagline: profile.profileData?.tagline || "",
                            currentFocus: paddedFocus,
                            // Contact Information
                            contactEmail:
                              profile.profileData?.contactInfo?.email || "",
                            contactPhone:
                              profile.profileData?.contactInfo?.phone || "",
                            contactLocation:
                              profile.profileData?.contactInfo?.location || "",
                            // Social Links
                            github:
                              profile.profileData?.socialLinks?.github || "",
                            linkedin:
                              profile.profileData?.socialLinks?.linkedin || "",
                            twitter:
                              profile.profileData?.socialLinks?.twitter || "",
                            website:
                              profile.profileData?.socialLinks?.website || "",
                            instagram:
                              profile.profileData?.socialLinks?.instagram || "",
                            youtube:
                              profile.profileData?.socialLinks?.youtube || "",
                            isPublic: profile.isPublic ?? true,
                          });
                          setError("");
                          setSuccess("");
                        }}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Professional Title
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {profile.profileData?.title || (
                          <span className="text-gray-400 dark:text-gray-500 italic">
                            Not set
                          </span>
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Hero Tagline
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {profile.profileData?.tagline || (
                          <span className="text-gray-400 dark:text-gray-500 italic">
                            Not set
                          </span>
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Current Focus
                      </p>
                      {profile.profileData?.currentFocus &&
                      profile.profileData.currentFocus.length > 0 ? (
                        <ul className="space-y-1">
                          {profile.profileData.currentFocus.map(
                            (focus, index) => (
                              <li
                                key={index}
                                className="text-gray-900 dark:text-white flex items-start"
                              >
                                <span className="text-purple-500 mr-2">▸</span>
                                {focus}
                              </li>
                            ),
                          )}
                        </ul>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 italic">
                          Not set
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Contact Information
                      </p>
                      <div className="space-y-1">
                        <p className="text-gray-900 dark:text-white text-sm">
                          <span className="text-gray-500">Email:</span>{" "}
                          {profile.profileData?.contactInfo?.email || (
                            <span className="text-gray-400 dark:text-gray-500 italic">
                              Not set
                            </span>
                          )}
                        </p>
                        <p className="text-gray-900 dark:text-white text-sm">
                          <span className="text-gray-500">Phone:</span>{" "}
                          {profile.profileData?.contactInfo?.phone || (
                            <span className="text-gray-400 dark:text-gray-500 italic">
                              Not set
                            </span>
                          )}
                        </p>
                        <p className="text-gray-900 dark:text-white text-sm">
                          <span className="text-gray-500">Location:</span>{" "}
                          {profile.profileData?.contactInfo?.location || (
                            <span className="text-gray-400 dark:text-gray-500 italic">
                              Not set
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Social Links
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {profile.profileData?.socialLinks?.github && (
                          <a
                            href={profile.profileData.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            GitHub
                          </a>
                        )}
                        {profile.profileData?.socialLinks?.linkedin && (
                          <a
                            href={profile.profileData.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            LinkedIn
                          </a>
                        )}
                        {profile.profileData?.socialLinks?.twitter && (
                          <a
                            href={profile.profileData.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Twitter/X
                          </a>
                        )}
                        {profile.profileData?.socialLinks?.website && (
                          <a
                            href={profile.profileData.socialLinks.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Website
                          </a>
                        )}
                        {profile.profileData?.socialLinks?.instagram && (
                          <a
                            href={profile.profileData.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Instagram
                          </a>
                        )}
                        {profile.profileData?.socialLinks?.youtube && (
                          <a
                            href={profile.profileData.socialLinks.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            YouTube
                          </a>
                        )}
                        {!profile.profileData?.socialLinks ||
                          (Object.values(profile.profileData.socialLinks).every(
                            (v) => !v,
                          ) && (
                            <span className="text-gray-400 dark:text-gray-500 italic col-span-2">
                              No social links set
                            </span>
                          ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                        Privacy Settings
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-medium ${
                            profile.isPublic
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700"
                              : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700"
                          }`}
                        >
                          {profile.isPublic ? (
                            <>
                              <span>✓</span>
                              <span>Public Profile</span>
                            </>
                          ) : (
                            <>
                              <span>🔒</span>
                              <span>Private Profile</span>
                            </>
                          )}
                        </span>
                        {profile.isPublic ? (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Visible in directory
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Only you can see it
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          )}

          {/* Password & Security */}
          <ChangePasswordSection />

          {/* Customization */}
          {profile && (
            <GlassCard>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Brand Assets
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Upload your brand assets and profile images
                </p>
              </div>

              <div className="space-y-8">
                <ImageUploader
                  type="logo"
                  currentUrl={profile.logoUrl}
                  onUploadSuccess={(url) => handleImageUpload("logo", url)}
                  userName={profile.name}
                />

                <div className="border-t border-gray-200 dark:border-gray-700"></div>

                <ImageUploader
                  type="profile"
                  currentUrl={profile.profileImageUrl}
                  onUploadSuccess={(url) => handleImageUpload("profile", url)}
                  userName={profile.name}
                />
              </div>
            </GlassCard>
          )}
        </motion.div>
      </div>
    </div>
  );
}
