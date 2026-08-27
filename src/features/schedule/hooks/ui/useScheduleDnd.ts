import { useCallback, useState } from "react";
import {
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { toast } from "@shared/stores/toast.store";
import {
  DRAG_TYPE,
  DROP_TYPE,
  type ActiveDragData,
  type DropData,
} from "../../lib/scheduleDnd";
import { formatMemberFullName } from "../../lib/memberDisplay";
import { useAssignTurnMutation } from "../mutations/useAssignTurnMutation";
import { useRemoveTurnMutation } from "../mutations/useRemoveTurnMutation";

const ACTIVATION_DISTANCE = 5;

interface UseScheduleDndOptions {
  onDropIntoSlot: (slotId: string) => void;
}

export function useScheduleDnd({ onDropIntoSlot }: UseScheduleDndOptions) {
  const assignTurn = useAssignTurnMutation();
  const removeTurn = useRemoveTurnMutation();

  const [activeDrag, setActiveDrag] = useState<ActiveDragData | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: ACTIVATION_DISTANCE },
    }),
    useSensor(KeyboardSensor, {
      keyboardCodes: { start: ["Space"], cancel: ["Escape"], end: ["Space"] },
    }),
  );

  const collisionDetection = useCallback<CollisionDetection>((args) => {
    const pointerCollisions = pointerWithin(args);
    return pointerCollisions.length > 0
      ? pointerCollisions
      : rectIntersection(args);
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

      const drag = active.data.current as ActiveDragData | undefined;
      const drop = over.data.current as DropData | undefined;
      if (!drag || !drop) return;

      if (drop.type === DROP_TYPE.REJECT) {
        toast.warning("No es posible anotar en este horario", {
          description: drop.reason,
        });
        return;
      }

      if (drop.type === DROP_TYPE.SLOT) {
        if (drag.type === DRAG_TYPE.UNASSIGNED) {
          assignTurn.mutate({
            timeSlotId: drop.slotId,
            memberId: drag.member.id,
          });
          onDropIntoSlot(drop.slotId);
          return;
        }

        if (drag.slotId === drop.slotId) return;

        toast.warning("No es posible mover el turno entre horarios", {
          description:
            "Para reasignarlo, primero hay que quitar al alumno del horario actual y luego anotarlo en el nuevo.",
        });
        return;
      }

      if (drag.type === DRAG_TYPE.TURN) {
        removeTurn.mutate({
          turnId: drag.turnId,
          memberName: formatMemberFullName(drag.member),
        });
      }
    },
    [assignTurn, removeTurn, onDropIntoSlot],
  );

  return {
    sensors,
    collisionDetection,
    activeDrag,
    isDragging: activeDrag !== null,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
}
