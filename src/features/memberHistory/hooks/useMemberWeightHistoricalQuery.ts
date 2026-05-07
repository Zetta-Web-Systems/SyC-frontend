import { useQuery } from "@tanstack/react-query";
import { MEMBER_HISTORY_KEYS } from "../constants";
import { getMemberWeightHistorical } from "../services/memberHistory.api";

export function useMemberWeightHistoricalQuery(memberId: string | undefined) {
  return useQuery({
    queryKey: MEMBER_HISTORY_KEYS.weightHistorical(memberId ?? ""),
    queryFn: () => getMemberWeightHistorical(memberId as string),
    enabled: !!memberId,
  });
}
