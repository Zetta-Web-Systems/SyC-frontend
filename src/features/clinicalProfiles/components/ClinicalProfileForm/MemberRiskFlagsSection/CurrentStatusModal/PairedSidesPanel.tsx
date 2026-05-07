import { useId } from "react";
import { Badge, Checkbox } from "@shared/ui";
import { useMirroredPairedSides } from "../../../../hooks/useMirroredPairedSides";
import { MovementPhaseField } from "../common/MovementPhaseField";
import { PainLevelField } from "../common/PainLevelField";
import { ZoneStatusSidePanel } from "./ZoneStatusSidePanel";

interface PairedSidesPanelProps {
  riskFlagIndex: number;
  leftStatusIndex: number;
  rightStatusIndex: number;
}

export function PairedSidesPanel({
  riskFlagIndex,
  leftStatusIndex,
  rightStatusIndex,
}: PairedSidesPanelProps) {
  const toggleId = useId();
  const { mirror, setMirror, leftPainPath, leftPhasePath } =
    useMirroredPairedSides({
      riskFlagIndex,
      leftStatusIndex,
      rightStatusIndex,
    });

  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor={toggleId}
        className="flex items-center gap-2 text-xs font-medium text-neutral-600"
      >
        <Checkbox
          id={toggleId}
          checked={mirror}
          onChange={(e) => setMirror(e.target.checked)}
        />
        Mismo dolor en ambos lados
      </label>

      {mirror ? (
        <div className="flex flex-col gap-3 rounded-md border border-neutral-200 bg-white p-3">
          <Badge size="sm" intent="info">
            Aplica a izquierda y derecha
          </Badge>
          <PainLevelField name={leftPainPath} />
          <MovementPhaseField name={leftPhasePath} />
        </div>
      ) : (
        <>
          <ZoneStatusSidePanel
            side="left"
            riskFlagIndex={riskFlagIndex}
            statusIndex={leftStatusIndex}
          />
          <ZoneStatusSidePanel
            side="right"
            riskFlagIndex={riskFlagIndex}
            statusIndex={rightStatusIndex}
          />
        </>
      )}
    </div>
  );
}

PairedSidesPanel.displayName = "PairedSidesPanel";
