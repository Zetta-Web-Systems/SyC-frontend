import { useQuery } from "@tanstack/react-query";
import { getRiskFlagById } from "../services/riskFlags.api";
import { RISK_FLAGS_KEYS } from "../constants";

export function useRiskFlagQuery(id: string | undefined) {
  return useQuery({
    queryKey: RISK_FLAGS_KEYS.detail(id ?? ""),
    queryFn: () => getRiskFlagById(id as string),
    enabled: !!id,
  });
}
