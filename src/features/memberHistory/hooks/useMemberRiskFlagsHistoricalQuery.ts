import { useQuery } from "@tanstack/react-query";
import { MEMBER_HISTORY_KEYS } from "../constants";
import { getMemberRiskFlagsHistorical } from "../services/memberHistory.api";

export function useMemberRiskFlagsHistoricalQuery(
  memberId: string | undefined,
) {
  return useQuery({
    queryKey: MEMBER_HISTORY_KEYS.painHistorical(memberId ?? ""),
    queryFn: () => getMemberRiskFlagsHistorical(memberId as string),
    enabled: !!memberId,
  });
}
