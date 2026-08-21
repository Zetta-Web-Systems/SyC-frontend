import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { Badge, Card } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import {
  SLOT_STATUS,
  SLOT_STATUS_INTENT,
  SLOT_STATUS_LABELS,
  SLOT_STATUS_TINT,
  type SlotStatus,
} from "../../constants";

const STATUSES: SlotStatus[] = [
  SLOT_STATUS.AVAILABLE,
  SLOT_STATUS.LAST,
  SLOT_STATUS.FULL,
  SLOT_STATUS.OVER,
];

function LegendItem({ mark, children }: { mark: ReactNode; children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-medium">
      {mark}
      {children}
    </span>
  );
}

export function ScheduleLegend() {
  return (
    <Card
      surface="panel"
      className="flex flex-wrap gap-x-6 gap-y-2.5 px-4 py-3 text-[13px] text-neutral-500"
    >
      {STATUSES.map((status) => (
        <LegendItem
          key={status}
          mark={
            <Badge
              variant="dot"
              intent={SLOT_STATUS_INTENT[status]}
              size="sm"
              className={cn("px-2 py-1", SLOT_STATUS_TINT[status])}
            />
          }
        >
          {SLOT_STATUS_LABELS[status]}
        </LegendItem>
      ))}

      <LegendItem
        mark={
          <Lock size={14} aria-hidden="true" className="text-secondary-600" />
        }
      >
        Lugar guardado por la dueña
      </LegendItem>

      <LegendItem
        mark={
          <span
            aria-hidden="true"
            className="inline-block h-4 w-7 rounded-full border border-warning bg-warning/20"
          />
        }
      >
        Sobreturno autorizado
      </LegendItem>

      <LegendItem
        mark={
          <Badge variant="solid" intent="info" size="sm">
            Feriado
          </Badge>
        }
      >
        Día cerrado
      </LegendItem>
    </Card>
  );
}

ScheduleLegend.displayName = "ScheduleLegend";
