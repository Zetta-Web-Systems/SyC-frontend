import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { Badge, Popover } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import { TRAFFIC_LIGHT_TEXT } from "../../constants/trafficLight";
import type { AffectedCurrentStatus } from "../../lib/trafficLight";
import { AffectedZonesDetail } from "./AffectedZonesDetail";

interface TrainingPlanRiskIndicatorProps {
  affected: AffectedCurrentStatus[];
  className?: string;
}

export function TrainingPlanRiskIndicator({
  affected,
  className,
}: TrainingPlanRiskIndicatorProps) {
  const [open, setOpen] = useState(false);
  const label = `${TRAFFIC_LIGHT_TEXT.caution}: zonas con dolor`;

  return (
    <Popover
      open={open}
      onClose={() => setOpen(false)}
      side="bottom"
      align="start"
      trigger={
        <button
          type="button"
          aria-label={label}
          title={label}
          onClick={(e) => {
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className={cn("inline-flex shrink-0 cursor-pointer", className)}
        >
          <Badge
            intent="warning"
            size="md"
            className="border border-warning/30 font-semibold"
          >
            <TriangleAlert size={14} aria-hidden="true" />
            {TRAFFIC_LIGHT_TEXT.caution}
          </Badge>
        </button>
      }
    >
      <AffectedZonesDetail affected={affected} />
    </Popover>
  );
}

TrainingPlanRiskIndicator.displayName = "TrainingPlanRiskIndicator";
