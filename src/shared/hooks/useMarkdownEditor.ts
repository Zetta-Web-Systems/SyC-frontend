import { useCallback, useEffect } from "react";
import { useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { TaskList, TaskItem } from "@tiptap/extension-list";
import type {
  MarkdownEditorActions,
  MarkdownEditorState,
  TextAlign as TextAlignValue,
  HeadingLevel,
} from "@shared/types/markdownEditor.types";
import { TEXT_ALIGN } from "@shared/types/markdownEditor.types";

interface UseMarkdownEditorArgs {
  value: string;
  onChange: (markdown: string) => void;
  editable?: boolean;
  placeholder?: string;
}

function readTextAlign(editor: Editor): TextAlignValue {
  for (const align of [
    TEXT_ALIGN.CENTER,
    TEXT_ALIGN.RIGHT,
    TEXT_ALIGN.JUSTIFY,
  ]) {
    if (editor.isActive({ textAlign: align })) return align;
  }
  return TEXT_ALIGN.LEFT;
}

function readHeadingLevel(editor: Editor): HeadingLevel | null {
  if (!editor.isActive("heading")) return null;
  const level = editor.getAttributes("heading").level as
    | HeadingLevel
    | undefined;
  return level ?? null;
}

async function filesToImageSources(files: FileList | null): Promise<string[]> {
  if (!files) return [];
  const images = Array.from(files).filter((f) => f.type.startsWith("image/"));
  if (images.length === 0) return [];
  return Promise.all(
    images.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        }),
    ),
  );
}

function promptLink(editor: Editor) {
  const previous = editor.getAttributes("link").href as string | undefined;
  const href = window.prompt("URL del enlace", previous ?? "https://");
  if (href === null) return;
  if (href === "") {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }
  editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
}

export function useMarkdownEditor({
  value,
  onChange,
  editable = true,
}: UseMarkdownEditorArgs) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, autolink: true },
      }),
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Image.configure({ inline: false, allowBase64: true }),
      Markdown,
    ],
    content: value,
    contentType: "markdown",
    editable,
    editorProps: {
      handleKeyDown: (_view, event) => {
        if (!editor) return false;
        if (
          (event.ctrlKey || event.metaKey) &&
          event.key.toLowerCase() === "k"
        ) {
          event.preventDefault();
          promptLink(editor);
          return true;
        }
        return false;
      },
      handlePaste: (_view, event) => {
        const files = event.clipboardData?.files ?? null;
        if (!files || files.length === 0) return false;
        if (!editor) return false;
        void filesToImageSources(files).then((sources) => {
          if (sources.length === 0) return;
          const chain = editor.chain().focus();
          for (const src of sources) chain.setImage({ src });
          chain.run();
        });
        return true;
      },
      handleDrop: (_view, event) => {
        const dataTransfer = (event as DragEvent).dataTransfer;
        const files = dataTransfer?.files ?? null;
        if (!files || files.length === 0) return false;
        if (!editor) return false;
        event.preventDefault();
        void filesToImageSources(files).then((sources) => {
          if (sources.length === 0) return;
          const chain = editor.chain().focus();
          for (const src of sources) chain.setImage({ src });
          chain.run();
        });
        return true;
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getMarkdown());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getMarkdown() === value) return;
    editor.commands.setContent(value, {
      contentType: "markdown",
      emitUpdate: false,
    });
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
    toggleUnderline: useCallback(
      () => editor?.chain().focus().toggleUnderline().run(),
      [editor],
    ),
    toggleStrike: useCallback(
      () => editor?.chain().focus().toggleStrike().run(),
      [editor],
    ),
    toggleHighlight: useCallback(
      () => editor?.chain().focus().toggleHighlight().run(),
      [editor],
    ),
    setHighlightColor: useCallback(
      (color: string) => editor?.chain().focus().setHighlight({ color }).run(),
      [editor],
    ),
    unsetHighlight: useCallback(
      () => editor?.chain().focus().unsetHighlight().run(),
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
    toggleTaskList: useCallback(
      () => editor?.chain().focus().toggleTaskList().run(),
      [editor],
    ),
    setTextAlign: useCallback(
      (align: TextAlignValue) =>
        editor?.chain().focus().setTextAlign(align).run(),
      [editor],
    ),
    setHeading: useCallback(
      (level: HeadingLevel | null) => {
        if (!editor) return;
        if (level === null) {
          editor.chain().focus().setParagraph().run();
        } else {
          editor.chain().focus().setHeading({ level }).run();
        }
      },
      [editor],
    ),
    insertImage: useCallback(
      (src: string, alt?: string) => {
        editor?.chain().focus().setImage({ src, alt }).run();
      },
      [editor],
    ),
    insertLink: useCallback(
      (href: string) => {
        if (!editor || href === "") return;
        editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
      },
      [editor],
    ),
    unsetLink: useCallback(
      () => editor?.chain().focus().extendMarkRange("link").unsetLink().run(),
      [editor],
    ),
    clearFormatting: useCallback(
      () =>
        editor
          ?.chain()
          .focus()
          .unsetAllMarks()
          .unsetTextAlign()
          .clearNodes()
          .run(),
      [editor],
    ),
    undo: useCallback(() => editor?.chain().focus().undo().run(), [editor]),
    redo: useCallback(() => editor?.chain().focus().redo().run(), [editor]),
  };

  const state = useEditorState({
    editor,
    selector: ({ editor: ed }): MarkdownEditorState => {
      if (!ed) {
        return {
          isBold: false,
          isItalic: false,
          isUnderline: false,
          isStrike: false,
          isHighlight: false,
          highlightColor: null,
          isBulletList: false,
          isOrderedList: false,
          isTaskList: false,
          isLink: false,
          textAlign: TEXT_ALIGN.LEFT,
          headingLevel: null,
          canUndo: false,
          canRedo: false,
        };
      }
      const highlightAttrs = ed.getAttributes("highlight") as {
        color?: string;
      };
      return {
        isBold: ed.isActive("bold"),
        isItalic: ed.isActive("italic"),
        isUnderline: ed.isActive("underline"),
        isStrike: ed.isActive("strike"),
        isHighlight: ed.isActive("highlight"),
        highlightColor: highlightAttrs.color ?? null,
        isBulletList: ed.isActive("bulletList"),
        isOrderedList: ed.isActive("orderedList"),
        isTaskList: ed.isActive("taskList"),
        isLink: ed.isActive("link"),
        textAlign: readTextAlign(ed),
        headingLevel: readHeadingLevel(ed),
        canUndo: ed.can().undo(),
        canRedo: ed.can().redo(),
      };
    },
  });

  return { editor, actions, state };
}
