"use client";

import { Info, Sparkles } from "lucide-react";
import { cards, typography, spacing } from "@/lib/styles";

interface CreditsInfoCardProps {
  remainingCredits: number;
  tokensUsed: number;
}

/**
 * Credits Info Card
 *
 * Displays user's credit balance with beta notice
 */
export function CreditsInfoCard({
  remainingCredits,
  tokensUsed,
}: CreditsInfoCardProps) {
  const totalCredits = 500; // Beta starting credits
  const percentUsed = (tokensUsed / totalCredits) * 100;

  return (
    <div
      className={`${cards.base} bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-800`}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`${typography.h3} text-gray-900 dark:text-white mb-2`}>
            Beta Credits
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {remainingCredits}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  / {totalCredits} credits
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${100 - percentUsed}%` }}
                />
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <Info className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Beta Offer:</span> You started
                with 500 free credits! While Upfolio is in development, explore
                all features at no cost.
              </p>
            </div>

            <div className={`${spacing.tight}`}>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">Credit costs:</span>
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4 mt-1">
                <li>• Job Fit Analysis: 2 credits</li>
                <li>• Tailored Cover Letter: 10 credits</li>
                <li>• Optimized Resume: 20 credits</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
