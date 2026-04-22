import { Modal } from "@shared/ui";
import { Body } from "@shared/components/BodyHighlighter";
import { BODY_ZONE_LABELS } from "@shared/constants/bodyZones";
import type { BodyZone } from "@shared/types/bodyZone.types";
import {
  BODY_PREVIEW_FILL,
  PAIN_LEVEL_MAX,
  SIDE_LABELS,
} from "../../constants";
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
  const {
    bodyParts,
    withoutIntensity,
    none,
    veryLow,
    low,
    mid,
    high,
    veryHigh,
    topZones,
  } = useBodyPartsFiltered();

  const summaryItems: {
    singular: string;
    plural: string;
    count: number;
    muted?: boolean;
  }[] = [
    {
      singular: "sin dolor",
      plural: "sin dolor",
      count: none.length,
      muted: true,
    },
    { singular: "muy leve", plural: "muy leves", count: veryLow.length },
    { singular: "leve", plural: "leves", count: low.length },
    { singular: "moderada", plural: "moderadas", count: mid.length },
    { singular: "alta", plural: "altas", count: high.length },
    { singular: "muy alta", plural: "muy altas", count: veryHigh.length },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="full"
      title="Zonas afectadas"
      bodyClassName="p-6"
    >
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

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 rounded-xl bg-neutral-50 p-3 text-sm text-neutral-600">
          {summaryItems
            .filter((item) => item.count > 0)
            .map((item) => (
              <span
                key={item.singular}
                className={item.muted ? "text-neutral-400" : undefined}
              >
                {item.count} {item.count === 1 ? item.singular : item.plural}
              </span>
            ))}
          {withoutIntensity.length > 0 && (
            <span className="text-neutral-400">
              {withoutIntensity.length} sin datos
            </span>
          )}
        </div>

        {topZones.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-neutral-700">
              Zonas críticas
            </p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {topZones.map((zone) => (
                <div
                  key={`${zone.slug}-${zone.side ?? "both"}`}
                  className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: zone.color }}
                  />

                  <span>
                    {BODY_ZONE_LABELS[zone.slug as BodyZone]}
                    {zone.side ? ` (${SIDE_LABELS[zone.side]})` : ""}
                  </span>

                  <span className="ml-auto font-medium">
                    {zone.intensity}/{PAIN_LEVEL_MAX}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
