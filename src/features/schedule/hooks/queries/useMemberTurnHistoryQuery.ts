import { useQuery } from "@tanstack/react-query";
import { getMemberTurnHistory } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";

export function useMemberTurnHistoryQuery(memberId: string, enabled = true) {
  return useQuery({
    queryKey: SCHEDULE_KEYS.memberTurns(memberId),
    queryFn: () => getMemberTurnHistory(memberId),
    enabled: enabled && !!memberId,
  });
}
