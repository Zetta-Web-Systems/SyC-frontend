import { useDroppable } from "@dnd-kit/core";
import { Badge, Pill } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import {
  SLOT_STATUS_INTENT,
  SLOT_STATUS_TINT,
  SLOT_TAG_TINT,
  type SlotStatus,
  type SlotTag,
} from "../../../constants";
import type { SlotActions } from "../../../hooks/useSlotActions";
import type { TurnActions } from "../../../hooks/useTurnActions";
import {
  DROP_TYPE,
  slotDropId,
  type SlotDropData,
} from "../../../lib/scheduleDnd";
import type { ScheduleSearchMatches } from "../../../lib/scheduleSearch";
import type { SlotCellData, SlotRosterEntry } from "../../../types";
import { CellMenu } from "./CellMenu";
import { TurnChip } from "./TurnChip";

interface SlotTagPillProps {
  tag: SlotTag;
  className?: string;
}

function SlotTagPill({ tag, className }: SlotTagPillProps) {
  return (
    <Pill
      size="xs"
      uppercase
      intent="neutral"
      className={cn("shrink-0", SLOT_TAG_TINT[tag], className)}
    >
      {tag}
    </Pill>
  );
}

interface SlotCountBadgeProps {
  label: string;
  assigned: number;
  capacity: number;
  status: SlotStatus;
  isExpanded: boolean;
  onToggle: () => void;
}

function SlotCountBadge({
  label,
  assigned,
  capacity,
  status,
  isExpanded,
  onToggle,
}: SlotCountBadgeProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isExpanded}
      aria-label={`${label}: ${assigned} de ${capacity} lugares ocupados. ${
        isExpanded ? "Ocultar" : "Ver"
      } alumnos`}
      className={cn(
        "absolute z-10 rounded-full transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1",
        isExpanded
          ? "top-2 left-[calc(100%-2rem)] -translate-x-full translate-y-0"
          : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      )}
    >
      <Badge
        variant="dot"
        intent={SLOT_STATUS_INTENT[status]}
        size="sm"
        className={cn(
          "transition-all duration-200 ease-out",
          SLOT_STATUS_TINT[status],
          isExpanded
            ? "px-2 py-1 text-[11px] font-bold"
            : "px-3 py-2 text-base font-extrabold",
        )}
      >
        {assigned}/{capacity}
      </Badge>
    </button>
  );
}

interface SlotRosterProps {
  roster: SlotRosterEntry[];
  isExpanded: boolean;
  actions: TurnActions;
  matches: ScheduleSearchMatches;
}

function SlotRoster({ roster, isExpanded, actions, matches }: SlotRosterProps) {
  return (
    <div
      inert={!isExpanded}
      className={cn(
        "flex flex-wrap gap-1.5 overflow-hidden transition-all duration-200 ease-out",
        isExpanded ? "max-h-80 opacity-100" : "max-h-0 opacity-0",
      )}
    >
      {roster.map((entry) => (
        <TurnChip
          key={entry.turn.id}
          entry={entry}
          actions={actions}
          isHighlighted={matches.turnIds.has(entry.turn.id)}
        />
      ))}
    </div>
  );
}

interface SlotCellProps {
  cell: SlotCellData;
  label: string;
  isExpanded: boolean;
  onToggle: (slotId: string) => void;
  actions: TurnActions;
  slotActions: SlotActions;
  isDragging: boolean;
  matches: ScheduleSearchMatches;
}

export function SlotCell({
  cell,
  label,
  isExpanded,
  onToggle,
  actions,
  slotActions,
  isDragging,
  matches,
}: SlotCellProps) {
  const data: SlotDropData = {
    type: DROP_TYPE.SLOT,
    slotId: cell.slot.id,
    date: cell.date,
    label,
  };

  const { setNodeRef, isOver } = useDroppable({
    id: slotDropId(cell.slot.id, cell.date),
    data,
  });

  const isMatch = matches.isActive && matches.slotIds.has(cell.slot.id);
  const showRoster = isExpanded || isMatch;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "group/cell relative h-full w-full rounded-xl border border-neutral-200 bg-white px-2.5 pb-3 transition-all hover:border-neutral-300",
        showRoster ? "min-h-21 pt-10" : "min-h-16 pt-7",
        isDragging && !isOver && "border-dashed border-primary-300",
        isMatch && "border-primary-400 ring-2 ring-primary-200",
        isOver &&
          "border-transparent bg-primary-50 ring-2 ring-primary-400 ring-offset-2 ring-offset-neutral-50",
      )}
    >
      {cell.slot.tag && (
        <SlotTagPill tag={cell.slot.tag} className="absolute top-2 left-2" />
      )}

      <CellMenu cell={cell} actions={slotActions} />

      <SlotCountBadge
        label={label}
        assigned={cell.roster.length}
        capacity={cell.slot.capacity}
        status={cell.status}
        isExpanded={showRoster}
        onToggle={() => onToggle(cell.slot.id)}
      />

      <SlotRoster
        roster={cell.roster}
        isExpanded={showRoster}
        actions={actions}
        matches={matches}
      />
    </div>
  );
}

SlotCell.displayName = "SlotCell";
