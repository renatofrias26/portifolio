"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, LogOut, Settings } from "lucide-react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

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

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <nav className="glass border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {session.user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Upload Resume Card */}
          <div className="glass rounded-2xl p-6 hover:shadow-xl transition-all cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Upload className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold">Upload Resume</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Upload a new PDF resume to automatically update your portfolio
            </p>
            <button className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium hover:shadow-lg transition-all">
              Coming Soon
            </button>
          </div>

          {/* Manage Versions Card */}
          <div className="glass rounded-2xl p-6 hover:shadow-xl transition-all cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold">Resume Versions</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              View and manage different versions of your resume
            </p>
            <button className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-500 text-white font-medium hover:shadow-lg transition-all">
              Coming Soon
            </button>
          </div>

          {/* Settings Card */}
          <div className="glass rounded-2xl p-6 hover:shadow-xl transition-all cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Settings className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold">Settings</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Configure your portfolio settings and preferences
            </p>
            <button className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-green-600 to-blue-500 text-white font-medium hover:shadow-lg transition-all">
              Coming Soon
            </button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="mt-12 glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                0
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Resume Versions
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                --
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Last Updated
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                Static
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Current Mode
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
