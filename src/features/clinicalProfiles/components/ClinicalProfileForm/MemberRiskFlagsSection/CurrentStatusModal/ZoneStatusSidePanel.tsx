import type { BodyLaterality } from "@shared/types/bodyZone.types";
import { SIDE_LABELS } from "../../../../constants";
import { memberRiskFlagPaths } from "../../../../lib/pathBuilders";
import { MovementPhaseField } from "../common/MovementPhaseField";
import { PainLevelField } from "../common/PainLevelField";

interface ZoneStatusSidePanelProps {
  side: BodyLaterality;
  riskFlagIndex: number;
  statusIndex: number;
}

export function ZoneStatusSidePanel({
  side,
  riskFlagIndex,
  statusIndex,
}: ZoneStatusSidePanelProps) {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-neutral-200 bg-white p-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {SIDE_LABELS[side]}
      </span>
      <PainLevelField
        name={memberRiskFlagPaths.painLevel(riskFlagIndex, statusIndex)}
      />
      <MovementPhaseField
        name={memberRiskFlagPaths.movementPhase(riskFlagIndex, statusIndex)}
      />
    </div>
  );
}

ZoneStatusSidePanel.displayName = "ZoneStatusSidePanel";
