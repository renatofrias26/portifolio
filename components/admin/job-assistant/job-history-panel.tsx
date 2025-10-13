"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Briefcase,
  FileText,
  Trash2,
  Plus,
  Loader2,
} from "lucide-react";
import { cards, buttons, spacing, typography } from "@/lib/styles";

interface Application {
  id: number;
  jobTitle: string;
  companyName: string;
  jobUrl?: string;
  createdAt: string;
  hasResume: boolean;
  hasCoverLetter: boolean;
}

interface JobHistoryPanelProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
  onNewApplication: () => void;
  refreshTrigger: number;
}

export function JobHistoryPanel({
  selectedId,
  onSelect,
  onNewApplication,
  refreshTrigger,
}: JobHistoryPanelProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/job-assistant/history?limit=20");
      const data = await response.json();

      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("Delete this application? This cannot be undone.")) {
      return;
    }

    try {
      setDeleting(id);
      const response = await fetch(`/api/job-assistant/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setApplications((prev) => prev.filter((app) => app.id !== id));
        if (selectedId === id) {
          onNewApplication();
        }
      }
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Failed to delete application. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Unknown";
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div className={`${cards.base} ${spacing.component}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Saved Applications
        </h3>
        <button
          onClick={onNewApplication}
          className={`${buttons.primary} flex items-center gap-1.5 text-sm px-3 py-1.5`}
          title="Create new application"
        >
          <Plus className="w-4 h-4" />
          New
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
        </div>
      )}

      {/* Empty State */}
      {!loading && applications.length === 0 && (
        <div className="text-center py-8">
          <Briefcase className="w-10 h-10 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            No saved applications yet.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
            Generate your first tailored resume to get started!
          </p>
        </div>
      )}

      {/* Applications List */}
      <div className="space-y-3">
        <AnimatePresence>
          {applications.map((app) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`
                ${cards.interactive} 
                ${spacing.tight}
                border-2 transition-all cursor-pointer
                ${
                  selectedId === app.id
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                    : "border-transparent hover:border-purple-300 dark:hover:border-purple-700"
                }
              `}
              onClick={() => onSelect(app.id)}
            >
              {/* Job Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                  {app.jobTitle || "Untitled Position"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {app.companyName || "Unknown Company"}
                </p>

                {/* Documents */}
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-500">
                  {app.hasResume && (
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Resume
                    </span>
                  )}
                  {app.hasCoverLetter && (
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Cover Letter
                    </span>
                  )}
                </div>

                {/* Date */}
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400 dark:text-gray-600">
                  <Clock className="w-3 h-3" />
                  {formatDate(app.createdAt)}
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={(e) => handleDelete(app.id, e)}
                disabled={deleting === app.id}
                className="ml-2 p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                title="Delete application"
              >
                {deleting === app.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show more hint */}
      {applications.length >= 20 && (
        <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-4">
          Showing 20 most recent applications
        </p>
      )}
    </div>
  );
}
