import type { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Badge } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import { SCHEDULE_DAY_LABELS } from "../../../constants";
import type { SlotActions } from "../../../hooks/useSlotActions";
import type { TurnActions } from "../../../hooks/useTurnActions";
import {
  DROP_TYPE,
  rejectDropId,
  type RejectDropData,
} from "../../../lib/scheduleDnd";
import type { ScheduleSearchMatches } from "../../../lib/scheduleSearch";
import { formatSlotTime } from "../../../lib/slotStatus";
import type { BlockCellData, ScheduleCellData } from "../../../types";
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

interface BlockCellProps {
  cell: BlockCellData;
}

function BlockCell({ cell }: BlockCellProps) {
  const { tag } = cell.slot;

  return (
    <div
      className={cn(
        "relative flex h-full min-h-16 flex-col items-center justify-center gap-0.5 rounded-xl text-[11.5px] font-bold tracking-wide text-white uppercase",
        !tag?.colorHex && "bg-secondary-500",
      )}
      style={tag?.colorHex ? { backgroundColor: tag.colorHex } : undefined}
    >
      {tag?.name ?? "No asignable"}
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
          reason={`Ese horario está reservado para ${cell.slot.tag?.name ?? "otra actividad"}.`}
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
          reason={`Ese día está cerrado: ${cell.closure.type.toLowerCase()}.`}
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

    case "disabled":
      return (
        <RejectDropZone
          cellId={cell.id}
          label={label}
          reason="Ese horario está deshabilitado."
        >
          <ClosedCell label="Deshabilitado" />
          <CellMenu cell={cell} actions={slotActions} />
        </RejectDropZone>
      );

    case "unavailable":
      return (
        <RejectDropZone
          cellId={cell.id}
          label={label}
          reason="Ese horario no está disponible."
        >
          <ClosedCell label="Cerrado" />
        </RejectDropZone>
      );
  }
}

ScheduleCell.displayName = "ScheduleCell";
