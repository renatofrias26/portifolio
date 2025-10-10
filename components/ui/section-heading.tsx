"use client";

import { motion } from "framer-motion";
import { GradientText } from "./gradient-text";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeading({
  title,
  subtitle,
  centered = false,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={centered ? "text-center" : ""}
    >
      <h2 className="text-4xl md:text-5xl font-bold mb-4">
        <GradientText>{title}</GradientText>
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
