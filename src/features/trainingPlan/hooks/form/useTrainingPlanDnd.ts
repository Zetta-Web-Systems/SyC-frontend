import { useCallback, useState } from "react";
import {
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  pointerWithin,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { DayName } from "../../constants";
import {
  DRAG_TYPE,
  DROP_TYPE,
  type ActiveDragData,
  type DropData,
} from "../../lib/trainingPlanDnd";
import { useTrainingPlanFormHelpers } from "./useTrainingPlanFormHelpers";

const ACTIVATION_DISTANCE = 5;

interface UseTrainingPlanDndOptions {
  onActiveDayChange: (dayName: DayName) => void;
}

export function useTrainingPlanDnd({
  onActiveDayChange,
}: UseTrainingPlanDndOptions) {
  const { addExercise, reorderExercise } = useTrainingPlanFormHelpers();
  const [activeDrag, setActiveDrag] = useState<ActiveDragData | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: ACTIVATION_DISTANCE },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const collisionDetection = useCallback<CollisionDetection>((args) => {
    const activeData = args.active.data.current as ActiveDragData | undefined;
    if (activeData?.type === DRAG_TYPE.LIBRARY) {
      return pointerWithin(args);
    }
    return closestCorners(args);
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current as ActiveDragData | undefined;
    if (data) setActiveDrag(data);
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveDrag(null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDrag(null);
      const { active, over } = event;
      if (!over) return;

      const activeData = active.data.current as ActiveDragData | undefined;
      const overData = over.data.current as DropData | undefined;
      if (!activeData || !overData) return;

      if (activeData.type === DRAG_TYPE.LIBRARY) {
        const targetDay =
          overData.type === DROP_TYPE.DAY_TAB ||
          overData.type === DROP_TYPE.DAY_LIST ||
          overData.type === DROP_TYPE.ROW
            ? overData.dayName
            : null;
        if (!targetDay) return;
        addExercise(targetDay, { exercise: activeData.exercise });
        onActiveDayChange(targetDay);
        return;
      }

      if (activeData.type === DRAG_TYPE.ROW) {
        if (
          overData.type === DROP_TYPE.ROW &&
          overData.dayName === activeData.dayName
        ) {
          reorderExercise(activeData.dayName, activeData.order, overData.order);
        }
      }
    },
    [addExercise, reorderExercise, onActiveDayChange],
  );

  return {
    sensors,
    collisionDetection,
    activeDrag,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
}
