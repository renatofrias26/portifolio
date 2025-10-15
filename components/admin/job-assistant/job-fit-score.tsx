"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Lightbulb, TrendingUp } from "lucide-react";
import { cards, typography, spacing } from "@/lib/styles";
import type { JobFitAnalysis } from "@/lib/job-assistant";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface JobFitScoreProps {
  analysis: JobFitAnalysis;
  jobTitle: string;
  companyName: string;
}

export function JobFitScore({
  analysis,
  jobTitle,
  companyName,
}: JobFitScoreProps) {
  const {
    overallScore,
    strengths,
    gaps,
    recommendations,
    keyInsights,
    fitLevel,
  } = analysis;

  // Determine color scheme based on fit level
  const getColorClasses = () => {
    switch (fitLevel) {
      case "excellent":
        return {
          bg: "bg-green-50 dark:bg-green-900/20",
          border: "border-green-200 dark:border-green-800",
          text: "text-green-700 dark:text-green-300",
          gradient: "from-green-600 to-emerald-600",
          icon: "🟢",
        };
      case "good":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-800",
          text: "text-blue-700 dark:text-blue-300",
          gradient: "from-blue-600 to-cyan-600",
          icon: "🔵",
        };
      case "moderate":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          border: "border-yellow-200 dark:border-yellow-800",
          text: "text-yellow-700 dark:text-yellow-300",
          gradient: "from-yellow-600 to-orange-600",
          icon: "🟡",
        };
      default: // poor
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800",
          text: "text-red-700 dark:text-red-300",
          gradient: "from-red-600 to-pink-600",
          icon: "🔴",
        };
    }
  };

  const colors = getColorClasses();

  const ProgressBar = ({ value, label }: { value: number; label: string }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium text-gray-900 dark:text-white">
          {value}%
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${colors.gradient}`}
        />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`${cards.base} ${colors.bg} ${colors.border} ${spacing.component}`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.gradient}`}>
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className={`${typography.h4} mb-1 text-gray-900 dark:text-white`}>
            Job Fit Analysis {colors.icon}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {jobTitle} at {companyName}
          </p>
        </div>
      </div>

      {/* Overall Score */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <div className="flex items-baseline gap-1">
            <span
              className={`text-4xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}
            >
              {overallScore}
            </span>
            <span className="text-xl text-gray-500 dark:text-gray-400">%</span>
          </div>
          <span className={`${typography.h5} ${colors.text} capitalize`}>
            {fitLevel} Fit
          </span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {keyInsights}
        </p>
      </div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h4 className={`${typography.h5} text-gray-900 dark:text-white`}>
              Strong Matches
            </h4>
          </div>
          <ul className="space-y-2">
            {strengths.map((strength: string, idx: number) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <span className="text-green-600 dark:text-green-400 mt-0.5">
                  •
                </span>
                <div className="prose prose-sm dark:prose-invert max-w-none prose-a:text-green-600 dark:prose-a:text-green-400 prose-a:underline">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {strength}
                  </ReactMarkdown>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gaps */}
      {gaps.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <h4 className={`${typography.h5} text-gray-900 dark:text-white`}>
              Areas to Address
            </h4>
          </div>
          <ul className="space-y-2">
            {gaps.map((gap: string, idx: number) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">
                  •
                </span>
                <div className="prose prose-sm dark:prose-invert max-w-none prose-a:text-yellow-600 dark:prose-a:text-yellow-400 prose-a:underline">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {gap}
                  </ReactMarkdown>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h4 className={`${typography.h5} text-gray-900 dark:text-white`}>
              Recommendations
            </h4>
          </div>
          <ul className="space-y-2">
            {recommendations.map((rec: string, idx: number) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <span className="text-purple-600 dark:text-purple-400 mt-0.5">
                  •
                </span>
                <div className="prose prose-sm dark:prose-invert max-w-none prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-a:underline">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {rec}
                  </ReactMarkdown>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
