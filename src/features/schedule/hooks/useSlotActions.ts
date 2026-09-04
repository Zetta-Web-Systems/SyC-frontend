import { useCallback, useMemo } from "react";
import { confirm } from "@shared/stores/confirm.store";
import { formatDate } from "@shared/utils/date.utils";
import { SCHEDULE_DAY_LABELS } from "../constants";
import { formatSlotTime } from "../lib/slotStatus";
import type {
  CalendarClosure,
  ScheduleGrid,
  TimeSlot,
  TimeSlotOverride,
} from "../types";
import { useDeleteClosureMutation } from "./mutations/useDeleteClosureMutation";
import { useDeleteOverrideMutation } from "./mutations/useDeleteOverrideMutation";
import { useDeleteTimeSlotMutation } from "./mutations/useDeleteTimeSlotMutation";
import { useSetTimeSlotActiveMutation } from "./mutations/useSetTimeSlotActiveMutation";
import type { ScheduleModalsState } from "./ui/useScheduleModals";

export interface SlotActions {
  edit: (slot: TimeSlot) => void;
  block: (slot: TimeSlot, date: string) => void;
  setEnabled: (slot: TimeSlot, enabled: boolean) => void;
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

function describeOpenDays(
  grid: ScheduleGrid | null,
  startTime: string,
): string {
  const row = grid?.rows.find((item) => item.startTime === startTime);
  if (!row) return "";

  const days = row.cells
    .filter((cell) => cell.kind === "slot" || cell.kind === "block")
    .map((cell) => SCHEDULE_DAY_LABELS[cell.dayOfWeek].toLowerCase());

  if (days.length === 0) return "";
  if (days.length === 1)
    return ` Actualmente se utiliza únicamente los ${days[0]}.`;

  return ` Actualmente se utiliza los ${days.slice(0, -1).join(", ")} y ${days.at(-1)}.`;
}

export function useSlotActions(
  modals: ScheduleModalsState,
  grid: ScheduleGrid | null,
): SlotActions {
  const setTimeSlotActive = useSetTimeSlotActiveMutation();
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

  const setEnabled = useCallback(
    (slot: TimeSlot, enabled: boolean) => {
      if (enabled) {
        setTimeSlotActive.mutate({ timeSlotId: slot.id, isActive: true });
        return;
      }

      const assignedCount = countAssignedInCell(grid, slot.id);
      const day = SCHEDULE_DAY_LABELS[slot.dayOfWeek].toLowerCase();
      const hour = formatSlotTime(slot.startTime);

      const peopleNote =
        assignedCount > 0
          ? ` ${assignedCount} ${assignedCount === 1 ? "alumno anotado quedará" : "alumnos anotados quedarán"} sin turno, y volver a abrir el horario no los reasigna.`
          : "";

      confirm({
        intent: "warning",
        title: "Cerrar horario",
        description: `¿Estás seguro que deseas cerrar los ${day} a las ${hour}?${peopleNote}`,
        confirmLabel: "Cerrar",
        onConfirm: () =>
          setTimeSlotActive.mutate({ timeSlotId: slot.id, isActive: false }),
      });
    },
    [setTimeSlotActive, grid],
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
        description: `¿Estás seguro que deseas eliminar el horario de las ${hour} de toda la semana?${describeOpenDays(grid, startTime)}${peopleNote} Para desactivar un solo día, se puede cerrar esa celda en particular.`,
        confirmLabel: "Eliminar",
        onConfirm: () => deleteTimeSlot.mutate({ startTime }),
      });
    },
    [deleteTimeSlot, grid],
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
      setEnabled,
      removeRow,
      removeClosure,
      removeOverride,
    }),
    [openEditSlot, block, setEnabled, removeRow, removeClosure, removeOverride],
  );
}
