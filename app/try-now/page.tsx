import { Metadata } from "next";
import { TryNowContent } from "@/components/try-now-content";
import { layouts, spacing } from "@/lib/styles";

export const metadata: Metadata = {
  title: "Try It Now | Upfolio - Create Your Portfolio in Seconds",
  description:
    "Upload your resume and see your AI-powered portfolio instantly. No sign-up required. Create an account only when you're ready to publish.",
  openGraph: {
    title: "Try It Now | Upfolio",
    description:
      "Upload your resume and see your AI-powered portfolio instantly. No sign-up required.",
  },
};

/**
 * Try It Now standalone page
 * Allows users to test the resume upload and preview functionality
 * without navigating away from a dedicated page
 */
export default function TryNowPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <section className={layouts.section}>
        <div className={layouts.centered}>
          <TryNowContent />
        </div>
      </section>

      {/* Additional info section */}
      <section className={`${spacing.section} pb-16 sm:pb-20`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-purple-200/20 dark:border-purple-700/20">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h3>
            <ol className="space-y-4 text-gray-700 dark:text-gray-300">
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold">
                  1
                </span>
                <div>
                  <strong className="text-gray-900 dark:text-white">
                    Upload Your Resume
                  </strong>
                  <p className="text-sm mt-1">
                    Drag and drop your PDF resume or click to select a file.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-bold">
                  2
                </span>
                <div>
                  <strong className="text-gray-900 dark:text-white">
                    AI Processing
                  </strong>
                  <p className="text-sm mt-1">
                    Our AI extracts your information and enhances your profile
                    with professional taglines and highlights.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white text-sm font-bold">
                  3
                </span>
                <div>
                  <strong className="text-gray-900 dark:text-white">
                    Preview Your Portfolio
                  </strong>
                  <p className="text-sm mt-1">
                    See your beautiful portfolio instantly. Sign up when
                    you&apos;re ready to publish and share your unique URL.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>
    </main>
  );
}
