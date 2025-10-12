"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { formInput, buttons, spacing, containerPadding } from "@/lib/styles";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

interface CollapsibleFiltersProps {
  searchParams: {
    search?: string;
    location?: string;
    skill?: string;
    title?: string;
  };
  filterOptions: {
    locations: string[];
    titles: string[];
  };
}

export function CollapsibleFilters({
  searchParams,
  filterOptions,
}: CollapsibleFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Check if any filters are active
  const hasActiveFilters =
    searchParams.search ||
    searchParams.location ||
    searchParams.skill ||
    searchParams.title;

  return (
    <GlassCard
      className={`mb-6 sm:mb-8 p-0 ${containerPadding.form}`}
      hover={false}
    >
      {/* Mobile Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full md:hidden text-left"
        aria-expanded={isOpen}
        aria-controls="filter-section"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span className="font-semibold text-gray-900 dark:text-white">
            Filter Profiles
          </span>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
              Active
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {/* Filters Form - Hidden on mobile unless expanded, always visible on desktop */}
      <form
        method="GET"
        id="filter-section"
        className={`${spacing.formFields} ${
          isOpen ? "block" : "hidden"
        } md:block`}
      >
        <div
          className={`grid sm:grid-cols-2 lg:grid-cols-4 ${spacing.formGrid}`}
        >
          {/* Search */}
          <div>
            <label htmlFor="search" className={formInput.label}>
              Search
            </label>
            <input
              type="text"
              id="search"
              name="search"
              defaultValue={searchParams.search}
              placeholder="Name, title, or keywords..."
              className={formInput.base}
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className={formInput.label}>
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              defaultValue={searchParams.location}
              placeholder="City, Country..."
              list="locations"
              className={formInput.base}
            />
            <datalist id="locations">
              {filterOptions.locations.map((loc) => (
                <option key={loc} value={loc} />
              ))}
            </datalist>
          </div>

          {/* Job Title */}
          <div>
            <label htmlFor="title" className={formInput.label}>
              Job Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={searchParams.title}
              placeholder="e.g., Software Engineer..."
              list="titles"
              className={formInput.base}
            />
            <datalist id="titles">
              {filterOptions.titles.map((title) => (
                <option key={title} value={title} />
              ))}
            </datalist>
          </div>

          {/* Skills */}
          <div>
            <label htmlFor="skill" className={formInput.label}>
              Skills
            </label>
            <input
              type="text"
              id="skill"
              name="skill"
              defaultValue={searchParams.skill}
              placeholder="e.g., React, Python..."
              className={formInput.base}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className={spacing.buttonGroup}>
          <button
            type="submit"
            className={`${buttons.primary} ${buttons.medium}`}
          >
            Apply Filters
          </button>
          <a
            href="/profiles"
            className={`${buttons.secondary} ${buttons.medium}`}
          >
            Clear All
          </a>
        </div>
      </form>
    </GlassCard>
  );
}
