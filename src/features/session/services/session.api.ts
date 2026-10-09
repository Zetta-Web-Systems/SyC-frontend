import { api } from "@shared/api/api";
import {
  SESSION_BACKEND_READY,
  SESSION_POSITION,
  type SessionPosition,
} from "../constants";
import type {
  CompleteExecutionDto,
  RegisterAbsenceDto,
  RegisterPresenceDto,
  RegisterSessionDto,
  RegisterSessionResponseDto,
  SessionMembersResponseDto,
  SessionPlanDay,
  SessionRegisteredByDto,
  SessionTimeSlotDto,
} from "../types";
import {
  applyBoardMocks,
  applyPlanDayMocks,
  clearAttendanceMock,
  clearExecutionMock,
  mockRegisterAbsenceFromPresent,
  mockRegisterPresence,
  mockRegisterSession,
  mockUndoExecution,
} from "./session.mock";

const BOARD_PARAMS: Record<
  SessionPosition,
  Record<string, boolean> | undefined
> = {
  [SESSION_POSITION.PREV]: { prev: true },
  [SESSION_POSITION.CURRENT]: undefined,
  [SESSION_POSITION.NEXT]: { next: true },
};

export async function getSessionBoard(
  position: SessionPosition,
): Promise<SessionMembersResponseDto> {
  const { data } = await api.get<SessionMembersResponseDto>(
    "/session/list/members",
    {
      params: BOARD_PARAMS[position],
    },
  );
  return applyBoardMocks(data);
}

export async function getSessionPlanDay(
  memberId: string,
  week: number,
  day: number,
): Promise<SessionPlanDay> {
  const { data } = await api.get<SessionPlanDay>(
    "/training-plans/session/day",
    {
      params: { memberId, week, day },
    },
  );
  return applyPlanDayMocks(data);
}

export async function completeExecution(
  executionId: string,
  dto: CompleteExecutionDto,
): Promise<void> {
  if (dto.isCompleted === null && !SESSION_BACKEND_READY.undoExecution) {
    return mockUndoExecution(executionId);
  }

  clearExecutionMock(executionId);
  await api.patch(
    `/training-plans/training-days/planned-exercises/exercise-executions/complete/${executionId}`,
    dto,
  );
}

export async function registerAbsence(
  dto: RegisterAbsenceDto,
  options: { isPresent: boolean; turnStartTime: string },
): Promise<void> {
  if (options.isPresent && !SESSION_BACKEND_READY.absentFromPresent) {
    return mockRegisterAbsenceFromPresent(dto, options.turnStartTime);
  }

  await api.post("/session/absent/register", dto);
  clearAttendanceMock(dto.timeSlotid, dto.memberId);
}

export async function registerPresence(
  dto: RegisterPresenceDto,
): Promise<void> {
  if (!SESSION_BACKEND_READY.registerPresence) return mockRegisterPresence(dto);

  await api.post("/session/present/register", dto);
  clearAttendanceMock(dto.timeSlotId, dto.memberId);
}

export async function registerSession(
  dto: RegisterSessionDto,
  options: {
    timeSlot: SessionTimeSlotDto;
    registeredBy: SessionRegisteredByDto | null;
    isAdmin: boolean;
  },
): Promise<RegisterSessionResponseDto> {
  if (!SESSION_BACKEND_READY.registerSession) {
    return mockRegisterSession(
      dto,
      options.timeSlot,
      options.registeredBy,
      "1A",
    );
  }
  if (options.isAdmin && !SESSION_BACKEND_READY.registerSessionAsAdmin) {
    return mockRegisterSession(
      dto,
      options.timeSlot,
      options.registeredBy,
      "1C",
    );
  }

  const { data } = await api.post<RegisterSessionResponseDto>(
    "/session/register",
    dto,
  );
  return data;
}
