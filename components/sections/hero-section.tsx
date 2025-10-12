"use client";

import { motion } from "framer-motion";
import { GradientText } from "../ui/gradient-text";
import { ArrowDown, Mail, Phone, MapPin } from "lucide-react";
import { resumeData } from "@/data/resume";
import { Fragment } from "react";

interface HeroSectionProps {
  name?: string; // User's name
  showScrollButton?: boolean;
  title?: string; // Custom title from user profile settings
  tagline?: string; // Custom tagline from user profile
  contactInfo?: {
    email?: string;
    phone?: string;
    location?: string;
  };
}

export function HeroSection({
  name = resumeData.name,
  showScrollButton = true,
  title,
  tagline,
  contactInfo,
}: HeroSectionProps) {
  const scrollToNext = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  // Parse tagline to add highlights
  // Syntax: ##text## = auto-colored highlight (cycles through purple, blue, teal)
  const parseTagline = (text: string) => {
    if (!text) return null;

    const parts: Array<{ text: string; colorIndex?: number }> = [];
    const colors = ["purple", "blue", "teal"] as const;

    // Regular expression to match highlight markers
    const regex = /(\#\#([^#]+)\#\#)/g;
    let lastIndex = 0;
    let match;
    let highlightCount = 0;

    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push({ text: text.substring(lastIndex, match.index) });
      }

      // Add the highlighted text with cycling color
      parts.push({
        text: match[2],
        colorIndex: highlightCount % colors.length,
      });
      highlightCount++;

      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({ text: text.substring(lastIndex) });
    }

    // Render the parts
    return (
      <>
        {parts.map((part, index) => {
          if (part.colorIndex === undefined) {
            return <Fragment key={index}>{part.text}</Fragment>;
          }

          const colorClasses: Record<(typeof colors)[number], string> = {
            purple: "font-semibold text-purple-600 dark:text-purple-400",
            blue: "font-semibold text-blue-600 dark:text-blue-400",
            teal: "font-semibold text-teal-600 dark:text-teal-400",
          };

          const color = colors[part.colorIndex];

          return (
            <span key={index} className={colorClasses[color]}>
              {part.text}
            </span>
          );
        })}
      </>
    );
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      aria-label="Hero"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Name and Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <GradientText>{name}</GradientText>
            </h1>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-2xl md:text-4xl font-semibold text-gray-700 dark:text-gray-300 mb-8"
          >
            {title || resumeData.title}
          </motion.h2>

          {/* Short intro */}
          {tagline && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              {parseTagline(tagline)}
            </motion.p>
          )}

          {/* Contact info - displayed if provided from profile settings */}
          {contactInfo &&
            (contactInfo.email ||
              contactInfo.phone ||
              contactInfo.location) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex flex-wrap justify-center gap-6 mb-12 text-gray-600 dark:text-gray-400"
              >
                {contactInfo.email && (
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-center gap-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-md px-2 py-1"
                    aria-label={`Email: ${contactInfo.email}`}
                  >
                    <Mail className="w-5 h-5" aria-hidden="true" />
                    <span>{contactInfo.email}</span>
                  </a>
                )}
                {contactInfo.phone && (
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
                    aria-label={`Phone: ${contactInfo.phone}`}
                  >
                    <Phone className="w-5 h-5" aria-hidden="true" />
                    <span>{contactInfo.phone}</span>
                  </a>
                )}
                {contactInfo.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" aria-hidden="true" />
                    <span>{contactInfo.location}</span>
                  </div>
                )}
              </motion.div>
            )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a
              href="#ai-chat"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Ask AI About Me
            </a>
            <a
              href="#experience"
              className="px-8 py-4 glass rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              View Experience
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {showScrollButton && (
        <motion.button
          onClick={scrollToNext}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full p-2"
          aria-label="Scroll to about section"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown className="w-8 h-8" aria-hidden="true" />
          </motion.div>
        </motion.button>
      )}
    </section>
  );
}
