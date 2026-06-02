import { useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import { IconBox } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import type { DayName } from "../../../../constants";
import {
  DROP_TYPE,
  dayTabId,
  type DayTabDropData,
} from "../../../../lib/trainingPlanDnd";
import { DaySelector } from "./DaySelector";

const AUTO_ACTIVATE_MS = 400;

interface DayTabProps {
  index: number;
  dayName: DayName;
  exerciseCount: number;
  isActive: boolean;
  usedDayNames: ReadonlySet<DayName>;
  acceptsDrop: boolean;
  hasError?: boolean;
  onActivate: () => void;
  onRename: (next: DayName) => void;
}

export function DayTab({
  index,
  dayName,
  exerciseCount,
  isActive,
  usedDayNames,
  acceptsDrop,
  hasError = false,
  onActivate,
  onRename,
}: DayTabProps) {
  const data: DayTabDropData = { type: DROP_TYPE.DAY_TAB, dayName };
  const { setNodeRef, isOver, active } = useDroppable({
    id: dayTabId(dayName),
    data,
    disabled: !acceptsDrop,
  });

  const isDragActive = acceptsDrop && active !== null;
  const shouldHighlight = isDragActive && isOver;

  useEffect(() => {
    if (!shouldHighlight || isActive) return;
    const t = window.setTimeout(() => {
      onActivate();
    }, AUTO_ACTIVATE_MS);
    return () => window.clearTimeout(t);
  }, [shouldHighlight, isActive, onActivate]);

  return (
    <div
      ref={setNodeRef}
      role="tab"
      aria-selected={isActive}
      aria-invalid={hasError || undefined}
      data-invalid={hasError ? "true" : undefined}
      onClick={(e) => {
        if (e.target === e.currentTarget) onActivate();
      }}
      className={cn(
        "-mb-px flex items-center gap-1.5 border-b-2 px-2 py-2 transition-colors sm:gap-2 sm:px-3",
        shouldHighlight
          ? "border-primary-500 bg-primary-50"
          : isActive
            ? "border-primary-500"
            : "border-transparent hover:border-neutral-200",
        isDragActive && !isActive && "ring-1 ring-dashed ring-primary-200",
        hasError && !shouldHighlight && "border-error",
      )}
    >
      <button
        type="button"
        onClick={onActivate}
        aria-label={`Activar día ${index}`}
        className="relative inline-flex cursor-pointer"
      >
        <IconBox
          size="xs"
          shape="sm"
          tone={isActive ? "solid" : "soft"}
          intent={hasError ? "danger" : isActive ? "primary" : "neutral"}
          className="text-xs font-bold"
        >
          {index}
        </IconBox>
        {hasError && (
          <span
            aria-hidden="true"
            className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-error ring-2 ring-white"
          />
        )}
      </button>

      <DaySelector
        value={dayName}
        usedDayNames={usedDayNames}
        onChange={onRename}
      />

      <button
        type="button"
        onClick={onActivate}
        className="cursor-pointer text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-700"
      >
        <span aria-hidden="true" className="mr-1 text-neutral-300">
          ·
        </span>
        <span
          className={cn(
            "font-bold tabular-nums",
            isActive ? "text-primary-600" : "text-neutral-800",
          )}
        >
          {exerciseCount}
        </span>
        <span className="hidden xs:inline">
          {" "}
          {exerciseCount === 1 ? "ejercicio" : "ejercicios"}
        </span>
      </button>
    </div>
  );
}

DayTab.displayName = "DayTab";
