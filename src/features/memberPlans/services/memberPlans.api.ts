import { api } from "@shared/api/api";
import type {
  PaginatedParams,
  PaginatedResponse,
} from "@shared/types/pagination.types";
import { buildPaginatedParams } from "@shared/utils/pagination.utils";
import type {
  Fee,
  FeePaymentResult,
  MemberPlanHistory,
  MembershipHistoryItem,
  RegisterMembershipDto,
  RegisterPaymentDto,
} from "../types";

export async function getFeesPaginated(params: PaginatedParams) {
  const { data } = await api.get<PaginatedResponse<Fee>>(
    "/member-plan/fee/list/paginated",
    { params: buildPaginatedParams(params) },
  );
  return data;
}

export async function registerPayment(dto: RegisterPaymentDto) {
  const { data } = await api.post<FeePaymentResult>(
    "/member-plan/fee/payment/register",
    dto,
  );
  return data;
}

export async function registerMembership(dto: RegisterMembershipDto) {
  const { data } = await api.post<MemberPlanHistory>(
    "/member-plan/register",
    dto,
  );
  return data;
}

export async function getMembershipHistory(memberId: string) {
  const { data } = await api.get<MembershipHistoryItem[]>(
    `/member-plan/list/${memberId}`,
  );
  return data;
}
