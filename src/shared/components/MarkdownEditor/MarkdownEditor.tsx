import { EditorContent } from "@tiptap/react";
import { cn } from "@shared/lib/cn";
import { useMarkdownEditor } from "@shared/hooks/useMarkdownEditor";
import { ME_CONTENT_CLASSNAME } from "@shared/constants/markdownEditor.constants";
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
          "[&_.ProseMirror]:min-h-40",
          ME_CONTENT_CLASSNAME,
        )}
      />
    </div>
  );
}

MarkdownEditor.displayName = "MarkdownEditor";
