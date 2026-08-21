import { api } from "@shared/api/api";
import type { PaginatedResponse } from "@shared/types/pagination.types";
import type { MemberSimple } from "@features/members";
import {
  mockAssignTurn,
  mockCreateClosure,
  mockCreateOverride,
  mockCreateTimeSlots,
  mockDeleteClosure,
  mockDeleteOverride,
  mockDeleteTimeSlotRow,
  mockGetScheduleWeek,
  mockGetSlotTags,
  mockGetUnassignedMembers,
  mockMoveTurn,
  mockRemoveTurn,
  mockSetTurnHold,
  mockUpdateTimeSlot,
} from "../data/schedule.mock";
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

/**
 * TEMP: hasta que labures wachin
 */
const USE_SCHEDULE_MOCK = true;

export async function getScheduleWeek(
  from: string,
  to: string,
): Promise<ScheduleWeek> {
  if (USE_SCHEDULE_MOCK) return mockGetScheduleWeek(from, to);

  const { data } = await api.get<ScheduleWeek>("/schedule/week", {
    params: { from, to },
  });

  return data;
}

export async function getUnassignedMembers(params: {
  page: number;
  size: number;
  search?: string;
}): Promise<PaginatedResponse<MemberSimple>> {
  if (USE_SCHEDULE_MOCK) return mockGetUnassignedMembers(params);

  const { data } = await api.get<PaginatedResponse<MemberSimple>>(
    "/schedule/members/unassigned",
    { params },
  );

  return data;
}

export async function assignTurn(dto: AssignTurnDto): Promise<MemberTurn> {
  if (USE_SCHEDULE_MOCK) return mockAssignTurn(dto);

  const { data } = await api.post<MemberTurn>("/schedule/turns", dto);
  return data;
}

export async function moveTurn(
  turnId: string,
  dto: MoveTurnDto,
): Promise<MemberTurn> {
  if (USE_SCHEDULE_MOCK) return mockMoveTurn(turnId, dto);

  const { data } = await api.patch<MemberTurn>(
    `/schedule/turns/${turnId}`,
    dto,
  );
  return data;
}

export async function removeTurn(turnId: string): Promise<void> {
  if (USE_SCHEDULE_MOCK) return mockRemoveTurn(turnId);

  await api.delete(`/schedule/turns/${turnId}`);
}

export async function setTurnHold(
  turnId: string,
  dto: SetTurnHoldDto,
): Promise<MemberTurn> {
  if (USE_SCHEDULE_MOCK) return mockSetTurnHold(turnId, dto);

  const { data } = await api.patch<MemberTurn>(
    `/schedule/turns/${turnId}`,
    dto,
  );
  return data;
}

export async function getSlotTags(): Promise<SlotTag[]> {
  if (USE_SCHEDULE_MOCK) return mockGetSlotTags();

  const { data } = await api.get<SlotTag[]>("/schedule/tags");
  return data;
}

export async function createTimeSlots(
  dto: CreateTimeSlotDto,
): Promise<TimeSlot[]> {
  if (USE_SCHEDULE_MOCK) return mockCreateTimeSlots(dto);

  const { data } = await api.post<TimeSlot[]>("/schedule/time-slots", dto);
  return data;
}

export async function updateTimeSlot(
  timeSlotId: string,
  dto: UpdateTimeSlotDto,
): Promise<TimeSlot> {
  if (USE_SCHEDULE_MOCK) return mockUpdateTimeSlot(timeSlotId, dto);

  const { data } = await api.patch<TimeSlot>(
    `/schedule/time-slots/${timeSlotId}`,
    dto,
  );
  return data;
}

export async function deleteTimeSlotRow(startTime: string): Promise<void> {
  if (USE_SCHEDULE_MOCK) return mockDeleteTimeSlotRow(startTime);

  await api.delete("/schedule/time-slots", { params: { startTime } });
}

export async function createClosure(
  dto: CreateClosureDto,
): Promise<CalendarClosure> {
  if (USE_SCHEDULE_MOCK) return mockCreateClosure(dto);

  const { data } = await api.post<CalendarClosure>("/schedule/closures", dto);
  return data;
}

export async function deleteClosure(closureId: string): Promise<void> {
  if (USE_SCHEDULE_MOCK) return mockDeleteClosure(closureId);

  await api.delete(`/schedule/closures/${closureId}`);
}

export async function createOverride(
  dto: CreateOverrideDto,
): Promise<TimeSlotOverride> {
  if (USE_SCHEDULE_MOCK) return mockCreateOverride(dto);

  const { data } = await api.post<TimeSlotOverride>(
    `/schedule/time-slots/${dto.timeSlotId}/overrides`,
    { date: dto.date, reason: dto.reason },
  );
  return data;
}

export async function deleteOverride(overrideId: string): Promise<void> {
  if (USE_SCHEDULE_MOCK) return mockDeleteOverride(overrideId);

  await api.delete(`/schedule/overrides/${overrideId}`);
}
