import { Plus } from "lucide-react";
import { Button } from "@shared/ui";
import type { DayName } from "../../../../constants";
import { isWeekFull } from "../../../../lib/dayOrder";
import { useTrainingPlanFormHelpers } from "../../../../hooks/form/useTrainingPlanFormHelpers";
import { useTrainingPlanFormErrors } from "../../../../hooks/form/useTrainingPlanFormErrors";
import { DayTab } from "./DayTab";

interface DayTabsProps {
  activeDayName: DayName | null;
  onSelectDay: (dayName: DayName) => void;
  onAddDay: () => void;
  acceptsDrop: boolean;
}

export function DayTabs({
  activeDayName,
  onSelectDay,
  onAddDay,
  acceptsDrop,
}: DayTabsProps) {
  const { sortedDays, usedDayNames, changeDayName } =
    useTrainingPlanFormHelpers();
  const { byDay } = useTrainingPlanFormErrors();

  const used = new Set<DayName>(usedDayNames);
  const weekFull = isWeekFull(usedDayNames);

  function handleRenameDay(current: DayName, next: DayName) {
    changeDayName(current, next);
    onSelectDay(next);
  }

  return (
    <div
      role="tablist"
      aria-label="Días de entrenamiento"
      className="flex flex-wrap items-center gap-1.5 border-b border-neutral-200 bg-white px-2.5 pt-2 sm:px-4 sm:pt-2.5"
    >
      {sortedDays.map((day, i) => (
        <DayTab
          key={day.dayName}
          index={i + 1}
          dayName={day.dayName}
          exerciseCount={day.plannedExercises.length}
          isActive={day.dayName === activeDayName}
          usedDayNames={used}
          acceptsDrop={acceptsDrop}
          hasError={byDay.has(day.dayName)}
          onActivate={() => onSelectDay(day.dayName)}
          onRename={(next) => handleRenameDay(day.dayName, next)}
        />
      ))}

      <Button
        variant="ghost"
        intent="primary"
        size="sm"
        onClick={onAddDay}
        disabled={weekFull}
        title={weekFull ? "Ya están los 7 días" : "Agregar día"}
        className="ml-1"
      >
        <Plus size={14} aria-hidden="true" />{" "}
        <span className="hidden xs:inline">Agregar día</span>
      </Button>
    </div>
  );
}

DayTabs.displayName = "DayTabs";
