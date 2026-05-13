import type { ReactNode } from "react";
import { Modal } from "@shared/ui";
import { Body } from "@shared/components/BodyHighlighter";
import type {
  ExtendedBodyPart,
  Slug,
} from "@shared/types/bodyHighlighter.types";

interface BodyDetailModalProps {
  open: boolean;
  onClose: () => void;
  bodyParts: ReadonlyArray<ExtendedBodyPart>;
  title?: string;
  subtitle?: string;
  legend?: ReactNode;
  defaultFill?: string;
  scale?: number;
  getPathLabel?: (slug: Slug) => string | undefined;
}

export function BodyDetailModal({
  open,
  onClose,
  bodyParts,
  title = "Zonas afectadas",
  subtitle,
  legend,
  defaultFill,
  scale = 1.4,
  getPathLabel,
}: BodyDetailModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="full" bodyClassName="p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-semibold text-neutral-800">{title}</h2>
          {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap justify-center gap-10">
          <Body
            data={bodyParts}
            side="front"
            scale={scale}
            defaultFill={defaultFill}
            getPathLabel={getPathLabel}
          />
          <Body
            data={bodyParts}
            side="back"
            scale={scale}
            defaultFill={defaultFill}
            getPathLabel={getPathLabel}
          />
        </div>

        {legend}
      </div>
    </Modal>
  );
}

BodyDetailModal.displayName = "BodyDetailModal";
