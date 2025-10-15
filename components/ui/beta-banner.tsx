"use client";

import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Beta Banner Component
 *
 * Displays a dismissible banner informing users that Upfolio is in beta
 * with 500 free credits. Persists dismissal state in localStorage.
 */
export function BetaBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem("beta-banner-dismissed");
    setIsVisible(!dismissed);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("beta-banner-dismissed", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Sparkles className="w-5 h-5 flex-shrink-0 animate-pulse" />
                <p className="text-sm sm:text-base font-medium">
                  <span className="font-bold">Beta Access:</span> Upfolio is in
                  active development. Enjoy{" "}
                  <span className="font-bold bg-white/20 px-2 py-0.5 rounded">
                    500 free credits
                  </span>{" "}
                  to explore all features while we build something amazing! 🚀
                </p>
              </div>
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Dismiss banner"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
