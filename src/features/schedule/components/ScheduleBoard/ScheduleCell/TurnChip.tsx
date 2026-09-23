import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useDraggable } from "@dnd-kit/core";
import {
  CalendarSearch,
  Lock,
  LockOpen,
  RotateCcw,
  UserRound,
  UserRoundMinus,
} from "lucide-react";
import {
  AnchoredPopover,
  PopoverHeader,
  PopoverItem,
  PopoverSeparator,
  useAnchoredPopover,
} from "@shared/ui";
import { cn } from "@shared/lib/cn";
import type { MemberSimple } from "@features/members";
import type { TurnActions } from "../../../hooks/useTurnActions";
import {
  formatMemberFullName,
  formatMemberShortName,
} from "../../../lib/memberDisplay";
import {
  DRAG_TYPE,
  turnDragId,
  type TurnDragData,
} from "../../../lib/scheduleDnd";
import type { MemberTurn } from "../../../types";
import { MemberChip } from "../../common";

const TURN_MENU_WIDTH = 236;
const TURN_MENU_HEIGHT = 320;

interface TurnChipMenuProps {
  member: MemberSimple;
  isHeld: boolean;
  onShowSlots: () => void;
  onToggleHold: () => void;
  onMarkRecovery: () => void;
  onRemove: () => void;
  onClose: () => void;
}

function TurnChipMenu({
  member,
  isHeld,
  onShowSlots,
  onToggleHold,
  onMarkRecovery,
  onRemove,
  onClose,
}: TurnChipMenuProps) {
  const navigate = useNavigate();

  function run(action: () => void) {
    onClose();
    action();
  }

  return (
    <>
      <PopoverHeader title={formatMemberFullName(member)} />

      <PopoverSeparator />

      <PopoverItem
        icon={<UserRound />}
        iconTone="primary"
        onClick={() =>
          run(
            () =>
              void navigate({
                to: "/members/profile/$memberId",
                params: { memberId: member.id },
              }),
          )
        }
      >
        Ver ficha
      </PopoverItem>

      <PopoverItem
        icon={<CalendarSearch />}
        iconTone="secondary"
        onClick={() => run(onShowSlots)}
      >
        Mostrar horarios
      </PopoverItem>

      <PopoverSeparator />

      <PopoverItem
        icon={isHeld ? <LockOpen /> : <Lock />}
        iconTone={"danger"}
        description={
          isHeld
            ? "El lugar vuelve a estar disponible"
            : "Nadie más puede ocupar su lugar"
        }
        onClick={() => run(onToggleHold)}
      >
        {isHeld ? "Dejar de guardar el lugar" : "Guardar el lugar"}
      </PopoverItem>

      <PopoverItem
        icon={<RotateCcw />}
        iconTone="success"
        description="Anotarlo como recuperación en otro turno"
        onClick={() => run(onMarkRecovery)}
      >
        Recuperar en otro turno
      </PopoverItem>

      <PopoverSeparator />

      <PopoverItem
        icon={<UserRoundMinus />}
        variant="danger"
        onClick={() => run(onRemove)}
      >
        Quitar del turno
      </PopoverItem>
    </>
  );
}

interface TurnChipProps {
  turn: MemberTurn;
  isOverturn: boolean;
  actions: TurnActions;
  isHighlighted?: boolean;
}

export function TurnChip({
  turn,
  isOverturn,
  actions,
  isHighlighted = false,
}: TurnChipProps) {
  const { anchorRef, position, isOpen, toggle, close } =
    useAnchoredPopover<HTMLButtonElement>({
      width: TURN_MENU_WIDTH,
      estimatedHeight: TURN_MENU_HEIGHT,
    });

  const data: TurnDragData = {
    type: DRAG_TYPE.TURN,
    turnId: turn.id,
    slotId: turn.timeSlotId,
    member: turn.member,
    isHeld: turn.onHold,
  };

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: turnDragId(turn.id),
    data,
  });

  const setRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      setNodeRef(node);
      anchorRef.current = node;
    },
    [setNodeRef, anchorRef],
  );

  return (
    <>
      <button
        ref={setRefs}
        type="button"
        {...attributes}
        {...listeners}
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Acciones de ${formatMemberShortName(turn.member)}`}
        className={cn(
          "rounded-full transition-opacity focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none",
          isDragging ? "cursor-grabbing opacity-40" : "cursor-grab",
        )}
      >
        <MemberChip
          member={turn.member}
          isHeld={turn.onHold}
          isOverturn={isOverturn}
          isHighlighted={isHighlighted}
        />
      </button>

      <AnchoredPopover
        position={position}
        anchorRef={anchorRef}
        onClose={close}
      >
        <TurnChipMenu
          member={turn.member}
          isHeld={turn.onHold}
          onShowSlots={() => actions.showSlots(turn.member)}
          onToggleHold={() => actions.toggleHold(turn)}
          onMarkRecovery={() => actions.markRecovery(turn.member)}
          onRemove={() => actions.remove(turn)}
          onClose={close}
        />
      </AnchoredPopover>
    </>
  );
}

TurnChip.displayName = "TurnChip";
