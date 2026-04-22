import { useFormContext, useWatch } from "react-hook-form";
import { BODY_ZONE_LABELS } from "@shared/constants/bodyZones";
import { cn } from "@shared/lib/cn";
import { MAX_VISIBLE_ZONES, SIDE_LABELS } from "../../../../constants";
import { groupAndSortStatuses } from "../../../../lib/bodyZoneGrouping";
import { getPainTextClassByPhase } from "../../../../lib/painLevelStyles";
import { memberRiskFlagPaths } from "../../../../lib/pathBuilders";
import type { ClinicalProfileFormSchema } from "../../../../schemas/clinicalProfile.schema";
import { getPainLabel, getPainPhase } from "../common/painLevel";
import { PainRing } from "./PainRing";

type CurrentStatus = {
  painLevel: number;
  bodyZone: string;
  side?: string;
  movementPhase?: string;
};

interface StatusesByZoneProps {
  index: number;
}

export function StatusesByZone({ index }: StatusesByZoneProps) {
  const { control } = useFormContext<ClinicalProfileFormSchema>();
  const currentStatuses = useWatch({
    control,
    name: memberRiskFlagPaths.currentStatusPath(index),
  }) as CurrentStatus[] | undefined;

  const statuses = currentStatuses ?? [];
  if (statuses.length === 0) return null;

  const grouped = groupAndSortStatuses(statuses);
  const visible = grouped.slice(0, MAX_VISIBLE_ZONES);
  const remaining = grouped.length - visible.length;

  return (
    <div className="mt-4 flex flex-col gap-3">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
        Dolor por zona
      </span>

      <div className="flex flex-col gap-2">
        {visible.map(({ zone, items, maxPain }) => {
          const phase = getPainPhase(maxPain);

          return (
            <div
              key={zone}
              className="flex flex-col gap-1 rounded-lg bg-neutral-50 px-3 py-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-700">
                  {BODY_ZONE_LABELS[zone as keyof typeof BODY_ZONE_LABELS] ??
                    zone}
                </span>

                <span
                  className={cn(
                    "text-[11px] font-semibold",
                    getPainTextClassByPhase(phase),
                  )}
                >
                  {getPainLabel(maxPain)}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {items.map((status) => (
                  <div
                    key={`${status.bodyZone}-${status.side ?? "none"}-${status.movementPhase ?? "none"}`}
                    className="flex items-center gap-1.5 text-[11px] text-neutral-500"
                  >
                    <PainRing level={status.painLevel} size="sm" />
                    <span>
                      {status.side
                        ? SIDE_LABELS[status.side as keyof typeof SIDE_LABELS]
                        : "Sin lateralidad"}
                    </span>
                    {status.movementPhase && (
                      <span className="text-neutral-400">
                        · {status.movementPhase}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {remaining > 0 && (
        <span className="text-xs text-neutral-400 pl-1">
          +{remaining} zonas más
        </span>
      )}
    </div>
  );
}

StatusesByZone.displayName = "StatusesByZone";
