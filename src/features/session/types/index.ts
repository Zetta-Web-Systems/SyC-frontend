import type { Mood } from "@features/attendance";
import type { MemberSimple } from "@features/members";
import type { ScheduleDay, SlotTag } from "@features/schedule";
import type {
  ExerciseExecution,
  PlannedExercise,
  TrainingDay,
  TrainingPlan,
} from "@features/trainingPlan";
import type {
  AttendanceState,
  AttendanceStateDto,
  SessionPosition,
  SessionView,
} from "../constants";

export interface SessionTimeSlotDto {
  id: string;
  dayOfWeek: ScheduleDay;
  startTime: string;
  endTime: string;
  capacity: number;
  tag: SlotTag | null;
}

export interface SessionTrainingDayDto {
  id: string;
  order: number;
  dayName?: string | null;
  trainingDayLabel?: string | null;
}

export interface SessionAttendanceDto {
  id: string;
  attendanceDate: string;
  arrivalTime: string;
  departureTime?: string | null;
  mood?: Mood | null;
  isAbsent: boolean;
  absentReason?: string | null;
}

export interface SessionCurrentExerciseDto {
  plannedExerciseId: string;
  name: string;
}

export interface SessionDayProgressDto {
  completed: number;
  total: number;
  currentExercise: SessionCurrentExerciseDto | null;
}

export interface SessionMemberDto {
  member: MemberSimple;
  attendanceState: AttendanceStateDto;
  currentWeek: number | null;
  currentTrainingDay: SessionTrainingDayDto | null;
  attendanceSessionDto?: SessionAttendanceDto;
  planDaysPerWeek?: number;
  planDurationInWeeks?: number;
  dayProgress?: SessionDayProgressDto | null;
}

export interface SessionPersonDto {
  name: string;
  lastname: string;
}

export interface SessionRegisteredByDto {
  id: string;
  name?: string;
  lastname?: string;
  person?: SessionPersonDto;
}

interface SessionRegistrationDto {
  registeredDateTime?: string;
  registeredBy?: SessionRegisteredByDto | null;
  observations?: string | null;
}

export interface SessionMembersResponseDto extends SessionRegistrationDto {
  timeSlot: SessionTimeSlotDto;
  sessionMembers: SessionMemberDto[];
}

export interface RegisterSessionDto {
  timeSlotId: string;
  observations?: string;
}

export interface RegisterSessionResponseDto extends SessionRegistrationDto {
  timeSlot: SessionTimeSlotDto;
}

export interface RegisterAbsenceDto {
  memberId: string;
  timeSlotid: string;
  absentReason?: string;
}

export interface RegisterPresenceDto {
  memberId: string;
  timeSlotId: string;
}

export interface CompleteExecutionDto {
  isCompleted?: boolean | null;
  instructorObservations?: string | null;
}

export interface SessionSearch {
  at?: Exclude<SessionPosition, "current">;
  view?: SessionView;
  member?: string;
  week?: number;
  day?: number;
}

export interface SessionTurn {
  timeSlotId: string;
  dayOfWeek: ScheduleDay;
  startTime: string;
  endTime: string;
  capacity: number;
  tag: SlotTag | null;
}

export interface SessionAttendance {
  arrivalTime: string | null;
  mood: Mood | null;
  absentReason: string | null;
}

interface PlanSize {
  weeks: number;
  daysPerWeek: number;
}

export type SessionMemberPlan =
  | { kind: "none" }
  | ({ kind: "outOfRange" } & PlanSize)
  | ({ kind: "weekDone"; week: number } & PlanSize)
  | ({
      kind: "current";
      week: number;
      day: number;
      dayLabel: string | null;
    } & PlanSize);

export interface MemberDayProgress {
  done: number;
  total: number;
  currentExercise: string | null;
}

export interface SessionMember {
  member: MemberSimple;
  attendanceState: AttendanceState;
  attendance: SessionAttendance | null;
  plan: SessionMemberPlan;
  dayProgress: MemberDayProgress | null;
}

export interface SessionFinish {
  finishedAt: string;
  finishedBy: string | null;
  observations: string | null;
}

export interface SessionBoard {
  turn: SessionTurn;
  members: SessionMember[];
  finish: SessionFinish | null;
}

export interface SessionSearchGroup {
  position: SessionPosition;
  turn: SessionTurn;
  members: SessionMember[];
}

export interface PlanDayPosition {
  week: number;
  day: number;
}

export interface SessionDayOverride extends PlanDayPosition {
  dayLabel: string | null;
}

export interface SessionExecution extends ExerciseExecution {
  isCompleted: boolean | null;
  instructorObservations: string | null;
  date: string | null;
}

export interface SessionPlannedExercise extends Omit<
  PlannedExercise,
  "exerciseExecutions"
> {
  exerciseExecutions: SessionExecution[];
}

export interface SessionTrainingDay extends Omit<
  TrainingDay,
  "plannedExercises"
> {
  plannedExercises: SessionPlannedExercise[];
}

export interface SessionPlanDay extends Omit<TrainingPlan, "trainingDays"> {
  trainingDays: SessionTrainingDay[];
}
