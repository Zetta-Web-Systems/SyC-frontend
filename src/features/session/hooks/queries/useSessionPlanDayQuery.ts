import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { SESSION_KEYS } from "../../constants";
import { getSessionPlanDay } from "../../services/session.api";
import { isClientError } from "../../lib/sessionErrors";

export function useSessionPlanDayQuery(
  memberId: string,
  week: number,
  day: number,
  enabled = true,
) {
  return useQuery({
    queryKey: SESSION_KEYS.planDay(memberId, week, day),
    queryFn: () => getSessionPlanDay(memberId, week, day),
    enabled,
    placeholderData: keepPreviousData,
    retry: (failureCount, error) => !isClientError(error) && failureCount < 1,
  });
}
