import { useNavigate } from "@tanstack/react-router";
import { RotateCcw, UserRound } from "lucide-react";
import {
  AnchoredPopover,
  PopoverHeader,
  PopoverItem,
  PopoverSeparator,
  useAnchoredPopover,
} from "@shared/ui";
import { formatDayMonth } from "@shared/utils/date.utils";
import type { MemberSimple } from "@features/members";
import type { TurnActions } from "../../../hooks/useTurnActions";
import {
  formatMemberFullName,
  formatMemberShortName,
} from "../../../lib/memberDisplay";
import type { RecoveryTurn } from "../../../types";
import { MemberChip } from "../../common";

const RECOVERY_MENU_WIDTH = 236;
const RECOVERY_MENU_HEIGHT = 176;

interface RecoveryChipMenuProps {
  member: MemberSimple;
  date: string;
  onRemove: () => void;
  onClose: () => void;
}

function RecoveryChipMenu({
  member,
  date,
  onRemove,
  onClose,
}: RecoveryChipMenuProps) {
  const navigate = useNavigate();

  function run(action: () => void) {
    onClose();
    action();
  }

  return (
    <>
      <PopoverHeader
        title={formatMemberFullName(member)}
        description={`Recupera el ${formatDayMonth(date)}`}
      />

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

      <PopoverSeparator />

      <PopoverItem
        icon={<RotateCcw />}
        variant="danger"
        onClick={() => run(onRemove)}
      >
        Quitar recuperación
      </PopoverItem>
    </>
  );
}

interface RecoveryChipProps {
  recovery: RecoveryTurn;
  actions: TurnActions;
  isHighlighted?: boolean;
}

/**
 * INFO: A diferencia del TurnChip no es arrastrable.
 */
export function RecoveryChip({
  recovery,
  actions,
  isHighlighted = false,
}: RecoveryChipProps) {
  const { anchorRef, position, isOpen, toggle, close } =
    useAnchoredPopover<HTMLButtonElement>({
      width: RECOVERY_MENU_WIDTH,
      estimatedHeight: RECOVERY_MENU_HEIGHT,
    });

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Acciones de la recuperación de ${formatMemberShortName(recovery.member)}`}
        className="cursor-pointer rounded-full focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none"
      >
        <MemberChip
          member={recovery.member}
          isRecovery
          isHighlighted={isHighlighted}
        />
      </button>

      <AnchoredPopover
        position={position}
        anchorRef={anchorRef}
        onClose={close}
      >
        <RecoveryChipMenu
          member={recovery.member}
          date={recovery.date}
          onRemove={() => actions.removeRecovery(recovery)}
          onClose={close}
        />
      </AnchoredPopover>
    </>
  );
}

RecoveryChip.displayName = "RecoveryChip";
