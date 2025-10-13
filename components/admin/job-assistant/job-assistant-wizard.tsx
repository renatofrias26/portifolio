"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Link as LinkIcon,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  Save,
  Download,
  Copy,
  X,
  Eye,
  Edit,
  TrendingUp,
} from "lucide-react";
import { cards, buttons, spacing, typography, formInput } from "@/lib/styles";
import { MarkdownEditor } from "./markdown-editor";
import { ResumePreview } from "./resume-preview";
import { JobFitScore } from "./job-fit-score";
import { AILoader } from "@/components/ui/ai-loader";
import { useToast } from "@/components/ui/toast";
import { useConfirm } from "@/components/ui/confirm-dialog";
import type { JobFitAnalysis } from "@/lib/job-assistant";

interface WizardState {
  resumeSource: "existing" | "upload";
  resumeFile: File | null;
  jobUrl: string;
  jobDescription: string;
  jobTitle: string;
  companyName: string;
  generateResume: boolean;
  generateCoverLetter: boolean;
}

interface GeneratedResults {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  jobUrl?: string;
  resumeSource: string;
  resumeVersion?: number;
  resumeSnapshot: unknown;
  tailoredResume?: string;
  coverLetter?: string;
  resumeRecommendations?: string[];
  resumeKeyChanges?: string[];
  coverLetterRecommendations?: string[];
  coverLetterKeyPoints?: string[];
  tokensUsed: number;
  remainingCredits: number;
}

interface JobAssistantWizardProps {
  selectedApplicationId: number | null;
  onSaved: () => void;
  onClearSelection: () => void;
}

export function JobAssistantWizard({
  selectedApplicationId,
  onSaved,
  onClearSelection,
}: JobAssistantWizardProps) {
  const toast = useToast();
  const { confirm } = useConfirm();

  const [state, setState] = useState<WizardState>({
    resumeSource: "existing",
    resumeFile: null,
    jobUrl: "",
    jobDescription: "",
    jobTitle: "",
    companyName: "",
    generateResume: true,
    generateCoverLetter: true,
  });

  const [loading, setLoading] = useState(false);
  const [loadingApp, setLoadingApp] = useState(false);
  const [analyzingFit, setAnalyzingFit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<GeneratedResults | null>(null);
  const [fitAnalysis, setFitAnalysis] = useState<JobFitAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<"resume" | "coverLetter">(
    "resume",
  );
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");

  // Edited versions (user can modify)
  const [editedResume, setEditedResume] = useState<string | null>(null);
  const [editedCoverLetter, setEditedCoverLetter] = useState<string | null>(
    null,
  );

  // Load selected application
  useEffect(() => {
    if (selectedApplicationId) {
      loadApplication(selectedApplicationId);
    } else {
      // Reset when no selection
      resetForm();
    }
  }, [selectedApplicationId]);

  const loadApplication = async (id: number) => {
    try {
      setLoadingApp(true);
      const response = await fetch(`/api/job-assistant/history/${id}`);
      const data = await response.json();

      if (data.success && data.application) {
        const app = data.application;

        // Set the form state from loaded application
        setState({
          resumeSource: app.resume_source,
          resumeFile: null,
          jobUrl: app.job_url || "",
          jobDescription: app.job_description || "",
          jobTitle: app.job_title || "",
          companyName: app.company_name || "",
          generateResume: !!app.tailored_resume,
          generateCoverLetter: !!app.cover_letter,
        });

        // Set results to show the editor
        setResults({
          jobTitle: app.job_title,
          companyName: app.company_name,
          jobDescription: app.job_description,
          jobUrl: app.job_url,
          resumeSource: app.resume_source,
          resumeVersion: app.resume_version,
          resumeSnapshot: app.resume_snapshot,
          tailoredResume: app.tailored_resume,
          coverLetter: app.cover_letter,
          tokensUsed: 0, // Already charged
          remainingCredits: 0, // Not relevant for loaded
        });

        setEditedResume(app.tailored_resume);
        setEditedCoverLetter(app.cover_letter);

        if (app.tailored_resume) setActiveTab("resume");
        else if (app.cover_letter) setActiveTab("coverLetter");
      }
    } catch (err) {
      console.error("Failed to load application:", err);
      setError("Failed to load application");
    } finally {
      setLoadingApp(false);
    }
  };

  const resetForm = () => {
    setState({
      resumeSource: "existing",
      resumeFile: null,
      jobUrl: "",
      jobDescription: "",
      jobTitle: "",
      companyName: "",
      generateResume: true,
      generateCoverLetter: true,
    });
    setResults(null);
    setFitAnalysis(null);
    setEditedResume(null);
    setEditedCoverLetter(null);
    setError(null);
    setActiveTab("resume");
  };

  const handleAnalyzeFit = async () => {
    setError(null);
    setAnalyzingFit(true);

    try {
      const formData = new FormData();
      formData.append("resumeSource", state.resumeSource);
      if (state.resumeFile) {
        formData.append("resumeFile", state.resumeFile);
      }
      if (state.jobUrl) {
        formData.append("jobUrl", state.jobUrl);
      }
      if (state.jobDescription) {
        formData.append("jobDescription", state.jobDescription);
      }
      if (state.jobTitle) {
        formData.append("jobTitle", state.jobTitle);
      }
      if (state.companyName) {
        formData.append("companyName", state.companyName);
      }

      const response = await fetch("/api/job-assistant/analyze-fit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze job fit");
      }

      setFitAnalysis(data.analysis);

      // Update job info if extracted
      if (data.jobInfo) {
        setState((prev) => ({
          ...prev,
          jobTitle: data.jobInfo.title || prev.jobTitle,
          companyName: data.jobInfo.company || prev.companyName,
        }));
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to analyze job fit. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setAnalyzingFit(false);
    }
  };

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("resumeSource", state.resumeSource);
      if (state.resumeFile) {
        formData.append("resumeFile", state.resumeFile);
      }
      if (state.jobUrl) {
        formData.append("jobUrl", state.jobUrl);
      }
      if (state.jobDescription) {
        formData.append("jobDescription", state.jobDescription);
      }
      if (state.jobTitle) {
        formData.append("jobTitle", state.jobTitle);
      }
      if (state.companyName) {
        formData.append("companyName", state.companyName);
      }
      formData.append("generateResume", state.generateResume.toString());
      formData.append(
        "generateCoverLetter",
        state.generateCoverLetter.toString(),
      );

      const response = await fetch("/api/job-assistant/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate documents");
      }

      setResults(data.data);
      setEditedResume(data.data.tailoredResume || null);
      setEditedCoverLetter(data.data.coverLetter || null);

      // Switch to first available tab
      if (data.data.tailoredResume) {
        setActiveTab("resume");
      } else if (data.data.coverLetter) {
        setActiveTab("coverLetter");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to generate documents. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!results) return;

    setSaving(true);
    try {
      const response = await fetch("/api/job-assistant/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: results.jobTitle,
          companyName: results.companyName,
          jobDescription: results.jobDescription,
          jobUrl: results.jobUrl,
          resumeSource: results.resumeSource,
          resumeVersion: results.resumeVersion,
          resumeSnapshot: results.resumeSnapshot,
          tailoredResume: results.tailoredResume,
          coverLetter: results.coverLetter,
          tailoredResumeEdited: editedResume,
          coverLetterEdited: editedCoverLetter,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save");
      }

      // Success - refresh history
      onSaved();

      // Show success message
      toast.success("Application saved successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const canGenerate =
    (state.jobUrl || state.jobDescription) &&
    (state.generateResume || state.generateCoverLetter);

  const canAnalyze = state.jobUrl || state.jobDescription;

  return (
    <div className="glass rounded-2xl p-4 sm:p-6 relative">
      {/* AI Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-[100] flex items-center justify-center"
            style={{ pointerEvents: loading ? "auto" : "none" }}
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl max-w-md">
              <AILoader
                isLoading={true}
                type={
                  state.generateResume && state.generateCoverLetter
                    ? "resume" // Default to resume when both
                    : state.generateResume
                    ? "resume"
                    : "cover-letter"
                }
              />
            </div>
          </motion.div>
        )}

        {analyzingFit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-[100] flex items-center justify-center"
            style={{ pointerEvents: analyzingFit ? "auto" : "none" }}
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl max-w-md">
              <AILoader isLoading={true} type="job-fit" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loadingApp ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      ) : (
        <>
          {/* Header with clear selection */}
          {selectedApplicationId && (
            <div className="mb-4 flex items-center justify-between bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <div>
                <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                  Editing saved application
                </p>
                <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                  {results?.jobTitle} at {results?.companyName}
                </p>
              </div>
              <button
                onClick={onClearSelection}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
                  error.includes("URL") || error.includes("fetch")
                    ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                    : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                }`}
              >
                <AlertCircle
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    error.includes("URL") || error.includes("fetch")
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                />
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      error.includes("URL") || error.includes("fetch")
                        ? "text-amber-900 dark:text-amber-100"
                        : "text-red-900 dark:text-red-100"
                    }`}
                  >
                    {error.includes("URL") || error.includes("fetch")
                      ? "URL Not Accessible"
                      : "Error"}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      error.includes("URL") || error.includes("fetch")
                        ? "text-amber-700 dark:text-amber-300"
                        : "text-red-700 dark:text-red-300"
                    }`}
                  >
                    {error}
                  </p>
                  {(error.includes("URL") || error.includes("fetch")) && (
                    <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800">
                      <p className="text-xs font-medium text-amber-900 dark:text-amber-100 mb-2">
                        💡 Quick Fix:
                      </p>
                      <ol className="text-xs text-amber-700 dark:text-amber-300 space-y-1 list-decimal list-inside">
                        <li>Open the job posting in your browser</li>
                        <li>
                          Copy the entire job description (Cmd/Ctrl+A, then
                          Cmd/Ctrl+C)
                        </li>
                        <li>
                          Paste it in the &quot;Job Description&quot; field
                          below
                        </li>
                        <li>Click Generate - works 100% of the time!</li>
                      </ol>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setError(null)}
                  className={
                    error.includes("URL") || error.includes("fetch")
                      ? "text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200"
                      : "text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                  }
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form or Results */}
          {!results ? (
            <>
              {/* Step 1: Resume Source */}
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Step 1: Select Resume Source
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() =>
                      setState((s) => ({ ...s, resumeSource: "existing" }))
                    }
                    className={`
                      p-6 rounded-xl border-2 transition-all
                      ${
                        state.resumeSource === "existing"
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                      }
                    `}
                  >
                    <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Use Published Resume
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Use your current published resume from your portfolio
                    </p>
                  </button>

                  <button
                    onClick={() =>
                      setState((s) => ({ ...s, resumeSource: "upload" }))
                    }
                    className={`
                      p-6 rounded-xl border-2 transition-all
                      ${
                        state.resumeSource === "upload"
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                      }
                    `}
                  >
                    <Upload className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Upload New PDF
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Upload a different resume (temporary, not saved)
                    </p>
                  </button>
                </div>

                {/* File Upload */}
                {state.resumeSource === "upload" && (
                  <div className="mt-4">
                    <label className={formInput.label}>Upload Resume PDF</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) =>
                        setState((s) => ({
                          ...s,
                          resumeFile: e.target.files?.[0] || null,
                        }))
                      }
                      className={formInput.base}
                    />
                    {state.resumeFile && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Selected: {state.resumeFile.name}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Step 2: Job Details */}
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Step 2: Job Details
                </h3>

                {/* Job URL */}
                <div className="mb-4">
                  <label className={formInput.label}>
                    <LinkIcon className="w-4 h-4 inline mr-2" />
                    Job Posting URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={state.jobUrl}
                    onChange={(e) =>
                      setState((s) => ({ ...s, jobUrl: e.target.value }))
                    }
                    placeholder="https://jobs.lever.co/example/..."
                    className={formInput.base}
                  />
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <p>
                      ✓ Works well: Greenhouse, Lever, Workday, Indeed, most ATS
                      platforms
                    </p>
                    <p className="text-gray-500 dark:text-gray-500">
                      ✗ May not work: LinkedIn (login required), sites with
                      heavy anti-bot protection
                    </p>
                    <p className="text-amber-600 dark:text-amber-400 font-medium">
                      → If URL fails, just paste the job description below
                      instead
                    </p>
                  </div>
                </div>

                {/* OR Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      OR
                    </span>
                  </div>
                </div>

                {/* Manual Job Description */}
                <div className="mb-4">
                  <label className={formInput.label}>
                    Job Description (Paste full posting)
                  </label>
                  <textarea
                    value={state.jobDescription}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        jobDescription: e.target.value,
                      }))
                    }
                    rows={8}
                    placeholder="Paste the complete job posting here..."
                    className={formInput.base}
                  />
                </div>

                {/* Optional overrides */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={formInput.label}>
                      Job Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={state.jobTitle}
                      onChange={(e) =>
                        setState((s) => ({ ...s, jobTitle: e.target.value }))
                      }
                      placeholder="e.g., Senior Software Engineer"
                      className={formInput.base}
                    />
                  </div>
                  <div>
                    <label className={formInput.label}>
                      Company Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={state.companyName}
                      onChange={(e) =>
                        setState((s) => ({
                          ...s,
                          companyName: e.target.value,
                        }))
                      }
                      placeholder="e.g., Google"
                      className={formInput.base}
                    />
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                  Leave blank to auto-detect from job description
                </p>
              </div>

              {/* Step 3: What to Generate */}
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Step 3: What to Generate
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.generateResume}
                      onChange={(e) =>
                        setState((s) => ({
                          ...s,
                          generateResume: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Tailored Resume
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ATS-optimized resume matching job requirements (10
                        credits)
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.generateCoverLetter}
                      onChange={(e) =>
                        setState((s) => ({
                          ...s,
                          generateCoverLetter: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Cover Letter
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Personalized cover letter highlighting your fit (5
                        credits)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Job Fit Analysis Section */}
              {!fitAnalysis && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                      Optional: Analyze Job Fit First
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get an instant assessment of how well you match this job
                      before generating documents (2 credits)
                    </p>
                  </div>
                  <button
                    onClick={handleAnalyzeFit}
                    disabled={!canAnalyze || analyzingFit}
                    className={`
                      ${buttons.secondary}
                      disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center gap-2
                    `}
                  >
                    {analyzingFit ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing Fit...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-5 h-5" />
                        Analyze Job Fit
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Display Fit Analysis Results */}
              {fitAnalysis && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                  <JobFitScore
                    analysis={fitAnalysis}
                    jobTitle={state.jobTitle || "Position"}
                    companyName={state.companyName || "Company"}
                  />
                </div>
              )}

              {/* Generate Button */}
              <div className="flex items-center gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                <button
                  onClick={handleGenerate}
                  disabled={!canGenerate || loading}
                  className={`
                    ${buttons.primary}
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center gap-2
                  `}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Documents
                    </>
                  )}
                </button>

                {state.generateResume && state.generateCoverLetter && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Cost: 15 credits
                  </span>
                )}
                {state.generateResume && !state.generateCoverLetter && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Cost: 10 credits
                  </span>
                )}
                {!state.generateResume && state.generateCoverLetter && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Cost: 5 credits
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Results View */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3
                    className={`${typography.h3} text-gray-900 dark:text-white`}
                  >
                    Documents Generated!
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {results.jobTitle} at {results.companyName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {results.tokensUsed} credits used • {results.remainingCredits}{" "}
                  remaining
                </p>
              </div>

              {/* AI Recommendations Section */}
              {((activeTab === "resume" &&
                (results.resumeRecommendations?.length ||
                  results.resumeKeyChanges?.length)) ||
                (activeTab === "coverLetter" &&
                  (results.coverLetterRecommendations?.length ||
                    results.coverLetterKeyPoints?.length))) && (
                <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        AI Strategy & Recommendations
                      </h4>

                      {activeTab === "resume" && (
                        <>
                          {results.resumeRecommendations &&
                            results.resumeRecommendations.length > 0 && (
                              <div className="mb-3">
                                <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                                  💡 Strategy:
                                </p>
                                <ul className="space-y-1">
                                  {results.resumeRecommendations.map(
                                    (rec, idx) => (
                                      <li
                                        key={idx}
                                        className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2"
                                      >
                                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                                          •
                                        </span>
                                        <span>{rec}</span>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            )}

                          {results.resumeKeyChanges &&
                            results.resumeKeyChanges.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                                  🔧 Key Changes Made:
                                </p>
                                <ul className="space-y-1">
                                  {results.resumeKeyChanges.map(
                                    (change, idx) => (
                                      <li
                                        key={idx}
                                        className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2"
                                      >
                                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                                          •
                                        </span>
                                        <span>{change}</span>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            )}
                        </>
                      )}

                      {activeTab === "coverLetter" && (
                        <>
                          {results.coverLetterRecommendations &&
                            results.coverLetterRecommendations.length > 0 && (
                              <div className="mb-3">
                                <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                                  💡 Writing Strategy:
                                </p>
                                <ul className="space-y-1">
                                  {results.coverLetterRecommendations.map(
                                    (rec, idx) => (
                                      <li
                                        key={idx}
                                        className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2"
                                      >
                                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                                          •
                                        </span>
                                        <span>{rec}</span>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            )}

                          {results.coverLetterKeyPoints &&
                            results.coverLetterKeyPoints.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                                  ✨ What Makes This Effective:
                                </p>
                                <ul className="space-y-1">
                                  {results.coverLetterKeyPoints.map(
                                    (point, idx) => (
                                      <li
                                        key={idx}
                                        className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2"
                                      >
                                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                                          •
                                        </span>
                                        <span>{point}</span>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Document Tabs */}
              <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-700">
                {results.tailoredResume && (
                  <button
                    onClick={() => setActiveTab("resume")}
                    className={`
                      px-4 py-2 font-medium transition-all border-b-2
                      ${
                        activeTab === "resume"
                          ? "border-purple-600 text-purple-600 dark:text-purple-400"
                          : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      }
                    `}
                  >
                    Resume
                  </button>
                )}
                {results.coverLetter && (
                  <button
                    onClick={() => setActiveTab("coverLetter")}
                    className={`
                      px-4 py-2 font-medium transition-all border-b-2
                      ${
                        activeTab === "coverLetter"
                          ? "border-purple-600 text-purple-600 dark:text-purple-400"
                          : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      }
                    `}
                  >
                    Cover Letter
                  </button>
                )}
              </div>

              {/* Markdown Editor */}
              <div className="mb-6">
                {/* Edit/Preview Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setViewMode("edit")}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2
                      ${
                        viewMode === "edit"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setViewMode("preview")}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2
                      ${
                        viewMode === "preview"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                </div>

                {/* Editor or Preview */}
                {viewMode === "edit" ? (
                  <>
                    {activeTab === "resume" && editedResume && (
                      <MarkdownEditor
                        value={editedResume}
                        onChange={setEditedResume}
                      />
                    )}
                    {activeTab === "coverLetter" && editedCoverLetter && (
                      <MarkdownEditor
                        value={editedCoverLetter}
                        onChange={setEditedCoverLetter}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {activeTab === "resume" && editedResume && (
                      <ResumePreview
                        content={editedResume}
                        type="resume"
                        jobTitle={results?.jobTitle}
                        companyName={results?.companyName}
                      />
                    )}
                    {activeTab === "coverLetter" && editedCoverLetter && (
                      <ResumePreview
                        content={editedCoverLetter}
                        type="cover-letter"
                        jobTitle={results?.jobTitle}
                        companyName={results?.companyName}
                      />
                    )}
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`${buttons.primary} flex items-center gap-2`}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save to History
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    const text =
                      activeTab === "resume" ? editedResume : editedCoverLetter;
                    if (text) handleCopy(text);
                  }}
                  className={`${buttons.secondary} flex items-center gap-2`}
                >
                  <Copy className="w-4 h-4" />
                  Copy Markdown
                </button>

                <button
                  onClick={() => {
                    const text =
                      activeTab === "resume" ? editedResume : editedCoverLetter;
                    const filename =
                      activeTab === "resume"
                        ? `${results.companyName}-Resume.md`
                        : `${results.companyName}-CoverLetter.md`;
                    if (text) handleDownload(text, filename);
                  }}
                  className={`${buttons.secondary} flex items-center gap-2`}
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>

                <button
                  onClick={() => {
                    confirm({
                      title: "Start New Application?",
                      message: "Unsaved changes will be lost.",
                      type: "warning",
                      confirmText: "Start New",
                      cancelText: "Cancel",
                      onConfirm: () => {
                        resetForm();
                      },
                    });
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  New Application
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
