"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText } from "lucide-react";
import { ResumeUploader } from "@/components/admin/resume-uploader";
import { ResumeVersionsList } from "@/components/admin/resume-versions-list";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { containerPadding, typography, buttons, spacing } from "@/lib/styles";

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

      <div className={`container mx-auto ${containerPadding.dashboard}`}>
        {/* Tabs */}
        <div
          className={`glass rounded-lg p-2 inline-flex ${spacing.gapSmall} mb-6 sm:mb-8`}
        >
          <button
            onClick={() => setActiveTab("upload")}
            className={`${buttons.tab} ${
              activeTab === "upload" ? buttons.tabActive : buttons.tabInactive
            }`}
          >
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Resume
            </div>
          </button>
          <button
            onClick={() => setActiveTab("versions")}
            className={`${buttons.tab} ${
              activeTab === "versions" ? buttons.tabActive : buttons.tabInactive
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
          className={`glass rounded-2xl ${containerPadding.card}`}
        >
          {activeTab === "upload" && (
            <div>
              <h2 className={`${typography.h3} mb-2`}>Upload New Resume</h2>
              <p
                className={`${typography.body} text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 md:mb-8`}
              >
                Upload your PDF resume and let AI automatically parse and
                structure your data
              </p>
              <ResumeUploader onUploadSuccess={handleUploadSuccess} />
            </div>
          )}

          {activeTab === "versions" && (
            <div>
              <h2 className={`${typography.h3} mb-2`}>Resume Versions</h2>
              <p
                className={`${typography.body} text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 md:mb-8`}
              >
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
