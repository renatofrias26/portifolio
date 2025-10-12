import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-8"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Last Updated: October 12, 2025
          </p>

          <div className="prose prose-purple dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                By accessing and using Upfolio (&quot;the Service&quot;), you
                accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to these Terms of Service, please
                do not use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                2. Description of Service
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Upfolio provides a platform that allows users to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>Create digital portfolios from uploaded resumes</li>
                <li>
                  Utilize AI-powered chat features to interact with recruiters
                </li>
                <li>Customize and share their professional portfolios</li>
                <li>Connect with potential employers and job opportunities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                3. User Accounts
              </h2>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                3.1 Registration
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                To use certain features of the Service, you must register for an
                account. You agree to provide accurate, current, and complete
                information during registration and to update such information
                to keep it accurate, current, and complete.
              </p>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                3.2 Account Security
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You are responsible for safeguarding your password and for all
                activities that occur under your account. You agree to notify us
                immediately of any unauthorized use of your account.
              </p>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                3.3 Account Termination
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We reserve the right to suspend or terminate your account at any
                time for violations of these Terms or for any other reason we
                deem appropriate.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                4. User Content
              </h2>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                4.1 Your Content
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You retain all rights to the content you upload, including
                resumes, images, and personal information. By uploading content,
                you grant Upfolio a non-exclusive, worldwide, royalty-free
                license to use, display, and process your content solely for the
                purpose of providing the Service.
              </p>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                4.2 Content Responsibility
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You are solely responsible for the content you upload. You agree
                not to upload content that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>Is false, misleading, or fraudulent</li>
                <li>
                  Infringes any third party&apos;s intellectual property rights
                </li>
                <li>Contains viruses or malicious code</li>
                <li>
                  Is unlawful, harmful, threatening, abusive, harassing, or
                  objectionable
                </li>
                <li>Violates any applicable laws or regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                5. AI-Powered Features
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Our AI chat feature uses your uploaded resume and profile
                information to answer questions from recruiters. By using this
                feature:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>
                  You acknowledge that AI responses are generated automatically
                  and may not always be perfect
                </li>
                <li>
                  You understand that you can review and modify AI-generated
                  responses
                </li>
                <li>
                  You agree that Upfolio is not responsible for the accuracy of
                  AI-generated content
                </li>
                <li>
                  You can disable the AI chat feature at any time from your
                  account settings
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                6. Privacy and Data Protection
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Your privacy is important to us. Please review our{" "}
                <Link
                  href="/legal/privacy"
                  className="text-purple-600 hover:text-purple-700 underline"
                >
                  Privacy Policy
                </Link>{" "}
                to understand how we collect, use, and protect your personal
                information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                7. Prohibited Activities
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>Use the Service for any illegal purpose</li>
                <li>
                  Attempt to gain unauthorized access to the Service or other
                  users&apos; accounts
                </li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>
                  Use automated systems (bots, scrapers) without permission
                </li>
                <li>Impersonate another person or entity</li>
                <li>Harass, abuse, or harm other users</li>
                <li>
                  Collect or store personal data about other users without
                  consent
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                8. Intellectual Property
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                The Service, including its design, features, graphics, and
                software, is owned by Upfolio and is protected by copyright,
                trademark, and other intellectual property laws. You may not
                copy, modify, distribute, or reverse engineer any part of the
                Service without our written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                9. Disclaimer of Warranties
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF
                ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE
                SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE. WE DO NOT
                GUARANTEE ANY EMPLOYMENT OUTCOMES FROM USING THE SERVICE.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                10. Limitation of Liability
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, UPFOLIO SHALL NOT BE
                LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER
                INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE,
                GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                11. Indemnification
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You agree to indemnify and hold harmless Upfolio from any
                claims, damages, losses, liabilities, and expenses (including
                legal fees) arising from your use of the Service or violation of
                these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                12. Modifications to Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We reserve the right to modify these Terms at any time. We will
                notify users of material changes via email or through the
                Service. Your continued use of the Service after such
                modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                13. Termination
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You may terminate your account at any time through your account
                settings. Upon termination, your right to use the Service will
                immediately cease. We may retain certain information as required
                by law or for legitimate business purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                14. Governing Law
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance
                with the laws of the jurisdiction in which Upfolio operates,
                without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                15. Contact Information
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us
                at:
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Email: legal@upfolio.com
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                By using Upfolio, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
