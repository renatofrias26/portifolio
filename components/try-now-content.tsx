"use client";

import { GuestResumeUploader } from "@/components/guest-resume-uploader";
import { typography } from "@/lib/styles";

interface TryNowContentProps {
  /**
   * Whether to show the heading and description
   * @default true
   */
  showHeading?: boolean;
  /**
   * Custom heading text
   */
  headingText?: string;
  /**
   * Custom description text
   */
  descriptionText?: string;
  /**
   * Additional CSS classes for the container
   */
  className?: string;
}

/**
 * Try It Now content component - can be used as a section or standalone page
 * Displays the guest resume uploader with optional heading and description
 */
export function TryNowContent({
  showHeading = true,
  headingText = "Try It Now – No Sign Up Required",
  descriptionText = "Upload your resume and see your AI-powered portfolio in seconds. Create an account only when you're ready to publish.",
  className = "",
}: TryNowContentProps) {
  return (
    <div className={className}>
      {showHeading && (
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2
            className={`${typography.h2} mb-3 sm:mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent`}
          >
            {headingText}
          </h2>
          <p
            className={`${typography.bodyLarge} text-gray-600 dark:text-gray-400 max-w-3xl mx-auto`}
          >
            {descriptionText}
          </p>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <GuestResumeUploader />
      </div>
    </div>
  );
}
