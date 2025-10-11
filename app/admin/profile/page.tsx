"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, User } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { ImageUploader } from "@/components/admin/image-uploader";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import Image from "next/image";

interface UserProfile {
  id: number;
  email: string;
  name: string;
  username: string;
  logoUrl?: string;
  profileImageUrl?: string;
  profileData?: any;
  isActive: boolean;
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
        setFormData({
          name: data.user.name || "",
          username: data.user.username || "",
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
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
      <AdminNavbar user={session.user} currentPage="profile" />

      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Manage your Upfolio account and portfolio preferences
          </p>

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

          {/* Account Information */}
          <GlassCard className="p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account Information
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Update your profile details
                </p>
              </div>
              {!editing && profile && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Edit Info
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

          {/* Customization */}
          {profile && (
            <GlassCard className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Customization
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
