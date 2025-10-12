"use client";

import { TryNowContent } from "@/components/try-now-content";

/**
 * Try Now Section - wrapper component for landing page
 * Uses TryNowContent without the heading (heading is in the section)
 */
export function TryNowSection() {
  return <TryNowContent showHeading={false} />;
}
