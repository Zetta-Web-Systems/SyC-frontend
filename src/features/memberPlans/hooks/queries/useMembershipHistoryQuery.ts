import { useQuery } from "@tanstack/react-query";
import { getMembershipHistory } from "../../services/memberPlans.api";
import { MEMBER_PLAN_KEYS } from "../../constants";

export function useMembershipHistoryQuery(memberId: string, enabled = true) {
  return useQuery({
    queryKey: MEMBER_PLAN_KEYS.history(memberId),
    queryFn: () => getMembershipHistory(memberId),
    enabled: enabled && !!memberId,
  });
}
