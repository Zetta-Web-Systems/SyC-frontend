import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ATTENDANCE_KEYS } from "../../constants";
import { registerAttendance } from "../../services/attendance.api";

export function useAttendanceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerAttendance,
    meta: { showGlobalError: false },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_KEYS.all });
    },
  });
}
