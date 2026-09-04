import {
  CalendarOff,
  EllipsisVertical,
  Pencil,
  Power,
  PowerOff,
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
import { formatDate } from "@shared/utils/date.utils";
import { SCHEDULE_DAY_LABELS } from "../../../constants";
import type { SlotActions } from "../../../hooks/useSlotActions";
import { formatSlotTime } from "../../../lib/slotStatus";
import type { ScheduleCellData } from "../../../types";

interface CellMenuItemsProps {
  cell: ScheduleCellData;
  actions: SlotActions;
  onClose: () => void;
}

function CellMenuItems({ cell, actions, onClose }: CellMenuItemsProps) {
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
          icon={<Trash2 />}
          variant="danger"
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
          title={`Bloqueado el ${formatDate(cell.override.date)}`}
          description={cell.override.reason}
        />

        <PopoverSeparator />

        <PopoverItem
          icon={<Pencil />}
          disabled
          title="Esta acción no está disponible por el momento."
        >
          Editar horario
        </PopoverItem>

        <PopoverItem
          icon={<Trash2 />}
          variant="danger"
          onClick={() => run(() => actions.removeOverride(cell.override))}
        >
          Quitar el bloqueo
        </PopoverItem>
      </>
    );
  }

  const everyDay = SCHEDULE_DAY_LABELS[cell.dayOfWeek].toLowerCase();
  const hour = formatSlotTime(cell.startTime);

  const disabledActionTitle = "Esta acción no está disponible por el momento.";

  if (cell.kind === "disabled") {
    return (
      <>
        <PopoverItem
          icon={<Power />}
          onClick={() => run(() => actions.setEnabled(cell.slot, true))}
        >
          Abrir los {everyDay} a las {hour}
        </PopoverItem>

        <PopoverItem icon={<Pencil />} disabled title={disabledActionTitle}>
          Editar horario
        </PopoverItem>

        <PopoverSeparator />

        <PopoverItem
          icon={<Trash2 />}
          variant="danger"
          onClick={() => run(() => actions.removeRow(cell.startTime))}
        >
          Eliminar las {hour} de toda la semana
        </PopoverItem>
      </>
    );
  }

  return (
    <>
      <PopoverItem icon={<Pencil />} disabled title={disabledActionTitle}>
        Editar horario
      </PopoverItem>

      <PopoverItem
        icon={<CalendarOff />}
        onClick={() => run(() => actions.block(cell.slot, cell.date))}
      >
        Bloquear sólo el {formatDate(cell.date)}
      </PopoverItem>

      <PopoverItem
        icon={<PowerOff />}
        onClick={() => run(() => actions.setEnabled(cell.slot, false))}
      >
        Cerrar los {everyDay} a las {hour}
      </PopoverItem>

      <PopoverSeparator />

      <PopoverItem
        icon={<Trash2 />}
        variant="danger"
        onClick={() => run(() => actions.removeRow(cell.startTime))}
      >
        Eliminar las {hour} de toda la semana
      </PopoverItem>
    </>
  );
}

interface CellMenuProps {
  cell: ScheduleCellData;
  actions: SlotActions;
  onColor?: boolean;
}

export function CellMenu({ cell, actions, onColor = false }: CellMenuProps) {
  const { anchorRef, position, isOpen, toggle, close } =
    useAnchoredPopover<HTMLButtonElement>();

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
        <CellMenuItems cell={cell} actions={actions} onClose={close} />
      </AnchoredPopover>
    </>
  );
}

CellMenu.displayName = "CellMenu";
