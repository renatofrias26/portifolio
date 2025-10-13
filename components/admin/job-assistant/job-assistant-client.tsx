"use client";

import { useState } from "react";
import { JobAssistantWizard } from "./job-assistant-wizard";
import { JobHistoryPanel } from "./job-history-panel";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { containerPadding, spacing } from "@/lib/styles";

interface JobAssistantClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    username?: string | null;
  };
}

export function JobAssistantClient({ user }: JobAssistantClientProps) {
  const [selectedApplication, setSelectedApplication] = useState<number | null>(
    null,
  );
  const [refreshHistory, setRefreshHistory] = useState(0);
  const [showHistory, setShowHistory] = useState(true);

  const handleApplicationSaved = () => {
    setRefreshHistory((prev) => prev + 1);
  };

  const handleNewApplication = () => {
    setSelectedApplication(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <AdminNavbar user={user} currentPage="job-assistant" />

      <div className={`container mx-auto ${containerPadding.page} py-6`}>
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Job Application Assistant
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Generate tailored resumes and cover letters optimized for specific
            job postings
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* History Panel - Left Side (Desktop) / Top (Mobile) */}
          <div
            className={`lg:col-span-4 xl:col-span-3 ${
              showHistory ? "" : "hidden lg:block"
            }`}
          >
            <JobHistoryPanel
              selectedId={selectedApplication}
              onSelect={setSelectedApplication}
              onNewApplication={handleNewApplication}
              refreshTrigger={refreshHistory}
            />
          </div>

          {/* Main Wizard - Right Side */}
          <div className="lg:col-span-8 xl:col-span-9">
            {/* Mobile toggle for history */}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="lg:hidden mb-4 text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              {showHistory ? "← Back to form" : "View saved applications →"}
            </button>

            <JobAssistantWizard
              selectedApplicationId={selectedApplication}
              onSaved={handleApplicationSaved}
              onClearSelection={() => setSelectedApplication(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
