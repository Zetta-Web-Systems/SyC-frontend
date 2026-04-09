import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { PaginatedParams } from "@shared/types/pagination.types";
import { getMembersPaginated } from "../services/members.api";
import { MEMBERS_KEYS } from "../constants";

export function useMembersQuery(params: PaginatedParams) {
  return useQuery({
    queryKey: MEMBERS_KEYS.list(params),
    queryFn: () => getMembersPaginated(params),
    placeholderData: keepPreviousData,
  });
}
