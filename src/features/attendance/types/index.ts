import type { AttendanceType } from "../constants";

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
