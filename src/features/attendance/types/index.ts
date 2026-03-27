const ATTENDANCE_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  ENTRY: "entry",
  EXIT: "exit",
  ERROR: "error",
} as const;

type AttendanceStatus =
  (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];

interface AttendanceResponse {
  id: string;
  attendanceDate: string;
  arrivalTime: string;
  name: string;
  lastname: string;
  dni: string;
  type: string;
  departureTime: string | null;
  message: string | null;
}

export { ATTENDANCE_STATUS };
export type { AttendanceStatus, AttendanceResponse };
