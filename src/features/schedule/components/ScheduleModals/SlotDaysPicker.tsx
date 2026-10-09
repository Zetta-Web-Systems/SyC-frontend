import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import { Pill } from "@shared/ui";
import {
  SCHEDULE_DAY_LABELS,
  SCHEDULE_DAY_SHORT_LABELS,
  SCHEDULE_DAYS,
  type ScheduleDay,
} from "../../constants";

interface SlotDaysPickerProps {
  id: string;
  value: ScheduleDay[];
  conflictingDays: ReadonlySet<ScheduleDay>;
  onChange: (days: ScheduleDay[]) => void;
  onBlur: () => void;
  error?: boolean;
  describedBy?: string;
}

export function SlotDaysPicker({
  id,
  value,
  conflictingDays,
  onChange,
  onBlur,
  error,
  describedBy,
}: SlotDaysPickerProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const labels = isMobile ? SCHEDULE_DAY_SHORT_LABELS : SCHEDULE_DAY_LABELS;

  function toggle(day: ScheduleDay) {
    onChange(
      value.includes(day)
        ? value.filter((selected) => selected !== day)
        : SCHEDULE_DAYS.filter(
            (candidate) => candidate === day || value.includes(candidate),
          ),
    );
  }

  return (
    <div
      id={id}
      role="group"
      aria-label="Días de la semana"
      aria-invalid={error || undefined}
      aria-describedby={describedBy}
      data-invalid={error ? "true" : undefined}
      className="flex flex-wrap gap-1.5"
    >
      {SCHEDULE_DAYS.map((day) => {
        const isSelected = value.includes(day);
        const hasConflict = isSelected && conflictingDays.has(day);

        return (
          <Pill
            key={day}
            interactive
            size="md"
            intent={hasConflict ? "danger" : "primary"}
            selected={isSelected}
            aria-label={SCHEDULE_DAY_LABELS[day]}
            onClick={() => toggle(day)}
            onBlur={onBlur}
          >
            {labels[day]}
          </Pill>
        );
      })}
    </div>
  );
}

SlotDaysPicker.displayName = "SlotDaysPicker";
