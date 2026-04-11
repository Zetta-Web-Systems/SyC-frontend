import { EditorContent } from "@tiptap/react";
import { cn } from "@shared/lib/cn";
import { useMarkdownEditor } from "@shared/hooks/useMarkdownEditor";
import { MarkdownToolbar } from "./MarkdownToolbar/MarkdownToolbar";

export interface MarkdownEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  id?: string;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  "aria-describedby"?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  id,
  placeholder,
  error,
  disabled,
  "aria-describedby": ariaDescribedBy,
}: MarkdownEditorProps) {
  const { editor, actions, state } = useMarkdownEditor({
    value,
    onChange,
    editable: !disabled,
  });

  return (
    <div
      id={id}
      aria-invalid={error || undefined}
      data-invalid={error ? "true" : undefined}
      className={cn(
        "overflow-hidden rounded-xl border bg-white transition-colors",
        "focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20",
        error ? "border-error" : "border-neutral-200",
        disabled && "opacity-60",
      )}
    >
      <MarkdownToolbar actions={actions} state={state} disabled={disabled} />

      <EditorContent
        editor={editor}
        aria-describedby={ariaDescribedBy}
        data-placeholder={placeholder}
        className={cn(
          "min-h-45 px-4 py-3 text-sm text-neutral-900",
          "[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-40",
          "[&_.ProseMirror_h2]:text-lg [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:mt-3 [&_.ProseMirror_h2]:mb-1",
          "[&_.ProseMirror_h3]:text-base [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mt-2 [&_.ProseMirror_h3]:mb-1",
          "[&_.ProseMirror_p]:my-1",
          "[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5",
          "[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5",
          "[&_.ProseMirror_strong]:font-semibold",
          "[&_.ProseMirror_em]:italic",
          "[&_.ProseMirror_s]:line-through",
        )}
      />
    </div>
  );
}

MarkdownEditor.displayName = "MarkdownEditor";
