import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ATTENDANCE_KEYS } from "../../constants";
import { setAttendanceMood } from "../../services/attendance.api";
import type { SetAttendanceMoodArgs } from "../../types";

export function useAttendanceMoodMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, mood }: SetAttendanceMoodArgs) =>
      setAttendanceMood(id, mood),
    meta: { showGlobalError: false },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_KEYS.all });
    },
  });
}
