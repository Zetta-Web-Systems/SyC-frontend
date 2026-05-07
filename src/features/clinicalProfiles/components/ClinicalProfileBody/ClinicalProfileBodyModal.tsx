import { Modal } from "@shared/ui";
import { Body } from "@shared/components/BodyHighlighter";
import { BODY_PREVIEW_FILL } from "../../constants";
import { useBodyPartsFiltered } from "../../hooks/useBodyPartsFiltered";
import { ClinicalProfileBodyLegend } from "./ClinicalProfileBodyLegend";

interface ClinicalProfileBodyModalProps {
  open: boolean;
  onClose: () => void;
}

export function ClinicalProfileBodyModal({
  open,
  onClose,
}: ClinicalProfileBodyModalProps) {
  const { bodyParts } = useBodyPartsFiltered();

  return (
    <Modal open={open} onClose={onClose} size="full" bodyClassName="p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-semibold text-neutral-800">
            Zonas afectadas
          </h2>
          <p className="text-sm text-neutral-500">
            Visualización detallada del perfil clínico
          </p>
        </div>

        <div className="flex justify-center gap-10">
          <Body
            data={bodyParts}
            side="front"
            scale={1.4}
            defaultFill={BODY_PREVIEW_FILL}
          />
          <Body
            data={bodyParts}
            side="back"
            scale={1.4}
            defaultFill={BODY_PREVIEW_FILL}
          />
        </div>

        <ClinicalProfileBodyLegend />
      </div>
    </Modal>
  );
}
