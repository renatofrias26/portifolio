"use client";

import { motion } from "framer-motion";
import { GradientText } from "../ui/gradient-text";
import { ArrowDown, Mail, Phone, MapPin } from "lucide-react";
import { resumeData } from "@/data/resume";
import Image from "next/image";

interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
}

interface HeroSectionProps {
  personal?: PersonalInfo;
  profileImageUrl?: string;
  showScrollButton?: boolean;
}

export function HeroSection({
  personal = {
    name: resumeData.name,
    title: resumeData.title,
    email: resumeData.email,
    phone: resumeData.phone,
    location: resumeData.location,
  },
  profileImageUrl,
  showScrollButton = true,
}: HeroSectionProps) {
  const scrollToNext = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
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
          {/* Profile Image */}
          {profileImageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex justify-center"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-purple-500/50 shadow-2xl">
                <Image
                  src={profileImageUrl}
                  alt="Profile"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          )}

          {/* Name and Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <GradientText>{personal.name}</GradientText>
            </h1>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-2xl md:text-4xl font-semibold text-gray-700 dark:text-gray-300 mb-8"
          >
            {personal.title}
          </motion.h2>

          {/* Short intro */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            From{" "}
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              Mechatronics Engineering
            </span>{" "}
            to{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              Software Development
            </span>
            , now specializing in{" "}
            <span className="font-semibold text-teal-600 dark:text-teal-400">
              AI Solutions
            </span>
            . Building the future, one line of code at a time.
          </motion.p>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-6 mb-12 text-gray-600 dark:text-gray-400"
          >
            <a
              href={`mailto:${personal.email}`}
              className="flex items-center gap-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-md px-2 py-1"
              aria-label={`Email: ${personal.email}`}
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
              <span>{personal.email}</span>
            </a>
            <a
              href={`tel:${personal.phone}`}
              className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
              aria-label={`Phone: ${personal.phone}`}
            >
              <Phone className="w-5 h-5" aria-hidden="true" />
              <span>{personal.phone}</span>
            </a>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" aria-hidden="true" />
              <span>{personal.location}</span>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
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
