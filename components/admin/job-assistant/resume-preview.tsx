"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

interface ResumePreviewProps {
  content: string;
  type: "resume" | "cover-letter";
  jobTitle?: string;
  companyName?: string;
}

export function ResumePreview({
  content,
  type,
  jobTitle,
  companyName,
}: ResumePreviewProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
      {/* A4 Paper Effect */}
      <div className="max-w-[8.5in] mx-auto bg-white dark:bg-gray-900">
        {/* Header for context */}
        {type === "cover-letter" && jobTitle && companyName && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 px-8 sm:px-12 py-4 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">
                Application:
              </span>{" "}
              {jobTitle} at {companyName}
            </p>
          </div>
        )}

        {/* Content Area - Professional Resume Styling */}
        <div className="p-8 sm:p-12 prose prose-sm sm:prose dark:prose-invert max-w-none">
          <style jsx global>{`
            /* Resume-specific styling */
            .resume-preview h1 {
              font-size: 2rem;
              font-weight: 700;
              color: #1f2937;
              margin-bottom: 0.5rem;
              border-bottom: 3px solid #7c3aed;
              padding-bottom: 0.5rem;
            }

            .dark .resume-preview h1 {
              color: #f9fafb;
              border-bottom-color: #a78bfa;
            }

            .resume-preview h2 {
              font-size: 1.25rem;
              font-weight: 600;
              color: #374151;
              margin-top: 1.5rem;
              margin-bottom: 0.75rem;
              padding-bottom: 0.25rem;
              border-bottom: 2px solid #e5e7eb;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }

            .dark .resume-preview h2 {
              color: #e5e7eb;
              border-bottom-color: #4b5563;
            }

            .resume-preview h3 {
              font-size: 1.1rem;
              font-weight: 600;
              color: #1f2937;
              margin-top: 1rem;
              margin-bottom: 0.25rem;
            }

            .dark .resume-preview h3 {
              color: #f3f4f6;
            }

            .resume-preview h4 {
              font-size: 0.95rem;
              font-weight: 500;
              color: #6b7280;
              margin-top: 0.5rem;
              margin-bottom: 0.25rem;
              font-style: italic;
            }

            .dark .resume-preview h4 {
              color: #9ca3af;
            }

            .resume-preview p {
              color: #374151;
              line-height: 1.6;
              margin-bottom: 0.75rem;
            }

            .dark .resume-preview p {
              color: #d1d5db;
            }

            .resume-preview ul {
              margin-top: 0.5rem;
              margin-bottom: 1rem;
              padding-left: 1.5rem;
            }

            .resume-preview li {
              color: #374151;
              line-height: 1.6;
              margin-bottom: 0.25rem;
            }

            .dark .resume-preview li {
              color: #d1d5db;
            }

            .resume-preview strong {
              color: #1f2937;
              font-weight: 600;
            }

            .dark .resume-preview strong {
              color: #f9fafb;
            }

            .resume-preview a {
              color: #7c3aed;
              text-decoration: none;
              border-bottom: 1px solid transparent;
              transition: border-color 0.2s;
            }

            .resume-preview a:hover {
              border-bottom-color: #7c3aed;
            }

            .dark .resume-preview a {
              color: #a78bfa;
            }

            .dark .resume-preview a:hover {
              border-bottom-color: #a78bfa;
            }

            /* Contact info styling */
            .resume-preview p:has(a[href^="mailto:"]),
            .resume-preview p:has(a[href^="tel:"]) {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              font-size: 0.9rem;
            }

            /* Skills section */
            .resume-preview ul li {
              position: relative;
              padding-left: 0.25rem;
            }

            .resume-preview ul li::marker {
              color: #7c3aed;
            }

            .dark .resume-preview ul li::marker {
              color: #a78bfa;
            }

            /* Cover letter specific */
            .resume-preview.cover-letter p {
              text-align: justify;
              margin-bottom: 1rem;
            }

            .resume-preview.cover-letter h1 {
              border-bottom: none;
              margin-bottom: 1rem;
            }

            /* Print styles */
            @media print {
              .resume-preview {
                background: white !important;
                color: black !important;
              }

              .resume-preview h1,
              .resume-preview h2,
              .resume-preview h3,
              .resume-preview p,
              .resume-preview li {
                color: black !important;
              }

              .resume-preview a {
                color: #7c3aed !important;
              }
            }
          `}</style>

          <div
            className={`resume-preview ${
              type === "cover-letter" ? "cover-letter" : ""
            }`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                // Custom rendering for links with icons
                a: ({ node, href, children, ...props }) => {
                  const isEmail = href?.startsWith("mailto:");
                  const isPhone = href?.startsWith("tel:");
                  const isLinkedIn = href?.includes("linkedin.com");
                  const isGithub = href?.includes("github.com");

                  return (
                    <a
                      href={href}
                      {...props}
                      className="inline-flex items-center gap-1"
                    >
                      {isEmail && <Mail className="w-3 h-3" />}
                      {isPhone && <Phone className="w-3 h-3" />}
                      {isLinkedIn && <Linkedin className="w-3 h-3" />}
                      {isGithub && <Github className="w-3 h-3" />}
                      {!isEmail &&
                        !isPhone &&
                        !isLinkedIn &&
                        !isGithub &&
                        href?.startsWith("http") && (
                          <Globe className="w-3 h-3" />
                        )}
                      {children}
                    </a>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
