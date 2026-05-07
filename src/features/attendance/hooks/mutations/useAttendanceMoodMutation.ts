import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ATTENDANCE_KEYS, type Mood } from "../../constants";
import { setAttendanceMood } from "../../services/attendance.api";

interface SetMoodArgs {
  id: string;
  mood: Mood;
}

export function useAttendanceMoodMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, mood }: SetMoodArgs) => setAttendanceMood(id, mood),
    meta: { showGlobalError: false },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_KEYS.all });
    },
  });
}
