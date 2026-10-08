import { useMemo } from "react";
import { CalendarRange } from "lucide-react";
import { Pill, SelectMenu, type SelectMenuOption } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import type { PlanDayPosition } from "../../../types";

function range(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i + 1);
}

interface DayWeekPickerProps {
  position: PlanDayPosition;
  weeks: number;
  daysPerWeek: number;
  dayLabel: string | null | undefined;
  suggested: { week: number; day: number | null } | null;
  onChange: (next: Partial<PlanDayPosition>) => void;
}

export function DayWeekPicker({
  position,
  weeks,
  daysPerWeek,
  dayLabel,
  suggested,
  onChange,
}: DayWeekPickerProps) {
  const { week, day } = position;

  const weekOptions = useMemo<SelectMenuOption<number>[]>(
    () =>
      range(weeks).map((n) => ({
        value: n,
        label: `Semana ${n}`,
        triggerLabel: `${n} de ${weeks}`,
        optionLabel:
          n === suggested?.week ? `Semana ${n} · le toca hoy` : `Semana ${n}`,
      })),
    [weeks, suggested?.week],
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div
        role="tablist"
        aria-label="Días del plan"
        className="flex flex-wrap items-center gap-2"
      >
        {range(daysPerWeek).map((n) => {
          const active = n === day;
          const isToday = suggested?.week === week && suggested.day === n;
          return (
            <Pill
              key={n}
              interactive
              selected={active}
              intent={active ? "primary" : "neutral"}
              size="md"
              shape="squared"
              role="tab"
              aria-selected={active}
              onClick={() => onChange({ day: n })}
              className="relative min-h-11 px-4"
            >
              Día {n}
              {active && dayLabel && (
                <span className="font-medium opacity-80">· {dayLabel}</span>
              )}
              {isToday && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1 -right-1 size-2.5 rounded-full bg-secondary-500 ring-2 ring-white"
                />
              )}
            </Pill>
          );
        })}
      </div>

      <SelectMenu<number>
        variant="unstyled"
        value={week}
        onChange={(next) => onChange({ week: next })}
        options={weekOptions}
        ariaLabel="Semana del plan"
        panelWidth="210px"
        renderTrigger={(selected) => (
          <>
            <CalendarRange
              size={14}
              className="text-neutral-400"
              aria-hidden="true"
            />
            <span className="font-medium text-neutral-500">Semana</span>
            <span className="font-semibold text-neutral-900">
              {selected?.triggerLabel ?? "—"}
            </span>
            {suggested?.week === week && (
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full bg-secondary-500 ring-2 ring-white"
              />
            )}
          </>
        )}
        triggerClassName={cn(
          "inline-flex min-h-11 items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-sm transition-all",
          "border-neutral-200 hover:border-neutral-300",
          "data-[state=open]:border-primary-500 data-[state=open]:shadow-[0_0_0_3px_rgba(75,93,180,0.10)]",
        )}
      />
    </div>
  );
}

DayWeekPicker.displayName = "DayWeekPicker";
