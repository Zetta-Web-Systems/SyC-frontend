import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { PaginatedParams } from "@shared/types/pagination.types";
import { getFeesPaginated } from "../../services/memberPlans.api";
import { MEMBER_PLAN_KEYS } from "../../constants";

export function useFeesQuery(params: PaginatedParams) {
  return useQuery({
    queryKey: MEMBER_PLAN_KEYS.feeList(params),
    queryFn: () => getFeesPaginated(params),
    placeholderData: keepPreviousData,
  });
}
