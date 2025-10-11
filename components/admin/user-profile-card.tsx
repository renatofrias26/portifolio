"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";

interface UserProfile {
  id: number;
  email: string;
  name: string;
  username: string;
  profileData?: any;
  isActive: boolean;
  createdAt: string;
}

export function UserProfileCard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/admin/profile");
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.user);
        setFormData({
          name: data.user.name || "",
          username: data.user.username || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
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
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <GlassCard className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </GlassCard>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Your Profile
        </h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
        </div>
      )}

      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
              pattern="[a-z0-9_-]{3,30}"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Your portfolio: /{formData.username}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
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
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
            <p className="text-gray-900 dark:text-white font-medium">
              {profile.name || "Not set"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p className="text-gray-900 dark:text-white font-medium">
              {profile.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
            <p className="text-gray-900 dark:text-white font-medium">
              {profile.username}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Portfolio URL</p>
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
            <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
            <p className="text-gray-900 dark:text-white font-medium">
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
