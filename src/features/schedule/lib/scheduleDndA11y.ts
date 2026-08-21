import type { Announcements, ScreenReaderInstructions } from "@dnd-kit/core";
import { formatMemberFullName } from "./memberDisplay";
import type { ActiveDragData, DropData } from "./scheduleDnd";

function getMemberName(data: unknown): string {
  const drag = data as ActiveDragData | null | undefined;
  return drag ? formatMemberFullName(drag.member) : "el alumno";
}

function getDropLabel(data: unknown): string | null {
  const drop = data as DropData | null | undefined;
  return drop?.label ?? null;
}

export const dndScreenReaderInstructions: ScreenReaderInstructions = {
  draggable:
    "Para mover un alumno con el teclado, apretá Espacio. Movete entre los horarios con las flechas y volvé a apretar Espacio para soltarlo. Escape cancela.",
};

export const dndAnnouncements: Announcements = {
  onDragStart: ({ active }) =>
    `Levantaste a ${getMemberName(active.data.current)}.`,

  onDragOver: ({ active, over }) => {
    const label = getDropLabel(over?.data.current);
    if (!label) return undefined;
    return `${getMemberName(active.data.current)} está sobre ${label}.`;
  },

  onDragEnd: ({ active, over }) => {
    const label = getDropLabel(over?.data.current);
    const name = getMemberName(active.data.current);
    return label
      ? `Soltaste a ${name} en ${label}.`
      : `Soltaste a ${name} fuera de la grilla, no se hizo ningún cambio.`;
  },

  onDragCancel: ({ active }) =>
    `Cancelaste el movimiento de ${getMemberName(active.data.current)}.`,
};
