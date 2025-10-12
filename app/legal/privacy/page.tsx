import Link from "next/link";

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Last Updated: October 12, 2025
          </p>

          <div className="prose prose-purple dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                At Upfolio, we take your privacy seriously. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your
                information when you use our service. Please read this privacy
                policy carefully.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                2. Information We Collect
              </h2>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                2.1 Information You Provide
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We collect information that you voluntarily provide when using
                our Service:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>
                  <strong>Account Information:</strong> Name, email address,
                  username, password
                </li>
                <li>
                  <strong>Resume Data:</strong> Professional experience,
                  education, skills, projects
                </li>
                <li>
                  <strong>Profile Information:</strong> Profile pictures, bio,
                  social links, hobbies
                </li>
                <li>
                  <strong>Contact Information:</strong> Phone number, location,
                  preferred communication methods
                </li>
                <li>
                  <strong>Custom Metadata:</strong> Additional information you
                  choose to add to your profile
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                2.2 Automatically Collected Information
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We automatically collect certain information when you use our
                Service:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>
                  <strong>Usage Data:</strong> Pages visited, features used,
                  time spent on the Service
                </li>
                <li>
                  <strong>Device Information:</strong> IP address, browser type,
                  operating system
                </li>
                <li>
                  <strong>Analytics Data:</strong> Portfolio views, AI chat
                  interactions, engagement metrics
                </li>
                <li>
                  <strong>Cookies:</strong> Session cookies for authentication
                  and preferences
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>
                  <strong>Service Delivery:</strong> Create and maintain your
                  digital portfolio
                </li>
                <li>
                  <strong>AI Features:</strong> Power the AI chat to answer
                  recruiter questions
                </li>
                <li>
                  <strong>Personalization:</strong> Customize your portfolio and
                  user experience
                </li>
                <li>
                  <strong>Communication:</strong> Send important updates,
                  notifications, and support
                </li>
                <li>
                  <strong>Analytics:</strong> Understand how users interact with
                  the Service to improve it
                </li>
                <li>
                  <strong>Security:</strong> Detect and prevent fraud, abuse,
                  and security incidents
                </li>
                <li>
                  <strong>Legal Compliance:</strong> Comply with legal
                  obligations and protect rights
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                4. Information Sharing
              </h2>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                4.1 Public Information
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                When you publish your portfolio, the following information
                becomes publicly accessible:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>Your name, title, and professional summary</li>
                <li>Work experience and education</li>
                <li>Skills and projects</li>
                <li>Profile picture and any custom images</li>
                <li>Information available through the AI chat feature</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                4.2 Third-Party Service Providers
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We may share your information with trusted third-party service
                providers who assist us in:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>
                  AI and machine learning services (OpenAI for resume parsing
                  and chat)
                </li>
                <li>Cloud hosting and storage</li>
                <li>Analytics and monitoring</li>
                <li>Email communications</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                These providers are contractually obligated to protect your data
                and use it only for specified purposes.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                4.3 We Will Never
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>
                  <strong>Sell your data</strong> to third parties
                </li>
                <li>
                  <strong>Share your email or phone number</strong> without your
                  explicit consent
                </li>
                <li>
                  <strong>Use your data</strong> for purposes other than
                  providing the Service
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                5. Data Security
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your
                data:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>
                  <strong>Encryption:</strong> Data is encrypted in transit
                  (HTTPS/TLS) and at rest
                </li>
                <li>
                  <strong>Authentication:</strong> Secure password hashing and
                  session management
                </li>
                <li>
                  <strong>Access Controls:</strong> Limited employee access to
                  personal data
                </li>
                <li>
                  <strong>Regular Audits:</strong> Security reviews and
                  vulnerability assessments
                </li>
                <li>
                  <strong>Infrastructure:</strong> Secure, reliable cloud
                  infrastructure
                </li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                However, no method of transmission over the internet is 100%
                secure. While we strive to protect your data, we cannot
                guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                6. Your Privacy Rights
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>
                  <strong>Access:</strong> Request a copy of your personal data
                </li>
                <li>
                  <strong>Correction:</strong> Update or correct inaccurate
                  information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your account
                  and data
                </li>
                <li>
                  <strong>Portability:</strong> Export your data in a
                  machine-readable format
                </li>
                <li>
                  <strong>Visibility Control:</strong> Make your portfolio
                  private or public
                </li>
                <li>
                  <strong>Opt-Out:</strong> Unsubscribe from marketing
                  communications
                </li>
                <li>
                  <strong>AI Chat Control:</strong> Disable the AI chat feature
                </li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                To exercise these rights, please contact us at
                privacy@upfolio.com or use the settings in your account
                dashboard.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                7. Data Retention
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We retain your personal information for as long as necessary to
                provide the Service and fulfill the purposes outlined in this
                policy. When you delete your account:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>Your portfolio will be immediately unpublished</li>
                <li>Personal data will be deleted within 30 days</li>
                <li>
                  Some data may be retained for legal or security purposes as
                  required by law
                </li>
                <li>Anonymized analytics data may be retained indefinitely</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                8. Cookies and Tracking
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>
                  <strong>Essential Cookies:</strong> Required for
                  authentication and security
                </li>
                <li>
                  <strong>Functional Cookies:</strong> Remember your preferences
                  and settings
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Understand how you use the
                  Service
                </li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You can control cookies through your browser settings, but
                disabling certain cookies may affect functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                9. Children&apos;s Privacy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Our Service is not directed to individuals under 16 years of
                age. We do not knowingly collect personal information from
                children. If you believe we have collected information from a
                child, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                10. International Data Transfers
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Your information may be transferred to and processed in
                countries other than your own. We ensure appropriate safeguards
                are in place to protect your data in accordance with this
                Privacy Policy and applicable laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                11. GDPR Compliance (European Users)
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If you are located in the European Economic Area (EEA), you have
                additional rights under GDPR:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>Right to object to processing</li>
                <li>Right to restrict processing</li>
                <li>Right to lodge a complaint with supervisory authorities</li>
                <li>Right to withdraw consent at any time</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Our legal basis for processing your data includes: consent,
                contract performance, legal obligations, and legitimate
                interests.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                12. Changes to This Policy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. We will
                notify you of material changes via email or through the Service.
                Your continued use after such changes constitutes acceptance of
                the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                13. Contact Us
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If you have questions about this Privacy Policy or our data
                practices, please contact us:
              </p>
              <ul className="list-none text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>
                  <strong>Email:</strong> privacy@upfolio.com
                </li>
                <li>
                  <strong>Data Protection Officer:</strong> dpo@upfolio.com
                </li>
              </ul>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                By using Upfolio, you acknowledge that you have read and
                understood this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
