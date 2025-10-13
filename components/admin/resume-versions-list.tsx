"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  ExternalLink,
  Loader2,
  Archive,
  ArchiveRestore,
  Download,
  MoreVertical,
} from "lucide-react";
import { PreviewModal } from "./preview-modal";
import { EditModal } from "./edit-modal";
import { spacing, buttons } from "@/lib/styles";

interface ResumeVersion {
  id: number;
  version: number;
  is_published: boolean;
  is_archived?: boolean;
  created_at: string;
  updated_at: string;
  pdf_url?: string;
}

export function ResumeVersionsList() {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewVersionId, setPreviewVersionId] = useState<number | null>(null);
  const [editVersionId, setEditVersionId] = useState<number | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const fetchVersions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/admin/resume-versions?includeArchived=${showArchived}`,
      );
      const data = await response.json();

      if (response.ok) {
        setVersions(data.versions);
      } else {
        setError(data.error || "Failed to load versions");
      }
    } catch {
      setError("Failed to load resume versions");
    } finally {
      setIsLoading(false);
    }
  }, [showArchived]);

  useEffect(() => {
    fetchVersions();
  }, [showArchived, fetchVersions]);

  const handlePublish = async (versionId: number) => {
    try {
      const response = await fetch("/api/admin/publish-version", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId }),
      });

      if (response.ok) {
        // Refresh the list
        fetchVersions();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to publish version");
      }
    } catch {
      alert("Failed to publish version");
    }
  };

  const handleArchive = async (
    versionId: number,
    action: "archive" | "unarchive",
  ) => {
    try {
      const response = await fetch("/api/admin/archive-version", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId, action }),
      });

      if (response.ok) {
        // Refresh the list
        fetchVersions();
      } else {
        const data = await response.json();
        alert(data.error || `Failed to ${action} version`);
      }
    } catch {
      alert(`Failed to ${action} version`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          {showArchived
            ? "No archived versions found."
            : "No resume versions yet. Upload your first resume to get started!"}
        </p>
      </div>
    );
  }

  const archivedCount = versions.filter((v) => v.is_archived).length;
  const activeCount = versions.filter((v) => !v.is_archived).length;

  return (
    <div className={spacing.subsection}>
      {/* Archive Toggle */}
      <div className="flex items-center justify-between glass rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <Archive className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <div>
            <p className="font-medium">Show Archived Versions</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {showArchived
                ? `Showing all versions (${versions.length} total)`
                : `${activeCount} active, ${archivedCount} archived`}
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
        </label>
      </div>

      {/* Versions List */}
      <div className={spacing.subsection}>
        {versions.map((version, index) => (
          <motion.div
            key={version.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass rounded-xl p-6 border-2 ${
              version.is_archived
                ? "border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/10 opacity-75"
                : version.is_published
                ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                  <h3 className="text-lg font-semibold">
                    Version {version.version}
                  </h3>
                  {version.is_published && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Published
                    </span>
                  )}
                  {version.is_archived && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium">
                      <Archive className="w-4 h-4" />
                      Archived
                    </span>
                  )}
                  {!version.is_published && !version.is_archived && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium">
                      <Clock className="w-4 h-4" />
                      Draft
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>
                    <strong>Created:</strong>{" "}
                    {new Date(version.created_at).toLocaleString()}
                  </p>
                  {version.updated_at !== version.created_at && (
                    <p>
                      <strong>Updated:</strong>{" "}
                      {new Date(version.updated_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* PDF View Action */}
                {version.pdf_url && (
                  <a
                    href={version.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg glass hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors group relative"
                    title="View PDF in new tab"
                  >
                    <ExternalLink className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      View PDF
                    </span>
                  </a>
                )}

                {/* Preview Button */}
                <button
                  onClick={() => setPreviewVersionId(version.id)}
                  className="p-2 rounded-lg glass hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors group relative"
                  title="Preview portfolio"
                >
                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Preview
                  </span>
                </button>

                {/* Publish Button */}
                {!version.is_published && !version.is_archived && (
                  <button
                    onClick={() => handlePublish(version.id)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-blue-500 text-white text-sm font-medium hover:shadow-lg transition-all group relative"
                    title="Publish this version"
                  >
                    Publish
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      Make Live
                    </span>
                  </button>
                )}

                {/* More Actions Menu */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === version.id ? null : version.id,
                      )
                    }
                    className="p-2 rounded-lg glass hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group relative"
                    title="More actions"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      More
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === version.id && (
                    <>
                      {/* Backdrop to close menu */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenMenuId(null)}
                      />
                      <div className="absolute right-0 mt-2 w-48 glass rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
                        {version.pdf_url && (
                          <a
                            href={version.pdf_url}
                            download
                            onClick={() => setOpenMenuId(null)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          >
                            <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium">
                              Download PDF
                            </span>
                          </a>
                        )}

                        <button
                          onClick={() => {
                            setEditVersionId(version.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                        >
                          <Edit className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span className="text-sm font-medium">Edit</span>
                        </button>

                        {!version.is_published &&
                          (version.is_archived ? (
                            <button
                              onClick={() => {
                                handleArchive(version.id, "unarchive");
                                setOpenMenuId(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                            >
                              <ArchiveRestore className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                              <span className="text-sm font-medium">
                                Unarchive
                              </span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                handleArchive(version.id, "archive");
                                setOpenMenuId(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <Archive className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              <span className="text-sm font-medium">
                                Archive
                              </span>
                            </button>
                          ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Preview Modal */}
      <PreviewModal
        versionId={previewVersionId}
        isOpen={previewVersionId !== null}
        onClose={() => setPreviewVersionId(null)}
      />

      {/* Edit Modal */}
      <EditModal
        versionId={editVersionId}
        isOpen={editVersionId !== null}
        onClose={() => setEditVersionId(null)}
        onSaveSuccess={fetchVersions}
      />
    </div>
  );
}
