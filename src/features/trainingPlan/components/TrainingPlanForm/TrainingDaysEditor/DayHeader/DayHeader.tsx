import { Copy, Trash2 } from "lucide-react";
import { Button, InlineEditField } from "@shared/ui";
import { confirm } from "@shared/stores/confirm.store";
import { useTrainingPlanFormHelpers } from "../../../../hooks/form/useTrainingPlanFormHelpers";
import { useTrainingPlanFormErrors } from "../../../../hooks/form/useTrainingPlanFormErrors";
import type { DayName } from "../../../../constants";

interface DayHeaderProps {
  activeDayName: DayName;
  onActiveChange: (next: DayName | null) => void;
}

export function DayHeader({ activeDayName, onActiveChange }: DayHeaderProps) {
  const { sortedDays, duplicateDay, removeDay, updateDayLabel, canAddDay } =
    useTrainingPlanFormHelpers();
  const { byDay } = useTrainingPlanFormErrors();
  const dayError = byDay.get(activeDayName)?.root;

  const sortedIndex = sortedDays.findIndex((d) => d.dayName === activeDayName);
  if (sortedIndex < 0) return null;
  const day = sortedDays[sortedIndex];
  const dayNumber = sortedIndex + 1;

  function handleDuplicate() {
    const created = duplicateDay(activeDayName);
    if (created) onActiveChange(created);
  }

  function handleRemove() {
    const exerciseCount = day.plannedExercises.length;
    const performRemove = () => {
      removeDay(activeDayName);
      const remaining = sortedDays.filter((d) => d.dayName !== activeDayName);
      const nextIndex = Math.max(0, sortedIndex - 1);
      onActiveChange(remaining[nextIndex]?.dayName ?? null);
    };

    if (exerciseCount === 0) {
      performRemove();
      return;
    }

    confirm({
      intent: "danger",
      title: "Eliminar día",
      description: `Este día tiene ${exerciseCount} ${exerciseCount === 1 ? "ejercicio" : "ejercicios"}. ¿Eliminar igualmente?`,
      confirmLabel: "Eliminar",
      onConfirm: performRemove,
    });
  }

  return (
    <div className="mb-2.5 flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-baseline gap-2.5">
          <h4 className="m-0 text-base font-bold whitespace-nowrap text-neutral-900">
            Día {dayNumber}
          </h4>
          <span className="font-medium text-neutral-400">·</span>
          <span className="min-w-0 flex-1 text-sm font-medium text-neutral-700">
            <InlineEditField
              type="text"
              appearance="seamless"
              value={day.trainingDayLabel ?? ""}
              onChange={(t) => updateDayLabel(activeDayName, t)}
              placeholder="Ingresa la descripción del día"
              maxLength={120}
              ariaLabel="Descripción del día"
            />
          </span>
        </div>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            intent="neutral"
            size="sm"
            onClick={handleDuplicate}
            disabled={!canAddDay}
            title={!canAddDay ? "Ya están los 7 días" : "Duplicar día"}
          >
            <Copy size={14} aria-hidden="true" />
            <span className="hidden xs:inline">Duplicar día</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            intent="danger"
            size="sm"
            onClick={handleRemove}
          >
            <Trash2 size={14} aria-hidden="true" />
            <span className="hidden xs:inline">Eliminar</span>
          </Button>
        </div>
      </div>
      {dayError && (
        <p role="alert" className="text-xs font-medium text-error">
          {dayError}
        </p>
      )}
    </div>
  );
}

DayHeader.displayName = "DayHeader";
