import { useMemo } from "react";
import { Badge, Card } from "@shared/ui";
import { Body } from "@shared/components/BodyHighlighter";
import { BodyDetailModal } from "@shared/components/BodyDetailModal";
import { BODY_PREVIEW_FILL } from "@features/clinicalProfiles";
import {
  ALL_BODY_ZONES,
  BODY_ZONE_GROUP_INTENT,
  BODY_ZONE_LABELS,
  BODY_ZONE_TO_GROUP_LABEL,
} from "@shared/constants/bodyZones";
import type { DisclosureState } from "@shared/hooks/useDisclosure";
import type { Slug } from "@shared/types/bodyHighlighter.types";
import type { BodyZone } from "@shared/types/bodyZone.types";
import { useExerciseBodyParts } from "../../../hooks/useExerciseBodyParts";
import type { Exercise } from "../../../types";

interface ExerciseProfileBodyCardProps {
  exercise: Exercise;
  bodyDetailModal: DisclosureState;
}

export function ExerciseProfileBodyCard({
  exercise,
  bodyDetailModal,
}: ExerciseProfileBodyCardProps) {
  const bodyParts = useExerciseBodyParts(exercise.affectedZones);
  const zoneCount = bodyParts.length;
  const hasZones = zoneCount > 0;

  const uniqueZones = useMemo(() => {
    const unique = Array.from(new Set(exercise.affectedZones ?? []));
    return unique.sort(
      (a, b) => ALL_BODY_ZONES.indexOf(a) - ALL_BODY_ZONES.indexOf(b),
    );
  }, [exercise.affectedZones]);

  const legend = hasZones ? (
    <div className="flex flex-wrap justify-center gap-2 border-t border-neutral-200 pt-5">
      {uniqueZones.map((zone) => {
        const groupLabel = BODY_ZONE_TO_GROUP_LABEL[zone];
        const intent = BODY_ZONE_GROUP_INTENT[groupLabel] ?? "neutral";
        return (
          <Badge
            key={zone}
            variant="dot"
            intent={intent}
            size="md"
            title={groupLabel}
            className="text-neutral-800"
          >
            {BODY_ZONE_LABELS[zone]}
          </Badge>
        );
      })}
    </div>
  ) : undefined;

  return (
    <>
      <Card surface="panel" padding="lg">
        <button
          type="button"
          onClick={bodyDetailModal.open}
          disabled={!hasZones}
          className="group flex w-full flex-col gap-4 text-left disabled:cursor-default"
        >
          <div className="flex items-center justify-between gap-2">
            <h6 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Zonas afectadas
            </h6>
            {hasZones ? (
              <span className="text-xs text-neutral-400 transition-colors group-hover:text-neutral-600">
                Ver detalle →
              </span>
            ) : (
              <span className="text-xs text-neutral-400">Sin datos</span>
            )}
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 transition-colors group-hover:border-neutral-300">
            <div className="flex items-end justify-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-semibold tracking-wider text-neutral-400 uppercase">
                  Frontal
                </span>
                <Body
                  data={bodyParts}
                  side="front"
                  scale={0.55}
                  defaultFill={BODY_PREVIEW_FILL}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-semibold tracking-wider text-neutral-400 uppercase">
                  Dorsal
                </span>
                <Body
                  data={bodyParts}
                  side="back"
                  scale={0.55}
                  defaultFill={BODY_PREVIEW_FILL}
                />
              </div>
            </div>

            {!hasZones && (
              <p className="text-center text-xs text-neutral-500">
                Sin zonas registradas
              </p>
            )}
          </div>
        </button>
      </Card>

      <BodyDetailModal
        open={bodyDetailModal.isOpen}
        onClose={bodyDetailModal.close}
        bodyParts={bodyParts}
        defaultFill={BODY_PREVIEW_FILL}
        subtitle={
          hasZones
            ? `${zoneCount} ${zoneCount === 1 ? "zona afectada" : "zonas afectadas"}`
            : undefined
        }
        getPathLabel={(slug: Slug) => BODY_ZONE_LABELS[slug as BodyZone]}
        legend={legend}
      />
    </>
  );
}

ExerciseProfileBodyCard.displayName = "ExerciseProfileBodyCard";
