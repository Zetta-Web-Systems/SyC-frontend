import { useMutation } from "@tanstack/react-query";
import { registerAttendance } from "../../services/attendance.api";

export function useAttendanceMutation() {
  return useMutation({
    mutationFn: registerAttendance,
    meta: { showGlobalError: false },
  });
}
