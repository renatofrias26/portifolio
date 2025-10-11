"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2, Plus, Trash2 } from "lucide-react";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  versionId: number | null;
  onSaveSuccess?: () => void;
}

interface ResumeData {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    title: string;
    company: string;
    location: string;
    period: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    period: string;
    details: string[];
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
}

export function EditModal({
  isOpen,
  onClose,
  versionId,
  onSaveSuccess,
}: EditModalProps) {
  const [data, setData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResumeData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/resume-data/${versionId}`);
      const result = await response.json();

      if (response.ok) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to load data");
      }
    } catch {
      setError("Failed to fetch resume data");
    } finally {
      setIsLoading(false);
    }
  }, [versionId]);

  useEffect(() => {
    if (isOpen && versionId) {
      fetchResumeData();
    }
  }, [isOpen, versionId, fetchResumeData]);

  const handleSave = async () => {
    if (!data || !versionId) return;

    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch(`/api/admin/update-resume/${versionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });

      const result = await response.json();

      if (response.ok) {
        onSaveSuccess?.();
        onClose();
      } else {
        setError(result.error || "Failed to save changes");
      }
    } catch {
      setError("Failed to save resume data");
    } finally {
      setIsSaving(false);
    }
  };

  const updatePersonal = (
    field: keyof ResumeData["personal"],
    value: string,
  ) => {
    if (!data) return;
    setData({
      ...data,
      personal: { ...data.personal, [field]: value },
    });
  };

  const updateExperience = (
    index: number,
    field: string,
    value: string | string[],
  ) => {
    if (!data) return;
    const updated = [...data.experience];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, experience: updated });
  };

  const addExperience = () => {
    if (!data) return;
    setData({
      ...data,
      experience: [
        ...data.experience,
        {
          title: "",
          company: "",
          location: "",
          period: "",
          description: "",
          achievements: [],
        },
      ],
    });
  };

  const removeExperience = (index: number) => {
    if (!data) return;
    setData({
      ...data,
      experience: data.experience.filter((_, i) => i !== index),
    });
  };

  const updateEducation = (
    index: number,
    field: string,
    value: string | string[],
  ) => {
    if (!data) return;
    const updated = [...data.education];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, education: updated });
  };

  const addEducation = () => {
    if (!data) return;
    setData({
      ...data,
      education: [
        ...data.education,
        {
          degree: "",
          institution: "",
          location: "",
          period: "",
          details: [],
        },
      ],
    });
  };

  const removeEducation = (index: number) => {
    if (!data) return;
    setData({
      ...data,
      education: data.education.filter((_, i) => i !== index),
    });
  };

  const updateSkills = (category: "technical" | "soft", value: string) => {
    if (!data) return;
    const skills = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // Ensure skills object exists with both properties
    const currentSkills = data.skills || { technical: [], soft: [] };

    setData({
      ...data,
      skills: {
        ...currentSkills,
        [category]: skills,
      },
    });
  };

  const updateProject = (
    index: number,
    field: string,
    value: string | string[],
  ) => {
    if (!data) return;
    const updated = [...data.projects];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, projects: updated });
  };

  const addProject = () => {
    if (!data) return;
    setData({
      ...data,
      projects: [
        ...data.projects,
        {
          name: "",
          description: "",
          technologies: [],
          url: "",
        },
      ],
    });
  };

  const removeProject = (index: number) => {
    if (!data) return;
    setData({
      ...data,
      projects: data.projects.filter((_, i) => i !== index),
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden glass rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold">Edit Resume</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                {error}
              </div>
            ) : data ? (
              <div className="space-y-8">
                {/* Personal Information */}
                <section>
                  <h3 className="text-xl font-bold mb-4">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={data.personal.name}
                        onChange={(e) => updatePersonal("name", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg glass border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={data.personal.title}
                        onChange={(e) =>
                          updatePersonal("title", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg glass border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={data.personal.email}
                        onChange={(e) =>
                          updatePersonal("email", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg glass border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={data.personal.phone}
                        onChange={(e) =>
                          updatePersonal("phone", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg glass border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={data.personal.location}
                        onChange={(e) =>
                          updatePersonal("location", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg glass border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">
                        Summary
                      </label>
                      <textarea
                        value={data.personal.summary}
                        onChange={(e) =>
                          updatePersonal("summary", e.target.value)
                        }
                        rows={4}
                        className="w-full px-3 py-2 rounded-lg glass border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      />
                    </div>
                  </div>
                </section>

                {/* Experience */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Experience</h3>
                    <button
                      onClick={addExperience}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-4">
                    {data.experience.map((exp, idx) => (
                      <div
                        key={idx}
                        className="p-4 glass rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold">
                            Experience {idx + 1}
                          </h4>
                          <button
                            onClick={() => removeExperience(idx)}
                            className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Title"
                            value={exp.title}
                            onChange={(e) =>
                              updateExperience(idx, "title", e.target.value)
                            }
                            className="px-3 py-2 rounded glass border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Company"
                            value={exp.company}
                            onChange={(e) =>
                              updateExperience(idx, "company", e.target.value)
                            }
                            className="px-3 py-2 rounded glass border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Location"
                            value={exp.location}
                            onChange={(e) =>
                              updateExperience(idx, "location", e.target.value)
                            }
                            className="px-3 py-2 rounded glass border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Period"
                            value={exp.period}
                            onChange={(e) =>
                              updateExperience(idx, "period", e.target.value)
                            }
                            className="px-3 py-2 rounded glass border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <textarea
                            placeholder="Description"
                            value={exp.description}
                            onChange={(e) =>
                              updateExperience(
                                idx,
                                "description",
                                e.target.value,
                              )
                            }
                            rows={2}
                            className="md:col-span-2 px-3 py-2 rounded glass border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                          />
                          <textarea
                            placeholder="Achievements (one per line)"
                            value={(exp.achievements || []).join("\n")}
                            onChange={(e) =>
                              updateExperience(
                                idx,
                                "achievements",
                                e.target.value.split("\n").filter(Boolean),
                              )
                            }
                            rows={3}
                            className="md:col-span-2 px-3 py-2 rounded glass border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Education */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Education</h3>
                    <button
                      onClick={addEducation}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-4">
                    {data.education.map((edu, idx) => (
                      <div
                        key={idx}
                        className="p-4 glass rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold">Education {idx + 1}</h4>
                          <button
                            onClick={() => removeEducation(idx)}
                            className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Degree"
                            value={edu.degree}
                            onChange={(e) =>
                              updateEducation(idx, "degree", e.target.value)
                            }
                            className="px-3 py-2 rounded glass border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Institution"
                            value={edu.institution}
                            onChange={(e) =>
                              updateEducation(
                                idx,
                                "institution",
                                e.target.value,
                              )
                            }
                            className="px-3 py-2 rounded glass border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Location"
                            value={edu.location}
                            onChange={(e) =>
                              updateEducation(idx, "location", e.target.value)
                            }
                            className="px-3 py-2 rounded glass border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Period"
                            value={edu.period}
                            onChange={(e) =>
                              updateEducation(idx, "period", e.target.value)
                            }
                            className="px-3 py-2 rounded glass border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <textarea
                            placeholder="Details (one per line)"
                            value={(edu.details || []).join("\n")}
                            onChange={(e) =>
                              updateEducation(
                                idx,
                                "details",
                                e.target.value.split("\n").filter(Boolean),
                              )
                            }
                            rows={2}
                            className="md:col-span-2 px-3 py-2 rounded glass border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Skills */}
                <section>
                  <h3 className="text-xl font-bold mb-4">Skills</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Technical Skills (comma-separated)
                      </label>
                      <textarea
                        value={(data.skills?.technical || []).join(", ")}
                        onChange={(e) =>
                          updateSkills("technical", e.target.value)
                        }
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg glass border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Soft Skills (comma-separated)
                      </label>
                      <textarea
                        value={(data.skills?.soft || []).join(", ")}
                        onChange={(e) => updateSkills("soft", e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg glass border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      />
                    </div>
                  </div>
                </section>

                {/* Projects */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Projects</h3>
                    <button
                      onClick={addProject}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-4">
                    {data.projects.map((proj, idx) => (
                      <div
                        key={idx}
                        className="p-4 glass rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold">Project {idx + 1}</h4>
                          <button
                            onClick={() => removeProject(idx)}
                            className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Project Name"
                            value={proj.name}
                            onChange={(e) =>
                              updateProject(idx, "name", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded glass border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <textarea
                            placeholder="Description"
                            value={proj.description}
                            onChange={(e) =>
                              updateProject(idx, "description", e.target.value)
                            }
                            rows={2}
                            className="w-full px-3 py-2 rounded glass border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                          />
                          <input
                            type="text"
                            placeholder="Technologies (comma-separated)"
                            value={(proj.technologies || []).join(", ")}
                            onChange={(e) =>
                              updateProject(
                                idx,
                                "technologies",
                                e.target.value
                                  .split(",")
                                  .map((t) => t.trim())
                                  .filter(Boolean),
                              )
                            }
                            className="w-full px-3 py-2 rounded glass border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="URL (optional)"
                            value={proj.url || ""}
                            onChange={(e) =>
                              updateProject(idx, "url", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded glass border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg glass hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !data}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
