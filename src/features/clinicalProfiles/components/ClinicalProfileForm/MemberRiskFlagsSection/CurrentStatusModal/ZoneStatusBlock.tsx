import { Badge } from "@shared/ui";
import { BODY_ZONE_LABELS } from "@shared/constants/bodyZones";
import type { BodyLaterality } from "@shared/types/bodyZone.types";
import { cn } from "@shared/lib/cn";
import { SIDE_LABELS } from "../../../../constants";
import { memberRiskFlagPaths } from "../../../../lib/pathBuilders";
import type { ZoneStatusView } from "../../../../types";
import { MovementPhaseField } from "../common/MovementPhaseField";
import { PainLevelField } from "../common/PainLevelField";
import { ZoneStatusSidePanel } from "./ZoneStatusSidePanel";

interface ZoneStatusBlockProps {
  riskFlagIndex: number;
  view: ZoneStatusView;
  onAddSide: (side: BodyLaterality) => void;
  onRemoveStatus: (statusIndex: number) => void;
}

export function ZoneStatusBlock({
  riskFlagIndex,
  view,
  onAddSide,
  onRemoveStatus,
}: ZoneStatusBlockProps) {
  const {
    bodyZone,
    isPaired,
    isLegacy,
    leftStatusIndex,
    rightStatusIndex,
    singleStatusIndex,
  } = view;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-neutral-50/50 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-neutral-800">
          {BODY_ZONE_LABELS[bodyZone]}
        </span>
        {isLegacy && (
          <Badge size="sm" intent="warning">
            Zona removida de la bandera
          </Badge>
        )}
      </div>

      {isPaired ? (
        <>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-neutral-500">
              Lados afectados
            </span>
            <div className="flex flex-wrap gap-2">
              {(["left", "right"] as const).map((side) => {
                const statusIndex =
                  side === "left" ? leftStatusIndex : rightStatusIndex;
                const active = statusIndex !== undefined;
                return (
                  <button
                    key={side}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      active
                        ? onRemoveStatus(statusIndex as number)
                        : onAddSide(side)
                    }
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      active
                        ? "border-primary-600 bg-primary-600 text-white"
                        : "border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50",
                    )}
                  >
                    {SIDE_LABELS[side]}
                  </button>
                );
              })}
            </div>
          </div>

          {leftStatusIndex !== undefined && (
            <ZoneStatusSidePanel
              side="left"
              riskFlagIndex={riskFlagIndex}
              statusIndex={leftStatusIndex}
            />
          )}
          {rightStatusIndex !== undefined && (
            <ZoneStatusSidePanel
              side="right"
              riskFlagIndex={riskFlagIndex}
              statusIndex={rightStatusIndex}
            />
          )}
          {singleStatusIndex !== undefined &&
            leftStatusIndex === undefined &&
            rightStatusIndex === undefined && (
              <div className="flex flex-col gap-3 rounded-md border border-neutral-200 bg-white p-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Sin lateralidad
                </span>
                <PainLevelField
                  name={memberRiskFlagPaths.painLevel(
                    riskFlagIndex,
                    singleStatusIndex,
                  )}
                />
                <MovementPhaseField
                  name={memberRiskFlagPaths.movementPhase(
                    riskFlagIndex,
                    singleStatusIndex,
                  )}
                />
              </div>
            )}
        </>
      ) : (
        singleStatusIndex !== undefined && (
          <div className="flex flex-col gap-3">
            <PainLevelField
              name={memberRiskFlagPaths.painLevel(
                riskFlagIndex,
                singleStatusIndex,
              )}
            />
            <MovementPhaseField
              name={memberRiskFlagPaths.movementPhase(
                riskFlagIndex,
                singleStatusIndex,
              )}
            />
          </div>
        )
      )}
    </div>
  );
}

ZoneStatusBlock.displayName = "ZoneStatusBlock";
