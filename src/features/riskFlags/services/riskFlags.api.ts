import { api } from "@shared/api/api";
import type {
  PaginatedParams,
  PaginatedResponse,
} from "@shared/types/pagination.types";
import { buildPaginatedParams } from "@shared/utils/pagination.utils";
import type { RiskFlag, RegisterRiskFlag, UpdateRiskFlag } from "../types";

export async function getRiskFlagsPaginated(params: PaginatedParams) {
  const { data } = await api.get<PaginatedResponse<RiskFlag>>(
    "/risk-flags/list/paginated",
    { params: buildPaginatedParams(params) },
  );
  return data;
}

export async function getRiskFlagById(id: string) {
  const { data } = await api.get<RiskFlag>(`/risk-flags/${id}`);
  return data;
}

export async function registerRiskFlag(dto: RegisterRiskFlag) {
  const { data } = await api.post<RiskFlag>("/risk-flags/register", dto);
  return data;
}

export async function updateRiskFlag(id: string, dto: UpdateRiskFlag) {
  const { data } = await api.patch<RiskFlag>(`/risk-flags/${id}`, dto);
  return data;
}

export async function deleteRiskFlag(id: string) {
  await api.delete(`/risk-flags/${id}`);
}

export async function restoreRiskFlag(id: string) {
  await api.patch(`/risk-flags/restore/${id}`);
}
