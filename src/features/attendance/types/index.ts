import type { AttendanceType, Mood } from "../constants";

interface BaseAttendance {
  id: string;
  attendanceDate: string;
  arrivalTime: string;
}

export interface AttendanceCheckIn extends BaseAttendance {
  name: string;
  lastName: string;
  dni: string;
  type: AttendanceType;
  departureTime?: string | null;
  message: string | null;
  mood?: Mood | null;
}

export interface AttendanceMoodUpdate {
  id: string;
  mood: Mood;
  profileImageUrl?: string | null;
  message?: string | null;
}

export interface Attendance extends BaseAttendance {
  departureTime?: string;
  personId: string;
  name: string;
  lastname: string;
  dni: string;
  type: AttendanceType;
  profileImageUrl?: string;
}
