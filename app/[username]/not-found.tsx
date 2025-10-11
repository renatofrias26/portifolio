import Link from "next/link";
import { GradientText } from "@/components/ui/gradient-text";
import { GlassCard } from "@/components/ui/glass-card";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center p-4">
      <GlassCard className="max-w-md w-full text-center p-8">
        <h1 className="text-6xl font-bold mb-4">
          <GradientText>404</GradientText>
        </h1>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          User Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The portfolio you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Go Home
        </Link>
      </GlassCard>
    </div>
  );
}
