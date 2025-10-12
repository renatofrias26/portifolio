import Image from "next/image";
import Link from "next/link";
import { LandingHeader } from "@/components/landing-header";
import { TryNowSection } from "@/components/try-now-section";
import {
  hero,
  logoSizes,
  typography,
  buttons,
  layouts,
  cards,
  containerPadding,
} from "@/lib/styles";

/**
 * Main Landing Page
 *
 * Shows the Upfolio landing page with brand identity
 */
export default async function Home() {
  // Show the landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      {/* Header with Login/Dashboard */}
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 dark:from-purple-600/20 dark:via-blue-600/20 dark:to-cyan-600/20" />
        <div className={`relative ${layouts.centered} ${hero.container}`}>
          <div className="text-center">
            {/* Logo */}
            <div className="mb-6 sm:mb-8 flex justify-center animate-fade-in">
              <Image
                src="/logo-full.svg"
                alt="Upfolio"
                width={logoSizes.hero.imageWidth}
                height={logoSizes.hero.imageHeight}
                className={`dark:hidden ${logoSizes.hero.width}`}
                priority
              />
              <Image
                src="/logo-full-dark.svg"
                alt="Upfolio"
                width={logoSizes.hero.imageWidth}
                height={logoSizes.hero.imageHeight}
                className={`hidden dark:block ${logoSizes.hero.width}`}
                priority
              />
            </div>

            {/* Hero Headline */}
            <h1
              className={`${hero.title} mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent animate-fade-in`}
            >
              Your Resume, Reimagined
            </h1>

            <p
              className={`${hero.subtitle} text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto font-medium`}
            >
              Transform your resume into an{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold">
                AI-powered digital portfolio
              </span>{" "}
              that works for you 24/7
            </p>

            <p
              className={`${hero.description} text-gray-600 dark:text-gray-400 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto`}
            >
              Stand out from the crowd. Let AI tell your story. Connect with the
              right opportunities.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-3 sm:gap-4 justify-center flex-wrap mb-10 sm:mb-12 md:mb-16">
              <Link
                href="#try-now"
                className={`group ${buttons.large} bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg relative overflow-hidden`}
              >
                <span className="relative z-10">Try It Free – No Sign Up</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link href="/profiles" className={buttons.secondary}>
                Browse Portfolios
              </Link>
              <Link href="#how-it-works" className={buttons.secondary}>
                See How It Works
              </Link>
            </div>

            {/* Social Proof */}
            <div
              className={`flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 ${typography.bodySmall} text-gray-600 dark:text-gray-400`}
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Setup in 5 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Your data, your control</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - For Job Seekers */}
      <section
        id="how-it-works"
        className={`${layouts.section} bg-white dark:bg-gray-800/50`}
      >
        <div className={layouts.centered}>
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2
              className={`${typography.h2} mb-3 sm:mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent`}
            >
              Stand Out with AI-Powered Portfolios
            </h2>
            <p
              className={`${typography.bodyLarge} text-gray-600 dark:text-gray-400 max-w-3xl mx-auto`}
            >
              Your unique story deserves to be told. We&apos;re here to help you
              tell it.
            </p>
          </div>

          <div className={layouts.grid3}>
            {/* Feature 1: AI Chat */}
            <div
              className={`${cards.feature} bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800`}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3
                className={`${typography.h4} mb-3 sm:mb-4 text-gray-900 dark:text-white`}
              >
                24/7 AI Assistant
              </h3>
              <p
                className={`${typography.body} text-gray-600 dark:text-gray-400 leading-relaxed`}
              >
                Let AI tell your story. Answer recruiter questions instantly,
                anytime, with our intelligent chat that knows your resume inside
                and out.
              </p>
            </div>

            {/* Feature 2: Customization */}
            <div
              className={`${cards.feature} bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800`}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <h3
                className={`${typography.h4} mb-3 sm:mb-4 text-gray-900 dark:text-white`}
              >
                Your Portfolio, Your Way
              </h3>
              <p
                className={`${typography.body} text-gray-600 dark:text-gray-400 leading-relaxed`}
              >
                Customize every detail to reflect your unique personality. Add
                hobbies, projects, and achievements beyond your resume.
              </p>
            </div>

            {/* Feature 3: Easy Sharing */}
            <div
              className={`${cards.feature} bg-gradient-to-br from-cyan-50 to-purple-50 dark:from-cyan-900/20 dark:to-purple-900/20 border border-cyan-200 dark:border-cyan-800`}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <h3
                className={`${typography.h4} mb-3 sm:mb-4 text-gray-900 dark:text-white`}
              >
                Share Instantly
              </h3>
              <p
                className={`${typography.body} text-gray-600 dark:text-gray-400 leading-relaxed`}
              >
                One beautiful link that works everywhere. Mobile-friendly,
                always accessible, and way better than a PDF resume.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Recruiters Section */}
      <section
        className={`${layouts.section} bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900/30`}
      >
        <div className={layouts.centered}>
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2
              className={`${typography.h2} mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}
            >
              Built for Recruiters Too
            </h2>
            <p
              className={`${typography.bodyLarge} text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-4 sm:mb-6`}
            >
              Find the right talent faster with intelligent candidate portfolios
            </p>
            <Link
              href="/profiles"
              className={`inline-flex items-center gap-2 ${buttons.large} bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300`}
            >
              Browse All Profiles
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          <div className={`${layouts.grid2} max-w-5xl mx-auto`}>
            {/* Recruiter Feature 1 */}
            <div
              className={`${containerPadding.card} rounded-2xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3
                    className={`${typography.h5} mb-2 text-gray-900 dark:text-white`}
                  >
                    Job Fit Analysis
                  </h3>
                  <p
                    className={`${typography.body} text-gray-600 dark:text-gray-400`}
                  >
                    Send a job link and let AI determine if the candidate is a
                    perfect match. Save time with smarter screening.
                  </p>
                </div>
              </div>
            </div>

            {/* Recruiter Feature 2 */}
            <div
              className={`${containerPadding.card} rounded-2xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3
                    className={`${typography.h5} mb-2 text-gray-900 dark:text-white`}
                  >
                    Always Available
                  </h3>
                  <p
                    className={`${typography.body} text-gray-600 dark:text-gray-400`}
                  >
                    Chat with candidates 24/7 through their AI assistant. Get
                    answers to your questions instantly, no waiting required.
                  </p>
                </div>
              </div>
            </div>

            {/* Recruiter Feature 3 */}
            <div
              className={`${containerPadding.card} rounded-2xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
                </div>
                <div>
                  <h3
                    className={`${typography.h5} mb-2 text-gray-900 dark:text-white`}
                  >
                    Better Insights
                  </h3>
                  <p
                    className={`${typography.body} text-gray-600 dark:text-gray-400`}
                  >
                    Go beyond the resume. Discover candidates&apos;
                    personalities, hobbies, and cultural fit through their
                    enriched profiles.
                  </p>
                </div>
              </div>
            </div>

            {/* Recruiter Feature 4 */}
            <div
              className={`${containerPadding.card} rounded-2xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3
                    className={`${typography.h5} mb-2 text-gray-900 dark:text-white`}
                  >
                    Quality Over Quantity
                  </h3>
                  <p
                    className={`${typography.body} text-gray-600 dark:text-gray-400`}
                  >
                    Connect with motivated talent who invested time in creating
                    standout portfolios. Find candidates who care.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Simple Steps */}
      <section className={`${layouts.section} bg-white dark:bg-gray-800/50`}>
        <div className={layouts.centered}>
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2
              className={`${typography.h2} mb-3 sm:mb-4 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent`}
            >
              From Resume to Remarkable in 3 Steps
            </h2>
          </div>

          <div
            className={`${layouts.grid3} gap-8 sm:gap-10 md:gap-12 max-w-5xl mx-auto`}
          >
            <div className="text-center">
              <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold mb-4 sm:mb-5 md:mb-6 mx-auto shadow-lg">
                1
              </div>
              <h3
                className={`${typography.h4} mb-3 sm:mb-4 text-gray-900 dark:text-white`}
              >
                Upload
              </h3>
              <p
                className={`${typography.body} text-gray-600 dark:text-gray-400`}
              >
                Drop your resume and let our AI parse it instantly. No
                formatting headaches.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold mb-4 sm:mb-5 md:mb-6 mx-auto shadow-lg">
                2
              </div>
              <h3
                className={`${typography.h4} mb-3 sm:mb-4 text-gray-900 dark:text-white`}
              >
                Customize
              </h3>
              <p
                className={`${typography.body} text-gray-600 dark:text-gray-400`}
              >
                Add your personality, tweak colors, upload photos. Make it
                uniquely yours.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold mb-4 sm:mb-5 md:mb-6 mx-auto shadow-lg">
                3
              </div>
              <h3
                className={`${typography.h4} mb-3 sm:mb-4 text-gray-900 dark:text-white`}
              >
                Share
              </h3>
              <p
                className={`${typography.body} text-gray-600 dark:text-gray-400`}
              >
                Get your unique link and start sharing. Your AI-powered
                portfolio is ready!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Try It Now - Guest Upload Section */}
      <section
        id="try-now"
        className={`${layouts.section} bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900`}
      >
        <div className={layouts.centered}>
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2
              className={`${typography.h2} mb-3 sm:mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent`}
            >
              Try It Now – No Sign Up Required
            </h2>
            <p
              className={`${typography.bodyLarge} text-gray-600 dark:text-gray-400 max-w-3xl mx-auto`}
            >
              Upload your resume and see your AI-powered portfolio in seconds.
              Create an account only when you&apos;re ready to publish.
            </p>
          </div>

          <TryNowSection />
        </div>
      </section>

      {/* Trust & Privacy */}
      <section
        className={`${layouts.section} bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2
              className={`${typography.h2} md:text-4xl mb-3 sm:mb-4 text-gray-900 dark:text-white`}
            >
              Your Data. Your Control. Your Privacy.
            </h2>
            <p
              className={`${typography.bodyLarge} text-gray-600 dark:text-gray-400`}
            >
              We take your trust seriously. Here&apos;s our promise to you.
            </p>
          </div>

          <div className={`${layouts.grid2} gap-4 sm:gap-5 md:gap-6`}>
            <div
              className={`flex items-start gap-3 sm:gap-4 ${containerPadding.cardSmall} rounded-xl bg-white dark:bg-gray-800 shadow-md`}
            >
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <div>
                <h3
                  className={`${typography.h5} mb-1 sm:mb-2 text-gray-900 dark:text-white`}
                >
                  Bank-Level Security
                </h3>
                <p
                  className={`${typography.bodySmall} text-gray-600 dark:text-gray-400`}
                >
                  Industry-standard encryption keeps your data safe and secure.
                </p>
              </div>
            </div>

            <div
              className={`flex items-start gap-3 sm:gap-4 ${containerPadding.cardSmall} rounded-xl bg-white dark:bg-gray-800 shadow-md`}
            >
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <div>
                <h3
                  className={`${typography.h5} mb-1 sm:mb-2 text-gray-900 dark:text-white`}
                >
                  You&apos;re In Control
                </h3>
                <p
                  className={`${typography.bodySmall} text-gray-600 dark:text-gray-400`}
                >
                  Choose what to share, who can view it, and update anytime.
                </p>
              </div>
            </div>

            <div
              className={`flex items-start gap-3 sm:gap-4 ${containerPadding.cardSmall} rounded-xl bg-white dark:bg-gray-800 shadow-md`}
            >
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3
                  className={`${typography.h5} mb-1 sm:mb-2 text-gray-900 dark:text-white`}
                >
                  Crystal Clear Privacy
                </h3>
                <p
                  className={`${typography.bodySmall} text-gray-600 dark:text-gray-400`}
                >
                  No selling your data. Ever. Plain and simple.
                </p>
              </div>
            </div>

            <div
              className={`flex items-start gap-3 sm:gap-4 ${containerPadding.cardSmall} rounded-xl bg-white dark:bg-gray-800 shadow-md`}
            >
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3
                  className={`${typography.h5} mb-1 sm:mb-2 text-gray-900 dark:text-white`}
                >
                  GDPR Compliant
                </h3>
                <p
                  className={`${typography.bodySmall} text-gray-600 dark:text-gray-400`}
                >
                  We follow international privacy standards to protect your
                  rights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className={`${typography.h2} md:text-5xl text-white mb-4 sm:mb-5 md:mb-6`}
          >
            Ready to Stand Out?
          </h2>
          <p
            className={`${typography.bodyLarge} md:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10`}
          >
            Join thousands of job seekers who are getting noticed with
            AI-powered portfolios
          </p>
          <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
            <Link
              href="/admin/register"
              className={`group ${buttons.large} bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-2xl`}
            >
              Create Your Free Portfolio
              <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
            <Link
              href="/admin/login"
              className={`${buttons.large} bg-transparent text-white border-2 border-white rounded-xl font-bold hover:bg-white/10 transition-all duration-300`}
            >
              Sign In
            </Link>
          </div>
          <p className={`mt-6 sm:mt-8 ${typography.body} text-white/80`}>
            No credit card required • Setup in 5 minutes • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}

export const revalidate = 60; // Revalidate every 60 seconds
