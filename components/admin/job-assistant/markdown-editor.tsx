"use client";

import MDEditor from "@uiw/react-md-editor";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <div>
      {/* Editor - Light Mode */}
      <div data-color-mode="light" className="dark:hidden">
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || "")}
          preview="edit"
          height={500}
          visibleDragbar={false}
        />
      </div>

      {/* Editor - Dark Mode */}
      <div data-color-mode="dark" className="hidden dark:block">
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || "")}
          preview="edit"
          height={500}
          visibleDragbar={false}
        />
      </div>

      <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
        Edit the generated content or use the toolbar to format
      </p>
    </div>
  );
}
