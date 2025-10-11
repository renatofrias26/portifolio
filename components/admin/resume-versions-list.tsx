"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { PreviewModal } from "./preview-modal";
import { EditModal } from "./edit-modal";

interface ResumeVersion {
  id: number;
  version: number;
  is_published: boolean;
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

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/resume-versions");
      const data = await response.json();

      if (response.ok) {
        setVersions(data.versions);
      } else {
        setError(data.error || "Failed to load versions");
      }
    } catch (err) {
      setError("Failed to load resume versions");
    } finally {
      setIsLoading(false);
    }
  };

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
    } catch (err) {
      alert("Failed to publish version");
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
          No resume versions yet. Upload your first resume to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {versions.map((version, index) => (
        <motion.div
          key={version.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`glass rounded-xl p-6 border-2 ${
            version.is_published
              ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10"
              : "border-gray-200 dark:border-gray-700"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold">
                  Version {version.version}
                </h3>
                {version.is_published && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Published
                  </span>
                )}
                {!version.is_published && (
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

              {version.pdf_url && (
                <a
                  href={version.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 hover:underline mt-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View PDF
                </a>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewVersionId(version.id)}
                className="p-2 rounded-lg glass hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                title="Preview"
              >
                <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </button>
              <button
                onClick={() => setEditVersionId(version.id)}
                className="p-2 rounded-lg glass hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                title="Edit"
              >
                <Edit className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </button>
              {!version.is_published && (
                <button
                  onClick={() => handlePublish(version.id)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-blue-500 text-white font-medium hover:shadow-lg transition-all"
                >
                  Publish
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ))}

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
