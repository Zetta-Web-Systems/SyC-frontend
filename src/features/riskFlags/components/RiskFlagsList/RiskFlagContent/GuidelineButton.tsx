import { useState } from "react";
import { FileText } from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { Button, Modal } from "@shared/ui";

interface GuidelineButtonProps {
  guideline: string | undefined;
  riskFlagName: string;
}

function GuidelineViewer({ value }: { value: string }) {
  const editor = useEditor({
    extensions: [StarterKit, Markdown.configure({ html: false })],
    content: value,
    editable: false,
  });

  return (
    <EditorContent
      editor={editor}
      className="prose prose-sm max-w-none px-6 py-4 text-sm text-neutral-900 [&_.ProseMirror]:outline-none [&_.ProseMirror_h2]:mb-1 [&_.ProseMirror_h2]:mt-3 [&_.ProseMirror_h2]:text-lg [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h3]:mb-1 [&_.ProseMirror_h3]:mt-2 [&_.ProseMirror_h3]:text-base [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5 [&_.ProseMirror_p]:my-1 [&_.ProseMirror_strong]:font-semibold [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5"
    />
  );
}

export function GuidelineButton({
  guideline,
  riskFlagName,
}: GuidelineButtonProps) {
  const [open, setOpen] = useState(false);
  const hasGuideline = Boolean(guideline && guideline.trim().length > 0);

  if (!hasGuideline) {
    return (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          intent="secondary"
          disabled
          aria-label={`Sin documentación`}
        >
          <FileText size={14} aria-hidden="true" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          intent="secondary"
          onClick={() => setOpen(true)}
          aria-label={`Ver documentación de ${riskFlagName}`}
        >
          <FileText size={14} aria-hidden="true" />
        </Button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeOnBackdropClick
        size="lg"
        title={`Documentación médica — ${riskFlagName}`}
      >
        {open && <GuidelineViewer value={guideline ?? ""} />}
      </Modal>
    </>
  );
}

GuidelineButton.displayName = "GuidelineButton";
