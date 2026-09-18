import { api } from "@shared/api/api";
import { buildPaginatedParams } from "@shared/utils/pagination.utils";
import type { PaginatedResponse } from "@shared/types/pagination.types";
import type { MemberSimple } from "@features/members";
import type { ClosureType } from "../constants";
import {
  mapTimeSlotWrite,
  mapWeeklyScheduleResponse,
  type RawTimeSlotWrite,
  type RawWeeklySchedule,
} from "../lib/scheduleApiMapper";
import type {
  AssignTurnDto,
  CalendarClosure,
  CreateClosureDto,
  CreateOverrideDto,
  CreateRecoveryTurnDto,
  MemberTurnHistoryEntry,
  MoveTurnDto,
  RegisterTimeSlotDto,
  ScheduleWeek,
  SetTurnHoldDto,
  TimeSlot,
  TimeSlotOverride,
  UnassignedMember,
  UpdateTimeSlotDto,
} from "../types";

interface RawMemberTurnHold {
  member: MemberSimple;
  onHold: boolean;
}

interface RawScheduleClosure {
  id: string;
  date: string;
  type: ClosureType;
  reason?: string;
}

export async function getScheduleWeek(date: string): Promise<ScheduleWeek> {
  const { data } = await api.get<RawWeeklySchedule>("/schedule", {
    params: { date },
  });

  return mapWeeklyScheduleResponse(data);
}

export async function getUnassignedMembers(params: {
  page: number;
  size: number;
  search?: string;
}): Promise<PaginatedResponse<UnassignedMember>> {
  const { data } = await api.get<PaginatedResponse<UnassignedMember>>(
    "/members/list/paginated/unassigned",
    { params: buildPaginatedParams(params) },
  );

  return data;
}

export async function getMemberTurnHistory(
  memberId: string,
): Promise<MemberTurnHistoryEntry[]> {
  const { data } = await api.get<MemberTurnHistoryEntry[]>(
    `/schedule/time-slot/member-turn/member/${memberId}`,
  );

  return data;
}

export async function assignTurn(dto: AssignTurnDto): Promise<void> {
  await api.post("/schedule/time-slot/add-member", undefined, {
    params: { timeSlotId: dto.timeSlotId, memberId: dto.memberId },
  });
}

export async function moveTurn(dto: MoveTurnDto): Promise<void> {
  await api.post("/schedule/time-slot/move-member", undefined, {
    params: {
      memberTurnId: dto.memberTurnId,
      memberId: dto.memberId,
      timeSlotId: dto.timeSlotId,
    },
  });
}

export async function removeTurn(turnId: string): Promise<void> {
  await api.delete(`/schedule/time-slot/member-turn/${turnId}`);
}

export async function setTurnHold(
  turnId: string,
  dto: SetTurnHoldDto,
): Promise<RawMemberTurnHold> {
  const { data } = await api.patch<RawMemberTurnHold>(
    `/schedule/time-slot/member-turn/on-hold/${turnId}`,
    undefined,
    { params: { "on-hold": dto.onHold } },
  );

  return data;
}

export async function addRecoveryTurn(
  dto: CreateRecoveryTurnDto,
): Promise<void> {
  await api.post("/schedule/time-slot/add-recovery-turn", undefined, {
    params: {
      timeSlotId: dto.timeSlotId,
      memberId: dto.memberId,
      date: dto.date,
    },
  });
}

export async function deleteRecoveryTurn(recoveryId: string): Promise<void> {
  await api.delete(`/schedule/time-slot/delete-recovery-turn/${recoveryId}`);
}

export async function registerTimeSlot(
  dto: RegisterTimeSlotDto,
): Promise<TimeSlot> {
  const { data } = await api.post<RawTimeSlotWrite>(
    "/schedule/time-slot/register",
    dto,
  );

  return mapTimeSlotWrite(data);
}

export async function updateTimeSlot(
  timeSlotId: string,
  dto: UpdateTimeSlotDto,
): Promise<TimeSlot> {
  const { data } = await api.patch<RawTimeSlotWrite>(
    `/schedule/time-slot/${timeSlotId}`,
    dto,
  );

  return mapTimeSlotWrite(data);
}

export async function deleteTimeSlot(timeSlotId: string): Promise<void> {
  await api.delete(`/schedule/time-slot/${timeSlotId}`);
}

export async function createClosure(
  dto: CreateClosureDto,
): Promise<CalendarClosure> {
  const { data } = await api.post<RawScheduleClosure[]>(
    "/schedule/closure",
    dto,
  );

  if (data.length === 0) {
    throw new Error(
      "No se registró ningún cierre para esas fechas. Puede que ya estuvieran cerradas.",
    );
  }

  const first = data[0];
  const last = data[data.length - 1];

  return {
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
    timeSlotId: data.timeSlotId,
    date: data.date,
    reason: data.reason ?? null,
  };
}

export async function deleteOverride(
  date: string,
  timeSlotId: string,
): Promise<void> {
  await api.delete("/schedule/time-slot/override", {
    params: { date, timeSlotId },
  });
}
