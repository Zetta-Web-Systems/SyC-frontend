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
import { describeSlotRanges } from "../lib/scheduleOverlap";
import { getSlotsInRow } from "../lib/scheduleRows";
import { formatSlotRange } from "../lib/slotStatus";
import type {
  CalendarClosure,
  MemberTurn,
  TimeSlot,
  TimeSlotOverride,
  UnavailableCellData,
} from "../types";
import { useDeleteClosureMutation } from "./mutations/useDeleteClosureMutation";
import { useDeleteOverrideMutation } from "./mutations/useDeleteOverrideMutation";
import { useDeleteTimeSlotCellMutation } from "./mutations/useDeleteTimeSlotCellMutation";
import { useDeleteTimeSlotMutation } from "./mutations/useDeleteTimeSlotMutation";
import { useOpenTimeSlotCellMutation } from "./mutations/useOpenTimeSlotCellMutation";
import { useUpdateTimeSlotMutation } from "./mutations/useUpdateTimeSlotMutation";
import type { ScheduleModalsState } from "./ui/useScheduleModals";

export interface SlotActions {
  edit: (slot: TimeSlot) => void;
  block: (slot: TimeSlot, date: string) => void;
  removeCell: (slot: TimeSlot) => void;
  open: (cell: UnavailableCellData) => void;
  removeRow: (startTime: string, endTime: string) => void;
  removeClosure: (closure: CalendarClosure) => void;
  removeOverride: (override: TimeSlotOverride, slot: TimeSlot) => void;
}

const SINGLE_DAY_NOTE =
  'Para dar de baja un solo día, usá "Eliminar este día" en esa celda.';

function countAssigned(
  turns: MemberTurn[],
  slots: readonly TimeSlot[],
): number {
  const slotIds = new Set(slots.map((slot) => slot.id));

  return turns.filter((turn) => turn.isActive && slotIds.has(turn.timeSlotId))
    .length;
}

function describeRoster(assignedCount: number): string {
  if (assignedCount === 0) return "No hay alumnos anotados";

  return `${assignedCount} ${assignedCount === 1 ? "alumno anotado" : "alumnos anotados"} en ese horario`;
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
  weekSlots: TimeSlot[],
  weekTurns: MemberTurn[],
): SlotActions {
  const deleteTimeSlotCell = useDeleteTimeSlotCellMutation();
  const openTimeSlotCell = useOpenTimeSlotCellMutation();
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

  const removeCell = useCallback(
    (slot: TimeSlot) => {
      const day = SCHEDULE_DAY_LABELS[slot.dayOfWeek].toLowerCase();
      const isLastDay =
        getSlotsInRow(weekSlots, slot.startTime, slot.endTime).length <= 1;

      confirm({
        intent: "danger",
        size: "md",
        title: "Eliminar este día",
        description: isLastDay
          ? "Es el único día con esa hora, así que la fila desaparece del turnero."
          : "Se da de baja esa celda. El resto de la semana no se toca.",
        body: (
          <ScheduleConfirmSummary
            rows={[
              {
                label: "Horario",
                value: formatSlotRange(slot.startTime, slot.endTime),
              },
              { label: "Día", value: `Cada ${day}` },
            ]}
            impact={buildImpact(countAssigned(weekTurns, [slot]))}
            note={
              isLastDay
                ? 'Para volver a tenerlo hay que crearlo desde "Agregar horario".'
                : "Se puede volver a abrir desde la celda vacía, pero queda sin alumnos."
            }
          />
        ),
        confirmLabel: "Eliminar",
        onConfirm: () => deleteTimeSlotCell.mutate({ timeSlotId: slot.id }),
      });
    },
    [deleteTimeSlotCell, weekSlots, weekTurns],
  );

  const open = useCallback(
    (cell: UnavailableCellData) => {
      const dto = {
        dayOfWeek: cell.dayOfWeek,
        startTime: cell.startTime,
        endTime: cell.endTime,
        capacity: cell.capacity,
      };

      if (cell.conflicts.length === 0) {
        openTimeSlotCell.mutate({ dto });
        return;
      }

      const canMove = cell.conflicts.length === 1;
      const assigned = countAssigned(weekTurns, cell.conflicts);

      const replace = () =>
        openTimeSlotCell.mutate({ dto, replacedSlots: cell.conflicts });

      const move = () =>
        updateTimeSlot.mutate({
          slot: cell.conflicts[0],
          dto: { startTime: cell.startTime, endTime: cell.endTime },
          scope: "cell",
          weekSlots,
        });

      confirm({
        intent: canMove ? "warning" : "danger",
        size: "md",
        title: "Ese día ya tiene otro horario",
        description: canMove
          ? "Dos horarios no se pueden pisar el mismo día. Podés mover el que está o borrarlo y abrir este vacío."
          : "Dos horarios no se pueden pisar el mismo día. Para abrir este hay que borrar los que están.",
        body: (
          <ScheduleConfirmSummary
            rows={[
              {
                label: "Querés abrir",
                value: `${SCHEDULE_DAY_LABELS[cell.dayOfWeek]} ${formatSlotRange(cell.startTime, cell.endTime)}`,
              },
              {
                label: "Se pisa con",
                value: describeSlotRanges(cell.conflicts),
              },
            ]}
            impact={
              canMove
                ? { tone: "neutral", text: describeRoster(assigned) }
                : buildImpact(assigned)
            }
            note={
              canMove
                ? "Moverlo conserva a los alumnos anotados. Borrarlo los deja sin turno y el horario nuevo arranca vacío."
                : "Los horarios que se pisan se borran y el nuevo arranca vacío."
            }
          />
        ),
        confirmLabel: canMove ? "Mover ese horario acá" : "Borrar y abrir",
        tertiaryLabel: canMove ? "Borrar y abrir vacío" : undefined,
        onConfirm: canMove ? move : replace,
        onTertiary: canMove ? replace : undefined,
      });
    },
    [openTimeSlotCell, updateTimeSlot, weekSlots, weekTurns],
  );

  const removeRow = useCallback(
    (startTime: string, endTime: string) => {
      const rowSlots = getSlotsInRow(weekSlots, startTime, endTime);
      const days = rowSlots.map((slot) => slot.dayOfWeek);
      const isSingleDay = days.length === 1;

      const timeLabel = formatSlotRange(startTime, endTime);

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
            impact={buildImpact(countAssigned(weekTurns, rowSlots))}
            note={isSingleDay ? undefined : SINGLE_DAY_NOTE}
          />
        ),
        confirmLabel: "Eliminar",
        onConfirm: () =>
          deleteTimeSlot.mutate({ startTime, endTime, weekSlots }),
      });
    },
    [deleteTimeSlot, weekSlots, weekTurns],
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
