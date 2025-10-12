"use client";

import { useState, useCallback } from "react";
import { Upload, CheckCircle, XCircle, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { GuestPreviewModal } from "./guest-preview-modal";

interface ParsedResumeData {
  personal?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    summary?: string;
    title?: string;
  };
  // Legacy flat structure for backwards compatibility
  name?: string;
  email?: string;
  phone?: string;
  summary?: string;
  title?: string;
  experience?: Array<{
    title: string;
    company: string;
    duration?: string;
    period?: string;
    description: string;
    highlights?: string[];
    achievements?: string[];
  }>;
  education?: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
  skills?: Array<{
    category: string;
    items: string[];
  }>;
  [key: string]: unknown;
}

interface ProfileEnhancement {
  professionalTitle: string;
  taglines: string[];
  currentFocus: string[];
  bio?: string;
}

interface GuestResumeUploaderProps {
  onDataReady?: (data: ParsedResumeData, file: File) => void;
}

export function GuestResumeUploader({ onDataReady }: GuestResumeUploaderProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [profileEnhancements, setProfileEnhancements] =
    useState<ProfileEnhancement | null>(null);
  const [selectedTagline, setSelectedTagline] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);

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
        setError(null);
        setParsedData(null);
      } else {
        setError("Please upload a PDF file");
      }
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        setSelectedFile(files[0]);
        setError(null);
        setParsedData(null);
      }
    },
    [],
  );

  const handleProcess = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Convert file to base64 for temporary storage
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target?.result as string;

        try {
          // Step 1: Parse the resume
          const formData = new FormData();
          formData.append("file", selectedFile);

          const response = await fetch("/api/resume/parse", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to parse resume");
          }

          const result = await response.json();
          const resumeData = result.data;
          setParsedData(resumeData);

          // Step 2: Show parsing complete, start enhancement
          setIsProcessing(false);
          setIsEnhancing(true);

          // Step 3: Enhance profile with AI
          const enhanceResponse = await fetch("/api/resume/enhance-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resumeData }),
          });

          if (enhanceResponse.ok) {
            const enhanceResult = await enhanceResponse.json();
            setProfileEnhancements(enhanceResult.data);
            setSelectedTagline(enhanceResult.data.taglines[0] || "");

            // Store enhancements in sessionStorage
            sessionStorage.setItem(
              "guestProfileEnhancements",
              JSON.stringify(enhanceResult.data),
            );
          } else {
            console.error("Enhancement API failed, continuing without");
          }

          // Step 4: All processing complete
          setIsEnhancing(false);
          setShowPreview(true);

          // Store in sessionStorage for later use after registration
          sessionStorage.setItem(
            "guestResumeData",
            JSON.stringify({
              parsedData: resumeData,
              fileName: selectedFile.name,
              fileContent: fileContent,
              fileType: selectedFile.type,
              timestamp: Date.now(),
            }),
          );

          if (onDataReady) {
            onDataReady(resumeData, selectedFile);
          }
        } catch (innerError) {
          setIsProcessing(false);
          setIsEnhancing(false);
          throw innerError;
        }
      };

      reader.onerror = () => {
        setError("Failed to read file");
        setIsProcessing(false);
        setIsEnhancing(false);
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to process resume",
      );
      setIsProcessing(false);
    }
  };

  const handlePublish = () => {
    // Store the current data and redirect to registration with a callback
    if (parsedData && selectedFile) {
      // Update sessionStorage with selected enhancements
      if (profileEnhancements && selectedTagline) {
        sessionStorage.setItem(
          "guestProfileEnhancements",
          JSON.stringify({
            selectedTagline: selectedTagline,
            professionalTitle: profileEnhancements.professionalTitle,
            currentFocus: profileEnhancements.currentFocus,
            bio: profileEnhancements.bio,
          }),
        );
      }

      sessionStorage.setItem(
        "redirectAfterAuth",
        "/admin/dashboard?uploadResume=true",
      );
      router.push("/admin/register");
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setParsedData(null);
    setError(null);
    setShowPreview(false);
    sessionStorage.removeItem("guestResumeData");
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {!showPreview && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
            isDragging
              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-105"
              : "border-gray-300 dark:border-gray-600 hover:border-purple-400 bg-white/50 dark:bg-gray-800/50"
          }`}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${
              selectedFile || isProcessing ? "pointer-events-none" : ""
            }`}
            disabled={isProcessing}
          />

          <div className="flex flex-col items-center gap-4">
            <div
              className={`p-4 rounded-full transition-all ${
                isDragging
                  ? "bg-purple-100 dark:bg-purple-900/30 scale-110"
                  : "bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30"
              }`}
            >
              {isProcessing || isEnhancing ? (
                <Loader2 className="w-12 h-12 text-purple-600 dark:text-purple-400 animate-spin" />
              ) : (
                <Upload
                  className={`w-12 h-12 ${
                    isDragging
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-purple-500"
                  }`}
                />
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedFile
                  ? isProcessing
                    ? "Parsing your resume..."
                    : isEnhancing
                    ? "Generating AI suggestions..."
                    : selectedFile.name
                  : "Drop your resume here"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {selectedFile
                  ? isProcessing
                    ? "Extracting your experience, skills, and education"
                    : isEnhancing
                    ? "Creating personalized taglines and professional branding"
                    : `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB • PDF`
                  : "or click to browse • PDF only • Max 10MB"}
              </p>
            </div>

            {selectedFile && !isProcessing && (
              <div className="mt-4 flex items-center gap-3 relative z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProcess();
                  }}
                  className="group px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Parse with AI</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                  className="px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-sm font-medium"
                >
                  Change File
                </button>
              </div>
            )}

            {isProcessing && (
              <div className="mt-4 flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <span className="font-medium">
                  AI is analyzing your experience...
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-xl border-2 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          >
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 dark:text-red-100">
                  Error
                </h4>
                <p className="text-sm mt-1 text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview */}
      <AnimatePresence>
        {showPreview && parsedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Success Banner */}
            <div className="p-6 rounded-xl border-2 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900 dark:text-green-100">
                    Resume Parsed Successfully!
                  </h4>
                  <p className="text-sm mt-1 text-green-700 dark:text-green-300">
                    AI has extracted your professional information.
                    {isEnhancing && " Generating your professional tagline..."}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Enhancements */}
            {isEnhancing && (
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Crafting Your Professional Brand
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      AI is generating compelling taglines and profile
                      enhancements...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isEnhancing && profileEnhancements && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6 space-y-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Your Professional Brand
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      AI-generated to make you stand out
                    </p>
                  </div>
                </div>

                {/* Professional Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Professional Title
                  </label>
                  <div className="px-4 py-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <p className="text-purple-900 dark:text-purple-100 font-medium">
                      {profileEnhancements.professionalTitle}
                    </p>
                  </div>
                </div>

                {/* Tagline Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Choose Your Tagline
                  </label>
                  <div className="space-y-2">
                    {profileEnhancements.taglines.map((tagline, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTagline(tagline)}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                          selectedTagline === tagline
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-md"
                            : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                        }`}
                      >
                        <p
                          className={`text-sm ${
                            selectedTagline === tagline
                              ? "text-purple-900 dark:text-purple-100 font-medium"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {tagline}
                        </p>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    ✨ Click to select your favorite
                  </p>
                </div>

                {/* Current Focus */}
                {profileEnhancements.currentFocus.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Current Focus
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {profileEnhancements.currentFocus.map((focus, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium"
                        >
                          {focus}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Preview Content */}
            <div className="glass rounded-2xl p-6 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {parsedData.personal?.name ||
                      parsedData.name ||
                      "Your Name"}
                  </h3>
                  {(parsedData.personal?.email || parsedData.email) && (
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {parsedData.personal?.email || parsedData.email}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Upload Different Resume
                </button>
              </div>

              {(parsedData.personal?.summary || parsedData.summary) && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Summary
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {parsedData.personal?.summary || parsedData.summary}
                  </p>
                </div>
              )}

              {parsedData.experience && parsedData.experience.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Experience
                  </h4>
                  <div className="space-y-3">
                    {parsedData.experience.slice(0, 2).map((exp, idx) => (
                      <div key={idx} className="text-sm">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {exp.title} at {exp.company}
                        </p>
                        <p className="text-gray-500 dark:text-gray-500 text-xs">
                          {exp.duration}
                        </p>
                      </div>
                    ))}
                    {parsedData.experience.length > 2 && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        +{parsedData.experience.length - 2} more positions
                      </p>
                    )}
                  </div>
                </div>
              )}

              {parsedData.skills && parsedData.skills.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {parsedData.skills.slice(0, 3).map((skillCategory, idx) => (
                      <div key={idx} className="flex flex-wrap gap-1">
                        {Array.isArray(skillCategory.items) &&
                          skillCategory.items
                            .slice(0, 3)
                            .map((skill: string, skillIdx: number) => (
                              <span
                                key={`${idx}-${skillIdx}`}
                                className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                      </div>
                    ))}
                    {parsedData.skills.length > 3 && (
                      <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs">
                        +more skills
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Publish CTA */}
            <div className="glass rounded-2xl p-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 mb-2">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Ready to Go Live?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Create your free account to publish your AI-powered portfolio
                and start connecting with opportunities.
              </p>
              <div className="flex gap-3 justify-center flex-wrap pt-2">
                <button
                  onClick={() => setShowFullPreview(true)}
                  className="px-6 py-3 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-purple-200 dark:border-purple-700 font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300 flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span>Preview Full Page</span>
                </button>
                <button
                  onClick={handlePublish}
                  className="group px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <span>Publish My Portfolio</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                No credit card required • Takes less than 2 minutes
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Box */}
      {!showPreview && (
        <div className="glass rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            How it works:
          </h4>
          <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-decimal list-inside">
            <li>Upload your resume PDF (no account needed)</li>
            <li>AI automatically extracts and structures your data</li>
            <li>Preview your professional portfolio</li>
            <li>Create a free account to publish and go live</li>
          </ol>
        </div>
      )}

      {/* Full Page Preview Modal */}
      {showFullPreview && parsedData && (
        <GuestPreviewModal
          parsedData={parsedData}
          profileEnhancements={profileEnhancements || undefined}
          selectedTagline={selectedTagline}
          onClose={() => setShowFullPreview(false)}
        />
      )}
    </div>
  );
}
