import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { PaginatedParams } from "@shared/types/pagination.types";
import { getRiskFlagsPaginated } from "../services/riskFlags.api";
import { RISK_FLAGS_KEYS } from "../constants";

export function useRiskFlagsQuery(params: PaginatedParams) {
  return useQuery({
    queryKey: RISK_FLAGS_KEYS.list(params),
    queryFn: () => getRiskFlagsPaginated(params),
    placeholderData: keepPreviousData,
  });
}
