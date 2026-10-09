import type { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Plus, TriangleAlert } from "lucide-react";
import { Badge, Button } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import {
  OPEN_CELL_ACTION,
  OPEN_CELL_FRAME,
  OPEN_CELL_TONE,
  SCHEDULE_DAY_LABELS,
  SLOT_TAG_COLORS,
} from "../../../constants";
import type { SlotActions } from "../../../hooks/useSlotActions";
import type { TurnActions } from "../../../hooks/useTurnActions";
import {
  DROP_TYPE,
  rejectDropId,
  type RejectDropData,
} from "../../../lib/scheduleDnd";
import type { ScheduleSearchMatches } from "../../../lib/scheduleSearch";
import { formatSlotTime } from "../../../lib/slotStatus";
import type {
  BlockCellData,
  ScheduleCellData,
  UnavailableCellData,
} from "../../../types";
import { CellMenu } from "./CellMenu";
import { SlotCell } from "./SlotCell";

interface RejectDropZoneProps {
  cellId: string;
  label: string;
  reason: string;
  children: ReactNode;
}

function RejectDropZone({
  cellId,
  label,
  reason,
  children,
}: RejectDropZoneProps) {
  const data: RejectDropData = { type: DROP_TYPE.REJECT, reason, label };

  const { setNodeRef, isOver } = useDroppable({
    id: rejectDropId(cellId),
    data,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "group/cell relative h-full w-full rounded-xl transition-all",
        isOver && "ring-2 ring-error/60 ring-offset-2 ring-offset-neutral-50",
      )}
    >
      {children}
    </div>
  );
}

interface ClosedCellProps {
  label: string;
  detail?: string | null;
  badge?: ReactNode;
}

function ClosedCell({ label, detail, badge }: ClosedCellProps) {
  return (
    <div
      title={detail ?? undefined}
      className="bg-stripes-neutral relative flex h-full min-h-16 items-center justify-center rounded-xl border border-neutral-200 text-[11.5px] font-bold tracking-wide text-neutral-400 uppercase"
    >
      {badge && <span className="absolute top-2 left-2">{badge}</span>}
      {label}
    </div>
  );
}

interface EmptyCellProps {
  cell: UnavailableCellData;
  label: string;
  onOpen: (cell: UnavailableCellData) => void;
}

function EmptyCell({ cell, label, onOpen }: EmptyCellProps) {
  if (!cell.canOpen) {
    return (
      <div className="h-full min-h-16 rounded-xl border border-dashed border-neutral-200" />
    );
  }

  const hasConflicts = cell.conflicts.length > 0;
  const tone = hasConflicts ? OPEN_CELL_TONE.CONFLICT : OPEN_CELL_TONE.NEUTRAL;

  return (
    <div
      className={cn(
        "flex h-full min-h-16 items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50/40 transition-all duration-150",
        OPEN_CELL_FRAME[tone],
      )}
    >
      <Button
        variant="ghost"
        intent="neutral"
        size="sm"
        aria-label={`Abrir ${label}`}
        title={
          hasConflicts ? "Ese día ya tiene otro horario a esa hora" : undefined
        }
        onClick={() => onOpen(cell)}
        className={cn(
          "gap-1.5 px-2.5 opacity-70 duration-150 group-hover/cell:scale-105 group-hover/cell:bg-white group-hover/cell:opacity-100 group-hover/cell:shadow-sm focus-visible:opacity-100",
          OPEN_CELL_ACTION[tone],
        )}
      >
        {hasConflicts ? (
          <TriangleAlert size={14} aria-hidden="true" />
        ) : (
          <Plus size={14} aria-hidden="true" />
        )}
        Abrir
      </Button>
    </div>
  );
}

interface BlockCellProps {
  cell: BlockCellData;
}

function BlockCell({ cell }: BlockCellProps) {
  const { tag } = cell.slot;

  return (
    <div
      className={cn(
        "relative flex h-full min-h-16 flex-col items-center justify-center gap-0.5 rounded-xl text-[11.5px] font-bold tracking-wide text-white uppercase",
        tag ? SLOT_TAG_COLORS[tag] : "bg-secondary-500",
      )}
    >
      {tag ?? "No asignable"}
      <small className="text-[10px] font-semibold normal-case opacity-85">
        {formatSlotTime(cell.startTime)} hs
      </small>
    </div>
  );
}

interface ScheduleCellProps {
  cell: ScheduleCellData;
  isExpanded: boolean;
  onToggle: (slotId: string) => void;
  actions: TurnActions;
  slotActions: SlotActions;
  isDragging: boolean;
  matches: ScheduleSearchMatches;
}

export function ScheduleCell({
  cell,
  isExpanded,
  onToggle,
  actions,
  slotActions,
  isDragging,
  matches,
}: ScheduleCellProps) {
  const label = `${SCHEDULE_DAY_LABELS[cell.dayOfWeek]} ${formatSlotTime(cell.startTime)}`;

  if (cell.kind === "slot") {
    return (
      <SlotCell
        cell={cell}
        label={label}
        isExpanded={isExpanded}
        onToggle={onToggle}
        actions={actions}
        slotActions={slotActions}
        isDragging={isDragging}
        matches={matches}
      />
    );
  }

  switch (cell.kind) {
    case "block":
      return (
        <RejectDropZone
          cellId={cell.id}
          label={label}
          reason={`Ese horario está reservado para ${cell.slot.tag ?? "otra actividad"}.`}
        >
          <BlockCell cell={cell} />
          <CellMenu cell={cell} actions={slotActions} onColor />
        </RejectDropZone>
      );

    case "closed":
      return (
        <RejectDropZone
          cellId={cell.id}
          label={label}
          reason={`Ese día está cerrado por ${cell.closure.type.toLowerCase()}.`}
        >
          <ClosedCell
            label="Cerrado"
            detail={cell.closure.reason}
            badge={
              <Badge variant="solid" intent="info" size="sm">
                {cell.closure.type}
              </Badge>
            }
          />
          <CellMenu cell={cell} actions={slotActions} />
        </RejectDropZone>
      );

    case "blocked":
      return (
        <RejectDropZone
          cellId={cell.id}
          label={label}
          reason={
            cell.override.reason ?? "Ese horario está bloqueado para esa fecha."
          }
        >
          <ClosedCell
            label="Sin turno"
            detail={cell.override.reason}
            badge={
              <Badge variant="solid" intent="warning" size="sm">
                Bloqueado
              </Badge>
            }
          />
          <CellMenu cell={cell} actions={slotActions} />
        </RejectDropZone>
      );

    case "unavailable":
      return (
        <RejectDropZone
          cellId={cell.id}
          label={label}
          reason={
            cell.conflicts.length > 0
              ? "Ese día tiene otro horario a esa hora."
              : "Ese día no tiene turno a esa hora."
          }
        >
          <EmptyCell cell={cell} label={label} onOpen={slotActions.open} />
        </RejectDropZone>
      );
  }
}

ScheduleCell.displayName = "ScheduleCell";
