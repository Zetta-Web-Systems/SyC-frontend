import { Card } from "@shared/ui";
import { Body } from "@shared/components/BodyHighlighter";
import { BodyDetailModal } from "@shared/components/BodyDetailModal";
import { BODY_PREVIEW_FILL } from "@features/clinicalProfiles";
import { BODY_ZONE_LABELS } from "@shared/constants/bodyZones";
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

  return (
    <>
      <Card className="rounded-xl border border-neutral-200 bg-white p-5">
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
      />
    </>
  );
}

ExerciseProfileBodyCard.displayName = "ExerciseProfileBodyCard";
