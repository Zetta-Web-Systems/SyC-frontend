import { formatDateToISO } from "@shared/utils/date.utils";
import { ATTENDANCE_STATE_DTO, type AttendanceStateDto } from "../constants";
import { warnBackendTodo } from "../lib/sessionBackendTodo";
import { formatClockTime } from "../lib/sessionTime";
import type {
  RegisterAbsenceDto,
  RegisterPresenceDto,
  RegisterSessionDto,
  RegisterSessionResponseDto,
  SessionExecution,
  SessionMembersResponseDto,
  SessionPlanDay,
  SessionRegisteredByDto,
  SessionTimeSlotDto,
} from "../types";

interface MockedAttendance {
  state: AttendanceStateDto;
  arrivalTime: string;
  absentReason: string | null;
}

type MockedExecution = Pick<SessionExecution, "isCompleted" | "date">;

const mockedAttendances = new Map<string, MockedAttendance>();
const mockedFinishes = new Map<string, RegisterSessionResponseDto>();
const mockedExecutions = new Map<string, MockedExecution>();

function today(): string {
  return formatDateToISO(new Date());
}

function attendanceKey(timeSlotId: string, memberId: string): string {
  return `${today()}|${timeSlotId}|${memberId}`;
}

function finishKey(timeSlotId: string): string {
  return `${today()}|${timeSlotId}`;
}

export function applyBoardMocks(
  dto: SessionMembersResponseDto,
): SessionMembersResponseDto {
  const finish = mockedFinishes.get(finishKey(dto.timeSlot.id));

  return {
    ...dto,
    ...(finish && !dto.registeredDateTime
      ? {
          registeredDateTime: finish.registeredDateTime,
          registeredBy: finish.registeredBy,
          observations: finish.observations,
        }
      : {}),
    sessionMembers: dto.sessionMembers.map((row) => {
      const mocked = mockedAttendances.get(
        attendanceKey(dto.timeSlot.id, row.member.id),
      );
      if (!mocked) return row;

      return {
        ...row,
        attendanceState: mocked.state,
        attendanceSessionDto: {
          id: `mock-${row.member.id}`,
          attendanceDate: today(),
          arrivalTime: mocked.arrivalTime,
          departureTime: null,
          mood: row.attendanceSessionDto?.mood ?? null,
          isAbsent: mocked.state === ATTENDANCE_STATE_DTO.ABSENT,
          absentReason: mocked.absentReason,
        },
      };
    }),
  };
}

export function applyPlanDayMocks(dto: SessionPlanDay): SessionPlanDay {
  if (mockedExecutions.size === 0) return dto;

  return {
    ...dto,
    trainingDays: dto.trainingDays.map((day) => ({
      ...day,
      plannedExercises: day.plannedExercises.map((pe) => ({
        ...pe,
        exerciseExecutions: pe.exerciseExecutions.map((execution) => ({
          ...execution,
          ...mockedExecutions.get(execution.id),
        })),
      })),
    })),
  };
}

export function clearAttendanceMock(
  timeSlotId: string,
  memberId: string,
): void {
  mockedAttendances.delete(attendanceKey(timeSlotId, memberId));
}

export function clearExecutionMock(executionId: string): void {
  mockedExecutions.delete(executionId);
}

export async function mockRegisterPresence(
  dto: RegisterPresenceDto,
): Promise<void> {
  warnBackendTodo(
    "4",
    "POST /session/present/register no existe. La asistencia se simula en esta tablet y se pierde al recargar.",
  );
  mockedAttendances.set(attendanceKey(dto.timeSlotId, dto.memberId), {
    state: ATTENDANCE_STATE_DTO.PRESENT,
    arrivalTime: formatClockTime(new Date()),
    absentReason: null,
  });
}

export async function mockRegisterAbsenceFromPresent(
  dto: RegisterAbsenceDto,
  turnStartTime: string,
): Promise<void> {
  warnBackendTodo(
    "5B",
    "Falta que el back confirme si se puede pasar de presente a ausente (hoy crearía una segunda asistencia). La ausencia se simula en esta tablet.",
  );
  mockedAttendances.set(attendanceKey(dto.timeSlotid, dto.memberId), {
    state: ATTENDANCE_STATE_DTO.ABSENT,
    arrivalTime: turnStartTime,
    absentReason: dto.absentReason ?? null,
  });
}

export async function mockUndoExecution(executionId: string): Promise<void> {
  warnBackendTodo(
    "3A",
    "El PATCH de la ejecución no acepta isCompleted: null. Desmarcar se simula en esta tablet y se pierde al recargar.",
  );
  mockedExecutions.set(executionId, { isCompleted: null, date: null });
}

export async function mockRegisterSession(
  dto: RegisterSessionDto,
  timeSlot: SessionTimeSlotDto,
  registeredBy: SessionRegisteredByDto | null,
  reason: "1A" | "1C",
): Promise<RegisterSessionResponseDto> {
  warnBackendTodo(
    reason,
    reason === "1A"
      ? "POST /session/register rechaza los turnos que ya empezaron (la validación de hora está al revés). Finalizar se simula en esta tablet."
      : "POST /session/register da 404 a un ADMIN porque no es profe. Finalizar se simula en esta tablet.",
  );

  const response: RegisterSessionResponseDto = {
    timeSlot,
    registeredDateTime: `${today()} ${formatClockTime(new Date())}`,
    registeredBy,
    observations: dto.observations ?? null,
  };
  mockedFinishes.set(finishKey(dto.timeSlotId), response);

  return response;
}
