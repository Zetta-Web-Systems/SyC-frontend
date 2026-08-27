/**
 * TEMP: mock de las acciones para las que el backend todavía no expone endpoint.
 *
 * Cada función de acá tiene su entrada de UI deshabilitada (menú de celda,
 * menú de alumno, panel "Sin asignar"), así que en uso normal nunca se
 * llaman con datos reales. El store es chico y aislado a propósito.
 */
import type { PaginatedResponse } from "@shared/types/pagination.types";
import type { MemberSimple } from "@features/members";
import { SCHEDULE_DAY, SLOT_TAG } from "../constants";
import type {
  MemberTurn,
  MoveTurnDto,
  SetTurnHoldDto,
  TimeSlot,
  TimeSlotOverride,
  UpdateTimeSlotDto,
} from "../types";

const MOCK_LATENCY_MS = 220;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(value), MOCK_LATENCY_MS),
  );
}

const MOCK_UNASSIGNED_PEOPLE: [name: string, lastname: string][] = [
  ["Valentina", "Gómez"],
  ["Federico", "Ramos"],
  ["Tomás", "Bustos"],
  ["Agustina", "Peralta"],
  ["Carolina", "Ledesma"],
  ["Malena", "Sosa"],
  ["Bruno", "Acosta"],
  ["Florencia", "Núñez"],
  ["Santiago", "Quiroga"],
];

const MOCK_UNASSIGNED_MEMBERS: MemberSimple[] = MOCK_UNASSIGNED_PEOPLE.map(
  ([name, lastname], index) => ({
    id: `mock-unassigned-${index + 1}`,
    name,
    lastname,
  }),
);

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function mockGetUnassignedMembers(params: {
  page: number;
  size: number;
  search?: string;
}): Promise<PaginatedResponse<MemberSimple>> {
  const needle = params.search?.trim() ? normalize(params.search) : null;
  const all = needle
    ? MOCK_UNASSIGNED_MEMBERS.filter((member) =>
        normalize(`${member.name} ${member.lastname}`).includes(needle),
      )
    : MOCK_UNASSIGNED_MEMBERS;

  const totalPages = Math.max(1, Math.ceil(all.length / params.size));
  const start = (params.page - 1) * params.size;

  return delay({
    data: all.slice(start, start + params.size),
    pagination: {
      total: all.length,
      page: params.page,
      size: params.size,
      totalPages,
      hasNext: params.page < totalPages,
      hasPrev: params.page > 1,
    },
  });
}

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
    member: MOCK_UNASSIGNED_MEMBERS[0],
    startDate: "2026-01-01",
    endDate: null,
    isActive: true,
    onHold: false,
  },
];

const mockOverrides: TimeSlotOverride[] = [
  {
    id: "mock-override-1",
    timeSlotId: "mock-slot-1",
    date: "2026-01-05",
    reason: "Ejemplo",
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

export function mockSetTurnHold(
  turnId: string,
  dto: SetTurnHoldDto,
): Promise<MemberTurn> {
  const turn = findMockTurn(turnId);
  turn.onHold = dto.onHold;
  return delay(turn);
}

export function mockUpdateTimeSlot(
  timeSlotId: string,
  dto: UpdateTimeSlotDto,
): Promise<TimeSlot> {
  const slot = mockTimeSlots.find((item) => item.id === timeSlotId);
  if (!slot) throw new Error(`No existe el horario ${timeSlotId}`);

  if (dto.capacity !== undefined) slot.capacity = dto.capacity;
  if (dto.isActive !== undefined) slot.isActive = dto.isActive;
  if (dto.tag !== undefined) slot.tag = dto.tag;

  return delay(slot);
}

export function mockDeleteTimeSlotRow(startTime: string): Promise<void> {
  const removedIds = new Set(
    mockTimeSlots
      .filter((slot) => slot.startTime === startTime)
      .map((slot) => slot.id),
  );

  for (let i = mockTimeSlots.length - 1; i >= 0; i -= 1) {
    if (removedIds.has(mockTimeSlots[i].id)) mockTimeSlots.splice(i, 1);
  }
  for (let i = mockTurns.length - 1; i >= 0; i -= 1) {
    if (removedIds.has(mockTurns[i].timeSlotId)) mockTurns.splice(i, 1);
  }
  for (let i = mockOverrides.length - 1; i >= 0; i -= 1) {
    if (removedIds.has(mockOverrides[i].timeSlotId)) mockOverrides.splice(i, 1);
  }

  return delay(undefined);
}

export function mockDeleteOverride(overrideId: string): Promise<void> {
  const index = mockOverrides.findIndex((item) => item.id === overrideId);
  if (index >= 0) mockOverrides.splice(index, 1);

  return delay(undefined);
}
