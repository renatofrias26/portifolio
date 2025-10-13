"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle,
  Sparkles,
  Briefcase,
} from "lucide-react";
import { ResumeUploader } from "@/components/admin/resume-uploader";
import { ResumeVersionsList } from "@/components/admin/resume-versions-list";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { containerPadding, typography, buttons, spacing } from "@/lib/styles";

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"upload" | "versions">("upload");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isUploadingGuest, setIsUploadingGuest] = useState(false);

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

  // Handle guest resume upload after authentication
  useEffect(() => {
    if (
      status === "authenticated" &&
      searchParams.get("uploadResume") === "true"
    ) {
      const uploadGuestResume = async () => {
        const guestResumeData = sessionStorage.getItem("guestResumeData");

        if (guestResumeData) {
          setIsUploadingGuest(true);
          try {
            const { parsedData, fileName, fileContent } =
              JSON.parse(guestResumeData);

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
              sessionStorage.removeItem("guestResumeData");
              sessionStorage.removeItem("redirectAfterAuth");
              setShowWelcome(true);
              setActiveTab("versions");
              setRefreshKey((prev) => prev + 1);

              // Remove query param
              router.replace("/admin/dashboard");
            }
          } catch (error) {
            console.error("Failed to upload guest resume:", error);
          } finally {
            setIsUploadingGuest(false);
          }
        }
      };

      uploadGuestResume();
    }
  }, [status, searchParams, router]);

  if (status === "loading" || isUploadingGuest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {isUploadingGuest ? "Setting up your portfolio..." : "Loading..."}
          </p>
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
        {/* Welcome Banner */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-6 rounded-xl border-2 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Welcome to Upfolio!{" "}
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Your resume has been uploaded successfully! Review it below
                    and publish when you&apos;re ready to go live.
                  </p>
                  <button
                    onClick={() => setShowWelcome(false)}
                    className="mt-4 text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Got it, thanks!
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <h2 className={`${typography.h3} mb-4`}>Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Job Assistant Card */}
            <a
              href="/admin/job-assistant"
              className="glass rounded-xl p-6 hover:shadow-lg transition-all border border-transparent hover:border-purple-200 dark:hover:border-purple-800 group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Job Assistant
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Generate tailored resumes and cover letters for job
                    applications using AI
                  </p>
                </div>
              </div>
            </a>

            {/* View Portfolio Card */}
            <a
              href={session.user.username ? `/${session.user.username}` : "/"}
              className="glass rounded-xl p-6 hover:shadow-lg transition-all border border-transparent hover:border-blue-200 dark:hover:border-blue-800 group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    View Portfolio
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    See how your portfolio looks to visitors
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>

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

export default function AdminDashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
