"use client";

import { SectionHeading } from "../ui/section-heading";
import { GlassCard } from "../ui/glass-card";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Download,
  Github,
  Globe,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import { resumeData } from "@/data/resume";
import Image from "next/image";

interface ContactInfo {
  name?: string;
  email: string;
  phone: string;
  location: string;
}

interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  instagram?: string;
  youtube?: string;
}

interface ContactSectionProps {
  contact?: ContactInfo;
  socialLinks?: SocialLinks;
  profileImageUrl?: string;
  showHeading?: boolean;
  sectionId?: string;
}

export function ContactSection({
  contact = {
    name: resumeData.name,
    email: resumeData.email,
    phone: resumeData.phone,
    location: resumeData.location,
  },
  socialLinks,
  profileImageUrl,
  showHeading = true,
  sectionId = "contact",
}: ContactSectionProps) {
  return (
    <section
      id={sectionId}
      className="py-20 px-6 bg-gradient-to-b from-transparent via-purple-50/30 to-transparent dark:via-purple-950/10"
    >
      <div className="container mx-auto max-w-4xl">
        {showHeading && (
          <SectionHeading
            title="Get In Touch"
            subtitle="Let's work together on something amazing"
            centered
          />
        )}

        {/* Profile Photo */}
        {profileImageUrl && (
          <div className="mt-12 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full blur opacity-75"></div>
              <div className="relative">
                <Image
                  src={profileImageUrl}
                  alt={contact.name || "Profile"}
                  width={160}
                  height={160}
                  className="rounded-full object-cover border-4 border-white dark:border-gray-900"
                  priority
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Contact Information
            </h3>
            <div className="space-y-4">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-md p-1"
                aria-label={`Email ${contact.name || "me"} at ${contact.email}`}
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
                  <p className="font-medium">{contact.email}</p>
                </div>
              </a>

              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
                aria-label={`Call ${contact.name || "me"} at ${contact.phone}`}
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
                  <p className="font-medium">{contact.phone}</p>
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
                  <p className="font-medium">{contact.location}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Connect With Me
            </h3>
            <div className="space-y-4">
              {socialLinks?.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-md p-1"
                  aria-label="Visit GitHub profile"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Github
                      className="w-5 h-5 text-gray-700 dark:text-gray-300"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      GitHub
                    </p>
                    <p className="font-medium">Check out my code</p>
                  </div>
                </a>
              )}

              {socialLinks?.linkedin && (
                <a
                  href={socialLinks.linkedin}
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
                    <p className="font-medium">Connect professionally</p>
                  </div>
                </a>
              )}

              {socialLinks?.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-300 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-md p-1"
                  aria-label="Visit Twitter/X profile"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Twitter
                      className="w-5 h-5 text-blue-400 dark:text-blue-300"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Twitter / X
                    </p>
                    <p className="font-medium">Follow me</p>
                  </div>
                </a>
              )}

              {socialLinks?.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors group focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-md p-1"
                  aria-label="Visit Instagram profile"
                >
                  <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Instagram
                      className="w-5 h-5 text-pink-600 dark:text-pink-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Instagram
                    </p>
                    <p className="font-medium">Follow my journey</p>
                  </div>
                </a>
              )}

              {socialLinks?.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md p-1"
                  aria-label="Visit YouTube channel"
                >
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Youtube
                      className="w-5 h-5 text-red-600 dark:text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      YouTube
                    </p>
                    <p className="font-medium">Watch my content</p>
                  </div>
                </a>
              )}

              {socialLinks?.website && (
                <a
                  href={socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors group focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-md p-1"
                  aria-label="Visit personal website"
                >
                  <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Globe
                      className="w-5 h-5 text-teal-600 dark:text-teal-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Website
                    </p>
                    <p className="font-medium">Visit my site</p>
                  </div>
                </a>
              )}

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Open to new opportunities and collaborations. Feel free to
                  reach out!
                </p>
              </div>

              {/* Download Resume Button */}
              <div className="pt-4">
                <a
                  href="/resume.pdf"
                  download
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  aria-label="Download Resume PDF"
                >
                  <Download className="w-5 h-5" aria-hidden="true" />
                  Download Resume
                </a>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
