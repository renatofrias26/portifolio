"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText } from "lucide-react";
import { ResumeUploader } from "@/components/admin/resume-uploader";
import { ResumeVersionsList } from "@/components/admin/resume-versions-list";
import { AdminNavbar } from "@/components/admin/admin-navbar";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"upload" | "versions">("upload");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    // Switch to versions tab and refresh the list
    setActiveTab("versions");
    setRefreshKey((prev) => prev + 1);
  };

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
      <AdminNavbar user={session.user} currentPage="dashboard" />

      <div className="container mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="glass rounded-lg p-2 inline-flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "upload"
                ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Resume
            </div>
          </button>
          <button
            onClick={() => setActiveTab("versions")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "versions"
                ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Manage Versions
            </div>
          </button>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8"
        >
          {activeTab === "upload" && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Upload New Resume</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Upload your PDF resume and let AI automatically parse and
                structure your data
              </p>
              <ResumeUploader onUploadSuccess={handleUploadSuccess} />
            </div>
          )}

          {activeTab === "versions" && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Resume Versions</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                View, manage, and publish different versions of your resume
              </p>
              <ResumeVersionsList key={refreshKey} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
