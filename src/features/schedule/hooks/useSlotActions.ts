import { useCallback, useMemo } from "react";
import { confirm } from "@shared/stores/confirm.store";
import { formatDate } from "@shared/utils/date.utils";
import { SCHEDULE_DAY_LABELS } from "../constants";
import { formatDayList } from "../lib/scheduleDays";
import { getSlotsInRow } from "../lib/scheduleRows";
import { formatSlotTime } from "../lib/slotStatus";
import type {
  CalendarClosure,
  ScheduleGrid,
  TimeSlot,
  TimeSlotOverride,
  UnavailableCellData,
} from "../types";
import { useDeleteClosureMutation } from "./mutations/useDeleteClosureMutation";
import { useDeleteOverrideMutation } from "./mutations/useDeleteOverrideMutation";
import { useDeleteTimeSlotCellMutation } from "./mutations/useDeleteTimeSlotCellMutation";
import { useDeleteTimeSlotMutation } from "./mutations/useDeleteTimeSlotMutation";
import { useOpenTimeSlotCellMutation } from "./mutations/useOpenTimeSlotCellMutation";
import type { ScheduleModalsState } from "./ui/useScheduleModals";

export interface SlotActions {
  edit: (slot: TimeSlot) => void;
  block: (slot: TimeSlot, date: string) => void;
  removeCell: (slot: TimeSlot) => void;
  open: (cell: UnavailableCellData) => void;
  removeRow: (startTime: string) => void;
  removeClosure: (closure: CalendarClosure) => void;
  removeOverride: (override: TimeSlotOverride) => void;
}

function countAssignedInRow(
  grid: ScheduleGrid | null,
  startTime: string,
): number {
  const row = grid?.rows.find((item) => item.startTime === startTime);
  if (!row) return 0;

  return row.cells.reduce(
    (total, cell) => total + (cell.kind === "slot" ? cell.roster.length : 0),
    0,
  );
}

function countAssignedInCell(
  grid: ScheduleGrid | null,
  slotId: string,
): number {
  const cells = grid?.rows.flatMap((row) => row.cells) ?? [];
  const cell = cells.find(
    (item) => item.kind === "slot" && item.slot.id === slotId,
  );

  return cell?.kind === "slot" ? cell.roster.length : 0;
}

function describeOpenDays(weekSlots: TimeSlot[], startTime: string): string {
  const days = getSlotsInRow(weekSlots, startTime).map(
    (slot) => slot.dayOfWeek,
  );
  if (days.length === 0) return "";

  const label = formatDayList(days).toLowerCase();

  return days.length === 1
    ? ` Actualmente se utiliza únicamente los ${label}.`
    : ` Actualmente se utiliza los ${label}.`;
}

export function useSlotActions(
  modals: ScheduleModalsState,
  grid: ScheduleGrid | null,
  weekSlots: TimeSlot[],
): SlotActions {
  const deleteTimeSlotCell = useDeleteTimeSlotCellMutation();
  const openTimeSlotCell = useOpenTimeSlotCellMutation();
  const deleteTimeSlot = useDeleteTimeSlotMutation();
  const deleteClosure = useDeleteClosureMutation();
  const deleteOverride = useDeleteOverrideMutation();

  const { openEditSlot, openBlockSlot } = modals;

  const block = useCallback(
    (slot: TimeSlot, date: string) => {
      openBlockSlot(slot, date);
    },
    [openBlockSlot],
  );

  const removeCell = useCallback(
    (slot: TimeSlot) => {
      const assignedCount = countAssignedInCell(grid, slot.id);
      const day = SCHEDULE_DAY_LABELS[slot.dayOfWeek].toLowerCase();
      const hour = formatSlotTime(slot.startTime);

      const peopleNote =
        assignedCount > 0
          ? ` ${assignedCount} ${assignedCount === 1 ? "alumno anotado quedará" : "alumnos anotados quedarán"} sin turno.`
          : "";

      confirm({
        intent: "danger",
        title: "Eliminar horario",
        description: `¿Estás seguro que deseas eliminar el horario de cada ${day} a las ${hour}?${peopleNote} El resto de la semana no se toca. La celda se puede volver a abrir, pero queda vacía: a los alumnos hay que anotarlos de nuevo.`,
        confirmLabel: "Eliminar",
        onConfirm: () => deleteTimeSlotCell.mutate({ timeSlotId: slot.id }),
      });
    },
    [deleteTimeSlotCell, grid],
  );

  const open = useCallback(
    (cell: UnavailableCellData) => {
      openTimeSlotCell.mutate({
        dayOfWeek: cell.dayOfWeek,
        startTime: cell.startTime,
        endTime: cell.endTime,
        capacity: cell.capacity,
      });
    },
    [openTimeSlotCell],
  );

  const removeRow = useCallback(
    (startTime: string) => {
      const assignedCount = countAssignedInRow(grid, startTime);
      const hour = formatSlotTime(startTime);

      const peopleNote =
        assignedCount > 0
          ? ` ${assignedCount} ${assignedCount === 1 ? "alumno anotado quedará" : "alumnos anotados quedarán"} sin turno.`
          : "";

      confirm({
        intent: "danger",
        title: "Eliminar horario",
        description: `¿Estás seguro que deseas eliminar el horario de las ${hour} de toda la semana?${describeOpenDays(weekSlots, startTime)}${peopleNote} Para dar de baja un solo día, se puede eliminar esa celda desde su menú.`,
        confirmLabel: "Eliminar",
        onConfirm: () => deleteTimeSlot.mutate({ startTime, weekSlots }),
      });
    },
    [deleteTimeSlot, grid, weekSlots],
  );

  const removeClosure = useCallback(
    (closure: CalendarClosure) => {
      confirm({
        intent: "warning",
        title: "Eliminar cierre",
        description: `¿Estás seguro que deseas eliminar el cierre por ${closure.type.toLowerCase()}? Los días correspondientes volverán a estar habilitados.`,
        confirmLabel: "Eliminar",
        onConfirm: () => deleteClosure.mutate({ date: closure.startDate }),
      });
    },
    [deleteClosure],
  );

  const removeOverride = useCallback(
    (override: TimeSlotOverride) => {
      confirm({
        intent: "warning",
        title: "Eliminar bloqueo",
        description: `¿Estás seguro que deseas eliminar el bloqueo? El horario volverá a estar disponible el ${formatDate(override.date)}.`,
        confirmLabel: "Eliminar",
        onConfirm: () =>
          deleteOverride.mutate({
            date: override.date,
            timeSlotId: override.timeSlotId,
          }),
      });
    },
    [deleteOverride],
  );

  return useMemo(
    () => ({
      edit: openEditSlot,
      block,
      removeCell,
      open,
      removeRow,
      removeClosure,
      removeOverride,
    }),
    [
      openEditSlot,
      block,
      removeCell,
      open,
      removeRow,
      removeClosure,
      removeOverride,
    ],
  );
}
