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
import { useUpdateTimeSlotMutation } from "./mutations/useUpdateTimeSlotMutation";
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
  if (days.length === 1) return ` Hoy sólo se usa los ${days[0]}.`;

  return ` Hoy se usa los ${days.slice(0, -1).join(", ")} y ${days.at(-1)}.`;
}

export function useSlotActions(
  modals: ScheduleModalsState,
  grid: ScheduleGrid | null,
): SlotActions {
  const updateTimeSlot = useUpdateTimeSlotMutation();
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
      updateTimeSlot.mutate({ timeSlotId: slot.id, dto: { enabled } });
    },
    [updateTimeSlot],
  );

  const removeRow = useCallback(
    (startTime: string) => {
      const assignedCount = countAssignedInRow(grid, startTime);
      const hour = formatSlotTime(startTime);

      const peopleNote =
        assignedCount > 0
          ? ` ${assignedCount} ${assignedCount === 1 ? "alumno anotado va a quedar" : "alumnos anotados van a quedar"} sin turno.`
          : "";

      confirm({
        intent: "danger",
        title: `Eliminar las ${hour}`,
        description: `Esa hora desaparece del turnero en los cinco días.${describeOpenDays(grid, startTime)}${peopleNote} Si sólo querés que no se use algún día, cerrá esa celda en vez de eliminar la hora.`,
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
        title: "Quitar el cierre",
        description: `El cierre por ${closure.type.toLowerCase()} deja de aplicar y esos días vuelven a estar abiertos.`,
        confirmLabel: "Quitar",
        onConfirm: () => deleteClosure.mutate({ closureId: closure.id }),
      });
    },
    [deleteClosure],
  );

  const removeOverride = useCallback(
    (override: TimeSlotOverride) => {
      confirm({
        intent: "warning",
        title: "Quitar el bloqueo",
        description: `El horario vuelve a estar disponible el ${formatDate(override.date)}.`,
        confirmLabel: "Quitar",
        onConfirm: () => deleteOverride.mutate({ overrideId: override.id }),
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
