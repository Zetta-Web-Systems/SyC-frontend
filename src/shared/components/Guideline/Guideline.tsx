import { useState } from "react";
import { FileText } from "lucide-react";
import { EditorContent } from "@tiptap/react";
import { Button, Modal } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import { ME_CONTENT_CLASSNAME } from "@shared/constants/markdownEditor.constants";
import { useMarkdownEditor } from "@shared/hooks/useMarkdownEditor";

interface GuidelineButtonProps {
  guideline: string | undefined;
  riskFlagName: string;
}

function GuidelineViewer({ value }: { value: string }) {
  const { editor } = useMarkdownEditor({
    value,
    onChange: () => {},
    editable: false,
  });

  return (
    <EditorContent
      editor={editor}
      className={cn("px-6 py-4 text-sm text-neutral-900", ME_CONTENT_CLASSNAME)}
    />
  );
}

interface GuidelineModalProps {
  open: boolean;
  onClose: () => void;
  guideline: string | undefined;
  riskFlagName: string;
}

export function GuidelineModal({
  open,
  onClose,
  guideline,
  riskFlagName,
}: GuidelineModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeOnBackdropClick
      size="lg"
      title={`Documentación médica — ${riskFlagName}`}
    >
      {open && <GuidelineViewer value={guideline ?? ""} />}
    </Modal>
  );
}

GuidelineModal.displayName = "GuidelineModal";

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

      <GuidelineModal
        open={open}
        onClose={() => setOpen(false)}
        guideline={guideline}
        riskFlagName={riskFlagName}
      />
    </>
  );
}

GuidelineButton.displayName = "GuidelineButton";
