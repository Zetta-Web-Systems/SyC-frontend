import {
  CalendarCheck,
  CalendarMinus,
  CalendarOff,
  EllipsisVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  AnchoredPopover,
  IconButton,
  PopoverHeader,
  PopoverItem,
  PopoverSeparator,
  useAnchoredPopover,
} from "@shared/ui";
import { cn } from "@shared/lib/cn";
import { formatDayMonth } from "@shared/utils/date.utils";
import { SCHEDULE_DAY_LABELS, type ScheduleDay } from "../../../constants";
import type { SlotActions } from "../../../hooks/useSlotActions";
import { formatDayList } from "../../../lib/scheduleDays";
import { formatSlotTime } from "../../../lib/slotStatus";
import type { ScheduleCellData } from "../../../types";

const MENU_WIDTH = 252;

const MENU_HEIGHT = {
  closed: 152,
  blocked: 232,
  slot: 316,
} as const;

const EDIT_DESCRIPTION = "Hora, cupo y etiqueta";

function estimateMenuHeight(cell: ScheduleCellData): number {
  if (cell.kind === "closed") return MENU_HEIGHT.closed;
  if (cell.kind === "blocked") return MENU_HEIGHT.blocked;
  return MENU_HEIGHT.slot;
}

interface CellMenuItemsProps {
  cell: ScheduleCellData;
  rowDays: readonly ScheduleDay[];
  actions: SlotActions;
  onClose: () => void;
}

function CellMenuItems({
  cell,
  rowDays,
  actions,
  onClose,
}: CellMenuItemsProps) {
  function run(action: () => void) {
    onClose();
    action();
  }

  if (cell.kind === "unavailable") return null;

  if (cell.kind === "closed") {
    return (
      <>
        <PopoverHeader
          title={cell.closure.type}
          description={cell.closure.reason}
        />

        <PopoverSeparator />

        <PopoverItem
          icon={<CalendarCheck />}
          iconTone="success"
          description="Se reabren los días del cierre"
          onClick={() => run(() => actions.removeClosure(cell.closure))}
        >
          Quitar el cierre
        </PopoverItem>
      </>
    );
  }

  if (cell.kind === "blocked") {
    return (
      <>
        <PopoverHeader
          title={`Bloqueado el ${formatDayMonth(cell.override.date)}`}
          description={cell.override.reason}
        />

        <PopoverSeparator />

        <PopoverItem
          icon={<CalendarCheck />}
          iconTone="success"
          description="El horario vuelve a estar disponible"
          onClick={() =>
            run(() => actions.removeOverride(cell.override, cell.slot))
          }
        >
          Quitar el bloqueo
        </PopoverItem>

        <PopoverSeparator />

        <PopoverItem
          icon={<Pencil />}
          iconTone="success"
          description={EDIT_DESCRIPTION}
          onClick={() => run(() => actions.edit(cell.slot))}
        >
          Editar horario
        </PopoverItem>
      </>
    );
  }

  const dayLabel = SCHEDULE_DAY_LABELS[cell.dayOfWeek];
  const everyDay = `Cada ${dayLabel.toLowerCase()}`;
  const isSingleDayRow = rowDays.length <= 1;

  const headerDetail =
    cell.kind === "slot"
      ? `${cell.roster.length} de ${cell.slot.capacity} anotados`
      : cell.slot.tag
        ? `Bloque de ${cell.slot.tag}`
        : "Celda no asignable";

  return (
    <>
      <PopoverHeader
        title={`${dayLabel} ${formatSlotTime(cell.startTime)}`}
        description={headerDetail}
      />

      <PopoverSeparator />

      <PopoverItem
        icon={<Pencil />}
        iconTone="success"
        description={EDIT_DESCRIPTION}
        onClick={() => run(() => actions.edit(cell.slot))}
      >
        Editar horario
      </PopoverItem>

      <PopoverItem
        icon={<CalendarOff />}
        iconTone="warning"
        description={`Sólo el ${formatDayMonth(cell.date)}`}
        onClick={() => run(() => actions.block(cell.slot, cell.date))}
      >
        Bloquear esta fecha
      </PopoverItem>

      <PopoverSeparator />

      {isSingleDayRow ? (
        <PopoverItem
          icon={<Trash2 />}
          variant="danger"
          description={everyDay}
          onClick={() =>
            run(() => actions.removeRow(cell.startTime, cell.endTime))
          }
        >
          Eliminar el horario
        </PopoverItem>
      ) : (
        <>
          <PopoverItem
            icon={<CalendarMinus />}
            variant="danger"
            description={everyDay}
            onClick={() => run(() => actions.removeCell(cell.slot))}
          >
            Eliminar este día
          </PopoverItem>

          <PopoverItem
            icon={<Trash2 />}
            variant="danger"
            description={formatDayList(rowDays)}
            onClick={() =>
              run(() => actions.removeRow(cell.startTime, cell.endTime))
            }
          >
            Eliminar toda la fila
          </PopoverItem>
        </>
      )}
    </>
  );
}

interface CellMenuProps {
  cell: ScheduleCellData;
  rowDays: readonly ScheduleDay[];
  actions: SlotActions;
  onColor?: boolean;
}

export function CellMenu({
  cell,
  rowDays,
  actions,
  onColor = false,
}: CellMenuProps) {
  const { anchorRef, position, isOpen, toggle, close } =
    useAnchoredPopover<HTMLButtonElement>({
      width: MENU_WIDTH,
      estimatedHeight: estimateMenuHeight(cell),
    });

  return (
    <>
      <IconButton
        ref={anchorRef}
        aria-label="Acciones del horario"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={toggle}
        className={cn(
          "absolute top-1 right-1 z-20 size-6 rounded-lg opacity-0 transition-all group-hover/cell:opacity-100 focus-visible:opacity-100",
          isOpen && "opacity-100",
          onColor && "text-white/70 hover:bg-white/20 hover:text-white",
        )}
      >
        <EllipsisVertical size={14} aria-hidden="true" />
      </IconButton>

      <AnchoredPopover
        position={position}
        anchorRef={anchorRef}
        onClose={close}
      >
        <CellMenuItems
          cell={cell}
          rowDays={rowDays}
          actions={actions}
          onClose={close}
        />
      </AnchoredPopover>
    </>
  );
}

CellMenu.displayName = "CellMenu";
