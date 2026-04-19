import { useState } from "react";
import { Body } from "@shared/components/BodyHighlighter";
import { BODY_PREVIEW_FILL } from "../../constants";
import { useBodyPartsFiltered } from "../../hooks/useBodyPartsFiltered";
import { ClinicalProfileBodyModal } from "./ClinicalProfileBodyModal";

export function ClinicalProfileBodyPreview() {
  const { bodyParts, withIntensity, withoutIntensity } = useBodyPartsFiltered();
  const [open, setOpen] = useState(false);

  const zoneCount = bodyParts.length;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group w-full cursor-default rounded-xl border border-neutral-200 bg-white p-4 text-left max-md:pointer-events-none md:cursor-pointer md:transition md:hover:shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-neutral-800">
              Zonas afectadas
            </p>
            <p className="text-xs text-neutral-500">
              {zoneCount === 0
                ? "Sin datos"
                : `${zoneCount} zona${zoneCount > 1 ? "s" : ""}`}
            </p>
          </div>

          {zoneCount > 0 && (
            <span className="hidden text-xs text-neutral-400 group-hover:text-neutral-600 md:inline">
              Ver detalle →
            </span>
          )}
        </div>

        <div className="mt-3 flex justify-center gap-4">
          <Body
            data={bodyParts}
            side="front"
            scale={0.6}
            defaultFill={BODY_PREVIEW_FILL}
          />
          <Body
            data={bodyParts}
            side="back"
            scale={0.6}
            defaultFill={BODY_PREVIEW_FILL}
          />
        </div>

        {zoneCount > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-500">
            <span>{withIntensity.length} con datos</span>
            {withoutIntensity.length > 0 && (
              <span className="text-neutral-400">
                {withoutIntensity.length} sin datos
              </span>
            )}
          </div>
        )}
      </button>

      <ClinicalProfileBodyModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

ClinicalProfileBodyPreview.displayName = "ClinicalProfileBodyPreview";
