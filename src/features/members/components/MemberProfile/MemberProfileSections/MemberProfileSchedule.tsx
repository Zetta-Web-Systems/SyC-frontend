import { CalendarClock, History } from "lucide-react";
import { Button, Card, Pill } from "@shared/ui";
import {
  SCHEDULE_DAY_LABELS,
  formatSlotRange,
  type TimeSlot,
} from "@features/schedule";

interface MemberProfileScheduleProps {
  timeSlots?: TimeSlot[];
  onViewHistory: () => void;
}

export function MemberProfileSchedule({
  timeSlots,
  onViewHistory,
}: MemberProfileScheduleProps) {
  const slots = timeSlots ?? [];

  return (
    <Card surface="panel" padding="md" className="md:col-span-2">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
            Horarios
          </span>

          <Button
            variant="ghost"
            intent="neutral"
            size="sm"
            onClick={onViewHistory}
          >
            <History size={14} aria-hidden="true" />
            Ver historial
          </Button>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400">
            <CalendarClock size={16} aria-hidden="true" />
          </div>

          {slots.length > 0 ? (
            <ul className="flex flex-wrap gap-2 pt-1.5">
              {slots.map((slot) => (
                <li key={slot.id}>
                  <Pill size="md" intent="neutral">
                    {SCHEDULE_DAY_LABELS[slot.dayOfWeek]}{" "}
                    {formatSlotRange(slot.startTime, slot.endTime)}
                  </Pill>
                </li>
              ))}
            </ul>
          ) : (
            <span className="py-1.5 text-sm italic text-neutral-400">
              Sin horarios asignados
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

MemberProfileSchedule.displayName = "MemberProfileSchedule";
