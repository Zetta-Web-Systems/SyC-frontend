/**
 * TEMP: data simulada del turnero mientras el backend no expone los endpoints.
 *
 * Todo el mock vive en este archivo y se activa desde `USE_SCHEDULE_MOCK`
 * en `services/schedule.api.ts`. El dia que esten los endpoints reales se
 * borra este archivo y se sacan los `if` del service: ni los hooks ni los
 * componentes saben que esto existe.
 *
 * El store es mutable a proposito, para que las acciones de la pantalla
 * (asignar, crear, cerrar) se vean reflejadas mientras dure la sesion.
 */
import { formatDateToISO } from "@shared/utils/date.utils";
import type { PaginatedResponse } from "@shared/types/pagination.types";
import type { MemberSimple } from "@features/members";
import {
  CLOSURE_TYPE,
  SCHEDULE_DAY,
  SCHEDULE_DAYS,
  type ScheduleDay,
} from "../constants";
import {
  addDays,
  getWeekdays,
  isDateInRange,
  startOfWeek,
} from "../lib/scheduleWeek";
import type {
  AssignTurnDto,
  CalendarClosure,
  CreateClosureDto,
  CreateOverrideDto,
  CreateTimeSlotDto,
  MemberTurn,
  MoveTurnDto,
  ScheduleWeek,
  SetTurnHoldDto,
  SlotTag,
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

/* -- Alumnos ------------------------------------------------------------ */

const MOCK_PEOPLE: [name: string, lastname: string][] = [
  ["Valentina", "Gómez"],
  ["Federico", "Ramos"],
  ["Tomás", "Bustos"],
  ["Agustina", "Peralta"],
  ["Carolina", "Ledesma"],
  ["Malena", "Sosa"],
  ["Cecilia", "Duarte"],
  ["Bruno", "Acosta"],
  ["Florencia", "Núñez"],
  ["Santiago", "Quiroga"],
  ["Melina", "Herrera"],
  ["Iván", "Cabrera"],
  ["Pilar", "Molina"],
  ["Rocío", "Torres"],
  ["Guillermo", "Vega"],
  ["Ignacio", "Ferreyra"],
  ["Martina", "Ojeda"],
  ["Eugenia", "Rivas"],
  ["Tobías", "Paz"],
  ["Candela", "Luna"],
  ["Guillermina", "Suárez"],
  ["Yamila", "Godoy"],
  ["Morena", "Díaz"],
  ["Nicolás", "Ríos"],
  ["Julieta", "Tejeda"],
  ["Daniela", "Pereyra"],
  ["Paola", "Lucero"],
  ["Karina", "Villalba"],
  ["Alejandro", "Silva"],
  ["Victoria", "Maldonado"],
  ["Emilia", "Roldán"],
  ["Lorenzo", "Farías"],
  ["Antonella", "Pons"],
  ["Francisco", "Cáceres"],
  ["Micaela", "Robles"],
  ["Beatriz", "Olmos"],
  ["Nahuel", "Gutiérrez"],
  ["Norma", "Barrios"],
  ["Carlos", "Vera"],
  ["Luisa", "Ponce"],
  ["Vilma", "Aguirre"],
  ["Darío", "Navarro"],
  ["Ivana", "Toledo"],
  ["Mariana", "Álvarez"],
  ["Teresa", "Cortés"],
  ["Roberto", "Domínguez"],
  ["Nilda", "Giménez"],
  ["Óscar", "Nieva"],
  ["Iris", "Leiva"],
  ["Griselda", "Arias"],
  ["Oreste", "Juárez"],
  ["Luis", "Ávila"],
  ["Juan", "Pizarro"],
  ["Raúl", "Navarrete"],
  ["Maximiliano", "Medina"],
  ["Elena", "Rearte"],
  ["Martín", "Lezcano"],
  ["Laura", "Andrada"],
  ["Lucas", "Peña"],
  ["Fabricio", "Correa"],
  ["Estela", "Cardozo"],
];

const MOCK_MEMBERS: MemberSimple[] = MOCK_PEOPLE.map(
  ([name, lastname], index) => ({
    id: `member-${index + 1}`,
    name,
    lastname,
  }),
);

/** Los ultimos quedan siempre libres, para poblar el panel "Sin asignar". */
const UNASSIGNED_COUNT = 9;
const ASSIGNABLE_MEMBERS = MOCK_MEMBERS.slice(0, -UNASSIGNED_COUNT);

/* -- Etiquetas ---------------------------------------------------------- */

const TAG_KIDS: SlotTag = {
  id: "tag-kids",
  name: "Niños",
  colorHex: "#8b5cf6",
};
const TAG_YOGA: SlotTag = { id: "tag-yoga", name: "Yoga", colorHex: "#4ea49c" };

const MOCK_TAGS: SlotTag[] = [TAG_KIDS, TAG_YOGA];

/* -- Definicion de la grilla -------------------------------------------- */

interface MockSlotDef {
  /** Turnos asignados. */
  count?: number;
  /** Por defecto 7. En 0 el horario deja de ser asignable (caso Yoga). */
  capacity?: number;
  enabled?: boolean;
  tag?: SlotTag;
  /** Cuantos de esos turnos son lugares guardados por la dueña. */
  held?: number;
}

interface MockRowDef {
  startTime: string;
  /**
   * Los cinco días, siempre. Dar de alta una hora la crea de lunes a viernes;
   * los días que no se usan se cierran (`enabled: false`), no se omiten.
   */
  days: Record<ScheduleDay, MockSlotDef>;
}

const DEFAULT_CAPACITY = 7;

const { MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY } = SCHEDULE_DAY;

const MOCK_ROWS: MockRowDef[] = [
  {
    startTime: "08:30",
    days: {
      [MONDAY]: { count: 5, held: 1 },
      [TUESDAY]: { count: 7 },
      [WEDNESDAY]: { count: 6 },
      [THURSDAY]: { count: 8 },
      [FRIDAY]: { count: 3 },
    },
  },
  {
    startTime: "09:30",
    days: {
      [MONDAY]: { count: 4, tag: TAG_KIDS },
      [TUESDAY]: { count: 2 },
      [WEDNESDAY]: { count: 8 },
      [THURSDAY]: { count: 1 },
      [FRIDAY]: { count: 5 },
    },
  },
  {
    startTime: "10:30",
    days: {
      [MONDAY]: { count: 2 },
      [TUESDAY]: { capacity: 0, tag: TAG_YOGA },
      [WEDNESDAY]: { count: 7 },
      [THURSDAY]: { count: 3 },
      [FRIDAY]: { count: 6 },
    },
  },
  {
    startTime: "11:30",
    days: {
      [MONDAY]: { enabled: false },
      [TUESDAY]: { count: 4 },
      [WEDNESDAY]: { count: 5 },
      [THURSDAY]: { count: 2 },
      [FRIDAY]: { count: 7 },
    },
  },
  {
    startTime: "14:00",
    days: {
      [MONDAY]: { count: 5 },
      [TUESDAY]: { count: 3 },
      [WEDNESDAY]: { count: 6 },
      [THURSDAY]: { count: 4 },
      [FRIDAY]: { count: 2 },
    },
  },
  {
    startTime: "15:00",
    days: {
      [MONDAY]: { count: 3 },
      [TUESDAY]: { count: 6 },
      [WEDNESDAY]: { count: 2 },
      [THURSDAY]: { count: 5, held: 1 },
      [FRIDAY]: { count: 4 },
    },
  },
  {
    startTime: "16:00",
    days: {
      [MONDAY]: { count: 1 },
      [TUESDAY]: { count: 2 },
      [WEDNESDAY]: { count: 3 },
      [THURSDAY]: { enabled: false },
      [FRIDAY]: { count: 2 },
    },
  },
  {
    startTime: "20:00",
    days: {
      [MONDAY]: { enabled: false },
      [TUESDAY]: { capacity: 0, tag: TAG_YOGA },
      [WEDNESDAY]: { enabled: false },
      [THURSDAY]: { enabled: false },
      [FRIDAY]: { enabled: false },
    },
  },
];

/* -- Construccion del store --------------------------------------------- */

function hashKey(key: string): number {
  let hash = 0;
  for (const char of key) {
    hash = (hash * 31 + char.charCodeAt(0)) % 100_000;
  }
  return hash;
}

function buildSlotId(dayOfWeek: ScheduleDay, startTime: string): string {
  return `slot-${dayOfWeek.toLowerCase()}-${startTime.replace(":", "")}`;
}

const CURRENT_MONDAY = startOfWeek(new Date());
const TURNS_START_DATE = formatDateToISO(addDays(CURRENT_MONDAY, -60));

let turnSequence = 0;

function buildTurns(slot: TimeSlot, def: MockSlotDef): MemberTurn[] {
  const offset = hashKey(slot.id) % ASSIGNABLE_MEMBERS.length;
  const held = def.held ?? 0;

  return Array.from({ length: def.count ?? 0 }, (_, index) => {
    turnSequence += 1;

    return {
      id: `turn-${turnSequence}`,
      timeSlotId: slot.id,
      member: ASSIGNABLE_MEMBERS[(offset + index) % ASSIGNABLE_MEMBERS.length],
      startDate: TURNS_START_DATE,
      endDate: null,
      isActive: true,
      heldByOwner: index < held,
    };
  });
}

const timeSlots: TimeSlot[] = [];
const turns: MemberTurn[] = [];

for (const row of MOCK_ROWS) {
  const entries = Object.entries(row.days) as [ScheduleDay, MockSlotDef][];

  for (const [dayOfWeek, def] of entries) {
    const slot: TimeSlot = {
      id: buildSlotId(dayOfWeek, row.startTime),
      dayOfWeek,
      startTime: row.startTime,
      capacity: def.capacity ?? DEFAULT_CAPACITY,
      enabled: def.enabled ?? true,
      tag: def.tag ?? null,
    };

    timeSlots.push(slot);
    turns.push(...buildTurns(slot, def));
  }
}

/** Feriado del viernes de esta semana, del tipo que cargaria el sistema solo. */
const FRIDAY_DATE = formatDateToISO(addDays(CURRENT_MONDAY, 4));
/** Bloqueo puntual del miercoles a las 15, al estilo "juega la Seleccion". */
const WEDNESDAY_DATE = formatDateToISO(addDays(CURRENT_MONDAY, 2));

const closures: CalendarClosure[] = [
  {
    id: "closure-1",
    type: CLOSURE_TYPE.HOLIDAY,
    startDate: FRIDAY_DATE,
    endDate: FRIDAY_DATE,
    reason: "Feriado nacional, el local no abre.",
    isAutoGenerated: true,
  },
];

const overrides: TimeSlotOverride[] = [
  {
    id: "override-1",
    timeSlotId: buildSlotId(WEDNESDAY, "15:00"),
    date: WEDNESDAY_DATE,
    reason: "Juega la Selección",
  },
];

const db = { tags: MOCK_TAGS, timeSlots, turns, closures, overrides };

/* -- Lecturas ----------------------------------------------------------- */

export function mockGetScheduleWeek(
  from: string,
  to: string,
): Promise<ScheduleWeek> {
  const days = getWeekdays(from).map((day) => ({
    ...day,
    closure:
      db.closures.find((closure) =>
        isDateInRange(day.date, closure.startDate, closure.endDate),
      ) ?? null,
  }));

  return delay({
    from,
    to,
    days,
    timeSlots: [...db.timeSlots],
    turns: [...db.turns],
    overrides: db.overrides.filter((override) =>
      isDateInRange(override.date, from, to),
    ),
  });
}

/* -- Alumnos sin turno -------------------------------------------------- */

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function listUnassignedMembers(search?: string): MemberSimple[] {
  const assignedIds = new Set(
    db.turns.filter((turn) => turn.isActive).map((turn) => turn.member.id),
  );

  const available = MOCK_MEMBERS.filter(
    (member) => !assignedIds.has(member.id),
  ).sort((a, b) => a.lastname.localeCompare(b.lastname));

  if (!search?.trim()) return available;

  const needle = normalize(search);
  return available.filter((member) =>
    normalize(`${member.name} ${member.lastname}`).includes(needle),
  );
}

export function mockGetUnassignedMembers(params: {
  page: number;
  size: number;
  search?: string;
}): Promise<PaginatedResponse<MemberSimple>> {
  const all = listUnassignedMembers(params.search);
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

/* -- Escrituras --------------------------------------------------------- */

function findTurn(turnId: string): MemberTurn {
  const turn = db.turns.find((item) => item.id === turnId);
  if (!turn) throw new Error(`No existe el turno ${turnId}`);
  return turn;
}

export function mockAssignTurn(dto: AssignTurnDto): Promise<MemberTurn> {
  const member = MOCK_MEMBERS.find((item) => item.id === dto.memberId);
  if (!member) throw new Error(`No existe el alumno ${dto.memberId}`);

  const alreadyThere = db.turns.some(
    (turn) =>
      turn.isActive &&
      turn.timeSlotId === dto.timeSlotId &&
      turn.member.id === dto.memberId,
  );
  if (alreadyThere) throw new Error("El alumno ya está anotado en ese horario");

  turnSequence += 1;

  const turn: MemberTurn = {
    id: `turn-${turnSequence}`,
    timeSlotId: dto.timeSlotId,
    member,
    startDate: formatDateToISO(new Date()),
    endDate: null,
    isActive: true,
    heldByOwner: false,
  };

  db.turns.push(turn);
  return delay(turn);
}

export function mockMoveTurn(
  turnId: string,
  dto: MoveTurnDto,
): Promise<MemberTurn> {
  const turn = findTurn(turnId);

  const alreadyThere = db.turns.some(
    (item) =>
      item.id !== turnId &&
      item.isActive &&
      item.timeSlotId === dto.timeSlotId &&
      item.member.id === turn.member.id,
  );
  if (alreadyThere) throw new Error("El alumno ya está anotado en ese horario");

  turn.timeSlotId = dto.timeSlotId;
  return delay(turn);
}

export function mockRemoveTurn(turnId: string): Promise<void> {
  const index = db.turns.findIndex((turn) => turn.id === turnId);
  if (index >= 0) db.turns.splice(index, 1);

  return delay(undefined);
}

export function mockSetTurnHold(
  turnId: string,
  dto: SetTurnHoldDto,
): Promise<MemberTurn> {
  const turn = findTurn(turnId);
  turn.heldByOwner = dto.heldByOwner;

  return delay(turn);
}

/* -- Etiquetas ---------------------------------------------------------- */

export function mockGetSlotTags(): Promise<SlotTag[]> {
  return delay([...db.tags]);
}

/* -- ABM de horarios ---------------------------------------------------- */

function findTag(tagId?: string | null): SlotTag | null {
  if (!tagId) return null;
  return db.tags.find((tag) => tag.id === tagId) ?? null;
}

/** Da de alta una hora: crea sus cinco celdas, de lunes a viernes. */
export function mockCreateTimeSlots(
  dto: CreateTimeSlotDto,
): Promise<TimeSlot[]> {
  const exists = db.timeSlots.some((slot) => slot.startTime === dto.startTime);

  if (exists) throw new Error("Ya existe un horario a esa hora");

  const created = SCHEDULE_DAYS.map<TimeSlot>((dayOfWeek) => ({
    id: buildSlotId(dayOfWeek, dto.startTime),
    dayOfWeek,
    startTime: dto.startTime,
    capacity: dto.capacity,
    enabled: true,
    tag: null,
  }));

  db.timeSlots.push(...created);
  return delay(created);
}

export function mockUpdateTimeSlot(
  timeSlotId: string,
  dto: UpdateTimeSlotDto,
): Promise<TimeSlot> {
  const slot = db.timeSlots.find((item) => item.id === timeSlotId);
  if (!slot) throw new Error(`No existe el horario ${timeSlotId}`);

  if (dto.capacity !== undefined) slot.capacity = dto.capacity;
  if (dto.enabled !== undefined) slot.enabled = dto.enabled;
  if (dto.tagId !== undefined) slot.tag = findTag(dto.tagId);

  return delay(slot);
}

/** Elimina una hora entera: las cinco celdas y todo lo que colgaba de ellas. */
export function mockDeleteTimeSlotRow(startTime: string): Promise<void> {
  const removedIds = new Set(
    db.timeSlots
      .filter((slot) => slot.startTime === startTime)
      .map((slot) => slot.id),
  );

  for (let i = db.timeSlots.length - 1; i >= 0; i -= 1) {
    if (removedIds.has(db.timeSlots[i].id)) db.timeSlots.splice(i, 1);
  }

  // Los turnos y bloqueos de esos horarios se van con ellos.
  for (let i = db.turns.length - 1; i >= 0; i -= 1) {
    if (removedIds.has(db.turns[i].timeSlotId)) db.turns.splice(i, 1);
  }
  for (let i = db.overrides.length - 1; i >= 0; i -= 1) {
    if (removedIds.has(db.overrides[i].timeSlotId)) db.overrides.splice(i, 1);
  }

  return delay(undefined);
}

/* -- Cierres y bloqueos ------------------------------------------------- */

let closureSequence = db.closures.length;
let overrideSequence = db.overrides.length;

export function mockCreateClosure(
  dto: CreateClosureDto,
): Promise<CalendarClosure> {
  closureSequence += 1;

  const closure: CalendarClosure = {
    id: `closure-${closureSequence}`,
    type: dto.type,
    startDate: dto.startDate,
    endDate: dto.endDate,
    reason: dto.reason ?? null,
    isAutoGenerated: false,
  };

  db.closures.push(closure);
  return delay(closure);
}

export function mockDeleteClosure(closureId: string): Promise<void> {
  const index = db.closures.findIndex((closure) => closure.id === closureId);
  if (index >= 0) db.closures.splice(index, 1);

  return delay(undefined);
}

export function mockCreateOverride(
  dto: CreateOverrideDto,
): Promise<TimeSlotOverride> {
  const exists = db.overrides.some(
    (override) =>
      override.timeSlotId === dto.timeSlotId && override.date === dto.date,
  );
  if (exists) throw new Error("Ese horario ya está bloqueado en esa fecha");

  overrideSequence += 1;

  const override: TimeSlotOverride = {
    id: `override-${overrideSequence}`,
    timeSlotId: dto.timeSlotId,
    date: dto.date,
    reason: dto.reason ?? null,
  };

  db.overrides.push(override);
  return delay(override);
}

export function mockDeleteOverride(overrideId: string): Promise<void> {
  const index = db.overrides.findIndex((item) => item.id === overrideId);
  if (index >= 0) db.overrides.splice(index, 1);

  return delay(undefined);
}
