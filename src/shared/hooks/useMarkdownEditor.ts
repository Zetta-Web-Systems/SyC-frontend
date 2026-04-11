import { useCallback, useEffect } from "react";
import { useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import type {
  MarkdownEditorActions,
  MarkdownEditorState,
} from "@shared/types/mardownEditor.types";

interface UseMarkdownEditorArgs {
  value: string;
  onChange: (markdown: string) => void;
  editable?: boolean;
  placeholder?: string;
}

function getMarkdown(editor: Editor): string {
  const storage = editor.storage as {
    markdown?: { getMarkdown: () => string };
  };
  return storage.markdown?.getMarkdown() ?? "";
}

export function useMarkdownEditor({
  value,
  onChange,
  editable = true,
}: UseMarkdownEditorArgs) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: value,
    editable,
    onUpdate: ({ editor: ed }) => {
      onChange(getMarkdown(ed));
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (getMarkdown(editor) === value) return;
    editor.commands.setContent(value, { emitUpdate: false });
  }, [value, editor]);

  useEffect(() => {
    if (!editor) return;
    if (editor.isEditable !== editable) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);

  const actions: MarkdownEditorActions = {
    toggleBold: useCallback(
      () => editor?.chain().focus().toggleBold().run(),
      [editor],
    ),
    toggleItalic: useCallback(
      () => editor?.chain().focus().toggleItalic().run(),
      [editor],
    ),
    toggleStrike: useCallback(
      () => editor?.chain().focus().toggleStrike().run(),
      [editor],
    ),
    toggleBulletList: useCallback(
      () => editor?.chain().focus().toggleBulletList().run(),
      [editor],
    ),
    toggleOrderedList: useCallback(
      () => editor?.chain().focus().toggleOrderedList().run(),
      [editor],
    ),
    toggleHeading: useCallback(
      (level: 2 | 3) => editor?.chain().focus().toggleHeading({ level }).run(),
      [editor],
    ),
    undo: useCallback(() => editor?.chain().focus().undo().run(), [editor]),
    redo: useCallback(() => editor?.chain().focus().redo().run(), [editor]),
  };

  const state: MarkdownEditorState = {
    isBold: editor?.isActive("bold") ?? false,
    isItalic: editor?.isActive("italic") ?? false,
    isStrike: editor?.isActive("strike") ?? false,
    isBulletList: editor?.isActive("bulletList") ?? false,
    isOrderedList: editor?.isActive("orderedList") ?? false,
    isHeading2: editor?.isActive("heading", { level: 2 }) ?? false,
    isHeading3: editor?.isActive("heading", { level: 3 }) ?? false,
    canUndo: editor?.can().undo() ?? false,
    canRedo: editor?.can().redo() ?? false,
  };

  return { editor, actions, state };
}
