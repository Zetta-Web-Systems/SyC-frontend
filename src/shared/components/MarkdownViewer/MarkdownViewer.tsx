import { EditorContent } from "@tiptap/react";
import { cn } from "@shared/lib/cn";
import { useMarkdownEditor } from "@shared/hooks/useMarkdownEditor";
import {
  ME_CONTENT_CLASSNAME,
  ME_CONTENT_CLASSNAME_COMPACT,
} from "@shared/constants/markdownEditor.constants";

export interface MarkdownViewerProps {
  value: string;
  className?: string;
  size?: "default" | "compact";
}

export function MarkdownViewer({
  value,
  className,
  size = "default",
}: MarkdownViewerProps) {
  const { editor } = useMarkdownEditor({
    value,
    onChange: () => {},
    editable: false,
  });

  const contentClassName =
    size === "compact" ? ME_CONTENT_CLASSNAME_COMPACT : ME_CONTENT_CLASSNAME;

  return (
    <EditorContent
      editor={editor}
      className={cn("text-sm text-neutral-900", contentClassName, className)}
    />
  );
}

MarkdownViewer.displayName = "MarkdownViewer";
