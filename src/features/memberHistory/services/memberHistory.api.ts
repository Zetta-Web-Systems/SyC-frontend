import { api } from "@shared/api/api";
import type { MemberRiskFlag } from "@features/clinicalProfiles";
import type { WeightHistoricalPoint } from "../types";

export async function getMemberRiskFlagsHistorical(memberId: string) {
  const { data } = await api.get<MemberRiskFlag[]>(
    `/members/${memberId}/risk-flags-historical`,
  );
  return data;
}

export async function getMemberWeightHistorical(memberId: string) {
  const { data } = await api.get<WeightHistoricalPoint[]>(
    `/members/${memberId}/weight-historical`,
  );
  return data;
}
