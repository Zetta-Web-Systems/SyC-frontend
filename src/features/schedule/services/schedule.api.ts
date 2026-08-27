import { api } from "@shared/api/api";
import { getApiErrorMessage } from "@shared/api/apiError";
import { formatDateToISO } from "@shared/utils/date.utils";
import type { PaginatedResponse } from "@shared/types/pagination.types";
import type { MemberSimple } from "@features/members";
import {
  mockDeleteOverride,
  mockDeleteTimeSlotRow,
  mockGetUnassignedMembers,
  mockMoveTurn,
  mockSetTurnHold,
  mockUpdateTimeSlot,
} from "../data/schedule.mock";
import {
  SCHEDULE_DAYS,
  SCHEDULE_DAY_LABELS,
  type ClosureType,
} from "../constants";
import {
  mapTimeSlotWrite,
  mapWeeklyScheduleResponse,
  type RawTimeSlotWrite,
  type RawWeeklySchedule,
} from "../lib/scheduleApiMapper";
import { getSlotEndTime, normalizeTime } from "../lib/slotStatus";
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
  TimeSlot,
  TimeSlotOverride,
  UpdateTimeSlotDto,
} from "../types";

export async function getScheduleWeek(date: string): Promise<ScheduleWeek> {
  const { data } = await api.get<RawWeeklySchedule>("/schedule", {
    params: { date },
  });

  return mapWeeklyScheduleResponse(data);
}

/**
 * TEMP: sin endpoint todavía (`GET /schedule/members/unassigned`)
 * El panel "Sin asignar" queda deshabilitado para arrastrar mientras tanto.
 */
export async function getUnassignedMembers(params: {
  page: number;
  size: number;
  search?: string;
}): Promise<PaginatedResponse<MemberSimple>> {
  return mockGetUnassignedMembers(params);
}

export async function assignTurn(dto: AssignTurnDto): Promise<MemberTurn> {
  const { data } = await api.post<RawTimeSlotWrite>(
    `/schedule/time-slot/${dto.timeSlotId}/add-member/${dto.memberId}`,
  );

  const rawTurn = data.memberTurns.find(
    (turn) => turn.member.id === dto.memberId,
  );
  if (!rawTurn) {
    throw new Error("El alumno no fue anotado en el horario.");
  }

  return {
    id: rawTurn.id,
    timeSlotId: data.id,
    member: rawTurn.member,
    startDate: formatDateToISO(new Date()),
    endDate: null,
    isActive: rawTurn.isActive,
    onHold: rawTurn.onHold,
  };
}

/**
 * TEMP: sin endpoint todavía (mover un MemberTurn entre TimeSlot). Deshabilitado en el drag&drop entre celdas
 */
export async function moveTurn(
  turnId: string,
  dto: MoveTurnDto,
): Promise<MemberTurn> {
  return mockMoveTurn(turnId, dto);
}

export async function removeTurn(turnId: string): Promise<void> {
  await api.delete(`/schedule/time-slot/member-turn/${turnId}`);
}

/**
 * TEMP: sin endpoint todavía (poner/sacar onHold). Deshabilitado en el menú del alumno
 */
export async function setTurnHold(
  turnId: string,
  dto: SetTurnHoldDto,
): Promise<MemberTurn> {
  return mockSetTurnHold(turnId, dto);
}

/**
 * Da de alta una hora nueva de lunes a viernes. El backend registra una celda (un día)
 * por llamada, no la fila entera de una — se hacen 5 POST secuenciales, validando antes
 * contra la semana ya cargada que ninguno de los 5 días tenga ya una hora solapada
 * (así se evita la causa más común de quedar a mitad de camino). Si igual falla una llamada
 * intermedia, se informa qué días quedaron creados y cuál falló.
 */
export async function createTimeSlots(
  dto: CreateTimeSlotDto,
  currentWeek: ScheduleWeek | undefined,
): Promise<TimeSlot[]> {
  const startTime = normalizeTime(dto.startTime);
  const endTime = getSlotEndTime(startTime);

  const overlapping = (currentWeek?.timeSlots ?? []).filter(
    (slot) => slot.isActive && normalizeTime(slot.startTime) === startTime,
  );

  if (overlapping.length > 0) {
    const days = overlapping
      .map((slot) => SCHEDULE_DAY_LABELS[slot.dayOfWeek])
      .join(", ");
    throw new Error(`Ya existe un horario a esa hora los días: ${days}.`);
  }

  const created: TimeSlot[] = [];

  for (const dayOfWeek of SCHEDULE_DAYS) {
    try {
      const { data } = await api.post<RawTimeSlotWrite>(
        "/schedule/time-slot/register",
        { dayOfWeek, startTime, endTime, capacity: dto.capacity },
      );
      created.push(mapTimeSlotWrite(data));
    } catch (error) {
      const doneLabel = created
        .map((slot) => SCHEDULE_DAY_LABELS[slot.dayOfWeek])
        .join(", ");
      const doneNote = doneLabel
        ? `El horario fue creado correctamente los días: ${doneLabel}. `
        : "";

      throw new Error(
        `${doneNote}No se pudo crear el horario del día ${SCHEDULE_DAY_LABELS[dayOfWeek]}: ${getApiErrorMessage(error)}`,
      );
    }
  }

  return created;
}

/**
 * TEMP: sin endpoint todavía (PATCH de TimeSlot). Deshabilitado en el menú del horario
 */
export async function updateTimeSlot(
  timeSlotId: string,
  dto: UpdateTimeSlotDto,
): Promise<TimeSlot> {
  return mockUpdateTimeSlot(timeSlotId, dto);
}

/**
 * TEMP: sin endpoint todavía (eliminar/desactivar TimeSlot). Deshabilitado
 * en el menú del horario (ver CellMenu).
 */
export async function deleteTimeSlotRow(startTime: string): Promise<void> {
  return mockDeleteTimeSlotRow(startTime);
}

interface RawScheduleClosure {
  id: string;
  date: string;
  type: ClosureType;
  reason?: string;
}

export async function createClosure(
  dto: CreateClosureDto,
): Promise<CalendarClosure> {
  const { data } = await api.post<RawScheduleClosure[]>(
    "/schedule/closure",
    dto,
  );
  const first = data[0];
  const last = data[data.length - 1];

  return {
    id: first.id,
    type: first.type,
    startDate: first.date,
    endDate: last.date,
    reason: first.reason ?? null,
  };
}

export async function deleteClosure(date: string): Promise<void> {
  await api.delete("/schedule/closure", { params: { date } });
}

export async function createOverride(
  dto: CreateOverrideDto,
): Promise<TimeSlotOverride> {
  const { data } = await api.post<TimeSlotOverride>(
    "/schedule/time-slot/override",
    { timeSlotId: dto.timeSlotId, date: dto.date, reason: dto.reason },
  );

  return {
    id: data.id,
    timeSlotId: data.timeSlotId,
    date: data.date,
    reason: data.reason ?? null,
  };
}

/**
 * TEMP: sin endpoint todavía (eliminar TimeSlotOverride). Deshabilitado en el menú del horario bloqueado
 */
export async function deleteOverride(overrideId: string): Promise<void> {
  return mockDeleteOverride(overrideId);
}
