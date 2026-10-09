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
import { useMoveTurnMutation } from "../mutations/useMoveTurnMutation";
import { useRemoveTurnMutation } from "../mutations/useRemoveTurnMutation";

const ACTIVATION_DISTANCE = 5;

interface UseScheduleDndOptions {
  onDropIntoSlot: (slotId: string) => void;
}

export function useScheduleDnd({ onDropIntoSlot }: UseScheduleDndOptions) {
  const assignTurn = useAssignTurnMutation();
  const moveTurn = useMoveTurnMutation();
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
            dto: { timeSlotId: drop.slotId, memberId: drag.member.id },
            memberName: formatMemberFullName(drag.member),
          });
          onDropIntoSlot(drop.slotId);
          return;
        }

        if (drag.slotId === drop.slotId) return;

        moveTurn.mutate({
          dto: {
            memberTurnId: drag.turnId,
            memberId: drag.member.id,
            timeSlotId: drop.slotId,
          },
          memberName: formatMemberFullName(drag.member),
        });
        onDropIntoSlot(drop.slotId);
        return;
      }

      if (drag.type === DRAG_TYPE.TURN) {
        removeTurn.mutate({
          turnId: drag.turnId,
          memberId: drag.member.id,
          memberName: formatMemberFullName(drag.member),
        });
      }
    },
    [assignTurn, moveTurn, removeTurn, onDropIntoSlot],
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
