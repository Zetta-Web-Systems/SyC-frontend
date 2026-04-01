export type AttendanceType = "INSTRUCTOR" | "MEMBER";

interface BaseAttendance {
  id: string;
  attendanceDate: string;
  arrivalTime: string;
  departureTime?: string | null;
}

export interface AttendanceResponse extends BaseAttendance {
  name: string;
  lastName: string;
  dni: string;
  type: AttendanceType;
  message: string | null;
}

export interface AttendanceInstructorResponse extends BaseAttendance {
  departureRegistered: boolean;
}
