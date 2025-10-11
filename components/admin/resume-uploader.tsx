"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadResult {
  success: boolean;
  message?: string;
  data?: {
    id: number;
    version: number;
    pdfUrl: string;
    parsedData: any;
  };
  error?: string;
  details?: string;
}

interface ResumeUploaderProps {
  onUploadSuccess?: () => void;
}

export function ResumeUploader({ onUploadSuccess }: ResumeUploaderProps = {}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setUploadResult(null);
      } else {
        setUploadResult({
          success: false,
          error: "Please upload a PDF file",
        });
      }
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        setSelectedFile(files[0]);
        setUploadResult(null);
      }
    },
    [],
  );

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/admin/upload-resume", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResult(result);
        setSelectedFile(null);
        // Call the callback to refresh the versions list
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        setUploadResult({
          success: false,
          error: result.error || "Upload failed",
          details: result.details,
        });
      }
    } catch (error) {
      setUploadResult({
        success: false,
        error: "Failed to upload resume",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
          isDragging
            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-purple-400"
        }`}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${
            selectedFile ? "pointer-events-none" : ""
          }`}
          disabled={isUploading}
        />

        <div className="flex flex-col items-center gap-4">
          <div
            className={`p-4 rounded-full ${
              isDragging
                ? "bg-purple-100 dark:bg-purple-900/30"
                : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            <Upload
              className={`w-12 h-12 ${
                isDragging
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-400"
              }`}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedFile ? selectedFile.name : "Upload Resume PDF"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {selectedFile
                ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                : "Drag and drop or click to browse"}
            </p>
          </div>

          {selectedFile && !isUploading && (
            <div className="mt-4 flex items-center gap-3 relative z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpload();
                }}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium hover:shadow-lg transition-all"
              >
                Upload & Parse with AI
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  setUploadResult(null);
                }}
                className="px-4 py-3 rounded-lg glass hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm"
              >
                Change File
              </button>
            </div>
          )}

          {isUploading && (
            <div className="mt-4 flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-medium">Processing...</span>
            </div>
          )}
        </div>
      </div>

      {/* Upload Result */}
      <AnimatePresence>
        {uploadResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-6 rounded-xl border-2 ${
              uploadResult.success
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            }`}
          >
            <div className="flex items-start gap-4">
              {uploadResult.success ? (
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
              )}

              <div className="flex-1">
                <h4
                  className={`font-semibold ${
                    uploadResult.success
                      ? "text-green-900 dark:text-green-100"
                      : "text-red-900 dark:text-red-100"
                  }`}
                >
                  {uploadResult.success ? "Success!" : "Upload Failed"}
                </h4>
                <p
                  className={`text-sm mt-1 ${
                    uploadResult.success
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300"
                  }`}
                >
                  {uploadResult.message || uploadResult.error}
                </p>

                {uploadResult.details && (
                  <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                    {uploadResult.details}
                  </p>
                )}

                {uploadResult.success && uploadResult.data && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Version:</strong> {uploadResult.data.version}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Status:</strong> Draft (not published yet)
                    </p>
                    <a
                      href={uploadResult.data.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:underline mt-2"
                    >
                      <FileText className="w-4 h-4" />
                      View uploaded PDF
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="glass rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
          📋 How it works:
        </h4>
        <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-decimal list-inside">
          <li>Upload your resume PDF (max 10MB)</li>
          <li>AI automatically extracts and structures your data</li>
          <li>Review the parsed data (coming soon)</li>
          <li>Publish to update your live portfolio (coming soon)</li>
        </ol>
      </div>
    </div>
  );
}
