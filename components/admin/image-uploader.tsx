"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Check, Loader2 } from "lucide-react";
import { buttons } from "@/lib/styles";

interface ImageUploaderProps {
  type: "logo" | "profile";
  currentUrl?: string;
  onUploadSuccess: (url: string) => void;
  userName?: string;
}

export function ImageUploader({
  type,
  currentUrl,
  onUploadSuccess,
  userName,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please use JPEG, PNG, WebP, or GIF.");
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size must be less than 5MB.");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setPreview(data.url);
      onUploadSuccess(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    setUploading(true);
    setError("");

    try {
      // Call the backend to remove the image URL
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [type === "logo" ? "logoUrl" : "profileImageUrl"]: null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove image");
      }

      setPreview(null);
      onUploadSuccess(""); // Notify parent that image was removed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove image");
    } finally {
      setUploading(false);
    }
  };

  const title = type === "logo" ? "Logo" : "Profile Image";
  const description =
    type === "logo"
      ? "Upload your brand logo (shown in navigation). If not uploaded, your name initials will be shown."
      : "Upload your profile photo (shown in contact section). If not uploaded, no image will be displayed.";

  // Generate initials from userName
  const getInitials = () => {
    if (!userName) return "RF";
    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {title}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Preview */}
        <div
          className={`relative ${
            type === "logo" ? "w-20 h-20" : "w-24 h-24 rounded-full"
          } bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden`}
        >
          {preview ? (
            <>
              <Image
                src={preview}
                alt={title}
                fill
                className={`object-cover ${
                  type === "profile" ? "rounded-full" : ""
                }`}
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </>
          ) : type === "logo" ? (
            <div className="w-full h-full rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-2xl">
              {getInitials()}
            </div>
          ) : (
            <Upload className="w-8 h-8 text-gray-400" />
          )}
        </div>

        {/* Upload Button */}
        <div className="flex-1 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="hidden"
            id={`upload-${type}`}
          />
          <label
            htmlFor={`upload-${type}`}
            className={`${buttons.medium} bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2`}
          >
            <Upload className="w-4 h-4" />
            Upload
          </label>

          {preview && !uploading && (
            <button
              onClick={handleRemove}
              className={`ml-2 ${buttons.medium} bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors inline-flex items-center gap-2`}
            >
              <X className="w-4 h-4" />
              Remove
            </button>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400">
            JPEG, PNG, WebP, or GIF (max 5MB)
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Success Indicator */}
      {!error && preview && !uploading && preview !== currentUrl && (
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
            <Check className="w-4 h-4" />
            {title} uploaded successfully!
          </p>
        </div>
      )}
    </div>
  );
}
