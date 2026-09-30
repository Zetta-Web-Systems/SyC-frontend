import type { MemberSimple } from "@features/members";
import {
  CLOSURE_TYPE,
  type ClosureType,
  type ScheduleDay,
  type SlotTag,
} from "../constants";
import type {
  MemberTurn,
  RecoveryTurn,
  ScheduleDayInfo,
  ScheduleWeek,
  TimeSlot,
  TimeSlotOverride,
} from "../types";
import { groupConsecutiveClosures } from "./scheduleClosures";

interface RawMemberTurn {
  id: string;
  member: MemberSimple;
  isActive: boolean;
  onHold: boolean;
}

interface RawRecoveryTurn {
  id: string;
  member: MemberSimple;
}

interface RawScheduleTimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  capacity: number;
  memberTurns: RawMemberTurn[];
  recoveryTurns?: RawRecoveryTurn[];
  isActive: boolean;
  isClosed: boolean;
  closureReason?: string;
  tag?: SlotTag | null;
}

interface RawScheduleDay {
  date: string;
  dayOfWeek: ScheduleDay;
  timeSlots: RawScheduleTimeSlot[];
  isClosed: boolean;
  closureReason?: string;
  closureType?: ClosureType;
}

export interface RawWeeklySchedule {
  weekStart: string;
  weekEnd: string;
  days: RawScheduleDay[];
}

export interface RawTimeSlotWrite {
  id: string;
  dayOfWeek: ScheduleDay;
  startTime: string;
  endTime: string;
  capacity: number;
  memberTurns: RawMemberTurn[];
  isActive: boolean;
  tag?: SlotTag | null;
}

function mapMemberTurn(raw: RawMemberTurn, timeSlotId: string): MemberTurn {
  return {
    id: raw.id,
    timeSlotId,
    member: raw.member,
    isActive: raw.isActive,
    onHold: raw.onHold,
  };
}

export function mapWeeklyScheduleResponse(
  raw: RawWeeklySchedule,
): ScheduleWeek {
  const days: ScheduleDayInfo[] = [];
  const timeSlots: TimeSlot[] = [];
  const turns: MemberTurn[] = [];
  const overrides: TimeSlotOverride[] = [];
  const recoveries: RecoveryTurn[] = [];

  for (const day of raw.days) {
    days.push({
      date: day.date,
      dayOfWeek: day.dayOfWeek,
      closure: day.isClosed
        ? {
            type: day.closureType ?? CLOSURE_TYPE.OTHER,
            startDate: day.date,
            endDate: day.date,
            reason: day.closureReason ?? null,
          }
        : null,
    });

    for (const slot of day.timeSlots) {
      timeSlots.push({
        id: slot.id,
        dayOfWeek: day.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        capacity: slot.capacity,
        tag: slot.tag ?? null,
      });

      for (const turn of slot.memberTurns) {
        turns.push(mapMemberTurn(turn, slot.id));
      }

      for (const recovery of slot.recoveryTurns ?? []) {
        recoveries.push({
          id: recovery.id,
          timeSlotId: slot.id,
          date: day.date,
          member: recovery.member,
        });
      }

      // INFO: El `isClosed` de la celda es del TimeSlotOverride, distinto del `isClosed` del día (que es el CalendarClosure de arriba)
      if (slot.isClosed) {
        overrides.push({
          timeSlotId: slot.id,
          date: day.date,
          reason: slot.closureReason ?? null,
        });
      }
    }
  }

  return {
    from: raw.weekStart,
    to: raw.weekEnd,
    days: groupConsecutiveClosures(days),
    timeSlots,
    turns,
    overrides,
    recoveries,
  };
}

export function mapTimeSlotWrite(raw: RawTimeSlotWrite): TimeSlot {
  return {
    id: raw.id,
    dayOfWeek: raw.dayOfWeek,
    startTime: raw.startTime,
    endTime: raw.endTime,
    capacity: raw.capacity,
    tag: raw.tag ?? null,
  };
}
