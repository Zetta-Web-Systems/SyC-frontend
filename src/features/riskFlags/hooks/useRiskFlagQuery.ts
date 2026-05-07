import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginatedResponse } from "@shared/types/pagination.types";
import { getRiskFlagById } from "../services/riskFlags.api";
import { RISK_FLAGS_KEYS } from "../constants";
import type { RiskFlag } from "../types";

export function useRiskFlagQuery(id: string | undefined) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: RISK_FLAGS_KEYS.detail(id ?? ""),
    queryFn: () => getRiskFlagById(id as string),
    enabled: !!id,
    initialData: () => {
      if (!id) return undefined;
      const lists = queryClient.getQueriesData<PaginatedResponse<RiskFlag>>({
        queryKey: RISK_FLAGS_KEYS.all,
      });
      for (const [, page] of lists) {
        const cached = page?.data.find((m) => m.id === id);
        if (cached) return cached;
      }
      return undefined;
    },
  });
}
