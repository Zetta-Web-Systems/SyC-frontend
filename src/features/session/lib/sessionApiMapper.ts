import { formatTimeShort } from "@shared/utils/date.utils";
import {
  ATTENDANCE_STATE,
  ATTENDANCE_STATE_DTO,
  type AttendanceState,
  type AttendanceStateDto,
} from "../constants";
import type {
  RegisterSessionResponseDto,
  SessionBoard,
  SessionFinish,
  SessionMember,
  SessionMemberDto,
  SessionMembersResponseDto,
  SessionRegisteredByDto,
} from "../types";
import { getSessionMemberPlan } from "./sessionMemberPlan";
import { getDateTimeClock } from "./sessionTime";

const STATE_FROM_DTO: Record<AttendanceStateDto, AttendanceState> = {
  [ATTENDANCE_STATE_DTO.PRESENT]: ATTENDANCE_STATE.PRESENT,
  [ATTENDANCE_STATE_DTO.PENDING]: ATTENDANCE_STATE.PENDING,
  [ATTENDANCE_STATE_DTO.ABSENT]: ATTENDANCE_STATE.ABSENT,
};

export function mapSessionMember(dto: SessionMemberDto): SessionMember {
  const attendance = dto.attendanceSessionDto;

  return {
    member: dto.member,
    attendanceState: STATE_FROM_DTO[dto.attendanceState],
    attendance: attendance
      ? {
          arrivalTime: attendance.isAbsent
            ? null
            : formatTimeShort(attendance.arrivalTime),
          mood: attendance.mood ?? null,
          absentReason: attendance.absentReason ?? null,
        }
      : null,
    plan: getSessionMemberPlan(dto),
    dayProgress: dto.dayProgress
      ? {
          done: dto.dayProgress.completed,
          total: dto.dayProgress.total,
          currentExercise: dto.dayProgress.currentExercise?.name ?? null,
        }
      : null,
  };
}

function getRegisteredByName(
  registeredBy: SessionRegisteredByDto | null | undefined,
): string | null {
  if (!registeredBy) return null;
  const name = registeredBy.name ?? registeredBy.person?.name;
  const lastname = registeredBy.lastname ?? registeredBy.person?.lastname;
  return name ? `${name} ${lastname ?? ""}`.trim() : null;
}

export function mapSessionFinish(
  dto: SessionMembersResponseDto | RegisterSessionResponseDto,
): SessionFinish | null {
  if (!dto.registeredDateTime) return null;

  return {
    finishedAt: getDateTimeClock(dto.registeredDateTime),
    finishedBy: getRegisteredByName(dto.registeredBy),
    observations: dto.observations || null,
  };
}

export function mapSessionBoard(dto: SessionMembersResponseDto): SessionBoard {
  return {
    turn: {
      timeSlotId: dto.timeSlot.id,
      dayOfWeek: dto.timeSlot.dayOfWeek,
      startTime: dto.timeSlot.startTime,
      endTime: dto.timeSlot.endTime,
      capacity: dto.timeSlot.capacity,
      tag: dto.timeSlot.tag,
    },
    members: dto.sessionMembers.map(mapSessionMember),
    finish: mapSessionFinish(dto),
  };
}
