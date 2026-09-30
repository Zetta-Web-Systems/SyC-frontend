import type {
  AttendanceAction,
  AttendanceType,
  Mood,
  RequestStatus,
} from "../constants";

export interface Attendance {
  id: string;
  attendanceDate: string;
  arrivalTime?: string | null;
  departureTime?: string | null;
  personId: string;
  name: string;
  lastname: string;
  dni: string;
  type: AttendanceType;
  profileImageUrl?: string | null;
  mood?: Mood | null;
  isAbsent: boolean;
  absentReason?: string | null;
}

export interface AttendanceCheckIn extends Attendance {
  message?: string | null;
  feeMessage?: string | null;
}

export interface SetAttendanceMoodArgs {
  id: string;
  mood: Mood;
}

export interface AttendanceFlowState {
  status: RequestStatus | AttendanceAction;
  response: AttendanceCheckIn | null;
  error: string | null;
  moodMessage: string | null;
  feeMessage: string | null;
  profileImageUrl: string | null;
}

export interface AttendanceKeypadState {
  isValid: boolean;
  canAddDigit: boolean;
  isEmpty: boolean;
  disabled: boolean;
}

export interface AttendanceErrorState {
  message: string | null;
  visible: boolean;
}
