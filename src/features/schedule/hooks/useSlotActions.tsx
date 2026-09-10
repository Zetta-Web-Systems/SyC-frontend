import { useCallback, useMemo } from "react";
import { confirm } from "@shared/stores/confirm.store";
import { formatDate } from "@shared/utils/date.utils";
import { SCHEDULE_DAY_LABELS } from "../constants";
import {
  ScheduleConfirmSummary,
  type ScheduleConfirmImpact,
  type ScheduleConfirmRow,
} from "../components/common";
import { formatDayList } from "../lib/scheduleDays";
import { getSlotsInRow } from "../lib/scheduleRows";
import { formatSlotRange, formatSlotTime } from "../lib/slotStatus";
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
  removeOverride: (override: TimeSlotOverride, slot: TimeSlot) => void;
}

const SINGLE_DAY_NOTE =
  'Para dar de baja un solo día, usá "Eliminar este día" en esa celda.';

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

function buildImpact(assignedCount: number): ScheduleConfirmImpact {
  if (assignedCount === 0) {
    return { tone: "neutral", text: "No hay alumnos anotados" };
  }

  return {
    tone: "danger",
    text: `${assignedCount} ${assignedCount === 1 ? "alumno queda" : "alumnos quedan"} sin turno`,
  };
}

function formatClosureDays(closure: CalendarClosure): string {
  return closure.startDate === closure.endDate
    ? formatDate(closure.startDate)
    : `${formatDate(closure.startDate)} al ${formatDate(closure.endDate)}`;
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
      const day = SCHEDULE_DAY_LABELS[slot.dayOfWeek].toLowerCase();

      confirm({
        intent: "danger",
        size: "md",
        title: "Eliminar este día",
        description:
          "Se da de baja esa celda. El resto de la semana no se toca.",
        body: (
          <ScheduleConfirmSummary
            rows={[
              {
                label: "Horario",
                value: formatSlotRange(slot.startTime, slot.endTime),
              },
              { label: "Día", value: `Cada ${day}` },
            ]}
            impact={buildImpact(countAssignedInCell(grid, slot.id))}
            note="Se puede volver a abrir desde la celda vacía, pero queda sin alumnos."
          />
        ),
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
      const rowSlots = getSlotsInRow(weekSlots, startTime);
      const days = rowSlots.map((slot) => slot.dayOfWeek);
      const isSingleDay = days.length === 1;

      const timeLabel = rowSlots.length
        ? formatSlotRange(startTime, rowSlots[0].endTime)
        : formatSlotTime(startTime);

      confirm({
        intent: "danger",
        size: "md",
        title: isSingleDay ? "Eliminar el horario" : "Eliminar toda la fila",
        description: isSingleDay
          ? "Se da de baja la única celda que tiene esa hora."
          : "Se elimina esa hora de todos los días en los que está abierta.",
        body: (
          <ScheduleConfirmSummary
            rows={[
              { label: "Horario", value: timeLabel },
              {
                label: isSingleDay ? "Día" : "Días",
                value: formatDayList(days),
              },
            ]}
            impact={buildImpact(countAssignedInRow(grid, startTime))}
            note={isSingleDay ? undefined : SINGLE_DAY_NOTE}
          />
        ),
        confirmLabel: "Eliminar",
        onConfirm: () => deleteTimeSlot.mutate({ startTime, weekSlots }),
      });
    },
    [deleteTimeSlot, grid, weekSlots],
  );

  const removeClosure = useCallback(
    (closure: CalendarClosure) => {
      const rows: ScheduleConfirmRow[] = [
        { label: "Tipo", value: closure.type },
        ...(closure.reason ? [{ label: "Motivo", value: closure.reason }] : []),
        { label: "Días", value: formatClosureDays(closure) },
      ];

      confirm({
        intent: "info",
        size: "md",
        title: "Quitar el cierre",
        description: "Los días del cierre vuelven a tener turnos.",
        body: <ScheduleConfirmSummary rows={rows} />,
        confirmLabel: "Quitar",
        onConfirm: () => deleteClosure.mutate({ date: closure.startDate }),
      });
    },
    [deleteClosure],
  );

  const removeOverride = useCallback(
    (override: TimeSlotOverride, slot: TimeSlot) => {
      const day = SCHEDULE_DAY_LABELS[slot.dayOfWeek];

      const rows: ScheduleConfirmRow[] = [
        { label: "Fecha", value: `${day} ${formatDate(override.date)}` },
        {
          label: "Horario",
          value: formatSlotRange(slot.startTime, slot.endTime),
        },
        ...(override.reason
          ? [{ label: "Motivo", value: override.reason }]
          : []),
      ];

      confirm({
        intent: "info",
        size: "md",
        title: "Quitar el bloqueo",
        description: "El horario vuelve a estar disponible ese día.",
        body: <ScheduleConfirmSummary rows={rows} />,
        confirmLabel: "Quitar",
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
