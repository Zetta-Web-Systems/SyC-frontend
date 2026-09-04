/**
 * TEMP: mock de las acciones para las que el backend todavía no expone endpoint.
 *
 * Cada función de acá tiene su entrada de UI deshabilitada (menú de celda,
 * drag&drop entre celdas), así que en uso normal nunca se llaman con datos
 * reales. El store es chico y aislado a propósito.
 */
import type { MemberSimple } from "@features/members";
import { SCHEDULE_DAY, SLOT_TAG } from "../constants";
import type {
  MemberTurn,
  MoveTurnDto,
  TimeSlot,
  UpdateTimeSlotDto,
} from "../types";

const MOCK_LATENCY_MS = 220;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(value), MOCK_LATENCY_MS),
  );
}

const MOCK_MEMBER: MemberSimple = {
  id: "mock-member-1",
  name: "Valentina",
  lastname: "Gómez",
};

const mockTimeSlots: TimeSlot[] = [
  {
    id: "mock-slot-1",
    dayOfWeek: SCHEDULE_DAY.MONDAY,
    startTime: "08:30",
    endTime: "09:30",
    capacity: 7,
    isActive: true,
    tag: null,
  },
  {
    id: "mock-slot-2",
    dayOfWeek: SCHEDULE_DAY.TUESDAY,
    startTime: "10:30",
    endTime: "11:30",
    capacity: 0,
    isActive: true,
    tag: SLOT_TAG.YOGA,
  },
];

const mockTurns: MemberTurn[] = [
  {
    id: "mock-turn-1",
    timeSlotId: "mock-slot-1",
    member: MOCK_MEMBER,
    startDate: "2026-01-01",
    endDate: null,
    isActive: true,
    onHold: false,
  },
];

function findMockTurn(turnId: string): MemberTurn {
  const turn = mockTurns.find((item) => item.id === turnId);
  if (!turn) throw new Error(`No existe el turno ${turnId}`);
  return turn;
}

export function mockMoveTurn(
  turnId: string,
  dto: MoveTurnDto,
): Promise<MemberTurn> {
  const turn = findMockTurn(turnId);
  turn.timeSlotId = dto.timeSlotId;
  return delay(turn);
}

export function mockUpdateTimeSlot(
  timeSlotId: string,
  dto: UpdateTimeSlotDto,
): Promise<TimeSlot> {
  const slot = mockTimeSlots.find((item) => item.id === timeSlotId);
  if (!slot) throw new Error(`No existe el horario ${timeSlotId}`);

  if (dto.capacity !== undefined) slot.capacity = dto.capacity;
  if (dto.tag !== undefined) slot.tag = dto.tag;

  return delay(slot);
}
