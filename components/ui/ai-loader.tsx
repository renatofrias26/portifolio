"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, Zap, Target } from "lucide-react";

interface AILoaderProps {
  /** Type of AI operation being performed */
  type?: "resume" | "cover-letter" | "job-fit" | "general";
  /** Custom messages to display (optional) */
  customMessages?: string[];
  /** Show the loader */
  isLoading: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * AI Loader Component
 *
 * Displays an animated loader with rotating messages to keep users engaged
 * during AI processing operations (especially useful for slower o1-mini model)
 *
 * @example
 * ```tsx
 * <AILoader
 *   isLoading={isGenerating}
 *   type="resume"
 * />
 * ```
 */
export function AILoader({
  type = "general",
  customMessages,
  isLoading,
  className = "",
}: AILoaderProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  // Default message sets for different operations
  const messagesByType = {
    resume: [
      "Analyzing job requirements...",
      "Matching your experience to role needs...",
      "Optimizing for ATS systems...",
      "Crafting compelling bullet points...",
      "Highlighting your key achievements...",
      "Fine-tuning keyword placement...",
      "Structuring for maximum impact...",
      "Polishing the final touches...",
    ],
    "cover-letter": [
      "Understanding company culture...",
      "Identifying your unique value...",
      "Crafting your opening hook...",
      "Building persuasive arguments...",
      "Aligning with job requirements...",
      "Personalizing the narrative...",
      "Strengthening your call-to-action...",
      "Perfecting the tone...",
    ],
    "job-fit": [
      "Analyzing your background...",
      "Evaluating job requirements...",
      "Comparing skills and experience...",
      "Identifying your strengths...",
      "Spotting potential gaps...",
      "Calculating fit score...",
      "Generating recommendations...",
      "Finalizing analysis...",
    ],
    general: [
      "AI is thinking...",
      "Processing your request...",
      "Analyzing data patterns...",
      "Optimizing results...",
      "Almost there...",
      "Finalizing output...",
    ],
  };

  const messages = customMessages || messagesByType[type];

  // Rotate messages every 2.5 seconds
  useEffect(() => {
    if (!isLoading) {
      setMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isLoading, messages.length]);

  if (!isLoading) return null;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-6 ${className}`}
    >
      {/* Animated Icon */}
      <div className="relative">
        {/* Outer pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Inner spinning gradient */}
        <motion.div
          className="relative w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Icon container */}
          <motion.div
            className="absolute inset-2 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center"
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Rotating icon based on type */}
            <AnimatePresence mode="wait">
              <motion.div
                key={type}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                {type === "resume" && (
                  <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                )}
                {type === "cover-letter" && (
                  <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                )}
                {type === "job-fit" && (
                  <Zap className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                )}
                {type === "general" && (
                  <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Message */}
      <div className="text-center min-h-[60px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-base font-medium text-gray-700 dark:text-gray-300 px-4"
          >
            {messages[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Time estimate (optional) */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 3 }}
        className="text-xs text-gray-500 dark:text-gray-400"
      >
        This may take 30-60 seconds for best quality results
      </motion.p>
    </div>
  );
}

/**
 * Compact AI Loader (for inline use)
 */
export function AILoaderCompact({
  message = "Processing...",
  className = "",
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div
        className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {message}
      </span>
    </div>
  );
}
