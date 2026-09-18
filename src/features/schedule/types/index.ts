import type { MemberSimple } from "@features/members";
import type { MemberPlanType } from "@features/memberPlans";
import type {
  ClosureType,
  ScheduleDay,
  Shift,
  SlotStatus,
  SlotTag,
} from "../constants";

export interface TimeSlot {
  id: string;
  dayOfWeek: ScheduleDay;
  startTime: string;
  endTime: string;
  capacity: number;
  tag?: SlotTag | null;
}

export interface MemberTurn {
  id: string;
  timeSlotId: string;
  member: MemberSimple;
  isActive: boolean;
  onHold: boolean;
}

export interface RecoveryTurn {
  id: string;
  timeSlotId: string;
  date: string;
  member: MemberSimple;
}

export interface CalendarClosure {
  type: ClosureType;
  startDate: string;
  endDate: string;
  reason?: string | null;
}

export interface TimeSlotOverride {
  timeSlotId: string;
  date: string;
  reason?: string | null;
}

export interface ScheduleDayInfo {
  date: string;
  dayOfWeek: ScheduleDay;
  closure?: CalendarClosure | null;
}

export interface ScheduleWeek {
  from: string;
  to: string;
  days: ScheduleDayInfo[];
  timeSlots: TimeSlot[];
  turns: MemberTurn[];
  overrides: TimeSlotOverride[];
  recoveries: RecoveryTurn[];
}

export type SlotRosterEntry =
  | { kind: "turn"; turn: MemberTurn; isOverturn: boolean }
  | { kind: "recovery"; recovery: RecoveryTurn };

interface BaseCell {
  id: string;
  date: string;
  dayOfWeek: ScheduleDay;
  startTime: string;
  endTime: string;
}

export interface SlotCellData extends BaseCell {
  kind: "slot";
  slot: TimeSlot;
  roster: SlotRosterEntry[];
  status: SlotStatus;
}

export interface BlockCellData extends BaseCell {
  kind: "block";
  slot: TimeSlot;
}

export interface ClosedCellData extends BaseCell {
  kind: "closed";
  slot: TimeSlot;
  closure: CalendarClosure;
}

export interface BlockedCellData extends BaseCell {
  kind: "blocked";
  slot: TimeSlot;
  override: TimeSlotOverride;
}

export interface UnavailableCellData extends BaseCell {
  kind: "unavailable";
  capacity: number;
  canOpen: boolean;
  conflicts: TimeSlot[];
}

export type ScheduleCellData =
  | SlotCellData
  | BlockCellData
  | ClosedCellData
  | BlockedCellData
  | UnavailableCellData;

export interface ScheduleRow {
  startTime: string;
  endTime: string;
  shift: Shift;
  cells: ScheduleCellData[];
}

export interface ScheduleGrid {
  days: ScheduleDayInfo[];
  rows: ScheduleRow[];
}

export interface AssignTurnDto {
  timeSlotId: string;
  memberId: string;
}

export interface MoveTurnDto {
  memberTurnId: string;
  memberId: string;
  timeSlotId: string;
}

export interface SetTurnHoldDto {
  onHold: boolean;
}

export interface CreateRecoveryTurnDto {
  timeSlotId: string;
  memberId: string;
  date: string;
}

export type RecoveryTurnMode =
  | { kind: "cell"; slot: TimeSlot; date: string }
  | { kind: "member"; member: MemberSimple };

export interface CreateTimeSlotDto {
  startTime: string;
  endTime?: string;
  capacity: number;
  days: ScheduleDay[];
}

export interface RegisterTimeSlotDto {
  dayOfWeek: ScheduleDay;
  startTime: string;
  endTime: string;
  capacity: number;
}

export interface UpdateTimeSlotDto {
  startTime?: string;
  endTime?: string;
  capacity?: number;
  tag?: SlotTag | null;
}

export type UpdateTimeSlotScope = "cell" | "row";

export interface MemberTurnHistoryEntry {
  id: string;
  timeSlot: TimeSlot;
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
  onHold: boolean;
}

export interface UnassignedMember {
  member: MemberSimple;
  memberPlan?: MemberPlanType;
  turnsAssignedCount: number;
  totalMemberPlanTurns: number;
}

export interface CreateClosureDto {
  type: ClosureType;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface CreateOverrideDto {
  timeSlotId: string;
  date: string;
  reason?: string;
}
