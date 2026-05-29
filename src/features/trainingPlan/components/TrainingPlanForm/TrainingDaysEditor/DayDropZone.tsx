import type { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@shared/lib/cn";
import type { DayName } from "../../../constants";
import {
  DROP_TYPE,
  dayListId,
  type DayListDropData,
} from "../../../lib/trainingPlanDnd";

interface DayDropZoneProps {
  dayName: DayName;
  isDragging: boolean;
  activeDragType: "library-exercise" | "day-row" | null;
  isEmpty: boolean;
  children: ReactNode;
}

export function DayDropZone({
  dayName,
  isDragging,
  activeDragType,
  isEmpty,
  children,
}: DayDropZoneProps) {
  const data: DayListDropData = { type: DROP_TYPE.DAY_LIST, dayName };
  const { setNodeRef, isOver } = useDroppable({
    id: dayListId(dayName),
    data,
  });

  const isLibraryDrag = isDragging && activeDragType === "library-exercise";
  const showDropHint = isLibraryDrag && (isEmpty || isOver);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-xl transition-all",
        isOver &&
          "ring-2 ring-primary-400 ring-offset-2 ring-offset-neutral-50",
        showDropHint && !isOver && "ring-1 ring-dashed ring-primary-300",
      )}
    >
      {children}
    </div>
  );
}

DayDropZone.displayName = "DayDropZone";
