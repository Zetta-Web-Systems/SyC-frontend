import { EllipsisVertical, Trash2 } from "lucide-react";
import {
  AnchoredPopover,
  PopoverHeader,
  PopoverItem,
  PopoverSeparator,
  useAnchoredPopover,
} from "@shared/ui";
import { cn } from "@shared/lib/cn";
import type { ScheduleDay } from "../../../constants";
import type { SlotActions } from "../../../hooks/useSlotActions";
import { formatDayList } from "../../../lib/scheduleDays";
import { formatSlotRange } from "../../../lib/slotStatus";

const MENU_WIDTH = 236;
const MENU_HEIGHT = 152;

interface ScheduleTimeLabelProps {
  startTime: string;
  endTime: string;
  rowDays: readonly ScheduleDay[];
  actions: SlotActions;
}

export function ScheduleTimeLabel({
  startTime,
  endTime,
  rowDays,
  actions,
}: ScheduleTimeLabelProps) {
  const { anchorRef, position, isOpen, toggle, close } =
    useAnchoredPopover<HTMLButtonElement>({
      width: MENU_WIDTH,
      estimatedHeight: MENU_HEIGHT,
    });

  const timeLabel = formatSlotRange(startTime, endTime);
  const isWholeRow = rowDays.length > 1;

  function removeRow() {
    close();
    actions.removeRow(startTime, endTime);
  }

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        aria-label={`Acciones del horario de ${timeLabel}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={toggle}
        className={cn(
          "group/row sticky left-0 z-30 flex cursor-pointer items-center justify-center border-t border-neutral-100 bg-white px-1 py-2 text-center text-[13px] font-bold text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-700 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none focus-visible:-outline-offset-2",
          isOpen && "bg-neutral-50 text-neutral-700",
        )}
      >
        {timeLabel}

        <EllipsisVertical
          size={13}
          aria-hidden="true"
          className={cn(
            "absolute right-1 opacity-0 transition-opacity group-hover/row:opacity-100",
            isOpen && "opacity-100",
          )}
        />
      </button>

      <AnchoredPopover
        position={position}
        anchorRef={anchorRef}
        onClose={close}
      >
        <PopoverHeader
          title={timeLabel}
          description={`Abierto ${formatDayList(rowDays)}`}
        />

        <PopoverSeparator />

        <PopoverItem
          icon={<Trash2 />}
          variant="danger"
          description={
            isWholeRow
              ? "Se elimina de todos los días"
              : "Se elimina esa hora del turnero"
          }
          onClick={removeRow}
        >
          {isWholeRow ? "Eliminar toda la fila" : "Eliminar el horario"}
        </PopoverItem>
      </AnchoredPopover>
    </>
  );
}

ScheduleTimeLabel.displayName = "ScheduleTimeLabel";
