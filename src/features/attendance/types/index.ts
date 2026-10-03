import type { FeeState } from "@features/memberPlans";
import type {
  AttendanceAction,
  AttendanceType,
  FeeStatusIntent,
  FeeStatusKind,
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

export interface AttendanceFee {
  feeState: FeeState;
  endDate: string;
}

export interface AttendanceCheckIn extends Attendance {
  message?: string | null;
  feeMessage?: string | null;
  fee?: AttendanceFee | null;
}

export interface SetAttendanceMoodArgs {
  id: string;
  mood: Mood;
}

export type CheckInPerson = Pick<
  Attendance,
  "name" | "lastname" | "profileImageUrl"
>;

export interface CheckInTimer {
  seconds: number;
  endsAt: number;
}

export interface AttendanceFlowState {
  status: RequestStatus | AttendanceAction;
  response: AttendanceCheckIn | null;
  error: string | null;
  fee?: AttendanceFee | null;
  feeMessage: string | null;
  timer: CheckInTimer | null;
}

export interface FeeStatusView {
  kind: FeeStatusKind;
  intent: FeeStatusIntent;
  label: string;
  dateCaption: string | null;
  date: Date | null;
  countdown: string | null;
  advice: string | null;
  message: string | null;
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
