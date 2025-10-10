"use client";

import { SectionHeading } from "../ui/section-heading";
import { GlassCard } from "../ui/glass-card";
import { Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";
import { resumeData } from "@/data/resume";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="py-20 px-6 bg-gradient-to-b from-transparent via-purple-50/30 to-transparent dark:via-purple-950/10"
    >
      <div className="container mx-auto max-w-4xl">
        <SectionHeading
          title="Get In Touch"
          subtitle="Let's work together on something amazing"
          centered
        />

        <div className="mt-16 grid md:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Contact Information
            </h3>
            <div className="space-y-4">
              <a
                href={`mailto:${resumeData.email}`}
                className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-md p-1"
                aria-label={`Email Renato at ${resumeData.email}`}
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail
                    className="w-5 h-5 text-purple-600 dark:text-purple-400"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="font-medium">{resumeData.email}</p>
                </div>
              </a>

              <a
                href={`tel:${resumeData.phone}`}
                className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
                aria-label={`Call Renato at ${resumeData.phone}`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Phone
                  </p>
                  <p className="font-medium">{resumeData.phone}</p>
                </div>
              </a>

              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Location
                  </p>
                  <p className="font-medium">{resumeData.location}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Connect With Me
            </h3>
            <div className="space-y-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-md p-1"
                aria-label="Visit GitHub profile"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Github className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    GitHub
                  </p>
                  <p className="font-medium">View my repositories</p>
                </div>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
                aria-label="Visit LinkedIn profile"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Linkedin
                    className="w-5 h-5 text-blue-600"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    LinkedIn
                  </p>
                  <p className="font-medium">
                    Let&apos;s connect professionally
                  </p>
                </div>
              </a>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Open to new opportunities and collaborations. Feel free to
                  reach out!
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
